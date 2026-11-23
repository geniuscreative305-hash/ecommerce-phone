# RENCANA REVISI SISTEM: PERBAIKAN GAMBAR HOMEPAGE & UPLOAD DARI DEVICE DI CMS
================================================================================
STATUS: MENUNGGU PERSETUJUAN PENGGUNA (PENDING APPROVAL)
================================================================================

### 1. Analisis Masalah Berdasarkan Screenshot
1. **Gambar Hero Banner Tidak Muncul (Broken Image):**
   - URL Unsplash lama pada Hero Banner mengalami kegagalan load/blokir hotlink sehingga browser menampilkan ikon gambar pecah bertuliskan `iPhone 16 Pro`.
   - Tidak ada mekanisme *error fallback* otomatis jika gambar eksternal gagal dimuat.
2. **Ketiadaan Fitur Upload Device di CMS (`/admin/cms`):**
   - Di halaman CMS saat ini, kolom **Logo Toko**, **Favicon**, **Hero Banner**, dan **Promo Banner** masih berupa input teks URL manual.
   - Pengguna menginginkan **setiap kolom gambar di CMS bisa di-upload langsung dari perangkat (laptop, galeri HP, dan tablet)** seperti yang sudah ada di menu Produk.

---

### 2. Rencana Implementasi Perbaikan (Surgical Edit)
1. **Perbaikan Gambar Homepage & Fallback Anti-Pecah (`components/HeroBannerSection.tsx` & `components/PromoBannerSection.tsx`):**
   - Mengganti URL gambar hero dan promo default dengan aset gambar smartphone flagship beresolusi tinggi yang stabil dan cepat dimuat.
   - Memasang penangan `onError` otomatis: jika link gambar bermasalah, komponen otomatis beralih menampilkan render grafis smartphone resmi Jaya Cell tanpa pernah memunculkan ikon gambar rusak.
2. **Implementasi Fitur Upload Device di Seluruh Menu CMS (`app/admin/cms/page.tsx`):**
   - Menambahkan tombol **"Pilih Foto dari Perangkat Ini"** dan **"Kamera / Galeri HP"** pada:
     1. **Logo Brand Toko** (upload logo baru dari HP/laptop).
     2. **Favicon Tab Browser** (upload icon browser dari perangkat).
     3. **Gambar Hero Banner Utama** (upload foto HP hero langsung dari perangkat).
     4. **Gambar Promo Banner** (upload banner promo langsung dari perangkat).
   - Setiap upload dilengkapi:
     - Kotak preview gambar seketika (*instant preview*).
     - Penyimpanan otomatis ke Supabase Storage bucket `jaya-cell-assets` dan sinkronisasi ke database `site_settings`.
     - Tombol simpan yang langsung mentrigger revalidasi `revalidatePath('/', 'layout')` agar tampilan beranda seketika berubah.
3. **Penyelarasan Konstanta Default (`lib/constants.ts`):**
   - Memperbarui URL default gambar hero dan promo ke link gambar CDN yang 100% stabil.
4. **Verifikasi Build & Push ke GitHub:**
   - Menjalankan `npm run build` dan push ke repositori GitHub:
     `https://github.com/geniuscreative305-hash/ecommerce-phone.git`.

---

### 3. Berkas yang Akan Diubah
- `components/HeroBannerSection.tsx`
- `components/PromoBannerSection.tsx`
- `app/admin/cms/page.tsx`
- `lib/constants.ts`

================================================================================
Ketik **"OKE TERAPKAN"** untuk mengeksekusi rencana perbaikan ini.
================================================================================
