'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CreditCard, CheckCircle, Smartphone, AlertTriangle, Play } from 'lucide-react';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface CashAppCheckoutProps {
    items: OrderItem[];
    totalPrice: number;
    onPaymentComplete?: () => void;
}

export default function CashAppCheckout({ items, totalPrice, onPaymentComplete }: CashAppCheckoutProps) {
    const [step, setStep] = useState<'shipping' | 'payment' | 'confirmed'>('shipping');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerCashtag: '', // New field for CRO
        shippingAddress: '',
        city: '',
        state: '',
        zip: '',
        phoneNumber: '',
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Validate all fields are present
            const isValid = Object.values(formData).every((val) => val.trim() !== '');
            if (!isValid) {
                throw new Error('Please fill in check all fields, including your $Cashtag.');
            }

            console.log("Sending order to API...", {
                ...formData,
                orderItems: items,
                totalPrice,
                status: 'Pending Payment',
            });

            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                console.warn("CLIENT SIDE TIMEOUT REACHED (60s)");
                controller.abort();
            }, 60000); // Increased to 60s for slow dev starts

            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        orderItems: items,
                        totalPrice,
                        status: 'Pending Payment',
                    }),
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);

                console.log("API Response status:", response.status);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error("API error data:", errorData);
                    throw new Error(errorData.error || 'Failed to create order. Please try again.');
                }

                console.log("Order created successfully, moving to payment step.");
                setStep('payment');
            } catch (fetchErr: any) {
                if (fetchErr.name === 'AbortError') {
                    throw new Error('The request timed out. This often happens on the first order while the server wakes up. Please try again!');
                }
                throw fetchErr;
            }
        } catch (err: any) {
            console.error("Checkout submission error:", err);
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handlePaid = () => {
        setStep('confirmed');
        if (onPaymentComplete) {
            onPaymentComplete();
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-black">
            {/* Header Area - Dynamically changes based on step */}
            <div className={`p-6 text-center transition-colors duration-500 ${step === 'payment' ? 'bg-bright-yellow' : 'bg-electric-blue'}`}>
                <h2 className="text-2xl font-heading flex items-center justify-center gap-2 text-black">
                    {step === 'shipping' && <ShoppingBag className="w-6 h-6" />}
                    {step === 'payment' && <AlertTriangle className="w-6 h-6" />}
                    {step === 'confirmed' && <CheckCircle className="w-6 h-6" />}

                    {step === 'shipping' ? 'Secure Checkout' : step === 'payment' ? 'ACTION REQUIRED' : 'Order Confirmed!'}
                </h2>
                <p className="text-sm mt-1 font-medium font-heading tracking-wide text-black/80">
                    {step === 'shipping' ? 'Enter your shipping & payment details' : step === 'payment' ? 'Complete payment to reserve your order' : 'Thank you for your order!'}
                </p>
            </div>

            <div className="p-8">
                <AnimatePresence mode="wait">
                    {step === 'shipping' && (
                        <motion.form
                            key="shipping-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {error && (
                                <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Personal Info */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Personal Info</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        placeholder="Full Name"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        placeholder="Phone Number"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
                                        required
                                    />
                                </div>

                                {/* CRITICAL: Cash App Tag Field */}
                                <div className="space-y-2 bg-green-50 p-4 rounded-xl border border-green-100">
                                    <label className="text-xs font-bold text-green-700 uppercase tracking-wider ml-1 flex items-center gap-1">
                                        <Smartphone className="w-3 h-3" />
                                        Payment Identity
                                    </label>
                                    <input
                                        type="text"
                                        name="customerCashtag"
                                        placeholder="Your Cash App Name ($Cashtag)"
                                        value={formData.customerCashtag}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all placeholder:text-gray-400 font-medium text-green-800"
                                        required
                                    />
                                    <p className="text-[10px] text-green-600 ml-1">
                                        *Required to match your payment instantly.
                                    </p>
                                </div>

                                {/* Shipping Address */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Shipping Address</label>
                                    <input
                                        type="text"
                                        name="shippingAddress"
                                        placeholder="Street Address"
                                        value={formData.shippingAddress}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
                                        required
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="state"
                                            placeholder="State"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
                                            required
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        name="zip"
                                        placeholder="ZIP Code"
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 mt-6">
                                <div className="flex justify-between items-center mb-6 text-gray-600 font-medium">
                                    <span>Total</span>
                                    <span className="text-2xl font-bold text-pink-600">${totalPrice.toFixed(2)}</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black hover:bg-gray-800 text-white font-heading uppercase tracking-widest text-lg py-4 rounded-xl shadow-lg shadow-gray-400 transform transition hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        'Next Step: Payment'
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    )}

                    {step === 'payment' && (
                        <motion.div
                            key="payment-step"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="text-center space-y-6"
                        >
                            {/* Urgency Banner */}
                            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-left flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-red-800 font-bold text-sm uppercase">Order Reserved for 15:00</p>
                                    <p className="text-red-600 text-xs mt-1">Your order will be cancelled automatically if payment is not received within 15 minutes.</p>
                                </div>
                            </div>

                            <div className="py-2">
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-widest mb-2">Send Exact Amount</p>
                                <p className="text-5xl font-black text-gray-900 tracking-tight">${totalPrice.toFixed(2)}</p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pay to Cashtag</p>
                                <p className="text-3xl font-black text-green-500 select-all cursor-pointer hover:text-green-600 transition-colors">$PattiCakeSlime</p>
                            </div>

                            <div className="space-y-4 pt-2">
                                <a
                                    href="https://cash.app/$PattiCakeSlime"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-green-500 hover:bg-green-600 text-white font-heading uppercase tracking-widest py-5 rounded-xl shadow-[0_4px_14px_0_rgba(72,187,120,0.39)] transform transition hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 text-xl"
                                >
                                    <Smartphone className="w-6 h-6" />
                                    PAY NOW ON CASH APP
                                </a>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">After you send payment</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePaid}
                                    className="block w-full bg-white border-2 border-gray-200 hover:border-black text-gray-800 hover:text-black font-bold py-4 rounded-xl transition-all"
                                >
                                    I have sent my payment
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'confirmed' && (
                        <motion.div
                            key="confirmed-step"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8 space-y-6"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                <div className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center relative z-10">
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-gray-900">Payment Verification</h3>
                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 inline-block">
                                    <p className="text-yellow-800 text-sm font-medium">
                                        Patti is verifying your payment from <span className="font-bold text-black">{formData.customerCashtag}</span> now.
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm px-4">
                                Once confirmed, we will begin processing your order.
                                <br />
                                <br />
                                <span className="text-xs text-gray-400">Order ID: #{Math.floor(Math.random() * 10000) + 1000}</span>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
