"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Plus, Edit2, Play, Video } from "lucide-react";

interface ViralMoment {
    id: string;
    title: string;
    video_url: string;
    views: string;
    platform: string;
}

export default function ViralManager() {
    const [moments, setMoments] = useState<ViralMoment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [views, setViews] = useState("");

    useEffect(() => {
        fetchMoments();
    }, []);

    const fetchMoments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("viral_moments")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setMoments(data);
        if (error) console.error("Error fetching moments:", error.message || error);
        setLoading(false);
    };

    const detectPlatform = (url: string) => {
        if (url.includes("tiktok.com")) return "TikTok";
        if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
        if (url.includes("instagram.com")) return "Instagram";
        return "Other";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const platform = detectPlatform(videoUrl);

        if (isEditing && currentId) {
            const { error } = await supabase
                .from("viral_moments")
                .update({ title, video_url: videoUrl, views, platform })
                .eq("id", currentId);

            if (!error) {
                fetchMoments();
                resetForm();
            }
        } else {
            const { error } = await supabase
                .from("viral_moments")
                .insert([{ title, video_url: videoUrl, views, platform }]);

            if (!error) {
                fetchMoments();
                resetForm();
            }
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this video?");
        if (confirmed) {
            const { error } = await supabase.from("viral_moments").delete().eq("id", id);
            if (!error) fetchMoments();
        }
    };

    const handleEdit = (moment: ViralMoment) => {
        setIsEditing(true);
        setCurrentId(moment.id);
        setTitle(moment.title);
        setVideoUrl(moment.video_url);
        setViews(moment.views || "");
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setTitle("");
        setVideoUrl("");
        setViews("");
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-heading text-white border-b border-white/10 pb-4">
                Your TikTok & Social Videos
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                <h3 className="text-xl font-heading text-neon-lime mb-2">
                    {isEditing ? "Edit Video Info" : "Add a New Video to Your Site"}
                </h3>
                <p className="text-white/60 font-body text-sm mb-4">Add links to your videos here so they show up on the homepage.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="What is this video about? (e.g. Satisfying Crunch)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-neon-lime outline-none"
                        required
                    />
                    <input
                        type="text"
                        placeholder="View Count (e.g. 2.5M)"
                        value={views}
                        onChange={(e) => setViews(e.target.value)}
                        className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-neon-lime outline-none"
                    />
                </div>

                <input
                    type="url"
                    placeholder="Paste the link to your video here (TikTok, YouTube, or Instagram)"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-neon-lime outline-none"
                    required
                />

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        className="bg-neon-lime text-black font-heading px-6 py-3 rounded-xl hover:bg-[#ccff00] transition-colors"
                    >
                        {isEditing ? "Update Video" : "Add Video"}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-white/10 text-white font-heading px-6 py-3 rounded-xl hover:bg-white/20 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-white/40">Loading videos...</p>
                ) : moments.length === 0 ? (
                    <p className="text-white/40">No viral moments added yet.</p>
                ) : (
                    moments.map((moment) => (
                        <div key={moment.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-black/40 px-3 py-1 rounded-lg text-xs font-heading text-neon-lime uppercase tracking-wider">
                                    {moment.platform}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(moment)}
                                        className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold"
                                    >
                                        <Edit2 className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(moment.id)}
                                        className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                </div>
                            </div>

                            <a
                                href={moment.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block aspect-[9/16] bg-black/40 rounded-xl mb-4 relative overflow-hidden group-hover:border-neon-lime border-2 border-transparent transition-colors"
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Play className="w-12 h-12 text-white/40 group-hover:text-neon-lime transition-colors" />
                                </div>
                            </a>

                            <h3 className="text-white font-heading text-lg leading-tight mb-2">{moment.title}</h3>
                            <p className="text-white/40 text-sm font-bold">{moment.views} Views</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
