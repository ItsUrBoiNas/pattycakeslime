"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Sparkles } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { label: "Shop", href: "#shop" },
        { label: "Drops", href: "#drops" },
        { label: "TikTok", href: "#tiktok" },
        { label: "About Patti", href: "#about" },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-50 glass"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <motion.a
                        href="/"
                        className="flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Sparkles className="w-8 h-8 text-slime-green" />
                        <span className="text-2xl sm:text-3xl font-bold font-[var(--font-heading)] bg-gradient-to-r from-slime-green via-bubblegum-pink to-electric-purple bg-clip-text text-transparent">
                            PattiCakeSlime
                        </span>
                    </motion.a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                className="text-lg font-semibold text-foreground hover:text-bubblegum-pink transition-colors"
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {link.label}
                            </motion.a>
                        ))}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative p-3 rounded-2xl bg-slime-green/20 hover:bg-slime-green/30 transition-colors"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart className="w-6 h-6 text-foreground" />
                            <span className="absolute -top-1 -right-1 bg-bubblegum-pink text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                0
                            </span>
                        </motion.button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative p-3 rounded-2xl bg-slime-green/20"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart className="w-6 h-6 text-foreground" />
                            <span className="absolute -top-1 -right-1 bg-bubblegum-pink text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                0
                            </span>
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-2xl"
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
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        className="md:hidden glass border-t border-white/20"
                    >
                        <div className="px-6 py-6 flex flex-col gap-4">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-xl font-bold text-foreground py-2"
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
