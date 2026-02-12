"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShoppingCart, Zap, Check, Gem } from "lucide-react";
import Image from "next/image";

import { useCart, Accessory } from "@/context/CartContext";

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

    const { addToCart } = useCart();

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

        // Get full accessory objects
        const selectedAccessoryObjects = accessories.filter(a => selectedAccessories.includes(a.id));

        addToCart(
            { name, price, image },
            selectedAccessoryObjects,
            makeItLive
        );

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
                className="bg-white border-4 border-black rounded-[2rem] overflow-hidden group p-3 flex flex-col h-full shadow-[8px_8px_0px_var(--neon-lime)] hover:shadow-[12px_12px_0px_var(--hot-pink)] transition-shadow duration-300 relative"
            >
                {/* Image Area */}
                <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-gray-50 border-2 border-black/5 mb-4 px-4 pt-4">
                    {tag && (
                        <div className="absolute top-4 left-4 z-10 bg-electric-blue text-white font-heading text-[10px] px-3 py-1 rounded-md shadow-lg uppercase tracking-widest border-2 border-black">
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
                        <h3 className="text-xl font-heading text-black uppercase tracking-tight">{name}</h3>
                        <span className="text-vibrant-red font-heading text-xl">${finalPrice.toFixed(2)}</span>
                    </div>

                    {description && (
                        <p className="text-[10px] text-black/60 font-heading uppercase tracking-widest mb-4">
                            {description}
                        </p>
                    )}

                    {/* Accessories */}
                    {accessories.length > 0 && (
                        <div className="mb-4 space-y-2">
                            <p className="text-[10px] text-black/40 font-heading uppercase tracking-widest">Customize:</p>
                            <div className="flex flex-wrap gap-2">
                                {accessories.map(acc => {
                                    const isSelected = selectedAccessories.includes(acc.id);
                                    return (
                                        <button
                                            key={acc.id}
                                            onClick={() => toggleAccessory(acc.id)}
                                            className={`text-[10px] px-2 py-1 rounded-lg border-2 transition-all flex items-center gap-1 font-bold ${isSelected
                                                ? "bg-hot-pink text-white border-black shadow-[2px_2px_0px_black]"
                                                : "bg-gray-100 text-black/60 border-transparent hover:bg-gray-200"
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
                            ? 'border-black bg-neon-lime shadow-[4px_4px_0px_black]'
                            : 'border-black/5 bg-gray-50 hover:border-black/10'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${makeItLive ? 'bg-black text-neon-lime' : 'bg-black/5 text-black/40'}`}>
                                <Zap className="w-4 h-4" />
                            </div>
                            <span className={`text-[10px] font-heading uppercase tracking-widest ${makeItLive ? 'text-black font-bold' : 'text-black/40'}`}>
                                Make it Live
                            </span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${makeItLive ? 'border-black bg-black' : 'border-black/20'}`}>
                            {makeItLive && <Check className="w-3 h-3 text-neon-lime stroke-[3px]" />}
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
                                : 'bg-bright-yellow text-black shadow-[4px_4px_0px_var(--vibrant-red)] hover:shadow-none'
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
