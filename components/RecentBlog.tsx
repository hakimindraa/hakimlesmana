"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { generateBlogUrl } from "@/lib/utils";

const RecentBlog = () => {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/blogs?public=true")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setArticles(data.slice(0, 2));
        }
      })
      .catch(console.error);
  }, []);

  if (articles.length === 0) return null; // Sembunyikan jika belum ada blog

  return (
    <section className="py-20 md:py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              {language === "en" ? "Recent Thoughts" : "Catatan Terbaru"}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {language === "en" 
                ? "Sharing insights on design, code, and visual arts." 
                : "Berbagi wawasan seputar desain, pemrograman, dan seni visual."}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 md:mt-0"
          >
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 font-semibold text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors group"
            >
              {language === "en" ? "View all writings" : "Lihat semua tulisan"}
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Link href={`/blog/${generateBlogUrl(article.id, article.title)}`} className="group block h-full">
                <article className="h-full p-8 md:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-yellow-500/50 dark:hover:border-yellow-500/50 transition-colors duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
                      <span className="text-yellow-600 dark:text-yellow-500">{language === "en" ? article.category_en || article.category : article.category}</span>
                      <span>•</span>
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors leading-snug">
                      {language === "en" ? article.title_en || article.title : article.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-8">
                      {language === "en" ? article.excerpt_en || article.excerpt : article.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                    {language === "en" ? "Read article" : "Baca artikel"}
                    <ArrowRight className="w-4 h-4 transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentBlog;
