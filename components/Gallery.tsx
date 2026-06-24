"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

const PREVIEW_COUNT = 10;

interface Photo {
  id: number;
  title: string;
  title_en?: string;
  src: string;
  category: string;
}

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch("/api/photos");
        if (res.ok) {
          const data = await res.json();
          setPhotos(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch photos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  const previewPhotos = photos.slice(0, PREVIEW_COUNT);
  const totalPhotos = photos.length;
  const totalCategories = new Set(photos.map((p) => p.category)).size;

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % previewPhotos.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        (selectedImage - 1 + previewPhotos.length) % previewPhotos.length
      );
    }
  };

  // Don't render section if no photos
  if (!loading && photos.length === 0) return null;

  return (
    <section id="gallery" className="relative py-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary mb-3">
            {language === "en" ? "Portfolio" : "Portofolio"}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 dark:text-white">
            {language === "en" ? "Selected Works" : "Karya Terpilih"}
          </h2>
          <p className="text-secondary max-w-md mx-auto text-sm">
            {language === "en"
              ? "A curated selection of my recent photography and videography projects."
              : "Pilihan kurasi dari proyek fotografi dan videografi terbaru saya."}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-gray-300 dark:border-gray-700 border-t-gray-800 dark:border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ── Mosaic Grid ── */}
            <div className="mosaic-grid">
              {previewPhotos.map((photo, index) => {
                const heights = [
                  "h-[340px]",
                  "h-[220px]",
                  "h-[260px]",
                  "h-[200px]",
                  "h-[280px]",
                  "h-[200px]",
                  "h-[320px]",
                  "h-[240px]",
                  "h-[200px]",
                  "h-[260px]",
                ];
                return (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.04 }}
                    className={`mosaic-item group cursor-pointer bg-gray-200 dark:bg-slate-900 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.8)] border border-gray-200 dark:border-slate-800 hover:-translate-y-2 transition-all duration-300 ${heights[index]}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-5">
                      <p className="text-white font-semibold text-xs md:text-base translate-y-3 group-hover:translate-y-0 transition-transform duration-300 line-clamp-1">
                        {language === "en" && photo.title_en ? photo.title_en : photo.title}
                      </p>
                      <p className="text-white/60 text-[9px] md:text-xs uppercase tracking-widest mt-0.5 md:mt-1 translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        {photo.category}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* View Full Gallery Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mt-14"
            >
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-3 px-10 py-4 bg-[#111] dark:bg-white text-white dark:text-black text-sm font-semibold uppercase tracking-widest rounded-full hover:bg-[#222] dark:hover:bg-gray-200 transition-all duration-300 hover:shadow-lg"
              >
                {language === "en" ? "View Full Gallery" : "Lihat Galeri Lengkap"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              {totalPhotos > 0 && (
                <p className="text-secondary text-xs mt-4 tracking-wide">
                  {language === "en"
                    ? `${totalPhotos}+ photos across ${totalCategories} categories`
                    : `${totalPhotos}+ foto di ${totalCategories} kategori`}
                </p>
              )}
            </motion.div>
          </>
        )}
      </div>

      {/* ──────────── Lightbox ──────────── */}
      <AnimatePresence>
        {selectedImage !== null && previewPhotos[selectedImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110]"
            >
              <X size={28} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 md:left-10 text-white/50 hover:text-white transition-colors z-[110]"
            >
              <ChevronLeft size={44} />
            </button>

            <div
              className="relative w-full h-full max-w-5xl max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={previewPhotos[selectedImage].src}
                alt={previewPhotos[selectedImage].title}
                fill
                className="object-contain"
              />
              <div className="absolute -bottom-12 left-0 right-0 text-center">
                <p className="text-white text-lg font-medium">
                  {language === "en" && previewPhotos[selectedImage].title_en
                    ? previewPhotos[selectedImage].title_en
                    : previewPhotos[selectedImage].title}
                </p>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
                  {previewPhotos[selectedImage].category}
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 md:right-10 text-white/50 hover:text-white transition-colors z-[110]"
            >
              <ChevronRight size={44} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
