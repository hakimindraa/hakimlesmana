"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Code, ExternalLink, Github } from "lucide-react";

type TechProject = {
  id: number;
  title: string;
  description: string;
  tech_stack: string;
  image_url: string;
  live_url: string;
  github_url: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<TechProject[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="min-h-screen bg-[#f8f9fa] selection:bg-black selection:text-white">
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
              Membangun pengalaman digital yang tidak hanya terlihat indah secara visual, tetapi juga berfungsi dengan performa tinggi dan intuitif.
            </p>
          </motion.div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <p className="text-xs uppercase tracking-widest text-gray-400 animate-pulse">Loading projects...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-12">
              {projects.map((proj, idx) => (
                <motion.div 
                  key={proj.id} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 mb-6 border border-gray-200 shadow-sm">
                    {proj.image_url ? (
                      <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{proj.title}</h3>
                      <div className="flex gap-2 shrink-0 pt-1">
                        {proj.github_url && (
                          <a href={proj.github_url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-colors">
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {proj.live_url && (
                          <a href={proj.live_url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{proj.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {proj.tech_stack.split(',').map((tech, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && projects.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-400">Belum ada project yang ditambahkan.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
