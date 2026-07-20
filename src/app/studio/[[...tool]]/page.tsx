// PROVISIONING: Sanity Studio embedded at /studio.
// Requires NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.
// Without env vars, renders a configuration reminder page instead.

export const dynamic = 'force-dynamic';

import { isSanityConfigured } from '@/lib/sanity';

export default function StudioPage() {
  if (!isSanityConfigured()) {
    return (
      <main style={{ fontFamily: 'monospace', padding: '2rem', color: '#0D5C3A', background: '#0A0A0A', minHeight: '100vh' }}>
        <h1 style={{ color: '#F5F5F5' }}>Sanity Studio — Not Configured</h1>
        <p>Set the following environment variables to activate the CMS:</p>
        <pre style={{ background: '#111', padding: '1rem', borderRadius: '6px', color: '#1A8A5A' }}>
{`NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=your-read-token (optional, for drafts)`}
        </pre>
        <p style={{ color: '#6B7280' }}>See .env.example for details.</p>
      </main>
    );
  }

  // Dynamic import to avoid SSR issues with Sanity Studio
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const StudioClient = require('./StudioClient').default;
  return <StudioClient />;
}
