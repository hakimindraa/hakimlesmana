"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Tags,
  User,
  Award,
  Star,
  LogOut,
  Menu,
  X,
  Camera,
  Database,
  BarChart,
  FileText,
  ArrowRight,
  Activity,
} from "lucide-react";
import DeploymentMonitor from "@/components/DeploymentMonitor";
import ImgbbUploaderModal from "@/components/ImgbbUploaderModal";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Web Projects", href: "/admin/tech-projects", icon: Database },
  { name: "Impact Stats", href: "/admin/impact-stats", icon: BarChart },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "Certificates", href: "/admin/certificates", icon: Award },
  { name: "Resume", href: "/admin/resume", icon: User },
  { name: "Featured", href: "/admin/featured", icon: Star },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
  { name: "Monitor Server", href: "/admin/monitor", icon: Activity },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const [dbInitializing, setDbInitializing] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        if (!data.authenticated) {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleInitDb = async () => {
    setDbInitializing(true);
    try {
      const res = await fetch("/api/init-db");
      const data = await res.json();
      if (data.success) {
        alert("Database initialized successfully!");
      } else {
        alert("Failed to initialize database: " + (data.error || "Unknown error"));
      }
    } catch {
      alert("Failed to initialize database");
    } finally {
      setDbInitializing(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">HIKRA</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <button
            onClick={handleInitDb}
            disabled={dbInitializing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all w-full shadow-sm"
          >
            <Database className="w-3.5 h-3.5" />
            {dbInitializing ? "Initializing..." : "Init Database"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all w-full"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main content ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-slate-800 tracking-tight hidden sm:block">
              {pathname === "/admin" ? "Dashboard" : pathname.split("/").pop()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* ImgBB Uploader Widget */}
            <ImgbbUploaderModal />
            
            {/* Vercel Deployment Monitor Widget */}
            <DeploymentMonitor />

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <a
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              View Public Site
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
