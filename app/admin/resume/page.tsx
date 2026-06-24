"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Check, X as XIcon, RefreshCw } from "lucide-react";

type Skill = { id: number; category: string; category_en: string; name: string; name_en: string; display_order: number };
type Experience = { id: number; start_date: string; end_date: string; role: string; role_en: string; client: string; client_en: string; description: string; description_en: string; display_order: number };
type Award = { id: number; type: string; year: string; title: string; title_en: string; issuer: string; issuer_en: string; display_order: number };
type Gear = { id: number; category: string; category_en: string; name: string; name_en: string; display_order: number };

export default function ResumeAdminPage() {
  const [activeTab, setActiveTab] = useState("skills");
  const [loading, setLoading] = useState(true);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [gear, setGear] = useState<Gear[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resume");
      const data = await res.json();
      setSkills(data.skills || []);
      setExperiences(data.experiences || []);
      setAwards(data.awards || []);
      setGear(data.gear || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (table: string, id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/resume/${table}?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Resume & About</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your detailed professional profile.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="flex space-x-2 border-b border-gray-200">
        {["skills", "experiences", "awards", "gear"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {loading ? (
          <div className="py-12 flex justify-center"><div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" /></div>
        ) : (
          <>
            {activeTab === "skills" && <SkillsManager items={skills} refresh={fetchData} />}
            {activeTab === "experiences" && <ExperiencesManager items={experiences} refresh={fetchData} />}
            {activeTab === "awards" && <AwardsManager items={awards} refresh={fetchData} />}
            {activeTab === "gear" && <GearManager items={gear} refresh={fetchData} />}
          </>
        )}
      </div>
    </div>
  );
}

// --- Managers ---

function SkillsManager({ items, refresh }: { items: Skill[], refresh: () => void }) {
  const [form, setForm] = useState({ id: 0, category: "", category_en: "", name: "", name_en: "", display_order: 0 });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    await fetch("/api/resume/resume_skills", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ id: 0, category: "", category_en: "", name: "", name_en: "", display_order: 0 });
    setIsEditing(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-gray-50 p-4 rounded-lg">
        <div><label className="block text-xs text-gray-500 mb-1">Category - ID</label><input required value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Category - EN</label><input value={form.category_en} onChange={e=>setForm({...form, category_en: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Skill Name - ID</label><input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Skill Name - EN</label><input value={form.name_en} onChange={e=>setForm({...form, name_en: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Order</label><input type="number" value={form.display_order} onChange={e=>setForm({...form, display_order: parseInt(e.target.value)})} className="w-full border p-2 rounded text-sm" /></div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-black text-white rounded text-sm w-full">{isEditing ? "Update" : "Add"}</button>
          {isEditing && <button type="button" onClick={() => {setIsEditing(false); setForm({ id: 0, category: "", category_en: "", name: "", name_en: "", display_order: 0 })}} className="px-4 py-2 border rounded text-sm">Cancel</button>}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b text-gray-500"><th className="pb-2">Category</th><th className="pb-2">Skill</th><th className="pb-2">Order</th><th className="pb-2 text-right">Actions</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-gray-100"><td className="py-2">{item.category}</td><td className="py-2 font-medium">{item.name}</td><td className="py-2">{item.display_order}</td>
              <td className="py-2 text-right">
                <button onClick={() => {setForm(item); setIsEditing(true)}} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4"/></button>
                <button onClick={async () => { if(confirm("Sure?")) { await fetch(`/api/resume/resume_skills?id=${item.id}`, {method:"DELETE"}); refresh(); } }} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
              </td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExperiencesManager({ items, refresh }: { items: Experience[], refresh: () => void }) {
  const [form, setForm] = useState({ id: 0, start_date: "", end_date: "", role: "", role_en: "", client: "", client_en: "", description: "", description_en: "", display_order: 0 });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    await fetch("/api/resume/resume_experiences", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ id: 0, start_date: "", end_date: "", role: "", role_en: "", client: "", client_en: "", description: "", description_en: "", display_order: 0 });
    setIsEditing(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-lg">
        <div><label className="block text-xs text-gray-500 mb-1">Start Date</label><input value={form.start_date} onChange={e=>setForm({...form, start_date: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">End Date</label><input value={form.end_date} onChange={e=>setForm({...form, end_date: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Role - ID</label><input required value={form.role} onChange={e=>setForm({...form, role: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Role - EN</label><input value={form.role_en} onChange={e=>setForm({...form, role_en: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Client/Company - ID</label><input required value={form.client} onChange={e=>setForm({...form, client: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Client/Company - EN</label><input value={form.client_en} onChange={e=>setForm({...form, client_en: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div className="col-span-1 lg:col-span-2"><label className="block text-xs text-gray-500 mb-1">Description - ID</label><textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full border p-2 rounded text-sm h-20" /></div>
        <div className="col-span-1 lg:col-span-2"><label className="block text-xs text-gray-500 mb-1">Description - EN</label><textarea value={form.description_en} onChange={e=>setForm({...form, description_en: e.target.value})} className="w-full border p-2 rounded text-sm h-20" /></div>
        <div className="col-span-1 lg:col-span-4 flex items-end gap-4">
          <div className="w-32"><label className="block text-xs text-gray-500 mb-1">Order</label><input type="number" value={form.display_order} onChange={e=>setForm({...form, display_order: parseInt(e.target.value)})} className="w-full border p-2 rounded text-sm" /></div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-black text-white rounded text-sm w-full">{isEditing ? "Update" : "Add"}</button>
            {isEditing && <button type="button" onClick={() => {setIsEditing(false); setForm({ id: 0, start_date: "", end_date: "", role: "", role_en: "", client: "", client_en: "", description: "", description_en: "", display_order: 0 })}} className="px-4 py-2 border rounded text-sm">Cancel</button>}
          </div>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b text-gray-500"><th className="pb-2">Date</th><th className="pb-2">Role & Client</th><th className="pb-2 text-right">Actions</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2 text-xs">{item.start_date} - {item.end_date}</td>
                <td className="py-2"><span className="font-medium">{item.role}</span> at {item.client}</td>
                <td className="py-2 text-right">
                  <button onClick={() => {setForm(item); setIsEditing(true)}} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={async () => { if(confirm("Sure?")) { await fetch(`/api/resume/resume_experiences?id=${item.id}`, {method:"DELETE"}); refresh(); } }} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AwardsManager({ items, refresh }: { items: Award[], refresh: () => void }) {
  const [form, setForm] = useState({ id: 0, type: "award", year: "", title: "", title_en: "", issuer: "", issuer_en: "", display_order: 0 });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    await fetch("/api/resume/resume_awards", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ id: 0, type: "award", year: "", title: "", title_en: "", issuer: "", issuer_en: "", display_order: 0 });
    setIsEditing(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-gray-50 p-4 rounded-lg">
        <div><label className="block text-xs text-gray-500 mb-1">Type</label><select value={form.type} onChange={e=>setForm({...form, type: e.target.value})} className="w-full border p-2 rounded text-sm"><option value="award">Award</option><option value="exhibition">Exhibition</option></select></div>
        <div><label className="block text-xs text-gray-500 mb-1">Year</label><input value={form.year} onChange={e=>setForm({...form, year: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Title - ID</label><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Title - EN</label><input value={form.title_en} onChange={e=>setForm({...form, title_en: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Issuer/Location - ID</label><input value={form.issuer} onChange={e=>setForm({...form, issuer: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Issuer/Location - EN</label><input value={form.issuer_en} onChange={e=>setForm({...form, issuer_en: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-black text-white rounded text-sm w-full">{isEditing ? "Update" : "Add"}</button>
            {isEditing && <button type="button" onClick={() => {setIsEditing(false); setForm({ id: 0, type: "award", year: "", title: "", title_en: "", issuer: "", issuer_en: "", display_order: 0 })}} className="px-4 py-2 border rounded text-sm">Cancel</button>}
          </div>
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b text-gray-500"><th className="pb-2">Type</th><th className="pb-2">Year</th><th className="pb-2">Title</th><th className="pb-2 text-right">Actions</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2 capitalize">{item.type}</td><td className="py-2">{item.year}</td><td className="py-2 font-medium">{item.title} <span className="font-normal text-gray-500 text-xs ml-2">{item.issuer}</span></td>
                <td className="py-2 text-right">
                  <button onClick={() => {setForm(item); setIsEditing(true)}} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={async () => { if(confirm("Sure?")) { await fetch(`/api/resume/resume_awards?id=${item.id}`, {method:"DELETE"}); refresh(); } }} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GearManager({ items, refresh }: { items: Gear[], refresh: () => void }) {
  const [form, setForm] = useState({ id: 0, category: "Camera", category_en: "", name: "", name_en: "", display_order: 0 });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    await fetch("/api/resume/resume_gear", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ id: 0, category: "Camera", category_en: "", name: "", name_en: "", display_order: 0 });
    setIsEditing(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-gray-50 p-4 rounded-lg">
        <div><label className="block text-xs text-gray-500 mb-1">Category - ID</label><input required value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Category - EN</label><input value={form.category_en} onChange={e=>setForm({...form, category_en: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Item Name - ID</label><input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Item Name - EN</label><input value={form.name_en} onChange={e=>setForm({...form, name_en: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Order</label><input type="number" value={form.display_order} onChange={e=>setForm({...form, display_order: parseInt(e.target.value)})} className="w-full border p-2 rounded text-sm" /></div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-black text-white rounded text-sm w-full">{isEditing ? "Update" : "Add"}</button>
          {isEditing && <button type="button" onClick={() => {setIsEditing(false); setForm({ id: 0, category: "Camera", category_en: "", name: "", name_en: "", display_order: 0 })}} className="px-4 py-2 border rounded text-sm">Cancel</button>}
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b text-gray-500"><th className="pb-2">Category</th><th className="pb-2">Item Name</th><th className="pb-2 text-right">Actions</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2">{item.category}</td><td className="py-2 font-medium">{item.name}</td>
                <td className="py-2 text-right">
                  <button onClick={() => {setForm(item); setIsEditing(true)}} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={async () => { if(confirm("Sure?")) { await fetch(`/api/resume/resume_gear?id=${item.id}`, {method:"DELETE"}); refresh(); } }} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
