# PRD (Product Requirements Document) - JAYA CELL
================================================================================
PROJEK: Jaya Cell - E-Commerce, Counter POS, PWA & WordPress-Style CMS
ENGINE: ZettBOT Core v4.1 by Zettbos
STATUS: DISETUJUI & SELESAI DITERAPKAN (PRODUCTION READY)
================================================================================

--------------------------------------------------------------------------------
ZONA ATAS: SPESIFIKASI KEBUTUHAN PRODUK (BLUEPRINT AWAL)
--------------------------------------------------------------------------------

### 1. Nama Projek & Problem Statement
- **Nama Aplikasi:** Jaya Cell (Web E-Commerce, Counter POS, PWA & Admin CMS)
- **Problem Statement:**
  Toko smartphone ritel konvensional "Jaya Cell" menghadapi tantangan integrasi antara penjualan online (web storefront) dan transaksi walk-in counter fisik (offline POS), penghitungan taksir tukar tambah (trade-in) yang masih manual, verifikasi garansi digital berbasis nomor IMEI yang tercecer di nota fisik, serta kebutuhan manajemen tampilan toko (banner promo, USP, logo) yang fleksibel ala WordPress tanpa harus mengubah kode pemrograman.
- **Solusi Sistem:**
  Membangun platform Next.js (App Router, TypeScript) terpadu dengan Supabase (PostgreSQL, Auth, Storage) yang menyajikan:
  1. Storefront responsif berestetika premium modern (Anti-AI Human-Crafted) sesuai mockup TechNova.
  2. Modul Kasir POS Konter cepat untuk transaksi pelanggan walk-in fisik dengan pemotongan stok otomatis dan penerbitan garansi IMEI seketika.
  3. Kalkulator Tukar Tambah (Trade-In) interaktif dengan rumus pengali kondisi fisik yang langsung memotong total belanja di keranjang/checkout.
  4. Portal Pelacakan Pesanan & Verifikasi Garansi IMEI Digital 15-digit untuk transparansi pelanggan.
  5. Backoffice Admin bergaya WordPress dengan persistent top admin bar ("Kunjungi Toko ↗" di tab baru), navigasi sidebar responsif, dan CMS visual editor berbasis `site_settings`.

---

### 2. Peran Pengguna (User Roles)
1. **Customer / Pembeli Online (Publik):**
   - Menjelajah katalog smartphone, memfilter merek, rentang harga, dan spesifikasi.
   - Memilih varian warna (swatch interaktif) dan storage (128GB, 256GB, 512GB) dengan harga dan stok dinamis.
   - Menghitung taksir tukar tambah HP lama dan mengklaim diskon di checkout.
   - Melakukan checkout (Transfer Bank/VA, QRIS, COD/Ambil di Toko) dan menerima nomor pesanan sekuensial unik `JC-YYYYMMDD-XXXX`.
   - Melacak status pengiriman dan memverifikasi garansi resmi/toko lewat 15-digit IMEI di `/track`.
2. **Staff Kasir Konter (Walk-in Counter Staff):**
   - Mengakses `/admin/pos` untuk melayani pembeli fisik secara cepat.
   - Memilih unit dan varian, memasukkan nama & no HP pelanggan, menginput taksir trade-in fisik jika ada, memasukkan nomor IMEI unit yang keluar, dan memilih metode bayar tunai/QRIS.
   - Sistem otomatis mencatat pesanan bertipe `offline_pos` dengan status `delivered`, mengurangi stok varian secara atomik, dan mendaftarkan garansi digital IMEI ke database.
3. **Super Admin / Pemilik Toko (Authenticated Store Owner):**
   - Login via `/admin/login`.
   - Mengelola katalog produk & multi-varian, upload foto ke Supabase Storage (`jaya-cell-assets`).
   - Memperbarui status pesanan online (`placed` -> `processing` -> `shipped` -> `delivered`) yang otomatis mencatat log waktu di `tracking_logs`.
   - Mengelola master garansi IMEI dan aturan taksir tukar tambah (`trade_in_rules`).
   - Mengubah konten visual landing page (Logo/Favicon, Hero Banner, Promo Banner, USP, Footer) melalui `/admin/cms` dengan revalidasi instan (`revalidatePath('/', 'layout')`).

---

