"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export default function AboutPatti() {
    return (
        <section id="about" className="py-16 sm:py-24 px-4 bg-pink-50">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden"
                >
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Photo Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 15 }}
                            className="relative aspect-square md:aspect-auto bg-gradient-to-br from-bubblegum-pink/30 via-pink-100 to-electric-purple/20 flex items-center justify-center min-h-[300px]"
                        >
                            {/* Placeholder avatar */}
                            <div className="text-center">
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="text-8xl sm:text-9xl mb-4"
                                >
                                    👵🏻
                                </motion.div>
                                <p className="text-bubblegum-pink font-bold text-lg">Grandma Patti</p>
                            </div>

                            {/* Decorative sparkles */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute top-6 right-6"
                            >
                                <Sparkles className="w-8 h-8 text-sunshine-yellow" />
                            </motion.div>
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute bottom-6 left-6"
                            >
                                <Sparkles className="w-6 h-6 text-bubblegum-pink" />
                            </motion.div>
                        </motion.div>

                        {/* Story */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 15 }}
                            className="p-8 sm:p-12 flex flex-col justify-center"
                        >
                            <div className="inline-flex items-center gap-2 bg-pink-100 text-bubblegum-pink px-4 py-2 rounded-full mb-6 w-fit">
                                <Heart className="w-4 h-4 fill-bubblegum-pink" />
                                <span className="font-bold text-sm uppercase tracking-wider">Our Story</span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-heading)] text-foreground mb-6">
                                Meet Grandma Patti 💖
                            </h2>

                            <div className="space-y-4 text-lg text-foreground/70 leading-relaxed font-medium">
                                <p>
                                    It all started in Grandma Patti&apos;s kitchen. At 72 years young, she discovered
                                    that making slime with her grandkids was the most fun she&apos;d had in years!
                                </p>
                                <p>
                                    What began as simple weekend craft sessions turned into a viral TikTok sensation.
                                    Her secret? <strong className="text-foreground">Real love in every batch.</strong> Each
                                    slime is hand-mixed with premium ingredients and sprinkled with grandma-approved
                                    magic. ✨
                                </p>
                                <p>
                                    From cloud slime to butter slime, every creation is made in small batches to
                                    ensure the <strong className="text-foreground">squishiest, stretchiest, most satisfying</strong>{" "}
                                    slime you&apos;ve ever felt.
                                </p>
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="mt-8 bg-pink-50 rounded-2xl p-5 border-2 border-bubblegum-pink/20"
                            >
                                <p className="text-bubblegum-pink font-bold text-lg italic">
                                    &ldquo;Every jar of slime has a little bit of my heart in it.&rdquo;
                                </p>
                                <p className="text-foreground/50 font-semibold mt-1">— Grandma Patti 🍰</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
