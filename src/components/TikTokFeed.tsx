"use client";

import { motion } from "framer-motion";
import { Play, ExternalLink } from "lucide-react";

const videos = [
    { id: 1, title: "Lava Spark LIVE Build 🔥", views: "2.1M", color: "from-hot-pink to-purple-900" },
    { id: 2, title: "Super Cloud ASMR ☁️", views: "1.8M", color: "from-neon-lime to-green-900" },
    { id: 3, title: "Custom Order for Sarah! 🧁", views: "3.2M", color: "from-cyan-pop to-blue-900" },
    { id: 4, title: "Secret Glow Slime 🌟", views: "1.5M", color: "from-yellow-400 to-amber-900" },
    { id: 5, title: "Live Queue Movement ⚡", views: "2.7M", color: "from-white/20 to-black" },
];

export default function TikTokFeed() {
    return (
        <section id="tiktok" className="py-24 bg-background overflow-hidden relative">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6"
                >
                    <div className="text-left">
                        <span className="inline-block bg-white text-black text-xs font-heading px-4 py-1.5 rounded-lg mb-4 uppercase tracking-[0.2em] shadow-[4px_4px_0px_var(--neon-lime)] border-2 border-black">
                            @patticakelive
                        </span>
                        <h2 className="text-5xl md:text-8xl font-heading text-white leading-none tracking-tighter drop-shadow-[0_4px_0px_#ff00ff]">
                            VIRAL MOMENTS
                        </h2>
                    </div>
                    <motion.a
                        href="https://tiktok.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 bg-neon-lime text-black font-heading text-sm px-8 py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_#fff]"
                    >
                        <ExternalLink className="w-5 h-5" />
                        FOLLOW THE LIVE
                    </motion.a>
                </motion.div>

                {/* Horizontal Scroll Container */}
                <div className="overflow-x-auto hide-scrollbar pb-8">
                    <div className="flex gap-6 w-max px-2">
                        {videos.map((video, i) => (
                            <motion.div
                                key={video.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="relative w-[280px] md:w-[320px] aspect-[9/16] rounded-[2.5rem] overflow-hidden border-4 border-white/5 cursor-pointer group flex-shrink-0"
                            >
                                {/* Gradient placeholder */}
                                <div className={`absolute inset-0 bg-gradient-to-b ${video.color} opacity-80`} />

                                {/* Play button overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                    <motion.div
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="bg-white/10 backdrop-blur-xl rounded-full p-6 border border-white/20 shadow-2xl"
                                    >
                                        <Play className="w-10 h-10 text-white fill-current" />
                                    </motion.div>
                                </div>

                                {/* Video info overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
                                    <h3 className="text-white font-heading text-xl mb-2 leading-tight uppercase tracking-tight">{video.title}</h3>
                                    <p className="text-white/40 text-xs font-heading font-bold uppercase tracking-widest">{video.views} views</p>
                                </div>

                                <div className="absolute top-6 right-6">
                                    <div className="bg-red-600 px-3 py-1 rounded font-heading text-[8px] text-white tracking-[0.2em]">VIRAL</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
