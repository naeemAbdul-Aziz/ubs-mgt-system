/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ubs-lmis/ui', '@ubs-lmis/api-client', '@ubs-lmis/types'],
  reactStrictMode: true,
};

module.exports = nextConfig;
