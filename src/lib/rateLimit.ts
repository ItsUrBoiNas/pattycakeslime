/**
 * Simple in-memory sliding-window rate limiter.
 * No external dependencies. Resets on server restart.
 */

const windowMs = 15 * 60 * 1000; // 15 minutes
const maxRequests = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = hits.get(ip) || [];

    // Remove entries outside the current window
    const recent = timestamps.filter((t) => now - t < windowMs);

    if (recent.length >= maxRequests) {
        return true;
    }

    recent.push(now);
    hits.set(ip, recent);
    return false;
}

// Periodically clean up stale entries (every 5 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of hits.entries()) {
        const recent = timestamps.filter((t) => now - t < windowMs);
        if (recent.length === 0) {
            hits.delete(ip);
        } else {
            hits.set(ip, recent);
        }
    }
}, 5 * 60 * 1000);
