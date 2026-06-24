"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

  // Jika profile belum selesai dimuat dari database, tampilkan loading spinner atau layar hitam
  if (!profile) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <p className="text-white tracking-widest text-xs uppercase animate-pulse">Loading...</p>
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
          <img
            src={heroImage}
            alt="Featured Work"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
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
            <h2 className="text-white font-medium tracking-[0.3em] mb-2 md:mb-4 uppercase text-[10px] md:text-sm">
              {name}
            </h2>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 text-white tracking-tight leading-[1.1] md:leading-tight">
              {tagline.includes(",") ? (
                <>
                  {tagline.split(",")[0]},<br />
                  {tagline.split(",").slice(1).join(",")}
                </>
              ) : (
                tagline
              )}
            </h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <a
                href="#gallery"
                className="inline-block border border-white text-white px-6 py-3 md:px-10 md:py-4 rounded-none hover:bg-white hover:text-black transition-all duration-300 font-medium uppercase tracking-widest text-[10px] md:text-sm"
              >
                View Gallery
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
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
