import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { QualitySection } from './components/QualitySection';
import { ProductSection } from './components/ProductSection';
import { StoryPreviewSection } from './components/StoryPreviewSection';
import { PartnersSection } from './components/PartnersSection';
import { Footer } from './components/Footer';
import { CartModal } from './components/CartModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';
import { About } from './components/About';
import { ProductsPage } from './components/ProductsPage';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginModal } from './components/auth/LoginModal';
import { ProfileModal } from './components/profile/ProfileModal';

const AppContent = () => {
  // ... existing state ...
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [view, setView] = useState('home'); // 'home', 'about', 'products', 'admin'
  const [productCategory, setProductCategory] = useState('all');
  const { user } = useAuth();

  const [flyingParticles, setFlyingParticles] = useState([]);

  useEffect(() => {
    if (window.location.search.includes('admin=true')) {
      setView('admin');
    }
  }, []);

  const addToCart = (product, change, e) => {
    if (e) {
      e.stopPropagation();
      // Trigger flying animation only when adding (change > 0)
      if (change > 0) {
        const rect = e.target.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        // Cart icon position (approximate, or we could use a ref if we passed it down)
        // Assuming cart is top-right. We'll target a fixed position or try to get element.
        const cartBtn = document.getElementById('cart-btn');
        let endX = window.innerWidth - 50; // Fallback
        let endY = 40; // Fallback

        if (cartBtn) {
          const cartRect = cartBtn.getBoundingClientRect();
          endX = cartRect.left + cartRect.width / 2;
          endY = cartRect.top + cartRect.height / 2;
        }

        const id = Date.now();
        setFlyingParticles(prev => [...prev, { id, startX, startY, endX, endY }]);

        // Remove particle after animation
        setTimeout(() => {
          setFlyingParticles(prev => prev.filter(p => p.id !== id));
        }, 800);
      }
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQty = existing.quantity + change;
        return newQty <= 0 ? prev.filter(item => item.id !== product.id) : prev.map(item => item.id === product.id ? { ...item, quantity: newQty } : item);
      }
      return change > 0 ? [...prev, { ...product, quantity: change }] : prev;
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const clearCart = () => setCart([]);

  const handleNavigate = (page, category = 'all') => {
    setView(page);
    if (page === 'products') setProductCategory(category);
    window.scrollTo(0, 0);
  };

  return (
    <div className="font-sans text-brand-black antialiased selection:bg-brand-blue selection:text-white relative">
      {/* Flying Particles */}
      {flyingParticles.map(p => (
        <div
          key={p.id}
          className="fixed z-[9999] w-4 h-4 bg-brand-blue rounded-full pointer-events-none shadow-lg"
          style={{
            left: p.startX,
            top: p.startY,
            animation: `flyToCart 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`
          }}
        />
      ))}
      <style>{`
        @keyframes flyToCart {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(calc(${flyingParticles[0]?.endX || 0}px - ${flyingParticles[0]?.startX || 0}px), calc(${flyingParticles[0]?.endY || 0}px - ${flyingParticles[0]?.startY || 0}px)) scale(0.2); opacity: 0; }
        }
      `}</style>

      {view !== 'admin' && (
        <Navbar
          cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
          onNavigate={handleNavigate}
          currentView={view}
          animateCart={false} // Static cart
          user={user}
          onLoginClick={() => setIsLoginOpen(true)}
          onProfileClick={() => setIsProfileOpen(true)}
        />
      )}

      {view === 'home' && (
        <>
          <HeroSection onNavigate={handleNavigate} />
          <QualitySection />
          <ProductSection
            onCategorySelect={(cat) => {
              setProductCategory(cat);
              setView('products');
              window.scrollTo(0, 0);
            }}
            onNavigate={handleNavigate}
          />
          <StoryPreviewSection onNavigate={handleNavigate} />
          <PartnersSection />
        </>
      )}

      {view === 'about' && <About onBack={() => handleNavigate('home')} />}

      {view === 'products' && (
        <ProductsPage
          cart={cart}
          initialCategory={productCategory}
          onBack={() => setView('home')}
          onAdd={addToCart}
        />
      )}

      {view === 'admin' && (
        <AdminDashboard onBack={() => setView('home')} />
      )}

      {view !== 'admin' && (
        <Footer onNavigate={handleNavigate} />
      )}

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={addToCart}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onClearCart={clearCart}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          if (user?.isAdmin || user?.email === 'admin') {
            setView('admin');
            window.scrollTo(0, 0);
          }
        }}
      />

      {isProfileOpen && (
        <ProfileModal onClose={() => setIsProfileOpen(false)} />
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
