import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatRupiah } from './ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CartDrawer({ onProceedCheckout }) {
  const {
    items,
    subtotal,
    shippingFee,
    total,
    itemCount,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem
  } = useCart();
  const { user, promptLogin } = useAuth();
  const { showToast } = useToast();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    if (items.length === 0) return;

    // Check if user is logged in (Requirement: "Checkout hanya bisa dilakukan setelah login")
    if (!user) {
      showToast('Silakan login terlebih dahulu untuk melanjutkan checkout.', 'info');
      promptLogin(() => {
        setIsCartOpen(false);
        onProceedCheckout();
      });
      return;
    }

    setIsCartOpen(false);
    onProceedCheckout();
  };

  // Free shipping calculation (free for >= IDR 500k)
  const freeShippingThreshold = 500000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#F2F4F7]">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#F2F4F7] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0B1F3A]" />
              <h2 className="text-sm sm:text-base font-black tracking-wider uppercase text-[#0B1F3A] font-['Poppins']">
                Keranjang Belanja ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-gray-400 hover:text-[#0B1F3A] rounded-full hover:bg-[#F2F4F7] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-[#F2F4F7] px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between text-xs font-semibold text-[#0B1F3A]">
              <span>
                {remainingForFreeShipping > 0
                  ? `Tambah ${formatRupiah(remainingForFreeShipping)} untuk GRATIS ONGKIR!`
                  : 'SELAMAT! Anda berhak mendapat GRATIS ONGKIR 🎉'}
              </span>
              <span className="font-bold">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#0B1F3A] h-full transition-all duration-500 ease-out"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 mx-auto bg-[#F2F4F7] rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold uppercase text-[#0B1F3A]">
                  Keranjang Anda Kosong
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Mulai belanja koleksi streetwear favorit Anda sekarang.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-5 py-2.5 bg-[#0B1F3A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#163259] transition-all"
                >
                  Jelajahi Produk
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white border border-[#F2F4F7] rounded-none hover:border-gray-300 transition-colors"
                >
                  {/* Item Image */}
                  <div className="w-20 h-24 bg-[#F2F4F7] shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-black uppercase text-[#0B1F3A] line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2">
                        <span>Ukuran: <strong>{item.size}</strong></span>
                        <span>•</span>
                        <span>Warna: <strong>{item.color}</strong></span>
                      </div>

                      <div className="text-xs font-bold text-[#0B1F3A] mt-1">
                        {formatRupiah(item.price)}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#F2F4F7] text-[#0B1F3A] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-black min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#F2F4F7] text-[#0B1F3A] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-[#0B1F3A]">
                        {formatRupiah(item.subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 bg-white border-t border-[#F2F4F7] shadow-lg">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#0B1F3A]">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Ongkos Kirim</span>
                  <span className="font-bold text-[#0B1F3A]">
                    {shippingFee === 0 ? 'GRATIS' : formatRupiah(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#0B1F3A] pt-2 border-t border-[#F2F4F7]">
                  <span>Total Tagihan</span>
                  <span>{formatRupiah(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full mt-4 py-3.5 bg-[#0B1F3A] hover:bg-[#163259] text-white font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span>Lanjut ke Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-semibold uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Transaksi Terenkripsi & Pembayaran Aman</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