### 3. Arsitektur & Lingkungan Kerja
- **Framework:** Next.js 14/15 App Router (TypeScript, `strict: true`).
- **Styling & UI:** Tailwind CSS, Lucide React Icons, `clsx`, `tailwind-merge`.
- **Tipografi & Desain:** Google Font *Plus Jakarta Sans*, palet Royal Blue (`#0066FF`), Dark Slate/Navy (`#0F172A` - `#1E293B`), Clean White (`#FFFFFF`), Soft Gray Surface (`#F8FAFC`), dan Red Discount Badge (`#EF4444`).
- **Database, Auth & Storage:** Supabase PostgreSQL dengan Row Level Security (RLS), Supabase Auth (Cookie-based via `@supabase/ssr`), dan Supabase Storage bucket `jaya-cell-assets`.
- **Zero-Delay Navigation:**
  - `<Link prefetch={true}>` pada semua navigasi.
  - File `loading.tsx` berisi shimmer skeleton loader pada rute utama (`/`, `/shop`, `/product/[slug]`, `/track`, `/admin/*`).
  - Optimistic Cart UI di sisi klien tersimpan di `localStorage`.
  - Revalidasi instan pada setiap mutasi admin (`revalidatePath('/', 'layout')`).
- **PWA & Favicon Dinamis:**
  - `app/manifest.ts` standar PWA (name: "Jaya Cell", theme: `#0066FF`, background: `#FFFFFF`, display: `standalone`).
  - `components/BrandLogo.tsx` SVG emblem geometris Royal Blue gradient + signal wave / stylized JC monogram.
  - `app/icon.svg` vector favicon + dynamic `generateMetadata()` di `app/layout.tsx` membaca `brand_identity` dari tabel `site_settings`.

---

### 4. Alur Kerja Aplikasi (User Flow)
```
[CUSTOMER ONLINE]
Homepage (/) -> Banner Hero / USP / Brand Filter -> Detail Produk (/product/[slug])
  -> Pilih Warna & Storage -> Hitung Trade-In (Opsional) -> Tambah ke Keranjang
  -> Slide-Over Cart -> Checkout (/checkout) -> Generate Order JC-YYYYMMDD-XXXX
  -> Halaman Sukses -> Lacak Pesanan & Cek Garansi IMEI (/track)

[KASIR KONTER POS]
Admin Login (/admin/login) -> Menu Kasir POS (/admin/pos)
  -> Pilih Produk & Varian (Stok live) -> Input Nama, Telp, IMEI Unit & Taksir Trade-In
  -> Bayar (Cash / QRIS) -> Simpan:
       * Potong stok varian (Atomic)
       * Catat order channel 'offline_pos' (status 'delivered')
       * Daftarkan IMEI ke tabel imei_warranties

[ADMIN CMS]
Admin -> Top Bar WordPress ("Kunjungi Toko ↗" New Tab) -> Menu CMS (/admin/cms)
  -> Upload Logo Baru / Ganti Banner Hero / Ubah Teks Promo
  -> Simpan -> revalidatePath('/', 'layout') -> Toko seketika terupdate!
```

---

### 5. Desain Basis Data (8 Tabel Idempoten & RLS)
1. **`site_settings`**:
   - `id` (serial PK), `section_key` (text unique: 'brand_identity', 'hero_banner', 'promo_banner', 'newsletter_banner', 'store_usp', 'footer_info'), `content_json` (jsonb), `updated_at` (timestamptz).
2. **`brands`**:
   - `id` (uuid PK default `gen_random_uuid()`), `name` (text), `logo_url` (text), `is_active` (boolean default true), `sort_order` (int default 0).
3. **`products`**:
   - `id` (uuid PK), `brand_id` (uuid FK -> brands.id), `name` (text), `slug` (text unique), `description` (text), `discount_percent` (int default 0), `specs_json` (jsonb: screen, storage, chipset, network, battery), `is_popular` (boolean default false), `is_best_deal` (boolean default false), `images` (text[]), `created_at` (timestamptz).
4. **`product_variants`**:
   - `id` (uuid PK), `product_id` (uuid FK -> products.id ON DELETE CASCADE), `color_name` (text), `color_hex` (text), `storage` (text), `price` (numeric), `stock` (int).
5. **`trade_in_rules`**:
   - `id` (uuid PK), `brand_name` (text), `model_name` (text), `storage` (text), `base_value` (numeric), `condition_multipliers` (jsonb: `{"mulus": 1.0, "lecet_halus": 0.85, "minus_fisik": 0.65}`).
