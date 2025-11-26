import React from 'react';
import { Icons } from '../Icons';

export const PaymentQRIS = ({ total, onPaymentComplete, onDataChange, paymentData }) => {
    const handleNameChange = (e) => {
        if (onDataChange) onDataChange(prev => ({ ...prev, senderName: e.target.value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && onDataChange) {
            onDataChange(prev => ({ ...prev, proofFile: file }));
        }
    };

    const isValid = paymentData?.senderName?.trim().length > 0 && paymentData?.proofFile;

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
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sender Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        placeholder="Name on bank account / e-wallet"
                        className="w-full p-3 rounded-xl border border-gray-300 focus:border-brand-blue outline-none"
                        value={paymentData?.senderName || ''}
                        onChange={handleNameChange}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Payment Proof <span className="text-red-500">*</span></label>
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative ${paymentData?.proofFile ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        {paymentData?.proofFile ? (
                            <div className="text-green-600 flex flex-col items-center">
                                <Icons.CheckCircle className="mb-1" />
                                <span className="text-xs font-bold truncate max-w-[200px]">{paymentData.proofFile.name}</span>
                                <span className="text-[10px]">Click to change</span>
                            </div>
                        ) : (
                            <>
                                <Icons.Upload className="mx-auto text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500">Click to upload screenshot</span>
                            </>
                        )}
                    </div>
                </div>

                <button
                    onClick={onPaymentComplete}
                    disabled={!isValid}
                    className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 mt-4 ${isValid ? 'bg-brand-blue text-white hover:bg-brand-darkBlue' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                    <Icons.CheckCircle size={18} />
                    Confirm Payment
                </button>
            </div>
        </div>
    );
};
