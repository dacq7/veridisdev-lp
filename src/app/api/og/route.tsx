import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const WIDTH  = 1200;
const HEIGHT = 630;

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const title    = (searchParams.get('title')    ?? 'Veridis Dev').slice(0, 120);
  const subtitle = (searchParams.get('subtitle') ?? '').slice(0, 160);
  const type     = searchParams.get('type') ?? 'default';

  const typeLabel =
    type === 'casestudy' ? 'Case Study' :
    type === 'post'      ? 'Blog'       : null;

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
          {typeLabel && (
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
          )}
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
          {subtitle && (
            <div
              style={{
                color: '#6B7280',
                fontSize: '20px',
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </div>
          )}
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
