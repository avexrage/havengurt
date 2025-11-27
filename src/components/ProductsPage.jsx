import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '../data/products';
import { useLanguage } from '../context/LanguageContext';
import { Icons } from './Icons';

export const ProductsPage = ({ cart, onAdd, onBack, initialCategory = 'all' }) => {
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [displayedProducts, setDisplayedProducts] = useState(8);
    const { t } = useLanguage();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (initialCategory) setActiveCategory(initialCategory);
    }, [initialCategory]);

    const filteredProducts = activeCategory === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);
    const visibleProducts = filteredProducts.slice(0, displayedProducts);
    const hasMore = filteredProducts.length > displayedProducts;

    const getCategoryLabel = (cat) => {
        switch (cat) {
            case 'all': return t('products.categories.all');
            case 'drink': return t('products.categories.drink');
            case 'scoop': return t('products.categories.scoop');
            case 'ice': return t('products.categories.ice');
            default: return cat;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-20 bg-white min-h-screen"
        >
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-brand-black mb-4">{t('products.title')} <span className="text-brand-blue">{t('products.titleHighlight')}</span></h2>
                    <div className="flex justify-center gap-2 mt-8 relative flex-wrap">
                        {['all', 'drink', 'scoop', 'ice'].map(cat => (
                            <div key={cat} className="relative">
                                <button onClick={() => { setActiveCategory(cat); setDisplayedProducts(8); }} className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors relative z-10 ${activeCategory === cat ? 'text-white' : 'text-gray-500 hover:text-brand-blue'}`}>{getCategoryLabel(cat)}</button>
                                {activeCategory === cat && <motion.div layoutId="activeTab" className="absolute inset-0 bg-brand-blue rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {visibleProducts.map(product => {
                                const qty = cart.find(item => item.id === product.id)?.quantity || 0;
                                return (
                                    <div key={product.id} className="group bg-white rounded-3xl shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col hover:-translate-y-2">
                                        <div className="h-64 relative flex items-center justify-center p-6 transition-colors duration-500" style={{ backgroundColor: product.bgColor }}>
                                            <img src={product.img} alt={product.name} className="h-full w-auto object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
                                            {product.badge && (
                                                <div className="absolute top-4 left-4 bg-[#7ED957] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                                    {product.badge}
                                                </div>
                                            )}
                                            {qty > 0 && <div className="absolute top-4 right-4 bg-brand-black text-white text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full shadow-lg">{qty}</div>}
                                        </div>
                                        <div className="p-6 flex-grow flex flex-col">
                                            <h3 className="font-bold text-lg text-brand-black mb-1">{product.name}</h3>
                                            <p className="text-sm text-brand-text mb-4">{product.desc}</p>
                                            <div className="mt-auto">
                                                {qty === 0 ? (
                                                    <button onClick={(e) => onAdd(product, 1, e)} className="w-full py-3 rounded-xl font-bold text-sm shadow-md bg-[#115AA6] text-white hover:brightness-110 transition-transform active:scale-95"><span>+</span> {t('products.addToPreOrder')}</button>
                                                ) : (
                                                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1 border border-gray-100">
                                                        <button onClick={() => onAdd(product, -1)} className="w-10 h-10 rounded-lg font-bold text-lg hover:bg-white text-brand-black active:scale-90">-</button>
                                                        <span className="font-bold text-brand-black">{qty}</span>
                                                        <button onClick={() => onAdd(product, 1)} className="w-10 h-10 rounded-lg font-bold text-lg hover:bg-white text-brand-black active:scale-90">+</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <AnimatePresence>
                    {hasMore && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="mt-12 text-center"
                        >
                            <button onClick={() => setDisplayedProducts(prev => prev + 8)} className="px-8 py-3 border border-brand-blue text-brand-blue rounded-full font-semibold hover:bg-brand-lightBlue transition-colors">{t('products.showMore')}</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Back Button */}
                <div className="text-center mt-16">
                    <button onClick={onBack} className="group flex items-center gap-2 mx-auto bg-brand-blue text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-brand-blue/30 hover:scale-105 transition-all">
                        <Icons.ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        {t('about.back')}
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
