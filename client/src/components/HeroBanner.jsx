import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

/* ==========================================================================
   [EDIT DI SINI] 1. DAFTAR SLIDE & BACKGROUND HERO BANNER
   - Gambar banner yang Anda upload sudah disimpan di: client/public/banners/npd-banner-lookbook.jpg
   - theme: 'light' (untuk gambar latar putih / studio) atau 'dark' (untuk gambar latar gelap)
   ========================================================================== */
export const HERO_SLIDES = [
  {
    id: 1,
    // [SLIDE 1: MENGGUNAKAN BANNER LOOKBOOK 4 MODEL YANG ANDA UPLOAD]
    badge: " NPD CLUB 1st RELEASE '26",
    titleMain: "WHAT YOU WORE TODAY?",
    titleSub: "NPD CLUB SOLUTION",
    description: "Stop overthinking your daily fit. NPD CLUB delivers functional cuts, versatile tones, and clean silhouettes designed to effortlessly elevate your everyday routine. No stress, just solid style.",
    // 👉 PATH FILE GAMBAR BANNER ANDA:
    backgroundImage: "/banners/npd-banner-lookbook.jpg",
    buttonCollection: "npd-collection",
    buttonText: "NPD COLLECTION",
    theme: "light" // 'light' otomatis menyesuaikan teks menjadi Navy (#0B1F3A) agar model terlihat sangat jelas!
  },
  {
    id: 2,
    // [SLIDE 2]
    badge: " TDB '26 DROP",
    titleMain: "NO RULES",
    titleSub: "JUST CULTURE",
    description: "Beyond trends, beyond guidelines. We don’t follow standard blueprints—we reflect the spirit, music, and raw identity of the streets.",
    backgroundImage: "/banners/banner_1122.PNG",
    buttonCollection: "tdb-collection",
    buttonText: "tdb '26",
    theme: "dark"
  },
  {
    id: 3,
    // [SLIDE 3]
    badge: "PICK ME '26",
    titleMain: "Looking sharp?",
    titleSub: "NPD’s got your back.",
    description: "Style isn't just about what you wear—it’s how you carry yourself. NPD is here to elevate your everyday look with functional cuts, versatile tones, and clean silhouettes designed for the modern lifestyle. Whatever the room, whatever the move: Looking sharp? NPD’s got your back.",
    backgroundImage: "/banners/sld3.jpeg",
    buttonCollection: "pickme-collection",
    buttonText: "PICK ME '26",
    theme: "dark"
  }
];

/* ==========================================================================
   [EDIT DI SINI] 2. KARTU AKSES CEPAT 3 KOLEKSI (NPD, TDB, PICK ME)
   ========================================================================== */
export const QUICK_COLLECTIONS = [
  {
    title: 'NPD Collection',
    slug: 'npd-collection',
    badge: 'Core Signature',
    image: '/banners/npd.PNG',
    desc: 'Heavyweight boxy tees & iconic archival screenprints'
  },
  {
    title: 'TDB Collection',
    slug: 'tdb-collection',
    badge: 'TDB 2026',
    image: '/banners/tdb.PNG',
    desc: 'Breathable dual-layer mesh & relaxed transitional outerwear'
  },
  {
    title: 'Pick Me Collection',
    slug: 'pickme-collection',
    badge: 'Pick Me Gear',
    image: '/banners/pick me.PNG',
    desc: 'Tactical polar sherpa, balaclavas & 500 GSM loopback fleece'
  }
];

