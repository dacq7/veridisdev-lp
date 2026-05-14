// PROVISIONING: Sanity required for post-specific OG. Without it, generates OG from slug.
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const WIDTH  = 1200;
const HEIGHT = 630;

const PROJECT_ID  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET     = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01';

interface SanityPostOg {
  titleEs?: string;
  titleEn?: string;
  isCaseStudy?: boolean;
}

async function fetchPostOgData(slug: string): Promise<SanityPostOg | null> {
  if (!PROJECT_ID) return null;
  try {
    const query = encodeURIComponent(
      `*[_type == "post" && (slug.es.current == "${slug}" || slug.en.current == "${slug}")][0]{
        "titleEs": title.es,
        "titleEn": title.en,
        isCaseStudy
      }`,
    );
    const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${query}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: SanityPostOg };
    return json.result ?? null;
  } catch {
    return null;
  }
}

function formatSlug(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  const post = await fetchPostOgData(slug);

  const locale = new URL(request.url).searchParams.get('locale') ?? 'en';
  const title =
    (locale === 'es' ? post?.titleEs : post?.titleEn) ??
    post?.titleEn ??
    post?.titleEs ??
    formatSlug(slug);
  const type = post?.isCaseStudy ? 'casestudy' : 'post';
  const typeLabel = type === 'casestudy' ? 'Case Study' : 'Blog';

  const titleFontSize =
    title.length > 65 ? 40 :
    title.length > 45 ? 48 : 56;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A0A0A',
          padding: '56px 80px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '5px',
            backgroundColor: '#0D5C3A',
          }}
        />

        {/* Top: Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: '#0D5C3A',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 800 }}>V</span>
          </div>
          <span style={{ color: '#F5F5F5', fontSize: '19px', fontWeight: 600, letterSpacing: '-0.3px' }}>
            Veridis Dev
          </span>
        </div>

        {/* Middle: Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '20px', height: '2px', backgroundColor: '#0D5C3A' }} />
            <span
              style={{
                color: '#34D399',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {typeLabel}
            </span>
          </div>
          <div
            style={{
              color: '#F5F5F5',
              fontSize: `${titleFontSize}px`,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom: Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '20px',
            borderTop: '1px solid rgba(13,92,58,0.3)',
          }}
        >
          <span style={{ color: '#4A6B58', fontSize: '15px' }}>veridisdev.com</span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(13,92,58,0.12)',
              border: '1px solid rgba(13,92,58,0.3)',
              borderRadius: '100px',
              padding: '5px 14px',
            }}
          >
            <span style={{ color: '#34D399', fontSize: '13px' }}>Medellín · Colombia</span>
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      headers: {
        'Cache-Control': 'public, immutable, no-transform, max-age=31536000',
        'Content-Type': 'image/png',
      },
    },
  );
}
