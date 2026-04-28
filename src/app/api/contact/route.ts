import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

// ── Types ─────────────────────────────────────────────────────────────────────

type ContactBody = {
  name: string;
  email: string;
  country: string;
  projectType: string;
  description: string;
  contactTime?: string;
  timeline?: string;
  budget?: string;
  source?: string;
};

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
  let body: ContactBody;

  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { name, email, country, projectType, description } = body;

  if (
    !name?.trim() ||
    !email?.trim() ||
    !country?.trim() ||
    !projectType?.trim() ||
    !description?.trim()
  ) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
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
