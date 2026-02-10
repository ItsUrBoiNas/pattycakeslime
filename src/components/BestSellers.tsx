"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { TrendingUp } from "lucide-react";

const products = [
    {
        name: "Cloud Nine Slime",
        price: 12.99,
        originalPrice: 16.99,
        image: "/products/cloud-slime.png",
        rating: 5,
        tag: "BEST SELLER",
        color: "bg-gradient-to-br from-sky-200 to-blue-300",
    },
    {
        name: "Butter Dream",
        price: 14.99,
        image: "/products/butter-slime.png",
        rating: 5,
        tag: "NEW DROP",
        color: "bg-gradient-to-br from-yellow-200 to-amber-300",
    },
    {
        name: "Galaxy Crunch",
        price: 13.99,
        originalPrice: 17.99,
        image: "/products/galaxy-slime.png",
        rating: 4,
        tag: "LIMITED",
        color: "bg-gradient-to-br from-purple-300 to-indigo-400",
    },
];

export default function BestSellers() {
    return (
        <section id="shop" className="py-16 sm:py-24 px-4 bg-off-white">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-slime-green/20 text-slime-green px-5 py-2 rounded-full mb-4">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-bold text-sm uppercase tracking-wider text-foreground">Trending Now</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold font-[var(--font-heading)] text-foreground">
                        Best Sellers ⭐
                    </h2>
                    <p className="text-lg text-foreground/60 mt-3 font-semibold max-w-lg mx-auto">
                        Our most loved slimes — grab them before they&apos;re gone!
                    </p>
                </motion.div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.name} {...product} />
                    ))}
                </div>

                {/* View All CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <motion.a
                        href="#"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 border-2 border-foreground text-foreground font-bold text-lg px-8 py-4 rounded-full hover:bg-foreground hover:text-white transition-colors"
                    >
                        View All Slimes →
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}
