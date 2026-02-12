"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Truck, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ShippingManager() {
    const [shippingCost, setShippingCost] = useState<string>("0");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadShippingCost();
    }, []);

    const loadShippingCost = async () => {
        const { data, error } = await supabase
            .from("site_settings")
            .select("value")
            .eq("key", "shipping_cost")
            .maybeSingle();

        if (data) {
            setShippingCost(data.value);
        }
        setIsLoading(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage("");

        const { error } = await supabase
            .from("site_settings")
            .upsert({
                key: "shipping_cost",
                value: shippingCost,
                updated_at: new Date().toISOString()
            }, { onConflict: 'key' });

        if (error) {
            setMessage("❌ Failed to save: " + error.message);
        } else {
            setMessage("✨ Shipping cost updated!");
            setTimeout(() => setMessage(""), 3000);
        }
        setIsSaving(false);
    };

    if (isLoading) return <div className="text-white/40">Loading shipping settings...</div>;

    return (
        <div className="space-y-8 max-w-xl">
            <div>
                <h2 className="text-3xl font-heading text-white mb-2">Shipping & Handling</h2>
                <p className="text-white/40 text-sm font-body uppercase tracking-widest">Set the flat rate for all orders.</p>
            </div>

            <div className="bg-white/5 border-4 border-white p-8 rounded-3xl shadow-[10px_10px_0px_#ff00ff]">
                <label className="block text-hot-pink mb-4 text-xl tracking-widest uppercase italic font-bold">
                    Flat Rate Shipping ($)
                </label>

                <div className="relative mb-8">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <input
                        type="number"
                        step="0.01"
                        value={shippingCost}
                        onChange={(e) => setShippingCost(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-black border-2 border-white/20 p-4 pl-12 rounded-xl text-white focus:border-neon-lime outline-none transition-colors text-2xl font-bold"
                    />
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full bg-neon-lime text-black py-4 rounded-xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 text-xl font-bold shadow-[4px_4px_0px_#fff]"
                    >
                        <Save className="w-6 h-6" />
                        {isSaving ? "SAVING..." : "SAVE SHIPPING COST"}
                    </button>

                    {message && (
                        <motion.p
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-center text-lg font-bold ${message.startsWith("❌") ? "text-red-500" : "text-neon-lime"}`}
                        >
                            {message}
                        </motion.p>
                    )}
                </div>

                <div className="mt-8 flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <Truck className="w-5 h-5 text-cyan-pop shrink-0 mt-1" />
                    <p className="text-white/60 text-xs leading-relaxed uppercase tracking-wider">
                        This amount will be added to the subtotal in the cart and checkout pages. Set to 0 if you want to offer free shipping.
                    </p>
                </div>
            </div>
        </div>
    );
}
