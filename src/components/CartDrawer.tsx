"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function CartDrawer() {
    const { isCartOpen, toggleCart, items, removeFromCart, updateQuantity, cartTotal } = useCart();
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && isCartOpen) {
                toggleCart();
            }
        };

        if (isCartOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isCartOpen, toggleCart]);

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isCartOpen]);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                    />

                    {/* Drawer */}
                    <motion.div
                        ref={drawerRef}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-[#1a0b2e] border-l border-white/10 z-[201] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <ShoppingCart className="w-6 h-6 text-neon-lime" />
                                <h2 className="text-2xl font-heading text-white uppercase tracking-widest">
                                    Your Cart
                                </h2>
                                <span className="bg-white/10 text-white/60 px-2 py-0.5 rounded-full text-xs font-heading">
                                    {items.length}
                                </span>
                            </div>
                            <button
                                onClick={toggleCart}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-white/40">
                                    <ShoppingCart className="w-16 h-16 opacity-20" />
                                    <p className="font-heading uppercase tracking-widest">Your cart is empty</p>
                                    <button
                                        onClick={toggleCart}
                                        className="text-neon-lime hover:underline font-heading tracking-widest text-sm"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/5 relative group"
                                    >
                                        {/* Image */}
                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-black/20 flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-heading text-white text-lg tracking-wide uppercase">
                                                    {item.name}
                                                </h3>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-white/40 hover:text-hot-pink transition-colors p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Accessories & Options */}
                                            <div className="mt-1 space-y-1">
                                                {item.isLive && (
                                                    <div className="flex items-center gap-1.5 text-neon-lime text-[10px] font-heading uppercase tracking-wider">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse" />
                                                        Make it Live
                                                    </div>
                                                )}
                                                {item.selectedAccessories.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {item.selectedAccessories.map((acc: any) => (
                                                            <span
                                                                key={acc.id}
                                                                className="text-[10px] bg-white/10 text-white/60 px-1.5 py-0.5 rounded"
                                                            >
                                                                + {acc.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price & Quantity */}
                                            <div className="mt-auto flex items-center justify-between pt-3">
                                                <span className="font-heading text-neon-lime text-lg">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                                <div className="flex items-center gap-3 bg-black/20 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-6 h-6 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="font-heading text-white w-4 text-center text-sm">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-white transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-black/20 space-y-4">
                                <div className="flex items-center justify-between text-white">
                                    <span className="font-heading uppercase tracking-widest text-sm text-white/60">
                                        Subtotal
                                    </span>
                                    <span className="font-heading text-2xl text-neon-lime">
                                        ${cartTotal.toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-xs text-white/40 text-center font-heading uppercase tracking-widest">
                                    Shipping calculated at checkout
                                </p>
                                <Link
                                    href="/checkout"
                                    onClick={toggleCart}
                                    className="block w-full py-4 bg-neon-lime text-black font-heading text-xl uppercase tracking-widest rounded-xl hover:bg-[#ccff00] transition-colors shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] transform active:scale-[0.98] text-center"
                                >
                                    Checkout
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
