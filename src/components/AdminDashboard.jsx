import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { emailService } from '../services/emailService';
import { format } from 'date-fns';
import { Icons } from './Icons';
import { PRODUCTS } from '../data/products';

export const AdminDashboard = ({ onBack }) => {
    // Dashboard Data State
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const data = await db.getOrders();
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(data);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setError("Failed to load orders. Please check your connection or permissions.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        await db.updateOrderStatus(id, newStatus);

        // Find the order to get customer details
        const order = orders.find(o => o.id === id);
        if (order) {
            await emailService.sendStatusUpdate(id, newStatus, order.customerEmail, order.payment?.senderName || 'Customer');
            alert(`Status updated and email notification sent to ${order.customerEmail || 'customer'}`);
        }

        const data = await db.getOrders();
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(data);
    };

    const calculateTotalRevenue = () => {
        return orders.reduce((acc, order) => acc + (order.payment?.total || 0), 0);
    };

    // Sidebar State
    const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'settings'
    const [adminSettings, setAdminSettings] = useState(null);

    // Fetch settings lazy load
    const loadSettings = async () => {
        const settings = await db.getAdminSettings();
        setAdminSettings(settings);
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            await db.saveAdminSettings(adminSettings);
            alert("Admin settings saved to Database!");
        } catch (err) {
            alert("Failed to save settings: " + err.message);
        }
    };

    const handleClearData = () => {
        if (window.confirm('Are you sure you want to delete ALL orders? This cannot be undone.')) {
            db.clearOrders();
            setOrders([]);
        }
    };

    const handleSeedData = async () => {
        if (window.confirm('This will overwrite product data in the database with the local file data. Continue?')) {
            const imgKeyMap = {
                1: "ori", 2: "carica", 6: "carica", 3: "naga", 9: "naga", 4: "mango", 10: "mango",
                5: "plain", 11: "cup", 7: "ca", 8: "na", 12: "co", 13: "me"
            };

            const productsToSeed = PRODUCTS.map(p => ({
                ...p,
                imgKey: imgKeyMap[p.id] || "ori"
            }));

            await db.seedProducts(productsToSeed);
            alert('Products seeded successfully!');
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-brand-blue text-white shadow-xl flex flex-col z-10">
                <div className="p-6 border-b border-brand-darkBlue">
                    <h1 className="text-2xl font-bold tracking-tight">Havengurt</h1>
                    <p className="text-xs text-blue-200 mt-1">Admin Dashboard</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-white text-brand-blue font-bold shadow-lg' : 'hover:bg-white/10 text-white'}`}
                    >
                        <Icons.User size={20} />
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-white text-brand-blue font-bold shadow-lg' : 'hover:bg-white/10 text-white'}`}
                    >
                        <Icons.Star size={20} />
                        Products
                    </button>
                    <button
                        onClick={() => { setActiveTab('settings'); loadSettings(); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-white text-brand-blue font-bold shadow-lg' : 'hover:bg-white/10 text-white'}`}
                    >
                        <Icons.Settings size={20} /> {/* Assuming Settings icon exists or use generic */}
                        Settings
                    </button>
                </nav>

                <div className="p-4 border-t border-brand-darkBlue">
                    <button onClick={onBack} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-200 hover:text-white transition-colors">
                        <Icons.ArrowLeft size={16} /> Back to Site
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {activeTab === 'orders' && (
                    <div className="max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
                            <div className="text-sm text-gray-500">
                                Total Revenue: <span className="font-bold text-green-600">Rp {calculateTotalRevenue().toLocaleString()}</span>
                            </div>
                        </div>

                        {loading && <div className="text-center py-12">Loading orders...</div>}
                        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">{error}</div>}

                        {!loading && !error && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                <th className="p-4">Date</th>
                                                <th className="p-4">Customer</th>
                                                <th className="p-4">Items</th>
                                                <th className="p-4">Delivery</th>
                                                <th className="p-4">Total</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm">
                                            {orders.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="p-8 text-center text-gray-500 italic">No orders found yet.</td>
                                                </tr>
                                            ) : (
                                                orders.map((order) => (
                                                    <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                                                        <td className="p-4 text-gray-600">
                                                            {order.createdAt ? format(new Date(order.createdAt), 'dd MMM HH:mm') : '-'}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="font-bold text-brand-black">{order.payment?.senderName || 'Guest'}</div>
                                                            <div className="text-xs text-gray-500 truncate max-w-[200px]" title={order.customer?.addressDetail}>
                                                                {order.customer?.addressDetail || 'No address details'}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className="text-xs text-gray-400">
                                                                    {order.customer?.distance?.toFixed(2)} km
                                                                </div>
                                                                {order.customer?.coordinates && (
                                                                    <a
                                                                        href={`https://www.google.com/maps?q=${order.customer.coordinates.lat},${order.customer.coordinates.lng}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-brand-blue hover:text-brand-darkBlue p-1 hover:bg-blue-50 rounded-full transition-colors"
                                                                        title="Open Google Maps"
                                                                    >
                                                                        <Icons.MapPin size={14} />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <ul className="list-disc list-inside text-gray-600">
                                                                {order.items && order.items.map((item, idx) => (
                                                                    <li key={idx}>
                                                                        {item.quantity}x {item.name}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="font-medium text-brand-blue">
                                                                {order.deliveryDate ? format(new Date(order.deliveryDate), 'EEE, dd MMM') : '-'}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 font-bold text-brand-black">
                                                            Rp {order.payment?.total?.toLocaleString()}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${order.status === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' :
                                                                order.status === 'Delivered' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                                                                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                                className="p-1 border border-gray-300 rounded text-xs outline-none focus:border-brand-blue"
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="Paid">Paid</option>
                                                                <option value="Delivered">Delivered</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="max-w-4xl mx-auto text-center py-20 animate-in fade-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <Icons.Star size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Management</h2>
                        <p className="text-gray-500">This feature is coming soon...</p>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Settings</h2>

                        {/* Credentials Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-brand-blue">
                                <Icons.User size={20} /> Credentials
                            </h3>
                            {adminSettings ? (
                                <form onSubmit={handleSaveSettings} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
                                            <input
                                                type="text"
                                                value={adminSettings.username}
                                                onChange={e => setAdminSettings({ ...adminSettings, username: e.target.value })}
                                                className="w-full p-2 border rounded-lg focus:border-brand-blue outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                                            <input
                                                type="text"
                                                value={adminSettings.password}
                                                onChange={e => setAdminSettings({ ...adminSettings, password: e.target.value })}
                                                className="w-full p-2 border rounded-lg focus:border-brand-blue outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Notification Email</label>
                                        <input
                                            type="email"
                                            value={adminSettings.notifiedEmail}
                                            onChange={e => setAdminSettings({ ...adminSettings, notifiedEmail: e.target.value })}
                                            className="w-full p-2 border rounded-lg focus:border-brand-blue outline-none"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Order notifications will be sent here.</p>
                                    </div>
                                    <div className="flex justify-end">
                                        <button type="submit" className="px-6 py-2 bg-brand-blue text-white font-bold rounded-lg hover:bg-brand-darkBlue shadow-md transition-all">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center py-8 text-gray-500">Loading settings...</div>
                            )}
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-600">
                                <Icons.Trash size={20} /> Danger Zone
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                    <div>
                                        <h4 className="font-bold text-gray-800">Clear All Orders</h4>
                                        <p className="text-xs text-gray-500">Permanently delete all order history.</p>
                                    </div>
                                    <button onClick={handleClearData} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-bold text-sm">
                                        Clear Data
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                    <div>
                                        <h4 className="font-bold text-gray-800">Reseed Products</h4>
                                        <p className="text-xs text-gray-500">Reset product database to default catalog.</p>
                                    </div>
                                    <button onClick={handleSeedData} className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-bold text-sm">
                                        Seed Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
