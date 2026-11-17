<?php
require_once 'config.php';
require_once 'data_fallback.php';

// Filter koleksi dari parameter URL (misal: index.php?collection=tdb-collection)
$current_col = isset($_GET['collection']) ? $_GET['collection'] : 'all';
$products = getProducts($current_col);

// Judul & deskripsi koleksi aktif
$collection_titles = [
    'all' => 'Semua Koleksi Streetwear',
    'npd-collection' => 'NPD Collection (Signature Drops)',
    'tdb-collection' => 'TDB Collection 2026',
    'pickme-collection' => 'Pick Me Collection'
];

$collection_descriptions = [
    'all' => 'Jelajahi seluruh katalog streetwear eksklusif NPD CLUB: Heavyweight tees, oversized hoodies, cargo pants, dan aksesoris.',
    'npd-collection' => 'Koleksi inti dengan potongan boxy oversized, katun combed 240+ GSM, dan grafis legendaris khas NPD CLUB.',
    'tdb-collection' => 'Beyond trends, beyond guidelines. We reflect the spirit, music, and raw identity of the streets.',
    'pickme-collection' => 'Elevate your everyday look with functional cuts, versatile tones, and clean silhouettes.'
];

$active_title = isset($collection_titles[$current_col]) ? $collection_titles[$current_col] : 'Katalog Produk NPD CLUB';
$active_desc = isset($collection_descriptions[$current_col]) ? $collection_descriptions[$current_col] : '';
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>NPD CLUB — Streetwear & Capsule Collections</title>
  
  <!-- Google Fonts: Inter, Poppins, Rubik Bubbles -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&family=Rubik+Bubbles&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            navy: '#0B1F3A',
            cream: '#F2F4F7'
          },
          fontFamily: {
            bubble: ['"Rubik Bubbles"', 'cursive'],
            poppins: ['Poppins', 'sans-serif'],
            inter: ['Inter', 'sans-serif']
          }
        }
      }
    }
  </script>
  
  <!-- Lucide Icons & QR Code Generator -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

  <style>
    body {
      font-family: 'Inter', sans-serif;
      color: #0B1F3A;
      background-color: #FFFFFF;
      -webkit-tap-highlight-color: transparent;
    }
    .font-bubble {
      font-family: 'Rubik Bubbles', cursive;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  </style>
</head>
<body class="selection:bg-[#0B1F3A] selection:text-white pb-20 sm:pb-0">

  <!-- =========================================================================
       1. ANNOUNCEMENT TOP BAR
       ========================================================================= -->
  <div class="bg-[#0B1F3A] text-white py-2 px-4 text-center text-[11px] sm:text-xs font-semibold tracking-widest uppercase overflow-hidden">
    <div class="flex items-center justify-center gap-3 animate-pulse">
      <span>✦ NPD CLUB: CAPSULE COLLECTION '26</span>
      <span class="hidden sm:inline">•</span>
      <span class="hidden sm:inline">FREE SHIPPING IDR 1000K+</span>
      <span class="hidden md:inline">•</span>
      <span class="hidden md:inline">WORLDWIDE DISPATCH</span>
    </div>
  </div>

  <!-- =========================================================================
       2. STICKY NAVBAR (TIDAK AKAN TABRAKAN DENGAN LOGO DI TENGAH)
       ========================================================================= -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F2F4F7]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
        
        <!-- Left: Desktop Nav Links (Proporsional & Rapi) -->
        <div class="flex-1 flex items-center gap-3 lg:gap-6 text-[11px] lg:text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
          <nav class="hidden md:flex items-center gap-3 lg:gap-5">
            <a href="index.php?collection=all" class="hover:opacity-70 transition-opacity whitespace-nowrap <?= $current_col == 'all' ? 'underline underline-offset-8 decoration-2' : '' ?>">Home</a>
            <a href="index.php?collection=npd-collection" class="hover:opacity-70 transition-opacity whitespace-nowrap <?= $current_col == 'npd-collection' ? 'underline underline-offset-8 decoration-2' : '' ?>">NPD Collection</a>
            <a href="index.php?collection=tdb-collection" class="hover:opacity-70 transition-opacity whitespace-nowrap <?= $current_col == 'tdb-collection' ? 'underline underline-offset-8 decoration-2' : '' ?>">TDB Collection</a>
            <a href="index.php?collection=pickme-collection" class="hover:opacity-70 transition-opacity whitespace-nowrap <?= $current_col == 'pickme-collection' ? 'underline underline-offset-8 decoration-2' : '' ?>">Pick Me</a>
          </nav>
          <div class="md:hidden text-[10px] uppercase font-bold tracking-widest text-gray-500">
            ARCHIVE '26
          </div>
        </div>

        <!-- Center: BRAND LOGO BUBBLE (Tepat di Tengah & Tidak Berhimpitan) -->
        <div class="shrink-0 px-2 sm:px-6 text-center">
          <a href="index.php" class="inline-block py-1 group">
            <span class="font-bubble text-2xl sm:text-3xl md:text-4xl text-[#0B1F3A] tracking-wider drop-shadow-[0_2px_4px_rgba(11,31,58,0.15)] group-hover:scale-105 transition-transform inline-block whitespace-nowrap">
              ✦ NPD CLUB
            </span>
          </a>
        </div>

        <!-- Right: Wishlist, Cart & Account Actions -->
        <div class="flex-1 flex items-center justify-end gap-2 sm:gap-3">
          <!-- Wishlist Button -->
          <button onclick="toggleWishlistView()" class="p-2 text-[#0B1F3A] hover:bg-gray-100 rounded-full transition-colors relative" title="Wishlist">
            <i data-lucide="heart" class="w-5 h-5 sm:w-6 sm:h-6"></i>
            <span id="wishlist-badge" class="absolute top-1 right-1 w-4 h-4 bg-[#0B1F3A] text-white text-[9px] font-black rounded-full flex items-center justify-center hidden">0</span>
          </button>

          <!-- Cart Button -->
          <button onclick="openCartDrawer()" class="p-2 text-[#0B1F3A] hover:bg-gray-100 rounded-full transition-colors relative" title="Keranjang">
            <i data-lucide="shopping-bag" class="w-5 h-5 sm:w-6 sm:h-6"></i>
            <span id="cart-badge" class="absolute top-1 right-1 w-4 h-4 bg-[#0B1F3A] text-white text-[9px] font-black rounded-full flex items-center justify-center hidden">0</span>
          </button>

          <!-- Account / Login Button -->
          <button id="auth-btn" onclick="openAuthModal()" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#0B1F3A] text-white hover:bg-[#163259] rounded transition-all shadow-sm">
            <i data-lucide="user" class="w-4 h-4"></i>
            <span id="auth-btn-label">Masuk</span>
          </button>
        </div>

      </div>
    </div>
  </header>

  <!-- =========================================================================
       3. HERO BANNER CAROUSEL (DENGAN TEKS TENGAH & 3 TOMBOL UTAMA LENGKAP)
       ========================================================================= -->
  <section class="relative min-h-[480px] sm:min-h-[560px] md:min-h-[620px] flex items-center justify-center overflow-hidden border-b border-[#F2F4F7] bg-[#0B1F3A] select-none">
    
    <!-- Background Slides (Layer Gambar & Gradient Gelap/Terang) -->
    <div id="hero-slider" class="absolute inset-0">
      
      <!-- Slide 1 Background (Lookbook 4 Model) -->
      <div id="slide-bg-0" class="hero-bg absolute inset-0 transition-opacity duration-1000 opacity-100 z-0">
        <img src="assets/banners/npd-banner-lookbook.jpg" alt="NPD CLUB Lookbook" class="w-full h-full object-cover object-center">
        <div class="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-white/20 backdrop-blur-[0.5px]"></div>
      </div>

      <!-- Slide 2 Background (TDB Tangga Besi) -->
      <div id="slide-bg-1" class="hero-bg absolute inset-0 transition-opacity duration-1000 opacity-0 z-0">
        <img src="assets/banners/banner_1122.PNG" alt="TDB Collection" class="w-full h-full object-cover object-center">
        <div class="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/70 to-[#0B1F3A]/50 backdrop-blur-[0.5px]"></div>
      </div>

      <!-- Slide 3 Background (Pick Me Shop) -->
      <div id="slide-bg-2" class="hero-bg absolute inset-0 transition-opacity duration-1000 opacity-0 z-0">
        <img src="assets/banners/sld3.jpeg" alt="Pick Me Collection" class="w-full h-full object-cover object-center">
        <div class="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/70 to-[#0B1F3A]/50 backdrop-blur-[0.5px]"></div>
      </div>

    </div>

    <!-- Navigation Arrows -->
    <button onclick="prevSlide()" class="absolute left-3 sm:left-6 z-30 p-2.5 sm:p-3 rounded-full bg-white/80 hover:bg-[#0B1F3A] hover:text-white text-[#0B1F3A] transition-all shadow-md">
      <i data-lucide="chevron-left" class="w-5 h-5 sm:w-6 sm:h-6"></i>
    </button>
    <button onclick="nextSlide()" class="absolute right-3 sm:right-6 z-30 p-2.5 sm:p-3 rounded-full bg-white/80 hover:bg-[#0B1F3A] hover:text-white text-[#0B1F3A] transition-all shadow-md">
      <i data-lucide="chevron-right" class="w-5 h-5 sm:w-6 sm:h-6"></i>
    </button>

    <!-- FLOATING CENTER CONTENT (TEKS DI TENGAH PERSIS SEPERTI AWAL) -->
    <div class="relative z-20 max-w-4xl mx-auto text-center px-6 py-12 flex flex-col items-center pointer-events-auto">
      
      <!-- Badge Atas -->
      <div id="hero-badge" class="inline-flex items-center gap-2 px-3.5 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 shadow-sm backdrop-blur-sm bg-[#0B1F3A] text-white transition-all">
        <span class="text-amber-400">✦</span>
        <span id="hero-badge-text">NPD CLUB 1st RELEASE '26</span>
      </div>

      <!-- Judul Besar Streetwear Headline -->
      <h1 id="hero-title" class="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.98] font-poppins text-[#0B1F3A] transition-colors">
        <span id="hero-title-main">WHAT YOU WORE TODAY?</span> <br />
        <span id="hero-title-sub" class="text-[#0B1F3A]/85">NPD CLUB SOLUTION</span>
      </h1>

      <!-- Deskripsi Teks Tengah -->
      <p id="hero-desc" class="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed text-gray-700 font-medium transition-colors">
        Stop overthinking your daily fit. NPD CLUB delivers functional cuts, versatile tones, and clean silhouettes designed to effortlessly elevate your everyday routine. No stress, just solid style.
      </p>

      <!-- 3 TOMBOL UTAMA KOLEKSI: NPD, TDB, PICK ME -->
      <div class="mt-7 sm:mt-9 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        <!-- Tombol 1: NPD Collection -->
        <a id="hero-btn-npd" href="index.php?collection=npd-collection#katalog-section" class="px-5 sm:px-6 py-3 font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 active:scale-95 bg-[#0B1F3A] text-white hover:bg-black">
          <span>NPD 1st RELEASE</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </a>

        <!-- Tombol 2: TDB '26 -->
        <a id="hero-btn-tdb" href="index.php?collection=tdb-collection#katalog-section" class="px-5 sm:px-6 py-3 font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 active:scale-95 bg-white/90 border-2 border-[#0B1F3A] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white">
          <span>TDB '26</span>
        </a>

        <!-- Tombol 3: PICK ME '26 -->
        <a id="hero-btn-pickme" href="index.php?collection=pickme-collection#katalog-section" class="px-5 sm:px-6 py-3 font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 active:scale-95 bg-white/90 border-2 border-[#0B1F3A] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white">
          <span>PICK ME '26</span>
        </a>
      </div>

      <!-- Indicator Dots -->
      <div class="flex items-center gap-2 mt-8">
        <button onclick="goToSlide(0)" class="slide-dot w-8 h-1.5 rounded-full bg-[#0B1F3A] transition-all"></button>
        <button onclick="goToSlide(1)" class="slide-dot w-8 h-1.5 rounded-full bg-gray-300 transition-all"></button>
        <button onclick="goToSlide(2)" class="slide-dot w-8 h-1.5 rounded-full bg-gray-300 transition-all"></button>
      </div>

    </div>

  </section>

  <!-- =========================================================================
       4. PILIHAN KOLEKSI UTAMA (3 KARTU BERIKUT GAMBAR CUSTOM)
       ========================================================================= -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
    <div class="flex items-center justify-between pb-6 border-b border-[#F2F4F7] mb-8">
      <div>
        <span class="text-[10px] font-black tracking-widest uppercase text-gray-400">✦ EKSPLORASI GAYA</span>
        <h2 class="text-xl sm:text-2xl font-black uppercase text-[#0B1F3A] tracking-tight font-poppins mt-1">
          PILIHAN KOLEKSI UTAMA
        </h2>
      </div>
      <a href="index.php?collection=all#katalog-section" class="text-xs font-bold uppercase tracking-wider text-[#0B1F3A] hover:underline flex items-center gap-1">
        <span>Lihat Semua</span>
        <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      
      <!-- Kartu 1: NPD Collection -->
      <a href="index.php?collection=npd-collection#katalog-section" class="group relative aspect-[3/4] overflow-hidden bg-[#F2F4F7] shadow-sm hover:shadow-xl transition-all duration-500 block">
        <img src="assets/banners/npd.PNG" alt="NPD Collection" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700">
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
        <div class="absolute bottom-0 inset-x-0 p-6 text-white flex flex-col justify-end">
          <span class="inline-block px-2.5 py-0.5 bg-white text-[#0B1F3A] text-[10px] font-black uppercase tracking-widest w-fit mb-2">
            CORE SIGNATURE
          </span>
          <h3 class="text-xl sm:text-2xl font-black uppercase tracking-tight font-poppins">
            NPD COLLECTION
          </h3>
          <p class="text-xs text-gray-200 mt-1 line-clamp-2">
            Heavyweight boxy tees & iconic archival screenprints
          </p>
          <div class="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:translate-x-1 transition-transform">
            <span>Buka Koleksi Produk</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </div>
        </div>
      </a>

      <!-- Kartu 2: TDB Collection -->
      <a href="index.php?collection=tdb-collection#katalog-section" class="group relative aspect-[3/4] overflow-hidden bg-[#F2F4F7] shadow-sm hover:shadow-xl transition-all duration-500 block">
        <img src="assets/banners/tdb.PNG" alt="TDB Collection" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700">
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
        <div class="absolute bottom-0 inset-x-0 p-6 text-white flex flex-col justify-end">
          <span class="inline-block px-2.5 py-0.5 bg-white text-[#0B1F3A] text-[10px] font-black uppercase tracking-widest w-fit mb-2">
            TDB 2026
          </span>
          <h3 class="text-xl sm:text-2xl font-black uppercase tracking-tight font-poppins">
            TDB COLLECTION
          </h3>
          <p class="text-xs text-gray-200 mt-1 line-clamp-2">
            Beyond trends, beyond guidelines & raw streetwear identity
          </p>
          <div class="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:translate-x-1 transition-transform">
            <span>Buka Koleksi Produk</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </div>
        </div>
      </a>

      <!-- Kartu 3: Pick Me Collection -->
      <a href="index.php?collection=pickme-collection#katalog-section" class="group relative aspect-[3/4] overflow-hidden bg-[#F2F4F7] shadow-sm hover:shadow-xl transition-all duration-500 block">
        <img src="assets/banners/pick me.PNG" alt="Pick Me Collection" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700">
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
        <div class="absolute bottom-0 inset-x-0 p-6 text-white flex flex-col justify-end">
          <span class="inline-block px-2.5 py-0.5 bg-white text-[#0B1F3A] text-[10px] font-black uppercase tracking-widest w-fit mb-2">
            PICK ME GEAR
          </span>
          <h3 class="text-xl sm:text-2xl font-black uppercase tracking-tight font-poppins">
            PICK ME COLLECTION
          </h3>
          <p class="text-xs text-gray-200 mt-1 line-clamp-2">
            Tactical polar sherpa, balaclavas & 500 GSM loopback fleece
          </p>
          <div class="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:translate-x-1 transition-transform">
            <span>Buka Koleksi Produk</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </div>
        </div>
      </a>

    </div>
  </section>

  <!-- =========================================================================
       5. GRID PRODUK KATALOG (DENGAN 2 FOTO HOVER & FILTER PILLS)
       ========================================================================= -->
  <section id="katalog-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-[#F2F4F7]">
    
    <!-- Header Koleksi Aktif & Filter Pills -->
    <div class="pb-6 border-b border-[#F2F4F7] mb-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-black tracking-widest uppercase text-gray-400">✦ KOLEKSI AKTIF</span>
            <span class="text-[10px] font-bold bg-[#0B1F3A] text-white px-2 py-0.5 uppercase">
              <?= count($products) ?> PRODUK
            </span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black uppercase text-[#0B1F3A] tracking-tight font-poppins mt-1">
            <?= htmlspecialchars($active_title) ?>
          </h2>
          <p class="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
            <?= htmlspecialchars($active_desc) ?>
          </p>
        </div>

        <!-- Filter Pills Langsung -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 no-scrollbar">
          <a href="index.php?collection=all#katalog-section" class="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all <?= $current_col == 'all' ? 'bg-[#0B1F3A] text-white' : 'bg-[#F2F4F7] text-gray-700 hover:bg-gray-200' ?>">Semua</a>
          <a href="index.php?collection=npd-collection#katalog-section" class="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all <?= $current_col == 'npd-collection' ? 'bg-[#0B1F3A] text-white' : 'bg-[#F2F4F7] text-gray-700 hover:bg-gray-200' ?>">NPD Collection</a>
          <a href="index.php?collection=tdb-collection#katalog-section" class="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all <?= $current_col == 'tdb-collection' ? 'bg-[#0B1F3A] text-white' : 'bg-[#F2F4F7] text-gray-700 hover:bg-gray-200' ?>">TDB Collection</a>
          <a href="index.php?collection=pickme-collection#katalog-section" class="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all <?= $current_col == 'pickme-collection' ? 'bg-[#0B1F3A] text-white' : 'bg-[#F2F4F7] text-gray-700 hover:bg-gray-200' ?>">Pick Me Collection</a>
        </div>
      </div>
    </div>

    <!-- Product Grid Items -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      <?php foreach ($products as $p): ?>
        <?php 
          $isSoldOut = $p['is_sold_out'];
          $img1 = !empty($p['images'][0]) ? $p['images'][0] : 'assets/products/placeholder.jpg';
          $img2 = !empty($p['images'][1]) ? $p['images'][1] : $img1;
        ?>
        <div class="group flex flex-col bg-white">
          <!-- Card Image Container (SISTEM 2 GAMBAR: Foto 1 katalog, Foto 2 model saat hover) -->
          <div class="relative aspect-[3/4] bg-[#F2F4F7] overflow-hidden cursor-pointer" onclick="openProductDetail(<?= htmlspecialchars(json_encode($p)) ?>)">
            
            <!-- Foto 1: Packshot Baju Saja (Muncul default) -->
            <img src="<?= htmlspecialchars($img1) ?>" alt="<?= htmlspecialchars($p['name']) ?>" class="w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-500 group-hover:opacity-0 <?= $isSoldOut ? 'grayscale opacity-50' : '' ?>">
            
            <!-- Foto 2: Model Lookbook (Muncul saat mouse diarahkan / hover) -->
            <img src="<?= htmlspecialchars($img2) ?>" alt="<?= htmlspecialchars($p['name']) ?> on model" class="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transition-transform duration-700 <?= $isSoldOut ? 'grayscale opacity-50' : '' ?>">

            <!-- Sold Out Badge -->
            <?php if ($isSoldOut): ?>
              <div class="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#0B1F3A] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 shadow">
                SOLD OUT
              </div>
            <?php endif; ?>

            <!-- Heart Wishlist Button di Kanan Bawah Foto -->
            <button onclick="event.stopPropagation(); toggleWishlist(<?= $p['id'] ?>)" class="wishlist-btn-<?= $p['id'] ?> absolute bottom-2.5 right-2.5 p-2 bg-white/90 hover:bg-white text-[#0B1F3A] rounded-full shadow-md transition-all active:scale-90 z-10" title="Simpan ke Wishlist">
              <i data-lucide="heart" class="w-4 h-4 text-gray-700 hover:text-red-500"></i>
            </button>
          </div>

          <!-- Product Details -->
          <div class="pt-3 pb-1 flex flex-col flex-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <?= htmlspecialchars($p['collection_name']) ?>
            </span>
            <h3 class="text-xs sm:text-sm font-bold uppercase text-[#0B1F3A] tracking-tight mt-0.5 line-clamp-1 cursor-pointer hover:underline" onclick="openProductDetail(<?= htmlspecialchars(json_encode($p)) ?>)">
              <?= htmlspecialchars($p['name']) ?>
            </h3>
            
            <!-- Price -->
            <div class="mt-1 flex items-baseline gap-2">
              <span class="text-xs sm:text-sm font-black text-[#0B1F3A]">
                <?= formatRupiah($p['price']) ?>
              </span>
              <?php if (!empty($p['original_price']) && $p['original_price'] > $p['price']): ?>
                <span class="text-[11px] text-gray-400 line-through">
                  <?= formatRupiah($p['original_price']) ?>
                </span>
              <?php endif; ?>
            </div>

            <!-- Size Options Preview -->
            <div class="mt-2 flex items-center gap-1.5 overflow-x-auto text-[10px] font-bold text-gray-500">
              <?php foreach ($p['sizes'] as $sz): ?>
                <span class="px-1.5 py-0.5 bg-[#F2F4F7]"><?= htmlspecialchars($sz) ?></span>
              <?php endforeach; ?>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>

  </section>

  <!-- =========================================================================
       6. FOOTER LENGKAP DENGAN DESKRIPSI & TAUTAN KOLEKSI
       ========================================================================= -->
  <footer class="bg-white border-t border-[#F2F4F7] pt-12 pb-24 sm:pb-16 text-[#0B1F3A] mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#F2F4F7]">
        
        <!-- Brand info (Logo Font Bubble) -->
        <div class="md:col-span-5 space-y-3">
          <span class="font-bubble text-2xl sm:text-3xl text-[#0B1F3A] tracking-wider drop-shadow-[0_2px_4px_rgba(11,31,58,0.15)] inline-block">
            ✦ NPD CLUB
          </span>
          <p class="text-xs text-gray-500 max-w-sm leading-relaxed">
            is an urban uniform crafted for those who value detail, structure, and identity. Fusing classic utility elements with timeless streetwear silhouettes, we focus on durable builds, precise fits, and balanced color palettes. No loud gimmicks—just well-made apparel engineered for the movement of the city.
          </p>
          <div class="text-[11px] font-bold tracking-wider uppercase text-gray-400 pt-1">
            EST. 2026 • TANGERANG, INDONESIA
          </div>
        </div>

        <!-- Collections links -->
        <div class="md:col-span-3 space-y-2">
          <h4 class="text-xs font-black uppercase tracking-widest text-[#0B1F3A]">
            KATALOG KOLEKSI
          </h4>
          <ul class="space-y-1.5 text-xs text-gray-600">
            <li><a href="index.php?collection=npd-collection#katalog-section" class="hover:text-[#0B1F3A] hover:underline">NPD Collection (Signature)</a></li>
            <li><a href="index.php?collection=tdb-collection#katalog-section" class="hover:text-[#0B1F3A] hover:underline">TDB Collection '26</a></li>
            <li><a href="index.php?collection=pickme-collection#katalog-section" class="hover:text-[#0B1F3A] hover:underline">Pick Me Collection '26</a></li>
            <li><a href="index.php?collection=all#katalog-section" class="hover:text-[#0B1F3A] hover:underline font-semibold">Lihat Semua Katalog</a></li>
          </ul>
        </div>

        <!-- Customer Service & Security -->
        <div class="md:col-span-4 space-y-2">
          <h4 class="text-xs font-black uppercase tracking-widest text-[#0B1F3A]">
            LAYANAN PELANGGAN
          </h4>
          <p class="text-xs text-gray-500 leading-relaxed">
            Metode pembayaran resmi: QRIS, BCA VA, BRI VA, Mandiri VA, BNI VA. Pengiriman kilat ke seluruh Indonesia & Worldwide.
          </p>
        </div>

      </div>

      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
        <span>© 2026 NPD CLUB. Hak Cipta Dilindungi.</span>
        <span class="tracking-widest uppercase font-bold text-[#0B1F3A]">STREETWEAR ARCHIVE DROP</span>
      </div>
    </div>
  </footer>

  <!-- =========================================================================
       7. BOTTOM FLOATING NAVIGATION (UNTUK HP & TABLET)
       ========================================================================= -->
  <div class="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#F2F4F7] z-40 py-2 px-4 flex items-center justify-around shadow-lg">
    <a href="index.php" class="flex flex-col items-center text-[10px] font-bold uppercase text-[#0B1F3A]">
      <i data-lucide="home" class="w-5 h-5"></i>
      <span>Home</span>
    </a>
    <a href="index.php?collection=all#katalog-section" class="flex flex-col items-center text-[10px] font-bold uppercase text-gray-500 hover:text-[#0B1F3A]">
      <i data-lucide="layers" class="w-5 h-5"></i>
      <span>Katalog</span>
    </a>
    <button onclick="toggleWishlistView()" class="flex flex-col items-center text-[10px] font-bold uppercase text-gray-500 hover:text-[#0B1F3A] relative">
      <i data-lucide="heart" class="w-5 h-5"></i>
      <span>Wishlist</span>
    </button>
    <button onclick="openCartDrawer()" class="flex flex-col items-center text-[10px] font-bold uppercase text-gray-500 hover:text-[#0B1F3A] relative">
      <i data-lucide="shopping-bag" class="w-5 h-5"></i>
      <span>Cart</span>
    </button>
  </div>

  <!-- =========================================================================
       8. MODAL DETAIL PRODUK (POPUP LENGKAP 2 GAMBAR & VARIAN)
       ========================================================================= -->
  <div id="product-detail-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
      <button onclick="closeProductDetail()" class="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div class="grid grid-cols-1 md:grid-cols-2">
        <!-- Gallery Preview -->
        <div class="bg-[#F2F4F7] p-6 flex flex-col justify-between">
          <div class="aspect-[3/4] bg-white overflow-hidden relative shadow-inner">
            <img id="modal-main-img" src="" alt="Detail Produk" class="w-full h-full object-cover">
            <div id="modal-sold-badge" class="absolute top-3 left-3 bg-[#0B1F3A] text-white text-[10px] font-black px-3 py-1 uppercase hidden">
              SOLD OUT
            </div>
          </div>
          
          <!-- Thumbnails 1. Katalog & 2. Model -->
          <div class="flex gap-3 mt-4">
            <button onclick="setModalImage(0)" class="thumb-btn flex flex-col items-center gap-1 border-2 border-[#0B1F3A] p-0.5">
              <img id="modal-thumb-0" src="" class="w-14 h-16 object-cover">
              <span class="text-[9px] font-bold uppercase">1. Katalog</span>
            </button>
            <button onclick="setModalImage(1)" class="thumb-btn flex flex-col items-center gap-1 border-2 border-transparent p-0.5 opacity-60 hover:opacity-100">
              <img id="modal-thumb-1" src="" class="w-14 h-16 object-cover">
              <span class="text-[9px] font-bold uppercase">2. Model</span>
            </button>
          </div>
        </div>

        <!-- Product Options -->
        <div class="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <span id="modal-col-name" class="text-[10px] font-black uppercase text-gray-400"></span>
            <h2 id="modal-title" class="text-xl sm:text-2xl font-black uppercase text-[#0B1F3A] font-poppins mt-1"></h2>
            
            <div class="mt-2 flex items-baseline gap-3">
              <span id="modal-price" class="text-xl font-black text-[#0B1F3A]"></span>
              <span id="modal-orig-price" class="text-xs text-gray-400 line-through"></span>
            </div>

            <p id="modal-desc" class="text-xs text-gray-600 mt-4 leading-relaxed"></p>

            <!-- Size Selector -->
            <div class="mt-6">
              <label class="text-[11px] font-bold uppercase text-gray-500 block mb-2">Pilih Ukuran:</label>
              <div id="modal-sizes" class="flex gap-2"></div>
            </div>

            <!-- Color Info -->
            <div class="mt-4">
              <label class="text-[11px] font-bold uppercase text-gray-500 block mb-1">Pilihan Warna:</label>
              <div id="modal-colors" class="flex gap-2 text-xs font-semibold text-[#0B1F3A]"></div>
            </div>
          </div>

          <!-- Add to Cart Button -->
          <div class="mt-8 pt-4 border-t border-gray-100">
            <button id="modal-add-btn" onclick="addToCartFromModal()" class="w-full py-3.5 bg-[#0B1F3A] text-white font-bold text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow">
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              <span>TAMBAH KE KERANJANG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- =========================================================================
       9. DRAWER KERANJANG (SLIDE-IN CART DRAWER)
       ========================================================================= -->
  <div id="cart-drawer-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden transition-opacity" onclick="closeCartDrawer()"></div>
  <div id="cart-drawer" class="fixed inset-y-0 right-0 max-w-md w-full bg-white z-50 shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col">
    
    <!-- Drawer Header -->
    <div class="p-4 sm:p-6 border-b border-[#F2F4F7] flex items-center justify-between">
      <div class="flex items-center gap-2">
        <i data-lucide="shopping-bag" class="w-5 h-5 text-[#0B1F3A]"></i>
        <h3 class="text-sm font-black uppercase tracking-wider text-[#0B1F3A]">Keranjang Belanja</h3>
        <span id="drawer-cart-count" class="text-xs bg-[#0B1F3A] text-white px-2 py-0.5 font-bold">0</span>
      </div>
      <button onclick="closeCartDrawer()" class="p-1 text-gray-400 hover:text-[#0B1F3A]">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <!-- Drawer Items List -->
    <div id="cart-items-container" class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
      <!-- Diisi oleh JavaScript -->
    </div>

    <!-- Drawer Footer & Checkout -->
    <div class="p-4 sm:p-6 border-t border-[#F2F4F7] bg-gray-50 space-y-3">
      <div class="flex justify-between text-xs text-gray-500">
        <span>Subtotal</span>
        <span id="cart-subtotal" class="font-bold text-[#0B1F3A]">IDR 0</span>
      </div>
      <div class="flex justify-between text-xs text-gray-500">
        <span>Ongkos Kirim</span>
        <span id="cart-shipping" class="font-bold text-green-600">GRATIS</span>
      </div>
      <div class="flex justify-between text-sm font-black text-[#0B1F3A] pt-2 border-t border-gray-200">
        <span>Total Pembayaran</span>
        <span id="cart-total">IDR 0</span>
      </div>

      <button onclick="openCheckoutModal()" class="w-full py-3.5 bg-[#0B1F3A] text-white font-bold text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow mt-4">
        <span>LANJUT KE CHECKOUT</span>
        <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </button>
    </div>
  </div>

  <!-- =========================================================================
       10. MODAL CHECKOUT & PENGIRIMAN
       ========================================================================= -->
  <div id="checkout-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-white max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
      <button onclick="closeCheckoutModal()" class="absolute top-4 right-4 text-gray-400 hover:text-black">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">✦ PENGIRIMAN & PEMBAYARAN</span>
      <h3 class="text-xl font-black uppercase text-[#0B1F3A] font-poppins mt-1">INFORMASI CHECKOUT</h3>

      <form id="checkout-form" onsubmit="handleProcessCheckout(event)" class="mt-6 space-y-4 text-xs">
        <div>
          <label class="block font-bold uppercase text-gray-600 mb-1">Nama Lengkap Penerima</label>
          <input type="text" id="chk-name" required placeholder="Contoh: Fauzan NPD" class="w-full p-3 border border-gray-300 focus:border-[#0B1F3A] outline-none font-medium">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold uppercase text-gray-600 mb-1">No. WhatsApp / HP</label>
            <input type="tel" id="chk-phone" required placeholder="081234567890" class="w-full p-3 border border-gray-300 focus:border-[#0B1F3A] outline-none font-medium">
          </div>
          <div>
            <label class="block font-bold uppercase text-gray-600 mb-1">Kota / Kabupaten</label>
            <input type="text" id="chk-city" required placeholder="Tangerang" class="w-full p-3 border border-gray-300 focus:border-[#0B1F3A] outline-none font-medium">
          </div>
        </div>
        <div>
          <label class="block font-bold uppercase text-gray-600 mb-1">Alamat Lengkap Pengiriman</label>
          <textarea id="chk-address" required rows="2" placeholder="Nama Jalan, Nomor Rumah, RT/RW, Kecamatan" class="w-full p-3 border border-gray-300 focus:border-[#0B1F3A] outline-none font-medium"></textarea>
        </div>

        <div>
          <label class="block font-bold uppercase text-gray-600 mb-2">Pilih Metode Pembayaran</label>
          <div class="space-y-2">
            <label class="flex items-center gap-3 p-3 border border-gray-200 cursor-pointer hover:border-[#0B1F3A]">
              <input type="radio" name="payment_method" value="qris" checked class="accent-[#0B1F3A]">
              <span class="font-bold text-[#0B1F3A]">QRIS (Realtime Dynamic QR - Semua E-Wallet & Bank)</span>
            </label>
            <label class="flex items-center gap-3 p-3 border border-gray-200 cursor-pointer hover:border-[#0B1F3A]">
              <input type="radio" name="payment_method" value="bca_va" class="accent-[#0B1F3A]">
              <span class="font-bold text-[#0B1F3A]">BCA Virtual Account</span>
            </label>
            <label class="flex items-center gap-3 p-3 border border-gray-200 cursor-pointer hover:border-[#0B1F3A]">
              <input type="radio" name="payment_method" value="mandiri_va" class="accent-[#0B1F3A]">
              <span class="font-bold text-[#0B1F3A]">Mandiri Virtual Account</span>
            </label>
            <label class="flex items-center gap-3 p-3 border border-gray-200 cursor-pointer hover:border-[#0B1F3A]">
              <input type="radio" name="payment_method" value="bri_va" class="accent-[#0B1F3A]">
              <span class="font-bold text-[#0B1F3A]">BRI Virtual Account</span>
            </label>
          </div>
        </div>

        <button type="submit" class="w-full py-4 bg-[#0B1F3A] text-white font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-md mt-6">
          BAYAR SEKARANG
        </button>
      </form>
    </div>
  </div>

  <!-- =========================================================================
       11. MODAL PEMBAYARAN (QRIS DINAMIS & VIRTUAL ACCOUNT)
       ========================================================================= -->
  <div id="payment-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-white max-w-md w-full shadow-2xl p-6 sm:p-8 text-center relative max-h-[90vh] overflow-y-auto">
      <button onclick="closePaymentModal()" class="absolute top-4 right-4 text-gray-400 hover:text-black">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div class="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
        <i data-lucide="check" class="w-6 h-6"></i>
      </div>

      <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">STATUS PEMBAYARAN PENDING</span>
      <h3 class="text-lg font-black uppercase text-[#0B1F3A] font-poppins mt-1">SELESAIKAN PEMBAYARAN</h3>

      <div class="bg-[#F2F4F7] p-3 my-4 rounded text-xs space-y-1">
        <div class="flex justify-between text-gray-500">
          <span>No. Pesanan:</span>
          <span id="pay-order-no" class="font-bold text-[#0B1F3A]"></span>
        </div>
        <div class="flex justify-between text-gray-500">
          <span>Total Tagihan:</span>
          <span id="pay-total-amount" class="font-black text-[#0B1F3A]"></span>
        </div>
        <div class="flex justify-between text-gray-500">
          <span>Batas Waktu:</span>
          <span id="pay-countdown" class="font-bold text-red-600">23:59:59</span>
        </div>
      </div>

      <!-- Tampilan QRIS -->
      <div id="pay-qris-container" class="my-4 hidden flex flex-col items-center">
        <p class="text-[11px] text-gray-500 mb-2">Scan QRIS ini menggunakan GoPay, OVO, Dana, BCA, atau M-Banking:</p>
        <div id="qrcode" class="p-3 bg-white border border-gray-200 shadow-sm inline-block"></div>
      </div>

      <!-- Tampilan Virtual Account -->
      <div id="pay-va-container" class="my-4 hidden">
        <p class="text-[11px] text-gray-500 mb-1">Nomor Rekening Virtual Account:</p>
        <div class="flex items-center justify-center gap-2 bg-gray-100 p-3 rounded font-mono font-bold text-sm text-[#0B1F3A]">
          <span id="pay-va-number">8801239841234</span>
          <button onclick="copyVaNumber()" class="p-1 hover:text-blue-600" title="Salin Nomor VA">
            <i data-lucide="copy" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- Tombol Aksi Simulasi & WhatsApp -->
      <div class="mt-6 space-y-2">
        <button onclick="simulatePaymentSuccess()" class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-widest transition-all">
          ✓ SIMULASI BAYAR SEKARANG
        </button>
        <button onclick="confirmOrderViaWhatsApp()" class="w-full py-3 bg-[#0B1F3A] hover:bg-black text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
          <span>KONFIRMASI VIA WHATSAPP</span>
        </button>
      </div>

    </div>
  </div>

  <!-- =========================================================================
       11b. AUTH MODAL (LOGIN & REGISTRASI TERHUBUNG DATABASE MYSQL)
       ========================================================================= -->
  <div id="auth-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md p-6 sm:p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
      
      <!-- Close Button -->
      <button onclick="closeAuthModal()" class="absolute top-4 right-4 p-2 text-gray-400 hover:text-black">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <!-- VIEW 1: Form Guest (Tab Login & Tab Register) -->
      <div id="auth-forms-container">
        <!-- Logo & Header -->
        <div class="text-center mb-6">
          <span class="font-bubble text-2xl text-[#0B1F3A]">✦ NPD CLUB</span>
          <p class="text-xs text-gray-500 uppercase tracking-wider mt-1">Akun Member Streetwear Archive</p>
        </div>

        <!-- Tab Selector: Masuk vs Daftar -->
        <div class="grid grid-cols-2 gap-2 p-1 bg-gray-100 mb-6 rounded text-xs font-bold uppercase tracking-wider">
          <button id="tab-btn-login" onclick="switchAuthTab('login')" class="py-2.5 rounded bg-white text-[#0B1F3A] shadow-sm transition-all">
            Masuk
          </button>
          <button id="tab-btn-register" onclick="switchAuthTab('register')" class="py-2.5 rounded text-gray-500 hover:text-black transition-all">
            Daftar Akun
          </button>
        </div>

        <!-- TAB LOGIN -->
        <div id="auth-tab-login">
          <div id="login-error" class="hidden mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded"></div>
          
          <form onsubmit="handleLoginSubmit(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Email</label>
              <input type="email" id="login-email" required placeholder="nama@email.com" class="w-full px-3 py-2.5 border border-gray-300 text-xs focus:outline-none focus:border-[#0B1F3A]">
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Kata Sandi</label>
              <input type="password" id="login-password" required placeholder="••••••••" class="w-full px-3 py-2.5 border border-gray-300 text-xs focus:outline-none focus:border-[#0B1F3A]">
            </div>
            <button type="submit" id="login-submit-btn" class="w-full py-3 bg-[#0B1F3A] hover:bg-[#163259] text-white text-xs font-black uppercase tracking-widest transition-all">
              Masuk ke Akun
            </button>
          </form>

          <p class="mt-4 text-center text-xs text-gray-500">
            Belum punya akun? <a href="javascript:void(0)" onclick="switchAuthTab('register')" class="font-bold text-[#0B1F3A] hover:underline">Daftar sekarang</a>
          </p>
        </div>

        <!-- TAB REGISTER -->
        <div id="auth-tab-register" class="hidden">
          <div id="reg-error" class="hidden mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded"></div>
          
          <form onsubmit="handleRegisterSubmit(event)" class="space-y-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Nama Lengkap</label>
              <input type="text" id="reg-name" required placeholder="Nama Anda" class="w-full px-3 py-2.5 border border-gray-300 text-xs focus:outline-none focus:border-[#0B1F3A]">
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Email</label>
              <input type="email" id="reg-email" required placeholder="nama@email.com" class="w-full px-3 py-2.5 border border-gray-300 text-xs focus:outline-none focus:border-[#0B1F3A]">
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">No. WhatsApp / HP</label>
              <input type="tel" id="reg-phone" placeholder="08123456789" class="w-full px-3 py-2.5 border border-gray-300 text-xs focus:outline-none focus:border-[#0B1F3A]">
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Kata Sandi (Min. 6 Karakter)</label>
              <input type="password" id="reg-password" required minlength="6" placeholder="••••••••" class="w-full px-3 py-2.5 border border-gray-300 text-xs focus:outline-none focus:border-[#0B1F3A]">
            </div>
            <button type="submit" id="reg-submit-btn" class="w-full py-3 bg-[#0B1F3A] hover:bg-[#163259] text-white text-xs font-black uppercase tracking-widest transition-all">
              Daftar Akun Baru
            </button>
          </form>

          <p class="mt-4 text-center text-xs text-gray-500">
            Sudah punya akun? <a href="javascript:void(0)" onclick="switchAuthTab('login')" class="font-bold text-[#0B1F3A] hover:underline">Masuk di sini</a>
          </p>
        </div>
      </div>

      <!-- VIEW 2: Profil Pengguna (Saat Sudah Login) -->
      <div id="auth-profile-container" class="hidden text-center py-2">
        <div class="w-16 h-16 rounded-full bg-[#0B1F3A] text-white font-bubble text-2xl flex items-center justify-center mx-auto mb-3 shadow-md" id="profile-avatar">
          U
        </div>
        <h3 id="profile-name" class="text-lg font-black uppercase text-[#0B1F3A] font-poppins">Nama Pengguna</h3>
        <p id="profile-email" class="text-xs text-gray-500 mt-0.5">email@domain.com</p>
        <p id="profile-phone" class="text-xs text-gray-500 mt-0.5">-</p>

        <div class="mt-4 p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded text-left">
          <p class="font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-green-500 inline-block animate-ping"></span>
            Terhubung ke Database MySQL
          </p>
          <p class="text-[11px] text-green-700 mt-1">Akun Anda tersimpan aman di database <code class="font-mono">npd_club.users</code>.</p>
        </div>

        <div class="mt-6 space-y-2">
          <button onclick="closeAuthModal()" class="w-full py-2.5 border border-[#0B1F3A] text-[#0B1F3A] font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-all">
            Lanjut Berbelanja
          </button>
          <button onclick="handleLogout()" class="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all">
            Keluar / Logout
          </button>
        </div>
      </div>

    </div>
  </div>

  <!-- =========================================================================
       12. JAVASCRIPT LOGIC (SLIDER LENGKAP DENGAN PERUBAHAN TEKS & TEMA)
       ========================================================================= -->
  <script>
    // Inisialisasi ikon Lucide
    lucide.createIcons();

    // --------------------------------------------------------------------------
    // 1. DATA SLIDE & LOGIKA CAROUSEL (TEKS BERUBAH SESUAI SLIDE AKTIF)
    // --------------------------------------------------------------------------
    const SLIDES_DATA = [
      {
        badge: "NPD CLUB 1st RELEASE '26",
        titleMain: "WHAT YOU WORE TODAY?",
        titleSub: "NPD CLUB SOLUTION",
        desc: "Stop overthinking your daily fit. NPD CLUB delivers functional cuts, versatile tones, and clean silhouettes designed to effortlessly elevate your everyday routine. No stress, just solid style.",
        theme: "light",
        activeCollection: "npd"
      },
      {
        badge: "TDB '26 DROP",
        titleMain: "NO RULES",
        titleSub: "JUST CULTURE",
        desc: "Beyond trends, beyond guidelines. We don’t follow standard blueprints—we reflect the spirit, music, and raw identity of the streets.",
        theme: "dark",
        activeCollection: "tdb"
      },
      {
        badge: "PICK ME '26",
        titleMain: "LOOKING SHARP?",
        titleSub: "NPD’S GOT YOUR BACK.",
        desc: "Style isn't just about what you wear—it’s how you carry yourself. NPD is here to elevate your everyday look with functional cuts, versatile tones, and clean silhouettes.",
        theme: "dark",
        activeCollection: "pickme"
      }
    ];

    let currentSlide = 0;
    const bgSlides = [
      document.getElementById('slide-bg-0'),
      document.getElementById('slide-bg-1'),
      document.getElementById('slide-bg-2')
    ];
    const dots = document.querySelectorAll('.slide-dot');

    function showSlide(index) {
      currentSlide = index;
      const data = SLIDES_DATA[index];
      const isLight = (data.theme === 'light');

      // 1. Ganti Background
      bgSlides.forEach((s, i) => {
        if (s) {
          if (i === index) {
            s.classList.remove('opacity-0');
            s.classList.add('opacity-100');
          } else {
            s.classList.remove('opacity-100');
            s.classList.add('opacity-0');
          }
        }
      });

      // 2. Ganti Teks Tengah
      document.getElementById('hero-badge-text').innerText = data.badge;
      document.getElementById('hero-title-main').innerText = data.titleMain;
      document.getElementById('hero-title-sub').innerText = data.titleSub;
      document.getElementById('hero-desc').innerText = data.desc;

      // 3. Sesuaikan Warna Teks Sesuai Tema Light / Dark agar terbaca jelas
      const titleEl = document.getElementById('hero-title');
      const titleSubEl = document.getElementById('hero-title-sub');
      const descEl = document.getElementById('hero-desc');
      const badgeEl = document.getElementById('hero-badge');

      if (isLight) {
        titleEl.className = 'text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.98] font-poppins text-[#0B1F3A] transition-colors';
        titleSubEl.className = 'text-[#0B1F3A]/85';
        descEl.className = 'mt-4 sm:mt-6 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed text-gray-700 font-medium transition-colors';
        badgeEl.className = 'inline-flex items-center gap-2 px-3.5 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 shadow-sm backdrop-blur-sm bg-[#0B1F3A] text-white transition-all';
      } else {
        titleEl.className = 'text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.98] font-poppins text-white transition-colors';
        titleSubEl.className = 'text-gray-200';
        descEl.className = 'mt-4 sm:mt-6 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed text-gray-200 font-medium transition-colors';
        badgeEl.className = 'inline-flex items-center gap-2 px-3.5 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 shadow-sm backdrop-blur-sm bg-white/20 border border-white/30 text-white transition-all';
      }

      // 4. Update Tombol Koleksi
      const btnNpd = document.getElementById('hero-btn-npd');
      const btnTdb = document.getElementById('hero-btn-tdb');
      const btnPickme = document.getElementById('hero-btn-pickme');

      if (isLight) {
        btnNpd.className = 'px-5 sm:px-6 py-3 font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 active:scale-95 bg-[#0B1F3A] text-white hover:bg-black';
        btnTdb.className = 'px-5 sm:px-6 py-3 font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 active:scale-95 bg-white/90 border-2 border-[#0B1F3A] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white';
        btnPickme.className = 'px-5 sm:px-6 py-3 font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 active:scale-95 bg-white/90 border-2 border-[#0B1F3A] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white';
      } else {
        btnNpd.className = data.activeCollection === 'npd' 
          ? 'px-5 sm:px-6 py-3 font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 active:scale-95 bg-white text-[#0B1F3A] hover:bg-gray-100 ring-2 ring-white/50'
          : 'px-5 sm:px-6 py-3 font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 active:scale-95 bg-white/15 hover:bg-white text-white hover:text-[#0B1F3A] border border-white/30';

        btnTdb.className = data.activeCollection === 'tdb' 
          ? 'px-5 sm:px-6 py-3 font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 active:scale-95 bg-white text-[#0B1F3A] hover:bg-gray-100 ring-2 ring-white/50'
          : 'px-5 sm:px-6 py-3 font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 active:scale-95 bg-white/15 hover:bg-white text-white hover:text-[#0B1F3A] border border-white/30';

        btnPickme.className = data.activeCollection === 'pickme' 
          ? 'px-5 sm:px-6 py-3 font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 active:scale-95 bg-white text-[#0B1F3A] hover:bg-gray-100 ring-2 ring-white/50'
          : 'px-5 sm:px-6 py-3 font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 active:scale-95 bg-white/15 hover:bg-white text-white hover:text-[#0B1F3A] border border-white/30';
      }

      // 5. Update Dots
      dots.forEach((d, i) => {
        if (i === index) {
          d.className = isLight ? 'slide-dot w-8 h-1.5 rounded-full bg-[#0B1F3A] transition-all' : 'slide-dot w-8 h-1.5 rounded-full bg-white transition-all';
        } else {
          d.className = isLight ? 'slide-dot w-8 h-1.5 rounded-full bg-gray-300 transition-all' : 'slide-dot w-8 h-1.5 rounded-full bg-white/40 transition-all';
        }
      });
      lucide.createIcons();
    }

    function nextSlide() {
      showSlide((currentSlide + 1) % SLIDES_DATA.length);
    }

    function prevSlide() {
      showSlide((currentSlide - 1 + SLIDES_DATA.length) % SLIDES_DATA.length);
    }

    function goToSlide(idx) {
      showSlide(idx);
    }

    // Auto-slide setiap 6 detik
    setInterval(nextSlide, 6000);

    // --------------------------------------------------------------------------
    // 2. KERANJANG BELANJA (LOCALSTORAGE PERSISTENT)
    // --------------------------------------------------------------------------
    let cart = JSON.parse(localStorage.getItem('npd_cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('npd_wishlist')) || [];

    function saveCart() {
      localStorage.setItem('npd_cart', JSON.stringify(cart));
      updateCartUI();
    }

    function saveWishlist() {
      localStorage.setItem('npd_wishlist', JSON.stringify(wishlist));
      updateWishlistUI();
    }

    function updateCartUI() {
      const count = cart.reduce((acc, item) => acc + item.qty, 0);
      const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
      const total = subtotal;

      const badge = document.getElementById('cart-badge');
      const drawerCount = document.getElementById('drawer-cart-count');
      
      if (count > 0) {
        badge.innerText = count;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
      if (drawerCount) drawerCount.innerText = count;

      document.getElementById('cart-subtotal').innerText = formatRupiahJs(subtotal);
      document.getElementById('cart-total').innerText = formatRupiahJs(total);

      const container = document.getElementById('cart-items-container');
      if (cart.length === 0) {
        container.innerHTML = `
          <div class="py-12 text-center text-gray-400">
            <i data-lucide="shopping-bag" class="w-10 h-10 mx-auto mb-2 opacity-50"></i>
            <p class="text-xs uppercase font-bold tracking-wider">Keranjang masih kosong</p>
          </div>
        `;
      } else {
        container.innerHTML = cart.map((item, idx) => `
          <div class="flex gap-4 pb-4 border-b border-gray-100 items-center">
            <img src="${item.image}" class="w-16 h-20 object-cover bg-gray-100">
            <div class="flex-1 text-xs">
              <h4 class="font-bold uppercase text-[#0B1F3A] line-clamp-1">${item.name}</h4>
              <p class="text-gray-500 mt-0.5">Size: ${item.size} • ${item.color}</p>
              <div class="flex items-center justify-between mt-2">
                <span class="font-black text-[#0B1F3A]">${formatRupiahJs(item.price)}</span>
                <div class="flex items-center border border-gray-200">
                  <button onclick="changeQty(${idx}, -1)" class="px-2 py-0.5 hover:bg-gray-100">-</button>
                  <span class="px-2 py-0.5 font-bold">${item.qty}</span>
                  <button onclick="changeQty(${idx}, 1)" class="px-2 py-0.5 hover:bg-gray-100">+</button>
                </div>
              </div>
            </div>
            <button onclick="removeFromCart(${idx})" class="p-1 text-gray-400 hover:text-red-500">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        `).join('');
      }
      lucide.createIcons();
    }

    function openCartDrawer() {
      document.getElementById('cart-drawer-backdrop').classList.remove('hidden');
      document.getElementById('cart-drawer').classList.remove('translate-x-full');
      updateCartUI();
    }

    function closeCartDrawer() {
      document.getElementById('cart-drawer-backdrop').classList.add('hidden');
      document.getElementById('cart-drawer').classList.add('translate-x-full');
    }

    function changeQty(index, diff) {
      if (cart[index]) {
        cart[index].qty += diff;
        if (cart[index].qty <= 0) {
          cart.splice(index, 1);
        }
        saveCart();
      }
    }

    function removeFromCart(index) {
      cart.splice(index, 1);
      saveCart();
    }

    // --------------------------------------------------------------------------
    // 3. PRODUCT DETAIL MODAL
    // --------------------------------------------------------------------------
    let activeProduct = null;
    let selectedSize = '';
    let selectedColor = '';

    function openProductDetail(product) {
      activeProduct = product;
      document.getElementById('modal-main-img').src = product.images[0] || '';
      document.getElementById('modal-thumb-0').src = product.images[0] || '';
      document.getElementById('modal-thumb-1').src = product.images[1] || product.images[0] || '';
      document.getElementById('modal-col-name').innerText = product.collection_name;
      document.getElementById('modal-title').innerText = product.name;
      document.getElementById('modal-price').innerText = formatRupiahJs(product.price);
      
      const origEl = document.getElementById('modal-orig-price');
      if (product.original_price && product.original_price > product.price) {
        origEl.innerText = formatRupiahJs(product.original_price);
        origEl.classList.remove('hidden');
      } else {
        origEl.classList.add('hidden');
      }

      document.getElementById('modal-desc').innerText = product.description;

      // Sold out state
      const soldBadge = document.getElementById('modal-sold-badge');
      const addBtn = document.getElementById('modal-add-btn');
      if (product.is_sold_out) {
        soldBadge.classList.remove('hidden');
        addBtn.disabled = true;
        addBtn.innerText = 'PRODUK HABIS (SOLD OUT)';
        addBtn.className = 'w-full py-3.5 bg-gray-400 text-white font-bold text-xs uppercase cursor-not-allowed';
      } else {
        soldBadge.classList.add('hidden');
        addBtn.disabled = false;
        addBtn.innerHTML = '<i data-lucide="shopping-bag" class="w-4 h-4"></i><span>TAMBAH KE KERANJANG</span>';
        addBtn.className = 'w-full py-3.5 bg-[#0B1F3A] text-white font-bold text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow';
      }

      // Sizes
      selectedSize = product.sizes[0] || 'M';
      const sizesContainer = document.getElementById('modal-sizes');
      sizesContainer.innerHTML = product.sizes.map(sz => `
        <button onclick="selectModalSize('${sz}')" class="size-opt-${sz} px-3 py-1.5 border ${sz === selectedSize ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white' : 'border-gray-300 text-gray-700'} text-xs font-bold uppercase transition-all">
          ${sz}
        </button>
      `).join('');

      // Colors
      selectedColor = (product.colors && product.colors[0]) ? product.colors[0].name : '';
      const colorsContainer = document.getElementById('modal-colors');
      colorsContainer.innerHTML = (product.colors || []).map(c => `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded text-[11px]">
          <span class="w-2.5 h-2.5 rounded-full inline-block border border-gray-300" style="background-color: ${c.code}"></span>
          <span>${c.name}</span>
        </span>
      `).join('');

      document.getElementById('product-detail-modal').classList.remove('hidden');
      lucide.createIcons();
    }

    function closeProductDetail() {
      document.getElementById('product-detail-modal').classList.add('hidden');
    }

    function setModalImage(idx) {
      if (activeProduct && activeProduct.images[idx]) {
        document.getElementById('modal-main-img').src = activeProduct.images[idx];
        const thumbs = document.querySelectorAll('.thumb-btn');
        thumbs.forEach((t, i) => {
          if (i === idx) {
            t.className = 'thumb-btn flex flex-col items-center gap-1 border-2 border-[#0B1F3A] p-0.5 opacity-100';
          } else {
            t.className = 'thumb-btn flex flex-col items-center gap-1 border-2 border-transparent p-0.5 opacity-60 hover:opacity-100';
          }
        });
      }
    }

    function selectModalSize(sz) {
      selectedSize = sz;
      if (activeProduct) {
        document.querySelectorAll('[class*="size-opt-"]').forEach(btn => {
          btn.className = btn.className.replace('border-[#0B1F3A] bg-[#0B1F3A] text-white', 'border-gray-300 text-gray-700');
        });
        const currentBtn = document.querySelector(`.size-opt-${sz}`);
        if (currentBtn) {
          currentBtn.className = `size-opt-${sz} px-3 py-1.5 border border-[#0B1F3A] bg-[#0B1F3A] text-white text-xs font-bold uppercase transition-all`;
        }
      }
    }

    function addToCartFromModal() {
      if (!activeProduct || activeProduct.is_sold_out) return;

      const existingIndex = cart.findIndex(item => item.id === activeProduct.id && item.size === selectedSize);
      if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
      } else {
        cart.push({
          id: activeProduct.id,
          name: activeProduct.name,
          price: activeProduct.price,
          image: activeProduct.images[0] || '',
          size: selectedSize,
          color: selectedColor || 'Standard',
          qty: 1
        });
      }
      saveCart();
      closeProductDetail();
      openCartDrawer();
    }

    // --------------------------------------------------------------------------
    // 4. CHECKOUT & SIMULASI PEMBAYARAN
    // --------------------------------------------------------------------------
    let currentOrder = null;

    function openCheckoutModal() {
      if (cart.length === 0) {
        alert('Keranjang belanja Anda masih kosong.');
        return;
      }
      closeCartDrawer();
      document.getElementById('checkout-modal').classList.remove('hidden');
    }

    function closeCheckoutModal() {
      document.getElementById('checkout-modal').classList.add('hidden');
    }

    function handleProcessCheckout(e) {
      e.preventDefault();
      const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
      const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
      const orderNumber = 'NPD-' + Date.now().toString().slice(-6);

      currentOrder = {
        orderNumber: orderNumber,
        name: document.getElementById('chk-name').value,
        phone: document.getElementById('chk-phone').value,
        city: document.getElementById('chk-city').value,
        address: document.getElementById('chk-address').value,
        paymentMethod: paymentMethod,
        items: [...cart],
        total: subtotal
      };

      closeCheckoutModal();
      openPaymentModal(currentOrder);
    }

    function openPaymentModal(order) {
      document.getElementById('pay-order-no').innerText = order.orderNumber;
      document.getElementById('pay-total-amount').innerText = formatRupiahJs(order.total);

      const qrisBox = document.getElementById('pay-qris-container');
      const vaBox = document.getElementById('pay-va-container');

      if (order.paymentMethod === 'qris') {
        qrisBox.classList.remove('hidden');
        vaBox.classList.add('hidden');
        
        // Generate QR code instan
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = '';
        new QRCode(qrContainer, {
          text: `00020101021226670014ID.LINKAJA.WWW011893600918000000000052045812530336054${order.total}5802ID5910NPD CLUB6007JAKARTA6304ABCD`,
          width: 180,
          height: 180
        });
      } else {
        qrisBox.classList.add('hidden');
        vaBox.classList.remove('hidden');
        const randVA = '880' + Math.floor(1000000000 + Math.random() * 9000000000);
        document.getElementById('pay-va-number').innerText = randVA;
      }

      document.getElementById('payment-modal').classList.remove('hidden');
      lucide.createIcons();
    }

    function closePaymentModal() {
      document.getElementById('payment-modal').classList.add('hidden');
    }

    function copyVaNumber() {
      const va = document.getElementById('pay-va-number').innerText;
      navigator.clipboard.writeText(va);
      alert('Nomor Virtual Account disalin: ' + va);
    }

    function simulatePaymentSuccess() {
      alert('Pembayaran Berhasil Dikonfirmasi! Pesanan Anda sedang diproses oleh NPD CLUB.');
      cart = [];
      saveCart();
      closePaymentModal();
      window.location.href = 'index.php';
    }

    function confirmOrderViaWhatsApp() {
      if (!currentOrder) return;
      let text = `Halo NPD CLUB, saya ingin konfirmasi pesanan:\n\n` +
                 `No. Pesanan: ${currentOrder.orderNumber}\n` +
                 `Nama: ${currentOrder.name}\n` +
                 `Alamat: ${currentOrder.address}, ${currentOrder.city}\n` +
                 `Total: ${formatRupiahJs(currentOrder.total)}\n\n` +
                 `Item Pesanan:\n`;
      currentOrder.items.forEach(it => {
        text += `- ${it.name} (${it.size} / ${it.color}) x ${it.qty}\n`;
      });
      const url = `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }

    // --------------------------------------------------------------------------
    // 5. WISHLIST
    // --------------------------------------------------------------------------
    function toggleWishlist(productId) {
      const idx = wishlist.indexOf(productId);
      if (idx > -1) {
        wishlist.splice(idx, 1);
      } else {
        wishlist.push(productId);
      }
      saveWishlist();
    }

    function updateWishlistUI() {
      const badge = document.getElementById('wishlist-badge');
      if (wishlist.length > 0) {
        badge.innerText = wishlist.length;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }

      document.querySelectorAll('[class*="wishlist-btn-"]').forEach(btn => {
        const id = parseInt(btn.className.match(/wishlist-btn-(\d+)/)[1]);
        if (wishlist.includes(id)) {
          btn.innerHTML = '<i data-lucide="heart" class="w-4 h-4 fill-red-500 text-red-500"></i>';
        } else {
          btn.innerHTML = '<i data-lucide="heart" class="w-4 h-4 text-gray-700 hover:text-red-500"></i>';
        }
      });
      lucide.createIcons();
    }

    function toggleWishlistView() {
      if (wishlist.length === 0) {
        alert('Wishlist kamu masih kosong. Klik ikon hati pada produk untuk menyimpannya.');
      } else {
        alert(`Kamu memiliki ${wishlist.length} produk di Wishlist.`);
      }
    }

    // Helper
    function formatRupiahJs(num) {
      return 'IDR ' + (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // --------------------------------------------------------------------------
    // 6. AUTHENTICATION & DATABASE MYSQL INTEGRATION (LOGIN & REGISTER)
    // --------------------------------------------------------------------------
    let currentUser = null;

    async function checkAuthStatus() {
      try {
        const res = await fetch('api_auth.php?action=me');
        const data = await res.json();
        if (data.success && data.user) {
          currentUser = data.user;
          updateAuthUI();
        } else {
          currentUser = null;
          updateAuthUI();
        }
      } catch (err) {
        console.log('Auth check note:', err);
      }
    }

    function updateAuthUI() {
      const label = document.getElementById('auth-btn-label');
      if (currentUser) {
        label.innerText = currentUser.name.split(' ')[0];
        const nameField = document.getElementById('co-name');
        const phoneField = document.getElementById('co-phone');
        if (nameField && !nameField.value) nameField.value = currentUser.name;
        if (phoneField && !phoneField.value && currentUser.phone) phoneField.value = currentUser.phone;
      } else {
        label.innerText = 'Masuk';
      }
    }

    function openAuthModal() {
      const modal = document.getElementById('auth-modal');
      const formsContainer = document.getElementById('auth-forms-container');
      const profileContainer = document.getElementById('auth-profile-container');

      if (currentUser) {
        formsContainer.classList.add('hidden');
        profileContainer.classList.remove('hidden');
        document.getElementById('profile-name').innerText = currentUser.name;
        document.getElementById('profile-email').innerText = currentUser.email;
        document.getElementById('profile-phone').innerText = currentUser.phone || 'Nomor HP belum diisi';
        document.getElementById('profile-avatar').innerText = currentUser.name.charAt(0).toUpperCase();
      } else {
        profileContainer.classList.add('hidden');
        formsContainer.classList.remove('hidden');
        switchAuthTab('login');
      }
      modal.classList.remove('hidden');
      lucide.createIcons();
    }

    function closeAuthModal() {
      document.getElementById('auth-modal').classList.add('hidden');
      const loginErr = document.getElementById('login-error');
      const regErr = document.getElementById('reg-error');
      if (loginErr) loginErr.classList.add('hidden');
      if (regErr) regErr.classList.add('hidden');
    }

    function switchAuthTab(tab) {
      const tabLogin = document.getElementById('auth-tab-login');
      const tabReg = document.getElementById('auth-tab-register');
      const btnLogin = document.getElementById('tab-btn-login');
      const btnReg = document.getElementById('tab-btn-register');

      if (tab === 'login') {
        tabLogin.classList.remove('hidden');
        tabReg.classList.add('hidden');
        btnLogin.className = 'py-2.5 rounded bg-white text-[#0B1F3A] shadow-sm transition-all';
        btnReg.className = 'py-2.5 rounded text-gray-500 hover:text-black transition-all';
      } else {
        tabLogin.classList.add('hidden');
        tabReg.classList.remove('hidden');
        btnReg.className = 'py-2.5 rounded bg-white text-[#0B1F3A] shadow-sm transition-all';
        btnLogin.className = 'py-2.5 rounded text-gray-500 hover:text-black transition-all';
      }
    }

    async function handleLoginSubmit(e) {
      e.preventDefault();
      const errBox = document.getElementById('login-error');
      const btn = document.getElementById('login-submit-btn');
      errBox.classList.add('hidden');
      btn.disabled = true;
      btn.innerText = 'Memverifikasi...';

      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const res = await fetch('api_auth.php?action=login', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          currentUser = data.user;
          updateAuthUI();
          closeAuthModal();
          alert('Selamat datang kembali, ' + data.user.name + '!');
        } else {
          errBox.innerText = data.message || 'Login gagal. Periksa email & password Anda.';
          errBox.classList.remove('hidden');
        }
      } catch (err) {
        errBox.innerText = 'Koneksi database gagal. Pastikan MySQL di Laragon aktif.';
        errBox.classList.remove('hidden');
      } finally {
        btn.disabled = false;
        btn.innerText = 'Masuk ke Akun';
      }
    }

    async function handleRegisterSubmit(e) {
      e.preventDefault();
      const errBox = document.getElementById('reg-error');
      const btn = document.getElementById('reg-submit-btn');
      errBox.classList.add('hidden');
      btn.disabled = true;
      btn.innerText = 'Menyimpan Akun...';

      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const phone = document.getElementById('reg-phone').value;
      const password = document.getElementById('reg-password').value;

      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('password', password);

        const res = await fetch('api_auth.php?action=register', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          currentUser = data.user;
          updateAuthUI();
          closeAuthModal();
          alert('Registrasi Berhasil! Akun Anda telah disimpan di database MySQL.');
        } else {
          errBox.innerText = data.message || 'Registrasi gagal. Coba lagi.';
          errBox.classList.remove('hidden');
        }
      } catch (err) {
        errBox.innerText = 'Koneksi database gagal. Pastikan MySQL di Laragon aktif.';
        errBox.classList.remove('hidden');
      } finally {
        btn.disabled = false;
        btn.innerText = 'Daftar Akun Baru';
      }
    }

    async function handleLogout() {
      try {
        await fetch('api_auth.php?action=logout', { method: 'POST' });
        currentUser = null;
        updateAuthUI();
        closeAuthModal();
        alert('Anda telah keluar dari akun.');
      } catch (err) {
        console.error(err);
      }
    }

    // Initial load
    showSlide(0);
    updateCartUI();
    updateWishlistUI();
    checkAuthStatus();
  </script>

</body>
</html>
