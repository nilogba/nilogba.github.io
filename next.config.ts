import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "res.cloudinary.com" },
            { protocol: "https", hostname: "*.cloudfront.net" },
        ],
    },
};

export default nextConfig;
