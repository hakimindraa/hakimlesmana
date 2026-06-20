"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Briefcase, MapPin, Mail, Phone } from "lucide-react";

const biodataItems = [
  { icon: User, label: "Nama", value: "Hakim" },
  { icon: Briefcase, label: "Profesi", value: "Photographer" },
  { icon: MapPin, label: "Lokasi", value: "Tanjungpinang, Indonesia" },
  { icon: Mail, label: "Email", value: "hakim@example.com" },
  { icon: Phone, label: "Telepon", value: "+62 812 3456 7890" },
];

const Biodata = () => {
  return (
    <section id="biodata" className="py-24 bg-accent">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">
            Biodata
          </h2>
          <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {biodataItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-3 bg-accent rounded-none">
                    <item.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary uppercase tracking-widest mb-1">
                      {item.label}
                    </p>
                    <p className="text-lg font-medium text-primary">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Biodata;
