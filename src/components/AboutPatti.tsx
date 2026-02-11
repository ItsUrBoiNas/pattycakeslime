"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Heart, Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AboutPatti() {
    const [aboutText, setAboutText] = useState("I don't do boring restocks. I create in the moment.");

    useEffect(() => {
        const loadAbout = async () => {
            const { data } = await supabase
                .from("site_settings")
                .select("value")
                .eq("key", "about_text")
                .single();
            if (data?.value) setAboutText(data.value);
        };
        loadAbout();

        const channel = supabase
            .channel('about-settings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => loadAbout())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <section id="about" className="py-24 px-4 bg-background">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="bg-[#1a0b2e] border-4 border-white/5 rounded-[3rem] overflow-hidden shadow-2xl"
                >
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Creator Profile */}
                        <div className="relative aspect-square flex items-center justify-center p-12 bg-gradient-to-br from-hot-pink/20 to-neon-lime/20 overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                                <span className="text-[20rem] font-heading select-none">LIVE</span>
                            </div>

                            <div className="relative z-10 text-center">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        rotate: [0, 2, -2, 0]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="text-[12rem] md:text-[15rem] leading-none mb-6 drop-shadow-[10px_10px_0px_var(--neon-lime)]"
                                >
                                    👵🏻
                                </motion.div>
                                <div className="bg-black/80 backdrop-blur-md px-6 py-2 rounded-xl border border-white/20">
                                    <p className="text-white font-heading text-lg tracking-[0.2em] uppercase">PattiCakeSlime</p>
                                </div>
                            </div>

                            <div className="absolute top-8 left-8 flex gap-2">
                                <div className="bg-red-600 px-3 py-1 rounded font-heading text-[10px] text-white">LIVE</div>
                                <div className="bg-white px-3 py-1 rounded font-heading text-[10px] text-black shadow-[2px_2px_0px_var(--neon-lime)]">CREATOR</div>
                            </div>
                        </div>

                        {/* Story */}
                        <div className="p-8 md:p-16 flex flex-col justify-center bg-black/40">
                            <div className="flex items-center gap-3 mb-8">
                                <Zap className="w-8 h-8 text-neon-lime fill-current" />
                                <h2 className="text-4xl md:text-6xl font-heading text-white leading-none">
                                    THE <span className="text-neon-lime italic">PATTICAKE</span> WAY
                                </h2>
                            </div>

                            <div className="space-y-6 text-lg text-white/70 font-body leading-relaxed whitespace-pre-wrap">
                                {aboutText}
                            </div>

                            <div className="mt-12 flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                                    <Camera className="w-4 h-4 text-neon-lime" />
                                    <span className="text-xs font-heading text-white uppercase tracking-wider">TikTok Sensation</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                                    <Heart className="w-4 h-4 text-hot-pink" />
                                    <span className="text-xs font-heading text-white uppercase tracking-wider">Handmade Live</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
