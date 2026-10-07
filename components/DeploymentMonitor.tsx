"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Server, Activity, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export default function DeploymentMonitor() {
  const [status, setStatus] = useState<string>('loading');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/vercel');
        const data = await res.json();
        setStatus(data.state?.toLowerCase() || 'error');
        if (data.url) setUrl(data.url);
      } catch {
        setStatus('error');
      }
    };

    fetchStatus();
    // Poll API setiap 5 detik
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'unconfigured') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-medium border border-slate-200">
        <Server className="w-3.5 h-3.5" />
        <span>Vercel Belum Dikonfigurasi</span>
      </div>
    );
  }

  const getStatusDisplay = () => {
    switch (status) {
      case 'ready':
        return { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2, text: 'Live - Ready' };
      case 'building':
        return { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: Loader2, text: 'Deploying...', spin: true };
      case 'queued':
        return { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: Activity, text: 'Queued' };
      case 'error':
        return { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle, text: 'Deploy Error' };
      default:
        return { color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: Server, text: 'Checking...' };
    }
  };

  const config = getStatusDisplay();
  const Icon = config.icon;

  return (
    <Link href="/admin/monitor" className={`flex items-center gap-2 px-3 py-1.5 ${config.bg} ${config.color} ${config.border} border rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-105 cursor-pointer`}>
      <Icon className={`w-4 h-4 ${config.spin ? 'animate-spin' : ''}`} />
      <span>{config.text}</span>
    </Link>
  );
}
