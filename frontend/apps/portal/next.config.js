/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ubs-lmis/ui', '@ubs-lmis/api-client', '@ubs-lmis/types'],
  reactStrictMode: true,
  experimental: {
    // Limit parallel workers during build to reduce peak memory on constrained machines
    workerThreads: false,
    cpus: 1,
  },
};

module.exports = nextConfig;
