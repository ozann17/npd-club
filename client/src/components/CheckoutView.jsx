import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, CreditCard, QrCode, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatRupiah } from './ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CheckoutView({ onBackToCart, onOrderCreated }) {
  const { items, subtotal, shippingFee, total, refreshCart } = useCart();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    shippingName: user ? user.name : '',
    shippingPhone: user ? user.phone || '' : '',
    shippingAddress: '',
    shippingCity: '',
    shippingPostalCode: '',
    paymentMethod: 'qris' // 'qris', 'bca_va', 'bri_va', 'mandiri_va', 'bni_va'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockError, setStockError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCheckout = async (e) => {
    e.preventDefault();

    if (!formData.shippingName || !formData.shippingPhone || !formData.shippingAddress || !formData.shippingCity || !formData.shippingPostalCode) {
      showToast('Harap lengkapi semua data alamat pengiriman.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      setStockError(null);

      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.stock_error) {
          // Requirement: "Validasi stok sekali lagi saat checkout. Jika ada item yang habis, beri tahu user dan keluarkan item itu dari keranjang."
          setStockError(data.message);
          showToast(data.message, 'error', 5000);
          await refreshCart();
          return;
        }
        throw new Error(data.message || 'Checkout gagal.');
      }

      // Order created and stock reserved successfully
      await refreshCart();
      showToast('Pesanan berhasil dibuat! Stok telah di-reserve.', 'success');
      onOrderCreated(data.order);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top back button */}
      <button
        onClick={onBackToCart}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B1F3A] hover:opacity-75 transition-opacity mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Keranjang</span>
      </button>

      <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F3A] uppercase tracking-tight font-['Poppins']">
        Checkout & Pengiriman
      </h1>
      <p className="text-xs text-gray-500 mt-1">
        Lengkapi rincian pengiriman dan pilih metode pembayaran resmi NPD CLUB.
      </p>

      {/* Stock Error Alert if any variant ran out during final checkout check */}
      {stockError && (
        <div className="mt-4 p-4 bg-rose-50 border-l-4 border-rose-600 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <div className="font-bold">Penyesuaian Stok Terdeteksi</div>
            <div>{stockError}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmitCheckout} className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form & Payment methods (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Alamat Pengiriman */}
          <div className="bg-white p-6 border border-[#F2F4F7] shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2 pb-3 border-b border-[#F2F4F7]">
              <span>1. Informasi & Alamat Pengiriman</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                  Nama Penerima *
                </label>
                <input
                  type="text"
                  name="shippingName"
                  required
                  value={formData.shippingName}
                  onChange={handleInputChange}
                  placeholder="Contoh: Alex Pratama"
                  className="w-full px-3.5 py-2.5 border border-gray-300 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                  Nomor Handphone (WhatsApp) *
                </label>
                <input
                  type="tel"
                  name="shippingPhone"
                  required
                  value={formData.shippingPhone}
                  onChange={handleInputChange}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3.5 py-2.5 border border-gray-300 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                  Alamat Lengkap *
                </label>
                <textarea
                  name="shippingAddress"
                  required
                  rows="3"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  placeholder="Jalan, Nomor Rumah, RT/RW, Patokan atau Nomor Unit Apartemen"
                  className="w-full px-3.5 py-2.5 border border-gray-300 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                  Kota / Kabupaten *
                </label>
                <input
                  type="text"
                  name="shippingCity"
                  required
                  value={formData.shippingCity}
                  onChange={handleInputChange}
                  placeholder="Contoh: Jakarta Selatan"
                  className="w-full px-3.5 py-2.5 border border-gray-300 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                  Kode Pos *
                </label>
                <input
                  type="text"
                  name="shippingPostalCode"
                  required
                  value={formData.shippingPostalCode}
                  onChange={handleInputChange}
                  placeholder="Contoh: 12190"
                  className="w-full px-3.5 py-2.5 border border-gray-300 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>
            </div>
          </div>

          {/* 2. Metode Pembayaran */}
          <div className="bg-white p-6 border border-[#F2F4F7] shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2 pb-3 border-b border-[#F2F4F7]">
              <span>2. Pilih Metode Pembayaran</span>
            </h2>

            <div className="mt-4 space-y-3">
              {/* Option A: QRIS */}
              <label
                className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                  formData.paymentMethod === 'qris'
                    ? 'border-[#0B1F3A] bg-[#0B1F3A]/5 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="qris"
                  checked={formData.paymentMethod === 'qris'}
                  onChange={handleInputChange}
                  className="mt-1 accent-[#0B1F3A]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-[#0B1F3A] flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#0B1F3A]" />
                      QRIS (Semua Bank & Dompet Digital)
                    </span>
                    <span className="text-[10px] font-bold bg-[#0B1F3A] text-white px-2 py-0.5 uppercase">
                      Otomatis
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    BCA, GoPay, OVO, Dana, ShopeePay, LinkAja, Livin, BRImo & seluruh aplikasi berlogo QRIS.
                  </p>
                </div>
              </label>

              {/* Option B: Virtual Account BCA */}
              <label
                className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                  formData.paymentMethod === 'bca_va'
                    ? 'border-[#0B1F3A] bg-[#0B1F3A]/5 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bca_va"
                  checked={formData.paymentMethod === 'bca_va'}
                  onChange={handleInputChange}
                  className="mt-1 accent-[#0B1F3A]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-[#0B1F3A] flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#0B1F3A]" />
                      BCA Virtual Account
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5">
                      Verifikasi Instan
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Nomor rekening virtual unik untuk BCA Mobile, KlikBCA & myBCA.
                  </p>
                </div>
              </label>

              {/* Option C: Virtual Account BRI */}
              <label
                className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                  formData.paymentMethod === 'bri_va'
                    ? 'border-[#0B1F3A] bg-[#0B1F3A]/5 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bri_va"
                  checked={formData.paymentMethod === 'bri_va'}
                  onChange={handleInputChange}
                  className="mt-1 accent-[#0B1F3A]"
                />
                <div className="flex-1">
                  <span className="text-xs font-black uppercase text-[#0B1F3A] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#0B1F3A]" />
                    BRI Virtual Account (BRIVA)
                  </span>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Pembayaran instan melalui aplikasi BRImo & ATM BRI.
                  </p>
                </div>
              </label>

              {/* Option D: Virtual Account Mandiri */}
              <label
                className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                  formData.paymentMethod === 'mandiri_va'
                    ? 'border-[#0B1F3A] bg-[#0B1F3A]/5 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mandiri_va"
                  checked={formData.paymentMethod === 'mandiri_va'}
                  onChange={handleInputChange}
                  className="mt-1 accent-[#0B1F3A]"
                />
                <div className="flex-1">
                  <span className="text-xs font-black uppercase text-[#0B1F3A] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#0B1F3A]" />
                    Mandiri Virtual Account / Multipayment
                  </span>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Pembayaran mudah via Livin' by Mandiri & ATM Mandiri.
                  </p>
                </div>
              </label>

              {/* Option E: Virtual Account BNI */}
              <label
                className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                  formData.paymentMethod === 'bni_va'
                    ? 'border-[#0B1F3A] bg-[#0B1F3A]/5 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bni_va"
                  checked={formData.paymentMethod === 'bni_va'}
                  onChange={handleInputChange}
                  className="mt-1 accent-[#0B1F3A]"
                />
                <div className="flex-1">
                  <span className="text-xs font-black uppercase text-[#0B1F3A] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#0B1F3A]" />
                    BNI Virtual Account
                  </span>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Dapat dibayar via BNI Mobile Banking, Internet Banking & ATM BNI.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 border border-[#F2F4F7] shadow-sm sticky top-28">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#0B1F3A] pb-3 border-b border-[#F2F4F7]">
              Ringkasan Pesanan ({items.length} Item)
            </h2>

            {/* Items */}
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto my-3">
              {items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-14 object-cover bg-[#F2F4F7]"
                  />
                  <div className="flex-1">
                    <h4 className="text-xs font-black uppercase text-[#0B1F3A] line-clamp-1">
                      {item.name}
                    </h4>
                    <div className="text-[11px] text-gray-500">
                      {item.size} / {item.color} • {item.quantity}x
                    </div>
                  </div>
                  <div className="text-xs font-bold text-[#0B1F3A]">
                    {formatRupiah(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs pt-3 border-t border-[#F2F4F7]">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal Produk</span>
                <span className="font-bold text-[#0B1F3A]">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ongkos Kirim Regular</span>
                <span className="font-bold text-[#0B1F3A]">
                  {shippingFee === 0 ? 'GRATIS (Promo Capsule)' : formatRupiah(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#0B1F3A] pt-3 border-t border-gray-200">
                <span>Total Pembayaran</span>
                <span>{formatRupiah(total)}</span>
              </div>
            </div>

            {/* Notice regarding stock reservation */}
            <div className="mt-4 p-3 bg-[#F2F4F7] text-[11px] text-gray-600 leading-normal border-l-2 border-[#0B1F3A]">
              <span className="font-bold text-[#0B1F3A] block">✦ Garansi Reservasi Stok:</span>
              Setelah tombol ditekan, stok produk akan ditahan (reserve) selama 24 jam khusus untuk pesanan Anda.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full mt-6 py-4 bg-[#0B1F3A] hover:bg-[#163259] text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Memproses Pesanan...' : 'Bayar Sekarang'}</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
