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
import { UserProfile } from './components/profile/UserProfile';

const AppContent = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [view, setView] = useState('home'); // 'home', 'about', 'products', 'admin', 'profile'
  const [productCategory, setProductCategory] = useState('all');
  const { user } = useAuth();

  const [animateCart, setAnimateCart] = useState(false);

  const triggerCartAnimation = () => {
    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 500);
  };

  const addToCart = (product, change, e) => {
    if (e) e.stopPropagation();
    if (change > 0) triggerCartAnimation();

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
    <div className="font-sans text-brand-black antialiased selection:bg-brand-blue selection:text-white">
      <Navbar
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        currentView={view}
        animateCart={animateCart}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
      />

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
          triggerCartAnimation={triggerCartAnimation}
        />
      )}

      {view === 'admin' && (
        <AdminDashboard onBack={() => setView('home')} />
      )}

      {view === 'profile' && (
        <UserProfile onBack={() => setView('home')} />
      )}

      <Footer onNavigate={handleNavigate} onAdminClick={() => {
        setView('admin');
        window.scrollTo(0, 0);
      }} />

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
        onLoginSuccess={() => {
          // Optional: Show success toast or redirect
        }}
      />
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
