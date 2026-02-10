"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating?: number;
    tag?: string;
    color: string;
}

export default function ProductCard({
    name,
    price,
    originalPrice,
    image,
    rating = 5,
    tag,
    color,
}: ProductCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse position for 3D tilt
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    // Smooth spring physics for the tilt
    const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

    // Transform mouse position to rotation values
    const rotateX = useTransform(springY, [0, 1], [8, -8]);
    const rotateY = useTransform(springX, [0, 1], [-8, 8]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
    };

    const handleMouseLeave = () => {
        mouseX.set(0.5);
        mouseY.set(0.5);
        setIsHovered(false);
    };

    return (
        <div className="perspective-1000">
            <motion.div
                ref={cardRef}
                style={{
                    rotateX: isHovered ? rotateX : 0,
                    rotateY: isHovered ? rotateY : 0,
                    transformStyle: "preserve-3d",
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                whileHover={{ z: 30 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer group"
            >
                {/* Image Container */}
                <div className={`relative aspect-square overflow-hidden ${color}`}>
                    {tag && (
                        <span className="absolute top-4 left-4 z-10 bg-bubblegum-pink text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
                            {tag}
                        </span>
                    )}
                    <motion.div
                        animate={isHovered ? { scale: 1.08, y: -5 } : { scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-full h-full flex items-center justify-center"
                        style={{ transformStyle: "preserve-3d", transform: "translateZ(40px)" }}
                    >
                        <Image
                            src={image}
                            alt={name}
                            width={400}
                            height={400}
                            className="object-cover w-full h-full"
                        />
                    </motion.div>
                </div>

                {/* Info */}
                <div className="p-5 sm:p-6">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < rating ? "fill-sunshine-yellow text-sunshine-yellow" : "text-gray-200"}`}
                            />
                        ))}
                        <span className="text-sm text-foreground/50 ml-1 font-semibold">({rating}.0)</span>
                    </div>

                    {/* Name */}
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 font-[var(--font-heading)]">
                        {name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl sm:text-3xl font-bold text-electric-purple">
                            ${price.toFixed(2)}
                        </span>
                        {originalPrice && (
                            <span className="text-lg text-foreground/40 line-through">
                                ${originalPrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button — full width */}
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(163, 230, 53, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-center gap-2 bg-slime-green text-foreground font-bold text-lg py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
