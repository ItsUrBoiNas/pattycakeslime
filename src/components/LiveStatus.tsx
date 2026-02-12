"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function LiveStatus() {
    const [liveStatus, setLiveStatus] = useState("");
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        loadLiveStatus();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('live-status-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'site_settings' },
                () => {
                    loadLiveStatus();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const loadLiveStatus = async () => {
        const { data } = await supabase
            .from("site_settings")
            .select("value")
            .eq("key", "announcement_bar")
            .maybeSingle();

        if (data?.value) {
            setLiveStatus(data.value);
            // Check if message indicates "live" status
            setIsLive(data.value.toLowerCase().includes("live"));
        } else {
            setLiveStatus(""); // Ensure it clears if removed
            setIsLive(false);
        }
    };

    if (!liveStatus) return null;

    return (
        <div className="w-full bg-black border-b-2 border-neon-lime py-2 sticky top-0 z-[1000]">
            <div className="container mx-auto px-4 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                    {isLive && (
                        <div className="flex items-center bg-red-600 px-3 py-1 rounded-md gap-2 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                            <motion.div
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-2 h-2 bg-white rounded-full"
                            />
                            <span className="text-xs font-heading text-white tracking-widest uppercase">LIVE ON TIKTOK</span>
                        </div>
                    )}
                </div>

                <p className="text-white font-body text-sm text-center max-w-md">
                    {liveStatus}
                </p>

                {isLive && (
                    <a
                        href="https://www.tiktok.com/@memomzie"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-black font-heading text-[10px] px-6 py-1.5 rounded-full border border-black shadow-[2px_2px_0px_#fff] uppercase hover:translate-y-[-1px] transition-transform"
                    >
                        Join Stream
                    </a>
                )}
            </div>
        </div>
    );
}
