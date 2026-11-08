import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    forgotPassword,
    resetPassword
  } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedResetToken, setGeneratedResetToken] = useState(null);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      showToast('Selamat datang kembali di NPD CLUB!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register(name, email, phone, password);
      showToast('Pendaftaran akun berhasil! Selamat datang.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await forgotPassword(email);
      showToast(res.message, 'info');
      if (res.resetToken) {
        setGeneratedResetToken(res.resetToken);
        setTokenInput(res.resetToken);
        setAuthModalMode('reset');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await resetPassword(tokenInput, newPassword);
      showToast('Password Anda berhasil diperbarui! Silakan login.', 'success');
      setAuthModalMode('login');
      setPassword(newPassword);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white shadow-2xl border border-[#F2F4F7] z-10 overflow-hidden my-8">
          
          {/* Header */}
          <div className="p-6 pb-4 border-b border-[#F2F4F7] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-widest text-[#0B1F3A] uppercase font-['Poppins']">
                ✦ NPD CLUB
              </span>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-1.5 text-gray-400 hover:text-[#0B1F3A] rounded-full hover:bg-[#F2F4F7] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs (Login / Register) */}
          {(authModalMode === 'login' || authModalMode === 'register') && (
            <div className="flex border-b border-[#F2F4F7]">
              <button
                onClick={() => setAuthModalMode('login')}
                className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${
                  authModalMode === 'login'
                    ? 'border-[#0B1F3A] text-[#0B1F3A] bg-white'
                    : 'border-transparent text-gray-400 hover:text-gray-700 bg-gray-50'
                }`}
              >
                Masuk (Log In)
              </button>
              <button
                onClick={() => setAuthModalMode('register')}
                className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${
                  authModalMode === 'register'
                    ? 'border-[#0B1F3A] text-[#0B1F3A] bg-white'
                    : 'border-transparent text-gray-400 hover:text-gray-700 bg-gray-50'
                }`}
              >
                Buat Akun Baru
              </button>
            </div>
          )}

          {/* Form Content */}
          <div className="p-6">
            
            {/* 1. LOGIN FORM */}
            {authModalMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-base font-black uppercase text-[#0B1F3A] font-['Poppins']">
                    Masuk ke Akun Anda
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Akses wishlist tersimpan & selesaikan pesanan dengan cepat.
                  </p>
                </div>

                {/* Demo credentials hint */}
                <div className="p-2.5 bg-[#F2F4F7] text-[11px] text-[#0B1F3A] flex items-center justify-between">
                  <span>Demo: <strong>demo@npdclub.com</strong></span>
                  <span>Pass: <strong>password123</strong></span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold uppercase text-gray-600">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('forgot')}
                      className="text-[11px] text-[#0B1F3A] hover:underline font-semibold"
                    >
                      Lupa Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0B1F3A] hover:bg-[#163259] text-white font-black text-xs uppercase tracking-widest transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Memproses...' : 'Masuk Sekarang'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 2. REGISTER FORM */}
            {authModalMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="text-center mb-3">
                  <h3 className="text-base font-black uppercase text-[#0B1F3A] font-['Poppins']">
                    Bergabung dengan NPD CLUB
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Daftar untuk menikmati akses koleksi eksklusif & fitur wishlist.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                    Nama Lengkap *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama lengkap Anda"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                    Alamat Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                    Password (Min. 6 Karakter) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0B1F3A] hover:bg-[#163259] text-white font-black text-xs uppercase tracking-widest transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Mendaftarkan...' : 'Daftar Akun'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 3. FORGOT PASSWORD FORM */}
            {authModalMode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-base font-black uppercase text-[#0B1F3A] font-['Poppins']">
                    Lupa Password?
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Masukkan email terdaftar Anda untuk membuat token reset password.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                    Email Akun
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 border border-gray-300 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0B1F3A] hover:bg-[#163259] text-white font-black text-xs uppercase tracking-widest transition-all shadow-md"
                >
                  {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('login')}
                    className="text-xs text-[#0B1F3A] hover:underline font-bold uppercase"
                  >
                    Kembali ke Login
                  </button>
                </div>
              </form>
            )}

            {/* 4. RESET PASSWORD FORM */}
            {authModalMode === 'reset' && (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="text-center mb-3">
                  <h3 className="text-base font-black uppercase text-[#0B1F3A] font-['Poppins']">
                    Buat Password Baru
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Token reset telah dibuat otomatis untuk pengujian.
                  </p>
                </div>

                {generatedResetToken && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px]">
                    Token Terisi Otomatis: <strong className="font-mono">{generatedResetToken.substring(0, 12)}...</strong>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                    Token Reset
                  </label>
                  <input
                    type="text"
                    required
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 text-xs font-mono text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                    Password Baru (Min. 6 Karakter)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 border border-gray-300 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0B1F3A] hover:bg-[#163259] text-white font-black text-xs uppercase tracking-widest transition-all shadow-md"
                >
                  {loading ? 'Menyimpan...' : 'Perbarui Password'}
                </button>
              </form>
            )}

          </div>

          {/* Footer security */}
          <div className="p-4 bg-[#F2F4F7] flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sesi Terenkripsi & Password Ter-hash (Bcrypt)</span>
          </div>

        </div>
      </div>
    </div>
  );
}
