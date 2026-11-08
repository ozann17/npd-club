import React from 'react';
import ProductCard from './ProductCard';
import { Layers } from 'lucide-react';

/* ==========================================================================
   [EDIT DI SINI] JUDUL & DESKRIPSI HEADER HALAMAN KOLEKSI
   Ganti teks di dalam tanda petik sesuai keinginan Anda:
   ========================================================================== */
export const COLLECTION_TITLES = {
  'all': 'Semua Koleksi Streetwear',
  'npd-collection': 'NPD Collection (Signature Drops)',
  'tdb-collection': 'TDB Collection 2026',
  'pickme-collection': 'Pick Me Collection'
};

export const COLLECTION_DESCRIPTIONS = {
  'all': 'Jelajahi seluruh katalog streetwear eksklusif NPD CLUB.',
  'npd-collection': 'Standar baru streetwear. Katun tebal 240+ GSM, siluet boxy presisi, dan grafis otentik NPD CLUB.',
  'tdb-collection': 'Tanpa aturan, tanpa batas. Manifestasi mentah dari kultur jalanan dan ritme musik bawah tanah.',
  'pickme-collection': 'Dibuat untuk mencuri perhatian. Potongan bersih dan karakter kuat untuk gaya harianmu.'
};

export default function CollectionGrid({
  products,
  loading,
  selectedCollection,
  onSelectCollection,
  onOpenDetail,
  wishlistIds,
  onToggleWishlist
}) {
  const collectionTitles = COLLECTION_TITLES;
  const collectionDescriptions = COLLECTION_DESCRIPTIONS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Collection Header & Quick Filter Pills */}
      <div className="pb-6 border-b border-[#F2F4F7]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">
                ✦ KOLEKSI AKTIF
              </span>
              <span className="text-[10px] font-bold bg-[#0B1F3A] text-white px-2 py-0.5 uppercase">
                {products.length} PRODUK
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#0B1F3A] tracking-tight font-['Poppins'] mt-1">
              {collectionTitles[selectedCollection] || 'Katalog Produk NPD CLUB'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
              {collectionDescriptions[selectedCollection] || ''}
            </p>
          </div>

          {/* Quick Filter Pills (Direct toggle without intermediate pages) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'npd-collection', label: 'NPD Collection' },
              { id: 'tdb-collection', label: 'TDB Collection' },
              { id: 'pickme-collection', label: 'Pick Me Collection' }
            ].map((col) => (
              <button
                key={col.id}
                onClick={() => onSelectCollection(col.id)}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-none shrink-0 ${
                  selectedCollection === col.id
                    ? 'bg-[#0B1F3A] text-white shadow-sm'
                    : 'bg-[#F2F4F7] text-gray-700 hover:bg-gray-200'
                }`}
              >
                {col.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-500">
            Memuat Katalog Koleksi...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-[#F2F4F7]/40 rounded-xl border border-dashed border-gray-300 my-8">
          <Layers className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-base font-bold uppercase text-[#0B1F3A]">
            Belum Ada Produk di Koleksi Ini
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Silakan pilih koleksi lainnya untuk melihat produk yang tersedia.
          </p>
          <button
            onClick={() => onSelectCollection('all')}
            className="mt-5 px-6 py-2.5 bg-[#0B1F3A] text-white text-xs font-bold uppercase tracking-wider"
          >
            Lihat Semua Produk
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetail={onOpenDetail}
              isWishlisted={wishlistIds.has(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}

    </div>
  );
}
