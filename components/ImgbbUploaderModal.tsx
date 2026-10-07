"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { CloudUpload, X, Copy, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";

export default function ImgbbUploaderModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError("");
      setUploadedUrl("");
      setCopied(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/imgbb", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setUploadedUrl(data.url);
      } else {
        setError(data.error || "Gagal mengunggah gambar");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(uploadedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setFile(null);
    setUploadedUrl("");
    setCopied(false);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white text-slate-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 hover:text-blue-600 rounded-lg text-xs font-semibold shadow-sm transition-all"
        title="Upload Image to ImgBB"
      >
        <CloudUpload className="w-4 h-4" />
        <span className="hidden md:inline">Uploader</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" /> ImgBB Uploader
              </h3>
              <button 
                onClick={() => { setIsOpen(false); reset(); }}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {!uploadedUrl ? (
                <div className="space-y-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handleFileChange}
                    />
                    {file ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle2 className="w-10 h-10 text-blue-500 mb-2" />
                        <p className="text-sm font-semibold text-slate-700">{file.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <CloudUpload className="w-10 h-10 text-slate-300 mb-3" />
                        <p className="text-sm font-medium text-slate-600">Klik untuk memilih gambar</p>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (Maksimal 32MB)</p>
                      </div>
                    )}
                  </div>

                  {error && <p className="text-xs text-red-500 font-medium text-center bg-red-50 py-2 rounded-lg">{error}</p>}

                  <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10"
                  >
                    {uploading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Mengunggah ke Awan...</>
                    ) : (
                      <><CloudUpload className="w-4 h-4" /> Dapatkan Link Gambar</>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-lg">Sukses Diunggah!</h4>
                    <p className="text-sm text-slate-500 text-center mt-1">Gambar Anda sudah aman di server ImgBB.</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-500">Link URL Gambar Anda:</label>
                    <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-lg border border-slate-200">
                      <input 
                        type="text" 
                        value={uploadedUrl} 
                        readOnly 
                        className="flex-1 bg-transparent border-none text-xs text-slate-600 font-mono px-2 focus:outline-none focus:ring-0" 
                      />
                      <button 
                        onClick={handleCopy}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all ${copied ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50'}`}
                      >
                        {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Tersalin!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={reset}
                    className="w-full py-2.5 text-slate-500 text-sm font-semibold hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200 rounded-xl"
                  >
                    Upload Gambar Lain
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
