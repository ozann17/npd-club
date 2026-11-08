import React from 'react';
import { Menu, Heart, ShoppingBag, User, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function BottomNav({ onOpenMenu, isMenuOpen, currentView, setCurrentView, wishlistCount }) {
  const { user, promptLogin } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();

  const handleAccountClick = () => {
    if (user) {
      setCurrentView('account');
    } else {
      promptLogin();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F2F4F7] shadow-lg safe-area-pb">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between">
        {/* Core Hamburger Menu Button (Garis 3) - Primary focus, thumb accessible */}
        <button
          onClick={onOpenMenu}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            isMenuOpen
              ? 'bg-[#0B1F3A] text-white shadow-md'
              : 'text-[#0B1F3A] hover:bg-[#F2F4F7]'
          }`}
          aria-label="Buka Menu Utama"
        >
          <div className="relative">
            <Menu className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-tight mt-0.5">
            Menu
          </span>
        </button>

        {/* Collections Quick Switcher */}
        <button
          onClick={() => {
            setCurrentView('collection');
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            currentView === 'collection'
              ? 'text-[#0B1F3A] font-black'
              : 'text-gray-500 hover:text-[#0B1F3A]'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tight mt-0.5">
            Koleksi
          </span>
        </button>

        {/* Wishlist Button */}
        <button
          onClick={() => setCurrentView('wishlist')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all relative ${
            currentView === 'wishlist'
              ? 'text-[#0B1F3A] font-black'
              : 'text-gray-500 hover:text-[#0B1F3A]'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${currentView === 'wishlist' ? 'fill-[#0B1F3A]' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#0B1F3A] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tight mt-0.5">
            Wishlist
          </span>
        </button>

        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center p-2 rounded-xl transition-all text-gray-500 hover:text-[#0B1F3A] relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#0B1F3A] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tight mt-0.5">
            Keranjang
          </span>
        </button>

        {/* Account / Login Button */}
        <button
          onClick={handleAccountClick}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            currentView === 'account'
              ? 'text-[#0B1F3A] font-black'
              : 'text-gray-500 hover:text-[#0B1F3A]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tight mt-0.5">
            {user ? 'Akun' : 'Masuk'}
          </span>
        </button>
      </div>
    </div>
  );
}
