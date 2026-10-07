"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  MapPin,
  Phone,
  ArrowUp,
  Camera,
  Video,
  Code,
  Send,
} from "lucide-react";
import { 
  SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, 
  SiFramer, SiNodedotjs, SiFigma, SiVercel
} from "react-icons/si";
import { FaCameraRetro, FaVideo, FaFilm } from "react-icons/fa";
import { MdDesignServices } from "react-icons/md";
import { useLanguage } from "@/components/LanguageContext";

interface Profile {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  instagram: string;
  facebook: string;
  linkedin: string;
}

const Footer = () => {
  const [emailValue, setEmailValue] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { language } = useLanguage();

  const currentYear = new Date().getFullYear();

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

  const email = profile?.email || "hakimindralesmana@gmail.com";
  const phone = profile?.phone || "+62 83137412551";
  const whatsapp = profile?.whatsapp || "6283137412551";
  const location = profile?.location || "Tanjungpinang Kepulauan Riau, Indonesia";
  const instagramUrl = profile?.instagram || "#";
  const facebookUrl = profile?.facebook || "#";
  const linkedinUrl = profile?.linkedin || "#";

  const quickLinks = [
    { name: language === "en" ? "Home" : "Beranda", href: "#home" },
    { name: language === "en" ? "About" : "Tentang", href: "#about" },
    { name: language === "en" ? "Gallery" : "Galeri", href: "#gallery" },
    { name: language === "en" ? "Web Projects" : "Project Web", href: "/projects" },
    { name: language === "en" ? "Blog" : "Blog", href: "/blog" },
    // { name: language === "en" ? "Certificates" : "Sertifikat", href: "#certificates" },
    { name: language === "en" ? "Contact" : "Kontak", href: "#contact" },
  ];

  const services = [
    language === "en" ? "Wedding Photography" : "Fotografi Pernikahan",
    language === "en" ? "Web Development" : "Web Development",
    language === "en" ? "Event Videography" : "Videografi Acara",
    language === "en" ? "UI/UX Design" : "Desain UI/UX",
    language === "en" ? "Cinematic Film" : "Film Sinematik",
    language === "en" ? "Frontend Engineering" : "Frontend Engineering",
  ];



  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailValue.trim()) {
      setSubscribed(true);
      setEmailValue("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative bg-[#0a0a0a] text-white overflow-hidden">
      {/* Subtle grain / texture overlay */}
      <div className="hidden md:block absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ──────────── Tech Stack Galaxy (Optimized) ──────────── */}
      <div className="relative border-b border-white/10 bg-[#0a0a0a] overflow-hidden py-16 md:py-32">
        {/* Optimized Background Glow (Using CSS radial-gradient instead of expensive backdrop-filter/blur) */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] pointer-events-none" 
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)' }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-white/40 mb-3">
              {language === "en" ? "Powered By" : "Senjata Pilihan"}
            </h2>
            <p className="text-xl md:text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent">
              Modern Tech Arsenal
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 max-w-4xl mx-auto">
            {[
              { id: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
              { id: "React", icon: SiReact, color: "#61DAFB" },
              { id: "TypeScript", icon: SiTypescript, color: "#3178C6" },
              { id: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
              { id: "Framer Motion", icon: SiFramer, color: "#0055FF" },
              { id: "Node.js", icon: SiNodedotjs, color: "#339933" },
              { id: "Figma", icon: SiFigma, color: "#F24E1E" },
              { id: "UI/UX Design", icon: MdDesignServices, color: "#FFD700" },
              { id: "Photography", icon: FaCameraRetro, color: "#E1306C" },
              { id: "Videography", icon: FaVideo, color: "#FF0000" },
              { id: "Premiere Pro", icon: FaFilm, color: "#9999FF" },
              { id: "Vercel", icon: SiVercel, color: "#ffffff" },
            ].map((tech) => {
              const Icon = tech.icon;
              
              return (
                <div
                  key={tech.id}
                  title={tech.id}
                  className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl md:rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                >
                  <Icon 
                    className="w-6 h-6 md:w-8 md:h-8 opacity-75 group-hover:opacity-100 transition-transform duration-300 group-hover:scale-110" 
                    style={{ color: tech.color }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ──────────── Main Footer Grid ──────────── */}
      <div className="relative container mx-auto px-6 py-10 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

          {/* Column 1 — Brand */}
          <div className="lg:col-span-1">
            <a href="#home" className="inline-block mb-4 hover:opacity-70 transition-opacity">
              <Image
                src="/iconfooter.jpeg"
                alt="Logo"
                width={120}
                height={44}
                className="h-7 md:h-11 w-auto"
              />
            </a>

            <p className="text-white/40 text-sm md:text-base leading-relaxed mb-6 max-w-xs">
              {language === "en"
                ? "Capturing timeless moments through the lens and building interactive digital experiences."
                : "Mengabadikan momen melalui lensa dan membangun pengalaman digital interaktif."}
            </p>


          </div>

          {/* Column 2 — Contact & Newsletter */}
          <div>
            <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/80 mb-4 md:mb-6">
              {language === "en" ? "Get In Touch" : "Hubungi Kami"}
            </h3>

            <ul className="space-y-4 mb-8">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-2 md:gap-3 text-white/40 text-sm md:text-base hover:text-white transition-colors group break-all"
                >
                  <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 shrink-0 text-white/30 group-hover:text-white transition-colors" />
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-start gap-2 md:gap-3 text-white/40 text-sm md:text-base hover:text-white transition-colors group"
                >
                  <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 shrink-0 text-white/30 group-hover:text-white transition-colors" />
                  {phone}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 md:gap-3 text-white/40 text-sm md:text-base">
                  <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 shrink-0 text-white/30" />
                  {location}
                </div>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <p className="text-white/50 text-xs md:text-sm uppercase tracking-widest mb-3">Newsletter</p>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 md:px-5 py-2.5 md:py-3 pr-10 md:pr-12 text-sm md:text-base text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <Send className="w-3 h-3 md:w-3.5 md:h-3.5" />
                </button>
              </form>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-xs mt-2 ml-1"
                >
                  ✓ Subscribed successfully!
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ──────────── Bottom Bar ──────────── */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-xs tracking-wider order-2 md:order-1">
              © {currentYear} {profile?.name || "Hakim Indra Lesmana"}. All rights reserved.
            </p>

            <div className="flex items-center gap-6 order-1 md:order-2">
              <a href="#" className="text-white/30 text-xs hover:text-white/60 transition-colors">
                Privacy Policy
              </a>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <a href="#" className="text-white/30 text-xs hover:text-white/60 transition-colors">
                Terms of Services
              </a>
              <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />

              <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className="group w-9 h-9 flex items-center justify-center rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 text-white/40 hover:text-white transition-all duration-300"
              >
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
