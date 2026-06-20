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
  Award,
} from "lucide-react";

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image_url: string;
  description: string;
}

export default function CertificateManager() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<"url" | "file">("url");

  const [form, setForm] = useState({
    title: "",
    issuer: "",
    date: "",
    image_url: "",
    description: "",
  });

  const fetchCerts = useCallback(async () => {
    try {
      const res = await fetch("/api/certificates");
      if (res.ok) setCertificates(await res.json());
    } catch (err) {
      console.error("Failed to fetch certificates:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCerts(); }, [fetchCerts]);

  const openAddModal = () => {
    setEditingCert(null);
    setForm({ title: "", issuer: "", date: "", image_url: "", description: "" });
    setModalOpen(true);
  };

  const openEditModal = (cert: Certificate) => {
    setEditingCert(cert);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      image_url: cert.image_url,
      description: cert.description,
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
      if (res.ok) setForm((prev) => ({ ...prev, image_url: data.display_url || data.url }));
      else alert("Upload failed: " + (data.error || "Unknown error"));
    } catch { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.title) { alert("Title is required"); return; }

    try {
      const method = editingCert ? "PUT" : "POST";
      const body = editingCert ? { ...form, id: editingCert.id } : form;

      const res = await fetch("/api/certificates", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) { setModalOpen(false); fetchCerts(); }
      else { const data = await res.json(); alert("Error: " + (data.error || "Failed to save")); }
    } catch { alert("Failed to save certificate"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this certificate?")) return;
    try {
      const res = await fetch("/api/certificates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchCerts();
      else alert("Failed to delete certificate");
    } catch { alert("Failed to delete certificate"); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Certificates</h1>
          <p className="text-gray-500 text-sm mt-1">{certificates.length} certificate{certificates.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111] text-white text-sm font-semibold rounded-lg hover:bg-[#222] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Certificate
        </button>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No certificates yet</p>
          <p className="text-gray-400 text-sm mt-1">Add your certifications and achievements</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {cert.image_url && (
                <div className="relative aspect-[16/10] bg-gray-100">
                  <Image src={cert.image_url} alt={cert.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{cert.title}</p>
                    {cert.issuer && <p className="text-xs text-gray-500 mt-0.5">{cert.issuer}</p>}
                    {cert.date && <p className="text-xs text-gray-400 mt-0.5">{cert.date}</p>}
                    {cert.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{cert.description}</p>}
                  </div>
                  <div className="flex items-center gap-1 ml-3 shrink-0">
                    <button onClick={() => openEditModal(cert)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                      <Pencil className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={() => handleDelete(cert.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">{editingCert ? "Edit Certificate" : "Add Certificate"}</h2>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Certificate title" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Issuer</label>
                    <input type="text" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="Organization" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Date</label>
                    <input type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="2024" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Image</label>
                  <div className="flex gap-2 mb-3">
                    <button onClick={() => setUploadMode("url")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${uploadMode === "url" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>
                      <LinkIcon className="w-3 h-3" /> URL
                    </button>
                    <button onClick={() => setUploadMode("file")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${uploadMode === "file" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>
                      <Upload className="w-3 h-3" /> Upload
                    </button>
                  </div>
                  {uploadMode === "url" ? (
                    <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400" />
                  ) : (
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm file:mr-4 file:px-3 file:py-1 file:rounded-md file:border-0 file:bg-gray-100 file:text-xs" />
                      {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg"><div className="w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" /></div>}
                    </div>
                  )}
                  {form.image_url && (
                    <div className="mt-3 relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <Image src={form.image_url} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Optional description" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 resize-none" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600">Cancel</button>
                <button onClick={handleSave} disabled={!form.title} className="px-5 py-2.5 bg-[#111] text-white text-sm font-semibold rounded-lg hover:bg-[#222] disabled:opacity-40 disabled:cursor-not-allowed">
                  {editingCert ? "Save" : "Create"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
