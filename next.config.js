/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['via.placeholder.com', 'placehold.co', 'placekitten.com', 'picsum.photos'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'placekitten.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    unoptimized: true,
  },
  typescript: {
    // Permitir errores de TypeScript durante la compilación para desarrollo
    ignoreBuildErrors: true,
  },
  eslint: {
    // Permitir errores de ESLint durante la compilación para desarrollo
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;