"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Code, ExternalLink, Github, ArrowRight } from "lucide-react";
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
          // Take only top 2 projects
          setProjects(data.slice(0, 2));
        }
      } catch (err) {
        console.error("Failed to fetch web dev projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (!loading && projects.length === 0) return null;

  return (
    <section className="relative py-24 bg-transparent transition-colors duration-500">
      <div className="relative container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-secondary dark:text-blue-400 mb-2 font-medium flex items-center gap-2">
              <Code className="w-3.5 h-3.5" /> Digital Engineering
            </h2>
            <h3 className="text-3xl font-bold tracking-tight text-primary dark:text-white">
              {language === "en" ? "Web Dev Projects" : "Project Web Dev"}
            </h3>
          </div>
          <Link 
            href="/projects" 
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-primary dark:border-white pb-1 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 dark:hover:border-blue-400 transition-all dark:text-white w-fit"
          >
            {language === "en" ? "View All Projects" : "Lihat Semua Project"}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-gray-300 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {projects.map((proj, idx) => (
              <motion.div 
                key={proj.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group flex flex-col h-full bg-white dark:bg-slate-950 p-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 mb-6 border border-gray-100 dark:border-slate-800/50">
                  {proj.image_url ? (
                    <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/5 transition-colors duration-300" />
                </div>
                
                <div className="flex flex-col flex-grow px-2 pb-2">
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
                  
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow">
                    {language === "en" && proj.description_en ? proj.description_en : proj.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
                    {(language === "en" && proj.tech_stack_en ? proj.tech_stack_en : proj.tech_stack).split(',').map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 rounded-md text-[9px] font-bold uppercase tracking-wider">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WebDevFeatured;
