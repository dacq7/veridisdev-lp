import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

// ── Types ─────────────────────────────────────────────────────────────────────

type ContactBody = {
  name: string;
  email: string;
  project: string;
  budget?: string;
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

function buildHtml(name: string, email: string, project: string, budget?: string): string {
  const cell = 'padding:8px 0;font-family:sans-serif;font-size:14px;';
  const labelStyle = `${cell}color:#4A6B58;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;width:130px;vertical-align:top;`;
  const valueStyle = `${cell}color:#ffffff;`;

  return `
    <div style="background:#0F1A14;padding:32px;border-radius:8px;max-width:600px;margin:0 auto;border:1px solid rgba(26,138,90,0.2);">
      <h2 style="margin:0 0 24px;font-family:sans-serif;color:#1A8A5A;font-size:18px;font-weight:600;">
        New project inquiry
      </h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="${labelStyle}">Name</td>
          <td style="${valueStyle}">${esc(name)}</td>
        </tr>
        <tr>
          <td style="${labelStyle}">Email</td>
          <td style="${valueStyle}">
            <a href="mailto:${esc(email)}" style="color:#1A8A5A;">${esc(email)}</a>
          </td>
        </tr>
        ${budget ? `
        <tr>
          <td style="${labelStyle}">Budget</td>
          <td style="${valueStyle}">${esc(budget)}</td>
        </tr>
        ` : ''}
      </table>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid rgba(26,138,90,0.2);">
        <p style="margin:0 0 8px;font-family:sans-serif;color:#4A6B58;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;">
          Project description
        </p>
        <p style="margin:0;font-family:sans-serif;color:#ffffff;font-size:14px;line-height:1.6;white-space:pre-wrap;">
          ${esc(project)}
        </p>
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

  const { name, email, project, budget } = body;

  if (!name?.trim() || !email?.trim() || !project?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'team@veridisdev.com',
    subject: `New project inquiry from ${name}`,
    html: buildHtml(name, email, project, budget),
  });

  if (error) {
    console.error('[contact] Resend error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
