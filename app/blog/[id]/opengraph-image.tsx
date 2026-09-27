import { ImageResponse } from 'next/og';
import { getDb } from '@/lib/db';

export const runtime = 'edge';

// Ukuran standar untuk gambar share di WhatsApp/Twitter dll (1200x630)
export const alt = 'Blog Hakim Lesmana';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let title = "Artikel Blog | Hakim Lesmana";
  let category = "Tulisan";

  try {
    const sql = getDb();
    const blogs = await sql`SELECT title, category FROM blogs WHERE id = ${id}`;
    if (blogs && blogs.length > 0) {
      title = blogs[0].title;
      category = blogs[0].category || "Tulisan";
    }
  } catch (e) {
    console.error("Gagal mengambil data untuk OG Image", e);
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Border / Frame Dalam */}
        <div
          style={{
            position: 'absolute',
            inset: '30px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '50px',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ color: '#eab308', fontSize: 26, letterSpacing: '0.15em', fontWeight: 'bold' }}>
              HAKIM LESMANA
            </span>
            <span style={{ color: '#64748b', fontSize: 24, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {category}
            </span>
          </div>

          {/* Judul Blog Utama */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              marginTop: '40px',
              marginBottom: '40px',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 60 ? 56 : 72, // Ukuran teks mengecil otomatis jika judulnya panjang
                color: 'white',
                fontWeight: '800',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {title}
            </h1>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', width: '100%', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
             <span style={{ color: '#94a3b8', fontSize: 24 }}>
                www.hakimlesmana.my.id
             </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
