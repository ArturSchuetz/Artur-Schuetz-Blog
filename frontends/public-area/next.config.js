/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home/1',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/home/1',
        permanent: true,
      },
      {
        source: '/my-projects',
        destination: '/portfolio/all',
        permanent: true,
      },
      {
        source: '/data-privacy-policy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/blog/1',
        destination: '/home/1',
        permanent: true,
      },
      {
        source: '/blog/page/1',
        destination: '/home/1',
        permanent: true,
      },
      {
        source: '/blog/article/why-i-built-my-own-event-manager-for-unreal-engine-5',
        destination: '/blog/article/why-i-built-my-own-event-manager-for-unreal-engine-in-c',
        permanent: true,
      },
      {
        source: '/blog/article/how-to-bind-a-function-to-a-delegate-in-unreal-engine',
        destination: '/tutorials/article/how-to-bind-a-function-to-a-delegate-in-unreal-engine',
        permanent: true,
      },
      {
        source: '/blog/article/how-to-convert-a-blueprint-only-project-to-a-c-project',
        destination: '/tutorials/article/how-to-convert-a-blueprint-only-project-to-a-c-project',
        permanent: true,
      },
      {
        source: '/blog/article/a-simple-guide-to-adjusting-graphics-settings-in-unreal-editor',
        destination: '/tutorials/article/how-to-adjusting-graphics-settings-in-unreal-editor-a-simple-guide',
        permanent: true,
      },
      {
        source: '/blog/article/the-essentials-logging-in-unreal-engine-a-quick-guide',
        destination: '/tutorials/article/how-to-log-into-console-and-on-display-in-unreal-engine',
        permanent: true,
      },
      {
        source: '/blog/article/the-essentials-of-c-logging-in-unreal-engine-a-quick-guide',
        destination: '/tutorials/article/how-to-log-into-console-and-on-display-in-unreal-engine',
        permanent: true,
      },
      {
        source: '/blog/article/a-beginners-guide-to-mastering-landscape-materials-in-unreal-engine-5',
        destination: '/tutorials/article/how-to-use-landscape-layer-blending-and-height-blending',
        permanent: true,
      },
      {
        source: '/tutorials/topic/unreal-engine-5/page/1',
        destination: '/tutorials/topic/unreal-engine-5',
        permanent: true,
      },
      {
        source: '/blog/category/c-programming',
        destination: '/blog/category/c-programming/page/1',
        permanent: true,
      },
      {
        source: '/blog/category/3d-rendering',
        destination: '/blog/category/3d-rendering/page/1',
        permanent: true,
      },
      {
        source: '/blog/category/3d-sensor-technology',
        destination: '/blog/category/3d-rendering/page/1',
        permanent: true,
      },
      {
        source: '/blog/category/2/1',
        destination: '/blog/category/3d-rendering/page/1',
        permanent: true,
      },
      {
        source: '/blog/category/3d-rendering/1',
        destination: '/blog/category/3d-rendering/page/1',
        permanent: true,
      },
      {
        source: '/blog/category/game-development/1',
        destination: '/blog/category/game-development/page/1',
        permanent: true,
      },
      {
        source: '/blog/category/3d-sensor-technology/1',
        destination: '/blog/category/3d-sensor-technology/page/1',
        permanent: true,
      },
      {
        source: '/blog-articles',
        destination: '/home/1',
        permanent: true,
      },
      {
        source: '/blog-article-post/1',
        destination: '/blog/article/fundamentals-of-photo-realistic-rendering',
        permanent: true,
      },
      {
        source: '/blog-article-category/3',
        destination: '/blog/category/game-development/page/1',
        permanent: true,
      }
    ]
  },
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
    BUILD_ENV: process.env.NODE_ENV || "development"
  },
};

module.exports = nextConfig;
