"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Heart, History } from "lucide-react";

interface Profile {
  name: string;
  bio: string;
  about_text: string;
}

const AboutMe = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

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

  const bio = profile?.bio || "Saya adalah seorang fotografer yang mendedikasikan diri untuk mengeksplorasi keindahan melalui lensa.";
  const aboutText = profile?.about_text || "Perjalanan saya dimulai dari rasa ingin tahu yang besar terhadap bagaimana cahaya dapat mengubah persepsi kita tentang dunia.";

  return (
    <section id="about" className="py-24 bg-accent">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">
            About Me
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
              <h3 className="text-[11px] md:text-2xl font-bold text-primary italic leading-snug md:leading-normal">
                &quot;Menangkap momen bukan hanya soal menekan tombol, tapi soal bercerita tanpa suara.&quot;
              </h3>
              <p className="text-secondary text-[9px] md:text-base leading-relaxed">
                {bio}
              </p>
              <p className="text-secondary text-[9px] md:text-base leading-relaxed">
                {aboutText}
              </p>
            </div>

            <div className="col-span-1 space-y-4 md:space-y-6">
              <div className="flex items-start space-x-2 md:space-x-4">
                <div className="p-1 md:p-2 bg-white rounded-none">
                  <Camera className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-[9px] md:text-sm uppercase tracking-wider leading-tight md:leading-normal mb-1 md:mb-0">Gaya Fotografi</h4>
                  <p className="text-[8px] md:text-sm text-secondary leading-tight md:leading-normal">Minimalis, Clean, &amp; Emosional</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 md:space-x-4">
                <div className="p-1 md:p-2 bg-white rounded-none">
                  <History className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-[9px] md:text-sm uppercase tracking-wider leading-tight md:leading-normal mb-1 md:mb-0">Pengalaman</h4>
                  <p className="text-[8px] md:text-sm text-secondary leading-tight md:leading-normal">5+ Tahun di Industri Kreatif</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 md:space-x-4">
                <div className="p-1 md:p-2 bg-white rounded-none">
                  <Heart className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-[9px] md:text-sm uppercase tracking-wider leading-tight md:leading-normal mb-1 md:mb-0">Passion</h4>
                  <p className="text-[8px] md:text-sm text-secondary leading-tight md:leading-normal">Eksplorasi Alam &amp; Ekspresi Manusia</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-16 flex justify-center">
            <a href="/about" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-black border border-black rounded-full overflow-hidden transition-all duration-300 hover:bg-transparent hover:text-black hover:shadow-[0_0_20px_rgba(0,0,0,0.1)]">
              <span className="relative z-10 flex items-center gap-2 text-xs tracking-widest uppercase">
                View Full Portfolio & Resume
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutMe;
