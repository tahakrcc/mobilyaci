import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "gnrygw220itoriot.public.blob.vercel-storage.com" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
