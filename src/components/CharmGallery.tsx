"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface Accessory {
    id: string;
    name: string;
    price: number;
    image_url?: string;
}

export default function CharmGallery() {
    const [charms, setCharms] = useState<Accessory[]>([]);

    useEffect(() => {
        const fetchCharms = async () => {
            const { data } = await supabase
                .from("accessories")
                .select("*")
                .eq("is_active", true)
                .order("price", { ascending: true });

            if (data) setCharms(data);
        };

        fetchCharms();
    }, []);

    if (charms.length === 0) return null; // Or return a loading state/fallback if preferred

    return (
        <section className="py-24 bg-slime-blue border-y border-black/5 relative overflow-hidden">
            {/* Bottom Drip Divider */}
            <div className="absolute bottom-0 left-0 w-full leading-none z-20">
                <svg className="w-full h-12 md:h-24 text-slime-green fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-heading text-black mb-4 drop-shadow-[4px_4px_0px_var(--neon-lime)]">
                        ADD-ON <span className="text-vibrant-red">CHARMS</span>
                    </h2>
                    <p className="text-black/60 font-body max-w-lg mx-auto">
                        Make your slime unique! Add these to your live build or pre-made order.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                    {charms.map((charm, idx) => (
                        <motion.div
                            key={charm.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-white border-2 border-black p-4 rounded-3xl flex flex-col items-center text-center group cursor-pointer shadow-[4px_4px_0px_var(--electric-blue)]"
                        >
                            <div className="w-16 h-16 bg-gray-50 border border-black/5 rounded-2xl mb-4 shadow-sm flex items-center justify-center overflow-hidden relative">
                                {charm.image_url ? (
                                    <Image
                                        src={charm.image_url}
                                        alt={charm.name}
                                        width={64}
                                        height={64}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-2xl">✨</span>
                                )}
                            </div>
                            <h3 className="font-heading text-black text-xs mb-1 uppercase tracking-tighter">{charm.name}</h3>
                            {/* Price tag removed */}

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
