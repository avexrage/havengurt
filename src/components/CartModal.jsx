import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export const CartModal = ({ isOpen, onClose, cart, onUpdateQty, onRemoveItem, onClearCart, onCheckout }) => {
    const { t } = useLanguage();

    if (!isOpen) return null;
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const handleCheckout = () => {
        let message = `${t('cart.whatsappMessage')}%0A`;
        cart.forEach(item => message += `- ${item.name} (${item.quantity}x): Rp ${(item.price * item.quantity).toLocaleString('id-ID')}%0A`);
        message += `%0ATotal: Rp ${total.toLocaleString('id-ID')}`;
        window.open(`https://wa.me/6285161052901?text=${message}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                    <h2 className="font-bold text-2xl text-brand-blue">{t('cart.title')}</h2>
                    <div className="flex items-center gap-3">
                        {cart.length > 0 && (<button onClick={onClearCart} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors uppercase tracking-wide">{t('cart.clearAll')}</button>)}
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Icons.X /></button>
                    </div>
                </div>
                {cart.length === 0 ? (
                    <div className="text-center py-12"><p className="text-gray-400 font-medium">{t('cart.empty')}</p></div>
                ) : (
                    <div className="space-y-4 overflow-y-auto pr-2 flex-grow custom-scrollbar">
                        {cart.map((item, i) => (
                            <div key={i} className="flex gap-4 items-start bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0"><img src={item.img} className="w-full h-full object-cover" /></div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-gray-900 leading-tight text-sm pr-2">{item.name}</div>
                                        <div className="font-bold text-brand-blue text-sm whitespace-nowrap">{(item.price * item.quantity).toLocaleString()}</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center bg-white rounded-lg border border-gray-200 h-8">
                                            <button onClick={() => onUpdateQty(item, -1)} className="w-8 h-full flex items-center justify-center hover:bg-gray-100 rounded-l-lg transition-colors font-bold text-brand-black">-</button>
                                            <span className="text-xs font-bold w-6 text-center text-gray-900">{item.quantity}</span>
                                            <button onClick={() => onUpdateQty(item, 1)} className="w-8 h-full flex items-center justify-center hover:bg-gray-100 rounded-r-lg transition-colors font-bold text-brand-black">+</button>
                                        </div>
                                        <button onClick={() => onRemoveItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Icons.Trash /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {cart.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
                        <div className="flex justify-between items-center mb-4"><span className="text-gray-500 font-medium">{t('cart.total')}</span><span className="text-xl font-bold text-brand-black">Rp {total.toLocaleString()}</span></div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onCheckout} className="w-full btn-blue text-white py-4 rounded-xl font-bold shadow-lg">{t('cart.checkout')}</motion.button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
