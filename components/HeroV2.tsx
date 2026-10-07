"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Instagram, Facebook, Linkedin, Github } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

interface Profile {
  name: string;
  tagline: string;
  tagline_en?: string;
  bio: string;
  hero_image: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  github?: string;
}

const HeroV2 = ({ initialProfile }: { initialProfile?: Profile | null }) => {
  const [profile, setProfile] = useState<Profile | null>(initialProfile || null);
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
    // Fetch only if initialProfile is missing (fallback) or if you want to keep it fresh
    if (!initialProfile) {
      fetchProfile();
    }
  }, [initialProfile]);

  const name = profile?.name || "";
  const firstName = name.split(" ")[0];
  const baseTagline = language === "en" && profile?.tagline_en ? profile.tagline_en : profile?.tagline || "";
  const tagline = baseTagline;
  const heroImage = profile?.hero_image || "";

  // Pisahkan tagline berdasarkan koma atau " & " untuk rotator
  const taglineItems = tagline.replace(" & ", ", ").split(",").map(s => s.trim()).filter(Boolean);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    if (taglineItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % taglineItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [taglineItems.length]);

  if (!profile) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-transparent">
        <p className="text-slate-500 tracking-widest text-xs uppercase animate-pulse">
          {language === "en" ? "Loading..." : "Memuat..."}
        </p>
      </div>
    );
  }

  const getValidUrl = (url?: string) => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  return (
    <section id="home" className="relative min-h-[90vh] w-full flex items-center justify-center pt-32 md:pt-40 pb-12 bg-transparent z-10">



      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

          {/* Circular Photo with Glow */}
          {heroImage && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-28 h-28 md:w-36 md:h-36 mb-6 md:mb-8 group"
            >
              {/* Spinning gradient ring */}
              <div className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-yellow-500 via-blue-500 to-yellow-500 opacity-70 group-hover:opacity-100 group-hover:rotate-180 transition-[opacity,transform] duration-700 blur-[2px]" />
              <Image
                src={heroImage}
                alt={name}
                width={144}
                height={144}
                priority
                className="relative w-full h-full object-cover rounded-full border-[4px] border-white dark:border-slate-950 transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          )}

          {/* Availability Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-xs font-medium mb-6 md:backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {language === "en" ? "Available for work" : "Tersedia untuk proyek"}
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-4 md:mb-6"
          >
            Hi, I'm {firstName}. <br className="hidden md:block" />
            {language === "en" ? "I build " : "Membangun "}
            <span className="bg-gradient-to-r from-yellow-600 to-yellow-600 dark:from-yellow-400 dark:to-yellow-400 bg-clip-text text-transparent">
              {language === "en" ? "digital " : "solusi "}
            </span>
            {language === "en" ? "dreams." : "digital."}
          </motion.h1>

          {/* Rotating Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="h-[30px] md:h-[40px] overflow-hidden flex items-center justify-center text-base md:text-xl text-slate-600 dark:text-slate-400 font-medium mb-8 md:mb-10"
          >
            <span className="mr-2">{language === "en" ? "Specializing in" : "Fokus pada"}</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentRoleIndex}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="font-bold text-yellow-600 dark:text-yellow-400"
              >
                {taglineItems[currentRoleIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <a
              href="#featured-works"
              className="px-8 py-3.5 w-full sm:w-auto rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:scale-105 transition-transform duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] dark:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)]"
            >
              {language === "en" ? "View My Work" : "Lihat Karya Saya"}
            </a>
            <a
              href="#about"
              className="px-8 py-3.5 w-full sm:w-auto rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-300 md:backdrop-blur-md"
            >
              {language === "en" ? "About Me" : "Tentang Saya"}
            </a>
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex items-center justify-center gap-4 md:gap-6 mt-8 md:mt-10"
          >
            {profile?.github && (
              <a href={getValidUrl(profile.github)} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                <Github className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            )}
            {profile?.linkedin && (
              <a href={getValidUrl(profile.linkedin)} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0a66c2]/10 border border-[#0a66c2]/20 text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-[0_4px_10px_rgba(10,102,194,0.1)] hover:shadow-[0_10px_20px_rgba(10,102,194,0.3)] dark:border-[#0a66c2]/30 dark:shadow-[0_0_15px_rgba(10,102,194,0.15)] dark:hover:shadow-[0_0_25px_rgba(10,102,194,0.5)]">
                <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            )}
            {profile?.instagram && (
              <a href={getValidUrl(profile.instagram)} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#E1306C]/10 border border-[#E1306C]/20 text-[#E1306C] hover:bg-gradient-to-tr hover:from-[#F56040] hover:to-[#833AB4] hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-[0_4px_10px_rgba(225,48,108,0.1)] hover:shadow-[0_10px_20px_rgba(225,48,108,0.3)] hover:border-transparent dark:border-[#E1306C]/30 dark:shadow-[0_0_15px_rgba(225,48,108,0.15)] dark:hover:shadow-[0_0_25px_rgba(225,48,108,0.5)]">
                <Instagram className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            )}
            {profile?.facebook && (
              <a href={getValidUrl(profile.facebook)} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1877F2]/10 border border-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-[0_4px_10px_rgba(24,119,242,0.1)] hover:shadow-[0_10px_20px_rgba(24,119,242,0.3)] dark:border-[#1877F2]/30 dark:shadow-[0_0_15px_rgba(24,119,242,0.15)] dark:hover:shadow-[0_0_25px_rgba(24,119,242,0.5)]">
                <Facebook className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            )}
            {/* Fallback dummy ones if none are set */}
            {!profile?.github && !profile?.linkedin && !profile?.instagram && !profile?.facebook && (
              <>
                <a href="#" aria-label="GitHub" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                  <Github className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a href="https://www.linkedin.com/in/hakimindralesmana" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0a66c2]/10 border border-[#0a66c2]/20 text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-[0_4px_10px_rgba(10,102,194,0.1)] hover:shadow-[0_10px_20px_rgba(10,102,194,0.3)] dark:border-[#0a66c2]/30 dark:shadow-[0_0_15px_rgba(10,102,194,0.15)] dark:hover:shadow-[0_0_25px_rgba(10,102,194,0.5)]">
                  <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a href="#" aria-label="Instagram" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#E1306C]/10 border border-[#E1306C]/20 text-[#E1306C] hover:bg-gradient-to-tr hover:from-[#F56040] hover:to-[#833AB4] hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-[0_4px_10px_rgba(225,48,108,0.1)] hover:shadow-[0_10px_20px_rgba(225,48,108,0.3)] hover:border-transparent dark:border-[#E1306C]/30 dark:shadow-[0_0_15px_rgba(225,48,108,0.15)] dark:hover:shadow-[0_0_25px_rgba(225,48,108,0.5)]">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              </>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroV2;
