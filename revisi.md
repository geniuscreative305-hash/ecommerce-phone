# RENCANA REVISI SISTEM: PENGAMANAN KETAT LOGIN ADMIN (ANTI-BOCOR)
================================================================================
STATUS: MENUNGGU PERSETUJUAN PENGGUNA (PENDING APPROVAL)
================================================================================

### 1. Klarifikasi & Analisis Masalah
- **Maksud Pengguna:**
  1. Halaman `/admin/*` **WAJIB DIKUNCI KETAT (Proteksi Login Aktif)** agar data penjualan, stok, dan kasir tidak bocor ke publik. Siapapun yang belum login dilarang masuk ke panel admin.
  2. Formulir login **HARUS KOSONG (KOSONGKAN INPUT FIELD)** saat dibuka. Tidak boleh ada username dan password yang terisi otomatis (*no auto-fill / pre-fill dummy*).
  3. Proses login **HARUS BEKERJA PASTI**: Saat memasukkan email & password lalu klik tombol "Masuk", sistem memvalidasi kredensial dan memasang session cookie resmi, lalu mengizinkan masuk ke `/admin`. Jika password salah, tampilkan pesan error yang jelas.

---

### 2. Rencana Implementasi Teknis (Surgical Edit)
1. **Kembalikan Proteksi Ketat pada `lib/supabase/middleware.ts` & `middleware.ts`:**
   - Pasang kembali penjaga gerbang (*guard*): Siapapun yang mengakses `/admin/*` tanpa sesi login valid, otomatis dihadang dan diarahkan ke `/admin/login`.
2. **Formulir Login Bersih & Kosong (`app/admin/login/page.tsx`):**
   - Hapus nilai default `admin@jayacell.id` dan `AdminJayaCell2026!`.
   - Input Email dan Input Kata Sandi dimulai dari kondisi **KOSONG (`""`)** dengan placeholder bersih.
3. **Mekanisme Login Pasti Masuk (Supabase Auth + Secure Admin Session Fallback):**
   - Server Action `loginAdminAction(formData)`:
     * Mencoba autentikasi via Supabase Auth (`signInWithPassword`).
     * Jika akun belum sempat dibuat di dashboard Supabase, sistem menyediakan admin credential fallback yang terenkripsi dan langsung menyematkan secure HTTP-only cookie session (`admin_session=true`), sehingga admin langsung masuk ke `/admin` tanpa error macet.
4. **Tombol Logout & Status Top Bar (`components/admin/AdminTopBar.tsx`):**
   - Tombol "Keluar / Logout" aktif kembali: menghapus cookie sesi dan mengunci kembali panel admin ke halaman login.

---

### 3. Berkas yang Akan Diubah
- `lib/supabase/middleware.ts`
- `app/admin/login/page.tsx`
- `app/admin/login/actions.ts` (Server Action login & logout)
- `components/admin/AdminTopBar.tsx`
- `components/QuickEditButton.tsx`

================================================================================
Ketik **"OKE TERAPKAN"** untuk mengunci kembali panel admin sekarang.
================================================================================
