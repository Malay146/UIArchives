import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
