"use client";

import React, { useEffect, useState } from 'react';
import { Server, Activity, AlertCircle, CheckCircle2, Loader2, ExternalLink, Clock, Github, GitCommit } from 'lucide-react';
import Link from 'next/link';

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
        <p className="text-slate-500 font-medium">Menghubungkan ke Pusat Komando Vercel...</p>
      </div>
    );
  }

  const state = deploy?.state?.toLowerCase() || 'unknown';
  
  // Progress Logic
  // Step 1: Queued/Building/Ready/Error -> Step 1 is always active if we have data
  // Step 2: Building/Ready -> Step 2 active
  // Step 3: Ready -> Step 3 active (or Error if error)

  const isQueued = state === 'queued' || state === 'building' || state === 'ready';
  const isBuilding = state === 'building' || state === 'ready';
  const isReady = state === 'ready';
  const isError = state === 'error';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Deployment Monitor</h1>
          <p className="text-slate-500 mt-1">Pantau status publikasi website Anda secara real-time.</p>
        </div>
        {isReady && deploy?.url && (
          <a 
            href={`https://${deploy.url}`} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-black/10 hover:shadow-black/20"
          >
            Buka Website <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {state === 'unconfigured' ? (
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-2xl flex flex-col items-center text-center">
          <Server className="w-12 h-12 text-amber-400 mb-4" />
          <h2 className="text-xl font-bold text-amber-800 mb-2">Vercel Belum Terhubung</h2>
          <p className="text-amber-700/80 max-w-md">
            Anda perlu memasukkan <b>Vercel API Token</b> dan <b>Project ID</b> di dalam file konfigurasi atau `.env.local` untuk mengaktifkan pusat komando ini.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
          
          <div className="mb-12 text-center">
            <h2 className="text-lg font-semibold text-slate-400 uppercase tracking-widest mb-2">Status Saat Ini</h2>
            <div className="flex items-center justify-center gap-3">
              {isError ? (
                <span className="text-4xl font-extrabold text-red-600 flex items-center gap-3">
                  <AlertCircle className="w-10 h-10" /> FAILED
                </span>
              ) : isReady ? (
                <span className="text-4xl font-extrabold text-emerald-500 flex items-center gap-3">
                  <CheckCircle2 className="w-10 h-10" /> LIVE
                </span>
              ) : isBuilding ? (
                <span className="text-4xl font-extrabold text-amber-500 flex items-center gap-3">
                  <Loader2 className="w-10 h-10 animate-spin" /> BUILDING
                </span>
              ) : (
                <span className="text-4xl font-extrabold text-blue-500 flex items-center gap-3">
                  <Activity className="w-10 h-10 animate-pulse" /> QUEUED
                </span>
              )}
            </div>
          </div>

          {/* Progress Visualizer */}
          <div className="relative">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
              {/* Animated Progress Line */}
              <div 
                className={`h-full transition-all duration-1000 ${
                  isError ? 'bg-red-500 w-full' : 
                  isReady ? 'bg-emerald-500 w-full' : 
                  isBuilding ? 'bg-amber-400 w-1/2' : 
                  'bg-blue-400 w-1/4'
                }`}
              />
            </div>

            <div className="relative flex justify-between">
              {/* Step 1: Queued */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center bg-white transition-colors duration-500 ${
                  isQueued ? (isError ? 'border-red-500 text-red-500' : 'border-blue-500 text-blue-500') : 'border-slate-200 text-slate-300'
                }`}>
                  <Activity className="w-5 h-5" />
                </div>
                <span className={`text-sm font-bold ${isQueued ? 'text-slate-700' : 'text-slate-400'}`}>Queued</span>
              </div>

              {/* Step 2: Building */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center bg-white transition-colors duration-500 ${
                  isBuilding ? (isError ? 'border-red-500 text-red-500' : 'border-amber-400 text-amber-500') : 'border-slate-200 text-slate-300'
                }`}>
                  <Loader2 className={`w-5 h-5 ${isBuilding && !isReady && !isError ? 'animate-spin' : ''}`} />
                </div>
                <span className={`text-sm font-bold ${isBuilding ? 'text-slate-700' : 'text-slate-400'}`}>Building</span>
              </div>

              {/* Step 3: Ready / Error */}
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center bg-white transition-colors duration-500 ${
                  isError ? 'border-red-500 text-red-500' : 
                  isReady ? 'border-emerald-500 text-emerald-500' : 'border-slate-200 text-slate-300'
                }`}>
                  {isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <span className={`text-sm font-bold ${isError ? 'text-red-600' : isReady ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {isError ? 'Failed' : 'Live'}
                </span>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="mt-12 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-200">
                <Server className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Server Host</p>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  Vercel Edge Network
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </p>
              </div>
            </div>

            {deploy?.created && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-200">
                  <Clock className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Terakhir Diperbarui</p>
                  <p className="text-sm font-bold text-slate-900">
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
      )}
    </div>
  );
}
