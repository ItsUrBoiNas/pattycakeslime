"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Heart, Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AboutPatti() {
    const [aboutText, setAboutText] = useState("I don't do boring restocks. I create in the moment.");
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const loadAbout = async () => {
            const { data } = await supabase
                .from("site_settings")
                .select("value")
                .eq("key", "about_text")
                .maybeSingle();
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
                    className="bg-white border-4 border-black rounded-[3rem] overflow-hidden shadow-[8px_8px_0px_var(--electric-blue)]"
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
                                    className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 drop-shadow-[10px_10px_0px_var(--neon-lime)]"
                                >
                                    {imageError ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-white/20 rounded-full border-4 border-white backdrop-blur-sm">
                                            <Zap className="w-24 h-24 text-white drop-shadow-lg" />
                                        </div>
                                    ) : (
                                        <img
                                            src="/logo.png"
                                            alt="PattiCake Slime Logo"
                                            className="w-full h-full object-contain"
                                            onError={() => setImageError(true)}
                                        />
                                    )}
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
                        <div className="p-8 md:p-16 flex flex-col justify-center bg-white">
                            <div className="flex items-center gap-3 mb-8">
                                <Zap className="w-8 h-8 text-black fill-current" />
                                <h2 className="text-4xl md:text-6xl font-heading text-black leading-none drop-shadow-[4px_4px_0px_var(--neon-lime)] stroke-black">
                                    THE <span className="text-electric-blue italic">PATTICAKE</span> WAY
                                </h2>
                            </div>

                            <div className="space-y-6 text-lg text-black/80 font-body leading-relaxed whitespace-pre-wrap font-medium">
                                {aboutText}
                            </div>

                            <div className="mt-12 flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-gray-100 border border-black/10 px-4 py-2 rounded-xl">
                                    <Camera className="w-4 h-4 text-electric-blue" />
                                    <span className="text-xs font-heading text-black uppercase tracking-wider">TikTok Sensation</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-100 border border-black/10 px-4 py-2 rounded-xl">
                                    <Heart className="w-4 h-4 text-vibrant-red" />
                                    <span className="text-xs font-heading text-black uppercase tracking-wider">Handmade Live</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
