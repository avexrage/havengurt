import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';
import { DeliveryMap } from './checkout/DeliveryMap';
import { OrderScheduler } from './checkout/OrderScheduler';
import { PaymentQRIS } from './checkout/PaymentQRIS';
import { useLanguage } from '../context/LanguageContext';
import { format } from 'date-fns';

import { db } from '../services/db';
import { useAuth } from '../context/AuthContext';

const STEPS = {
    MAP: 0,
    SCHEDULE: 1,
    PAYMENT: 2,
    SUCCESS: 3
};

export const CheckoutModal = ({ isOpen, onClose, cart, onClearCart }) => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [step, setStep] = useState(STEPS.MAP);
    const [deliveryInfo, setDeliveryInfo] = useState(null); // { valid, distance, fee, addressDetail }
    const [selectedDate, setSelectedDate] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentData, setPaymentData] = useState({ senderName: user ? user.name : '', proofFile: null });

    // Update sender name if user logs in while modal is open (edge case)
    useEffect(() => {
        if (user && !paymentData.senderName) {
            setPaymentData(prev => ({ ...prev, senderName: user.name }));
        }
    }, [user]);

    if (!isOpen) return null;

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = deliveryInfo?.fee || 0;
    const total = subtotal + deliveryFee;

    const handleNext = () => {
        if (step === STEPS.MAP && deliveryInfo?.valid) {
            setStep(STEPS.SCHEDULE);
        } else if (step === STEPS.SCHEDULE && selectedDate) {
            setStep(STEPS.PAYMENT);
        }
    };

    const handlePaymentComplete = async () => {
        setIsProcessing(true);

        try {
            // Save to Database
            const orderData = {
                userId: user ? user.id : null, // Link to user if logged in
                customer: {
                    addressDetail: deliveryInfo.addressDetail,
                    distance: deliveryInfo.distance,
                    coordinates: deliveryInfo.coordinates // Assuming DeliveryMap passes this if needed, or just rely on distance
                },
                items: cart,
                payment: {
                    total: total,
                    method: 'QRIS',
                    senderName: paymentData.senderName,
                    // proofImage: paymentData.proofFile // In a real app, upload this first
                },
                deliveryDate: selectedDate.toISOString()
            };

            await db.saveOrder(orderData);

            setTimeout(() => {
                setIsProcessing(false);
                setStep(STEPS.SUCCESS);
            }, 1500);
        } catch (error) {
            console.error("Failed to save order:", error);
            alert("Failed to place order. Please try again.");
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        if (step === STEPS.SUCCESS) {
            onClearCart();
            setStep(STEPS.MAP);
            setDeliveryInfo(null);
            setSelectedDate(null);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm" onClick={handleClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                    <div>
                        <h2 className="font-bold text-2xl text-brand-blue">Checkout</h2>
                        <p className="text-sm text-gray-400">Step {step + 1} of 3</p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Icons.X /></button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    {step === STEPS.MAP && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">Select Delivery Location</h3>
                            <p className="text-sm text-gray-500 mb-4">Click on the map to pin your location. Green zone is free delivery!</p>
                            <DeliveryMap onLocationSelect={setDeliveryInfo} />
                        </div>
                    )}

                    {step === STEPS.SCHEDULE && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">Schedule Delivery</h3>
                            <OrderScheduler selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                        </div>
                    )}

                    {step === STEPS.PAYMENT && (
                        <div className="flex flex-col items-center">
                            <h3 className="font-bold text-lg mb-6">Payment</h3>
                            <PaymentQRIS
                                total={total}
                                onPaymentComplete={handlePaymentComplete}
                                onDataChange={setPaymentData}
                                paymentData={paymentData}
                            />
                        </div>
                    )}

                    {step === STEPS.SUCCESS && (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Icons.CheckCircle size={40} />
                            </div>
                            <h3 className="font-bold text-2xl text-brand-black mb-2">Order Confirmed!</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-8">
                                Thank you for your order. We have received your payment and will deliver your Havengurt on <b>{format(selectedDate, 'EEEE, d MMMM yyyy')}</b>.
                            </p>
                            <button onClick={handleClose} className="btn-blue text-white px-8 py-3 rounded-xl font-bold shadow-lg">Back to Home</button>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {step !== STEPS.SUCCESS && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                        <div className="text-sm">
                            <span className="text-gray-500">Total:</span>
                            <span className="font-bold text-lg text-brand-blue ml-2">Rp {total.toLocaleString()}</span>
                        </div>

                        <div className="flex gap-3">
                            {step > STEPS.MAP && (
                                <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors">Back</button>
                            )}

                            {step === STEPS.MAP && (
                                <button
                                    onClick={handleNext}
                                    disabled={!deliveryInfo?.valid}
                                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${!deliveryInfo?.valid ? 'bg-gray-300 cursor-not-allowed' : 'btn-blue hover:shadow-xl'}`}
                                >
                                    Next: Schedule
                                </button>
                            )}

                            {step === STEPS.SCHEDULE && (
                                <button
                                    onClick={handleNext}
                                    disabled={!selectedDate}
                                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${!selectedDate ? 'bg-gray-300 cursor-not-allowed' : 'btn-blue hover:shadow-xl'}`}
                                >
                                    Next: Payment
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Loading Overlay */}
                {isProcessing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="text-center">
                            <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="font-bold text-brand-blue">Processing Payment...</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
