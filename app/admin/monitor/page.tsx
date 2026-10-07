"use client";

import React, { useEffect, useState } from 'react';
import { Server, Activity, AlertCircle, CheckCircle2, Loader2, ExternalLink, Clock, Terminal } from 'lucide-react';

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
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <Loader2 className="w-12 h-12 text-slate-800 animate-spin relative z-10" />
        </div>
        <p className="text-slate-500 font-medium mt-6 font-mono text-sm tracking-widest uppercase">INITIALIZING UPLINK...</p>
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
          <p className="text-slate-500 mt-1">Status publikasi Vercel Edge Server secara *real-time*.</p>
        </div>
        {isReady && deploy?.url && (
          <a 
            href={`https://${deploy.url}`} 
            target="_blank" 
            rel="noreferrer"
            className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Launch Site <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
        <div className="relative overflow-hidden bg-[#0A0A0B] border border-slate-800 rounded-[2rem] p-8 md:p-14 shadow-2xl">
          
          {/* Cyberpunk Grid Background */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          {/* Glowing Aura */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-48 blur-[120px] pointer-events-none transition-colors duration-1000 ${
            isError ? 'bg-red-900/40' : isReady ? 'bg-emerald-600/20' : 'bg-blue-600/30'
          }`} />

          <div className="relative z-10 flex flex-col items-center">
            
            {/* Status Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 font-mono text-[10px] tracking-[0.2em] mb-6 uppercase">
                <Terminal className="w-3 h-3" /> System Status
              </div>
              
              <div className="flex items-center justify-center">
                {isError ? (
                  <h2 className="text-5xl md:text-6xl font-black text-red-500 tracking-tighter drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]">
                    FAILED
                  </h2>
                ) : isReady ? (
                  <h2 className="text-5xl md:text-6xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_25px_rgba(52,211,153,0.5)]">
                    ONLINE
                  </h2>
                ) : isBuilding ? (
                  <h2 className="text-5xl md:text-6xl font-black text-amber-400 tracking-tighter drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]">
                    BUILDING
                  </h2>
                ) : (
                  <h2 className="text-5xl md:text-6xl font-black text-blue-400 tracking-tighter drop-shadow-[0_0_25px_rgba(96,165,250,0.5)]">
                    QUEUED
                  </h2>
                )}
              </div>
            </div>

            {/* Progress Pipeline */}
            <div className="w-full max-w-2xl mx-auto relative mb-16">
              {/* Background Track */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full overflow-hidden">
                {/* Glowing Active Track */}
                <div 
                  className={`h-full transition-all duration-1000 ease-out relative ${
                    isError ? 'bg-red-500 w-full shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 
                    isReady ? 'bg-emerald-400 w-full shadow-[0_0_15px_rgba(52,211,153,0.8)]' : 
                    isBuilding ? 'bg-amber-400 w-1/2 shadow-[0_0_15px_rgba(251,191,36,0.8)]' : 
                    'bg-blue-400 w-1/4 shadow-[0_0_15px_rgba(96,165,250,0.8)]'
                  }`}
                />
              </div>

              <div className="relative flex justify-between">
                {/* Step 1: Queued */}
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-[#0A0A0B] transition-all duration-500 relative ${
                    isQueued ? (isError ? 'border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.3)]') : 'border-white/10 text-white/30'
                  }`}>
                    {isQueued && !isError && <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping opacity-50" />}
                    <Activity className="w-5 h-5 relative z-10" />
                  </div>
                  <span className={`text-xs font-mono tracking-wider uppercase ${isQueued ? 'text-white' : 'text-white/30'}`}>Queued</span>
                </div>

                {/* Step 2: Building */}
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-[#0A0A0B] transition-all duration-500 relative ${
                    isBuilding ? (isError ? 'border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-amber-400 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]') : 'border-white/10 text-white/30'
                  }`}>
                    {isBuilding && !isReady && !isError && <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping opacity-50" />}
                    <Loader2 className={`w-5 h-5 relative z-10 ${isBuilding && !isReady && !isError ? 'animate-spin' : ''}`} />
                  </div>
                  <span className={`text-xs font-mono tracking-wider uppercase ${isBuilding ? 'text-white' : 'text-white/30'}`}>Building</span>
                </div>

                {/* Step 3: Ready / Error */}
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-[#0A0A0B] transition-all duration-500 relative ${
                    isError ? 'border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 
                    isReady ? 'border-emerald-400 text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)]' : 'border-white/10 text-white/30'
                  }`}>
                    {isReady && <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping opacity-70" />}
                    {isError ? <AlertCircle className="w-5 h-5 relative z-10" /> : <CheckCircle2 className="w-5 h-5 relative z-10" />}
                  </div>
                  <span className={`text-xs font-mono tracking-wider uppercase ${isError ? 'text-red-500 font-bold' : isReady ? 'text-emerald-400 font-bold' : 'text-white/30'}`}>
                    {isError ? 'Failed' : 'Live'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tech Details Terminal */}
            <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/5 flex items-center justify-center">
                  <Server className="w-5 h-5 text-white/50" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-1">Target Host</p>
                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                    Vercel Edge Network
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isError ? 'bg-red-400' : isReady ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isError ? 'bg-red-500' : isReady ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    </span>
                  </p>
                </div>
              </div>

              {deploy?.created && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/5 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white/50" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-1">Last Deployment</p>
                    <p className="text-sm font-semibold text-white">
                      {new Date(deploy.created).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'medium'
                      })}
                    </p>
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
