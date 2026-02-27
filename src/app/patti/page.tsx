"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Send, Trash2, Home, Package, Gem, Type, LifeBuoy, Radio, Video, ShoppingCart, Truck } from "lucide-react";
import Link from "next/link";

// Import Admin Components
import ProductManager from "@/components/admin/ProductManager";
import AccessoryManager from "@/components/admin/AccessoryManager";
import SiteContentManager from "@/components/admin/SiteContentManager";
import ContactSupport from "@/components/admin/ContactSupport";
import ViralManager from "@/components/admin/ViralManager";
import OrderManager from "@/components/admin/OrderManager";
import ShippingManager from "@/components/admin/ShippingManager";

import { Lock } from "lucide-react";

export default function PattiAdmin() {
    const [activeTab, setActiveTab] = useState("live");
    const [liveStatus, setLiveStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Auth State
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");

    useEffect(() => {
        const savedAuth = sessionStorage.getItem("patti_admin_auth");
        if (savedAuth === "true") setIsAuthorized(true);

        const fetchStatus = async () => {
            const { data } = await supabase
                .from("site_settings")
                .select("value")
                .eq("key", "live_status_text")
                .single();
            if (data?.value) setLiveStatus(data.value);
        };
        fetchStatus();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError("");
        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (data.success) {
                setIsAuthorized(true);
                sessionStorage.setItem("patti_admin_auth", "true");
            } else {
                setAuthError("Incorrect username or password! 🛑");
            }
        } catch {
            setAuthError("Login failed. Please try again.");
        }
    };

    const updateStatus = async (value: string) => {
        setLoading(true);
        setMessage("");

        const { error } = await supabase
            .from("site_settings")
            .upsert({ key: "live_status_text", value }, { onConflict: "key" });

        if (error) {
            setMessage("Error: " + error.message);
        } else {
            setMessage("Status updated successfully! ✨");
            setLiveStatus(value);
        }
        setLoading(false);
        setTimeout(() => setMessage(""), 3000);
    };

    const tabs = [
        { id: "live", label: "Live Control", icon: Radio },
        { id: "orders", label: "Orders", icon: ShoppingCart },
        { id: "shipping", label: "Shipping", icon: Truck },
        { id: "products", label: "Add/Edit Slimes", icon: Package },
        { id: "accessories", label: "Toppings", icon: Gem },
        { id: "viral", label: "TikTok Videos", icon: Video },
        { id: "content", label: "Site Text", icon: Type },
        { id: "support", label: "Help", icon: LifeBuoy }
    ];

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 font-heading">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-md bg-deep-purple/20 border-4 border-white p-8 rounded-[40px] shadow-[15px_15px_0px_#ff00ff]"
                >
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-neon-lime rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-black shadow-[4px_4px_0px_white]">
                            <Lock className="w-10 h-10 text-black" />
                        </div>
                        <h1 className="text-3xl font-heading text-white uppercase italic tracking-tighter">
                            Welcome to Your Shop, Patti
                        </h1>
                        <p className="text-white/60 uppercase tracking-widest text-xs mt-2 font-bold">Please log in below</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-neon-lime text-xs uppercase tracking-widest mb-2 font-bold ml-1">Your Name</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black border-2 border-white/20 p-4 rounded-2xl text-white focus:border-neon-lime outline-none transition-all placeholder:text-white/10"
                                placeholder="Type your name here..."
                            />
                        </div>
                        <div>
                            <label className="block text-neon-lime text-xs uppercase tracking-widest mb-2 font-bold ml-1">Your Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border-2 border-white/20 p-4 rounded-2xl text-white focus:border-neon-lime outline-none transition-all placeholder:text-white/10"
                                placeholder="Type your password here..."
                            />
                        </div>

                        {authError && (
                            <motion.p
                                initial={{ x: 10 }}
                                animate={{ x: 0 }}
                                className="text-hot-pink text-center font-bold uppercase text-sm"
                            >
                                {authError}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-neon-lime text-black py-5 rounded-2xl font-bold uppercase tracking-widest text-lg shadow-[4px_4px_0px_white] hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Log In to Shop
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-heading flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-deep-purple/20 border-r border-white/10 p-6 flex-shrink-0">
                <div className="mb-10 flex items-center justify-between">
                    <h1 className="text-2xl text-neon-lime drop-shadow-[0_2px_0px_#ff00ff] uppercase italic leading-tight">
                        Patti's<br />Dashboard
                    </h1>
                    <a href="/" className="md:hidden text-white/40 hover:text-neon-lime">
                        <Home className="w-6 h-6" />
                    </a>
                </div>

                <nav className="space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                    ? "bg-neon-lime text-black shadow-[0_0_15px_rgba(57,255,20,0.3)] scale-105"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="uppercase tracking-wider text-sm font-bold">{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-8 hidden md:block">
                    <a href="/" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors px-4">
                        <Home className="w-5 h-5" />
                        <span className="text-sm">Back to Website</span>
                    </a>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto h-screen">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-5xl mx-auto"
                >
                    {activeTab === "live" && (
                        <div className="max-w-xl">
                            <h2 className="text-3xl font-heading text-white mb-8 border-b border-white/10 pb-4">Live Status Control</h2>
                            <div className="bg-black/50 border-4 border-white p-8 rounded-3xl shadow-[10px_10px_0px_#39FF14]">
                                <label className="block text-neon-lime mb-1 text-xl tracking-widest uppercase italic">
                                    SHOW A BADGE ON YOUR WEBSITE
                                </label>
                                <p className="text-white/70 font-body text-sm mb-4">
                                    Type a message below (like "LIVE ON TIKTOK NOW") and push the green button. It will show up at the top of your website for everyone to see!
                                </p>

                                <input
                                    type="text"
                                    value={liveStatus}
                                    onChange={(e) => setLiveStatus(e.target.value)}
                                    placeholder="e.g. LIVE ON TIKTOK NOW"
                                    className="w-full bg-black border-2 border-white/20 p-4 rounded-xl mb-8 text-white focus:border-neon-lime outline-none transition-colors text-xl"
                                />

                                <div className="space-y-4">
                                    <button
                                        onClick={() => updateStatus(liveStatus)}
                                        disabled={loading}
                                        className="w-full bg-neon-lime text-black py-4 rounded-xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 text-xl font-bold shadow-[4px_4px_0px_#fff]"
                                    >
                                        <Send className="w-6 h-6" />
                                        {loading ? "UPDATING..." : "TURN ON BADGE"}
                                    </button>

                                    <button
                                        onClick={() => updateStatus("")}
                                        disabled={loading}
                                        className="w-full bg-hot-pink text-white py-4 rounded-xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 text-xl font-bold shadow-[4px_4px_0px_#1a0b2e]"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                        TURN OFF BADGE
                                    </button>
                                </div>
                                {message && (
                                    <p className={`mt-6 text-center text-lg ${message.startsWith("Error") ? "text-red-500" : "text-neon-lime"}`}>
                                        {message}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "orders" && <OrderManager />}
                    {activeTab === "shipping" && <ShippingManager />}
                    {activeTab === "products" && <ProductManager />}
                    {activeTab === "accessories" && <AccessoryManager />}
                    {activeTab === "viral" && <ViralManager />}
                    {activeTab === "content" && <SiteContentManager />}
                    {activeTab === "support" && <ContactSupport />}
                </motion.div>
            </div>
        </div>
    );
}
