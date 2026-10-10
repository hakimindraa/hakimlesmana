"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, TrendingUp, Instagram, Linkedin, Github } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { generateBlogUrl } from "@/lib/utils";

export default function BlogPage() {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs?public=true")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setArticles(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex justify-center items-center"><div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const headline = articles[0];
  const popular = articles.slice(1, 6);
  const gridNews = articles.slice(6);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-700 dark:text-slate-300 font-sans selection:bg-yellow-500/30 selection:text-yellow-200">
      {/* Background Noise */}
      <div 
        className="fixed inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Trending Ticker */}
      <div className="border-b border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center gap-4 text-xs font-mono uppercase tracking-wider">
          <span className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 font-bold bg-yellow-500/10 px-3 py-1 rounded">
            <TrendingUp className="w-4 h-4" /> {language === "en" ? "Trending" : "Sorotan"}
          </span>
          <div className="flex-1 overflow-hidden whitespace-nowrap">
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: "-100%" }} 
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="inline-block text-slate-500 dark:text-slate-400"
            >
              {articles.slice(0,5).map(a => (
                <span key={a.id} className="mx-4 hover:text-black dark:hover:text-white transition-colors">
                  <Link href={`/blog/${generateBlogUrl(a.id, a.title)}`}>
                    {language === "en" ? a.title_en || a.title : a.title}
                  </Link>
                  <span className="mx-4 text-slate-300 dark:text-slate-700">•</span>
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 lg:px-8 py-10 z-10">
        
        {/* Title Section */}
        <div className="mb-12 flex justify-between items-end border-b border-black/10 dark:border-white/10 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-2 font-sans">
              {language === "en" ? "The Journal." : "Kabar Utama."}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">
              {language === "en" ? "Insights, tutorials, and tech stories." : "Wawasan, tutorial, dan cerita seputar teknologi."}
            </p>
          </div>
          <div className="hidden md:block text-xs font-mono text-slate-500 uppercase">
            {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="py-20 text-center text-slate-500">{language === "en" ? "No articles published yet." : "Belum ada tulisan."}</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* LEFT COLUMN: Headline & Grid */}
            <div className="lg:w-2/3 flex flex-col gap-10">
              
              {/* HEADLINE ARTICLE */}
              {headline && (
                <motion.article 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                  className="group relative flex flex-col"
                >
                  <Link href={`/blog/${generateBlogUrl(headline.id, headline.title)}`} className="block overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5 aspect-video mb-6 border border-black/10 dark:border-white/10 relative">
                    {headline.image_url ? (
                      <img src={headline.image_url} alt={headline.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-200 dark:from-slate-900 to-slate-100 dark:to-black">
                        <span className="text-5xl text-slate-400 dark:text-slate-800 font-sans opacity-50 uppercase">{headline.title.substring(0,2)}</span>
                      </div>
                    )}
                  </Link>
                  
                  <div className="flex items-center gap-3 text-xs font-mono uppercase text-slate-500 mb-4">
                    <span className="text-yellow-600 dark:text-yellow-500 font-bold tracking-widest">
                      {language === "en" ? headline.category_en || headline.category : headline.category}
                    </span>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {headline.read_time}</span>
                  </div>
                  
                  <Link href={`/blog/${generateBlogUrl(headline.id, headline.title)}`} className="block">
                    <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white mb-4 leading-tight group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors font-sans">
                      {language === "en" ? headline.title_en || headline.title : headline.title}
                    </h2>
                  </Link>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6 line-clamp-3">
                    {language === "en" ? headline.excerpt_en || headline.excerpt : headline.excerpt}
                  </p>
                </motion.article>
              )}

              {/* GRID OF RECENT ARTICLES */}
              {gridNews.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6 border-b border-black/10 dark:border-white/10 pb-2">
                    <div className="w-2 h-2 bg-yellow-500"></div>
                    <h3 className="text-lg font-bold text-black dark:text-white uppercase tracking-wider">{language === "en" ? "Recent News" : "Berita Terbaru"}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:gap-8">
                    {gridNews.map((article, idx) => (
                      <motion.article 
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="group flex flex-col"
                      >
                        <Link href={`/blog/${generateBlogUrl(article.id, article.title)}`} className="block overflow-hidden rounded-lg bg-slate-100 dark:bg-white/5 aspect-[16/9] mb-4 border border-black/5 dark:border-white/5 relative">
                          {article.image_url ? (
                            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-200 dark:from-slate-900 to-slate-100 dark:to-black">
                               <span className="text-3xl text-slate-400 dark:text-slate-800 font-sans uppercase">{article.title.substring(0,1)}</span>
                            </div>
                          )}
                        </Link>
                        <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-slate-500 mb-2">
                          <span className="text-yellow-600 font-bold">{language === "en" ? article.category_en || article.category : article.category}</span>
                          <span>• {new Date(article.created_at).toLocaleDateString()}</span>
                        </div>
                        <Link href={`/blog/${generateBlogUrl(article.id, article.title)}`}>
                          <h3 className="text-base md:text-xl font-bold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors font-sans line-clamp-3 mb-2">
                            {language === "en" ? article.title_en || article.title : article.title}
                          </h3>
                        </Link>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-500 line-clamp-2 md:line-clamp-3">{language === "en" ? article.excerpt_en || article.excerpt : article.excerpt}</p>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Sidebar */}
            <aside className="lg:w-1/3 flex flex-col gap-10">
              
              {/* TERPOPULER */}
              {popular.length > 0 && (
                <div className="bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none"></div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    {language === "en" ? "Most Popular" : "Terpopuler"}
                  </h3>
                  <div className="flex flex-col gap-6 relative z-10">
                    {popular.map((article, idx) => (
                      <Link href={`/blog/${generateBlogUrl(article.id, article.title)}`} key={article.id} className="group flex items-start gap-4">
                        <span className="text-4xl font-sans font-black text-slate-300 dark:text-slate-800 group-hover:text-yellow-500/30 transition-colors leading-none">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="text-base font-bold text-slate-700 dark:text-slate-300 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors leading-snug font-sans line-clamp-2 mb-1">
                            {language === "en" ? article.title_en || article.title : article.title}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                             <Clock className="w-3 h-3"/> {article.read_time}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* SOCIAL MEDIA HUB */}
              <div className="border border-black/10 dark:border-white/10 rounded-xl p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-black relative overflow-hidden mt-2">
                <h3 className="text-xl font-bold text-black dark:text-white mb-2 font-sans">
                  {language === "en" ? "Connect With Me" : "Mari Terhubung"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  {language === "en" ? "Follow my journey and let's grow our network together." : "Ikuti perjalanan karya saya dan mari bangun relasi bersama."}
                </p>
                <div className="flex flex-col gap-3">
                  <a href="https://www.instagram.com/hakimlesmna/" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-black/10 dark:border-white/10 hover:border-yellow-500 hover:bg-yellow-500/5 transition-all group bg-white dark:bg-black">
                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-500 group-hover:scale-110 transition-transform"/>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Instagram</span>
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-yellow-500">@hakimlesmna</span>
                  </a>
                  <a href="https://www.linkedin.com/in/hakimindralesmana" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-black/10 dark:border-white/10 hover:border-yellow-500 hover:bg-yellow-500/5 transition-all group bg-white dark:bg-black">
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform"/>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">LinkedIn</span>
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-yellow-500">Hakim Indra Lesmana</span>
                  </a>
                  <a href="https://github.com/hakimindraa" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-black/10 dark:border-white/10 hover:border-yellow-500 hover:bg-yellow-500/5 transition-all group bg-white dark:bg-black">
                    <div className="flex items-center gap-3">
                      <Github className="w-5 h-5 text-slate-800 dark:text-slate-200 group-hover:scale-110 transition-transform"/>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">GitHub</span>
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-yellow-500">hakimindraa</span>
                  </a>
                </div>
              </div>

            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
