import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com', // 替换成你的 CDN 域名
        port: '',
        pathname: '/**', // 允许该域名下的所有路径
      },
    ],
  },
};

export default nextConfig;
