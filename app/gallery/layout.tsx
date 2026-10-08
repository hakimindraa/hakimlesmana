import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Koleksi foto terbaik karya Hakim Lesmana, menampilkan karya fotografi landscape, street photography, dan berbagai momen lainnya.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
