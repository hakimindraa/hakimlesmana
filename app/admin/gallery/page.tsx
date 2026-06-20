"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Link as LinkIcon,
  Search,
  Filter,
  ImageIcon,
  Star,
} from "lucide-react";

interface Photo {
  id: number;
  title: string;
  src: string;
  category: string;
  is_featured: boolean;
  featured_description: string;
  display_order: number;
}

interface Category {
  id: number;
  name: string;
}

export default function GalleryManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<"url" | "file">("url");

  // Form state
  const [form, setForm] = useState({
    title: "",
    src: "",
    category: "",
    is_featured: false,
    featured_description: "",
    display_order: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      const [photosRes, catsRes] = await Promise.all([
        fetch("/api/photos"),
        fetch("/api/categories"),
      ]);
      if (photosRes.ok) setPhotos(await photosRes.json());
      if (catsRes.ok) setCategories(await catsRes.json());
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAddModal = () => {
    setEditingPhoto(null);
    setForm({ title: "", src: "", category: categories[0]?.name || "", is_featured: false, featured_description: "", display_order: 0 });
    setModalOpen(true);
  };

  const openEditModal = (photo: Photo) => {
    setEditingPhoto(photo);
    setForm({
      title: photo.title,
      src: photo.src,
      category: photo.category,
      is_featured: photo.is_featured,
      featured_description: photo.featured_description || "",
      display_order: photo.display_order,
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        setForm((prev) => ({ ...prev, src: data.display_url || data.url }));
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.src || !form.category) {
      alert("Title, image URL, and category are required");
      return;
    }

    try {
      const method = editingPhoto ? "PUT" : "POST";
      const body = editingPhoto ? { ...form, id: editingPhoto.id } : form;

      const res = await fetch("/api/photos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || "Failed to save"));
      }
    } catch {
      alert("Failed to save photo");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const res = await fetch("/api/photos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) fetchData();
      else alert("Failed to delete photo");
    } catch {
      alert("Failed to delete photo");
    }
  };

  const filteredPhotos = photos.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === "All" || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gallery Manager</h1>
          <p className="text-gray-500 text-sm mt-1">{photos.length} photos total</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111] text-white text-sm font-semibold rounded-lg hover:bg-[#222] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Photo
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 appearance-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No photos found</p>
          <p className="text-gray-400 text-sm mt-1">
            {photos.length === 0 ? "Add your first photo to get started" : "Try a different search or filter"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                {photo.is_featured && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Featured
                  </div>
                )}
                {/* Action overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => openEditModal(photo)}
                    className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900 truncate">{photo.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{photo.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingPhoto ? "Edit Photo" : "Add New Photo"}
                </h2>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Photo title"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>

                {/* Image source */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Image</label>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setUploadMode("url")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        uploadMode === "url" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" /> URL
                    </button>
                    <button
                      onClick={() => setUploadMode("file")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        uploadMode === "file" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Upload className="w-3 h-3" /> Upload
                    </button>
                  </div>

                  {uploadMode === "url" ? (
                    <input
                      type="text"
                      value={form.src}
                      onChange={(e) => setForm({ ...form, src: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                    />
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm file:mr-4 file:px-3 file:py-1 file:rounded-md file:border-0 file:bg-gray-100 file:text-xs file:font-medium"
                      />
                      {uploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Preview */}
                  {form.src && (
                    <div className="mt-3 relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <Image src={form.src} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 appearance-none cursor-pointer"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      form.is_featured ? "bg-amber-500" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
                        form.is_featured ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700 font-medium">Featured Work</span>
                </div>

                {form.is_featured && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      Featured Description
                    </label>
                    <textarea
                      value={form.featured_description}
                      onChange={(e) => setForm({ ...form, featured_description: e.target.value })}
                      placeholder="Short description for featured section"
                      rows={2}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 resize-none"
                    />
                  </div>
                )}

                {/* Display order */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Display Order</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.title || !form.src || !form.category}
                  className="px-5 py-2.5 bg-[#111] text-white text-sm font-semibold rounded-lg hover:bg-[#222] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {editingPhoto ? "Save Changes" : "Add Photo"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
