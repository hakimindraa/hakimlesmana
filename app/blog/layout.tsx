import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artikel, cerita, dan wawasan terbaru seputar fotografi, teknologi, dan pengalaman dari Hakim Lesmana.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
