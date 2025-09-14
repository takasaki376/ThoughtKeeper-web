/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // 開発時は無効化
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // 他のNext.js設定
});
