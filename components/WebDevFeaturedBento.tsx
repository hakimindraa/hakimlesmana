"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Code, Layout, Palette, Github, ExternalLink } from "lucide-react";
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

const WebDevFeaturedBento = () => {
  const [projects, setProjects] = useState<TechProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/tech-projects");
        if (res.ok) {
          const data: TechProject[] = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to fetch web dev projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Helper function for categorization
  const categorizeProject = (p: TechProject) => {
    const stack = (p.tech_stack || "").toLowerCase();
    const title = (p.title || "").toLowerCase();

    const isUIUX = stack.includes("figma") || stack.includes("ui/ux") || stack.includes("adobe xd") || 
                   title.includes(" ui ") || title.includes("ui ") || title.includes(" ux ") || title.includes("ux");

    const isDesign = !isUIUX && (stack.includes("canva") || stack.includes("illustrator") || 
                                 stack.includes("coreldraw") || stack.includes("photoshop") || 
                                 stack.includes("poster") || stack.includes("banner") || stack.includes("design"));

    const isWeb = !isUIUX && !isDesign;
    
    return { isWeb, isUIUX, isDesign };
  };

  const webProjects = projects.filter(p => categorizeProject(p).isWeb);
  const uiuxProjects = projects.filter(p => categorizeProject(p).isUIUX);
  const designProjects = projects.filter(p => categorizeProject(p).isDesign);

  // Get the top project for each category to display in the Bento Box
  const topWeb = webProjects[0];
  const topUiUx = uiuxProjects[0];
  const topDesign = designProjects[0];

  if (!loading && projects.length === 0) return null;

  return (
    <section className="relative py-24 bg-transparent transition-colors duration-500">
      <div className="relative container mx-auto px-6 max-w-6xl">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-secondary dark:text-blue-400 mb-3 font-medium flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> {language === "en" ? "Multi-Disciplinary" : "Multi-Disiplin"}
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary dark:text-white">
              {language === "en" ? "Selected Works" : "Karya Digital Terpilih"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
              {language === "en" ? "A curated bento box of my finest cross-disciplinary projects." : "Kumpulan karya lintas bidang terbaik saya yang dikemas dalam bentuk bento box."}
            </p>
          </div>
          <Link
            href="/projects"
            className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all dark:text-white w-fit"
          >
            {language === "en" ? "Explore All" : "Eksplor Semua"}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-gray-300 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:h-[650px] lg:h-[700px]">

            {/* LARGE BOX (LEFT) - WEB DEV */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 group relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg md:hover:shadow-2xl transition-shadow duration-500 h-[400px] md:h-full"
            >
              {topWeb ? (
                <>
                  <Image src={topWeb.image_url} alt={topWeb.title} fill className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col items-start">
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-600/90 md:backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-yellow-500/50 shadow-sm md:shadow-lg mb-4">
                      <Code className="w-3.5 h-3.5" /> Web Engineering
                    </span>
                    <h3 className="text-2xl md:text-4xl font-extrabold mb-3 line-clamp-2 w-full">
                      {language === "en" && topWeb.title_en ? topWeb.title_en : topWeb.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-300 line-clamp-2 max-w-xl mb-6">
                      {language === "en" && topWeb.description_en ? topWeb.description_en : topWeb.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(language === "en" && topWeb.tech_stack_en ? topWeb.tech_stack_en : topWeb.tech_stack).split(',').slice(0, 4).map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 md:backdrop-blur-md border border-white/20 rounded-md text-[10px] font-semibold uppercase tracking-wider">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {topWeb.github_url && (
                        <a href={topWeb.github_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {topWeb.live_url && (
                        <a href={topWeb.live_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-colors shadow-lg">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
                  <Code className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-700" />
                  <p>Belum ada project Web Development.</p>
                </div>
              )}
            </motion.div>

            {/* TWO SMALL BOXES (RIGHT) - STACKED */}
            <div className="md:col-span-1 flex flex-col gap-6 h-[600px] md:h-full">

              {/* TOP RIGHT - UI/UX */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 group relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md md:hover:shadow-xl transition-shadow duration-500"
              >
                {topUiUx ? (
                  <>
                    <Image src={topUiUx.image_url} alt={topUiUx.title} fill className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500 flex flex-col items-start">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-600/90 md:backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider border border-yellow-500/50 shadow-sm md:shadow-md mb-3">
                        <Layout className="w-3 h-3" /> UI/UX Design
                      </span>
                      <h3 className="text-xl font-bold mb-2 line-clamp-1 w-full">
                        {language === "en" && topUiUx.title_en ? topUiUx.title_en : topUiUx.title}
                      </h3>
                      <div className="flex gap-2">
                        {topUiUx.live_url && (
                          <a href={topUiUx.live_url} target="_blank" rel="noreferrer" className="text-[10px] uppercase font-bold flex items-center gap-1 hover:text-purple-400 transition-colors">
                            Preview <ArrowRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 m-2 rounded-2xl bg-white/50 dark:bg-slate-950/50">
                    <Layout className="w-8 h-8 mb-3 text-slate-400 dark:text-slate-600" />
                    <p className="text-sm font-semibold">UI/UX Design</p>
                    <p className="text-xs mt-1 text-slate-400">Empty (Add via Admin)</p>
                  </div>
                )}
              </motion.div>

              {/* BOTTOM RIGHT - GRAPHIC DESIGN */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex-1 group relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md md:hover:shadow-xl transition-shadow duration-500"
              >
                {topDesign ? (
                  <>
                    <Image src={topDesign.image_url} alt={topDesign.title} fill className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500 flex flex-col items-start">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-600/90 md:backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider border border-yellow-500/50 shadow-sm md:shadow-md mb-3">
                        <Palette className="w-3 h-3" /> Graphic Design
                      </span>
                      <h3 className="text-xl font-bold mb-2 line-clamp-1 w-full">
                        {language === "en" && topDesign.title_en ? topDesign.title_en : topDesign.title}
                      </h3>
                      <div className="flex gap-2">
                        {topDesign.live_url && (
                          <a href={topDesign.live_url} target="_blank" rel="noreferrer" className="text-[10px] uppercase font-bold flex items-center gap-1 hover:text-orange-400 transition-colors">
                            View <ArrowRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 m-2 rounded-2xl bg-white/50 dark:bg-slate-950/50">
                    <Palette className="w-8 h-8 mb-3 text-slate-400 dark:text-slate-600" />
                    <p className="text-sm font-semibold">Graphic Design</p>
                    <p className="text-xs mt-1 text-slate-400">Empty (Add via Admin)</p>
                  </div>
                )}
              </motion.div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WebDevFeaturedBento;
