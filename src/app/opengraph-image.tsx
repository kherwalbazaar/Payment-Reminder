import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kherwal Bazaar Payment Reminder';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 72,
          fontWeight: 700,
          fontFamily: 'sans-serif',
        }}
      >
        Kherwal Bazaar
        <div style={{ fontSize: 36, marginLeft: 24 }}>Payment Reminder</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
