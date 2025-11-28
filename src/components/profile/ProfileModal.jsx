import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/firebase';
import { motion } from 'framer-motion';
import { Icons } from '../Icons';
import { useLanguage } from '../../context/LanguageContext';

export const ProfileModal = ({ onClose }) => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user?.id) {
                try {
                    const userOrders = await dbService.getUserOrders(user.id);
                    setOrders(userOrders);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchOrders();
    }, [user]);

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 overflow-hidden flex flex-col max-h-[85vh]"
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="font-bold text-2xl text-brand-blue">My Profile</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Icons.X />
                    </button>
                </div>

                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                    <div className="w-20 h-20 rounded-full bg-brand-lightBlue flex items-center justify-center text-brand-blue text-2xl font-bold overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-brand-black">{user?.name}</h3>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="ml-auto px-4 py-2 border border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-colors text-sm font-bold flex items-center gap-2"
                    >
                        <Icons.LogOut /> Logout
                    </button>
                </div>

                <h3 className="font-bold text-lg text-brand-black mb-4">Order History</h3>

                {loading ? (
                    <div className="text-center py-8 text-gray-400">Loading history...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No orders found yet.</p>
                    </div>
                ) : (
                    <div className="overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className="text-xs font-bold text-brand-blue bg-brand-lightBlue px-2 py-1 rounded-lg">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className="font-bold text-brand-black">
                                        Rp {order.total?.toLocaleString()}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {order.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm text-gray-600">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};
