"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";

interface Profile {
  name: string;
  tagline: string;
  tagline_en?: string;
  bio: string;
  hero_image: string;
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
                  initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -40, opacity: 0, filter: "blur(10px)" }}
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
                className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 md:px-12 md:py-4 rounded-full hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all duration-500 font-semibold uppercase tracking-widest text-[10px] md:text-sm"
              >
                {language === "en" ? "View Gallery" : "Lihat Galeri"}
              </a>
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
