"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ChevronDown } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Animated Gradient Background (video placeholder) */}
            <div className="absolute inset-0 bg-gradient-to-br from-slime-green via-bubblegum-pink to-electric-purple animate-[gradient_8s_ease-in-out_infinite] bg-[length:400%_400%]" />

            {/* Floating blobs for depth */}
            <motion.div
                className="absolute top-20 left-10 w-72 h-72 rounded-full bg-sunshine-yellow/30 blur-3xl"
                animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-electric-purple/30 blur-3xl"
                animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-slime-green/20 blur-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Frosted Glass Overlay */}
            <div className="relative z-10 glass rounded-3xl p-8 sm:p-12 md:p-16 mx-4 max-w-2xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
                >
                    {/* Emoji decoration */}
                    <motion.p
                        className="text-5xl sm:text-6xl mb-4"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        🍰✨
                    </motion.p>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold font-[var(--font-heading)] text-white mb-4 drop-shadow-lg leading-tight">
                        SHOP SLIME
                    </h1>
                    <p className="text-lg sm:text-xl text-white/90 mb-8 font-semibold">
                        Handmade with love by Grandma Patti 💕
                    </p>

                    {/* Giant CTA Button */}
                    <motion.a
                        href="#shop"
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(163, 230, 53, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-3 bg-slime-green text-foreground font-bold text-xl sm:text-2xl px-10 sm:px-14 py-5 sm:py-6 rounded-full shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                    >
                        <ShoppingBag className="w-7 h-7" />
                        SHOP NOW
                    </motion.a>
                </motion.div>
            </div>

            {/* Scroll hint */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <ChevronDown className="w-8 h-8 text-white/70" />
            </motion.div>

            {/* CSS gradient animation keyframes */}
            <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
        </section>
    );
}
