"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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

const Hero = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { language } = useLanguage();

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], ["0%", "30%"]);

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
    }, 3000); // Ganti peran setiap 3 detik
    return () => clearInterval(interval);
  }, [taglineItems.length]);

  // Jika profile belum selesai dimuat dari database, tampilkan loading spinner atau layar hitam
  if (!profile) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <p className="text-white tracking-widest text-xs uppercase animate-pulse">
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
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* ... sisa kode di bawahnya ... */}

      {/* Background Image - Fullscreen */}
      <div className="absolute inset-0">
        {heroImage && (
          <motion.img
            src={heroImage}
            alt="Featured Work"
            style={{ y: backgroundY }}
            className="absolute inset-0 w-full h-[130%] -top-[15%] object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>


      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-white font-medium tracking-[0.3em] mb-2 md:mb-4 uppercase text-[10px] md:text-sm flex justify-center flex-wrap">
              {name.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1, delay: 0.5 + index * 0.05 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h2>
            <div className="h-[60px] sm:h-[80px] md:h-[100px] lg:h-[130px] mb-6 md:mb-8 overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentRoleIndex}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.1] md:leading-tight w-full"
                >
                  {taglineItems[currentRoleIndex]}
                </motion.h1>
              </AnimatePresence>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <a
                href="#gallery"
                className="inline-block bg-white/10 md:backdrop-blur-md border border-white/20 text-white px-8 py-3 md:px-12 md:py-4 rounded-full hover:bg-white hover:text-black hover:shadow-lg md:hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all duration-500 font-semibold uppercase tracking-widest text-[10px] md:text-sm"
              >
                {language === "en" ? "View Gallery" : "Lihat Galeri"}
              </a>
            </motion.div>

            {/* Social Media Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex items-center justify-center gap-4 md:gap-6 mt-10 md:mt-12"
            >
              {profile?.github && (
                <a href={getValidUrl(profile.github)} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                  <Github className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              )}
              {profile?.linkedin && (
                <a href={getValidUrl(profile.linkedin)} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0a66c2]/10 border border-[#0a66c2]/30 text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-[0_0_15px_rgba(10,102,194,0.15)] hover:shadow-[0_0_25px_rgba(10,102,194,0.5)]">
                  <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              )}
              {profile?.instagram && (
                <a href={getValidUrl(profile.instagram)} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#E1306C]/10 border border-[#E1306C]/30 text-[#E1306C] hover:bg-gradient-to-tr hover:from-[#F56040] hover:to-[#833AB4] hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-[0_0_15px_rgba(225,48,108,0.15)] hover:shadow-[0_0_25px_rgba(225,48,108,0.5)] hover:border-transparent">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              )}
              {profile?.facebook && (
                <a href={getValidUrl(profile.facebook)} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1877F2]/10 border border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-[0_0_15px_rgba(24,119,242,0.15)] hover:shadow-[0_0_25px_rgba(24,119,242,0.5)]">
                  <Facebook className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              )}
              {/* Fallback dummy ones if none are set */}
              {!profile?.github && !profile?.linkedin && !profile?.instagram && !profile?.facebook && (
                <>
                  <a href="#" aria-label="GitHub" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                    <Github className="w-5 h-5 md:w-6 md:h-6" />
                  </a>
                  <a href="https://www.linkedin.com/in/hakimindralesmana" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0a66c2]/10 border border-[#0a66c2]/30 text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-[0_0_15px_rgba(10,102,194,0.15)] hover:shadow-[0_0_25px_rgba(10,102,194,0.5)]">
                    <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
                  </a>
                  <a href="#" aria-label="Instagram" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#E1306C]/10 border border-[#E1306C]/30 text-[#E1306C] hover:bg-gradient-to-tr hover:from-[#F56040] hover:to-[#833AB4] hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-[0_0_15px_rgba(225,48,108,0.15)] hover:shadow-[0_0_25px_rgba(225,48,108,0.5)] hover:border-transparent">
                    <Instagram className="w-5 h-5 md:w-6 md:h-6" />
                  </a>
                </>
              )}
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">{language === "en" ? "Scroll" : "Gulir"}</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
