"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Flame } from "lucide-react";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function getTimeLeft(targetDate: Date): TimeLeft {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

function FlipDigit({ value, label, color }: { value: number; label: string; color: string }) {
    const display = String(value).padStart(2, "0");

    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`relative ${color} rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg min-w-[70px] sm:min-w-[90px]`}>
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={display}
                        initial={{ rotateX: -90, opacity: 0 }}
                        animate={{ rotateX: 0, opacity: 1 }}
                        exit={{ rotateX: 90, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="block text-3xl sm:text-5xl font-bold text-white text-center font-[var(--font-heading)] drop-shadow-md"
                    >
                        {display}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-foreground/70">
                {label}
            </span>
        </div>
    );
}

export default function CountdownTimer() {
    // Target: 3 days from now (simulated upcoming drop)
    const [targetDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        d.setHours(18, 0, 0, 0);
        return d;
    });

    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setTimeLeft(getTimeLeft(targetDate));
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft(targetDate));
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!mounted) {
        return (
            <section id="drops" className="py-16 sm:py-24 px-4 bg-off-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="h-40" />
                </div>
            </section>
        );
    }

    return (
        <section id="drops" className="py-16 sm:py-24 px-4 bg-off-white">
            <div className="max-w-4xl mx-auto text-center">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="mb-10"
                >
                    <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-5 py-2 rounded-full mb-4">
                        <Flame className="w-5 h-5" />
                        <span className="font-bold text-base uppercase tracking-wider">Next Restock Drop</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold font-[var(--font-heading)] text-foreground">
                        Don&apos;t Miss Out! 🔥
                    </h2>
                    <p className="text-lg text-foreground/60 mt-3 font-semibold">
                        Our slime sells out in minutes. Set your alarms!
                    </p>
                </motion.div>

                {/* Timer */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
                    className="flex items-center justify-center gap-3 sm:gap-6"
                >
                    <FlipDigit value={timeLeft.days} label="Days" color="bg-electric-purple" />
                    <span className="text-3xl font-bold text-foreground/30 mt-[-28px]">:</span>
                    <FlipDigit value={timeLeft.hours} label="Hours" color="bg-bubblegum-pink" />
                    <span className="text-3xl font-bold text-foreground/30 mt-[-28px]">:</span>
                    <FlipDigit value={timeLeft.minutes} label="Mins" color="bg-slime-green" />
                    <span className="text-3xl font-bold text-foreground/30 mt-[-28px]">:</span>
                    <FlipDigit value={timeLeft.seconds} label="Secs" color="bg-sunshine-yellow" />
                </motion.div>

                {/* Notify button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-10 inline-flex items-center gap-2 bg-foreground text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                >
                    <Clock className="w-5 h-5" />
                    Notify Me
                </motion.button>
            </div>
        </section>
    );
}
