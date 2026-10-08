import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Profil, perjalanan karir, dan keahlian Hakim Lesmana sebagai Fotografer dan Creative Technologist.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
