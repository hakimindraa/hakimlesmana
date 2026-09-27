"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function BlogPage() {
  const { language } = useLanguage();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/blogs?public=true")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setArticles(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-300 font-sans selection:bg-yellow-500/30 selection:text-yellow-200">
      {/* Background Noise */}
      <div 
        className="fixed inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative max-w-3xl mx-auto px-6 py-24 md:py-32 z-10">
        {/* Header / Nav */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20"
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-slate-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {language === "en" ? "Back to Home" : "Kembali ke Beranda"}
          </Link>
        </motion.nav>

        {/* Title Section */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="mb-24"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            {language === "en" ? "Writings & Thoughts." : "Tulisan & Pemikiran."}
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl">
            {language === "en" 
              ? "A collection of notes on design, development, visual arts, and everything in between. Text only, no distractions." 
              : "Kumpulan catatan tentang desain, pemrograman, seni visual, dan hal-hal di antaranya. Hanya teks, tanpa distraksi."}
          </p>
          <div className="w-12 h-1 bg-yellow-500 mt-10 rounded-full" />
        </motion.header>

        {/* Articles List */}
        <div className="flex flex-col">
          {articles.map((article, index) => (
            <motion.article 
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: "easeOut" }}
              className="group relative py-10 md:py-14 border-t border-white/10"
              onMouseEnter={() => setHoveredId(article.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono tracking-wider text-slate-500 uppercase mb-4">
                <span className="text-yellow-600/80 group-hover:text-yellow-500 transition-colors">
                  {language === "en" ? article.category_en || article.category : article.category}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(article.created_at).toLocaleDateString()}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {article.read_time}
                </span>
              </div>

              {/* Title */}
              <Link href={`/blog/${article.id}`} className="block">
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 leading-snug group-hover:text-yellow-100 transition-colors">
                  {language === "en" ? article.title_en || article.title : article.title}
                </h2>
              </Link>

              {/* Excerpt */}
              <p className="text-slate-400 leading-relaxed md:text-lg mb-6 max-w-2xl">
                {language === "en" ? article.excerpt_en || article.excerpt : article.excerpt}
              </p>

              {/* Read More Link */}
              <Link 
                href={`/blog/${article.id}`}
                className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-slate-300 group-hover:text-yellow-500 transition-colors"
              >
                {language === "en" ? "Read Article" : "Baca Artikel"}
                <span className="transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
                  →
                </span>
              </Link>
            </motion.article>
          ))}
          {articles.length === 0 && (
            <div className="py-10 text-slate-500">
              {language === "en" ? "No articles published yet." : "Belum ada tulisan yang dipublikasikan."}
            </div>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 pt-10 border-t border-white/10 text-center text-sm text-slate-600 font-mono"
        >
          {language === "en" ? "End of the list." : "Akhir dari daftar."}
        </motion.div>
      </main>
    </div>
  );
}
