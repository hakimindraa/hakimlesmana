"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, User, Mail, Phone, MapPin, Instagram, Facebook, Linkedin, ImageIcon } from "lucide-react";

interface Profile {
  id: number;
  name: string;
  tagline: string;
  bio: string;
  about_text: string;
  hero_image: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  instagram: string;
  facebook: string;
  linkedin: string;
}

export default function ProfileEditor() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) setProfile(await res.json());
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Failed to save profile");
      }
    } catch {
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Profile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors";
  const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Profile Editor</h1>
          <p className="text-gray-500 text-sm mt-1">Update your personal and contact information</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111] text-white text-sm font-semibold rounded-lg hover:bg-[#222] transition-colors disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      {/* Personal Info */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-100 p-6 space-y-5"
      >
        <div className="flex items-center gap-3 mb-2">
          <User className="w-5 h-5 text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Personal Info</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Name</label>
            <input type="text" value={profile.name} onChange={(e) => updateField("name", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input type="text" value={profile.tagline} onChange={(e) => updateField("tagline", e.target.value)} placeholder="Photographer & Videographer" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Short Bio</label>
          <textarea value={profile.bio} onChange={(e) => updateField("bio", e.target.value)} rows={2} placeholder="A brief description..." className={inputClass + " resize-none"} />
        </div>

        <div>
          <label className={labelClass}>About Text (full)</label>
          <textarea value={profile.about_text} onChange={(e) => updateField("about_text", e.target.value)} rows={4} placeholder="Detailed about me text..." className={inputClass + " resize-none"} />
        </div>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-xl border border-gray-100 p-6 space-y-5"
      >
        <div className="flex items-center gap-3 mb-2">
          <ImageIcon className="w-5 h-5 text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Hero Image</h2>
        </div>

        <div>
          <label className={labelClass}>Image URL (dari imgbb atau link langsung)</label>
          <input
            type="text"
            value={profile.hero_image}
            onChange={(e) => updateField("hero_image", e.target.value)}
            placeholder="https://i.ibb.co/xxxxx/hero.jpg"
            className={inputClass}
          />
        </div>

        {profile.hero_image && (
          <div className="mt-3">
            <label className={labelClass}>Preview</label>
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={profile.hero_image}
                alt="Hero preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-100 p-6 space-y-5"
      >
        <div className="flex items-center gap-3 mb-2">
          <Mail className="w-5 h-5 text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Contact</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}><Mail className="inline w-3 h-3 mr-1" />Email</label>
            <input type="email" value={profile.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}><Phone className="inline w-3 h-3 mr-1" />Phone</label>
            <input type="text" value={profile.phone} onChange={(e) => updateField("phone", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>WhatsApp Number</label>
            <input type="text" value={profile.whatsapp} onChange={(e) => updateField("whatsapp", e.target.value)} placeholder="6281234567890" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}><MapPin className="inline w-3 h-3 mr-1" />Location</label>
            <input type="text" value={profile.location} onChange={(e) => updateField("location", e.target.value)} className={inputClass} />
          </div>
        </div>
      </motion.div>

      {/* Social Media */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-100 p-6 space-y-5"
      >
        <div className="flex items-center gap-3 mb-2">
          <Instagram className="w-5 h-5 text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Social Media</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}><Instagram className="inline w-3 h-3 mr-1" />Instagram</label>
            <input type="text" value={profile.instagram} onChange={(e) => updateField("instagram", e.target.value)} placeholder="https://instagram.com/..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}><Facebook className="inline w-3 h-3 mr-1" />Facebook</label>
            <input type="text" value={profile.facebook} onChange={(e) => updateField("facebook", e.target.value)} placeholder="https://facebook.com/..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}><Linkedin className="inline w-3 h-3 mr-1" />LinkedIn</label>
            <input type="text" value={profile.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." className={inputClass} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
