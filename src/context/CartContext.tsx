"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export interface Accessory {
    id: string;
    name: string;
    price: number;
}

export interface CartItem {
    id: string; // Unique ID for the cart item (product ID + options)
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    selectedAccessories: Accessory[];
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any, accessories: Accessory[]) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    toggleCart: () => void;
    cartTotal: number;
    subtotal: number;
    shippingCost: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [shippingCost, setShippingCost] = useState<number>(0);

    // Load from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("patticakeslime-cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart from local storage", e);
            }
        }
        setIsLoaded(true);

        // Fetch shipping cost
        const fetchShipping = async () => {
            const { data } = await supabase
                .from("site_settings")
                .select("value")
                .eq("key", "shipping_cost")
                .maybeSingle();
            if (data?.value) {
                setShippingCost(parseFloat(data.value));
            }
        };
        fetchShipping();
    }, []);

    // Save to local storage whenever items change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("patticakeslime-cart", JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToCart = (product: any, accessories: Accessory[]) => {
        // Create a unique ID based on product ID and options
        // Since we don't have real product IDs in the ProductCard yet, we'll use name as part of the ID
        const accessoryIds = accessories.map(a => a.id).sort().join("-");
        const uniqueId = `${product.name}-${accessoryIds}`;

        setItems(prev => {
            const existingItem = prev.find(item => item.id === uniqueId);
            if (existingItem) {
                return prev.map(item =>
                    item.id === uniqueId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            // Calculate base price
            // Note: ProductCard passes the base price. Accessories are now free.
            let unitPrice = product.price;

            return [...prev, {
                id: uniqueId,
                productId: product.name, // Using name as ID for now if no ID provided
                name: product.name,
                price: unitPrice,
                image: product.image,
                quantity: 1,
                selectedAccessories: accessories
            }];
        });

        setIsCartOpen(true);
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }
        setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    };

    const clearCart = () => {
        setItems([]);
    };

    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartTotal = subtotal + (items.length > 0 ? shippingCost : 0);
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            toggleCart,
            cartTotal,
            subtotal,
            shippingCost,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
