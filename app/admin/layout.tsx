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
} from "lucide-react";

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
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f1117] text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-white/70" />
            <span className="text-lg font-bold tracking-tight">HIKRA</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5">Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <button
            onClick={handleInitDb}
            disabled={dbInitializing}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all w-full"
          >
            <Database className="w-4 h-4" />
            {dbInitializing ? "Initializing..." : "Init Database"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main content ── */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-sm font-medium text-gray-500 capitalize hidden lg:block">
            {pathname === "/admin" ? "Dashboard" : pathname.split("/").pop()}
          </div>
          <a
            href="/"
            target="_blank"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            View Site →
          </a>
        </header>

        {/* Page content */}
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
