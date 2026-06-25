"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, X, RefreshCw, Lock } from "lucide-react";

interface Stat {
  id: number;
  value: string;
  value_en: string;
  label: string;
  label_en: string;
  display_order: number;
}

export default function AdminImpactStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Stat>>({});
  const [isAdding, setIsAdding] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/impact-stats");
      const data = await res.json();
      setStats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSave = async (id?: number) => {
    try {
      const method = id ? "PUT" : "POST";
      const payload = id ? { ...formData, id } : formData;

      const res = await fetch("/api/impact-stats", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setEditingId(null);
        setIsAdding(false);
        setFormData({});
        fetchStats();
      } else {
        alert("Failed to save stat");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving stat");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this stat?")) return;
    try {
      const res = await fetch(`/api/impact-stats?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchStats();
      } else {
        alert("Failed to delete stat");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting stat");
    }
  };

  const startEdit = (stat: Stat) => {
    setEditingId(stat.id);
    setFormData(stat);
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Impact Stats</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the numbers shown below the Hero section.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchStats}
            className="p-2 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setFormData({ display_order: stats.length + 1 });
            }}
            disabled={isAdding || editingId !== null}
            className="flex items-center gap-2 px-4 py-2 bg-[#0f1117] text-white rounded-lg text-sm font-medium hover:bg-black transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Add Stat
          </button>
        </div>
      </div>

      {/* --- NOTIFICATION BANNER --- */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 md:p-5 flex items-start gap-3 md:gap-4">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg shrink-0">
          <Lock className="w-5 h-5 text-amber-700 dark:text-amber-500" />
        </div>
        <div>
          <h3 className="font-bold text-amber-900 dark:text-amber-400">Fitur Saat Ini Disembunyikan</h3>
          <p className="text-sm mt-1 text-amber-800/80 dark:text-amber-500/80 leading-relaxed">
            Komponen statistik ini sedang tidak ditampilkan di halaman utama (Homepage). 
            Anda tetap bisa mengelola (menambah/mengubah/menghapus) data di bawah ini seperti biasa. 
            Semua perubahan akan langsung muncul secara otomatis jika sewaktu-waktu fitur ini Anda minta untuk diaktifkan kembali.
          </p>
        </div>
      </div>
      {/* ------------------------- */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4 w-16">Order</th>
                <th className="p-4">Value (ID / EN)</th>
                <th className="p-4">Label (ID / EN)</th>
                <th className="p-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {isAdding && (
                <tr className="bg-blue-50/50">
                  <td className="p-4">
                    <input
                      type="number"
                      value={formData.display_order || ""}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                      className="w-16 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </td>
                  <td className="p-4 space-y-2">
                    <input
                      type="text"
                      placeholder="Value (e.g. 50+)"
                      value={formData.value || ""}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Value EN (Optional)"
                      value={formData.value_en || ""}
                      onChange={(e) => setFormData({ ...formData, value_en: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-gray-600 outline-none"
                    />
                  </td>
                  <td className="p-4 space-y-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. Proyek Selesai)"
                      value={formData.label || ""}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Label EN (Optional)"
                      value={formData.label_en || ""}
                      onChange={(e) => setFormData({ ...formData, label_en: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-gray-600 outline-none"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleSave()} className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={cancelEdit} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {loading && !isAdding && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">Loading...</td>
                </tr>
              )}

              {!loading && stats.length === 0 && !isAdding && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No stats found. Click "Add Stat" to create one.</td>
                </tr>
              )}

              {stats.map((stat) => {
                const isEditing = editingId === stat.id;

                if (isEditing) {
                  return (
                    <tr key={stat.id} className="bg-blue-50/50">
                      <td className="p-4">
                        <input
                          type="number"
                          value={formData.display_order || ""}
                          onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                          className="w-16 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </td>
                      <td className="p-4 space-y-2">
                        <input
                          type="text"
                          value={formData.value || ""}
                          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Value EN"
                          value={formData.value_en || ""}
                          onChange={(e) => setFormData({ ...formData, value_en: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded text-gray-600 outline-none"
                        />
                      </td>
                      <td className="p-4 space-y-2">
                        <input
                          type="text"
                          value={formData.label || ""}
                          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Label EN"
                          value={formData.label_en || ""}
                          onChange={(e) => setFormData({ ...formData, label_en: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded text-gray-600 outline-none"
                        />
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleSave(stat.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={cancelEdit} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={stat.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-medium text-gray-500">{stat.display_order}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-400 mt-1">{stat.value_en || "-"}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{stat.label}</div>
                      <div className="text-xs text-gray-400 mt-1">{stat.label_en || "-"}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: 1 }}>
                        <button onClick={() => startEdit(stat)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(stat.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
