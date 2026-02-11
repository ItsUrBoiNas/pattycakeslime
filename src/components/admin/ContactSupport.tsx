"use client";

import { Mail, Phone, MessageSquare, Heart } from "lucide-react";

export default function ContactSupport() {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-heading text-white">Need Help?</h2>
                <p className="text-white/60 font-body">Contact Nas for technical support or website updates.</p>
            </div>

            <div className="grid gap-4">
                {/* Phone Numbers */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-6 group hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 bg-neon-lime/20 rounded-full flex items-center justify-center text-neon-lime group-hover:scale-110 transition-transform">
                        <Phone className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-white font-heading text-lg">Phone Support</h3>
                        <p className="text-white/40 text-sm mb-2">Call or Text anytime</p>
                        <div className="flex flex-col gap-1">
                            <a href="tel:9412573059" className="text-xl text-white font-mono hover:text-neon-lime transition-colors">941-257-3059</a>
                            <a href="tel:2392954252" className="text-xl text-white font-mono hover:text-neon-lime transition-colors">239-295-4252</a>
                        </div>
                    </div>
                </div>

                {/* Emails */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-6 group hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 bg-hot-pink/20 rounded-full flex items-center justify-center text-hot-pink group-hover:scale-110 transition-transform">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-white font-heading text-lg">Email Support</h3>
                        <p className="text-white/40 text-sm mb-2">For detailed requests or files</p>
                        <div className="flex flex-col gap-1">
                            <a href="mailto:nasir.henken@outlook.com" className="text-lg text-white font-body hover:text-hot-pink transition-colors">nasir.henken@outlook.com</a>
                            <a href="mailto:hnas62200@gmail.com" className="text-lg text-white font-body hover:text-hot-pink transition-colors">hnas62200@gmail.com</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center pt-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-sm">
                    <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                    <span>Built with love by Nasware</span>
                </div>
            </div>
        </div>
    );
}
