"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();

    if (pathname === "/patti") return null;

    return (
        <footer className="bg-electric-blue text-black py-12 px-4 border-t border-black/10 relative overflow-hidden">
            {/* Decorative Top Shape handled by TikTokFeed bottom drip */}
            <div className="max-w-6xl mx-auto">
                <div className="grid sm:grid-cols-2 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-6 h-6 text-white" />
                            <span className="text-2xl font-bold font-[var(--font-heading)] text-black drop-shadow-[2px_2px_0px_white] stroke-black">
                                PattiCakeSlime
                            </span>
                        </div>
                        <p className="text-black/80 font-medium leading-relaxed">
                            Handmade slime, crafted with love by Patti. Every jar is a little squeeze of
                            happiness! 💕
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 font-[var(--font-heading)] text-black">Quick Links</h3>
                        <ul className="space-y-3">
                            {["Shop All", "New Drops", "Best Sellers", "About Us", "FAQ"].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-black/70 hover:text-white transition-colors font-medium"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-black/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-black/40 text-sm font-medium">
                        © 2026 PattiCakeSlime. All rights reserved.
                    </p>
                    <p className="text-black/50 text-sm font-medium">
                        Made by <a href="https://nasware.org" target="_blank" rel="noopener noreferrer" className="text-black/70 hover:text-black font-bold transition-colors hover:underline decoration-2 underline-offset-4 decoration-vibrant-red/30">Nas</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
