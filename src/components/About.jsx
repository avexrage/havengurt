import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from './Icons';
import sma2 from '../assets/images/sma2.jpg';
import haven from '../assets/images/haven.jpg';
import { useLanguage } from '../context/LanguageContext';

const iconMap = {
    1: "Trophy",
    2: "FlaskConical",
    3: "RefreshCcw",
    4: "Gamepad2"
};

export const About = ({ onBack }) => {
    const { t } = useLanguage();
    const historyData = t('about.history');

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="pt-32 pb-20 bg-white min-h-screen"
        >
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="relative h-[500px] rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
                    <img src={sma2} className="w-full h-full object-cover" alt="About Havengurt" />
                    <div className="absolute inset-0 bg-brand-blue/40 mix-blend-multiply"></div>
                    <div className="absolute bottom-10 left-10 text-white max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-5xl font-extrabold mb-4">{t('about.headerTitle')}</h1>
                            <p className="text-xl opacity-90 font-medium">{t('about.headerSubtitle')}</p>
                        </motion.div>
                    </div>
                </div>

                {/* Narrative Timeline */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-center text-brand-black mb-16">{t('about.journey')}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {Object.keys(historyData).map((key, index) => {
                            const item = historyData[key];
                            const IconComponent = Icons[iconMap[key]];
                            // Hardcoded years for now as they were in the original data
                            const years = { 1: "2021", 2: "2021", 3: "2025", 4: "2025" };

                            return (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                        {IconComponent && <IconComponent size={100} />}
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-brand-lightBlue flex items-center justify-center text-brand-blue">
                                            {IconComponent && <IconComponent />}
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-brand-blue bg-blue-50 px-3 py-1 rounded-full">{years[key]}</span>
                                            <h3 className="text-xl font-bold text-brand-black mt-1">{item.title}</h3>
                                        </div>
                                    </div>

                                    <p className="text-brand-text leading-relaxed mb-4">{item.description}</p>

                                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
                                        <Icons.Award size={16} />
                                        <span>{item.highlight}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Philosophy Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16 bg-brand-blue rounded-[3rem] p-12 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                        <svg width="100%" height="100%">
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6 text-brand-blue">
                            <Icons.Gamepad2 size={24} />
                            <span className="font-bold tracking-widest uppercase">{t('about.philosophy.label')}</span>
                        </div>
                        <h2 className="text-5xl font-bold mb-6">{t('about.philosophy.title')}</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            {t('about.philosophy.description')}
                        </p>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                                <span className="block text-2xl font-bold text-brand-white">100%</span>
                                <span className="text-xs text-white-400">{t('about.philosophy.natural')}</span>
                            </div>
                            <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                                <span className="block text-2xl font-bold text-brand-white">0%</span>
                                <span className="text-xs text-white-400">{t('about.philosophy.chemicals')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 h-80 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <img src={haven} className="w-full h-full object-cover" alt="Coding/Gaming Vibe" />
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-transparent to-transparent"></div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="text-center">
                    <button onClick={onBack} className="group flex items-center gap-2 mx-auto bg-brand-blue text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-brand-blue/30 hover:scale-105 transition-all">
                        <Icons.ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        {t('about.back')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
