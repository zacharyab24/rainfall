import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;


module.exports = {
    async rewrites() {
        return [
            {
                source: "/api/pb/:path*",
                destination: "http://127.0.0.1:8090/:path*", // PocketBase URL
            },
        ];
    },
};