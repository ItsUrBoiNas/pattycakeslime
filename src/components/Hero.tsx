"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, ShoppingBag, Play } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Hero() {
    const [headline, setHeadline] = useState("WELCOME TO\nPATTI CAKE SLIME");
    const [subHeadline, setSubHeadline] = useState("Dive Into Our Slime Menu!");
    const [liveStatus, setLiveStatus] = useState("");

    // Split headline into words for the staggered bounce animation
    const words = headline.split(' ');

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

    // SVG Cloud Component for crisp, scalable floating clouds
    const Cloud = ({ className, delay = 0, duration = 15, scale = 1 }: { className: string, delay?: number, duration?: number, scale?: number }) => (
        <motion.svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`text-white absolute drop-shadow-lg will-change-transform ${className}`}
            style={{ width: `${scale * 100}px`, height: `${scale * 100}px` }}
            animate={{
                x: ["-10%", "10%", "-10%"],
                y: ["-5%", "5%", "-5%"]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
        >
            <path d="M17.5 19c-2.481 0-4.5-2.019-4.5-4.5 0-.177.014-.35.039-.52A4.956 4.956 0 0 0 11.5 14c-2.126 0-3.924 1.34-4.636 3.208A3.483 3.483 0 0 0 6.5 17c-1.93 0-3.5 1.57-3.5 3.5S4.57 24 6.5 24h11c3.032 0 5.5-2.467 5.5-5.5S20.532 13 17.5 13c-2.529 0-4.654 1.713-5.281 4.043C11.956 16.924 11.733 16.8 11.5 16.8c-.805 0-1.545.337-2.052.883C9.034 18.136 9 18.57 9 19H17.5z" />
        </motion.svg>
    );

    // Floating Sparkle Component
    const Sparkle = ({ className, delay = 0 }: { className: string, delay?: number }) => (
        <motion.div
            className={`absolute rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] will-change-transform ${className}`}
            animate={{
                y: [0, -50, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                rotate: [0, 90, 180]
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
        />
    );

    return (
        <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-sky-blue overflow-hidden pt-16 pb-32">

            {/* Glowing Slime Ambient Orbs */}
            <motion.div
                className="absolute top-[10%] left-[10%] w-[600px] h-[600px] rounded-full bg-slime-goo-pink/30 blur-[120px] pointer-events-none mix-blend-screen will-change-transform"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[10%] right-[10%] w-[700px] h-[700px] rounded-full bg-slime-goo-green/30 blur-[150px] pointer-events-none mix-blend-screen will-change-transform"
                animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
                className="absolute top-[40%] left-[40%] w-[500px] h-[500px] rounded-full bg-slime-goo-blue/40 blur-[130px] pointer-events-none mix-blend-screen will-change-transform"
                animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />

            {/* SVG Parallax Crisp Clouds */}
            <Cloud className="-top-[10%] -left-[10%] opacity-80" scale={8} duration={25} delay={0} />
            <Cloud className="top-[20%] -right-[5%] opacity-90" scale={6} duration={20} delay={2} />
            <Cloud className="bottom-[10%] left-[5%] opacity-70" scale={5} duration={18} delay={1} />
            <Cloud className="-bottom-[15%] right-[20%] opacity-80" scale={9} duration={22} delay={3} />
            <Cloud className="top-[50%] -left-[15%] opacity-60" scale={4} duration={30} delay={5} />

            {/* High-Dopamine Sparkles */}
            <Sparkle className="top-[30%] left-[20%] w-3 h-3" delay={0} />
            <Sparkle className="top-[20%] right-[30%] w-4 h-4 bg-slime-goo-pink" delay={1.5} />
            <Sparkle className="bottom-[40%] left-[40%] w-2 h-2 bg-slime-goo-green" delay={0.8} />
            <Sparkle className="bottom-[30%] right-[25%] w-5 h-5 bg-slime-goo-blue" delay={2.2} />
            <Sparkle className="top-[60%] right-[15%] w-3 h-3" delay={3} />

            <div className="container mx-auto px-4 relative z-30">
                <div className="flex flex-col items-center text-center">

                    {liveStatus && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", bounce: 0.6 }}
                            className="bg-white border-2 border-black px-6 py-2 rounded-full mb-8 shadow-[4px_4px_0px_rgba(0,0,0,0.2)]"
                        >
                            <span className="text-black font-heading text-sm font-bold tracking-widest flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                {liveStatus}
                            </span>
                        </motion.div>
                    )}

                    {/* Staggered Bouncy Word Entrance */}
                    <div className="mb-4">
                        {words.map((word, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 50, scale: 0.5, rotate: -10 }}
                                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 10,
                                    delay: i * 0.15,
                                }}
                                className={`inline-block chunky-text text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[1.1] ${word === '' ? 'block h-4' : 'mr-4 sm:mr-6'}`}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </div>

                    <motion.p
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="text-xl md:text-2xl text-white font-body drop-shadow-md font-medium tracking-wide mb-12"
                    >
                        {subHeadline}
                    </motion.p>

                    <div className="flex justify-center w-full max-w-sm">
                        <motion.a
                            href="#shop"
                            initial={{ scale: 1 }}
                            animate={{
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                    "0px 0px 0px rgba(0,0,0,0)",
                                    "0px 10px 20px rgba(253,184,99,0.5)",
                                    "0px 0px 0px rgba(0,0,0,0)"
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            whileHover={{ scale: 1.1, rotate: -2 }}
                            whileTap={{ scale: 0.95, rotate: 2 }}
                            className="w-full bg-button-orange text-black font-heading font-black text-2xl py-5 px-8 rounded-full border-4 border-black hover:bg-orange-400 transition-colors shadow-sm flex items-center justify-center gap-3 uppercase tracking-wider relative overflow-hidden"
                        >
                            {/* Shine effect over button */}
                            <motion.div
                                className="absolute top-0 left-0 w-[50%] h-full bg-white/30 transform -skew-x-12 will-change-transform"
                                animate={{ x: ["-200%", "400%"] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                            />
                            <ShoppingBag className="w-6 h-6 fill-current relative z-10" />
                            <span className="relative z-10">SHOP SLIMES</span>
                        </motion.a>
                    </div>

                </div>
            </div>
        </section>
    );
}
