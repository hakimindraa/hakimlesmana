"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    { name: language === "en" ? "Certificates" : "Sertifikat", href: "#certificates" },
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

  const socialLinks = [
    { icon: Instagram, href: instagramUrl, name: "Instagram", color: "hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500" },
    { icon: Facebook, href: facebookUrl, name: "Facebook", color: "hover:bg-blue-600" },
    { icon: Linkedin, href: linkedinUrl, name: "LinkedIn", color: "hover:bg-blue-700" },
    { icon: MessageCircle, href: `https://wa.me/${whatsapp}`, name: "WhatsApp", color: "hover:bg-green-600" },
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

      {/* Decorative gradient orbs */}
      <div className="hidden md:block absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/[0.015] rounded-full blur-[100px] pointer-events-none" />

      {/* ──────────── CTA Banner ──────────── */}
      <div className="relative border-b border-white/10">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-[0.2em] text-white/60 mb-8">
              <Camera className="w-3.5 h-3.5" />
              <span>Available for Booking</span>
              <Code className="w-3.5 h-3.5" />
              <Video className="w-3.5 h-3.5" />
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              {language === "en" ? "Let's Create" : "Mari Ciptakan"}
              <span className="block bg-gradient-to-r from-white via-white/80 to-white/50 bg-clip-text text-transparent">
                {language === "en" ? "Something Beautiful" : "Sesuatu yang Indah"}
              </span>
            </h2>

            <p className="text-white/50 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
              {language === "en"
                ? "Got an interesting project or just want to say hi? I'm always open to discussing meaningful visual collaborations."
                : "Punya proyek menarik atau ingin menyapa? Saya selalu terbuka untuk diskusi mengenai kolaborasi visual yang bermakna."}
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href={`mailto:${email}`}
                className="group flex items-center gap-3 px-8 py-4 bg-white text-black text-sm font-semibold uppercase tracking-widest rounded-full hover:bg-white/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                <Mail className="w-4 h-4 group-hover:rotate-6 transition-transform" />
                {language === "en" ? "Contact Me" : "Hubungi Saya"}
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-8 py-4 border border-white/20 text-white text-sm font-semibold uppercase tracking-widest rounded-full hover:bg-white/10 transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ──────────── Main Footer Grid ──────────── */}
      <div className="relative container mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-8">

          {/* Column 1 — Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0 }}
            className="lg:col-span-1"
          >
            <a href="#home" className="inline-block mb-4 hover:opacity-70 transition-opacity">
              <img
                src="/iconfooter.jpeg"
                alt="Logo"
                className="h-7 md:h-11 w-auto"
              />
            </a>

            <p className="text-white/40 text-[10px] md:text-sm leading-relaxed mb-6 max-w-xs">
              {language === "en"
                ? "Capturing timeless moments through the lens and building interactive digital experiences."
                : "Mengabadikan momen melalui lensa dan membangun pengalaman digital interaktif."}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-transparent transition-all duration-300 ${social.color}`}
                >
                  <social.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2 — Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/80 mb-4 md:mb-6">
              {language === "en" ? "Quick Links" : "Tautan Cepat"}
            </h3>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-white/40 text-[10px] md:text-sm hover:text-white transition-colors duration-300"
                  >
                    <span className="w-0 h-px bg-white group-hover:w-4 transition-all duration-300" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 — Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/80 mb-4 md:mb-6">
              {language === "en" ? "Services" : "Layanan"}
            </h3>
            <ul className="space-y-3.5">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-white/40 text-[10px] md:text-sm hover:text-white transition-colors duration-300 cursor-default">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 — Contact & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/80 mb-4 md:mb-6">
              {language === "en" ? "Get In Touch" : "Hubungi Kami"}
            </h3>

            <ul className="space-y-4 mb-8">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-2 md:gap-3 text-white/40 text-[10px] md:text-sm hover:text-white transition-colors group break-all"
                >
                  <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 shrink-0 text-white/30 group-hover:text-white transition-colors" />
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-start gap-2 md:gap-3 text-white/40 text-[10px] md:text-sm hover:text-white transition-colors group"
                >
                  <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 shrink-0 text-white/30 group-hover:text-white transition-colors" />
                  {phone}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 md:gap-3 text-white/40 text-[10px] md:text-sm">
                  <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 shrink-0 text-white/30" />
                  {location}
                </div>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <p className="text-white/50 text-[9px] md:text-xs uppercase tracking-widest mb-3">Newsletter</p>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 md:px-5 py-2.5 md:py-3 pr-10 md:pr-12 text-[10px] md:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
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
          </motion.div>
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
                Terms of Service
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
