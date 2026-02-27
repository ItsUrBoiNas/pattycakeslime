"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, ChevronDown, ChevronUp, MapPin, Phone, DollarSign } from "lucide-react";

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    customerName: string;
    customerCashtag: string;
    shippingAddress: string;
    city: string;
    state: string;
    zip: string;
    phoneNumber: string;
    orderItems: OrderItem[];
    totalPrice: number;
    status: 'Pending Payment' | 'Paid' | 'Shipped';
    createdAt: string;
}

export default function OrderManager() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            if (data.docs) {
                setOrders(data.docs);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                body: JSON.stringify({ id, status: newStatus }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                // Optimistic update
                setOrders(orders.map(order =>
                    order.id === id ? { ...order, status: newStatus as any } : order
                ));
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'text-green-500 bg-green-950/30 border-green-500/20';
            case 'Shipped': return 'text-blue-400 bg-blue-950/30 border-blue-400/20';
            default: return 'text-yellow-500 bg-yellow-950/30 border-yellow-500/20';
        }
    };

    if (loading) {
        return <div className="text-white text-center py-12 animate-pulse">Loading Orders...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-heading text-white mb-8 border-b border-white/10 pb-4 flex justify-between items-center">
                Your Customers' Orders
                <span className="text-sm bg-neon-lime text-black px-3 py-1 rounded-full">{orders.length} Total</span>
            </h2>

            {orders.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                    <Package className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-xl">No orders yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-black/50 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
                        >
                            <div
                                className="p-6 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                            >
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        {order.customerName}
                                        <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </h3>
                                    <p className="text-white/60 text-sm mt-1">
                                        ID: {order.id.substring(0, 8)}... • {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-2xl font-bold text-neon-lime">${order.totalPrice.toFixed(2)}</p>
                                    <p className="text-sm text-green-400">{order.customerCashtag}</p>
                                </div>

                                <div className="text-white/60 flex items-center gap-2 font-body text-sm bg-white/5 py-2 px-4 rounded-xl hover:bg-white/10 transition-colors">
                                    {expandedOrderId === order.id ? (
                                        <>Close Details <ChevronUp className="w-4 h-4" /></>
                                    ) : (
                                        <>Click for Full Order Details <ChevronDown className="w-4 h-4" /></>
                                    )}
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedOrderId === order.id && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        className="overflow-hidden bg-white/5 border-t border-white/10"
                                    >
                                        <div className="p-6 grid md:grid-cols-2 gap-8">
                                            {/* Order Details */}
                                            <div>
                                                <h4 className="text-sm uppercase tracking-widest text-white/40 mb-4 font-bold">Items Ordered</h4>
                                                <ul className="space-y-3">
                                                    {order.orderItems.map((item, idx) => (
                                                        <li key={idx} className="flex justify-between items-center text-white/80 border-b border-white/5 pb-2">
                                                            <span>{item.quantity}x {item.name}</span>
                                                            <span>${item.price.toFixed(2)}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Customer Details */}
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-sm uppercase tracking-widest text-white/40 mb-4 font-bold">Shipping Info</h4>
                                                    <div className="flex items-start gap-3 text-white/80">
                                                        <MapPin className="w-5 h-5 text-neon-lime shrink-0" />
                                                        <p>
                                                            {order.shippingAddress}<br />
                                                            {order.city}, {order.state} {order.zip}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-3 text-white/80 mb-4">
                                                        <Phone className="w-5 h-5 text-neon-lime shrink-0" />
                                                        <p>{order.phoneNumber}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm uppercase tracking-widest text-white/40 mb-2 font-bold">Change Order Status To:</h4>
                                                    <div className="flex gap-2">
                                                        {['Pending Payment', 'Paid', 'Shipped'].map((status) => (
                                                            <button
                                                                key={status}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateStatus(order.id, status);
                                                                }}
                                                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${order.status === status
                                                                    ? 'bg-white text-black'
                                                                    : 'bg-white/10 text-white hover:bg-white/20'
                                                                    }`}
                                                            >
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
