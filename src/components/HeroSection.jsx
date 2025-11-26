import React from 'react';
import { motion } from 'framer-motion';
import heroImage from '../assets/images/hero-image.jpg';
import { useLanguage } from '../context/LanguageContext';

export const HeroSection = ({ onNavigate }) => {
    const { t } = useLanguage();

    return (
        <div className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-white to-brand-lightBlue">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="z-10">
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-blue-100 shadow-sm mb-6">
                        <span className="text-brand-blue text-xl">✨</span>
                        <span className="text-sm font-semibold text-brand-black">{t('hero.badge')}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-brand-black leading-[1.1] mb-6">{t('hero.title')} <br /> {t('hero.title2')} <br /> <span className="text-brand-blue">{t('hero.title3')}</span></h1>
                    <p className="text-lg text-brand-text mb-10 max-w-lg leading-relaxed">{t('hero.description')}</p>
                    <div className="flex gap-4">
                        <button onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })} className="btn-blue text-white px-8 py-4 rounded-xl font-bold text-base shadow-glow transition-all hover:scale-105">{t('hero.preOrder')}</button>
                        <button onClick={() => onNavigate('about')} className="bg-white text-brand-blue border border-brand-lightBlue px-8 py-4 rounded-xl font-bold text-base transition-all hover:bg-brand-lightBlue">{t('hero.aboutUs')}</button>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl animate-float">
                    <img src={heroImage} alt="Fresh Yogurt Bowl" className="w-full h-full object-cover object-center scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </motion.div>
            </div>
        </div>
    );
};
