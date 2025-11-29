import React from 'react';
import { Icons } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export const Footer = ({ onAdminClick }) => {
    const { t } = useLanguage();

    return (
        <footer className="bg-gradient-to-br from-brand-blue to-brand-darkBlue text-white pt-20 pb-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient opacity-10 pointer-events-none"></div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-3 gap-12 mb-16">
                    <div>
                        <div className="font-logo text-2xl font-bold tracking-tight uppercase flex items-center mb-4">
                            <span className="text-white">HAVENGURT</span>
                        </div>
                        <p className="text-blue-100 text-sm leading-relaxed max-w-xs">
                            {t('footer.description')}
                        </p>
                    </div>

                    <div className="md:text-center">
                        <h4 className="font-bold text-white mb-6">{t('footer.quickLinks')}</h4>
                        <ul className="space-y-4 text-blue-100 text-sm">
                            <li><a href="#products" className="hover:text-white transition-colors">{t('footer.products')}</a></li>
                            <li><a href="#about" className="hover:text-white transition-colors">{t('footer.aboutUs')}</a></li>
                            <li><a href="#partners" className="hover:text-white transition-colors">{t('footer.whereToBuy')}</a></li>
                        </ul>
                    </div>

                    <div className="md:text-center">
                        <h4 className="font-bold text-white mb-6">{t('footer.getInTouch')}</h4>
                        <ul className="space-y-4 text-blue-100 text-sm">
                            <li className="flex items-center gap-3 md:justify-center"><Icons.Mail /> hello@havengurt.com</li>
                            <li className="flex items-center gap-3 md:justify-center"><span>📞</span> +62 851-6105-2901</li>
                        </ul>
                        <div className="flex gap-4 mt-6 md:justify-center">
                            <a href="https://www.instagram.com/haven.gurt/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center hover:bg-white hover:text-brand-blue transition-colors"><Icons.Instagram /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-blue-200">
                    <p>&copy; {new Date().getFullYear()} Havengurt. All rights reserved. <span className="mx-2">|</span> Made with <Icons.Heart className="inline w-4 h-4 text-white mx-1" /> in Indonesia</p>

                </div>
            </div>
        </footer>
    );
};
