"use client";

import React, { useEffect, useState } from 'react';
import { Server, Activity, AlertCircle, CheckCircle2, Loader2, ExternalLink, Clock, GitCommit, GitBranch, User } from 'lucide-react';

export default function MonitorPage() {
  const [deploy, setDeploy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/vercel');
        const data = await res.json();
        setDeploy(data);
      } catch (error) {
        setDeploy({ state: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-slate-300 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Menghubungkan ke Server...</p>
      </div>
    );
  }

  const state = deploy?.state?.toLowerCase() || 'unknown';
  
  const isQueued = state === 'queued' || state === 'building' || state === 'ready';
  const isBuilding = state === 'building' || state === 'ready';
  const isReady = state === 'ready';
  const isError = state === 'error';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Deployment Monitor</h1>
          <p className="text-slate-500 mt-1">Status publikasi website Anda secara <i>real-time</i>.</p>
        </div>
        {isReady && deploy?.url && (
          <a 
            href={`https://${deploy.url}`} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-md"
          >
            Buka Website <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {state === 'unconfigured' ? (
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl flex flex-col items-center text-center shadow-sm">
          <Server className="w-12 h-12 text-amber-400 mb-4" />
          <h2 className="text-xl font-bold text-amber-800 mb-2">Vercel Belum Terhubung</h2>
          <p className="text-amber-700/80 max-w-md">
            Tambahkan <b>VERCEL_API_TOKEN</b> dan <b>VERCEL_PROJECT_ID</b> di dalam file konfigurasi atau `.env.local`.
          </p>
        </div>
      ) : (
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-[2rem] p-8 md:p-14 shadow-sm">
          
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Status Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 font-semibold text-[10px] tracking-widest mb-6 uppercase">
                <Activity className="w-3 h-3" /> Status Saat Ini
              </div>
              
              <div className="flex items-center justify-center">
                {isError ? (
                  <h2 className="text-5xl md:text-6xl font-black text-red-500 tracking-tighter">FAILED</h2>
                ) : isReady ? (
                  <h2 className="text-5xl md:text-6xl font-black text-emerald-500 tracking-tighter">LIVE</h2>
                ) : isBuilding ? (
                  <h2 className="text-5xl md:text-6xl font-black text-amber-500 tracking-tighter">BUILDING</h2>
                ) : (
                  <h2 className="text-5xl md:text-6xl font-black text-blue-500 tracking-tighter">QUEUED</h2>
                )}
              </div>
            </div>

            {/* Progress Pipeline */}
            <div className="w-full max-w-2xl mx-auto relative mb-16">
              {/* Background Track */}
              <div className="absolute top-6 left-6 right-6 h-1.5 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden z-0">
                {/* Active Track */}
                <div 
                  className={`h-full transition-all duration-1000 ease-out relative ${
                    isError ? 'bg-red-500 w-full' : 
                    isReady ? 'bg-emerald-400 w-full' : 
                    isBuilding ? 'bg-amber-400 w-1/2' : 
                    'bg-blue-400 w-0'
                  }`}
                />
              </div>

              <div className="relative flex justify-between z-10">
                {/* Step 1: Queued */}
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center bg-white transition-all duration-500 ${
                    isQueued ? (isError ? 'border-red-500 text-red-500' : 'border-blue-400 text-blue-500') : 'border-slate-100 text-slate-300'
                  }`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isQueued ? 'text-slate-700' : 'text-slate-300'}`}>Queued</span>
                </div>

                {/* Step 2: Building */}
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center bg-white transition-all duration-500 ${
                    isBuilding ? (isError ? 'border-red-500 text-red-500' : 'border-amber-400 text-amber-500') : 'border-slate-100 text-slate-300'
                  }`}>
                    <Loader2 className={`w-5 h-5 ${isBuilding && !isReady && !isError ? 'animate-spin' : ''}`} />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isBuilding ? 'text-slate-700' : 'text-slate-300'}`}>Building</span>
                </div>

                {/* Step 3: Ready / Error */}
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center bg-white transition-all duration-500 ${
                    isError ? 'border-red-500 text-red-500' : 
                    isReady ? 'border-emerald-400 text-emerald-500' : 'border-slate-100 text-slate-300'
                  }`}>
                    {isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isError ? 'text-red-500' : isReady ? 'text-emerald-500' : 'text-slate-300'}`}>
                    {isError ? 'Failed' : 'Live'}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Cards (Light & Clean) */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Server Details Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Server className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">Server Host</p>
                  <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    Vercel Edge Network
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isError ? 'bg-red-400' : isReady ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isError ? 'bg-red-500' : isReady ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Timestamp Card */}
              {deploy?.created && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">Terakhir Diperbarui</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {new Date(deploy.created).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'medium'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Commit Details Card (New Feature) */}
              {deploy?.commitMessage && (
                <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-6 flex items-center gap-5 md:col-span-2">
                  <div className="w-12 h-12 rounded-xl bg-white border border-blue-100 flex items-center justify-center shadow-sm shrink-0">
                    <GitCommit className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Commit Sedang Diproses</p>
                      {deploy?.commitRef && (
                        <span className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-mono">
                          <GitBranch className="w-3 h-3" /> {deploy.commitRef}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      "{deploy.commitMessage}"
                    </p>
                    {deploy?.commitAuthor && (
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-2">
                        <User className="w-3.5 h-3.5" /> Oleh {deploy.commitAuthor}
                      </p>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
