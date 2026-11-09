# Rencana Perbaikan Navigasi & Pembersihan Footer (Plan)

Dokumen ini merinci rencana teknis untuk memperbaiki navigasi dan membersihkan tautan mati (*dead links*) pada website portofolio sesuai pilihan yang telah disetujui: **1A, 2A, 3B, 4, dan 5**.

---

## 1. Ringkasan Perubahan yang Disetujui

| No | Komponen / Area | Masalah Saat Ini | Solusi yang Disetujui |
|---|---|---|---|
| **1A** | **Tombol "Kontak" di Navbar** | Link mengarah ke email tiruan `mailto:hakim@example.com` (Desktop & Mobile). | Diubah menjadi `/#contact` agar otomatis melakukan *smooth scroll* ke bagian kontak di Footer dari halaman mana pun. |
| **2A** | **Link Privacy Policy & Terms of Service** | Menggunakan `href="#"` (dead link) di bagian bottom bar Footer. | Dihapus dari Footer agar tampilan lebih bersih, minimalis, dan tidak ada tombol mati. |
| **3B** | **Form Newsletter di Footer** | Hanya menampilkan pesan sukses tiruan tanpa menyimpan email ke database. | Dihapus dan tata letak disederhanakan agar fokus ke informasi kontak utama (Email, Telepon, Lokasi). |
| **4** | **Logo "HAKIM" di Navbar** | Menggunakan `href="#home"` sehingga tidak bisa kembali ke beranda saat berada di `/about`, `/gallery`, dll. | Diganti menjadi rute absolut `href="/"` (atau `Link href="/"`) agar selalu kembali ke Beranda. |
| **5** | **Logo di Footer** | Sama seperti navbar, menggunakan `href="#home"`. | Diganti menjadi `href="/"` agar konsisten dapat kembali ke Beranda dari halaman mana pun. |

---

## 2. Rincian Teknis Implementasi Berdasarkan File

### A. `components/Navbar.tsx`
1. **Logo Link (Baris ~56):**
   - **Sebelum:**
     ```tsx
     <a href="#home" className="shrink-0 hover:opacity-70 transition-opacity">
       <Image src="/icon2.png" ... />
     </a>
     ```
   - **Sesudah:**
     ```tsx
     <Link href="/" className="shrink-0 hover:opacity-70 transition-opacity">
       <Image src="/icon2.png" ... />
     </Link>
     ```
2. **Tombol Kontak Desktop (Baris ~111):**
   - **Sebelum:**
     ```tsx
     <a href="mailto:hakim@example.com" ...>
       {language === "en" ? "Contact" : "Kontak"}
     </a>
     ```
   - **Sesudah:**
     ```tsx
     <Link href="/#contact" ...>
       {language === "en" ? "Contact" : "Kontak"}
     </Link>
     ```
3. **Tombol Kontak Mobile Menu (Baris ~153):**
   - **Sebelum:**
     ```tsx
     <a href="mailto:hakim@example.com" ...>
       {language === "en" ? "Contact" : "Kontak"}
     </a>
     ```
   - **Sesudah:**
     ```tsx
     <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} ...>
       {language === "en" ? "Contact" : "Kontak"}
     </Link>
     ```

---

### B. `components/Footer.tsx`
1. **Logo Footer (Baris ~169):**
   - Mengganti `<a href="#home">` menjadi `<Link href="/">`.
2. **Pembersihan Form Newsletter (Baris ~41, 89-96, 222-250):**
   - Menghapus state yang tidak lagi digunakan: `emailValue`, `subscribed`, dan fungsi `handleSubscribe`.
   - Menghapus blok elemen `<form onSubmit={handleSubscribe}>...</form>`.
   - Menghapus import icon `Send` yang sudah tidak dipakai.
3. **Pembersihan Bottom Bar (Baris ~263-272):**
   - Menghapus elemen `<a href="#">Privacy Policy</a>` dan `<a href="#">Terms of Services</a>` beserta bullet pemisahnya.
   - Mempertahankan teks Hak Cipta (*Copyright*) di sisi kiri dan tombol panah *Back to Top* di sisi kanan.

---

## 3. Rencana Pengujian & Verifikasi

1. **Uji Navigasi Logo:**
   - Buka halaman `/about`, `/gallery`, atau `/projects`.
   - Klik Logo "HAKIM" di Navbar dan Logo di Footer.
   - Pastikan halaman berhasil berpindah kembali ke Beranda (`/`).
2. **Uji Tombol Kontak Navbar:**
   - Klik tombol "Kontak" di Navbar saat berada di Beranda -> layar *scroll* mulus ke footer `#contact`.
   - Klik tombol "Kontak" di Navbar saat berada di halaman lain -> berpindah ke Beranda lalu *scroll* ke `#contact`.
   - Uji tombol Kontak pada tampilan Mobile (menu hamburger) dan pastikan menu otomatis menutup setelah diklik.
3. **Uji Tampilan Footer:**
   - Periksa bahwa form newsletter tiruan dan link `#` sudah bersih.
   - Periksa bahwa tombol *Back to Top* tetap berfungsi meluncurkan layar kembali ke atas.
4. **Pemeriksaan Kode & Tipe Data:**
   - Jalankan `npx tsc --noEmit` untuk memastikan tidak ada error TypeScript atau referensi impor yang tertinggal.

