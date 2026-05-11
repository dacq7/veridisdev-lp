import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resend } from '@/lib/resend';
import { getContactRatelimit } from '@/lib/upstash';

// ── Schema ────────────────────────────────────────────────────────────────────

const ContactSchema = z.object({
  name:        z.string().trim().min(2).max(100),
  email:       z.string().trim().email().max(254),
  country:     z.string().trim().min(1).max(100),
  projectType: z.string().trim().min(1).max(100),
  description: z.string().trim().min(10).max(2000),
  contactTime: z.string().trim().max(100).optional(),
  timeline:    z.string().trim().max(100).optional(),
  budget:      z.string().trim().max(100).optional(),
  source:      z.string().trim().max(100).optional(),
}).strict();

type ContactBody = z.infer<typeof ContactSchema>;

// ── CSRF helper ───────────────────────────────────────────────────────────────

function getIncomingOrigin(req: NextRequest): string | null {
  const origin = req.headers.get('origin');
  if (origin) return origin;

  const referer = req.headers.get('referer');
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      return null;
    }
  }

  return null;
}

function isAllowedOrigin(req: NextRequest): boolean {
  const incoming = getIncomingOrigin(req);
  if (!incoming) return false;

  // Same-host check — handles production, Vercel preview URLs, and localhost
  const host = req.headers.get('host');
  if (host) {
    const scheme = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    if (incoming === `${scheme}://${host}`) return true;
  }

  // Explicit production URL as fallback
  if (process.env.NEXT_PUBLIC_SITE_URL && incoming === process.env.NEXT_PUBLIC_SITE_URL) {
    return true;
  }

  return false;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildHtml(body: ContactBody): string {
  const cell = 'padding:8px 0;font-family:sans-serif;font-size:14px;';
  const labelStyle = `${cell}color:#4A6B58;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;width:160px;vertical-align:top;padding-right:16px;`;
  const valueStyle = `${cell}color:#ffffff;`;
  const valueMutedStyle = `${cell}color:#4A6B58;`;

  function optRow(label: string, value?: string): string {
    const v = value?.trim() ?? '';
    return `
      <tr>
        <td style="${labelStyle}">${label}</td>
        <td style="${v ? valueStyle : valueMutedStyle}">${v ? esc(v) : 'Not specified'}</td>
      </tr>
    `;
  }

  return `
    <div style="background:#0F1A14;padding:32px;border-radius:8px;max-width:600px;margin:0 auto;border:1px solid rgba(26,138,90,0.2);">
      <h2 style="margin:0 0 24px;font-family:sans-serif;color:#1A8A5A;font-size:18px;font-weight:600;">
        New project inquiry — ${esc(body.projectType)} from ${esc(body.country)}
      </h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="${labelStyle}">Name</td>
          <td style="${valueStyle}">${esc(body.name)}</td>
        </tr>
        <tr>
          <td style="${labelStyle}">Email</td>
          <td style="${valueStyle}">
            <a href="mailto:${esc(body.email)}" style="color:#1A8A5A;">${esc(body.email)}</a>
          </td>
        </tr>
        <tr>
          <td style="${labelStyle}">Country / City</td>
          <td style="${valueStyle}">${esc(body.country)}</td>
        </tr>
        <tr>
          <td style="${labelStyle}">Project Type</td>
          <td style="${valueStyle}">${esc(body.projectType)}</td>
        </tr>
      </table>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid rgba(26,138,90,0.2);">
        <p style="margin:0 0 8px;font-family:sans-serif;color:#4A6B58;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;">
          Project description
        </p>
        <p style="margin:0;font-family:sans-serif;color:#ffffff;font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(body.description)}</p>
      </div>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid rgba(26,138,90,0.2);">
        <table style="width:100%;border-collapse:collapse;">
          ${optRow('Preferred contact time', body.contactTime)}
          ${optRow('Timeline', body.timeline)}
          ${optRow('Budget', body.budget)}
          ${optRow('How they found us', body.source)}
        </table>
      </div>
    </div>
  `;
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. CSRF — reject requests from foreign origins
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. Rate limit — 10 requests per IP per hour (sliding window)
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  const { success, reset, limit, remaining } = await getContactRatelimit().limit(ip);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return NextResponse.json(
      { error: 'Too many requests', retryAfter },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(reset),
        },
      }
    );
  }

  // 3. Parse body
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // 4. Zod validation — strict schema rejects undeclared fields
  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const body = parsed.data;
  const { name, email, country, projectType, description } = body;

  // 5. esc() runs inside buildHtml — existing sanitization preserved
  if (
    !name?.trim() ||
    !email?.trim() ||
    !country?.trim() ||
    !projectType?.trim() ||
    !description?.trim()
  ) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // 6. Resend send — existing implementation, unchanged
  const { error } = await resend.emails.send({
    from: 'Veridis Dev <team@veridisdev.com>',
    to: 'team@veridisdev.com',
    subject: `New project inquiry — ${projectType} from ${country}`,
    html: buildHtml(body),
  });

  if (error) {
    console.error('[contact] Resend error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
