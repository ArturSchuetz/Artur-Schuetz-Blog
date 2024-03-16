/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/medias/**',
      },
      {
        protocol: 'https',
        hostname: 'api.artur-schuetz.com',
        port: '',
        pathname: '/medias/**',
      },
      {
        protocol: 'https',
        hostname: 'api.artur-schuetz.de',
        port: '',
        pathname: '/medias/**',
      },
    ],
  },
  env: {
    BUILD_ENV: process.env.BUILD_ENV || "development",
  },
};

module.exports = nextConfig;
