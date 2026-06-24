"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageContext";
import { useTheme } from "next-themes";



const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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
            ? "bg-white/80 dark:bg-slate-950/80 border-gray-200 dark:border-slate-800 shadow-lg text-black dark:text-white"
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

        {/* Right: Contact Button & Language Toggle & Theme Toggle */}
        <div className="flex items-center gap-2 md:gap-4">

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-all text-xs font-bold",
                isScrolled ? "hover:bg-gray-100 dark:hover:bg-slate-800" : "hover:bg-white/10"
              )}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          <button
            onClick={toggleLanguage}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-full transition-all text-xs font-bold uppercase tracking-widest",
              isScrolled ? "hover:bg-gray-100 dark:hover:bg-slate-800" : "hover:bg-white/10"
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
                ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
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
            className="absolute top-16 left-4 right-4 bg-white dark:bg-slate-950 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-2xl md:hidden text-black dark:text-white"
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
                className="w-full text-center py-4 bg-black dark:bg-white text-white dark:text-black text-[11px] font-bold uppercase tracking-widest rounded-full"
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
