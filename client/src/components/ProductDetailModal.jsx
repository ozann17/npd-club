import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, ShieldCheck, RefreshCw, Truck, Check } from 'lucide-react';
import { formatRupiah } from './ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist
}) {
  const { user, promptLogin } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Set default color & size when product opens
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setQuantity(1);

      const colors = product.colors || [];
      if (colors.length > 0) {
        setSelectedColor(colors[0].name);
      }

      // Find first available size
      const variants = product.variants || [];
      const firstInStock = variants.find(v => v.available_stock > 0);
      if (firstInStock) {
        setSelectedColor(firstInStock.color);
        setSelectedSize(firstInStock.size);
      } else {
        setSelectedSize(product.sizes?.[0] || 'M');
      }
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const isSoldOut = product.is_sold_out;

  // Find the exact variant corresponding to selected size and color
  const currentVariant = product.variants?.find(
    v => v.size === selectedSize && v.color === selectedColor
  ) || product.variants?.find(v => v.size === selectedSize);

  const availableStock = currentVariant ? currentVariant.available_stock : 0;
  const isCurrentVariantOutOfStock = availableStock <= 0;

  const handleHeartClick = () => {
    if (!user) {
      showToast('Silakan login terlebih dahulu untuk menyimpan ke Wishlist.', 'info');
      promptLogin(() => {
        onToggleWishlist(product.id);
      });
      return;
    }
    onToggleWishlist(product.id);
  };

  const handleAddToCart = async () => {
    if (!currentVariant) {
      showToast('Harap pilih ukuran dan warna terlebih dahulu.', 'error');
      return;
    }

    if (isCurrentVariantOutOfStock) {
      showToast(`Ukuran ${selectedSize} sedang habis. Silakan pilih ukuran lain.`, 'error');
      return;
    }

    try {
      setIsAdding(true);
      await addToCart(currentVariant.id, quantity);
      showToast(`${product.name} (${selectedSize}) ditambahkan ke keranjang!`, 'cart');
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsAdding(false);
    }
  };

  // Helper to check stock status for a specific size (under currently selected color)
  const getSizeStock = (size) => {
    const v = product.variants?.find(item => item.size === size && item.color === selectedColor)
      || product.variants?.find(item => item.size === size);
    return v ? v.available_stock : 0;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div className="relative w-full max-w-4xl bg-white shadow-2xl overflow-hidden border border-gray-200 z-10 my-8">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-[#0B1F3A] hover:text-white rounded-full transition-colors shadow-md"
            aria-label="Tutup Detail"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left: Gallery */}
            <div className="bg-[#F2F4F7] p-4 sm:p-6 flex flex-col justify-between">
              {/* Main Photo with Sold Out badge & Dimming */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-white shadow-inner flex items-center justify-center">
                <img
                  src={product.images[activeImageIndex] || product.primary_image}
                  alt={product.name}
                  className={`w-full h-full object-cover object-center transition-all duration-300 ${
                    isSoldOut ? 'grayscale opacity-50 contrast-75' : ''
                  }`}
                />

                {/* Sold out badge */}
                {isSoldOut && (
                  <div className="absolute top-4 left-4 bg-[#0B1F3A] text-white text-xs font-black tracking-widest px-3 py-1 shadow uppercase">
                    SOLD OUT
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex flex-col items-center gap-1 shrink-0 transition-all ${
                        activeImageIndex === idx ? 'scale-105' : 'opacity-65 hover:opacity-100'
                      }`}
                    >
                      <div className={`w-16 h-20 border-2 overflow-hidden ${activeImageIndex === idx ? 'border-[#0B1F3A] shadow-md' : 'border-gray-200'}`}>
                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${activeImageIndex === idx ? 'text-[#0B1F3A]' : 'text-gray-400'}`}>
                        {idx === 0 ? '1. Katalog' : idx === 1 ? '2. Model' : `Foto ${idx + 1}`}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Variant selection */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Collection & Status */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black tracking-widest uppercase text-gray-500">
                    {product.collection_name}
                  </span>
                  {product.is_featured === 1 && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-[#0B1F3A] text-white">
                      ✦ EXCLUSIVE DROP
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight uppercase mt-2 font-['Poppins']">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#0B1F3A]">
                    {formatRupiah(product.price)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatRupiah(product.original_price)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-b border-[#F2F4F7] py-3.5">
                  {product.description}
                </p>

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-4">
                    <label className="text-xs font-black uppercase tracking-wider text-[#0B1F3A] flex items-center justify-between">
                      <span>Warna: {selectedColor}</span>
                    </label>
                    <div className="flex items-center gap-2.5 mt-2">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-bold transition-all ${
                            selectedColor === c.name
                              ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white shadow-sm'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {c.code && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300"
                              style={{ backgroundColor: c.code }}
                            />
                          )}
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection (STRIKETHROUGH FOR OUT OF STOCK SIZES!) */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#0B1F3A]">
                    <span>Ukuran Pakaian</span>
                    <span className="text-[11px] font-semibold text-gray-500">Boxy Streetwear Fit</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-2.5">
                    {['S', 'M', 'L', 'XL'].map((size) => {
                      const stock = getSizeStock(size);
                      const isSizeOutOfStock = stock <= 0;
                      const isSelected = selectedSize === size;

                      return (
                        <button
                          key={size}
                          disabled={isSizeOutOfStock}
                          onClick={() => setSelectedSize(size)}
                          className={`relative py-3 px-2 text-center text-xs font-black uppercase transition-all ${
                            isSizeOutOfStock
                              ? 'bg-gray-100 text-gray-300 border border-gray-200 cursor-not-allowed line-through decoration-2 decoration-gray-400'
                              : isSelected
                              ? 'bg-[#0B1F3A] text-white border-2 border-[#0B1F3A] shadow-md'
                              : 'bg-white text-[#0B1F3A] border border-gray-200 hover:border-[#0B1F3A]'
                          }`}
                        >
                          <span>{size}</span>
                          {/* Strikethrough badge label if sold out */}
                          {isSizeOutOfStock && (
                            <span className="block text-[8px] no-underline font-normal text-gray-400 mt-0.5">
                              Habis
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Real-time Stock Status */}
                <div className="mt-4 p-2.5 bg-[#F2F4F7] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0B1F3A]" />
                    <span className="font-semibold text-[#0B1F3A]">Status Stok:</span>
                  </div>
                  {isSoldOut ? (
                    <span className="font-black text-rose-600 uppercase">Semua Varian Habis</span>
                  ) : isCurrentVariantOutOfStock ? (
                    <span className="font-black text-rose-600 uppercase">Ukuran {selectedSize} Habis</span>
                  ) : availableStock <= 3 ? (
                    <span className="font-bold text-amber-600 animate-pulse">
                      Hanya sisa {availableStock} pcs!
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-600">
                      Tersedia ({availableStock} pcs)
                    </span>
                  )}
                </div>

                {/* Quantity selector */}
                {!isSoldOut && !isCurrentVariantOutOfStock && (
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-xs font-black uppercase text-[#0B1F3A]">Jumlah:</span>
                    <div className="flex items-center border border-gray-200">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1.5 text-xs font-bold hover:bg-[#F2F4F7] transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 text-xs font-black min-w-[36px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                        className="px-3 py-1.5 text-xs font-bold hover:bg-[#F2F4F7] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions: Wishlist + Add to Cart */}
              <div className="mt-6 pt-4 border-t border-[#F2F4F7] flex items-center gap-3">
                {/* Wishlist toggle */}
                <button
                  onClick={handleHeartClick}
                  className={`p-3.5 border transition-all ${
                    isWishlisted
                      ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
                      : 'border-gray-200 text-[#0B1F3A] hover:border-[#0B1F3A] bg-white'
                  }`}
                  title={isWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white stroke-white' : ''}`} />
                </button>

                {/* Add to Cart or Sold Out Button */}
                {isSoldOut || isCurrentVariantOutOfStock ? (
                  <button
                    disabled
                    className="flex-1 py-3.5 bg-gray-200 text-gray-400 font-bold text-xs uppercase tracking-widest cursor-not-allowed text-center"
                  >
                    Sold Out
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 py-3.5 bg-[#0B1F3A] hover:bg-[#163259] text-white font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isAdding ? 'Menambahkan...' : 'Tambah ke Keranjang'}</span>
                  </button>
                )}
              </div>

              {/* Streetwear assurance badges */}
              <div className="mt-4 pt-3 flex items-center justify-between text-[10px] uppercase font-bold text-gray-400 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Cotton Heavyweight
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Fast Dispatch
                </span>
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" /> Easy Exchange
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
