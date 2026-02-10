"use client";

import { motion } from "framer-motion";
import { Play, ExternalLink } from "lucide-react";

const videos = [
    { id: 1, title: "Cloud Slime ASMR 🌈", views: "2.1M", color: "from-pink-300 to-purple-400" },
    { id: 2, title: "Butter Slime Tutorial 🧈", views: "1.8M", color: "from-yellow-300 to-orange-400" },
    { id: 3, title: "Crunchy Slime ASMR 🍿", views: "3.2M", color: "from-green-300 to-teal-400" },
    { id: 4, title: "Glitter Slime Mix ✨", views: "1.5M", color: "from-blue-300 to-indigo-400" },
    { id: 5, title: "Fluffy Slime Recipe 🐑", views: "2.7M", color: "from-purple-300 to-pink-400" },
];

export default function TikTokFeed() {
    return (
        <section id="tiktok" className="py-16 sm:py-24 bg-off-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="text-center mb-10"
                >
                    <span className="inline-block bg-foreground text-white text-sm font-bold px-5 py-2 rounded-full mb-4 uppercase tracking-wider">
                        @pattycakeslime
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold font-[var(--font-heading)] text-foreground">
                        Trending on TikTok 📱
                    </h2>
                    <p className="text-lg text-foreground/60 mt-3 font-semibold">
                        Watch our most viral slime videos!
                    </p>
                </motion.div>

                {/* Horizontal Scroll Container */}
                <div className="overflow-x-auto hide-scrollbar pb-4">
                    <div className="flex gap-5 w-max px-2">
                        {videos.map((video, i) => (
                            <motion.div
                                key={video.id}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring", stiffness: 100, damping: 15 }}
                                whileHover={{ scale: 1.03, y: -5 }}
                                className="relative w-[220px] sm:w-[260px] aspect-[9/16] rounded-3xl overflow-hidden shadow-lg cursor-pointer group flex-shrink-0"
                            >
                                {/* Gradient placeholder */}
                                <div className={`absolute inset-0 bg-gradient-to-b ${video.color}`} />

                                {/* Play button overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                                    <motion.div
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="bg-white/90 rounded-full p-4 shadow-lg"
                                    >
                                        <Play className="w-8 h-8 text-foreground fill-foreground" />
                                    </motion.div>
                                </div>

                                {/* Video info overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                    <p className="text-white font-bold text-base mb-1">{video.title}</p>
                                    <p className="text-white/80 text-sm font-semibold">{video.views} views</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Follow CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-8"
                >
                    <motion.a
                        href="https://tiktok.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 bg-foreground text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <ExternalLink className="w-5 h-5" />
                        Follow Us on TikTok
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}
