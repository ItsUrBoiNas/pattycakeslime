/** @type {import('next').NextConfig} */
const { withPayload } = require('@payloadcms/next/withPayload');

const nextConfig = {
    /* config options here */
    reactStrictMode: true,
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 64, 128, 256, 384, 400],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'xwiyfskjxnrjrviqmnge.supabase.co',
            },
        ],
    },
};

module.exports = withPayload(nextConfig);
