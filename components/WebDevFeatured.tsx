"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Code, ExternalLink, Github, ArrowRight, Layout, Palette, Sparkles } from "lucide-react";
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

const WebDevFeatured = () => {
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

  const topWeb = webProjects[0];
  const topUiUx = uiuxProjects[0];
  const topDesign = designProjects[0];

  const renderProjectCard = (proj: TechProject | undefined, delayOffset: number) => {
    if (!proj) {
      return (
        <div className="w-full p-8 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-slate-900/20 h-full min-h-[300px]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {language === "en" ? "No projects in this category yet." : "Belum ada project di kategori ini."}
          </p>
          <p className="text-[10px] text-gray-400 mt-2">
            {language === "en" ? "Add via Admin Panel." : "Tambahkan via Panel Admin."}
          </p>
        </div>
      );
    }

    return (
      <motion.div
        key={proj.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delayOffset * 0.1 }}
        className="group flex flex-col bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm md:hover:shadow-xl transition-shadow duration-300 h-full flex-grow"
      >
        <div className="w-full aspect-[4/3] relative bg-gray-100 dark:bg-slate-800 overflow-hidden shrink-0">
          {proj.image_url ? (
            <Image src={proj.image_url} alt={proj.title} fill className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">No Image</div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/5 transition-colors duration-300" />
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h4 className="font-bold text-base md:text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">
            {language === "en" && proj.title_en ? proj.title_en : proj.title}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">
            {language === "en" && proj.description_en ? proj.description_en : proj.description}
          </p>

          <div className="mt-auto flex justify-between items-end gap-2">
            <div className="flex flex-wrap gap-1.5">
              {(language === "en" && proj.tech_stack_en ? proj.tech_stack_en : proj.tech_stack).split(',').slice(0, 2).map((tech, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-semibold uppercase tracking-wider">
                  {tech.trim()}
                </span>
              ))}
            </div>

            <div className="flex gap-2 shrink-0">
              {proj.github_url && (
                <a href={proj.github_url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {proj.live_url && (
                <a href={proj.live_url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-sm">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

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
              {language === "en" ? "All Projects" : "Semua Proyek"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
              {language === "en" ? "A categorized selection of my latest projects." : "Kumpulan proyek terbaru saya yang dibagi berdasarkan keahlian."}
            </p>
          </div>
          <Link
            href="/projects"
            className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors dark:text-white w-fit"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {/* Category 1: Web Engineering */}
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-5">
                <span className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/30">
                  <Code className="w-4 h-4" />
                </span>
                {language === "en" ? "Web Engineering" : "Pengembangan Web"}
              </h3>
              {renderProjectCard(topWeb, 1)}
            </div>

            {/* Category 2: UI/UX */}
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-5">
                <span className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/30">
                  <Layout className="w-4 h-4" />
                </span>
                {language === "en" ? "UI/UX & Product Design" : "Desain Produk & UI/UX"}
              </h3>
              {renderProjectCard(topUiUx, 2)}
            </div>

            {/* Category 3: Design */}
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mb-5">
                <span className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/30">
                  <Palette className="w-4 h-4" />
                </span>
                {language === "en" ? "Visual & Branding" : "Visual & Branding"}
              </h3>
              {renderProjectCard(topDesign, 3)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WebDevFeatured;
