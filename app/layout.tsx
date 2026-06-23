import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hakimlesmana.my.id"),
  title: {
    default: "Hakim Lesmana | Portofolio Fotografi",
    template: "%s | Hakim Lesmana",
  },
  description:
    "Kumpulan karya foto Hakim Lesmana — landscape, street photography, dan momen perjalanan yang terekam dari berbagai sudut.",
  openGraph: {
    title: "Hakim Lesmana | Portofolio Fotografi",
    description:
      "Kumpulan karya foto Hakim Lesmana — landscape, street photography, dan momen perjalanan yang terekam dari berbagai sudut.",
    url: "https://www.hakimlesmana.my.id",
    siteName: "Hakim Lesmana",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakim Lesmana | Portofolio Fotografi",
    description:
      "Karya foto Hakim Lesmana — landscape, street, dan perjalanan.",
  },
  alternates: {
    canonical: "https://www.hakimlesmana.my.id",
  },
  // Uncomment dan isi kode verifikasi dari Google Search Console nanti:
  // verification: {
  //   google: "KODE_VERIFIKASI_GOOGLE_ANDA",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Data JSON-LD untuk SEO Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hakim Lesmana",
    jobTitle: "Photographer",
    url: "https://www.hakimlesmana.my.id",
    image: "https://hakimlesmana.my.id/foto-profil.jpg", // <-- SESUAIKAN: ganti dengan URL foto profil/logo Anda nanti
    description: "Kumpulan karya foto Hakim Lesmana — landscape, street photography, dan momen perjalanan yang terekam dari berbagai sudut.",
    sameAs: [
      "https://www.instagram.com/hakimlesmna", // <-- SESUAIKAN: ganti dengan link Instagram Anda
      "https://www.linkedin.com/in/hakimindralesmana"         // <-- SESUAIKAN: ganti dengan link medsos lain (atau hapus baris ini jika tidak ada)
    ]
  };

  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}