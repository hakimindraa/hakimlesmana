"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, StarOff, Save } from "lucide-react";

interface Photo {
  id: number;
  title: string;
  src: string;
  category: string;
  is_featured: boolean;
  featured_description: string;
  display_order: number;
}

export default function FeaturedManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch("/api/photos");
      if (res.ok) setPhotos(await res.json());
    } catch (err) {
      console.error("Failed to fetch photos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  const toggleFeatured = async (photo: Photo) => {
    setSaving(photo.id);
    try {
      const res = await fetch("/api/photos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...photo,
          is_featured: !photo.is_featured,
        }),
      });
      if (res.ok) fetchPhotos();
      else alert("Failed to update");
    } catch {
      alert("Failed to update");
    } finally {
      setSaving(null);
    }
  };

  const updateDescription = async (photo: Photo, description: string) => {
    try {
      await fetch("/api/photos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...photo, featured_description: description }),
      });
    } catch {
      console.error("Failed to save description");
    }
  };

  const featuredPhotos = photos.filter((p) => p.is_featured);
  const otherPhotos = photos.filter((p) => !p.is_featured);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Featured Works</h1>
        <p className="text-gray-500 text-sm mt-1">
          Select which photos appear in the Featured Works section on your homepage.
          Currently {featuredPhotos.length} featured.
        </p>
      </div>

      {/* Featured photos */}
      {featuredPhotos.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" /> Featured ({featuredPhotos.length})
          </h2>
          <div className="space-y-3">
            {featuredPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-xl p-4"
              >
                <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                  <Image src={photo.src} alt={photo.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{photo.title}</p>
                  <p className="text-xs text-gray-500">{photo.category}</p>
                  <input
                    type="text"
                    defaultValue={photo.featured_description}
                    placeholder="Featured description (optional)"
                    onBlur={(e) => updateDescription(photo, e.target.value)}
                    className="mt-2 w-full px-3 py-1.5 border border-amber-200 rounded-md text-xs bg-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  onClick={() => toggleFeatured(photo)}
                  disabled={saving === photo.id}
                  className="shrink-0 w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors disabled:opacity-50"
                  title="Remove from featured"
                >
                  {saving === photo.id ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <StarOff className="w-4 h-4" />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All other photos */}
      <div>
        <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">
          All Photos ({otherPhotos.length})
        </h2>

        {otherPhotos.length === 0 && photos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No photos available</p>
            <p className="text-gray-400 text-sm mt-1">Add photos in Gallery Manager first</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {otherPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3]">
                  <Image src={photo.src} alt={photo.title} fill className="object-cover" sizes="25vw" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => toggleFeatured(photo)}
                      disabled={saving === photo.id}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-amber-50 transition-colors shadow-lg disabled:opacity-50"
                      title="Add to featured"
                    >
                      {saving === photo.id ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                      ) : (
                        <Star className="w-4 h-4 text-amber-500" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-900 truncate">{photo.title}</p>
                  <p className="text-[10px] text-gray-400">{photo.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Info notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <p className="text-blue-800 text-sm font-medium">💡 Tip</p>
        <p className="text-blue-700 text-xs mt-1">
          Click the <Star className="inline w-3 h-3 text-amber-500" /> icon on any photo to toggle it as a featured work. Featured photos will appear in the &quot;Featured Works&quot; section on your homepage.
        </p>
      </div>
    </div>
  );
}
