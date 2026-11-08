import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Copy,
  Check,
  AlertTriangle,
  QrCode,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { formatRupiah } from './ProductCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function PaymentView({
  orderNumber,
  onOrderCompleted,
  onContinueShopping
}) {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedType, setCopiedType] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [activeInstructionTab, setActiveInstructionTab] = useState('mBanking');
  const [isSimulating, setIsSimulating] = useState(false);

  // Fetch Payment Details
  const fetchPaymentDetails = async () => {
    try {
      const res = await fetch(`/api/payment/${orderNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrderData(data.order);
      }
    } catch (err) {
      console.error('Fetch payment details error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
    const interval = setInterval(fetchPaymentDetails, 8000); // Poll status
    return () => clearInterval(interval);
  }, [orderNumber]);

  // Countdown timer logic
  useEffect(() => {
    if (!orderData || !orderData.expires_at) return;

    const timer = setInterval(() => {
      const distance = new Date(orderData.expires_at).getTime() - new Date().getTime();
      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / 1000 / 60) % 60);
        const seconds = Math.floor((distance / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [orderData]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast(`${type} berhasil disalin ke clipboard!`, 'info');
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Simulate payment success (Midtrans Sandbox / Demo Webhook)
  const handleSimulatePayment = async () => {
    try {
      setIsSimulating(true);
      const res = await fetch(`/api/payment/simulate/${orderNumber}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        showToast('Pembayaran berhasil dikonfirmasi! Stok produk telah diperbarui.', 'success');
        await fetchPaymentDetails();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Gagal simulasi: ' + err.message, 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  // Cancel order (releases reserved stock)
  const handleCancelOrder = async () => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini? Stok yang di-reserve akan dikembalikan.')) {
      return;
    }

    try {
      const res = await fetch(`/api/orders/${orderNumber}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Pesanan dibatalkan dan stok telah dikembalikan.', 'info');
        await fetchPaymentDetails();
      }
    } catch (err) {
      showToast('Gagal membatalkan pesanan.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-500">
          Memuat Detail Pembayaran...
        </p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center px-4">
        <h2 className="text-xl font-bold uppercase text-[#0B1F3A]">Pesanan Tidak Ditemukan</h2>
        <button
          onClick={onContinueShopping}
          className="mt-6 px-6 py-2.5 bg-[#0B1F3A] text-white text-xs font-bold uppercase"
        >
          Kembali Berbelanja
        </button>
      </div>
    );
  }

  const isPaid = orderData.status === 'paid';
  const isExpired = orderData.status === 'expired';
  const isCancelled = orderData.status === 'cancelled';
  const paymentDetails = orderData.payment_details || {};

  // If PAID: SHOW ORDER CONFIRMATION SCREEN
  if (isPaid) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white border border-[#F2F4F7] shadow-xl p-6 sm:p-10 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-[11px] font-black tracking-widest uppercase text-emerald-600 bg-emerald-50 px-3 py-1">
            PEMBAYARAN TERVERIFIKASI
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F3A] uppercase tracking-tight font-['Poppins'] mt-3">
            Terima Kasih Atas Pesanan Anda!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Pesanan Anda dengan nomor <strong className="text-[#0B1F3A]">{orderData.order_number}</strong> telah berstatus <strong>LUNAS</strong>. Tim NPD CLUB sedang mempersiapkan paket Anda.
          </p>

          {/* Order Snapshot */}
          <div className="mt-8 bg-[#F2F4F7] p-5 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-semibold uppercase">Nomor Pesanan</span>
              <span className="font-black text-[#0B1F3A]">{orderData.order_number}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-semibold uppercase">Total Pembayaran</span>
              <span className="font-black text-[#0B1F3A]">{formatRupiah(orderData.total_amount)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-semibold uppercase">Metode Pembayaran</span>
              <span className="font-bold text-[#0B1F3A] uppercase">
                {orderData.payment_method === 'qris' ? 'QRIS Otomatis' : `Virtual Account ${paymentDetails.bank || 'Bank'}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold uppercase">Penerima & Alamat</span>
              <span className="font-bold text-[#0B1F3A] text-right">
                {orderData.shipping_name} ({orderData.shipping_city})
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOrderCompleted}
              className="flex-1 py-3.5 bg-[#0B1F3A] text-white text-xs font-black uppercase tracking-wider hover:bg-[#163259] transition-all shadow-md"
            >
              Lihat di Riwayat Pesanan
            </button>
            <button
              onClick={onContinueShopping}
              className="flex-1 py-3.5 border border-gray-300 text-[#0B1F3A] text-xs font-black uppercase tracking-wider hover:bg-[#F2F4F7] transition-all"
            >
              Lanjut Belanja Streetwear
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If EXPIRED OR CANCELLED
  if (isExpired || isCancelled) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black uppercase text-[#0B1F3A]">
          Pesanan Ini Telah {isExpired ? 'Kedaluwarsa' : 'Dibatalkan'}
        </h2>
        <p className="text-xs text-gray-500 mt-2">
          Stok barang yang sebelumnya di-reserve telah dikembalikan ke stok toko.
        </p>
        <button
          onClick={onContinueShopping}
          className="mt-6 px-6 py-3 bg-[#0B1F3A] text-white text-xs font-bold uppercase tracking-wider"
        >
          Belanja Ulang
        </button>
      </div>
    );
  }

  // PENDING PAYMENT VIEW
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner Notice */}
      <div className="bg-[#0B1F3A] text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
            MENUNGGU PEMBAYARAN
          </span>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight mt-0.5">
            Selesaikan Pembayaran Anda
          </h1>
          <p className="text-xs text-gray-300 mt-0.5">
            Nomor Pesanan: <span className="font-mono font-bold text-white">{orderData.order_number}</span>
          </p>
        </div>

        {/* 24h Countdown timer */}
        <div className="bg-white/10 px-4 py-2 border border-white/20 flex items-center gap-3 self-start sm:self-auto">
          <Clock className="w-5 h-5 text-amber-400" />
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-gray-300">Batas Waktu Bayar</div>
            <div className="font-mono text-base font-black tracking-widest text-white">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Payment Container */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left: Payment Gateway Interactive Section (7 cols) */}
        <div className="md:col-span-7 bg-white p-6 border border-[#F2F4F7] shadow-sm space-y-6">
          
          {/* METHOD 1: QRIS */}
          {orderData.payment_method === 'qris' && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#F2F4F7] px-3 py-1 text-xs font-bold uppercase text-[#0B1F3A]">
                <QrCode className="w-4 h-4" />
                <span>QRIS Dinamis NPD CLUB</span>
              </div>

              {/* Dynamic QR Code Render */}
              <div className="p-4 bg-white border-2 border-dashed border-gray-300 inline-block shadow-md">
                {orderData.qr_data_url ? (
                  <img
                    src={orderData.qr_data_url}
                    alt="QRIS NPD CLUB"
                    className="w-56 h-56 mx-auto object-contain"
                  />
                ) : (
                  <div className="w-56 h-56 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                    Membuat QR Code...
                  </div>
                )}
                <div className="mt-2 text-[11px] font-black uppercase text-[#0B1F3A] tracking-wider">
                  ✦ SCAN UNTUK MEMBAYAR
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-gray-500">Nominal yang harus dibayar:</div>
                <div className="text-2xl font-black text-[#0B1F3A] font-mono">
                  {formatRupiah(orderData.total_amount)}
                </div>
              </div>

              <div className="p-3 bg-[#F2F4F7] text-left text-xs text-gray-600 space-y-1.5">
                <div className="font-bold text-[#0B1F3A]">Cara Pembayaran QRIS:</div>
                <ol className="list-decimal list-inside space-y-1 text-[11px]">
                  <li>Buka aplikasi mobile banking (BCA, Mandiri, BRImo, dll) atau e-wallet (GoPay, OVO, ShopeePay, Dana).</li>
                  <li>Pilih menu <strong>Scan QR / QRIS</strong>.</li>
                  <li>Arahkan kamera ke kode QR di atas.</li>
                  <li>Pastikan nama merchant adalah <strong>NPD CLUB</strong> dan nominal sesuai.</li>
                  <li>Konfirmasi pembayaran dengan PIN Anda.</li>
                </ol>
              </div>
            </div>
          )}

          {/* METHOD 2: VIRTUAL ACCOUNT */}
          {orderData.payment_method.endsWith('_va') && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#0B1F3A]" />
                  <span className="text-sm font-black uppercase tracking-wider text-[#0B1F3A]">
                    {paymentDetails.bank || 'Bank'} Virtual Account
                  </span>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-[#0B1F3A] text-white">
                  OTOMATIS
                </span>
              </div>

              {/* VA Number & Copy */}
              <div className="p-4 bg-[#F2F4F7] border border-gray-200">
                <div className="text-[11px] font-bold uppercase text-gray-500">Nomor Virtual Account:</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-wider">
                    {paymentDetails.va_number || '107771234567'}
                  </span>
                  <button
                    onClick={() => copyToClipboard(paymentDetails.va_number, 'Nomor VA')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B1F3A] text-white text-xs font-bold uppercase hover:bg-[#163259] transition-colors"
                  >
                    {copiedType === 'Nomor VA' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'Nomor VA' ? 'Disalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {/* Nominal & Copy */}
              <div className="p-4 bg-[#F2F4F7] border border-gray-200">
                <div className="text-[11px] font-bold uppercase text-gray-500">Total Nominal Pembayaran:</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xl sm:text-2xl font-black text-[#0B1F3A]">
                    {formatRupiah(orderData.total_amount)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(orderData.total_amount.toString(), 'Nominal')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B1F3A] text-white text-xs font-bold uppercase hover:bg-[#163259] transition-colors"
                  >
                    {copiedType === 'Nominal' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'Nominal' ? 'Disalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {/* Step by Step Bank Instructions */}
              <div className="pt-2">
                <div className="text-xs font-bold uppercase text-[#0B1F3A] mb-2">
                  Petunjuk Pembayaran {paymentDetails.bank}:
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                  {['mBanking', 'atm', 'iBanking'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveInstructionTab(tab)}
                      className={`flex-1 py-2 text-center text-xs font-bold uppercase transition-colors border-b-2 ${
                        activeInstructionTab === tab
                          ? 'border-[#0B1F3A] text-[#0B1F3A]'
                          : 'border-transparent text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'mBanking' ? 'm-Banking' : tab === 'atm' ? 'ATM' : 'i-Banking'}
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-[#F2F4F7]/60 text-xs text-gray-600 mt-2">
                  <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                    {(orderData.instructions?.[activeInstructionTab] || [
                      'Buka aplikasi m-banking bank Anda.',
                      'Pilih menu Transfer > Virtual Account.',
                      'Masukkan nomor Virtual Account.',
                      'Pastikan nama merchant adalah NPD CLUB dan selesaikan pembayaran.'
                    ]).map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATION & DEMO WEBHOOK TOOLBOX (Instant testing!) */}
          <div className="pt-4 border-t-2 border-dashed border-gray-300">
            <div className="bg-amber-50 border border-amber-200 p-4">
              <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase">
                <span>✦ Mode Pengujian & Sandbox Gateway</span>
              </div>
              <p className="text-[11px] text-amber-800 mt-1">
                Gunakan tombol di bawah untuk menyimulasikan notifikasi Webhook pembayaran sukses secara instan, menguji pemotongan stok otomatis dari database, dan melihat konfirmasi pesanan.
              </p>
              <button
                onClick={handleSimulatePayment}
                disabled={isSimulating}
                className="w-full mt-3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSimulating ? 'Memproses Simulasi...' : '⚡ Simulasikan Pembayaran Berhasil'}</span>
              </button>
            </div>
          </div>

          {/* Cancel Order */}
          <div className="text-center pt-2">
            <button
              onClick={handleCancelOrder}
              className="text-xs text-rose-600 hover:underline uppercase font-bold tracking-wider"
            >
              Batalkan Pesanan Ini
            </button>
          </div>
        </div>

        {/* Right: Order Items & Shipping Summary (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white p-6 border border-[#F2F4F7] shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0B1F3A] pb-3 border-b border-[#F2F4F7]">
              Item Pesanan ({orderData.items?.length || 0})
            </h3>

            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto my-3">
              {(orderData.items || []).map((item) => (
                <div key={item.id} className="py-2.5 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.product_name}
                    className="w-12 h-14 object-cover bg-[#F2F4F7]"
                  />
                  <div className="flex-1">
                    <div className="text-xs font-black uppercase text-[#0B1F3A] line-clamp-1">
                      {item.product_name}
                    </div>
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

            <div className="pt-3 border-t border-gray-200 text-xs space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-[#0B1F3A]">{formatRupiah(orderData.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ongkos Kirim</span>
                <span className="font-bold text-[#0B1F3A]">
                  {orderData.shipping_fee === 0 ? 'GRATIS' : formatRupiah(orderData.shipping_fee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#0B1F3A] pt-2 border-t border-gray-200">
                <span>Total Tagihan</span>
                <span>{formatRupiah(orderData.total_amount)}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 text-[11px] text-gray-500">
              <div className="font-bold uppercase text-[#0B1F3A]">Alamat Pengiriman:</div>
              <div className="mt-1 font-semibold text-gray-800">{orderData.shipping_name} ({orderData.shipping_phone})</div>
              <div>{orderData.shipping_address}, {orderData.shipping_city} {orderData.shipping_postal_code}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
