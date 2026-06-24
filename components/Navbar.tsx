"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageContext";



const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  const navItems = [
    { name: language === "en" ? "Home" : "Beranda", href: "/#home" },
    { name: language === "en" ? "About" : "Tentang", href: "/about" },
    { name: language === "en" ? "Gallery" : "Galeri", href: "/#gallery" },
    { name: language === "en" ? "Web Dev" : "Web Dev", href: "/projects" },
    { name: language === "en" ? "Certificates" : "Sertifikat", href: "/#certificates" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-4 md:top-6 left-0 right-0 z-[100] flex justify-center px-4 md:px-6">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "flex items-center justify-between w-full max-w-5xl h-13 md:h-16 px-5 md:px-8 rounded-full transition-all duration-500",
          "border backdrop-blur-xl",
          isScrolled
            ? "bg-white/80 border-gray-200 shadow-lg text-black"
            : "bg-white/10 border-white/20 text-white"
        )}
      >
        {/* Left: Logo (HAKIM) */}
        <a
          href="#home"
          className="shrink-0 hover:opacity-70 transition-opacity"
        >
          <img
            src="/icon2.png"
            alt="icon2"
            className="h-6 md:h-11 w-auto"
          />
        </a>


        {/* Center: Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:opacity-50"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right: Contact Button & Language Toggle */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleLanguage}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-full transition-all text-xs font-bold uppercase tracking-widest",
              isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
            )}
          >
            <Globe size={14} />
            {language}
          </button>

          <a
            href="mailto:hakim@example.com"
            className={cn(
              "hidden md:block px-8 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all shrink-0",
              isScrolled
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-white text-black hover:bg-gray-200"
            )}
          >
            {language === "en" ? "Contact" : "Kontak"}
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-end"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-16 left-4 right-4 bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl md:hidden text-black"
          >
            <div className="flex flex-col gap-8 items-center">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-opacity"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="mailto:hakim@example.com"
                className="w-full text-center py-4 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-full"
              >
                {language === "en" ? "Contact" : "Kontak"}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
