# 📱 JAYA CELL - Smartphone E-Commerce, Counter POS & WordPress-Style CMS

A production-ready, zero-delay E-Commerce, Counter POS (Point of Sale), PWA-Ready, and WordPress-style CMS Web Application for a smartphone retail store named **"Jaya Cell"**, built with **Next.js (App Router, TypeScript)**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth, Storage)**.

---

## 🌟 Fitur Utama (Master Feature Highlights)

### 1. Brand Identity & PWA Native Experience
- **Custom Brand Logo Component (`components/BrandLogo.tsx`):** Geometric vector SVG emblem combining smartphone silhouette, signal wave, and stylized JC monogram in Royal Blue (`#0066FF`) gradient.
- **Dynamic Favicon (`app/icon.svg` & `generateMetadata()` di `app/layout.tsx`):** Terhubung ke tabel `site_settings`. Mengubah logo di admin CMS otomatis memperbarui favicon tab browser secara real-time.
- **PWA Manifest (`app/manifest.ts`):** Standar PWA Standalone agar pelanggan dan staf konter dapat menginstal Jaya Cell langsung ke layar home screen HP seperti aplikasi native.

### 2. Storefront Modern & Anti-AI Human-Crafted Look
- **Dark Gradient Hero Banner (`#0F172A` to `#1E293B`):** Showcase flagship phone dengan CTA `#0066FF`.
- **4-Kolom USP Trust Bar:** Garansi Resmi 100%, Pembayaran Aman, CS & Konsultasi Cepat, Tukar Tambah Mudah.
- **Popular Smartphones & Best Deals:** White card, border `#E2E8F0`, rounded-2xl, hover elevation mikro-interaksi, badge "Best Seller" biru, badge diskon merah (`#EF4444`), star rating, dan quick Add to Cart.
- **Katalog & Filter Page (`/shop`):** Filter brand, slider harga maksimal, checkbox promo & best seller, pengurutan harga/diskon.
- **Detail Smartphone Interaktif (`/product/[slug]`):** Image gallery switcher, specs pills (Layar, Storage, Chipset, 5G), swatch warna interaktif & storage selector dengan kalkulasi harga dan stok dinamis.
- **Kalkulator Tukar Tambah (`/trade-in`):** Taksir nilai HP lama berdasarkan kondisi (Mulus `1.0`, Lecet Halus `0.85`, Minus Fisik `0.65`) yang langsung menjadi voucher diskon di keranjang belanja.
- **Slide-Over Cart & Checkout (`/checkout`):** Optimistic cart tersimpan di `localStorage`, formulir alamat, pilihan metode bayar (QRIS Instan, Transfer VA, COD/Ambil di Toko), dan penomoran pesanan sekuensial harian `JC-YYYYMMDD-XXXX`.
- **Portal Pelacakan Pesanan & Garansi IMEI (`/track`):**
  - **Lacak Pesanan:** Stepper timeline vertikal (Order Placed -> Diproses Toko -> Dalam Pengiriman -> Pesanan Selesai) dengan log waktu.
  - **Cek Garansi IMEI 15-Digit:** Verifikasi sertifikat keaslian garansi resmi / toko dengan status AKTIF atau EXPIRED.
- **Floating Quick Edit Shortcut:** Tombol melayang *"✏️ Edit Halaman Ini"* di pojok kanan bawah yang otomatis muncul saat admin terdeteksi login.

### 3. Backoffice Admin Bergaya WordPress & Kasir POS Konter (`/admin`)
- **Persistent Top Admin Bar:** Bar hitam `#1D2327` dengan tombol *"Kunjungi Toko ↗"* yang membuka storefront di tab browser baru (`target="_blank"`).
- **Responsive Sidebar Navigasi (240px, Drawer pada Mobile):**
  - `/admin`: Dashboard KPI (Total Omset Online + POS, Pesanan Masuk, Garansi Aktif, Alert Stok Menipis, dan tabel pesanan terkini).
  - `/admin/pos`: Kasir POS Konter fisik untuk transaksi walk-in kilat. Potong stok otomatis, catat order channel `offline_pos` (status `delivered`), dan daftarkan garansi digital IMEI dalam 1 klik. Dilengkapi fitur cetak struk thermal (58mm/80mm style)!
  - `/admin/products`: CRUD master smartphone, upload multi-foto, dynamic variant builder (warna, hex, storage, harga, stok), dan switch Best Seller / Best Deals.
  - `/admin/orders`: Manajemen pesanan masuk dengan status updater dan tombol **Export Rekap CSV**.
  - `/admin/imei`: Data dan penerbitan manual kartu garansi IMEI digital.
  - `/admin/trade-in`: Matriks harga dasar dan pengali taksir tukar tambah.
  - `/admin/cms`: Visual editor untuk `brand_identity` (favicon & logo), `hero_banner`, `promo_banner`, `store_usp`, `newsletter_banner`, dan `footer_info` dengan revalidasi instan `revalidatePath('/', 'layout')`.

---

## 🛠️ Tech Stack & Standar Zero-Delay

- **Framework:** Next.js 14 App Router + TypeScript (`strict: true`)
- **Styling:** Tailwind CSS + Lucide React Icons + `clsx` & `tailwind-merge`
- **Database & Auth:** Supabase PostgreSQL + Row Level Security (RLS) + `@supabase/ssr`
- **Font:** Google Font *Plus Jakarta Sans*
- **Format Rupiah Baku:** `Rp 18.999.000` via helper `formatRupiah(amount)`
- **Penomoran Unik:** `JC-YYYYMMDD-XXXX` (contoh: `JC-20261123-0001`)

---

## 🚀 Panduan Setup & Instalasi

### 1. Salin File Environment
Buat berkas `.env.local` pada root project:
```bash
cp .env.local.example .env.local
```
Lalu masukkan kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Eksekusi Skema Database & Seed Data di Supabase
1. Buka dashboard Supabase Anda -> **SQL Editor**.
2. Buka berkas [supabase/schema.sql](supabase/schema.sql).
3. Salin seluruh kueri SQL dan klik tombol **Run**.
4. Skema ini otomatis membuat:
   - 8 tabel idempoten (`site_settings`, `brands`, `products`, `product_variants`, `trade_in_rules`, `orders`, `order_items`, `imei_warranties`)
   - Indeks database untuk query super cepat
   - Kebijakan Row Level Security (RLS)
   - Public Storage Bucket `jaya-cell-assets`
   - Data seed lengkap smartphone (iPhone 16 Pro, Galaxy S24, Pixel 9, OnePlus 12, dll.)

### 3. Jalankan Aplikasi di Lingkungan Lokal
```bash
# Jalankan mode pengembangan
npm run dev
```
Buka browser di `http://localhost:3000`.

### 4. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 🔒 Akses Admin CMS & POS
- **URL Login Admin:** `http://localhost:3000/admin/login`
- **Email:** `admin@jayacell.id`
- **Password:** `AdminJayaCell2026!`

(c) 2026 Jaya Cell. Dikelola dengan standar rekayasa sistem ZettBOT by Zettbos.

