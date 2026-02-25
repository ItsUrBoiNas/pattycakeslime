"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ViralVideo {
    id: string;
    title: string;
    views: string;
    video_url: string;
    platform: string;
    color?: string; // We'll assign a random color locally
}

export default function TikTokFeed() {
    const [videos, setVideos] = useState<ViralVideo[]>([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const { data } = await supabase
                .from("viral_moments")
                .select("*")
                .order("created_at", { ascending: false });

            if (data) {
                // Assign consistent colors based on ID or index
                const colors = [
                    "from-hot-pink to-purple-900",
                    "from-sky-blue to-blue-900",
                    "from-cyan-500 to-blue-900",
                    "from-yellow-400 to-amber-900",
                    "from-purple-500 to-indigo-900"
                ];

                const coloredData = data.map((item, index) => ({
                    ...item,
                    color: colors[index % colors.length]
                }));
                setVideos(coloredData);
            }
        };

        fetchVideos();
    }, []);
    return (
        <section id="tiktok" className="py-24 bg-sky-blue/10 overflow-hidden relative">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6"
                >
                    <div className="text-left">
                        <h2 className="text-4xl md:text-6xl font-heading text-black font-black uppercase tracking-wide leading-tight">
                            VIRAL <span className="text-sky-blue">MOMENTS</span>
                        </h2>
                    </div>
                </motion.div>

                {/* Horizontal Scroll Container */}
                <div className="overflow-x-auto hide-scrollbar pb-8">
                    <div className="flex gap-6 w-max px-2">
                        {videos.map((video, i) => (
                            <motion.a
                                key={video.id}
                                href={video.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="relative w-[280px] md:w-[320px] aspect-[9/16] rounded-[2.5rem] overflow-hidden border border-black/5 cursor-pointer group flex-shrink-0 block shadow-sm"
                            >
                                {/* Gradient placeholder */}
                                <div className={`absolute inset-0 bg-gradient-to-b ${video.color} opacity-80`} />

                                {/* Play button overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="bg-white/20 backdrop-blur-md rounded-full p-5 border border-white/30 shadow-lg"
                                    >
                                        <Play className="w-10 h-10 text-white fill-current" />
                                    </motion.div>
                                </div>

                                {/* Video info overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                    <h3 className="text-white font-heading text-xl mb-2 leading-tight uppercase tracking-tight">{video.title}</h3>
                                    <p className="text-white/70 text-xs font-heading font-bold uppercase tracking-widest">{video.views} views</p>
                                </div>

                                <div className="absolute top-6 right-6">
                                    <div className="bg-button-orange px-3 py-1 rounded-full font-heading text-xs text-black font-bold tracking-wider">{video.platform || "VIRAL"}</div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
