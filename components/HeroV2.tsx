"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";

interface Profile {
  name: string;
  tagline: string;
  tagline_en?: string;
  bio: string;
  hero_image: string;
}

const HeroV2 = () => {
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

  return (
    <section id="home" className="relative min-h-[90vh] w-full flex items-center justify-center pt-32 md:pt-40 pb-12 bg-transparent z-10">

      {/* Background Orbs (Blurry Glowing Spheres) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-[120px]"
        />
      </div>

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

        </div>
      </div>
    </section>
  );
};

export default HeroV2;
