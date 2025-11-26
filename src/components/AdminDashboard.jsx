import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { format } from 'date-fns';
import { Icons } from './Icons';

export const AdminDashboard = ({ onBack }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const data = await db.getOrders();
            setOrders(data);
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        await db.updateOrderStatus(id, newStatus);
        const data = await db.getOrders();
        setOrders(data);
    };

    const handleClearData = () => {
        if (window.confirm('Are you sure you want to delete ALL orders? This cannot be undone.')) {
            db.clearOrders();
            setOrders([]);
        }
    };

    const calculateTotalRevenue = () => {
        return orders.reduce((acc, order) => acc + (order.payment?.total || 0), 0);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-blue">Admin Dashboard</h1>
                        <p className="text-gray-500">Manage your orders and sales</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onBack} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                            Back to Site
                        </button>
                        <button onClick={handleClearData} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2">
                            <Icons.Trash size={16} /> Clear Data
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Orders</h3>
                        <p className="text-4xl font-bold text-brand-black">{orders.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Revenue</h3>
                        <p className="text-4xl font-bold text-green-600">Rp {calculateTotalRevenue().toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Pending Delivery</h3>
                        <p className="text-4xl font-bold text-blue-500">{orders.filter(o => o.status !== 'Delivered').length}</p>
                    </div>
                </div>

                {/* Orders Table */}
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
                                                {format(new Date(order.createdAt), 'dd MMM HH:mm')}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-brand-black">{order.payment?.senderName || 'Guest'}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-[200px]" title={order.customer?.addressDetail}>
                                                    {order.customer?.addressDetail || 'No address details'}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {order.customer?.distance?.toFixed(2)} km
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <ul className="list-disc list-inside text-gray-600">
                                                    {order.items.map((item, idx) => (
                                                        <li key={idx}>
                                                            {item.quantity}x {item.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-brand-blue">
                                                    {format(new Date(order.deliveryDate), 'EEE, dd MMM')}
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
            </div>
        </div>
    );
};
