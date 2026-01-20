/** @type {import('next').NextConfig} */
const nextConfig = {
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
        hostname: 'res.cloudinary.com', // Seguramente ya usas este
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com', // A veces usan este subdominio
      }
    ],
  },
};

export default nextConfig;