export default function HeroBanner({ onSelectCollection }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-slide setiap 6 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Support swipe gesture (kiri / kanan) untuk ganti banner
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (swipeDistance > 50) {
      nextSlide();
    } else if (swipeDistance < -50) {
      prevSlide();
    }
  };

  const activeSlideData = HERO_SLIDES[currentSlide];
  const isLight = activeSlideData.theme === 'light';

  return (
    <div className="space-y-8 select-none">
      
      {/* =========================================================================
          HERO CAROUSEL / SLIDER (Bisa di-scroll / swipe ke kiri & kanan)
          ========================================================================= */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative min-h-[460px] sm:min-h-[540px] md:min-h-[600px] flex items-center justify-center overflow-hidden border-b border-[#F2F4F7] transition-all duration-700 ${
          isLight ? 'bg-white' : 'bg-[#0B1F3A]'
        }`}
      >
        {/* Background Images with smooth fade/slide transition */}
        {HERO_SLIDES.map((slide, index) => {
          const slideIsLight = slide.theme === 'light';
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              {/* Background Image Container */}
              <img
                src={slide.backgroundImage}
                alt={slide.titleMain}
                className="w-full h-full object-cover object-center"
              />

              {/* Overlay: Disesuaikan dengan tema light/dark agar model atau gambar tetap jelas */}
              {slideIsLight ? (
                <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/40 to-white/10 backdrop-blur-[0.5px]" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/70 to-[#0B1F3A]/50 backdrop-blur-[0.5px]" />
              )}
            </div>
          );
        })}

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0B1F3A_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Navigation Arrows (Kiri & Kanan) */}
        <button
          onClick={prevSlide}
          className={`absolute left-3 sm:left-6 z-20 p-2.5 sm:p-3 rounded-full transition-all backdrop-blur-sm hover:scale-110 active:scale-95 border ${
            isLight
              ? 'bg-white/80 hover:bg-[#0B1F3A] hover:text-white text-[#0B1F3A] border-gray-300 shadow-md'
              : 'bg-black/40 hover:bg-[#0B1F3A] text-white border-white/20'
          }`}
          aria-label="Slide Sebelumnya"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={nextSlide}
          className={`absolute right-3 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full transition-all backdrop-blur-sm hover:scale-110 active:scale-95 border ${
            isLight
              ? 'bg-white/80 hover:bg-[#0B1F3A] hover:text-white text-[#0B1F3A] border-gray-300 shadow-md'
              : 'bg-black/40 hover:bg-[#0B1F3A] text-white border-white/20'
          }`}
          aria-label="Slide Berikutnya"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Slide Content Box */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-12 flex flex-col items-center">
          
          {/* Badge Atas */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 shadow-sm backdrop-blur-sm ${
              isLight
                ? 'bg-[#0B1F3A] text-white border border-[#0B1F3A]'
                : 'bg-white/10 border border-white/20 text-white'
            }`}
          >
            <span className="text-amber-400">✦</span>
            <span>{activeSlideData.badge}</span>
          </div>

          {/* Judul Besar (Streetwear Headline) */}
          <h1
            className={`text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] font-['Poppins'] drop-shadow-sm ${
              isLight ? 'text-[#0B1F3A]' : 'text-white'
            }`}
          >
            {activeSlideData.titleMain} <br />
            <span
              className={
                isLight
                  ? 'text-[#0B1F3A] opacity-90'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400'
              }
            >
              {activeSlideData.titleSub}
            </span>
          </h1>

          {/* Deskripsi Teks */}
          <p
            className={`mt-4 sm:mt-6 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed ${
              isLight ? 'text-gray-700 font-semibold' : 'text-gray-200 font-normal'
            }`}
          >
            {activeSlideData.description}
          </p>

          {/* 3 Tombol Utama: NPD COLLECTION, SPRING '26, WINTER GEAR */}
          <div className="mt-7 sm:mt-9 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {/* Tombol 1: NPD Collection */}
            <button
              onClick={() => onSelectCollection('npd-collection')}
              className={`px-5 sm:px-6 py-3 font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 active:scale-95 ${
                isLight
                  ? 'bg-[#0B1F3A] text-white hover:bg-[#163259]'
                  : activeSlideData.buttonCollection === 'npd-collection'
                  ? 'bg-white text-[#0B1F3A] hover:bg-gray-100 ring-2 ring-white/50'
                  : 'bg-white/15 hover:bg-white text-white hover:text-[#0B1F3A] border border-white/30'
              }`}
            >
              <span>NPD 1st RELEASE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Tombol 2: Spring '26 */}
            <button
              onClick={() => onSelectCollection('spring-collection')}
              className={`px-5 sm:px-6 py-3 font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 active:scale-95 ${
                isLight
                  ? 'bg-white/90 border-2 border-[#0B1F3A] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white'
                  : activeSlideData.buttonCollection === 'spring-collection'
                  ? 'bg-white text-[#0B1F3A] hover:bg-gray-100 ring-2 ring-white/50'
                  : 'bg-white/15 hover:bg-white text-white hover:text-[#0B1F3A] border border-white/30'
              }`}
            >
              <span>TDB '26</span>
            </button>

            {/* Tombol 3: Winter Gear */}
            <button
              onClick={() => onSelectCollection('winter-collection')}
              className={`px-5 sm:px-6 py-3 font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 active:scale-95 ${
                isLight
                  ? 'bg-white/90 border-2 border-[#0B1F3A] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white'
                  : activeSlideData.buttonCollection === 'winter-collection'
                  ? 'bg-white text-[#0B1F3A] hover:bg-gray-100 ring-2 ring-white/50'
                  : 'bg-white/15 hover:bg-white text-white hover:text-[#0B1F3A] border border-white/30'
              }`}
            >
              <span>PICK ME '26</span>
            </button>
          </div>

          {/* Indicator Dots */}
          <div className="flex items-center gap-2.5 mt-8">
            {HERO_SLIDES.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => setCurrentSlide(dotIndex)}
                className={`transition-all duration-300 rounded-full ${
                  dotIndex === currentSlide
                    ? isLight
                      ? 'w-7 h-2 bg-[#0B1F3A]'
                      : 'w-7 h-2 bg-white'
                    : isLight
                    ? 'w-2 h-2 bg-gray-400 hover:bg-gray-600'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${dotIndex + 1}`}
              />
            ))}
          </div>

          <div
            className={`mt-2 text-[10px] uppercase font-bold tracking-widest sm:hidden ${
              isLight ? 'text-gray-500' : 'text-gray-300'
            }`}
          >
            ← Geser ke kiri untuk ganti background →
          </div>
        </div>
      </div>

      {/* =========================================================================
          AKSES CEPAT KE 3 KOLEKSI UTAMA (NPD, SPRING, WINTER)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">
              AKSES CEPAT
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#0B1F3A] font-['Poppins']">
              Pilihan Koleksi Utama
            </h2>
          </div>
          <span className="text-xs font-bold uppercase text-gray-500 hidden sm:inline">
            Klik untuk langsung melihat produk
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {QUICK_COLLECTIONS.map((col) => (
            <div
              key={col.slug}
              onClick={() => onSelectCollection(col.slug)}
              className="group relative aspect-[4/5] bg-gray-900 overflow-hidden cursor-pointer shadow-md border border-[#F2F4F7]"
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-90"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-white text-[#0B1F3A] self-start mb-2">
                  {col.badge}
                </span>

                <h3 className="text-xl font-black uppercase text-white tracking-tight font-['Poppins'] group-hover:translate-x-1 transition-transform">
                  {col.title}
                </h3>

                <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                  {col.desc}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase text-white tracking-wider group-hover:underline">
                  <span>Buka Koleksi Produk</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
