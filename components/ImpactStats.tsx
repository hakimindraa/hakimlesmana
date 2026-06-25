"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "./LanguageContext";

interface Stat {
  id: number;
  value: string;
  value_en: string;
  label: string;
  label_en: string;
  display_order: number;
}

export default function ImpactStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/impact-stats");
        if (res.ok) {
          const data = await res.json();
          setStats(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch impact stats:", err);
      }
    };
    fetchStats();
  }, []);

  if (stats.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-transparent relative z-10">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
          {stats.map((stat, index) => {
            const displayValue = language === "en" && stat.value_en ? stat.value_en : stat.value;
            const displayLabel = language === "en" && stat.label_en ? stat.label_en : stat.label;

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center text-center group"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter bg-gradient-to-b from-black to-gray-500 dark:from-white dark:to-gray-500 text-transparent bg-clip-text mb-3 transition-transform duration-300 group-hover:scale-110">
                  {displayValue}
                </div>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                  {displayLabel}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
