import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://hakimlesmana.my.id";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"], // Jangan biarkan Google mengindeks halaman admin
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
