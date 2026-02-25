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
        <section id="about" className="py-24 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white border rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-sky-blue/20"
                >
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Creator Profile */}
                        <div className="relative aspect-square flex items-center justify-center p-12 bg-gradient-to-br from-sky-blue/10 to-transparent overflow-hidden border-r border-sky-blue/10">

                            <div className="relative z-10 text-center">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.02, 1],
                                        rotate: [0, 1, -1, 0]
                                    }}
                                    transition={{ duration: 6, repeat: Infinity }}
                                    className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg"
                                >
                                    {imageError ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 backdrop-blur-md">
                                            <Zap className="w-16 h-16 text-sky-blue/40 fill-current" />
                                        </div>
                                    ) : (
                                        <img
                                            src="/logo.png"
                                            alt="PattiCake Slime Logo"
                                            className="w-full h-full object-cover"
                                            onError={() => setImageError(true)}
                                        />
                                    )}
                                </motion.div>
                                <div className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border border-sky-blue/20 shadow-sm inline-block">
                                    <p className="text-black font-heading text-sm font-bold tracking-[0.1em] uppercase">PattiCakeSlime</p>
                                </div>
                            </div>

                            <div className="absolute top-8 left-8 flex gap-2">
                                <div className="bg-red-500 px-3 py-1 rounded-full font-heading text-[10px] text-white font-bold uppercase tracking-wider">LIVE</div>
                                <div className="bg-sky-blue px-3 py-1 rounded-full font-heading text-[10px] text-white font-bold uppercase tracking-wider shadow-sm">CREATOR</div>
                            </div>
                        </div>

                        {/* Story */}
                        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
                            <div className="flex items-center gap-3 mb-6">
                                <Zap className="w-6 h-6 text-button-orange fill-current" />
                                <h2 className="text-3xl md:text-5xl font-heading text-black font-black uppercase tracking-wide leading-tight">
                                    THE <span className="text-sky-blue italic font-normal">PATTICAKE</span> WAY
                                </h2>
                            </div>

                            <div className="space-y-6 text-lg text-black/70 font-body leading-relaxed whitespace-pre-wrap">
                                {aboutText}
                            </div>

                            <div className="mt-10 flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-sky-blue/10 text-sky-blue px-4 py-2 rounded-full border border-sky-blue/20">
                                    <Camera className="w-4 h-4" />
                                    <span className="text-xs font-heading font-bold uppercase tracking-wider">TikTok Sensation</span>
                                </div>
                                <div className="flex items-center gap-2 bg-button-orange/10 text-orange-600 px-4 py-2 rounded-full border border-button-orange/20">
                                    <Heart className="w-4 h-4" />
                                    <span className="text-xs font-heading font-bold uppercase tracking-wider">Handmade Live</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
