"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit3, X, Image as ImageIcon, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

async function uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

    if (uploadError) {
        throw uploadError;
    }

    const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

    return data.publicUrl;
}

interface Product {
    id: string;
    name: string;
    price: number;
    description: string | null;
    tag: string | null;
    image_url: string | null;
    is_pre_made: boolean;
}

export default function ProductManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const { data } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setProducts(data);
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Delete this slime? This can't be undone!")) return;
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (!error) loadProducts();
    };

    const handleUpdateProduct = async (product: Product, newImageFile?: File) => {
        let imageUrl = product.image_url;

        if (newImageFile) {
            try {
                imageUrl = await uploadImage(newImageFile);
            } catch (error) {
                alert("Error uploading image: " + error);
                return;
            }
        }

        const { error } = await supabase
            .from("products")
            .update({
                name: product.name,
                price: product.price,
                description: product.description,
                tag: product.tag,
                image_url: imageUrl
            })
            .eq("id", product.id);

        if (!error) {
            loadProducts();
            setEditingProduct(null);
        }
    };

    return (
        <div className="space-y-6">
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

            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSave={handleUpdateProduct}
                />
            )}

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

function EditProductModal({ product, onClose, onSave }: { product: Product; onClose: () => void; onSave: (p: Product, file?: File) => void }) {
    const [editedProduct, setEditedProduct] = useState(product);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleSave = async () => {
        setIsUploading(true);
        await onSave(editedProduct, imageFile || undefined);
        setIsUploading(false);
    };

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

                    <div>
                        <label className="text-sm font-semibold text-white/60 ml-1">Image</label>
                        <div className="flex items-center gap-4">
                            {editedProduct.image_url && !imageFile && (
                                <img src={editedProduct.image_url} alt="Current" className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                            )}
                            <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                                <Upload className="w-4 h-4" />
                                <span className="text-sm">{imageFile ? "Change Image" : "Upload New Image"}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                />
                            </label>
                            {imageFile && <span className="text-xs text-neon-lime">{imageFile.name}</span>}
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isUploading}
                        className="w-full bg-cyan-pop text-deep-purple font-heading py-3 rounded-xl hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isUploading ? "Uploading & Saving..." : "Save Changes"}
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
        is_pre_made: true,
        image_url: ""
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        if (!newProduct.name) {
            alert("Please enter a name!");
            return;
        }

        setIsAdding(true);

        let imageUrl = "";
        if (imageFile) {
            try {
                imageUrl = await uploadImage(imageFile);
            } catch (error) {
                alert("Error uploading image: " + error);
                setIsAdding(false);
                return;
            }
        }

        const { error } = await supabase
            .from("products")
            .insert([{ ...newProduct, image_url: imageUrl }]);

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

                    <div>
                        <label className="text-sm font-semibold text-white/60 ml-1">Image</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors w-full justify-center">
                                <Upload className="w-4 h-4" />
                                <span className="text-sm">{imageFile ? "Change Image" : "Upload Image"}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                />
                            </label>
                        </div>
                        {imageFile && <p className="text-xs text-neon-lime mt-2 text-center">{imageFile.name}</p>}
                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={isAdding}
                        className="w-full bg-hot-pink text-white font-heading py-3 rounded-xl hover:shadow-[0_0_15px_rgba(255,0,255,0.3)] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isAdding ? "Adding..." : "Add Slime ✨"}
                    </button>
                </div>
            </motion.div >
        </div >
    );
}
