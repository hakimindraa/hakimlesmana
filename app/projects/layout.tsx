import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Kumpulan studi kasus dan proyek kreatif yang telah dikerjakan oleh Hakim Lesmana.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
