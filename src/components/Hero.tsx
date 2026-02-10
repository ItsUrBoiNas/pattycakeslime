"use client";

import { motion } from "framer-motion";
import { Zap, ShoppingBag, Play } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-background pt-16">
            {/* High-Voltage Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(var(--neon-lime) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Pulse Glows */}
            <motion.div
                className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-hot-pink/20 blur-[120px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] rounded-full bg-neon-lime/20 blur-[120px]"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center text-center">
                    {/* Floating Status Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/50 border-2 border-neon-lime px-6 py-2 rounded-full mb-8 shadow-[0_0_15px_rgba(57,255,20,0.5)]"
                    >
                        <span className="text-neon-lime font-heading text-sm tracking-widest flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            LIVE ON TIKTOK NOW
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-6xl sm:text-8xl md:text-9xl font-heading text-white mb-6 leading-none drop-shadow-[0_8px_0px_#ff00ff] tracking-tighter uppercase"
                    >
                        PattiCake <br /> <span className="text-neon-lime italic">Slime</span>
                    </motion.h1>

                    <p className="text-xl md:text-2xl text-white/80 font-body max-w-2xl mb-12 font-medium">
                        The squishiest, stretchiest, hand-crafted slime on TikTok. <br />
                        <span className="text-white font-bold">Pick your flavor and let&apos;s get gooey!</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
                        <motion.a
                            href="#shop"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(57, 255, 20, 0.6)" }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 bg-neon-lime text-black font-heading text-2xl py-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_#fff] flex items-center justify-center gap-3 no-underline"
                        >
                            <ShoppingBag className="w-8 h-8 fill-current" />
                            SHOP THE MENU
                        </motion.a>

                        <motion.a
                            href="https://tiktok.com/@patticakeslime"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 0, 255, 0.6)" }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 bg-hot-pink text-white font-heading text-2xl py-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_#1a0b2e] flex items-center justify-center gap-3 no-underline"
                        >
                            <Play className="w-8 h-8 fill-current" />
                            WATCH LIVE
                        </motion.a>
                    </div>

                    <div className="mt-16 flex items-center gap-4 text-white/40 font-heading text-xs uppercase tracking-[0.2em]">
                        <span className="h-[1px] w-12 bg-white/20"></span>
                        Trusted by 50k+ Slime Fans
                        <span className="h-[1px] w-12 bg-white/20"></span>
                    </div>
                </div>
            </div>

            {/* Background Slime Drip Decoration (Simulated) */}
            <div className="absolute top-0 left-0 w-full h-12 bg-neon-lime shadow-[0_4px_10px_rgba(57,255,20,0.5)] z-20 overflow-hidden">
                <div className="flex">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="w-1/20 h-16 bg-neon-lime rounded-full -mt-8 mx-1 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                </div>
            </div>
        </section>
    );
}
