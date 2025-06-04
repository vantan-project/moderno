import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3-moderno.s3.ap-northeast-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
