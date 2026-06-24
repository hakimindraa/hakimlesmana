"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";

interface Certificate {
  id: number;
  title: string;
  title_en?: string;
  issuer: string;
  date: string;
  image_url: string;
  description: string;
  description_en?: string;
}

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await fetch("/api/certificates");
        if (res.ok) {
          const data = await res.json();
          setCertificates(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch certificates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  // Hide section if no certificates
  if (!loading && certificates.length === 0) return null;

  return (
    <section id="certificates" className="relative py-24 bg-black/[0.02] dark:bg-white/[0.02] transition-colors duration-500">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center tracking-tight dark:text-white">
          {language === "en" ? "Certificates" : "Sertifikat"}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-gray-300 dark:border-gray-700 border-t-gray-800 dark:border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col md:flex-row bg-accent dark:bg-slate-900 border border-gray-200 dark:border-slate-800 overflow-hidden rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.8)] hover:-translate-y-2 transition-all duration-300"
              >
                {cert.image_url && (
                  <div className="md:w-1/3 relative h-48 md:h-auto bg-gray-200 dark:bg-slate-800">
                    <Image
                      src={cert.image_url}
                      alt={cert.title}
                      fill
                      className="object-cover grayscale-0 md:grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                )}
                <div className={`${cert.image_url ? "md:w-2/3" : "w-full"} p-8 flex flex-col justify-between`}>
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold leading-tight dark:text-white">
                        {language === "en" && cert.title_en ? cert.title_en : cert.title}
                      </h3>
                      {cert.date && (
                        <span className="text-sm font-medium text-secondary bg-white dark:bg-slate-950 px-3 py-1 border border-gray-200 dark:border-slate-800">
                          {cert.date}
                        </span>
                      )}
                    </div>
                    {cert.issuer && (
                      <p className="text-xs text-secondary uppercase tracking-wider mb-2">{cert.issuer}</p>
                    )}
                    {cert.description && (
                      <p className="text-secondary text-sm mb-6 leading-relaxed">
                        {language === "en" && cert.description_en ? cert.description_en : cert.description}
                      </p>
                    )}
                  </div>
                  {cert.image_url && (
                    <button
                      onClick={() => setSelectedCert(index)}
                      className="flex items-center text-sm font-bold uppercase tracking-widest text-primary dark:text-white hover:gap-2 transition-all"
                    >
                      {language === "en" ? "View Certificate" : "Lihat Sertifikat"} <Award className="ml-2 w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCert !== null && certificates[selectedCert] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-[110]"
            >
              <X size={32} />
            </button>
            <div className="relative w-full max-w-4xl aspect-[4/3]">
              <Image
                src={certificates[selectedCert].image_url}
                alt={certificates[selectedCert].title}
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
