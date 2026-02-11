"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShoppingCart, Zap, Check, Gem } from "lucide-react";
import Image from "next/image";

interface Accessory {
    id: string;
    name: string;
    price: number;
}

interface ProductCardProps {
    name: string;
    price: number;
    image: string;
    description?: string;
    tag?: string;
    isPreMade?: boolean;
    accessories?: Accessory[];
}

export default function ProductCard({
    name,
    price,
    image,
    description,
    tag,
    accessories = []
}: ProductCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [makeItLive, setMakeItLive] = useState(false);
    const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
    const [added, setAdded] = useState(false);

    // Calculate total
    const accessoriesTotal = selectedAccessories.reduce((sum, id) => {
        const acc = accessories.find(a => a.id === id);
        return sum + (acc ? acc.price : 0);
    }, 0);

    const finalPrice = price + accessoriesTotal;

    // Mouse position for 3D tilt
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

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

    const toggleAccessory = (id: string) => {
        setSelectedAccessories(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const handleAddToCart = () => {
        setAdded(true);
        // Here you would actually add to cart
        console.log("Added to cart:", { name, finalPrice, makeItLive, selectedAccessories });
        setTimeout(() => setAdded(false), 2000);
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
                whileHover={{ z: 20 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#1a0b2e] border-2 border-white/5 rounded-[2rem] overflow-hidden group p-3 flex flex-col h-full shadow-2xl relative"
            >
                {/* Image Area */}
                <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-black/40 border border-white/5 mb-4 px-4 pt-4">
                    {tag && (
                        <div className="absolute top-4 left-4 z-10 bg-white text-black font-heading text-[10px] px-3 py-1 rounded-md shadow-lg uppercase tracking-widest border border-black">
                            {tag}
                        </div>
                    )}
                    <motion.div
                        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                        className="w-full h-full"
                    >
                        <Image
                            src={image}
                            alt={name}
                            width={400}
                            height={400}
                            className="object-contain w-full h-full"
                        />
                    </motion.div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow px-2 pb-2">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-heading text-white uppercase tracking-tight">{name}</h3>
                        <span className="text-neon-lime font-heading text-xl">${finalPrice.toFixed(2)}</span>
                    </div>

                    {description && (
                        <p className="text-[10px] text-white/40 font-heading uppercase tracking-widest mb-4">
                            {description}
                        </p>
                    )}

                    {/* Accessories */}
                    {accessories.length > 0 && (
                        <div className="mb-4 space-y-2">
                            <p className="text-[10px] text-white/40 font-heading uppercase tracking-widest">Customize:</p>
                            <div className="flex flex-wrap gap-2">
                                {accessories.map(acc => {
                                    const isSelected = selectedAccessories.includes(acc.id);
                                    return (
                                        <button
                                            key={acc.id}
                                            onClick={() => toggleAccessory(acc.id)}
                                            className={`text-[10px] px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${isSelected
                                                    ? "bg-hot-pink text-white border-white/20 shadow-[0_0_10px_rgba(255,0,255,0.4)]"
                                                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                                                }`}
                                        >
                                            {isSelected && <Check className="w-3 h-3" />}
                                            {acc.name} (+${acc.price.toFixed(2)})
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Make it Live Toggle */}
                    <button
                        onClick={() => setMakeItLive(!makeItLive)}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all mb-4 ${makeItLive
                            ? 'border-neon-lime bg-neon-lime/10 shadow-[0_0_15px_rgba(57,255,20,0.2)]'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${makeItLive ? 'bg-neon-lime text-black' : 'bg-white/10 text-white/40'}`}>
                                <Zap className="w-4 h-4" />
                            </div>
                            <span className={`text-[10px] font-heading uppercase tracking-widest ${makeItLive ? 'text-white' : 'text-white/40'}`}>
                                Make it Live
                            </span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${makeItLive ? 'border-neon-lime bg-neon-lime' : 'border-white/20'}`}>
                            {makeItLive && <Check className="w-3 h-3 text-black stroke-[3px]" />}
                        </div>
                    </button>

                    {/* Add to Cart Button */}
                    <div className="mt-auto pt-2">
                        <motion.button
                            onClick={handleAddToCart}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center justify-center gap-2 font-heading py-4 rounded-xl border-2 border-black transition-all ${added
                                ? 'bg-green-500 text-white border-green-600'
                                : 'bg-white text-black shadow-[4px_4px_0px_var(--neon-lime)] hover:shadow-none'
                                }`}
                        >
                            {added ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    ADDED!
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" />
                                    ADD TO CART
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-neon-lime/5 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute -top-2 -left-2 w-24 h-24 bg-hot-pink/5 blur-3xl rounded-full pointer-events-none" />
            </motion.div>
        </div>
    );
}
