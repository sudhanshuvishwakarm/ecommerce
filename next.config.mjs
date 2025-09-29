/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        esmExternals: true, // May help with ESM compatibility
    },
};

export default nextConfig;

