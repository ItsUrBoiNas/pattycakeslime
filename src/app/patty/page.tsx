"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, Sparkles, Image as ImageIcon, Tag, Hash, Save, LogOut, Plus, Trash2, Edit3, X } from "lucide-react";
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

export default function PattyPage() {
    const [isLogged, setIsLogged] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Dashboard state
    const [liveStatus, setLiveStatus] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Check for existing session
    useEffect(() => {
        const session = localStorage.getItem("patty_session");
        if (session === "active") {
            setIsLogged(true);
        }
    }, []);

    // Load data when logged in
    useEffect(() => {
        if (isLogged) {
            loadLiveStatus();
            loadProducts();
        }
    }, [isLogged]);

    const loadLiveStatus = async () => {
        const { data, error } = await supabase
            .from("site_settings")
            .select("value")
            .eq("key", "live_status")
            .single();

        if (data) {
            setLiveStatus(data.value || "");
        }
    };

    const loadProducts = async () => {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) {
            setProducts(data);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        setTimeout(() => {
            if (username === "pattycakeslime" && password === "pattycakeslime") {
                setIsLogged(true);
                localStorage.setItem("patty_session", "active");
            } else {
                setError("Oops! Wrong magic words. Try again! ✨");
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleLogout = () => {
        setIsLogged(false);
        localStorage.removeItem("patty_session");
    };

    const handleSaveLiveStatus = async () => {
        setIsSaving(true);
        const { error } = await supabase
            .from("site_settings")
            .update({ value: liveStatus, updated_at: new Date().toISOString() })
            .eq("key", "live_status");

        if (!error) {
            alert("✨ Live status updated!");
        } else {
            alert("❌ Error saving: " + error.message);
        }
        setIsSaving(false);
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Delete this slime? This can't be undone!")) return;

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id);

        if (!error) {
            loadProducts();
        }
    };

    const handleUpdateProduct = async (product: Product) => {
        const { error } = await supabase
            .from("products")
            .update({
                name: product.name,
                price: product.price,
                description: product.description,
                tag: product.tag
            })
            .eq("id", product.id);

        if (!error) {
            loadProducts();
            setEditingProduct(null);
        }
    };

    if (!isLogged) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-deep-purple p-4 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-hot-pink opacity-20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-lime opacity-20 blur-[120px] rounded-full animate-pulse" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md glass p-8 rounded-[32px] relative z-10 border-2 border-white/10"
                >
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="inline-block p-4 rounded-2xl bg-white/5 mb-4"
                        >
                            <Sparkles className="w-8 h-8 text-cyan-pop" />
                        </motion.div>
                        <h1 className="text-3xl font-heading text-white mb-2 tracking-tight">Patti's Magic Portal</h1>
                        <p className="text-white/60 font-body">Login to update your slime shop!</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white/80 ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-pop/50 transition-all font-body"
                                    placeholder="pattycakeslime"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white/80 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-hot-pink/50 transition-all font-body"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-hot-pink text-sm font-semibold bg-hot-pink/10 p-3 rounded-xl border border-hot-pink/20"
                                >
                                    {error}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-cyan-pop hover:bg-white text-deep-purple font-heading py-4 rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-deep-purple/30 border-t-deep-purple rounded-full animate-spin" />
                            ) : (
                                "Open Sesame! ✨"
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    // Dashboard View
    return (
        <div className="min-h-screen bg-deep-purple">
            {/* Admin Header */}
            <header className="glass border-b border-white/10 p-4 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-hot-pink rounded-xl flex items-center justify-center">
                            <Edit3 className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-heading text-white leading-none">Patti's Dashboard</h1>
                            <p className="text-xs text-white/50 font-body uppercase tracking-wider">Store Management</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-white/60 hover:text-hot-pink transition-colors font-body"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="glass p-6 rounded-[32px] border border-white/10">
                            <h3 className="text-lg font-heading text-white mb-4 flex items-center gap-2">
                                <Hash className="w-5 h-5 text-neon-lime" />
                                Live Status
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-white/60 ml-1">Status Message</label>
                                    <textarea
                                        value={liveStatus}
                                        onChange={(e) => setLiveStatus(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-neon-lime/50 min-h-[80px] text-sm font-body"
                                        placeholder="E.g. Currently making Blue Rocks! 💎"
                                    />
                                </div>
                                <button
                                    onClick={handleSaveLiveStatus}
                                    disabled={isSaving}
                                    className="w-full bg-neon-lime text-deep-purple font-heading py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {isSaving ? "Saving..." : "Update Status"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Management */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-heading text-white">Cloud Menu</h2>
                                <p className="text-white/40 text-sm font-body">Manage your slime inventory ({products.length} items)</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-hot-pink text-white font-heading px-6 py-3 rounded-2xl hover:scale-105 hover:shadow-[0_0_20px_rgba(255,0,255,0.3)] active:scale-95 transition-all flex items-center gap-2 text-sm"
                            >
                                <Plus className="w-5 h-5" />
                                New Slime
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onDelete={handleDeleteProduct}
                                    onEdit={setEditingProduct}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </main>

            {/* Edit Modal */}
            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSave={handleUpdateProduct}
                />
            )}

            {/* Add Modal */}
            {showAddModal && (
                <AddProductModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        loadProducts();
                    }}
                />
            )}
        </div>
    );
}

function ProductCard({ product, onDelete, onEdit }: { product: Product; onDelete: (id: string) => void; onEdit: (p: Product) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="glass rounded-[2rem] border border-white/10 overflow-hidden group"
        >
            <div className="aspect-video bg-white/5 relative overflow-hidden">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/5 group-hover:scale-110 transition-transform duration-500">
                        <ImageIcon className="w-16 h-16" />
                    </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <button
                        onClick={() => onEdit(product)}
                        className="p-2.5 bg-deep-purple/90 backdrop-blur-md rounded-xl text-white hover:text-cyan-pop transition-colors shadow-xl"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(product.id)}
                        className="p-2.5 bg-deep-purple/90 backdrop-blur-md rounded-xl text-white hover:text-hot-pink transition-colors shadow-xl"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                {product.tag && (
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-deep-purple/80 backdrop-blur-md text-[10px] font-bold text-white/60 px-2 py-1 rounded-md border border-white/10 uppercase tracking-widest">
                            {product.tag}
                        </span>
                    </div>
                )}
            </div>
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading text-lg text-white group-hover:text-cyan-pop transition-colors">{product.name}</h3>
                    <span className="text-neon-lime font-heading text-lg">${product.price.toFixed(2)}</span>
                </div>
                <p className="text-white/40 text-sm font-body mb-6 line-clamp-2">
                    {product.description || "No description"}
                </p>
            </div>
        </motion.div>
    );
}

