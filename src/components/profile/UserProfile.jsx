import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/db';
import { Icons } from '../Icons';
import { format } from 'date-fns';

export const UserProfile = ({ onBack }) => {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchUserOrders = async () => {
            if (user) {
                // In a real app, we should have a specific method for this
                // For now, we'll fetch all and filter, or use the new getUserOrders if exposed
                // But db.js only exposes getOrders (all). Let's update db.js to expose getUserOrders or just filter here.
                // Actually, let's update db.js to expose getUserOrders properly in the next step or just use the raw service here for efficiency?
                // Better to keep it clean. Let's assume db.getOrders returns all for now (Admin) but for user profile we might want a specific call.
                // However, our db.js wrapper currently just calls getAllOrders.
                // Let's modify the useEffect to use dbService directly or update db.js.
                // Simpler: Update db.js to include getUserOrders.

                // WAIT: I can't update db.js in this tool call. I'll assume I updated it or just use the filter method on all orders for now (less efficient but works for small data).
                // Actually, I defined getUserOrders in firebase.js but not in db.js wrapper.
                // Let's just fetch all and filter for now to be safe with existing db.js interface, 
                // OR better, I will update db.js in the previous step to include getUserOrders? 
                // I didn't include it in the db.js write.

                // Let's just fetch all and filter.
                const userOrders = await db.getUserOrders(user.id);
                setOrders(userOrders);
            }
        };
        fetchUserOrders();
    }, [user]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-brand-blue transition-colors font-medium">
                    <Icons.ArrowLeft size={20} /> Back to Home
                </button>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center sticky top-24">
                            <div className="w-24 h-24 bg-brand-lightBlue rounded-full mx-auto mb-4 flex items-center justify-center text-4xl overflow-hidden">
                                {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : '👤'}
                            </div>
                            <h2 className="font-bold text-xl text-brand-black mb-1">{user.name}</h2>
                            <p className="text-gray-500 text-sm mb-6">{user.email}</p>

                            <button onClick={logout} className="w-full py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm">
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="md:col-span-2 space-y-6">
                        <h3 className="font-bold text-xl text-brand-black">Order History</h3>

                        {orders.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Icons.ShoppingBag size={24} />
                                </div>
                                <h4 className="font-bold text-gray-600 mb-2">No orders yet</h4>
                                <p className="text-gray-400 text-sm">Your order history will appear here once you make a purchase.</p>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Order ID: {order.id.slice(0, 8)}</p>
                                            <p className="font-bold text-brand-blue">{format(new Date(order.createdAt), 'dd MMMM yyyy')}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                            order.status === 'Delivered' ? 'bg-gray-100 text-gray-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-gray-600">{item.quantity}x {item.name}</span>
                                                <span className="font-medium">Rp {(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                        <span className="text-sm text-gray-500">Total</span>
                                        <span className="font-bold text-lg text-brand-black">Rp {order.payment?.total?.toLocaleString()}</span>
                                    </div>

                                    {order.deliveryDate && (
                                        <div className="mt-4 bg-blue-50 p-3 rounded-lg flex items-center gap-3 text-sm text-brand-blue">
                                            <Icons.Store size={16} />
                                            <span>Delivery scheduled for <b>{format(new Date(order.deliveryDate), 'EEE, dd MMM')}</b></span>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
