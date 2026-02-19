/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';

const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/cv-builder'],
  async headers() {
    return [
      {
        source: '/widget/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: isDev ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/api/v1/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, X-Company-ID' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
