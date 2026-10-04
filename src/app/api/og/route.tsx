import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'LocalConnect';
    const description = searchParams.get('description') || 'Find the best local professionals.';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1e293b',
              width: '100%',
              height: '100%',
              borderRadius: '20px',
              padding: '40px',
              border: '2px solid #334155',
            }}
          >
            <h1
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: '#f8fafc',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '30px',
                color: '#94a3b8',
                textAlign: 'center',
                maxWidth: '80%',
              }}
            >
              {description}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '40px',
              }}
            >
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#38bdf8',
                  backgroundColor: '#0284c720',
                  padding: '10px 20px',
                  borderRadius: '10px',
                }}
              >
                LocalConnect
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
