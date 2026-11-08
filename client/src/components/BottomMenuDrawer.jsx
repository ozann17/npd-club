import React, { useState } from 'react';
import {
  X,
  ChevronDown,
  ChevronUp,
  Heart,
  ShoppingBag,
  User,
  LogOut,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function BottomMenuDrawer({
  isOpen,
  onClose,
  selectedCollection,
  onSelectCollection,
  onNavigateWishlist,
  onOpenCart,
  onNavigateAccount,
  wishlistCount
}) {
  const { user, logout, promptLogin } = useAuth();
  const { itemCount } = useCart();
  const [isCollectionExpanded, setIsCollectionExpanded] = useState(true);

  if (!isOpen) return null;

  const collections = [
    {
      name: 'NPD Collection',
      slug: 'npd-collection',
      desc: 'Signature heavyweight drop & archival logos',
      badge: 'CORE DROP'
    },
    {
      name: 'TDB Collection',
      slug: 'tdb-collection',
      desc: 'Beyond trends, beyond guidelines & raw streetwear identity',
      badge: 'TDB 2026'
    },
    {
      name: 'Pick Me Collection',
      slug: 'pickme-collection',
      desc: 'Heavy French terry & sherpa insulation',
      badge: 'PICK ME GEAR'
    }
  ];

  const handleCollectionClick = (slug) => {
    onSelectCollection(slug);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet Modal Container */}
      <div className="fixed inset-x-0 bottom-0 max-h-[90vh] flex flex-col bg-white rounded-t-3xl shadow-2xl border-t border-[#F2F4F7] transform transition-transform duration-300 ease-out z-10 overflow-hidden">
        
        {/* Grab Handle bar for thumb gesture */}
        <div className="pt-3 pb-1 flex justify-center cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Drawer Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#F2F4F7]">
          <div className="flex items-center gap-2">
            <span className="font-['Rubik_Bubbles',cursive] text-lg text-[#0B1F3A] tracking-wider">
              ✦ NPD CLUB
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-[#0B1F3A] rounded-full hover:bg-[#F2F4F7] transition-colors"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          
          {/* 1. COLLECTION ACCORDION (Dropdown) */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => setIsCollectionExpanded(!isCollectionExpanded)}
              className="w-full flex items-center justify-between p-4 bg-[#0B1F3A] text-white text-left font-bold transition-colors"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-white/90" />
                <span className="text-sm uppercase tracking-wider">Collections</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-white/20 text-white px-2 py-0.5 rounded text-xs font-semibold">
                  3 Koleksi
                </span>
                {isCollectionExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {/* Accordion Sub-items */}
            {isCollectionExpanded && (
              <div className="divide-y divide-gray-100 bg-[#F2F4F7]/40">
                {collections.map((col) => {
                  const isActive = selectedCollection === col.slug;
                  return (
                    <button
                      key={col.slug}
                      onClick={() => handleCollectionClick(col.slug)}
                      className={`w-full flex items-center justify-between p-4 text-left transition-colors group ${
                        isActive
                          ? 'bg-[#0B1F3A]/5 font-black text-[#0B1F3A]'
                          : 'hover:bg-white text-gray-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold tracking-tight group-hover:text-[#0B1F3A]">
                            {col.name}
                          </span>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-[#0B1F3A] text-white">
                            {col.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 font-normal">
                          {col.desc}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0B1F3A] group-hover:translate-x-1 transition-transform" />
                    </button>
                  );
                })}

                {/* All Collections Shortcut */}
                <button
                  onClick={() => handleCollectionClick('all')}
                  className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-[#0B1F3A] hover:bg-white transition-colors border-t border-gray-200"
                >
                  Lihat Semua Produk
                </button>
              </div>
            )}
          </div>

          {/* 2. WISHLIST */}
          <button
            onClick={() => {
              onNavigateWishlist();
              onClose();
            }}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#0B1F3A] bg-white transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#F2F4F7] flex items-center justify-center text-[#0B1F3A] group-hover:bg-[#0B1F3A] group-hover:text-white transition-colors">
                <Heart className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold tracking-tight text-[#0B1F3A] uppercase">
                  Wishlist
                </span>
                <p className="text-xs text-gray-500">Koleksi favorit yang Anda simpan</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {wishlistCount > 0 ? (
                <span className="bg-[#0B1F3A] text-white text-xs font-black px-2 py-0.5 rounded-full">
                  {wishlistCount} item
                </span>
              ) : (
                <span className="text-xs text-gray-400">Kosong</span>
              )}
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0B1F3A]" />
            </div>
          </button>

          {/* 3. KERANJANG */}
          <button
            onClick={() => {
              onOpenCart();
              onClose();
            }}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#0B1F3A] bg-white transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#F2F4F7] flex items-center justify-center text-[#0B1F3A] group-hover:bg-[#0B1F3A] group-hover:text-white transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold tracking-tight text-[#0B1F3A] uppercase">
                  Keranjang
                </span>
                <p className="text-xs text-gray-500">Lihat item & siap checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {itemCount > 0 ? (
                <span className="bg-[#0B1F3A] text-white text-xs font-black px-2 py-0.5 rounded-full">
                  {itemCount} item
                </span>
              ) : (
                <span className="text-xs text-gray-400">Kosong</span>
              )}
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0B1F3A]" />
            </div>
          </button>

          {/* 4. LOGIN / AKUN */}
          <div className="pt-2 border-t border-[#F2F4F7]">
            {user ? (
              <div className="p-4 rounded-xl bg-[#F2F4F7] flex items-center justify-between">
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => {
                    onNavigateAccount();
                    onClose();
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center font-black text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0B1F3A]">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onNavigateAccount();
                      onClose();
                    }}
                    className="text-xs font-bold uppercase text-[#0B1F3A] hover:underline px-2 py-1"
                  >
                    Profil
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Keluar"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  promptLogin();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0B1F3A] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#163259] transition-all shadow-md active:scale-[0.98]"
              >
                <User className="w-4 h-4" />
                <span>Masuk / Buat Akun NPD CLUB</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#F2F4F7] text-center text-[10px] uppercase font-bold tracking-widest text-gray-500">
          NPD CLUB 2026 • STREETWEAR CAPSULE ARCHIVES
        </div>
      </div>
    </div>
  );
}
