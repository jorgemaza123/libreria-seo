import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      // Agregamos este nuevo para la imagen de prueba
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
  },
  // Aumentar el límite del body para Server Actions y API Routes
  serverActions: {
    bodySizeLimit: '10mb',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;