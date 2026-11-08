import React from 'react';
import { Heart, Trash2, ShoppingBag, ArrowLeft, Layers } from 'lucide-react';
import { formatRupiah } from './ProductCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function WishlistView({
  wishlistItems,
  loading,
  onOpenDetail,
  onRemoveFromWishlist,
  onBrowseCollection
}) {
  const { user, promptLogin } = useAuth();
  const { showToast } = useToast();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto bg-[#F2F4F7] rounded-full flex items-center justify-center text-[#0B1F3A] mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-[#0B1F3A] tracking-tight font-['Poppins']">
          Simpan Favorit Anda di Wishlist
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
          Masuk ke akun NPD CLUB Anda untuk menyimpan wishlist di database, sehingga tetap tersinkronisasi di semua perangkat Anda.
        </p>
        <div className="mt-6">
          <button
            onClick={() => promptLogin()}
            className="px-6 py-3 bg-[#0B1F3A] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#163259] transition-all shadow-md"
          >
            Masuk / Buat Akun
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F2F4F7] gap-4">
        <div>
          <span className="text-[11px] font-black tracking-widest uppercase text-gray-500">
            NPD CLUB • ARSIP PRIBADI
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F3A] tracking-tight uppercase font-['Poppins'] flex items-center gap-3">
            <span>Wishlist Saya</span>
            <span className="text-sm bg-[#0B1F3A] text-white px-2.5 py-0.5 rounded-full font-bold">
              {wishlistItems.length}
            </span>
          </h1>
        </div>

        <button
          onClick={onBrowseCollection}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B1F3A] hover:opacity-75 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Koleksi</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-500">
            Memuat Wishlist Anda...
          </p>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="py-20 text-center bg-[#F2F4F7]/40 rounded-2xl border border-dashed border-gray-300 my-8">
          <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-gray-400 mb-4 shadow-sm">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold uppercase text-[#0B1F3A] tracking-tight">
            Wishlist Anda Masih Kosong
          </h3>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            Jelajahi koleksi streetwear NPD CLUB dan tekan ikon hati untuk menyimpan produk favorit Anda.
          </p>
          <button
            onClick={onBrowseCollection}
            className="mt-6 px-6 py-3 bg-[#0B1F3A] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#163259] transition-all shadow-md inline-flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            <span>Jelajahi Koleksi Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
          {wishlistItems.map((product) => {
            const isSoldOut = product.is_sold_out;

            return (
              <div
                key={product.id}
                className="group relative flex flex-col bg-white border border-[#F2F4F7] hover:border-gray-300 transition-all shadow-sm"
              >
                {/* Photo */}
                <div
                  onClick={() => onOpenDetail(product)}
                  className="relative aspect-[3/4] w-full bg-[#F2F4F7] overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.primary_image}
                    alt={product.name}
                    className={`w-full h-full object-cover object-center transition-all duration-300 ${
                      isSoldOut ? 'grayscale opacity-50 contrast-75' : ''
                    }`}
                  />

                  {/* Sold out label (requirement: "Produk Sold Out di wishlist tetap tampil dengan label Sold Out") */}
                  {isSoldOut && (
                    <div className="absolute top-3 left-3 z-10 bg-[#0B1F3A] text-white text-[10px] font-black tracking-widest px-2.5 py-0.5 shadow uppercase">
                      SOLD OUT
                    </div>
                  )}

                  {/* Delete button from wishlist */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 z-20 p-2 bg-white/90 hover:bg-rose-600 hover:text-white text-[#0B1F3A] rounded-full transition-colors shadow-md"
                    title="Hapus dari Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                      {product.collection_name}
                    </span>
                    <h3
                      onClick={() => onOpenDetail(product)}
                      className="text-xs sm:text-sm font-bold text-[#0B1F3A] tracking-tight uppercase line-clamp-1 cursor-pointer hover:underline"
                    >
                      {product.name}
                    </h3>
                    <div className="mt-1 text-xs sm:text-sm font-black text-[#0B1F3A]">
                      {formatRupiah(product.price)}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="mt-3 pt-2 border-t border-[#F2F4F7]">
                    {isSoldOut ? (
                      <button
                        disabled
                        className="w-full py-2 bg-gray-200 text-gray-400 text-[11px] font-bold uppercase tracking-widest cursor-not-allowed text-center"
                      >
                        Sold Out
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenDetail(product)}
                        className="w-full py-2 bg-[#0B1F3A] text-white hover:bg-[#163259] text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Pilih Ukuran</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
