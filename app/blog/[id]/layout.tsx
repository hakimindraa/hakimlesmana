import { Metadata, ResolvingMetadata } from "next";
import { getDb } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  try {
    const sql = getDb();
    const blogs = await sql`SELECT * FROM blogs WHERE id = ${id}`;
    const blog = blogs[0];

    if (!blog) {
      return {
        title: "Blog Not Found | Hakim Lesmana",
      };
    }

    const title = blog.title;
    // Generate description from excerpt or content
    const description = blog.excerpt || 
      (blog.content ? blog.content.substring(0, 150) + "..." : "Artikel blog dari Hakim Lesmana");

    // Prepare images array
    // If custom image_url exists, use it. Otherwise, use the dynamically generated image.
    const ogImageUrl = blog.image_url || `https://www.hakimlesmana.my.id/api/og/blog?id=${id}`;
    
    const ogImages = [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: title,
      }
    ];

    return {
      title: `${title} | Hakim Lesmana`,
      description: description,
      openGraph: {
        title: title,
        description: description,
        type: "article",
        publishedTime: blog.created_at,
        modifiedTime: blog.updated_at,
        authors: ["Hakim Lesmana"],
        images: ogImages,
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: ogImages,
      },
    };
  } catch (error) {
    return {
      title: "Blog | Hakim Lesmana",
    };
  }
}

export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Buat JSON-LD Data untuk SEO Blog Article
  let jsonLd = null;
  try {
    const sql = getDb();
    const blogs = await sql`SELECT * FROM blogs WHERE id = ${id}`;
    const blog = blogs[0];
    if (blog) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "description": blog.excerpt || (blog.content ? blog.content.substring(0, 150) : ""),
        "author": [{
            "@type": "Person",
            "name": "Hakim Lesmana",
            "url": "https://www.hakimlesmana.my.id"
        }],
        "datePublished": blog.created_at,
        "dateModified": blog.updated_at || blog.created_at,
        "image": [blog.image_url || `https://www.hakimlesmana.my.id/api/og/blog?id=${id}`],
      };
    }
  } catch (e) {
    console.error("Failed to generate JSON-LD", e);
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
