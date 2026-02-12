"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, ShoppingBag, Play } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Hero() {
    const [headline, setHeadline] = useState("PattiCake Slime");
    const [subHeadline, setSubHeadline] = useState("OFFICIAL MENU");
    const [liveStatus, setLiveStatus] = useState("");

    useEffect(() => {
        const loadHeroData = async () => {
            const { data: headlineData } = await supabase
                .from("site_settings")
                .select("value")
                .eq("key", "hero_headline")
                .maybeSingle();

            const { data: subData } = await supabase
                .from("site_settings")
                .select("value")
                .eq("key", "hero_subheadline")
                .maybeSingle();

            const { data: liveData } = await supabase
                .from("site_settings")
                .select("value")
                .eq("key", "live_status_text")
                .maybeSingle();

            if (headlineData?.value) setHeadline(headlineData.value);
            if (subData?.value) setSubHeadline(subData.value);
            if (liveData?.value) setLiveStatus(liveData.value);
            else setLiveStatus("");
        };

        loadHeroData();

        const channel = supabase
            .channel('hero-settings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => loadHeroData())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-slime-pink via-white to-slime-blue pt-16 pb-32">
            <div className="absolute inset-0 z-0 opacity-30"
                style={{ backgroundImage: 'radial-gradient(var(--neon-lime) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

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

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(57,255,20,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.2)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center text-center">
                    {liveStatus && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border-2 border-black px-6 py-2 rounded-full mb-8 shadow-[4px_4px_0px_var(--neon-lime)]"
                        >
                            <span className="text-black font-heading text-sm tracking-widest flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                {liveStatus}
                            </span>
                        </motion.div>
                    )}

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-6xl sm:text-8xl md:text-9xl font-heading text-black mb-6 leading-none drop-shadow-[4px_4px_0px_var(--neon-lime)] tracking-tighter uppercase stroke-black"
                    >
                        {headline.split(' ').map((word, i) => (
                            <span key={i}>
                                {i === 1 ? <><br /> <span className="text-electric-blue italic">{word}</span></> : word}
                            </span>
                        ))}
                    </motion.h1>

                    <p className="text-xl md:text-2xl text-vibrant-red font-heading uppercase tracking-widest mb-12">
                        {subHeadline}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
                        <motion.a
                            href="#shop"
                            whileHover={{ scale: 1.05, boxShadow: "8px 8px 0px #000" }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 bg-neon-lime text-black font-heading text-2xl py-6 rounded-2xl border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center gap-3 no-underline"
                        >
                            <ShoppingBag className="w-8 h-8 fill-current" />
                            SHOP THE MENU
                        </motion.a>

                        <motion.a
                            href="https://www.tiktok.com/@memomzie"
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

                </div>
            </div>

            {/* Bottom Slime Drip Divider */}
            <div className="absolute bottom-0 left-0 w-full leading-none z-20">
                <svg className="w-full h-12 md:h-24 text-slime-purple fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>
        </section>
    );
}
