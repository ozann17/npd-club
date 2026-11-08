# ✦ NPD CLUB — Heavyweight Streetwear E-Commerce

A complete, responsive, mobile-first streetwear clothing store website for **NPD CLUB** inspired by premium oversized capsule drops, featuring clean Navy (`#0B1F3A`) & White (`#FFFFFF`) aesthetics, bottom navigation hamburger menu, direct collection grids, database-synced wishlist, variant stock reservations, and payment gateway simulation with dynamic QRIS and Virtual Accounts.

---

## 🚀 Fitur Unggulan Sesuai Spesifikasi

### 1. Identitas & Desain
- **Nama Brand:** NPD CLUB (`✦ NPD CLUB`)
- **Palet Warna:** Navy (`#0B1F3A` sebagai warna utama), Putih (`#FFFFFF` background), Aksen abu muda (`#F2F4F7`) untuk card dan garis pemisah.
- **Gaya:** Minimalis, modern, clean, streetwear premium dengan foto produk besar.
- **Font:** Sans-serif modern (Poppins & Inter).
- **Logo:** Teks tegas `✦ NPD CLUB` di header dengan aksen streetwear.

### 2. Fitur Utama: Menu Hamburger (Garis 3) di Bawah
- **TANPA FITUR PENCARIAN (NO SEARCH BAR):** Sesuai spesifikasi, tidak ada search bar, search engine, atau ikon kaca pembesar di seluruh website.
- **Tombol Menu Hamburger di Bawah Layar:** Tombol hamburger (ikon 3 garis) diletakkan di navigasi bawah (bottom navigation), sangat mudah dijangkau jempol (thumb-friendly).
- **Panel Menu (Bottom Sheet / Drawer):** Saat diklik muncul panel drawer dengan:
  - **Collection (Dropdown / Accordion):** Berisi 3 sub-menu:
    - `NPD Collection` (Signature Drop)
    - `Spring Collection` (Spring 2026)
    - `Winter Collection` (Cold Weather Gear)
  - **Wishlist** (dengan badge jumlah favorit)
  - **Keranjang** (dengan badge jumlah item)
  - **Login / Akun** (akses cepat profil & status login)
- **Tampil Langsung Grid Produk:** Saat salah satu collection diklik, LANGSUNG tampil grid produk dari collection tersebut tanpa halaman perantara.

### 3. Wishlist (Favorit)
- Ikon hati terapung di kartu produk (di sudut kanan bawah foto, sesuai referensi gambar) dan di modal detail produk.
- Halaman Wishlist menampilkan produk favorit dalam grid, dengan tombol langsung "Tambah ke Keranjang" dan tombol hapus.
- **Tersimpan di Database:** Tabel `wishlists (user_id, product_id, created_at)` sehingga data tersimpan permanen dan tersinkronisasi lintas perangkat.
- **Auto-save setelah login:** Jika user belum login dan menekan hati, diarahkan ke modal login, dan setelah login otomatis tersimpan ke wishlist.
- **Toast Notifications:** Feedback visual saat produk ditambah atau dihapus dari wishlist.
- **Status Sold Out di Wishlist:** Produk yang habis di wishlist tetap berlabel "SOLD OUT".

### 4. Label Sold Out & Manajemen Stok
- **Stok per Varian:** Tabel `product_variants (product_id, size, color, stock, reserved_stock)`.
- **Status Sold Out Otomatis:** Jika semua varian produk memiliki stok 0, otomatis berstatus Sold Out:
  - Badge `SOLD OUT` di atas foto produk (Navy `#0B1F3A` dengan teks putih).
  - Foto dipudarkan (`grayscale` dan `opacity`).
  - Tombol berubah menjadi "Sold Out" dan dinonaktifkan (`disabled`).
  - Produk tetap tampil di koleksi dan detailnya tetap bisa dibuka.
- **Strikethrough Ukuran Habis:** Di modal detail, ukuran yang habis (stok 0) dicoret (*strikethrough*) dan tidak bisa dipilih. Jika hanya sebagian ukuran habis, produk belum dianggap Sold Out.
- **Stock Reservation (Anti-Double Buying):** Saat checkout dibuat, stok di-reserve selama 24 jam sehingga pembeli lain tidak bisa merebut stok terakhir.
- **Pengurangan Stok:** Setelah pembayaran diverifikasi/lunas, stok berkurang permanen. Jika pesanan dibatalkan atau kedaluwarsa, stok reservasi otomatis dikembalikan.

### 5. Keranjang & Checkout
- **Keranjang Belanja:** Daftar item, ubah jumlah (+/-), hapus item, subtotal, meteran Gratis Ongkir, dan total tagihan.
- **Form Checkout:**
  - Form alamat pengiriman (Nama, No. HP/WhatsApp, Alamat Lengkap, Kota/Kabupaten, Kode Pos).
  - Ringkasan pesanan & rincian biaya.
  - Pilihan metode pembayaran.
- **Wajib Login untuk Checkout:** Jika belum login, diarahkan untuk login lalu langsung melanjutkan checkout.
- **Validasi Stok Ulang Saat Checkout:** Sistem memverifikasi kembali ketersediaan stok tepat sebelum order dibuat. Jika stok habis, item dikeluarkan dan user diberi peringatan.

### 6. Pembayaran
- **QRIS Dinamis:** Menghasilkan QR Code dinamis scannable (menggunakan library `qrcode`), nominal, status pembayaran, dan countdown batas waktu 24 jam.
- **Virtual Account (VA):** Pilihan bank **BCA, BRI, Mandiri, BNI**. Menyediakan nomor VA, nominal, tombol salin instan, dan tab petunjuk transfer (m-Banking, ATM, i-Banking).
- **Halaman Konfirmasi:** Setelah pembayaran lunas, menampilkan ringkasan, nomor order, dan status `LUNAS / DIPROSES`.
- **Sandbox & Webhook Simulator:** Tombol `⚡ Simulasikan Pembayaran Berhasil` pada halaman pembayaran untuk menguji pemotongan stok dan pembaruan webhook Midtrans secara instan tanpa perlu kartu kredit sungguhan!

### 7. Login & Akun
- **Registrasi:** Nama, Email, No. HP, Password (minimal 6 karakter).
- **Login:** Email dan Password.
- **Lupa Password:** Flow reset password mandiri dengan pembuatan token reset dan input password baru.
- **Keamanan:** Password di-hash menggunakan `bcryptjs`, autentikasi sesi menggunakan `jsonwebtoken` (JWT).
- **Halaman Akun:** Profil user, edit nama/HP, riwayat seluruh pesanan dengan status, dan tombol logout.

---

## 🛠️ Arsitektur & Teknologi

- **Backend:** Node.js, Express.js 5, SQLite (`better-sqlite3`), JWT, Bcrypt, QR Code Generator
- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons
- **Database:** SQLite (`npd_club.sqlite`) dengan WAL mode

---

## ⚡ Cara Menjalankan

### 1. Menjalankan Server & Website
Website dan backend API sudah berjalan pada:
- **Website & Backend API:** [http://localhost:5000](http://localhost:5000)
- **Vite Dev Server (Frontend):** [http://localhost:3000](http://localhost:3000)

Untuk menjalankan ulang sewaktu-waktu:
```bash
# Menjalankan server produksi terpadu (menyajikan API & Frontend)
npm start

# Atau menjalankan script pengujian integrasi otomatis
npm run test:e2e
```

### 2. Akun Demo Bawaan
- **Email:** `demo@npdclub.com`
- **Password:** `password123`
*(Atau daftar akun baru Anda sendiri langsung di aplikasi!)*
