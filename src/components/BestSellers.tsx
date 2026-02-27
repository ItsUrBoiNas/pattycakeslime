"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Zap, Package, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Product {
    id: string;
    name: string;
    price: number;
    description: string | null;
    tag: string | null;
    image_url: string | null;
    is_pre_made: boolean;
}

export default function ShopSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [accessories, setAccessories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('shop-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => loadData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'accessories' }, () => loadData())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const loadData = async () => {
        const [prodRes, accRes] = await Promise.all([
            supabase.from("products").select("*").order("created_at", { ascending: false }),
            supabase.from("accessories").select("*").eq("is_active", true).order("price", { ascending: true })
        ]);

        if (prodRes.data) setProducts(prodRes.data);
        if (accRes.data) setAccessories(accRes.data);
        setLoading(false);
    };

    return (
        <section id="shop" className="py-24 px-4 bg-[#F8FAFC] overflow-hidden relative border-t-4 border-sky-blue/20">
            {/* Soft background glow to maintain depth without messiness */}
            <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-sky-blue/5 to-transparent pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center mb-16 gap-4 text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-slime-goo-pink text-white font-bold px-5 py-1.5 rounded-full font-body text-sm uppercase mb-2 shadow-sm">
                        <Sparkles className="w-4 h-4 fill-current" />
                        In Stock Now
                    </div>
                    <h2 className="text-4xl md:text-6xl font-heading text-black tracking-wide leading-tight uppercase font-black">
                        BEST <span className="text-slime-goo-pink">SELLERS</span>
                    </h2>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-sky-blue/30 border-t-sky-blue rounded-full animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-black/50 font-body text-lg">No slimes available yet. Check back soon! ✨</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                image={product.image_url || "/products/cloud-slime.png"}
                                description={product.description || "Handmade slime"}
                                tag={product.tag || ""}
                                isPreMade={product.is_pre_made}
                                accessories={accessories}
                            />
                        ))}
                    </div>
                )}

                {/* Info Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-24 flex flex-wrap justify-center border-t border-black/5 pt-12"
                >
                    <div className="flex items-center gap-3">
                        <Package className="w-6 h-6 text-sky-blue" />
                        <span className="text-black/80 font-heading text-sm font-semibold uppercase tracking-wider">Fast Shipping</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
