import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
       { // Add Giphy hostname
        protocol: 'https',
        hostname: 'media1.giphy.com',
        port: '',
        pathname: '/**',
      },
       { // Add Giphy hostname (alternative domains if needed)
        protocol: 'https',
        hostname: 'media0.giphy.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'media2.giphy.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'media3.giphy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media4.giphy.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
