import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export const QualitySection = () => {
    const { t } = useLanguage();

    const labData = [
        {
            name: t('quality.items.original.name'),
            badge: t('quality.items.original.badge'),
            icon: <Icons.Bone size={24} />,
            colorClass: "bg-blue-50 text-brand-blue",
            badgeClass: "bg-blue-50 text-brand-blue border-blue-100",
            description: t('quality.items.original.description'),
            stats: [
                { label: t('quality.stats.calcium'), value: "119.4", unit: "mg", percent: 80, color: "bg-brand-blue" },
                { label: t('quality.stats.protein'), value: "1.68", unit: "%", percent: 60, color: "bg-blue-400" },
                { label: t('quality.stats.lowSugar'), value: "7.76", unit: "%", percent: 30, color: "bg-slate-400" }
            ]
        },
        {
            name: t('quality.items.carica.name'),
            badge: t('quality.items.carica.badge'),
            icon: <Icons.ShieldPlus size={24} />,
            colorClass: "bg-yellow-50 text-yellow-500",
            badgeClass: "bg-yellow-50 text-yellow-600 border-yellow-100",
            description: t('quality.items.carica.description'),
            stats: [
                { label: t('quality.stats.vitaminC'), value: "26.0", unit: "mg", percent: 85, color: "bg-yellow-400" },
                { label: t('quality.stats.energy'), value: "86.5", unit: "kcal", percent: 70, color: "bg-orange-400" },
                { label: t('quality.stats.carbs'), value: "18.1", unit: "%", percent: 65, color: "bg-slate-400" }
            ]
        },
        {
            name: t('quality.items.naga.name'),
            badge: t('quality.items.naga.badge'),
            icon: <Icons.Scale size={24} />,
            colorClass: "bg-pink-50 text-pink-500",
            badgeClass: "bg-pink-50 text-pink-600 border-pink-100",
            description: t('quality.items.naga.description'),
            stats: [
                { label: t('quality.stats.calories'), value: "79.8", unit: "kcal", percent: 40, color: "bg-pink-500" },
                { label: t('quality.stats.totalFat'), value: "1.08", unit: "%", percent: 20, color: "bg-rose-400" },
                { label: t('quality.stats.calcium'), value: "75.4", unit: "mg", percent: 50, color: "bg-brand-blue" }
            ]
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-lightBlue rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-lightBlue/30 rounded-full text-brand-blue font-bold text-sm mb-6">
                        <Icons.Microscope size={18} />
                        {t('quality.badge')}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-4">
                        {t('quality.title')} <span className="text-brand-blue">{t('quality.titleHighlight')}</span>
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
                        {t('quality.description')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {labData.map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -8 }}
                            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.colorClass}`}>
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-xl text-brand-black">{item.name}</h3>
                            </div>

                            <div className="mb-6">
                                <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${item.badgeClass}`}>
                                    {item.badge}
                                </span>
                            </div>

                            <p className="text-gray-500 text-sm mb-8 leading-relaxed min-h-[40px]">
                                {item.description}
                            </p>

                            <div className="space-y-6 mt-auto">
                                {item.stats.map((stat, j) => (
                                    <div key={j}>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs font-bold text-gray-400">{stat.label}</span>
                                            <div className="text-right">
                                                <span className="font-bold text-brand-black">{stat.value}</span>
                                                <span className="text-[10px] text-gray-400 ml-1">{stat.unit}</span>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${stat.percent}%` }}
                                                transition={{ duration: 1, delay: 0.2 }}
                                                className={`h-full rounded-full ${stat.color}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <a href="#" className="inline-flex items-center gap-2 text-brand-blue font-bold text-sm hover:text-brand-darkBlue transition-colors group">
                        <Icons.FileText size={18} />
                        <span className="group-hover:underline">{t('quality.report')}</span>
                    </a>
                </div>
            </div>
        </section>
    );
};
