"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, RefreshCw, Upload, Link as LinkIcon, Github } from "lucide-react";

type TechProject = {
  id: number;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  tech_stack: string;
  tech_stack_en: string;
  image_url: string;
  live_url: string;
  github_url: string;
  display_order: number;
};

export default function TechProjectsAdmin() {
  const [projects, setProjects] = useState<TechProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [form, setForm] = useState({
    id: 0, title: "", title_en: "", description: "", description_en: "", tech_stack: "", tech_stack_en: "", image_url: "", live_url: "", github_url: "", display_order: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tech-projects");
      if (res.ok) {
        setProjects(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    try {
      await fetch("/api/tech-projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      setForm({ id: 0, title: "", title_en: "", description: "", description_en: "", tech_stack: "", tech_stack_en: "", image_url: "", live_url: "", github_url: "", display_order: 0 });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/tech-projects?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Web Dev Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your tech portfolio here.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg mb-8 border border-gray-100">
          <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Project Title - ID</label><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white" placeholder="e.g. E-Commerce Dashboard" /></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Project Title - EN</label><input value={form.title_en} onChange={e=>setForm({...form, title_en: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white" placeholder="e.g. E-Commerce Dashboard" /></div>
          
          <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Tech Stack - ID</label><input value={form.tech_stack} onChange={e=>setForm({...form, tech_stack: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white" placeholder="e.g. Next.js, Tailwind, Prisma" /></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Tech Stack - EN</label><input value={form.tech_stack_en} onChange={e=>setForm({...form, tech_stack_en: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white" placeholder="e.g. Next.js, Tailwind, Prisma" /></div>
          
          <div className="md:col-span-1"><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Description - ID</label><textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm h-20 bg-white" placeholder="Deskripsi..." /></div>
          <div className="md:col-span-1"><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Description - EN</label><textarea value={form.description_en} onChange={e=>setForm({...form, description_en: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm h-20 bg-white" placeholder="Description..." /></div>
          
          <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Image URL (Screenshot)</label><input value={form.image_url} onChange={e=>setForm({...form, image_url: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white" placeholder="https://..." /></div>

          <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider flex items-center gap-1"><LinkIcon className="w-3 h-3"/> Live URL</label><input value={form.live_url} onChange={e=>setForm({...form, live_url: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white" placeholder="https://..." /></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider flex items-center gap-1"><Github className="w-3 h-3"/> Github URL</label><input value={form.github_url} onChange={e=>setForm({...form, github_url: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white" placeholder="https://..." /></div>

          <div className="md:col-span-2 flex justify-between items-center mt-2">
            <div className="w-32"><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Display Order</label><input type="number" value={form.display_order} onChange={e=>setForm({...form, display_order: parseInt(e.target.value)})} className="w-full border border-gray-300 p-2 rounded-lg text-sm bg-white" /></div>
            
            <div className="flex gap-2">
              {isEditing && <button type="button" onClick={() => {setIsEditing(false); setForm({ id: 0, title: "", title_en: "", description: "", description_en: "", tech_stack: "", tech_stack_en: "", image_url: "", live_url: "", github_url: "", display_order: 0 })}} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>}
              <button type="submit" className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2">
                {isEditing ? <Edit2 className="w-4 h-4"/> : <Plus className="w-4 h-4"/>} {isEditing ? "Update Project" : "Add Project"}
              </button>
            </div>
          </div>
        </form>

        {loading ? (
          <div className="py-12 flex justify-center"><div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div key={proj.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow group">
                <div className="h-40 bg-gray-100 relative">
                  {proj.image_url ? (
                    <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setForm(proj); setIsEditing(true); window.scrollTo(0,0); }} className="p-1.5 bg-white text-blue-600 rounded-md shadow hover:bg-blue-50"><Edit2 className="w-4 h-4"/></button>
                    <button onClick={() => handleDelete(proj.id)} className="p-1.5 bg-white text-red-600 rounded-md shadow hover:bg-red-50"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 truncate">{proj.title}</h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{proj.tech_stack}</p>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{proj.description}</p>
                  <div className="pt-2 border-t border-gray-100 flex gap-3 text-xs font-medium">
                    {proj.live_url && <a href={proj.live_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1"><LinkIcon className="w-3 h-3"/> Live</a>}
                    {proj.github_url && <a href={proj.github_url} target="_blank" rel="noreferrer" className="text-gray-600 hover:underline flex items-center gap-1"><Github className="w-3 h-3"/> Github</a>}
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 text-sm">No projects added yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