function EditProductModal({ product, onClose, onSave }: { product: Product; onClose: () => void; onSave: (p: Product) => void }) {
    const [editedProduct, setEditedProduct] = useState(product);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-[32px] border border-white/10 max-w-md w-full"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-heading text-white">Edit Slime</h2>
                    <button onClick={onClose} className="text-white/60 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-white/60 ml-1">Name</label>
                        <input
                            type="text"
                            value={editedProduct.name}
                            onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-pop/50 font-body"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-white/60 ml-1">Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={editedProduct.price}
                            onChange={(e) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-pop/50 font-body"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-white/60 ml-1">Tag</label>
                        <input
                            type="text"
                            value={editedProduct.tag || ""}
                            onChange={(e) => setEditedProduct({ ...editedProduct, tag: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-pop/50 font-body"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-white/60 ml-1">Description</label>
                        <textarea
                            value={editedProduct.description || ""}
                            onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-pop/50 min-h-[80px] font-body"
                        />
                    </div>

                    <button
                        onClick={() => onSave(editedProduct)}
                        className="w-full bg-cyan-pop text-deep-purple font-heading py-3 rounded-xl hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] active:scale-95 transition-all"
                    >
                        Save Changes
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function AddProductModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: 5.00,
        tag: "",
        description: "",
        is_pre_made: true
    });
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        if (!newProduct.name) {
            alert("Please enter a name!");
            return;
        }

        setIsAdding(true);
        const { error } = await supabase
            .from("products")
            .insert([newProduct]);

        if (!error) {
            onSuccess();
        } else {
            alert("Error adding product: " + error.message);
        }
        setIsAdding(false);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-[32px] border border-white/10 max-w-md w-full"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-heading text-white">Add New Slime</h2>
                    <button onClick={onClose} className="text-white/60 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-white/60 ml-1">Name</label>
                        <input
                            type="text"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-pop/50 font-body"
                            placeholder="E.g. Blue Rocks"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-white/60 ml-1">Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-pop/50 font-body"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-white/60 ml-1">Tag</label>
                        <input
                            type="text"
                            value={newProduct.tag}
                            onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-pop/50 font-body"
                            placeholder="E.g. CYAN"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-white/60 ml-1">Description</label>
                        <textarea
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-pop/50 min-h-[80px] font-body"
                            placeholder="Handmade slime with premium scents..."
                        />
                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={isAdding}
                        className="w-full bg-hot-pink text-white font-heading py-3 rounded-xl hover:shadow-[0_0_15px_rgba(255,0,255,0.3)] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isAdding ? "Adding..." : "Add Slime ✨"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
