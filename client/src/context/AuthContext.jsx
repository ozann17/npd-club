import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('npd_auth_token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'
  const [authRedirectAction, setAuthRedirectAction] = useState(null); // callback or action after login
  const [resetTokenData, setResetTokenData] = useState(null);

  // Load user profile on mount if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error('Failed to load user:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login gagal.');
    }

    localStorage.setItem('npd_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setIsAuthModalOpen(false);

    // Sync guest cart if any
    try {
      const sessionId = localStorage.getItem('npd_session_id');
      await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'x-session-id': sessionId || ''
        }
      });
    } catch (e) {
      console.warn('Cart sync error:', e);
    }

    // Execute pending action (e.g. favorite or checkout)
    if (authRedirectAction) {
      authRedirectAction(data.user);
      setAuthRedirectAction(null);
    }

    return data;
  };

  const register = async (name, email, phone, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Registrasi gagal.');
    }

    localStorage.setItem('npd_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setIsAuthModalOpen(false);

    if (authRedirectAction) {
      authRedirectAction(data.user);
      setAuthRedirectAction(null);
    }

    return data;
  };

  const logout = () => {
    localStorage.removeItem('npd_auth_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (name, phone) => {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, phone })
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal update profil.');
    }

    setUser(prev => ({ ...prev, ...data.user }));
    return data;
  };

  const forgotPassword = async (email) => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal mengirim instruksi reset.');
    }
    return data;
  };

  const resetPassword = async (tokenString, newPassword) => {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenString, newPassword })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal mereset password.');
    }
    return data;
  };

  const promptLogin = (actionCallback = null, initialMode = 'login') => {
    setAuthModalMode(initialMode);
    setAuthRedirectAction(() => actionCallback);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        promptLogin,
        resetTokenData,
        setResetTokenData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
