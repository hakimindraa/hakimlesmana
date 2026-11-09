Tugas: redesain TAMPILAN (UI/visual) website portofolio di project ini. Bukan mengubah fungsi.

LANGKAH 0 - WAJIB, SEBELUM MENGUBAH APA PUN
1. Baca .agents/skills/design-taste-frontend/SKILL.md sampai selesai. (SELESAI)
2. Baca file di .agents/skills/design-taste-frontend/references/ yang relevan dengan tipografi, layout, spacing, warna, dan motion. (SELESAI)
3. Jangan menjalankan file apa pun di folder .agents/skills/design-taste-frontend/scripts/ tanpa izin user.
4. Ringkasan 6 Aturan Desain Inti:
   - Anti-Tells AI Slop: Bersihkan gradasi ungu, glow neon, teks bergradasi, status dot kedip tak fungsional, dan pill/card berlebihan.
   - Tipografi Berkarakter & Skala Kontras Tinggi: Sedikit tingkatan ukuran, rentang kontras tegas (display besar, teks isi nyaman, tak bertingkat rapat).
   - Palet Warna Berbasis Token Semantik: Konsisten untuk Light Mode & Dark Mode (--bg, --surface, --ink, --muted, --accent).
   - Tata Letak Berbasis Konten: Whitespace sengaja, variasi komposisi tiap seksi (tidak melulu card row/bento berulang).
   - Motion Terkoreografi Tunggal: Satu "signature move", micro-interaction responsif, taat prefers-reduced-motion.
   - Karya Visual Nyata Sebagai Pahlawan: Menyorot foto & project nyata dengan tata letak editorial yang bersih.

ARAH DESAIN
- Modern, segar, rapi, editorial, minimalis berbobot. Banyak ruang kosong (intentional whitespace), hierarki jelas, mudah dibaca.
- Sistem tema konsisten: Mendukung Light Mode & Dark Mode yang sudah ada via CSS variables dan Tailwind class tokens (bukan hex warna acak hardcoded di JSX).
- Palet warna disiplin: 1 warna aksen fungsional, kontras teks memenuhi standar aksesibilitas (WCAG AA).
- Tipografi kuat: Kombinasi display yang berkarakter dengan sans yang bersih dan nyaman dibaca panjang.
- Hindari tampilan generik AI: Tanpa card di mana-mana, tanpa border berlebihan, tanpa badge pill klise ("introducing/new"), tanpa ikon dekoratif tanpa fungsi.
- Animasi halus dan seperlunya, satu signature entrance, hormati prefers-reduced-motion.
- Responsif penuh: Tatanan khusus untuk mobile, tablet, dan desktop.

BATASAN KERAS - JANGAN SENTUH SAMA SEKALI
- Folder app/api/ dan semua route handler
- middleware.ts
- Folder lib/ (logika, koneksi database, query, helper server)
- File .env, .env.local, .env.example
- Skema, migrasi, dan seed database
- File skrip di root: fix-db*.js, init-stats.js, scratch_*, dan sejenisnya
- next.config.ts, package.json, package-lock.json
- Halaman admin (app/admin/) dan halaman login (app/login/): jangan diubah di tahap ini

YANG BOLEH DIUBAH
- Styling: Tailwind class, CSS, app/globals.css, konfigurasi tema di tailwind.config.ts dan font di app/layout.tsx (menggunakan next/font/google)
- Markup/JSX di app/ (halaman publik: /, /about, /projects, /gallery, /blog, /blog/[slug]) dan layout
- Komponen publik di components/: Navbar.tsx, Footer.tsx, HeroV2.tsx, FeaturedWorks.tsx, WebDevFeatured.tsx, AboutMe.tsx, RecentBlog.tsx, Certificates.tsx, ImpactStats.tsx
- Aset visual di public/ (tambah saja, jangan hapus yang sudah ada)

ATURAN MENJAGA FUNGSI
- Semua props, fetch data, server action, nama field, dan alur data HARUS tetap sama persis.
- Fitur multi-bahasa (LanguageContext / useLanguage) WAJIB dipertahankan di seluruh halaman dan komponen (dukungan penuh dwibahasa ID & EN).
- Fitur dark/light mode toggle di Navbar dan ThemeProvider WAJIB tetap berfungsi mulus.
- Jangan ganti struktur route, nama file halaman, atau parameter dinamis seperti [slug].
- Jangan menambah atau menghapus logika bisnis. Jika menurutmu perubahan UI butuh data backend baru, berhenti dan tanyakan dulu.

CARA KERJA
1. Rencana Eksekusi: Buat dan sepakati rancangan struktur visual & layout di plan.md sebelum menyentuh kode.
2. Design Tokens: Mulai dari tokens warna (light/dark), tipografi, dan scale di app/globals.css serta tailwind.config.ts.
3. Global Shell: Redesain Navbar.tsx dan Footer.tsx agar menyatu dengan identitas baru.
4. Beranda (/): Redesain app/page.tsx beserta komponen pendukungnya (HeroV2.tsx, FeaturedWorks.tsx, WebDevFeatured.tsx, AboutMe.tsx, RecentBlog.tsx).
5. Halaman Publik Lainnya:
   - About (/about): app/about/page.tsx dan Certificates.tsx
   - Projects (/projects): app/projects/page.tsx
   - Gallery (/gallery): app/gallery/page.tsx
   - Blog (/blog & /blog/[slug]): app/blog/page.tsx dan app/blog/[slug]/page.tsx
6. Verifikasi: Jalankan build (`npm run build`) setelah tiap tahap selesai untuk memastikan tidak ada error.
7. Di akhir, berikan rekapitulasi file yang disentuh dan konfirmasi kepatuhan terhadap batasan keras.
