import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import drinkImg from '../assets/images/drinks.png';
import scoopImg from '../assets/images/cups.png';
import iceImg from '../assets/images/lolly.png';

export const ProductSection = ({ onCategorySelect }) => {
    const { t } = useLanguage();

    const categories = [
        {
            id: 'drink',
            title: t('products.drinkYogurt'),
            img: drinkImg,
            color: 'bg-[#115AA6]'
        },
        {
            id: 'scoop',
            title: t('products.scoopYogurt'),
            img: scoopImg,
            color: 'bg-[#115AA6]'
        },
        {
            id: 'ice',
            title: t('products.iceLolly'),
            img: iceImg,
            color: 'bg-[#115AA6]'
        }
    ];

    return (
        <section id="products" className="py-24 bg-white">
            <div className="container mx-auto px-6 mb-12 text-center">
                <h2 className="text-4xl font-bold text-brand-black mb-4">{t('products.title')} <span className="text-brand-blue">{t('products.titleHighlight')}</span></h2>
                <p className="text-brand-text text-lg max-w-2xl mx-auto">{t('products.description')}</p>
            </div>

            <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 h-[600px]">
                {categories.map((cat) => (
                    <motion.div
                        key={cat.id}
                        whileHover={{ scale: 1.02, zIndex: 10 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => onCategorySelect(cat.id)}
                        className="group relative h-full rounded-3xl overflow-hidden cursor-pointer shadow-lg"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                        </div>

                        {/* Label Card */}
                        <div className="absolute bottom-6 right-6">
                            <div className="bg-[#115AA6] p-4 rounded-xl text-white text-center transition-all duration-300 group-hover:bg-white/20 group-hover:backdrop-blur-md group-hover:border group-hover:border-white/30 shadow-lg">
                                <h3 className="font-bold text-lg mb-0.5">{cat.title}</h3>
                                <p className="font-bold text-xs text-white/90 group-hover:text-white">{t('products.seeMore')}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
