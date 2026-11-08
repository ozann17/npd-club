import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Helper to format currency
export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount).replace('IDR', 'Rp');
}

export default function ProductCard({
  product,
  onOpenDetail,
  onAddToCartDirect,
  isWishlisted,
  onToggleWishlist
}) {
  const { user, promptLogin } = useAuth();
  const { showToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const isSoldOut = product.is_sold_out;

  // Gambar 1: Foto Katalog, Gambar 2: Foto Model
  const imageKatalog = product.images?.[0] || product.primary_image;
  const imageModel = product.images?.[1] || product.images?.[0] || product.primary_image;
  const hasModelPhoto = product.images && product.images.length > 1;

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (!user) {
      showToast('Silakan login terlebih dahulu untuk menyimpan ke Wishlist.', 'info');
      promptLogin(() => {
        onToggleWishlist(product.id);
      });
      return;
    }
    onToggleWishlist(product.id);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isSoldOut) return;
    onOpenDetail(product);
  };

  return (
    <div
      onClick={() => onOpenDetail(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white border border-[#F2F4F7] hover:border-gray-300 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full bg-[#F2F4F7] overflow-hidden flex items-center justify-center">
        
        {/* Gambar 1: Foto Katalog (Tampil secara default) */}
        <img
          src={imageKatalog}
          alt={`${product.name} Katalog`}
          loading="lazy"
          className={`w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 ${
            isSoldOut ? 'grayscale opacity-50 contrast-75' : ''
          }`}
        />

        {/* Gambar 2: Foto Model (Transisi halus saat hover kursor diarahkan ke kartu produk) */}
        {hasModelPhoto && !isSoldOut && (
          <img
            src={imageModel}
            alt={`${product.name} On Model`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out scale-100 group-hover:scale-105 pointer-events-none"
          />
        )}

        {/* Badge Foto Model / Katalog indikator */}
        {hasModelPhoto && !isSoldOut && (
          <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
            <User className="w-2.5 h-2.5" />
            <span className="group-hover:hidden">Katalog</span>
            <span className="hidden group-hover:inline text-amber-300">Lookbook Model</span>
          </div>
        )}

        {/* Sold Out Badge (Navy with white bold text on top of photo) */}
        {isSoldOut && (
          <div className="absolute top-3 left-3 z-10 bg-[#0B1F3A] text-white text-[10px] sm:text-xs font-black tracking-widest px-3 py-1 shadow-md uppercase">
            SOLD OUT
          </div>
        )}

        {/* Featured / Limited Badge if in stock */}
        {!isSoldOut && product.is_featured === 1 && (
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm text-[#0B1F3A] text-[9px] sm:text-[10px] font-extrabold tracking-widest px-2.5 py-0.5 uppercase border border-[#0B1F3A]">
            ✦ CAPSULE '26
          </div>
        )}

        {/* Floating Heart Icon at Bottom Right of Photo (Matches reference photo layout!) */}
        <button
          onClick={handleHeartClick}
          className={`absolute bottom-3 right-3 z-20 p-2 rounded-full transition-all duration-200 shadow-md ${
            isWishlisted
              ? 'bg-[#0B1F3A] text-white hover:scale-110'
              : 'bg-white/90 text-[#0B1F3A] hover:bg-white hover:scale-110'
          }`}
          title={isWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-white stroke-white' : 'stroke-[#0B1F3A]'
            }`}
          />
        </button>

        {/* Hover Quick Action Overlay */}
        <div
          className={`hidden sm:flex absolute inset-0 bg-black/15 backdrop-blur-[0.5px] items-center justify-center transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <span className="bg-white text-[#0B1F3A] text-xs font-bold uppercase tracking-wider px-4 py-2 shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            Lihat Detail & Ukuran
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Collection tag */}
          <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">
            {product.collection_name || 'NPD CLUB'}
          </div>

          {/* Product Name (Bold Streetwear Typography) */}
          <h3 className="text-xs sm:text-sm font-bold text-[#0B1F3A] tracking-tight uppercase line-clamp-1 group-hover:underline underline-offset-4 decoration-1">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xs sm:text-sm font-black text-[#0B1F3A]">
              {formatRupiah(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-[11px] text-gray-400 line-through">
                {formatRupiah(product.original_price)}
              </span>
            )}
          </div>

          {/* Sizes preview */}
          {product.sizes && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              {product.sizes.map((s) => (
                <span
                  key={s}
                  className="text-[9px] font-semibold text-gray-500 bg-[#F2F4F7] px-1.5 py-0.5 rounded-none"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Button: Tambah ke Keranjang / Sold Out */}
        <div className="mt-3.5 pt-2 border-t border-[#F2F4F7]">
          {isSoldOut ? (
            <button
              disabled
              className="w-full py-2 bg-gray-200 text-gray-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest cursor-not-allowed text-center"
            >
              Sold Out
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full py-2 bg-[#0B1F3A] text-white hover:bg-[#163259] text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Tambah ke Keranjang</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
