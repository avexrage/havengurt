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
            icon: <Icons.Bone />,
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
            icon: <Icons.ShieldPlus />,
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
            icon: <Icons.Scale />,
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
                    <h2 className="text-4xl font-bold text-brand-black mb-4">{t('quality.title')} <span className="text-brand-blue">{t('quality.titleHighlight')}</span></h2>
                    <p className="text-brand-text max-w-xl mx-auto">{t('quality.description')}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {labData.map((item, i) => (
                        <motion.div key={i} whileHover={{ y: -8 }} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft flex flex-col">
                            <div className="flex items-center gap-3 mb-4"><div className={`p-2 rounded-lg ${i === 0 ? 'bg-blue-50 text-brand-blue' : i === 1 ? 'bg-yellow-50 text-yellow-500' : 'bg-pink-50 text-pink-500'}`}>{item.icon}</div><h3 className="font-bold text-xl text-brand-black">{item.name}</h3></div>
                            <p className="text-sm text-brand-text mb-6">{item.description}</p>
                            <div className="space-y-5 mt-auto">{item.stats.map((stat, j) => (<div key={j}><div className="flex justify-between text-xs font-bold mb-1.5"><span className="text-gray-500">{stat.label}</span><span className="text-brand-black">{stat.value}</span></div><div className="h-2.5 w-full bg-gray-50 rounded-full"><div className={`h-full rounded-full ${stat.color}`} style={{ width: `${stat.percent}%` }}></div></div></div>))}</div>
                        </motion.div>
                    ))}
                </div>
                <div className="text-center"><a href="#" className="inline-flex items-center gap-2 text-brand-blue font-bold text-sm hover:text-brand-darkBlue"><Icons.FileText /> {t('quality.report')}</a></div>
            </div>
        </section>
    );
};
