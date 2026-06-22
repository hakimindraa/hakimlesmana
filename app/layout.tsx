import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://hakimlesmana.my.id"),
  title: {
    default: "Hakim Photography | Photographer & Visual Storyteller",
    template: "%s | Hakim Photography",
  },
  description:
    "Portofolio fotografi profesional Hakim. Temukan karya visual dan cerita terbaik dari lensa saya.",
  openGraph: {
    title: "Hakim Photography | Photographer & Visual Storyteller",
    description:
      "Portofolio fotografi profesional Hakim. Temukan karya visual dan cerita terbaik dari lensa saya.",
    url: "https://hakimlesmana.my.id",
    siteName: "Hakim Photography",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakim Photography | Photographer & Visual Storyteller",
    description: "Portofolio fotografi profesional Hakim.",
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
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
