'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import CashAppCheckout from '@/components/CashAppCheckout';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div className="min-h-screen bg-pink-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-3xl font-heading text-pink-600 mb-4">Your Cart is Empty!</h1>
                <p className="text-gray-600 mb-8">It looks like you haven't added any slimes yet.</p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200"
                >
                    Return to Shop
                </Link>
            </div>
        );
    }

    // Format items for the checkout component
    const orderItems = items.map((item) => {
        const accessoryText = item.selectedAccessories.length > 0
            ? ` + ${item.selectedAccessories.map((a) => a.name).join(', ')}`
            : '';


        // Calculate price per item including accessories
        let unitPrice = item.price; // This already includes accessories logic in CartContext? 
        // Wait, let's double check CartContext logic.
        // CartContext: unitPrice = product.price; accessories.forEach(acc => unitPrice += acc.price);
        // So item.price in CartContext is the fully loaded unit price.

        return {
            name: `${item.name}${accessoryText}`,
            quantity: item.quantity,
            price: item.price,
        };
    });

    return (
        <div className="min-h-screen bg-pink-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-heading text-pink-600 mb-2">Checkout</h1>
                    <p className="text-gray-600">Complete your order to get your slime!</p>
                </div>

                <CashAppCheckout
                    items={orderItems}
                    totalPrice={cartTotal}
                    onPaymentComplete={() => {
                        clearCart();
                        // Optional: Redirect to home after a delay or show success message on this page (handled by component)
                    }}
                />

                <div className="mt-8 text-center">
                    <Link href="/" className="text-pink-500 hover:text-pink-700 text-sm font-medium">
                        &larr; Cntinue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
