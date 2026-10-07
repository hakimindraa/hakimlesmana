import { NextResponse } from 'next/server';

export async function GET() {
  // GANTI TEKS DI BAWAH INI DENGAN TOKEN DAN ID ANDA
  // (Lebih baik lagi jika Anda menaruhnya di file .env.local)
  const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
  const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;

  if (!VERCEL_API_TOKEN || VERCEL_API_TOKEN.startsWith("PASTE")) {
    return NextResponse.json({ state: 'unconfigured' });
  }

  try {
    const res = await fetch(`https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&limit=1`, {
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      },
      next: { revalidate: 0 } // Jangan gunakan cache
    });

    if (!res.ok) {
      return NextResponse.json({ state: 'error', error: await res.text() });
    }

    const data = await res.json();
    if (data.deployments && data.deployments.length > 0) {
      const latest = data.deployments[0];
      return NextResponse.json({
        state: latest.state, // 'READY', 'ERROR', 'BUILDING', 'QUEUED'
        url: latest.url,
        created: latest.createdAt,
        commitMessage: latest.meta?.githubCommitMessage,
        commitRef: latest.meta?.githubCommitRef,
        commitAuthor: latest.meta?.githubCommitAuthorName
      });
    }

    return NextResponse.json({ state: 'none' });
  } catch (error) {
    return NextResponse.json({ state: 'error' });
  }
}
