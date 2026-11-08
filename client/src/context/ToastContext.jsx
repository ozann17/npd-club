import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Heart, ShoppingBag, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3200) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-6 right-4 left-4 sm:left-auto sm:right-6 z-[100] flex flex-col gap-2.5 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-[#0B1F3A] text-white rounded-none shadow-2xl border-l-4 border-white transition-all transform animate-in fade-in slide-in-from-top-3 duration-200"
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {toast.type === 'wishlist-add' && <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0" />}
              {toast.type === 'wishlist-remove' && <Heart className="w-5 h-5 text-gray-400 shrink-0" />}
              {toast.type === 'cart' && <ShoppingBag className="w-5 h-5 text-white shrink-0" />}
              {toast.type === 'info' && <span className="text-white font-bold shrink-0">✦</span>}
              <span className="text-xs sm:text-sm font-medium tracking-wide">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
