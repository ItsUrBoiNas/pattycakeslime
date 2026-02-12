"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Zap } from "lucide-react";
import Image from "next/image";

import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const pathname = usePathname();
    const { cartCount, toggleCart } = useCart();

    if (pathname === "/patty") return null;

    const navLinks = [
        { label: "Shop", href: "#shop" },
        { label: "TikTok", href: "#tiktok" },
        { label: "About", href: "#about" },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-slime-purple/90 backdrop-blur-md border-b-4 border-electric-blue"
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <motion.a
                        href="/"
                        className="flex items-center gap-2 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {imageError ? (
                            <>
                                <div className="bg-neon-lime p-1.5 rounded-lg shadow-[3px_3px_0px_var(--electric-blue)] border-2 border-black">
                                    <Zap className="w-6 h-6 text-black fill-current" />
                                </div>
                                <span className="text-xl sm:text-2xl font-heading text-neon-lime tracking-widest uppercase drop-shadow-[2px_2px_0px_black] stroke-black">
                                    PattiCake<span className="text-electric-blue">Slime</span>
                                </span>
                            </>
                        ) : (
                            <Image
                                src="/logo.png"
                                alt="PattiCake Slime"
                                width={200}
                                height={80}
                                className="h-14 w-auto object-contain drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
                                priority
                                onError={() => setImageError(true)}
                            />
                        )}
                    </motion.a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                className="text-xs font-heading font-medium text-black/70 hover:text-neon-lime transition-colors tracking-widest uppercase"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {link.label}
                            </motion.a>
                        ))}
                        <motion.button
                            onClick={toggleCart}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative p-3 rounded-xl bg-white text-black border-2 border-black shadow-[4px_4px_0px_var(--neon-lime)]"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-hot-pink text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                                    {cartCount}
                                </span>
                            )}
                        </motion.button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-4">
                        <motion.button
                            onClick={toggleCart}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative p-3 rounded-xl bg-white text-black border-2 border-black"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-hot-pink text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                                    {cartCount}
                                </span>
                            )}
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-black"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed inset-0 top-20 bg-background z-40 md:hidden p-8"
                    >
                        <div className="flex flex-col gap-8">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-4xl font-heading text-black tracking-widest uppercase"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
