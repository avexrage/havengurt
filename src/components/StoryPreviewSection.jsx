import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import bgstory from '../assets/images/bgstory.png';

export const StoryPreviewSection = ({ onNavigate }) => {
    const { t } = useLanguage();
    return (
        <section
            id="about-preview"
            className="py-24 border-t border-blue-50 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${bgstory})` }}
        >
            <div className="absolute inset-0 bg-white/60"></div>
            <div className="container mx-auto px-6 text-center relative z-10">
                <h2 className="text-3xl font-bold text-brand-black mb-6">{t('storyPreview.title')} <span className="text-brand-blue">{t('storyPreview.titleHighlight')}</span></h2>
                <p className="text-brand-text max-w-2xl mx-auto mb-8">{t('storyPreview.description')}</p>
                <button onClick={() => onNavigate('about')} className="bg-white text-brand-blue border border-brand-lightBlue px-8 py-4 rounded-xl font-bold text-base transition-all hover:bg-white/80 shadow-sm">{t('storyPreview.button')}</button>
            </div>
        </section>
    );
};
