"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Sparkles, Instagram, Youtube, Mail } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();

    if (pathname === "/patty") return null;

    return (
        <footer className="bg-foreground text-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-6 h-6 text-slime-green" />
                            <span className="text-2xl font-bold font-[var(--font-heading)] bg-gradient-to-r from-slime-green to-bubblegum-pink bg-clip-text text-transparent">
                                PattiCakeSlime
                            </span>
                        </div>
                        <p className="text-white/60 font-medium leading-relaxed">
                            Handmade slime, crafted with love by Grandma Patti. Every jar is a little squeeze of
                            happiness! 💕
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 font-[var(--font-heading)]">Quick Links</h3>
                        <ul className="space-y-3">
                            {["Shop All", "New Drops", "Best Sellers", "About Us", "FAQ"].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-white/60 hover:text-slime-green transition-colors font-medium"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social & Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 font-[var(--font-heading)]">Connect</h3>
                        <div className="flex gap-3 mb-6">
                            {[
                                { Icon: Instagram, label: "Instagram" },
                                { Icon: Youtube, label: "YouTube" },
                                { Icon: Mail, label: "Email" },
                            ].map(({ Icon, label }) => (
                                <motion.a
                                    key={label}
                                    href="#"
                                    whileHover={{ scale: 1.15, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white/10 hover:bg-slime-green/30 p-3 rounded-2xl transition-colors"
                                    aria-label={label}
                                >
                                    <Icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                        <p className="text-white/60 font-medium text-sm">
                            📧 hello@pattycakeslime.com
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm font-medium">
                        © 2026 PattiCakeSlime. All rights reserved.
                    </p>
                    <p className="text-white/40 text-sm font-medium flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-bubblegum-pink fill-bubblegum-pink" /> by Grandma Patti
                    </p>
                </div>
            </div>
        </footer>
    );
}
