"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Camera,
  UserCircle,
  Map,
  FileText,
  Layers,
  Image as ImageIcon,
  PenTool,
  MessageSquare
} from "lucide-react";

const skills = [
  {
    name: "Photography",
    desc: "Teknik pengambilan gambar profesional dengan berbagai peralatan.",
    icon: Camera,
  },
  {
    name: "Portrait Photography",
    desc: "Menangkap karakter dan emosi melalui foto manusia.",
    icon: UserCircle,
  },
  {
    name: "Landscape Photography",
    desc: "Keindahan alam dan lingkungan dalam bingkai visual.",
    icon: Map,
  },
  {
    name: "Event Documentation",
    desc: "Merekam momen penting dalam acara formal maupun non-formal.",
    icon: FileText,
  },
  {
    name: "Adobe Lightroom",
    desc: "Pengolahan warna dan tone untuk hasil yang dramatis.",
    icon: Layers,
  },
  {
    name: "Adobe Photoshop",
    desc: "Retouching dan manipulasi foto tingkat lanjut.",
    icon: ImageIcon,
  },
  {
    name: "Photo Retouching",
    desc: "Pembersihan dan penyempurnaan detail pada foto.",
    icon: PenTool,
  },
  {
    name: "Visual Storytelling",
    desc: "Menyampaikan cerita melalui rangkaian gambar yang bermakna.",
    icon: MessageSquare,
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Skills</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 group"
            >
              <skill.icon className="w-10 h-10 mb-6 text-secondary group-hover:text-primary transition-colors" />
              <h3 className="text-xl font-bold mb-3">{skill.name}</h3>
              <p className="text-secondary text-sm leading-relaxed">
                {skill.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
