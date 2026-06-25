"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Code, ExternalLink, Github } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

type TechProject = {
  id: number;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  tech_stack: string;
  tech_stack_en?: string;
  image_url: string;
  live_url: string;
  github_url: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<TechProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { language } = useLanguage();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/tech-projects");
        if (res.ok) setProjects(await res.json());
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => {
    const stack = (p.tech_stack || "").toLowerCase();
    const title = (p.title || "").toLowerCase();

    // 1. Cek apakah ini UI/UX (Dari tech stack ATAU dari Judul)
    const isUIUX = stack.includes("figma") || stack.includes("ui/ux") || stack.includes("adobe xd") || 
                   title.includes(" ui ") || title.includes("ui ") || title.includes(" ux ") || title.includes("ux");

    // 2. Cek apakah ini Desain Grafis (Punya tool desain, TAPI BUKAN UI/UX)
    const isDesign = !isUIUX && (stack.includes("canva") || stack.includes("illustrator") || 
                                 stack.includes("coreldraw") || stack.includes("photoshop") || 
                                 stack.includes("poster") || stack.includes("banner") || stack.includes("design"));

    // 3. Web App adalah sisanya (Yang bukan UI/UX dan bukan Desain)
    const isWeb = !isUIUX && !isDesign;

    if (activeTab === "web") return isWeb;
    if (activeTab === "uiux") return isUIUX;
    if (activeTab === "design") return isDesign;
    return true; // "all"
  });

  const tabs = [
    { id: "all", label_en: "All Works", label_id: "Semua Karya" },
    { id: "web", label_en: "Web Engineering", label_id: "Web App" },
    { id: "uiux", label_en: "UI/UX Design", label_id: "UI/UX Design" },
    { id: "design", label_en: "Visual & Branding", label_id: "Desain Grafis" },
  ];

  return (
    <main className="min-h-screen relative bg-white dark:bg-slate-950 transition-colors duration-500 selection:bg-black selection:text-white overflow-hidden">
      
      {/* Global Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.8] z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(100,116,139,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.04)_1px,transparent_1px)]"
        style={{ backgroundSize: '32px 32px' }}
      />
      <div className="hidden md:flex absolute inset-0 pointer-events-none z-0 flex-col justify-between">
        <div className="sticky top-0 w-full h-0 bg-gradient-to-b from-white dark:from-slate-950 to-transparent" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <section className="pt-40 pb-20 px-6">
          <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <h2 className="text-gray-400 font-bold tracking-[0.2em] text-xs uppercase mb-4 flex items-center gap-2">
              <Code className="w-4 h-4" /> Digital Engineering
            </h2>
            <h1 className="text-4xl md:text-6xl font-bold text-black tracking-tight mb-6 leading-tight">
              Web Development <br /> & UI/UX Projects
            </h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10">
              {language === "en" 
                ? "Building digital experiences that are not only visually beautiful, but also performant and intuitive."
                : "Membangun pengalaman digital yang tidak hanya terlihat indah secara visual, tetapi juga berfungsi dengan performa tinggi dan intuitif."}
            </p>
          </motion.div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <p className="text-xs uppercase tracking-widest text-gray-400 animate-pulse">Loading projects...</p>
            </div>
          ) : (
            <>
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-10 border-b border-gray-100 dark:border-slate-800 pb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    {language === "en" ? tab.label_en : tab.label_id}
                  </button>
                ))}
              </div>

              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((proj) => (
                    <motion.div 
                      layout
                      key={proj.id} 
                      initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                      animate={{ opacity: 1, scale: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="group"
                    >
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 dark:bg-slate-800 mb-6 border border-gray-200 dark:border-slate-800/50 shadow-sm">
                        {proj.image_url ? (
                          <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/5 transition-colors duration-300" />
                      </div>
                      
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {language === "en" && proj.title_en ? proj.title_en : proj.title}
                          </h3>
                          <div className="flex gap-2 shrink-0 pt-1">
                            {proj.github_url && (
                              <a href={proj.github_url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-colors">
                                <Github className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {proj.live_url && (
                              <a href={proj.live_url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-md">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                          {language === "en" && proj.description_en ? proj.description_en : proj.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {(language === "en" && proj.tech_stack_en ? proj.tech_stack_en : proj.tech_stack).split(',').map((tech, i) => (
                            <span key={i} className="px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {!loading && filteredProjects.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="py-20 text-center border border-dashed border-gray-300 dark:border-slate-800 rounded-2xl mt-12 bg-gray-50/50 dark:bg-slate-900/20"
                >
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    {language === "en" ? "No projects found in this category." : "Belum ada project yang ditambahkan di kategori ini."}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {language === "en" ? "Try selecting another category or add them via Admin Panel." : "Coba pilih kategori lain atau tambahkan lewat Panel Admin."}
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}
