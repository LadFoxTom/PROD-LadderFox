import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'HireKit — The Hiring Platform That Replaces 5 Tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function HireKitIcon({ size: s = 36 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="white"
      width={s}
      height={s}
    >
      <path d="M120,80A40,40,0,1,1,80,40,40,40,0,0,1,120,80Zm56,40a40,40,0,1,0-40-40A40,40,0,0,0,176,120ZM80,136a40,40,0,1,0,40,40A40,40,0,0,0,80,136Zm128,32H184V144a8,8,0,0,0-16,0v24H144a8,8,0,0,0,0,16h24v24a8,8,0,0,0,16,0V184h24a8,8,0,0,0,0-16Z" />
    </svg>
  );
}

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#FAFBFC',
          padding: '60px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background blobs matching the landing page */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
            background: '#E0E7FF',
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            background: '#FCE7F3',
            opacity: 0.5,
          }}
        />

        {/* Logo — same as landing page header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: '#4F46E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HireKitIcon size={32} />
          </div>
          <span style={{ fontSize: 34, fontWeight: 800, color: '#4F46E5', letterSpacing: -0.5 }}>
            HireKit
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: '#1E293B',
            lineHeight: 1.1,
            letterSpacing: -2,
            marginBottom: 20,
            maxWidth: 900,
          }}
        >
          The Hiring Platform That{' '}
          <span style={{ color: '#4F46E5' }}>Replaces 5 Tools</span>
        </div>

        {/* Subheading */}
        <div
          style={{
            fontSize: 24,
            color: '#64748B',
            lineHeight: 1.5,
            maxWidth: 750,
            marginBottom: 44,
          }}
        >
          ATS pipeline, AI scoring, career pages, interview scheduling, email templates, and more. One platform, zero complexity.
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['ATS Pipeline', 'AI Scoring', 'Career Pages', 'Widgets', 'Scheduling', 'Webhooks'].map(
            (label) => (
              <div
                key={label}
                style={{
                  padding: '10px 22px',
                  borderRadius: 100,
                  background: '#EEF2FF',
                  border: '1px solid #C7D2FE',
                  color: '#4F46E5',
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
            )
          )}
        </div>

        {/* Bottom-right badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 45,
            right: 80,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 18px',
            borderRadius: 100,
            background: '#4F46E5',
            color: 'white',
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          Free during early access
        </div>
      </div>
    ),
    { ...size }
  );
}
