import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from './Icons';
import { useLanguage } from '../context/LanguageContext';

import havenImg from '../assets/images/haven.jpg';

// TODO: Replace with actual djawa.jpg when available
const djawaImg = havenImg;

const partnerImages = {
    djawa: djawaImg
};

export const PartnersSection = () => {
    const { t } = useLanguage();
    const partners = t('partners.items');

    return (
        <section id="partners" className="py-24 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-brand-black mb-4">{t('partners.title')} <span className="text-brand-blue">{t('partners.titleHighlight')}</span></h2>
                <p className="text-brand-text text-lg mb-12 max-w-2xl mx-auto">{t('partners.description')}</p>
                <div className="grid md:grid-cols-3 gap-8">
                    {partners.map((partner, i) => {
                        const image = partnerImages[partner.id];
                        const Card = partner.link ? motion.a : motion.div;

                        return (
                            <Card
                                key={i}
                                href={partner.link}
                                target={partner.link ? "_blank" : undefined}
                                rel={partner.link ? "noopener noreferrer" : undefined}
                                whileHover={{ y: -10 }}
                                className={`rounded-3xl p-10 text-center shadow-card hover:shadow-lg transition-all border border-gray-100 flex flex-col items-center relative overflow-hidden group ${image ? 'bg-gray-900' : 'bg-white'}`}
                            >
                                {image && (
                                    <div className="absolute inset-0 z-0">
                                        <img src={image} alt={partner.name} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                    </div>
                                )}

                                <div className="relative z-10 w-full flex flex-col items-center">
                                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl mb-6 ${image ? 'bg-white/20 text-white backdrop-blur-sm' : 'bg-brand-lightBlue text-brand-blue'}`}>
                                        <Icons.Store />
                                    </div>
                                    <h3 className={`text-xl font-bold mb-2 ${image ? 'text-white' : 'text-brand-black'}`}>{partner.name}</h3>
                                    <div className={`flex items-center gap-2 text-sm mb-4 justify-center ${image ? 'text-gray-200' : 'text-gray-400'}`}>
                                        <Icons.MapPin /> {partner.loc}
                                    </div>
                                    <span className={`font-medium text-sm ${image ? 'text-brand-lightBlue' : 'text-brand-blue'}`}>
                                        {partner.type}
                                    </span>
                                </div>
                            </Card>
                        );
                    })}
                </div>
                <div className="mt-16 text-center">
                    <motion.div
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(17, 90, 166, 0.1), 0 10px 10px -5px rgba(17, 90, 166, 0.04)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                        className="bg-white inline-block px-10 py-8 rounded-3xl shadow-soft border border-blue-50 cursor-pointer"
                    >
                        <h4 className="font-bold text-brand-blue text-lg mb-1">{t('partners.notFound.title')}</h4>
                        <p className="text-brand-text">{t('partners.notFound.description')}</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
