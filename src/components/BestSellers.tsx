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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('products-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                () => {
                    loadProducts();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const loadProducts = async () => {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) {
            setProducts(data);
        }
        setLoading(false);
    };

    return (
        <section id="shop" className="py-24 px-4 bg-background overflow-hidden">
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
                    <h2 className="text-5xl md:text-8xl font-heading text-white tracking-widest leading-none drop-shadow-[0_4px_0px_#ff00ff] uppercase">
                        PICK YOUR <span className="text-neon-lime">FLAVOR</span>
                    </h2>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-neon-lime/30 border-t-neon-lime rounded-full animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-white/40 font-body">No slimes available yet. Check back soon! ✨</p>
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
                            />
                        ))}
                    </div>
                )}

                {/* Info Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 flex flex-wrap justify-center gap-8 border-t border-white/10 pt-12"
                >
                    <div className="flex items-center gap-3">
                        <Zap className="w-6 h-6 text-neon-lime" />
                        <span className="text-white font-heading text-sm uppercase">Live Build Option Available</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Package className="w-6 h-6 text-hot-pink" />
                        <span className="text-white font-heading text-sm uppercase">Fast Shipping</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
