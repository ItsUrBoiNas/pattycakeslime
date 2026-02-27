"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit3, X, Gem, ToggleLeft, ToggleRight, Image as ImageIcon, Upload } from "lucide-react";

import { supabase } from "@/lib/supabase";

interface Accessory {
    id: string;
    name: string;
    price: number;
    is_active: boolean;
    image_url?: string;
}

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

export default function AccessoryManager() {
    const [accessories, setAccessories] = useState<Accessory[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    useEffect(() => {
        loadAccessories();
    }, []);

    const loadAccessories = async () => {
        const { data } = await supabase
            .from("accessories")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setAccessories(data);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this accessory?")) return;
        const { error } = await supabase.from("accessories").delete().eq("id", id);
        if (!error) loadAccessories();
    };

    const handleUpdate = async (acc: Accessory, newImageFile?: File) => {
        let imageUrl = acc.image_url;

        if (newImageFile) {
            try {
                imageUrl = await uploadImage(newImageFile);
            } catch (error) {
                alert("Error uploading image: " + error);
                return;
            }
        }

        const { error } = await supabase
            .from("accessories")
            .update({
                name: acc.name,
                price: acc.price,
                is_active: acc.is_active,
                image_url: imageUrl
            })
            .eq("id", acc.id);

        if (!error) {
            loadAccessories();
            setEditingAccessory(null);
        }
    };

    const toggleActive = async (acc: Accessory) => {
        const { error } = await supabase
            .from("accessories")
            .update({ is_active: !acc.is_active })
            .eq("id", acc.id);

        if (!error) loadAccessories();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-heading text-white">Accessories & Add-ons</h2>
                    <p className="text-white/40 text-sm font-body">Manage free toppings, charms, and extras ({accessories.length} items)</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-neon-lime text-black font-heading px-6 py-3 rounded-2xl hover:scale-105 hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] active:scale-95 transition-all flex items-center gap-2 text-sm"
                >
                    <Plus className="w-5 h-5" />
                    New Accessory
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {accessories.map((acc) => (
                    <motion.div
                        key={acc.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`glass p-4 rounded-2xl border ${acc.is_active ? 'border-white/10' : 'border-red-500/30 bg-red-500/5'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                    {acc.image_url ? (
                                        <img src={acc.image_url} alt={acc.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/20">
                                            <Gem className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-heading text-white text-sm">{acc.name}</h3>
                                    {/* Price display removed */}
                                </div>
                            </div>
                            <button onClick={() => toggleActive(acc)} className="text-white/40 hover:text-white transition-colors">
                                {acc.is_active ? <ToggleRight className="w-8 h-8 text-neon-lime" /> : <ToggleLeft className="w-8 h-8" />}
                            </button>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setEditingAccessory(acc)}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                                <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(acc.id)}
                                className="flex-1 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-500 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                                <Trash2 className="w-3 h-3" /> Delete
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {editingAccessory && (
                <EditAccessoryModal
                    accessory={editingAccessory}
                    onClose={() => setEditingAccessory(null)}
                    onSave={handleUpdate}
                />
            )}

            {showAddModal && (
                <AddAccessoryModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        loadAccessories();
                    }}
                />
            )}
        </div>
    );
}

function EditAccessoryModal({ accessory, onClose, onSave }: { accessory: Accessory; onClose: () => void; onSave: (a: Accessory, file?: File) => void }) {
    const [edited, setEdited] = useState(accessory);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleSave = async () => {
        setIsUploading(true);
        // Enforce price as 0 for all accessories
        const accessoryToSave = { ...edited, price: 0 };
        await onSave(accessoryToSave, imageFile || undefined);
        setIsUploading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-[32px] border border-white/10 max-w-sm w-full"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-heading text-white">Edit Accessory</h2>
                    <button onClick={onClose} className="text-white/60 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-white/40 uppercase ml-1">Name</label>
                        <input
                            value={edited.name}
                            onChange={(e) => setEdited({ ...edited, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-neon-lime/50"
                        />
                    </div>


                    <div>
                        <label className="text-xs font-bold text-white/40 uppercase ml-1">Image</label>
                        <div className="flex items-center gap-3">
                            {edited.image_url && !imageFile && (
                                <img src={edited.image_url} alt="Current" className="w-12 h-12 object-cover rounded-lg border border-white/10" />
                            )}
                            <label className="flex-1 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                <Upload className="w-4 h-4" />
                                <span className="text-xs font-bold">{imageFile ? "Change Image" : "Upload Image"}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                />
                            </label>
                        </div>
                        {imageFile && <p className="text-xs text-neon-lime mt-1 ml-1">{imageFile.name}</p>}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isUploading}
                        className="w-full bg-neon-lime text-black font-heading py-3 rounded-xl hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isUploading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function AddAccessoryModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [newAcc, setNewAcc] = useState({ name: "", price: 0, is_active: true, image_url: "" });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        if (!newAcc.name) return;
        setIsAdding(true);

        let imageUrl = "";
        if (imageFile) {
            const uploaded = await uploadImage(imageFile);
            if (uploaded) {
                imageUrl = uploaded;
            }
        }

        const { error } = await supabase.from("accessories").insert([{ ...newAcc, image_url: imageUrl }]);

        if (!error) {
            onSuccess();
        } else {
            alert("Error adding: " + error.message);
        }
        setIsAdding(false);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-[32px] border border-white/10 max-w-sm w-full"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-heading text-white">New Accessory</h2>
                    <button onClick={onClose} className="text-white/60 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-white/40 uppercase ml-1">Name</label>
                        <input
                            value={newAcc.name}
                            onChange={(e) => setNewAcc({ ...newAcc, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-neon-lime/50"
                            placeholder="e.g. Glitter Packet"
                        />
                    </div>


                    <div>
                        <label className="text-xs font-bold text-white/40 uppercase ml-1">Image</label>
                        <div className="flex items-center gap-3">
                            <label className="flex-1 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                <Upload className="w-4 h-4" />
                                <span className="text-xs font-bold">{imageFile ? "Change Image" : "Upload Image"}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                />
                            </label>
                        </div>
                        {imageFile && <p className="text-xs text-neon-lime mt-1 ml-1">{imageFile.name}</p>}
                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={isAdding}
                        className="w-full bg-neon-lime text-black font-heading py-3 rounded-xl hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isAdding ? "Adding..." : "Add Item"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
