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
        <section id="shop" className="py-24 px-4 bg-slime-purple overflow-hidden relative">
            {/* Top Drip (Already handled by Hero's bottom drip visually if they match, but let's add a top drip for safety if needed, or rely on the previous section's overlap) 
                Actually, the SVG in Hero points DOWN INTO this section. So this section just needs the bg color.
            */}
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center mb-16 gap-4 text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-neon-lime text-black px-4 py-1 rounded-full font-heading text-xs uppercase mb-2 shadow-[4px_4px_0px_#fff]">
                        <Sparkles className="w-4 h-4 fill-current" />
                        Official Menu
                    </div>
                    <h2 className="text-5xl md:text-8xl font-heading text-black tracking-widest leading-none drop-shadow-[4px_4px_0px_var(--neon-lime)] uppercase stroke-black">
                        PICK YOUR <span className="text-electric-blue">FLAVOR</span>
                    </h2>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-neon-lime/30 border-t-neon-lime rounded-full animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-black/40 font-body">No slimes available yet. Check back soon! ✨</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
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
                    className="mt-20 flex flex-wrap justify-center gap-8 border-t border-black/10 pt-12"
                >
                    <div className="flex items-center gap-3">
                        <Zap className="w-6 h-6 text-electric-blue" />
                        <span className="text-black font-heading text-sm uppercase">Live Build Option Available</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Package className="w-6 h-6 text-vibrant-red" />
                        <span className="text-black font-heading text-sm uppercase">Fast Shipping</span>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Drip Divider */}
            <div className="absolute bottom-0 left-0 w-full leading-none z-20 transform rotate-180">
                <svg className="w-full h-12 md:h-24 text-slime-blue fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>
        </section >
    );
}
