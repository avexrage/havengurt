import React from 'react';
import { Icons } from '../Icons';

export const PaymentQRIS = ({ total, onPaymentComplete, onDataChange }) => {
    const handleNameChange = (e) => {
        if (onDataChange) onDataChange(prev => ({ ...prev, senderName: e.target.value }));
    };

    return (
        <div className="space-y-6 text-center">
            <div className="bg-white p-6 rounded-2xl border-2 border-brand-blue shadow-lg inline-block relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-blue"></div>
                <div className="mb-4">
                    <h3 className="font-bold text-2xl text-brand-blue tracking-widest">QRIS</h3>
                    <p className="text-xs text-gray-500">Scan to Pay</p>
                </div>

                {/* Placeholder for QR Code */}
                <div className="w-48 h-48 bg-gray-100 mx-auto rounded-lg flex items-center justify-center mb-4 border border-gray-200">
                    <div className="text-gray-400 text-xs">
                        [QR CODE IMAGE]
                        <br />
                        NMID: ID123456789
                    </div>
                </div>

                <div className="font-mono font-bold text-xl text-brand-black mb-1">
                    Rp {total.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-gray-500">Havengurt Official</p>
            </div>

            <div className="max-w-sm mx-auto text-sm text-gray-600 text-left space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sender Name</label>
                    <input
                        type="text"
                        placeholder="Name on bank account / e-wallet"
                        className="w-full p-3 rounded-xl border border-gray-300 focus:border-brand-blue outline-none"
                        onChange={handleNameChange}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Payment Proof</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                        <Icons.Upload className="mx-auto text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Click to upload screenshot</span>
                    </div>
                </div>

                <button
                    onClick={onPaymentComplete}
                    className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold shadow-lg hover:bg-brand-darkBlue transition-all flex items-center justify-center gap-2 mt-4"
                >
                    <Icons.CheckCircle size={18} />
                    Confirm Payment
                </button>
            </div>
        </div>
    );
};
