"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Heart, Code2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

interface Profile {
  name: string;
  bio: string;
  about_text: string;
  home_quote?: string;
  hl1_title?: string;
  hl1_desc?: string;
  hl2_title?: string;
  hl2_desc?: string;
  hl3_title?: string;
  hl3_desc?: string;
  bio_en?: string;
  about_text_en?: string;
  home_quote_en?: string;
  hl1_title_en?: string;
  hl1_desc_en?: string;
  hl2_title_en?: string;
  hl2_desc_en?: string;
  hl3_title_en?: string;
  hl3_desc_en?: string;
}

const AboutMe = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) setProfile(await res.json());
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const bio = language === "en" && profile?.bio_en ? profile.bio_en : (profile?.bio || "Saya adalah seorang fotografer yang mendedikasikan diri untuk mengeksplorasi keindahan melalui lensa.");
  const aboutText = language === "en" && profile?.about_text_en ? profile.about_text_en : (profile?.about_text || "Perjalanan saya dimulai dari rasa ingin tahu yang besar terhadap bagaimana cahaya dapat mengubah persepsi kita tentang dunia.");

  const quote = language === "en" && profile?.home_quote_en ? profile.home_quote_en : (profile?.home_quote || "Menangkap emosi lewat lensa visual, dan membangun solusi lewat baris kode.");

  const hl1Title = language === "en" && profile?.hl1_title_en ? profile.hl1_title_en : (profile?.hl1_title || "VISUAL ARTS");
  const hl1Desc = language === "en" && profile?.hl1_desc_en ? profile.hl1_desc_en : (profile?.hl1_desc || "Fotografi, Sinematografi, & UI/UX Design.");

  const hl2Title = language === "en" && profile?.hl2_title_en ? profile.hl2_title_en : (profile?.hl2_title || "DIGITAL ENGINEERING");
  const hl2Desc = language === "en" && profile?.hl2_desc_en ? profile.hl2_desc_en : (profile?.hl2_desc || "Next.js, React, & Modern Web Development.");

  const hl3Title = language === "en" && profile?.hl3_title_en ? profile.hl3_title_en : (profile?.hl3_title || "CORE PASSION");
  const hl3Desc = language === "en" && profile?.hl3_desc_en ? profile.hl3_desc_en : (profile?.hl3_desc || "Memadukan Estetika Visual dengan Performa Interaktif.");

  return (
    <section id="about" className="relative py-24 bg-black/[0.02] dark:bg-white/[0.02] transition-colors duration-500">
      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-12 text-center tracking-tight dark:text-white">
            {language === "en" ? "About Me" : "Tentang Saya"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
              <h3 className="text-base md:text-2xl font-bold text-primary dark:text-white italic leading-snug md:leading-normal">
                &quot;{quote}&quot;
              </h3>
              <p className="text-secondary text-sm md:text-base leading-relaxed">
                {bio}
              </p>
              <p className="text-secondary text-sm md:text-base leading-relaxed">
                {aboutText}
              </p>
            </div>

            <div className="col-span-1 space-y-4 md:space-y-6">
              <div className="group flex items-start space-x-3 md:space-x-4 p-3 md:p-4 rounded-xl transition-transform duration-300 hover:-translate-y-1 bg-white/60 dark:bg-slate-900/50 border border-gray-200/50 dark:border-slate-800/80 shadow-sm md:shadow-[0_8px_20px_rgba(0,0,0,0.04)] md:dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:bg-white hover:border-gray-300/50 hover:shadow-md md:hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] md:backdrop-blur-sm -mx-3 md:-mx-4 cursor-default">
                <div className="p-2 md:p-3 bg-gray-50/50 dark:bg-slate-800/80 rounded-lg shadow-sm dark:shadow-inner border border-gray-200/60 dark:border-slate-700/50 transition-colors">
                  <Camera className="w-4 h-4 md:w-5 md:h-5 text-primary dark:text-gray-100 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 mt-0.5 md:mt-1">
                  <h4 className="font-bold text-sm uppercase tracking-wider leading-tight md:leading-normal mb-1 md:mb-0 text-primary dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{hl1Title}</h4>
                  <p className="text-xs md:text-sm text-secondary dark:text-gray-400 leading-tight md:leading-normal">{hl1Desc}</p>
                </div>
              </div>

              <div className="group flex items-start space-x-3 md:space-x-4 p-3 md:p-4 rounded-xl transition-transform duration-300 hover:-translate-y-1 bg-white/60 dark:bg-slate-900/50 border border-gray-200/50 dark:border-slate-800/80 shadow-sm md:shadow-[0_8px_20px_rgba(0,0,0,0.04)] md:dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:bg-white hover:border-gray-300/50 hover:shadow-md md:hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] md:backdrop-blur-sm -mx-3 md:-mx-4 cursor-default">
                <div className="p-2 md:p-3 bg-gray-50/50 dark:bg-slate-800/80 rounded-lg shadow-sm dark:shadow-inner border border-gray-200/60 dark:border-slate-700/50 transition-colors">
                  <Code2 className="w-4 h-4 md:w-5 md:h-5 text-primary dark:text-gray-100 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 mt-0.5 md:mt-1">
                  <h4 className="font-bold text-sm uppercase tracking-wider leading-tight md:leading-normal mb-1 md:mb-0 text-primary dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{hl2Title}</h4>
                  <p className="text-xs md:text-sm text-secondary dark:text-gray-400 leading-tight md:leading-normal">{hl2Desc}</p>
                </div>
              </div>

              <div className="group flex items-start space-x-3 md:space-x-4 p-3 md:p-4 rounded-xl transition-transform duration-300 hover:-translate-y-1 bg-white/60 dark:bg-slate-900/50 border border-gray-200/50 dark:border-slate-800/80 shadow-sm md:shadow-[0_8px_20px_rgba(0,0,0,0.04)] md:dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:bg-white hover:border-gray-300/50 hover:shadow-md md:hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] md:backdrop-blur-sm -mx-3 md:-mx-4 cursor-default">
                <div className="p-2 md:p-3 bg-gray-50/50 dark:bg-slate-800/80 rounded-lg shadow-sm dark:shadow-inner border border-gray-200/60 dark:border-slate-700/50 transition-colors">
                  <Heart className="w-4 h-4 md:w-5 md:h-5 text-primary dark:text-gray-100 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 mt-0.5 md:mt-1">
                  <h4 className="font-bold text-sm uppercase tracking-wider leading-tight md:leading-normal mb-1 md:mb-0 text-primary dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{hl3Title}</h4>
                  <p className="text-xs md:text-sm text-secondary dark:text-gray-400 leading-tight md:leading-normal">{hl3Desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-16 flex justify-center">
            <a href="/about" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white dark:text-black bg-black dark:bg-white border border-black dark:border-white rounded-full overflow-hidden transition-all duration-300 hover:bg-transparent dark:hover:bg-transparent hover:text-black dark:hover:text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <span className="relative z-10 flex items-center gap-2 text-xs tracking-widest uppercase">
                {language === "en" ? "View Full Portfolio & Resume" : "Lihat Portofolio & Resume Lengkap"}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutMe;
