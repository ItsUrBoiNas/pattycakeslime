"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SiteSetting {
    key: string;
    value: string;
}

export default function SiteContentManager() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const { data } = await supabase.from("site_settings").select("*");
        if (data) {
            const settingsMap: Record<string, string> = {};
            data.forEach((item: SiteSetting) => {
                settingsMap[item.key] = item.value;
            });
            setSettings(settingsMap);
        }
        setIsLoading(false);
    };

    const handleSave = async (key: string, value: string) => {
        setIsSaving(true);
        setMessage("");

        // Optimistic update
        setSettings(prev => ({ ...prev, [key]: value }));

        const { error } = await supabase
            .from("site_settings")
            .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

        if (error) {
            setMessage("❌ Failed to save: " + error.message);
        } else {
            setMessage("✨ Saved!");
            setTimeout(() => setMessage(""), 2000);
        }
        setIsSaving(false);
    };

    if (isLoading) return <div className="text-white/40">Loading content...</div>;

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-heading text-white">Site Customization</h2>
                    <p className="text-white/40 text-sm font-body">Edit the text on your homepage instantly.</p>
                </div>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-neon-lime/20 text-neon-lime px-4 py-2 rounded-xl text-sm font-bold"
                    >
                        {message}
                    </motion.div>
                )}
            </div>

            <div className="grid gap-6">
                {/* Hero Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-heading text-hot-pink flex items-center gap-2">
                        Hero Section
                        <span className="text-xs bg-white/10 text-white/40 px-2 py-0.5 rounded font-mono">Top of Homepage</span>
                    </h3>

                    <div className="grid gap-4">
                        <div>
                            <label className="text-xs text-white/40 uppercase font-bold mb-1 block">Main Headline</label>
                            <input
                                value={settings["hero_headline"] || ""}
                                onChange={(e) => handleSave("hero_headline", e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-hot-pink outline-none transition-colors font-heading text-xl"
                                placeholder="e.g. SHOP SLIME"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-white/40 uppercase font-bold mb-1 block">Sub-Headline</label>
                            <input
                                value={settings["hero_subheadline"] || ""}
                                onChange={(e) => handleSave("hero_subheadline", e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-hot-pink outline-none transition-colors font-heading text-lg text-neon-lime"
                                placeholder="e.g. OFFICIAL MENU"
                            />
                        </div>
                    </div>
                </div>

                {/* Announcement Bar */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-heading text-cyan-pop flex items-center gap-2">
                        Announcement Bar
                        <span className="text-xs bg-white/10 text-white/40 px-2 py-0.5 rounded font-mono">Top Banner</span>
                    </h3>
                    <div>
                        <input
                            value={settings["announcement_bar"] || ""}
                            onChange={(e) => handleSave("announcement_bar", e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-pop outline-none transition-colors text-center"
                            placeholder="e.g. Free shipping on orders over $50!"
                        />
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-heading text-neon-lime flex items-center gap-2">
                        About Patti
                        <span className="text-xs bg-white/10 text-white/40 px-2 py-0.5 rounded font-mono">Profile Section</span>
                    </h3>
                    <div>
                        <textarea
                            value={settings["about_text"] || ""}
                            onChange={(e) => handleSave("about_text", e.target.value)}
                            className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-neon-lime outline-none transition-colors resize-none"
                            placeholder="Tell your story..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
