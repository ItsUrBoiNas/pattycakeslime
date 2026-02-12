/** @type {import('next').NextConfig} */
const { withPayload } = require('@payloadcms/next/withPayload');

const nextConfig = {
    /* config options here */
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'xwiyfskjxnrjrviqmnge.supabase.co',
            },
        ],
    },
};

module.exports = withPayload(nextConfig);