6. **`orders`**:
   - `id` (uuid PK), `order_number` (text unique, format: `JC-YYYYMMDD-XXXX`), `order_channel` (text: 'online_web' | 'offline_pos'), `customer_name` (text), `customer_phone` (text), `shipping_address` (text), `city` (text), `postal_code` (text), `payment_method` (text), `trade_in_info` (jsonb nullable), `trade_in_discount` (numeric default 0), `total_amount` (numeric), `status` (text: 'placed' | 'processing' | 'shipped' | 'delivered'), `tracking_logs` (jsonb default '[]'), `created_at` (timestamptz).
7. **`order_items`**:
   - `id` (uuid PK), `order_id` (uuid FK -> orders.id ON DELETE CASCADE), `product_id` (uuid), `variant_id` (uuid), `product_name` (text), `variant_snapshot` (text), `quantity` (int), `price_at_purchase` (numeric).
8. **`imei_warranties`**:
   - `id` (uuid PK), `imei_number` (text unique), `order_number` (text nullable), `customer_name` (text), `product_name` (text), `variant_info` (text), `purchase_date` (date), `warranty_end_date` (date), `warranty_type` (text: 'Garansi Resmi' | 'Garansi Toko Jaya Cell'), `status` (text: 'active' | 'expired').
9. **RLS Policies & Storage Bucket:**
   - Public read (SELECT) untuk katalog, settings, trade-in rules, tracking orders, dan cek garansi IMEI.
   - Insert orders & order items via server action / validated logic.
   - Restrict mutation (INSERT/UPDATE/DELETE) pada master produk, CMS, dan IMEI hanya untuk authenticated admin.
   - Supabase storage bucket `jaya-cell-assets` dengan public read policy.

---

### 6. Aturan Validasi & Logika Khusus
1. **Format Mata Uang Rupiah Baku:**
   - Semua angka harga wajib diformat menggunakan pemisah ribuan titik tanpa desimal berlebihan: contoh `Rp 18.999.000` via helper `formatRupiah(amount)`.
2. **Generator Kode Pesanan Sekuensial Anti-Tabrakan:**
   - Format: `JC-YYYYMMDD-XXXX` (contoh: `JC-20261123-0001`).
   - Dihitung di backend berdasarkan nilai sekuensial tertinggi pada hari berjalan untuk mencegah tabrakan ID.
3. **Kalkulator Trade-In:**
   - `Nilai Taksir = Base Value * Multiplier Kondisi`.
   - Kondisi: Mulus (`1.0`), Lecet Halus (`0.85`), Minus Fisik (`0.65`).
   - Nilai taksir memotong `total_amount` pada pesanan secara transparan.
4. **Verifikasi IMEI 15-Digit:**
   - Cek ke database `imei_warranties`.
   - Status otomatis dihitung: Jika `warranty_end_date >= current_date`, status `active` (badge hijau), sebaliknya `expired` (badge merah).

---

### 7. Rencana Antarmuka (UI/UX Mockup TechNova Mapping)
1. **Storefront Navbar:**
   - Logo SVG Jaya Cell, link menu (Beranda, Toko, Brand, Tukar Tambah, Lacak & IMEI), bilah pencarian instan, Wishlist counter, Slide-Over Cart trigger dengan badge kuantitas.
   - Tombol melayang *Quick Edit* ("✏️ Edit Halaman Ini") di pojok kanan bawah jika admin terdeteksi login.
2. **Hero Banner:**
   - Kontainer gradasi navy gelap `#0F172A` ke `#1E293B`, rounded-2xl, tipografi headline tebal, tombol CTA `#0066FF`, gambar smartphone resolusi tinggi.
3. **Store USP Strip (4 Kolom):**
   - Garansi Resmi 100%, Pembayaran Aman, CS & Konsultasi Cepat, Tukar Tambah Mudah.
4. **Popular Smartphones & Best Deals Grid:**
   - Kartu produk putih, border `#E2E8F0`, rounded-2xl, bayangan lembut mikro-interaksi saat hover.
   - Badge "Best Seller" biru atau badge diskon merah `#EF4444` ("-15%").
   - Star rating (contoh: 4.9 ★), harga sebelum/sesudah diskon, dan tombol "Tambah ke Keranjang".
5. **Limited Time Offer Banner:**
   - Banner promo dengan headline diskon besar dan susunan produk flagship miring elegan.
