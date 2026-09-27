"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, RefreshCw } from "lucide-react";

type Blog = {
  id: number;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  content: string;
  content_en: string;
  category: string;
  category_en: string;
  read_time: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
};

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [form, setForm] = useState<Blog>({
    id: 0, title: "", title_en: "", excerpt: "", excerpt_en: "", content: "", content_en: "", category: "", category_en: "", read_time: "", is_published: true, display_order: 0, created_at: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      if (res.ok) {
        setBlogs(await res.json());
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
      await fetch("/api/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      setForm({ id: 0, title: "", title_en: "", excerpt: "", excerpt_en: "", content: "", content_en: "", category: "", category_en: "", read_time: "", is_published: true, display_order: 0, created_at: "" });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your text-only blog posts here.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg mb-8 border border-gray-100">
          <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Title - ID</label><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white" placeholder="Judul artikel..." /></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Title - EN</label><input value={form.title_en} onChange={e=>setForm({...form, title_en: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white" placeholder="Article title..." /></div>
          
          <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Category - ID</label><input required value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white" placeholder="e.g. Design" /></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Category - EN</label><input value={form.category_en} onChange={e=>setForm({...form, category_en: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white" placeholder="e.g. Design" /></div>
          
          <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Read Time</label><input required value={form.read_time} onChange={e=>setForm({...form, read_time: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white" placeholder="e.g. 5 min read" /></div>
          <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Display Order</label><input type="number" value={form.display_order} onChange={e=>setForm({...form, display_order: parseInt(e.target.value)})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white" /></div>

          <div className="md:col-span-1"><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Excerpt (Ringkasan) - ID</label><textarea required value={form.excerpt} onChange={e=>setForm({...form, excerpt: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm h-20 bg-white" placeholder="Ringkasan..." /></div>
          <div className="md:col-span-1"><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Excerpt - EN</label><textarea value={form.excerpt_en} onChange={e=>setForm({...form, excerpt_en: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm h-20 bg-white" placeholder="Excerpt..." /></div>
          
          <div className="md:col-span-1"><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Content - ID (Markdown/Text)</label><textarea required value={form.content} onChange={e=>setForm({...form, content: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm h-64 bg-white font-mono" placeholder="Gunakan dua kali enter untuk paragraf baru..." /></div>
          <div className="md:col-span-1"><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Content - EN</label><textarea value={form.content_en} onChange={e=>setForm({...form, content_en: e.target.value})} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm h-64 bg-white font-mono" placeholder="Use double enter for new paragraphs..." /></div>

          <div className="md:col-span-2 flex justify-end items-center mt-2">
            <div className="flex gap-2">
              {isEditing && <button type="button" onClick={() => {setIsEditing(false); setForm({ id: 0, title: "", title_en: "", excerpt: "", excerpt_en: "", content: "", content_en: "", category: "", category_en: "", read_time: "", is_published: true, display_order: 0, created_at: "" })}} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>}
              <button type="submit" className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2">
                {isEditing ? <Edit2 className="w-4 h-4"/> : <Plus className="w-4 h-4"/>} {isEditing ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </div>
        </form>

        {loading ? (
          <div className="py-12 flex justify-center"><div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" /></div>
        ) : (
          <div className="flex flex-col gap-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow p-5 flex justify-between items-center group">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
                    <span className="bg-gray-100 px-2 py-0.5 rounded">{blog.category}</span>
                    <span>• {new Date(blog.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{blog.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1 mt-1">{blog.excerpt}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setForm(blog); setIsEditing(true); window.scrollTo(0,0); }} className="p-2 bg-gray-50 text-blue-600 rounded-lg shadow-sm border border-gray-100 hover:bg-blue-50"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete(blog.id)} className="p-2 bg-gray-50 text-red-600 rounded-lg shadow-sm border border-gray-100 hover:bg-red-50"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <div className="py-12 text-center text-gray-500 text-sm">No blog posts added yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
