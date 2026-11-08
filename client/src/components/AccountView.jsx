import React, { useState, useEffect } from 'react';
import { User, Package, LogOut, Clock, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { formatRupiah } from './ProductCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AccountView({ onOpenPayment, onContinueShopping, onNavigateWishlist }) {
  const { user, token, logout, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'

  // Edit profile state
  const [profileName, setProfileName] = useState(user ? user.name : '');
  const [profilePhone, setProfilePhone] = useState(user ? user.phone || '' : '');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  // Fetch orders
  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      await updateProfile(profileName, profilePhone);
      showToast('Profil Anda berhasil diperbarui!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Lunas / Diproses
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
            <Clock className="w-3 h-3 text-amber-600" />
            Menunggu Bayar
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-black uppercase">
            Kedaluwarsa
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black uppercase">
            Dibatalkan
          </span>
        );
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F2F4F7] gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center font-black text-xl shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B1F3A] uppercase tracking-tight font-['Poppins']">
              {user.name}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{user.email} • Anggota NPD CLUB</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-rose-600 text-xs font-bold uppercase tracking-wider hover:bg-rose-50 transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar (Logout)</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mt-6 gap-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === 'orders'
              ? 'border-[#0B1F3A] text-[#0B1F3A]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Riwayat Pesanan ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === 'profile'
              ? 'border-[#0B1F3A] text-[#0B1F3A]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Pengaturan Akun & Profil
        </button>
      </div>

      {/* Tab 1: Orders List */}
      {activeTab === 'orders' && (
        <div className="mt-6">
          {loadingOrders ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
              <p className="mt-3 text-xs text-gray-500">Memuat riwayat pesanan...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center bg-[#F2F4F7]/40 rounded-xl border border-dashed border-gray-300 my-4">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-sm font-bold uppercase text-[#0B1F3A]">Belum Ada Pesanan</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Anda belum melakukan pembelian produk streetwear NPD CLUB.
              </p>
              <button
                onClick={onContinueShopping}
                className="mt-5 px-6 py-2.5 bg-[#0B1F3A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#163259]"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#F2F4F7] hover:border-gray-300 transition-colors p-5 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                    <div>
                      <div className="text-xs font-mono font-black text-[#0B1F3A]">
                        {order.order_number}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        Dipesan pada: {new Date(order.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  {/* Order items snapshot */}
                  <div className="divide-y divide-gray-50 my-3">
                    {order.items?.map((item) => (
                      <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.product_name}
                            className="w-10 h-12 object-cover bg-[#F2F4F7]"
                          />
                          <div>
                            <div className="font-black uppercase text-[#0B1F3A]">{item.product_name}</div>
                            <div className="text-gray-500 text-[11px]">
                              {item.size} / {item.color} • {item.quantity} pcs
                            </div>
                          </div>
                        </div>
                        <div className="font-bold text-[#0B1F3A]">{formatRupiah(item.subtotal)}</div>
                      </div>
                    ))}
                  </div>

                  {/* Total & Action */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-gray-500">Total Pembayaran:</span>
                      <span className="ml-2 text-sm font-black text-[#0B1F3A]">
                        {formatRupiah(order.total_amount)}
                      </span>
                    </div>

                    {order.status === 'pending' ? (
                      <button
                        onClick={() => onOpenPayment(order.order_number)}
                        className="px-4 py-2 bg-[#0B1F3A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#163259] transition-colors flex items-center gap-1.5"
                      >
                        <span>Selesaikan Bayar</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenPayment(order.order_number)}
                        className="px-4 py-2 border border-gray-200 text-[#0B1F3A] text-xs font-bold uppercase tracking-wider hover:bg-[#F2F4F7] transition-colors"
                      >
                        Detail Pesanan
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="mt-6 max-w-xl">
          <form onSubmit={handleUpdateProfile} className="bg-white p-6 border border-[#F2F4F7] shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0B1F3A] pb-3 border-b border-[#F2F4F7]">
              Informasi Pribadi
            </h3>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-3.5 py-2.5 border border-gray-200 bg-gray-100 text-xs text-gray-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Email terdaftar digunakan sebagai ID akun utama NPD CLUB.
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                Nomor WhatsApp / HP
              </label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                placeholder="081234567890"
                className="w-full px-3.5 py-2.5 border border-gray-300 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="mt-4 px-6 py-3 bg-[#0B1F3A] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#163259] transition-all shadow-md disabled:bg-gray-400"
            >
              {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