6. **Shop by Brand:**
   - Logo/kartu brand terkurasi (Apple, Samsung, Google, OnePlus, Xiaomi, realme) yang langsung memfilter `/shop?brand=...`.
7. **Product Detail Page (`/product/[slug]`):**
   - Gallery switcher multi-sudut, pills spesifikasi (Layar, Storage, Chipset, 5G), swatch warna dinamis, selektor kapasitas storage, stepper kuantitas, tombol aksi keranjang.
8. **Order Tracking & IMEI Check Dual-Tab (`/track`):**
   - Tab 1: Lacak Status Pesanan dengan timeline vertikal (Placed -> Diproses -> Dikirim -> Selesai).
   - Tab 2: Verifikasi Garansi IMEI 15-digit dengan tampilan kartu sertifikat garansi resmi.
9. **WordPress-Style Admin Portal (`/admin`):**
   - Sticky top bar hitam `#1D2327` dengan logo dan tombol "Kunjungi Toko ↗" (`target="_blank"`).
   - Sidebar navigasi (Dashboard KPI, Kasir POS, Produk & Varian, Pesanan Masuk, Data IMEI, Aturan Tukar Tambah, CMS Tampilan).
   - Layar Kasir POS Konter cepat untuk kasir fisik dengan printer receipt / ringkasan nota digital.

---

### 8. Kriteria Pengujian (Quality Acceptance Checklist)
- [ ] Database migration `supabase/schema.sql` idempoten dan memuat data seed lengkap (brands, sample phones, variants, trade-in rules, initial site_settings).
- [ ] Favicon dinamis & PWA manifest berfungsi normal.
- [ ] Navigasi zero-delay dengan `<Link prefetch>` dan skeleton loaders di `loading.tsx`.
- [ ] Storefront render sesuai gambar mockup TechNova dengan warna #0066FF Royal Blue dan Plus Jakarta Sans.
- [ ] Keranjang belanja slide-over menyimpan state di `localStorage` dan checkout sukses menghasilkan kode `JC-YYYYMMDD-XXXX`.
- [ ] Kalkulator trade-in menghitung potongan harga dengan akurat.
- [ ] Lacak pesanan menampilkan histori perjalanan paket, dan cek IMEI menampilkan status garansi aktif/expired.
- [ ] Modul Kasir POS Konter (`/admin/pos`) memotong stok seketika dan mendaftarkan garansi IMEI.
- [ ] Modul CMS (`/admin/cms`) mampu mengubah teks dan gambar banner dengan efek seketika pada storefront.
- [ ] Build Next.js clean tanpa error TypeScript (`npm run build`).

--------------------------------------------------------------------------------
ZONA BAWAH: MASTER CONTEXT & LOGIKA SISTEM TERKINI (LIVING CONTEXT)
--------------------------------------------------------------------------------
- **Status Arsitektur:** Next.js 14/15 App Router (TypeScript) + Tailwind CSS + Supabase.
- **Tabel Aktif:**
  - `site_settings`: Konten CMS dinamis (brand_identity, hero_banner, promo_banner, newsletter_banner, store_usp, footer_info).
  - `brands`: Brand smartphone aktif (Apple, Samsung, Google, OnePlus, Xiaomi, realme).
  - `products`: Katalog smartphone beserta slug, diskon, spesifikasi hardware, dan status popular/best deal.
  - `product_variants`: Varian warna (hex), storage, harga Rupiah, dan kuantitas stok.
  - `trade_in_rules`: Master harga dasar dan pengali kondisi tukar tambah.
  - `orders`: Transaksi online & offline POS dengan log tracking pengiriman.
  - `order_items`: Snapshot item yang dibeli dan harga pada saat transaksi.
  - `imei_warranties`: Catatan garansi digital 15-digit IMEI.
- **Logika Bisnis Aktif:**
  - Mata uang: IDR (`Rp XX.XXX.XXX`).
  - Order ID: `JC-YYYYMMDD-XXXX` sekuensial harian.
  - Trade-In Discount = `base_value * multiplier` (Mulus 1.0, Lecet 0.85, Minus 0.65).
  - Kasir POS: Mode instan, status otomatis `delivered`, channel `offline_pos`, potong stok varian & buat IMEI warranty seketika.
- **Log Pembaruan:**
  - Inisialisasi PRD Blueprint v1.0 untuk toko Jaya Cell E-Commerce, Counter POS, PWA & Admin CMS.

