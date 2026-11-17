# 🌐 PANDUAN PENGGUNAAN NPD CLUB (VERSI PHP & MySQL)

Versi ini dibuat murni menggunakan **HTML5, Tailwind CSS, JavaScript, PHP, dan MySQL**.

---

## 🚀 KEUNGGULAN VERSI PHP INI:
1. **Tidak Butuh `npm run build`** — Begitu kamu ganti foto atau teks dan tekan `Ctrl + S`, detik itu juga langsung berubah di browser!
2. **Bisa Hosting Gratis 100% TANPA KARTU KREDIT** — Bisa di-upload langsung ke **InfinityFree.com** atau **000webhost** secara gratis.
3. **Data Aman Dua Arah** — Jika MySQL aktif, data dibaca dari database. Jika MySQL belum dinyalakan, web tetap jalan normal berkat sistem *Auto-Fallback*.

---

## 💻 CARA RUNNING DI LAPTOP (MENGGUNAKAN XAMPP):

1. **Install XAMPP** (jika belum punya) dari: https://www.apachefriends.org
2. Buka folder:
   ```
   C:\xampp\htdocs\
   ```
3. Copy folder **`php-version`** ini ke dalam folder `htdocs`, lalu ubah namanya menjadi **`npd-club`**.
   *(Sehingga jalurnya menjadi: `C:\xampp\htdocs\npd-club\`)*
4. Buka aplikasi **XAMPP Control Panel**, lalu klik tombol **Start** pada:
   * **Apache**
   * **MySQL**
5. Buka browser dan buka:
   👉 **`http://localhost/npd-club/`**
   *(Toko online langsung muncul 100% lengkap!)*

---

## 🗄️ CARA IMPORT DATABASE (OPSIONAL):

1. Buka browser: **`http://localhost/phpmyadmin`**
2. Klik tab **Databases** ➔ Buat database baru bernama: **`npd_club`** ➔ Klik **Create**.
3. Klik database `npd_club` yang baru dibuat di sebelah kiri.
4. Klik tab **Import** di menu atas.
5. Klik **Choose File** ➔ Pilih file **`database.sql`** yang ada di folder ini.
6. Scroll ke bawah dan klik **Import** (atau **Go**).
7. Selesai! Semua tabel produk, varian, dan koleksi sudah masuk ke MySQL.

---

## ☁️ CARA UPLOAD KE HOSTING GRATIS (INFINITYFREE / CPANEL):

1. Daftar akun gratis di [InfinityFree.com](https://www.infinityfree.com) (Tanpa kartu kredit).
2. Buat akun hosting gratis baru.
3. Buka **File Manager** ➔ Masuk ke folder **`htdocs/`**.
4. Upload semua file yang ada di dalam folder `php-version` ini ke dalam folder `htdocs`.
5. Buka **phpMyAdmin** di cPanel InfinityFree ➔ Import file `database.sql`.
6. Sesuaikan nama database, user, dan password di file **`config.php`**.
7. Website kamu resmi online di internet!
