"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useParams } from "next/navigation";

export default function ArticlePage() {
  const { language } = useLanguage();
  const params = useParams();
  const articleId = params?.id as string;
  
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs/${articleId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setArticle(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [articleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4 font-mono">404 - Article Not Found</h1>
        <Link href="/blog" className="text-yellow-500 hover:underline">Return to Writings</Link>
      </div>
    );
  }

  // Pisahkan konten berdasarkan baris baru untuk membuat paragraf
  const contentStr = language === "en" ? (article.content_en || article.content) : article.content;
  const paragraphs = contentStr.split('\n\n').filter((p: string) => p.trim() !== '');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-300 font-serif selection:bg-yellow-500/30 selection:text-yellow-200 pb-32">
      {/* Background Noise */}
      <div 
        className="fixed inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative max-w-2xl mx-auto px-6 pt-24 md:pt-32 z-10">
        <motion.nav 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 font-sans"
        >
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-slate-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {language === "en" ? "Back to Writings" : "Kembali ke Tulisan"}
          </Link>
        </motion.nav>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono tracking-wider text-slate-500 uppercase mb-6">
            <span className="text-yellow-600/80">{language === "en" ? article.category_en || article.category : article.category}</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{new Date(article.created_at).toLocaleDateString()}</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{article.read_time}</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] mb-10 font-sans">
            {language === "en" ? article.title_en || article.title : article.title}
          </h1>
          <div className="w-full h-px bg-white/10" />
        </motion.header>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="prose prose-invert prose-lg md:prose-xl prose-slate max-w-none"
        >
          {paragraphs.map((paragraph: string, index: number) => (
            <p key={index} className="mb-8 text-slate-300 leading-relaxed font-serif tracking-wide opacity-90 text-[17px] md:text-[20px]">
              {index === 0 && paragraph.length > 0 ? (
                <span className="float-left text-6xl md:text-7xl font-bold text-white mr-4 mt-2 leading-[0.8] font-sans">
                  {paragraph.charAt(0)}
                </span>
              ) : null}
              {index === 0 && paragraph.length > 0 ? paragraph.slice(1) : paragraph}
            </p>
          ))}
        </motion.article>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 pt-10 border-t border-white/10 font-sans flex flex-col sm:flex-row gap-6 items-center justify-between text-sm text-slate-500"
        >
          <p>© {new Date().getFullYear()} Hakim Indra Lesmana</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-full">
            {language === "en" ? "Back to top ↑" : "Kembali ke atas ↑"}
          </button>
        </motion.div>
      </main>
    </div>
  );
}
