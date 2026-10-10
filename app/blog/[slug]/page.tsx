"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { Clock, Share2, ThumbsUp, Bookmark, ChevronRight, Instagram, Linkedin, Github } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useParams } from "next/navigation";
import { generateBlogUrl } from "@/lib/utils";

export default function ArticlePage() {
  const { language } = useLanguage();
  const params = useParams();
  const slugParam = params?.slug as string;
  const articleId = slugParam ? slugParam.split('-')[0] : "";
  
  const [article, setArticle] = useState<any>(null);
  const [latestArticles, setLatestArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Feature states
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);

  // Reading progress bar animation
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Fetch Single Article
    fetch(`/api/blogs/${articleId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setArticle(data);
          setLikes(data.likes_count || 0);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Fetch Sidebar Articles
    fetch("/api/blogs?public=true")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Exclude current article and take top 5
          setLatestArticles(data.filter((a: any) => a.id.toString() !== articleId).slice(0, 5));
        }
      })
      .catch(console.error);
  }, [articleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4 font-mono">404 - Article Not Found</h1>
        <Link href="/blog" className="text-yellow-500 hover:underline">Return to Writings</Link>
      </div>
    );
  }

  const contentStr = language === "en" ? (article.content_en || article.content) : article.content;
  const categoryStr = language === "en" ? (article.category_en || article.category) : article.category;
  const titleStr = language === "en" ? (article.title_en || article.title) : article.title;

  const handleLike = async () => {
    if (isLiked) return;
    setIsLiked(true);
    setLikes(prev => prev + 1); // Optimistic UI update
    
    try {
      const res = await fetch(`/api/blogs/${articleId}/like`, { method: "POST" });
      const data = await res.json();
      if (data.likes_count !== undefined) {
        setLikes(data.likes_count);
      }
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: titleStr,
      text: `Check out this article: ${titleStr}`,
      url: window.location.href,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-700 dark:text-slate-300 font-sans selection:bg-yellow-500/30 selection:text-yellow-200 pb-32">
      
      {/* Background Noise */}
      <div 
        className="fixed inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-yellow-500 origin-left z-50"
        style={{ scaleX }}
      />

      <main className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-24 md:pt-32 z-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs font-mono uppercase tracking-wider text-slate-500 mb-6">
          <Link href="/" className="hover:text-yellow-500 transition-colors">Portofolio</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-yellow-500 transition-colors">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-yellow-600 font-bold">{categoryStr}</span>
        </nav>

        {/* Article Header (Title) */}
        <header className="mb-6 lg:pr-32">
          <h1 className="text-3xl md:text-5xl lg:text-[54px] font-bold tracking-tight text-black dark:text-white leading-[1.15] mb-6 font-sans">
            {titleStr}
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-y border-black/10 dark:border-white/10 py-4">
            
            {/* Author & Meta */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-black/10 dark:border-white/10 flex items-center justify-center">
                 {/* Avatar Placeholder */}
                 <span className="text-slate-500 dark:text-slate-400 font-sans font-bold text-lg">HL</span>
              </div>
              <div>
                <div className="font-bold text-black dark:text-white text-sm">Hakim Indra Lesmana</div>
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-slate-500 mt-1">
                  <span>{new Date(article.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.read_time}</span>
                </div>
              </div>
            </div>

            {/* Share & Actions */}
            <div className="flex items-center gap-3 relative">
              <motion.button 
                whileTap={{ scale: 0.85 }}
                onClick={handleLike}
                className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full transition-colors border ${isLiked ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border-black/5 dark:border-white/5'}`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-yellow-500' : ''}`} /> 
                <span className="hidden sm:inline">{likes > 0 ? `${likes} Likes` : 'Like'}</span>
                <span className="inline sm:hidden">{likes > 0 ? likes : ''}</span>
              </motion.button>
              
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-3 py-2 rounded-full transition-colors border border-black/5 dark:border-white/5 relative"
              >
                <Share2 className="w-3.5 h-3.5" /> 
                <span className="hidden sm:inline">{isShared ? (language === 'en' ? 'Copied!' : 'Tersalin!') : 'Share'}</span>
              </button>
              
              <button className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-3 py-2 rounded-full transition-colors border border-black/5 dark:border-white/5">
                <Bookmark className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {article.image_url && (
          <div className="relative w-full aspect-video md:aspect-[21/9] mb-12 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-black">
            <img src={article.image_url} alt={titleStr} className="w-full h-full object-cover" />
            <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/60 backdrop-blur-sm text-black dark:text-white text-[10px] font-mono px-3 py-1.5 rounded flex items-center gap-2 border border-black/10 dark:border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span> {language === "en" ? "Cover Image" : "Gambar Utama"}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* MAIN CONTENT COLUMN */}
          <div className="lg:w-2/3">
            <article 
              className="prose dark:prose-invert prose-lg max-w-none 
              prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-[1.8] prose-p:font-sans prose-p:tracking-wide prose-p:text-[1.1rem]
              prose-a:text-yellow-600 dark:prose-a:text-yellow-500 hover:prose-a:text-yellow-500 dark:hover:prose-a:text-yellow-400 prose-a:transition-colors
              prose-headings:font-sans prose-headings:text-black dark:prose-headings:text-white prose-strong:text-black dark:prose-strong:text-white
              prose-blockquote:border-l-yellow-500 prose-blockquote:bg-black/5 dark:prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:font-sans prose-blockquote:italic
              prose-img:rounded-xl prose-img:border prose-img:border-black/10 dark:prose-img:border-white/10
              [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:text-7xl [&>p:first-child]:first-letter:font-bold [&>p:first-child]:first-letter:text-yellow-500 [&>p:first-child]:first-letter:mr-4 [&>p:first-child]:first-letter:mt-1 [&>p:first-child]:first-letter:leading-[0.8] [&>p:first-child]:first-letter:font-sans"
            >
              <ReactMarkdown>{contentStr}</ReactMarkdown>
            </article>

            {/* Bottom Actions */}
            <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                 <span className="text-sm font-mono text-slate-500 uppercase">Tags:</span>
                 <span className="text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300">{categoryStr}</span>
               </div>
               <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm font-mono text-yellow-600 dark:text-yellow-500 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
                 {language === "en" ? "Back to top ↑" : "Kembali ke atas ↑"}
               </button>
            </div>
          </div>

          {/* RIGHT SIDEBAR COLUMN */}
          <aside className="lg:w-1/3">
            <div className="sticky top-24 flex flex-col gap-8">
              
              {/* Related/Latest News */}
              <div className="border border-black/10 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/5 p-6">
                <h3 className="text-lg font-bold text-black dark:text-white mb-6 uppercase tracking-wider font-sans border-b border-black/10 dark:border-white/10 pb-4 flex items-center justify-between">
                  {language === "en" ? "Latest News" : "Berita Terkini"}
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                </h3>
                
                <div className="flex flex-col gap-6">
                  {latestArticles.map((latest) => (
                    <Link href={`/blog/${generateBlogUrl(latest.id, latest.title)}`} key={latest.id} className="group flex gap-4">
                      {latest.image_url ? (
                        <div className="w-24 h-20 shrink-0 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-slate-900 relative">
                          <img src={latest.image_url} alt="thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      ) : (
                        <div className="w-24 h-20 shrink-0 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-gradient-to-tr from-slate-200 dark:from-slate-900 to-slate-100 dark:to-black flex items-center justify-center">
                          <span className="text-2xl font-sans text-slate-400 dark:text-slate-700 uppercase">{latest.title.substring(0,1)}</span>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <span className="text-[10px] font-mono text-yellow-600 block mb-1 uppercase font-bold tracking-widest">
                          {language === "en" ? latest.category_en || latest.category : latest.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors leading-snug line-clamp-3 font-sans">
                          {language === "en" ? latest.title_en || latest.title : latest.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* SOCIAL MEDIA HUB */}
              <div className="border border-black/10 dark:border-white/10 rounded-xl p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-black relative overflow-hidden mt-2">
                <h3 className="text-lg font-bold text-black dark:text-white mb-2 font-sans">
                  {language === "en" ? "Connect With Me" : "Mari Terhubung"}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                  {language === "en" ? "Follow my journey and let's grow our network together." : "Ikuti perjalanan karya saya dan mari bangun relasi bersama."}
                </p>
                <div className="flex flex-col gap-3">
                  <a href="https://www.instagram.com/hakimlesmna/" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-black/10 dark:border-white/10 hover:border-yellow-500 hover:bg-yellow-500/5 transition-all group bg-white dark:bg-black">
                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-500 group-hover:scale-110 transition-transform"/>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Instagram</span>
                    </div>
                  </a>
                  <a href="https://www.linkedin.com/in/hakimindralesmana" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-black/10 dark:border-white/10 hover:border-yellow-500 hover:bg-yellow-500/5 transition-all group bg-white dark:bg-black">
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform"/>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">LinkedIn</span>
                    </div>
                  </a>
                  <a href="https://github.com/hakimindraa" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-black/10 dark:border-white/10 hover:border-yellow-500 hover:bg-yellow-500/5 transition-all group bg-white dark:bg-black">
                    <div className="flex items-center gap-3">
                      <Github className="w-5 h-5 text-slate-800 dark:text-slate-200 group-hover:scale-110 transition-transform"/>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">GitHub</span>
                    </div>
                  </a>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
