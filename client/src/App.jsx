import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { ToastProvider, useToast } from './context/ToastContext';

import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import BottomMenuDrawer from './components/BottomMenuDrawer';
import HeroBanner from './components/HeroBanner';
import CollectionGrid from './components/CollectionGrid';
import ProductDetailModal from './components/ProductDetailModal';
import WishlistView from './components/WishlistView';
import CartDrawer from './components/CartDrawer';
import CheckoutView from './components/CheckoutView';
import PaymentView from './components/PaymentView';
import AccountView from './components/AccountView';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

function MainApp() {
  const { user, token } = useAuth();
  const { showToast } = useToast();

  // Navigation & View States
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'collection' | 'wishlist' | 'checkout' | 'payment' | 'account'
  const [selectedCollection, setSelectedCollection] = useState('all'); // 'all' | 'npd-collection' | 'spring-collection' | 'winter-collection'
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [activePaymentOrderNumber, setActivePaymentOrderNumber] = useState(null);

  // Data states
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  // Fetch Products based on collection filter
  const fetchProducts = useCallback(async (colSlug) => {
    try {
      setLoadingProducts(true);
      const url = colSlug && colSlug !== 'all' ? `/api/products?collection=${colSlug}` : '/api/products';
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(url, { headers });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
    } finally {
      setLoadingProducts(false);
    }
  }, [token]);

  // Fetch Wishlist items if logged in
  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setWishlistItems([]);
      setWishlistIds(new Set());
      return;
    }

    try {
      setLoadingWishlist(true);
      const res = await fetch('/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setWishlistItems(data.wishlist);
        setWishlistIds(new Set(data.wishlist.map(item => item.id)));
      }
    } catch (err) {
      console.error('Fetch wishlist error:', err);
    } finally {
      setLoadingWishlist(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts(selectedCollection);
  }, [fetchProducts, selectedCollection]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist, user]);

  // Handle Collection selection from anywhere (Bottom menu, Navbar, or Hero)
  // Requirement: "Saat salah satu collection diklik, LANGSUNG tampil grid produk dari collection tersebut (tanpa halaman perantara). Ini adalah fitur inti website."
  const handleSelectCollection = (slug) => {
    setSelectedCollection(slug);
    setCurrentView('collection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Wishlist handler (database sync + toast)
  const handleToggleWishlist = async (productId) => {
    if (!token) return;

    try {
      const res = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      const data = await res.json();

      if (data.success) {
        showToast(
          data.action === 'added' ? 'Produk ditambahkan ke Wishlist 🖤' : 'Produk dihapus dari Wishlist.',
          data.action === 'added' ? 'wishlist-add' : 'wishlist-remove'
        );
        await fetchWishlist();
        // Update product in current list
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, is_wishlisted: data.is_wishlisted } : p));
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Gagal mengubah status wishlist.', 'error');
    }
  };

  // Remove single item from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Produk dihapus dari Wishlist.', 'wishlist-remove');
        await fetchWishlist();
      }
    } catch (err) {
      showToast('Gagal menghapus produk.', 'error');
    }
  };

  // Handle Order Created
  const handleOrderCreated = (order) => {
    setActivePaymentOrderNumber(order.orderNumber);
    setCurrentView('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1F3A] flex flex-col font-['Inter',sans-serif] pb-16 sm:pb-0">
      
      {/* 1. Header & Navigation (Strictly NO search bar anywhere!) */}
      <Navbar
        onOpenBottomMenu={() => setIsBottomMenuOpen(true)}
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        selectedCollection={selectedCollection}
        setSelectedCollection={setSelectedCollection}
        wishlistCount={wishlistItems.length}
      />

      {/* 2. Main Body Content Based on Active View */}
      <main className="flex-1">
        {/* VIEW A: HOME */}
        {currentView === 'home' && (
          <div>
            <HeroBanner onSelectCollection={handleSelectCollection} />
            
            {/* Featured Showcase Section */}
            <div className="py-6">
              <CollectionGrid
                products={products.filter(p => p.is_featured === 1)}
                loading={loadingProducts}
                selectedCollection={selectedCollection}
                onSelectCollection={handleSelectCollection}
                onOpenDetail={(product) => setSelectedProductDetail(product)}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            </div>
          </div>
        )}

        {/* VIEW B: COLLECTION GRID (Direct jump, no intermediate page!) */}
        {currentView === 'collection' && (
          <CollectionGrid
            products={products}
            loading={loadingProducts}
            selectedCollection={selectedCollection}
            onSelectCollection={handleSelectCollection}
            onOpenDetail={(product) => setSelectedProductDetail(product)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {/* VIEW C: WISHLIST */}
        {currentView === 'wishlist' && (
          <WishlistView
            wishlistItems={wishlistItems}
            loading={loadingWishlist}
            onOpenDetail={(product) => setSelectedProductDetail(product)}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onBrowseCollection={() => handleSelectCollection('all')}
          />
        )}

        {/* VIEW D: CHECKOUT */}
        {currentView === 'checkout' && (
          <CheckoutView
            onBackToCart={() => setCurrentView('home')}
            onOrderCreated={handleOrderCreated}
          />
        )}

        {/* VIEW E: PAYMENT (QRIS / VA + Simulation) */}
        {currentView === 'payment' && (
          <PaymentView
            orderNumber={activePaymentOrderNumber}
            onOrderCompleted={() => {
              setCurrentView('account');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onContinueShopping={() => {
              handleSelectCollection('all');
            }}
          />
        )}

        {/* VIEW F: ACCOUNT & ORDER HISTORY */}
        {currentView === 'account' && (
          <AccountView
            onOpenPayment={(ordNum) => {
              setActivePaymentOrderNumber(ordNum);
              setCurrentView('payment');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onContinueShopping={() => {
              handleSelectCollection('all');
            }}
            onNavigateWishlist={() => {
              setCurrentView('wishlist');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* 3. Footer */}
      <Footer
        onSelectCollection={handleSelectCollection}
        onNavigateWishlist={() => {
          setCurrentView('wishlist');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCart={() => {}}
      />

      {/* 4. Core Feature #2: Bottom Navigation Bar with Thumb Hamburger (Garis 3) */}
      <BottomNav
        onOpenMenu={() => setIsBottomMenuOpen(true)}
        isMenuOpen={isBottomMenuOpen}
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        wishlistCount={wishlistItems.length}
      />

      {/* 5. Core Feature #2: Bottom Sheet Menu Drawer */}
      <BottomMenuDrawer
        isOpen={isBottomMenuOpen}
        onClose={() => setIsBottomMenuOpen(false)}
        selectedCollection={selectedCollection}
        onSelectCollection={handleSelectCollection}
        onNavigateWishlist={() => {
          setCurrentView('wishlist');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCart={() => {
          // Handled via CartContext in CartDrawer
        }}
        onNavigateAccount={() => {
          setCurrentView('account');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        wishlistCount={wishlistItems.length}
      />

      {/* 6. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        isOpen={!!selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        isWishlisted={selectedProductDetail ? wishlistIds.has(selectedProductDetail.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 7. Slide-Out Cart Drawer */}
      <CartDrawer
        onProceedCheckout={() => {
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 8. Authentication & Forgot Password Modal */}
      <AuthModal />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <MainApp />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
