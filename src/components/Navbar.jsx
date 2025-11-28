import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';
import { Logo } from './ui/Logo';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = ({ cartCount, onOpenCart, onNavigate, currentView, animateCart, user, onLoginClick, onProfileClick }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { language, toggleLanguage, t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (target) => {
        onNavigate(target);
        setMobileMenuOpen(false);
    };

    const handleProductClick = () => {
        onNavigate('products');
        setMobileMenuOpen(false);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Logo onClick={() => handleNavClick('home')} />

                <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-brand-text">
                    <button onClick={() => handleNavClick('home')} className={`${currentView === 'home' ? 'text-brand-blue' : 'hover:text-brand-blue'} transition-colors`}>{t('nav.home')}</button>
                    <button onClick={() => handleNavClick('about')} className={`${currentView === 'about' ? 'text-brand-blue' : 'hover:text-brand-blue'} transition-colors`}>{t('nav.about')}</button>
                    <button onClick={handleProductClick} className={`${currentView === 'products' ? 'text-brand-blue' : 'hover:text-brand-blue'} transition-colors`}>{t('nav.products')}</button>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 text-sm font-bold">
                        <button onClick={() => toggleLanguage('en')} className={`${language === 'en' ? 'text-brand-blue' : 'text-gray-400 hover:text-brand-blue'} transition-colors`}>EN</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => toggleLanguage('id')} className={`${language === 'id' ? 'text-brand-blue' : 'text-gray-400 hover:text-brand-blue'} transition-colors`}>ID</button>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleProductClick}
                        className="btn-blue text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all hidden md:block"
                    >
                        {t('nav.shop')}
                    </motion.button>

                    {user ? (
                        <button onClick={onProfileClick} className="hidden md:block w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200 hover:border-brand-blue transition-colors">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-brand-blue font-bold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </button>
                    ) : (
                        <button onClick={onLoginClick} className="hidden md:block text-sm font-bold text-brand-blue hover:text-brand-darkBlue transition-colors">
                            Login
                        </button>
                    )}
                    <AnimatePresence>
                        {cartCount > 0 && (
                            <motion.button
                                initial={{ scale: 0, opacity: 0 }}
                                animate={animateCart ? { scale: [1, 1.5, 1], rotate: [0, 10, -10, 0] } : { scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                onClick={onOpenCart}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="relative p-2 text-brand-black hover:bg-brand-lightBlue rounded-full transition-colors"
                            >
                                <Icons.ShoppingBag />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-blue text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                    {cartCount}
                                </span>
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <button className="md:hidden text-brand-black" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <Icons.Menu />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {
                mobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-lg p-4 flex flex-col gap-4 md:hidden">
                        <button onClick={() => handleNavClick('home')} className="text-left font-semibold text-brand-text">{t('nav.home')}</button>
                        <button onClick={() => handleNavClick('about')} className="text-left font-semibold text-brand-text">{t('nav.about')}</button>
                        <button onClick={handleProductClick} className="text-left font-semibold text-brand-text">{t('nav.products')}</button>
                        {user ? (
                            <button onClick={() => { onProfileClick(); setMobileMenuOpen(false); }} className="text-left font-semibold text-brand-blue">My Profile</button>
                        ) : (
                            <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className="text-left font-semibold text-brand-blue">Login / Sign Up</button>
                        )}
                    </div>
                )
            }
        </motion.nav >
    );
};
