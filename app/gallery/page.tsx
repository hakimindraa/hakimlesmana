"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Camera,
} from "lucide-react";

interface Photo {
  id: number;
  title: string;
  src: string;
  category: string;
}

interface Category {
  id: number;
  name: string;
}

export default function FullGalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [photosRes, catsRes] = await Promise.all([
          fetch("/api/photos"),
          fetch("/api/categories"),
        ]);
        if (photosRes.ok) {
          const data = await photosRes.json();
          setPhotos(Array.isArray(data) ? data : []);
        }
        if (catsRes.ok) {
          const cats: Category[] = await catsRes.json();
          setCategoryList(["All", ...cats.map((c) => c.name)]);
        }
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPhotos = useMemo(
    () =>
      activeCategory === "All"
        ? photos
        : photos.filter((p) => p.category === activeCategory),
    [activeCategory, photos]
  );

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredPhotos.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        (selectedImage - 1 + filteredPhotos.length) % filteredPhotos.length
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* ──────────── Hero Header ──────────── */}
      <section className="relative bg-[#0a0a0a] text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/[0.015] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative container mx-auto px-6 pt-12 pb-20 md:pt-16 md:pb-28">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 text-sm hover:text-white transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-[0.2em] text-white/60 mb-6">
              <Camera className="w-3.5 h-3.5" />
              <span>Full Collection</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.1]">
              Gallery
            </h1>
            <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-lg">
              Browse through my complete collection of photography and
              videography work. Filter by category to find what inspires you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ──────────── Category Filter ──────────── */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            {categoryList.map((cat) => {
              const count =
                cat === "All"
                  ? photos.length
                  : photos.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSelectedImage(null);
                  }}
                  className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-[#111] text-white shadow-lg"
                      : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  {cat}
                  <span
                    className={`ml-2 text-[10px] ${
                      activeCategory === cat
                        ? "text-white/60"
                        : "text-gray-400"
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ──────────── Gallery Grid ──────────── */}
      <section className="container mx-auto px-6 py-12 md:py-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
              >
                {filteredPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                    className="relative group cursor-pointer overflow-hidden bg-gray-200 break-inside-avoid rounded-lg"
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <p className="text-white font-semibold text-base translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                        {photo.title}
                      </p>
                      <p className="text-white/60 text-xs uppercase tracking-widest mt-1 translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        {photo.category}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredPhotos.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">
                  No photos in this category yet.
                </p>
              </div>
            )}

            <div className="text-center mt-16">
              <p className="text-gray-400 text-xs uppercase tracking-widest">
                Showing {filteredPhotos.length} of {photos.length} photos
                {activeCategory !== "All" && (
                  <>
                    {" "}
                    in{" "}
                    <span className="text-gray-600 font-semibold">
                      {activeCategory}
                    </span>
                  </>
                )}
              </p>
            </div>
          </>
        )}
      </section>

      {/* ──────────── Lightbox ──────────── */}
      <AnimatePresence>
        {selectedImage !== null && filteredPhotos[selectedImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[210]"
            >
              <X size={28} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 md:left-10 text-white/50 hover:text-white transition-colors z-[210]"
            >
              <ChevronLeft size={44} />
            </button>

            <div
              className="relative w-full h-full max-w-5xl max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filteredPhotos[selectedImage].src}
                alt={filteredPhotos[selectedImage].title}
                fill
                className="object-contain"
              />
              <div className="absolute -bottom-14 left-0 right-0 text-center">
                <p className="text-white text-lg font-medium">
                  {filteredPhotos[selectedImage].title}
                </p>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
                  {filteredPhotos[selectedImage].category} ·{" "}
                  {selectedImage + 1} / {filteredPhotos.length}
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 md:right-10 text-white/50 hover:text-white transition-colors z-[210]"
            >
              <ChevronRight size={44} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
