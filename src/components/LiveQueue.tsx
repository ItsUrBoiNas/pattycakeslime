"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const INITIAL_ORDERS = [
    { name: "Sarah K.", item: "Cloud Slime", status: "Mixing" },
    { name: "Mike T.", item: "Butter Slime", status: "Queue #1" },
    { name: "Jessica R.", item: "Crunchy Slime", status: "Queue #2" },
    { name: "Alex M.", item: "Clear Slime", status: "Queue #3" },
];

export default function LiveQueue() {
    const [orders, setOrders] = useState(INITIAL_ORDERS);

    // Simulate queue movement
    useEffect(() => {
        const interval = setInterval(() => {
            setOrders((prev) => {
                const newOrders = [...prev];
                const first = newOrders.shift();
                if (first) newOrders.push(first);
                return newOrders;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-black/40 border-y border-white/10 py-3 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-heading text-neon-lime text-xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] stroke-black">
                        LIVE QUEUE
                    </h3>
                    <span className="text-white/60 text-xs font-body">
                        Order now to see your slime made next!
                    </span>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                    {orders.map((order, idx) => (
                        <motion.div
                            key={`${order.name}-${idx}`}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex-shrink-0 p-3 rounded-lg border-2 ${idx === 0
                                    ? "bg-neon-lime/10 border-neon-lime shadow-[0_0_15px_rgba(57,255,20,0.3)]"
                                    : "bg-white/5 border-white/10"
                                }`}
                        >
                            <div className="flex flex-col min-w-[140px]">
                                <span className={`font-heading text-sm ${idx === 0 ? "text-neon-lime" : "text-white"}`}>
                                    {order.name}
                                </span>
                                <span className="text-xs text-white/70 font-body">{order.item}</span>
                                <span className={`text-[10px] uppercase font-bold mt-1 ${idx === 0 ? "text-yellow-400" : "text-white/40"
                                    }`}>
                                    {idx === 0 ? "⚡ BEING MADE NOW" : order.status}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
