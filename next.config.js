/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
};

const withPWA = require("next-pwa")({
  dest: "public",
  disable:
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_DISABLE_PWA === "true",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);
