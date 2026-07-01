/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['database', 'shared', 'ui'],
};

module.exports = nextConfig;
