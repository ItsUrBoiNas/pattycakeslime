"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Image from "next/image";

const charms = [
    { name: "Neon Stars", price: 1.50, color: "bg-yellow-400" },
    { name: "Fruit Slices", price: 2.00, color: "bg-pink-400" },
    { name: "Cloud Charms", price: 1.75, color: "bg-blue-400" },
    { name: "Glitter Pack", price: 1.00, color: "bg-purple-400" },
    { name: "Cute Bears", price: 2.50, color: "bg-green-400" },
    { name: "Sprinkle Mix", price: 1.25, color: "bg-orange-400" },
];

export default function CharmGallery() {
    return (
        <section className="py-24 bg-black/40 border-y border-white/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-heading text-white mb-4 drop-shadow-[0_4px_0px_var(--neon-lime)]">
                        ADD-ON <span className="text-hot-pink">CHARMS</span>
                    </h2>
                    <p className="text-white/60 font-body max-w-lg mx-auto">
                        Make your slime unique! Add these to your live build or pre-made order.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                    {charms.map((charm, idx) => (
                        <motion.div
                            key={charm.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-[#1a0b2e] border-2 border-white/10 p-4 rounded-3xl flex flex-col items-center text-center group cursor-pointer"
                        >
                            <div className={`w-16 h-16 ${charm.color} rounded-2xl mb-4 shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center justify-center text-2xl`}>
                                ✨
                            </div>
                            <h3 className="font-heading text-white text-xs mb-1 uppercase tracking-tighter">{charm.name}</h3>
                            <span className="text-neon-lime font-bold text-sm mb-3">${charm.price.toFixed(2)}</span>

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="bg-white rounded-full p-2 text-black border-2 border-black group-hover:bg-neon-lime transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
