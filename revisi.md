# RENCANA REVISI SISTEM: AKSES LANGSUNG ADMIN & KASIR POS (BY ZETTBOT)
================================================================================
STATUS: MENUNGGU PERSETUJUAN PENGGUNA (PENDING APPROVAL)
================================================================================

### 1. Analisis Akar Masalah (Root Cause Analysis)
1. **Mengapa "Tidak Terjadi Apa-Apa" Saat Klik Masuk:**
   - Pada `lib/supabase/middleware.ts`, seluruh rute `/admin/*` (kecuali `/admin/login`) diproteksi ketat menggunakan `supabase.auth.getUser()`.
   - Karena pengguna belum mendaftarkan akun `admin@jayacell.id` di menu *Authentication* Supabase, server menganggap sesi belum login (`user = null`).
   - Ketika tombol "Masuk ke Dashboard" diklik, script mencoba mengarahkan ke `/admin`, namun `middleware.ts` secara instan menendang balik (*redirect bounce-back*) ke `/admin/login`. Akibatnya layar tampak diam atau tidak merespons.
2. **Kebutuhan Pengguna Saat Ini:**
   - Panel admin, kasir POS, dan CMS tidak perlu diblokir oleh halaman login/password di awal.
   - Staf konter dan pemilik toko harus bisa langsung membuka dan mengelola `/admin` (Dashboard, Kasir POS, Produk, Pesanan, IMEI, CMS) secara instan tanpa hambatan login.

---

### 2. Rencana Solusi & Perubahan Teknis
1. **Penyesuaian `lib/supabase/middleware.ts` & `middleware.ts`:**
   - Menghapus pemblokiran paksa redirect ke `/admin/login` pada middleware untuk rute `/admin/*`.
   - Mengizinkan akses langsung (direct open) ke seluruh modul `/admin`, `/admin/pos`, `/admin/products`, `/admin/orders`, `/admin/imei`, `/admin/trade-in`, dan `/admin/cms`.
2. **Penyesuaian `app/admin/layout.tsx` & Halaman Login:**
   - Mengubah rute `/admin/login` menjadi halaman login sekunder (opsional jika suatu saat ingin aktivasi auth ketat), atau menghapus tampilan login di dalam sidebar admin layout.
   - Pada Top Bar Admin (`components/admin/AdminTopBar.tsx`), profil admin default aktif sebagai "Admin Toko (Mode Langsung)".
3. **Penyelarasan Storefront Quick Edit Button:**
   - Tombol melayang *"✏️ Edit Halaman Ini"* di pojok kanan bawah storefront dibuat selalu dapat diakses untuk memudahkan admin masuk langsung ke `/admin/cms`.
4. **Git Commit & Push Otomatis ke GitHub:**
   - Setelah diterapkan, perubahan langsung di-push ke repositori GitHub:
     `https://github.com/geniuscreative305-hash/ecommerce-phone.git`.

---

### 3. Berkas yang Akan Diubah
- `lib/supabase/middleware.ts`
- `app/admin/login/page.tsx`
- `components/QuickEditButton.tsx`
- `components/admin/AdminTopBar.tsx`

---

### 4. Estimasi Dampak & Keuntungan
- **0 Hambatan:** Pengguna dan staf kasir konter bisa langsung membuka `http://localhost:3000/admin` atau menu `/admin/pos` seketika tanpa perlu pusing mendaftarkan akun di Supabase Auth.
- **Tetap Siap Supabase:** Operasi penyimpanan data, mutasi CMS, dan transaksi kasir tetap terhubung 100% ke database Supabase.

================================================================================
Ketik **"OKE TERAPKAN"** untuk mengeksekusi rencana ini sekarang.
================================================================================

