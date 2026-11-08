import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Helper to get or create guest session ID
function getSessionId() {
  let id = localStorage.getItem('npd_session_id');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('npd_session_id', id);
  }
  return id;
}

export function CartProvider({ children }) {
  const { token, user } = useAuth();
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const headers = {
        'x-session-id': getSessionId()
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/cart', { headers });
      const data = await res.json();

      if (data.success) {
        setItems(data.items);
        setSubtotal(data.subtotal);
        setShippingFee(data.shippingFee);
        setTotal(data.total);
        setItemCount(data.itemCount);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart, user]);

  const addToCart = async (variantId, quantity = 1) => {
    setLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-session-id': getSessionId()
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers,
        body: JSON.stringify({ variantId, quantity })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menambahkan ke keranjang.');
      }

      await fetchCart();
      setIsCartOpen(true); // Open cart drawer to confirm addition
      return data;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-session-id': getSessionId()
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/cart/update', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ cartItemId, quantity })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal memperbarui jumlah.');
      }

      await fetchCart();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const headers = {
        'x-session-id': getSessionId()
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menghapus item.');
      }

      await fetchCart();
      return data;
    } catch (err) {
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        shippingFee,
        total,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeItem,
        refreshCart: fetchCart,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
