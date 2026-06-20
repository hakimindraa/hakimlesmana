"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Photo {
  id: number;
  title: string;
  src: string;
  category: string;
  is_featured: boolean;
  featured_description: string;
}

const gridClasses = [
  "md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-auto",
  "md:col-span-1 md:row-span-1 aspect-square md:aspect-auto",
  "md:col-span-1 md:row-span-1 aspect-[4/3] md:aspect-auto",
];

const FeaturedWorks = () => {
  const [featured, setFeatured] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/photos");
        if (res.ok) {
          const photos: Photo[] = await res.json();
          setFeatured(photos.filter((p) => p.is_featured).slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch featured:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Hide section if no featured works
  if (!loading && featured.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-secondary mb-2 font-medium">Selected Portfolios</h2>
            <h3 className="text-3xl font-bold tracking-tight text-primary">Featured Works</h3>
          </div>
          <a href="#gallery" className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-all">
            View All
          </a>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="columns-2 gap-2 space-y-2 md:columns-1 md:space-y-0 md:grid md:grid-cols-3 md:grid-rows-2 md:gap-4 h-auto md:h-[550px]">
            {featured.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`break-inside-avoid w-full relative overflow-hidden group rounded-sm shadow-sm md:h-full ${gridClasses[index] || ""}`}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 33vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/30 md:bg-black/10 md:group-hover:bg-black/40 transition-colors duration-500" />

                <div className="absolute bottom-6 left-6 text-white translate-y-0 opacity-100 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500">
                  <p className="text-[9px] uppercase tracking-[0.2em] mb-1 opacity-90 font-medium">{item.category}</p>
                  <h4 className="text-lg font-bold tracking-tight">{item.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedWorks;
