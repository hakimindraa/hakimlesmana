import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://hakimlesmana.my.id"),
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
    url: "https://hakimlesmana.my.id",
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
    <html lang="id" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}