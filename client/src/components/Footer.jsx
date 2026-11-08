import React from 'react';
import { Layers } from 'lucide-react';

/* ==========================================================================
   [EDIT DI SINI] INFORMASI FOOTER & TEKS KATALOG KOLEKSI
   Ganti tulisan di dalam tanda petik sesuai keinginan Anda:
   ========================================================================== */
export const FOOTER_CONTENT = {
  // 1. Teks di bawah logo sebelah kiri:
  brandDescription: "is an urban uniform crafted for those who value detail, structure, and identity. Fusing classic utility elements with timeless streetwear silhouettes, we focus on durable builds, precise fits, and balanced color palettes. No loud gimmicks—just well-made apparel engineered for the movement of the city.",
  estText: "EST. 2026 • TANGERANG, INDONESIA",

  // 2. Judul & Daftar Teks Koleksi di sebelah kanan:
  collectionSectionTitle: "KATALOG KOLEKSI",
  collectionItem1: "NPD Collection (Signature)",
  collectionItem2: "TDB Collection '26",
  collectionItem3: "Pick Me Collection '26",
  collectionItemAll: "Lihat Semua Katalog"
};

export default function Footer({ onSelectCollection, onNavigateWishlist, onOpenCart }) {
  return (
    <footer className="bg-white border-t border-[#F2F4F7] pt-12 pb-24 sm:pb-16 text-[#0B1F3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#F2F4F7]">
          
          {/* Brand info (Logo Style Font Bubble & Teks Kiri) */}
          <div className="md:col-span-5 space-y-3">
            {/* Logo Font Bubble (Sama persis dengan header atas) */}
            <span className="font-['Rubik_Bubbles',cursive] text-2xl sm:text-3xl text-[#0B1F3A] tracking-wider drop-shadow-[0_2px_4px_rgba(11,31,58,0.15)] inline-block">
              ✦ NPD CLUB
            </span>

            {/* Teks Deskripsi Bawah Logo */}
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              {FOOTER_CONTENT.brandDescription}
            </p>

            {/* Teks Tahun & Lokasi */}
            <div className="text-[11px] font-bold tracking-wider uppercase text-gray-400 pt-1">
              {FOOTER_CONTENT.estText}
            </div>
          </div>

          {/* Collections links (Teks Koleksi Kanan) */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#0B1F3A]">
              {FOOTER_CONTENT.collectionSectionTitle}
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li>
                <button
                  onClick={() => onSelectCollection('npd-collection')}
                  className="hover:text-[#0B1F3A] hover:underline transition-colors text-left"
                >
                  {FOOTER_CONTENT.collectionItem1}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCollection('tdb-collection')}
                  className="hover:text-[#0B1F3A] hover:underline transition-colors text-left"
                >
                  {FOOTER_CONTENT.collectionItem2}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCollection('pickme-collection')}
                  className="hover:text-[#0B1F3A] hover:underline transition-colors text-left"
                >
                  {FOOTER_CONTENT.collectionItem3}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCollection('all')}
                  className="hover:text-[#0B1F3A] hover:underline transition-colors text-left font-semibold"
                >
                  {FOOTER_CONTENT.collectionItemAll}
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Services (Metode Pembayaran) */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#0B1F3A]">
              Metode Pembayaran Resmi
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 bg-[#F2F4F7] text-[10px] font-black tracking-wider uppercase text-[#0B1F3A]">
                QRIS
              </span>
              <span className="px-2.5 py-1 bg-[#F2F4F7] text-[10px] font-black tracking-wider uppercase text-[#0B1F3A]">
                BCA VA
              </span>
              <span className="px-2.5 py-1 bg-[#F2F4F7] text-[10px] font-black tracking-wider uppercase text-[#0B1F3A]">
                BRI VA
              </span>
              <span className="px-2.5 py-1 bg-[#F2F4F7] text-[10px] font-black tracking-wider uppercase text-[#0B1F3A]">
                MANDIRI VA
              </span>
              <span className="px-2.5 py-1 bg-[#F2F4F7] text-[10px] font-black tracking-wider uppercase text-[#0B1F3A]">
                BNI VA
              </span>
            </div>
            <p className="text-[11px] text-gray-400 pt-2 leading-relaxed">
              Didukung oleh sistem gateway terenkripsi Midtrans / Xendit Sandbox untuk pemrosesan transaksi otomatis 24/7.
            </p>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
          <div>
            © 2026 NPD CLUB. All Rights Reserved. Heavyweight Streetwear.
          </div>
          <div className="flex items-center gap-4 uppercase font-bold text-[10px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Drops</span>
            <span>•</span>
            <span>Size Chart</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
