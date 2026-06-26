"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Certificates from "@/components/Certificates";
import { Award, Trophy, Camera, Briefcase } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

type Profile = { name: string; bio: string; hero_image: string; about_subtitle?: string; about_title?: string; bio_en?: string; about_subtitle_en?: string; about_title_en?: string; };
type Skill = { id: number; category: string; category_en?: string; name: string; name_en?: string };
type Experience = { id: number; start_date: string; end_date: string; role: string; role_en?: string; client: string; client_en?: string; description: string; description_en?: string };
type ResumeAward = { id: number; type: string; year: string; title: string; title_en?: string; issuer: string; issuer_en?: string };
type Gear = { id: number; category: string; category_en?: string; name: string; name_en?: string };

export default function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [awards, setAwards] = useState<ResumeAward[]>([]);
  const [gear, setGear] = useState<Gear[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, resRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/resume")
        ]);

        if (profRes.ok) setProfile(await profRes.json());
        if (resRes.ok) {
          const resData = await resRes.json();
          setSkills(resData.skills || []);
          setExperiences(resData.experiences || []);
          setAwards(resData.awards || []);
          setGear(resData.gear || []);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <p className="text-white tracking-widest text-xs uppercase animate-pulse">
          {language === "en" ? "Loading Resume..." : "Memuat Resume..."}
        </p>
      </div>
    );
  }

  // Mengelompokkan skills berdasarkan kategori
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = language === "en" && skill.category_en ? skill.category_en : skill.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Mengelompokkan gear berdasarkan kategori
  const groupedGear = gear.reduce((acc, g) => {
    const cat = language === "en" && g.category_en ? g.category_en : g.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(g);
    return acc;
  }, {} as Record<string, Gear[]>);

  const heroImage = profile?.hero_image || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2000";

  const subtitle = language === "en" && profile?.about_subtitle_en ? profile.about_subtitle_en : (profile?.about_subtitle || "CREATIVE TECHNOLOGIST");
  const title = language === "en" && profile?.about_title_en ? profile.about_title_en : (profile?.about_title || "I build and create &mdash;<br/>from pixels to products.");
  const bio = language === "en" && profile?.bio_en ? profile.bio_en : (profile?.bio || "Berangkat dari ketertarikan mendalam terhadap seni visual...");

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <Image src={heroImage} alt="Hero" fill priority className="w-full h-full object-cover opacity-40 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-3xl mx-auto px-6">
            <h2 className="text-white/70 font-medium tracking-[0.3em] mb-4 uppercase text-xs md:text-sm">{subtitle}</h2>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: title }} />
          </motion.div>
        </div>
      </section>

      {/* 2. Top Bio Area */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div className="w-full aspect-[3/4] relative" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Image src={heroImage} alt="Portrait" fill className="object-cover filter grayscale hover:grayscale-0 transition-all duration-700" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
                {language === "en" ? "My Journey" : "Perjalananku"}
              </h3>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black tracking-tight">{profile?.name || "Hikra"}</h2>
              <div className="text-gray-600 leading-relaxed mb-6 space-y-4 whitespace-pre-wrap">
                {bio}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Expertise & Skills */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-10 text-center">
            {language === "en" ? "Expertise & Skills" : "Keahlian & Kemampuan"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(groupedSkills).map(([category, catSkills], idx) => (
              <motion.div key={category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <h4 className="font-bold text-sm uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {catSkills.map(skill => (
                    <span key={skill.id} className="px-3 py-1.5 text-[11px] font-medium border border-gray-200 bg-white rounded-full text-gray-700">
                      {language === "en" && skill.name_en ? skill.name_en : skill.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Experience Timeline */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-4 mb-16">
            <Briefcase className="w-6 h-6 text-black" />
            <h3 className="text-2xl font-bold tracking-tight">
              {language === "en" ? "Professional Experience" : "Pengalaman Profesional"}
            </h3>
          </div>
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {experiences.map((exp, idx) => (
              <motion.div key={exp.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-black text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_-5px_rgba(0,0,0,0.1)] transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                    <h4 className="font-bold text-lg text-black">
                      {language === "en" && exp.role_en ? exp.role_en : exp.role}
                    </h4>
                    <span className="text-xs font-bold px-3 py-1 bg-gray-100 rounded-full text-gray-600 shrink-0">{exp.start_date} - {exp.end_date}</span>
                  </div>
                  <h5 className="text-sm font-medium text-gray-500 mb-4">
                    {language === "en" && exp.client_en ? exp.client_en : exp.client}
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-2 list-none">
                    {(language === "en" && exp.description_en ? exp.description_en : exp.description).split('\n').filter((line: string) => line.trim() !== '').map((line: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-gray-300 mt-1.5">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Exhibitions & Awards */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-8">
                <Award className="w-5 h-5" />
                <h3 className="text-xl font-bold tracking-tight">
                  {language === "en" ? "Exhibitions & Features" : "Pameran & Fitur"}
                </h3>
              </div>
              <div className="space-y-6">
                {awards.filter(a => a.type === "exhibition").map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-12 text-xs font-bold text-gray-400 pt-1">{item.year}</div>
                    <div>
                      <h4 className="font-bold text-black">
                        {language === "en" && item.title_en ? item.title_en : item.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {language === "en" && item.issuer_en ? item.issuer_en : item.issuer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="flex items-center gap-3 mb-8">
                <Trophy className="w-5 h-5" />
                <h3 className="text-xl font-bold tracking-tight">
                  {language === "en" ? "Awards & Recognition" : "Penghargaan & Pengakuan"}
                </h3>
              </div>
              <div className="space-y-6">
                {awards.filter(a => a.type === "award").map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-12 text-xs font-bold text-gray-400 pt-1">{item.year}</div>
                    <div>
                      <h4 className="font-bold text-black">
                        {language === "en" && item.title_en ? item.title_en : item.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {language === "en" && item.issuer_en ? item.issuer_en : item.issuer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 6. Gear Bag */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col items-center mb-16 text-center">
            <h3 className="text-3xl font-bold tracking-tight mb-2">
              {language === "en" ? "My Arsenal" : "Peralatan Saya"}
            </h3>
            <p className="text-gray-500 text-sm">
              {language === "en"
                ? "Tools and tech stacks I use to bring stories to life."
                : "Alat dan teknologi yang saya gunakan untuk mewujudkan kisah."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedGear).map(([category, items], idx) => (
              <motion.div key={category} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="p-6 border border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-lg transition-all">
                <h4 className="font-bold uppercase tracking-wider text-xs text-gray-400 mb-4">{category}</h4>
                <ul className="space-y-3">
                  {items.map(item => (
                    <li key={item.id} className="font-medium text-sm text-black flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-black rounded-full" />
                      {language === "en" && item.name_en ? item.name_en : item.name}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Certificates />
      <Footer />
    </main>
  );
}
