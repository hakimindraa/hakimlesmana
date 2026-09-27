"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Tags,
  Award,
  Star,
  BookOpen,
  Clock,
  FileText,
  Plus,
  ArrowRight,
  Settings
} from "lucide-react";
import Link from "next/link";

interface Stats {
  photos: number;
  categories: number;
  certificates: number;
  featured: number;
  blogs: number;
  drafts: number;
}

const statCards = [
  { key: "photos", label: "Total Photos", icon: ImageIcon, color: "from-blue-500 to-blue-600", href: "/admin/gallery" },
  { key: "categories", label: "Categories", icon: Tags, color: "from-emerald-500 to-emerald-600", href: "/admin/categories" },
  { key: "certificates", label: "Certificates", icon: Award, color: "from-amber-500 to-amber-600", href: "/admin/certificates" },
  { key: "featured", label: "Featured Works", icon: Star, color: "from-purple-500 to-purple-600", href: "/admin/featured" },
  { key: "blogs", label: "Published Blogs", icon: BookOpen, color: "from-rose-500 to-rose-600", href: "/admin/blogs" },
  { key: "drafts", label: "Scheduled Drafts", icon: Clock, color: "from-yellow-500 to-orange-600", href: "/admin/blogs" },
];

const quickActions = [
  { label: "Upload Bulk .md", href: "/admin/blogs", icon: FileText, desc: "Upload markdown blogs" },
  { label: "Add Photo", href: "/admin/gallery", icon: Plus, desc: "Upload new photo to gallery" },
  { label: "Edit Profile", href: "/admin/profile", icon: Settings, desc: "Update your bio & contact" },
  { label: "Manage Categories", href: "/admin/categories", icon: Tags, desc: "Add or edit categories" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ photos: 0, categories: 0, certificates: 0, featured: 0, blogs: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [photosRes, categoriesRes, certsRes, blogsRes] = await Promise.all([
          fetch("/api/photos"),
          fetch("/api/categories"),
          fetch("/api/certificates"),
          fetch("/api/blogs"),
        ]);

        const photos = photosRes.ok ? await photosRes.json() : [];
        const categories = categoriesRes.ok ? await categoriesRes.json() : [];
        const certs = certsRes.ok ? await certsRes.json() : [];
        const blogs = blogsRes.ok ? await blogsRes.json() : [];

        setStats({
          photos: Array.isArray(photos) ? photos.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
          certificates: Array.isArray(certs) ? certs.length : 0,
          featured: Array.isArray(photos) ? photos.filter((p: { is_featured: boolean }) => p.is_featured).length : 0,
          blogs: Array.isArray(blogs) ? blogs.filter((b: { is_published: boolean }) => b.is_published).length : 0,
          drafts: Array.isArray(blogs) ? blogs.filter((b: { is_published: boolean }) => !b.is_published).length : 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s an overview of your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {statCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link href={card.href} className="block bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow group h-full">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "—" : stats[card.key as keyof Stats]}
              </p>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
            >
              <Link
                href={action.href}
                className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group h-full"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors flex-shrink-0">
                  <action.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{action.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
