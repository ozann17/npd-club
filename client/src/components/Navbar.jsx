import React from 'react';
import { Heart, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

/* ==========================================================================
   [EDIT DI SINI] PENGUMUMAN TEKS BARIS ATAS (ANNOUNCEMENT TOP BAR)
   Ganti tulisan di dalam tanda kutip sesuai keinginan Anda:
   ========================================================================== */
export const TOP_ANNOUNCEMENT_TEXTS = {
  // [EDIT PENGUMUMAN 1]
  item1: "✦ NPD CLUB: CAPSULE COLLECTION '26",

  // [EDIT PENGUMUMAN 2]
  item2: "FREE SHIPPING IDR 1000K+",

  // [EDIT PENGUMUMAN 3]
  item3: "WORLDWIDE DISPATCH"
};

export default function Navbar({ onOpenBottomMenu, currentView, setCurrentView, selectedCollection, setSelectedCollection, wishlistCount }) {
  const { user, promptLogin } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();

  const handleSelectCollection = (slug) => {
    setSelectedCollection(slug);
    setCurrentView('collection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#F2F4F7]">
      {/* Streetwear Announcement Top Bar */}
      <div className="bg-[#0B1F3A] text-white py-2 px-4 text-center text-[11px] sm:text-xs font-semibold tracking-widest uppercase overflow-hidden">
        <div className="flex items-center justify-center gap-3 animate-pulse-subtle">
          <span>{TOP_ANNOUNCEMENT_TEXTS.item1}</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">{TOP_ANNOUNCEMENT_TEXTS.item2}</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">{TOP_ANNOUNCEMENT_TEXTS.item3}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Left: Quick Desktop Collection links (Responsive & No Overlap) */}
          <div className="flex-1 flex items-center gap-2 sm:gap-4 xl:gap-6 z-10 min-w-0">
            <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-[11px] xl:text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
              <button
                onClick={() => {
                  setSelectedCollection('all');
                  setCurrentView('home');
                }}
                className={`hover:opacity-70 transition-opacity whitespace-nowrap ${currentView === 'home' && selectedCollection === 'all' ? 'underline underline-offset-8 decoration-2' : ''}`}
              >
                Home
              </button>
              <button
                onClick={() => handleSelectCollection('npd-collection')}
                className={`hover:opacity-70 transition-opacity whitespace-nowrap ${currentView === 'collection' && selectedCollection === 'npd-collection' ? 'underline underline-offset-8 decoration-2' : ''}`}
              >
                NPD Collection
              </button>
              <button
                onClick={() => handleSelectCollection('tdb-collection')}
                className={`hover:opacity-70 transition-opacity whitespace-nowrap ${currentView === 'collection' && selectedCollection === 'tdb-collection' ? 'underline underline-offset-8 decoration-2' : ''}`}
              >
                TDB Collection
              </button>
              <button
                onClick={() => handleSelectCollection('pickme-collection')}
                className={`hover:opacity-70 transition-opacity whitespace-nowrap ${currentView === 'collection' && selectedCollection === 'pickme-collection' ? 'underline underline-offset-8 decoration-2' : ''}`}
              >
                Pick Me
              </button>
            </nav>

            <div className="lg:hidden text-[10px] uppercase font-bold tracking-widest text-gray-500">
              ARCHIVE '26
            </div>
          </div>

          {/* Center: Brand Logo (Tepat di Tengah & Bebas Tabrakan) */}
          <div className="shrink-0 px-2 sm:px-4 text-center pointer-events-auto z-20">
            <button
              onClick={() => {
                setSelectedCollection('all');
                setCurrentView('home');
              }}
              className="inline-flex items-center gap-2 group transition-transform active:scale-95"
              aria-label="Kembali ke Beranda NPD CLUB"
            >
              <span className="font-['Rubik_Bubbles',cursive] text-2xl sm:text-3xl md:text-4xl text-[#0B1F3A] group-hover:text-[#163259] tracking-wider transition-colors drop-shadow-[0_2px_4px_rgba(11,31,58,0.18)] whitespace-nowrap">
                ✦ NPD CLUB
              </span>
            </button>
          </div>

          {/* Right: Currency, Wishlist, Cart, Account */}
          <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4 z-10 min-w-0">
            <span className="hidden xl:inline-block text-[11px] font-bold tracking-wider text-gray-600 bg-[#F2F4F7] px-2.5 py-1">
              IDR 🇮🇩
            </span>

            {/* Wishlist */}
            <button
              onClick={() => setCurrentView('wishlist')}
              className="relative p-2 text-[#0B1F3A] hover:bg-[#F2F4F7] transition-colors rounded-full"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${currentView === 'wishlist' ? 'fill-[#0B1F3A]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#0B1F3A] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#0B1F3A] hover:bg-[#F2F4F7] transition-colors rounded-full"
              title="Keranjang Belanja"
              aria-label="Keranjang"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#0B1F3A] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Account / Login */}
            {user ? (
              <button
                onClick={() => setCurrentView('account')}
                className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0B1F3A] hover:bg-[#F2F4F7] px-2.5 sm:px-3 py-1.5 transition-colors border border-gray-200 rounded"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[70px] truncate">{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => promptLogin()}
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-[#0B1F3A] text-white hover:bg-[#163259] px-2.5 sm:px-3.5 py-1.5 transition-colors rounded shadow-sm"
              >
                <User className="w-3.5 h-3.5 sm:hidden" />
                <span className="hidden sm:inline">Log In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
