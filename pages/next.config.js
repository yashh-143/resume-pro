/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent webpack from bundling these — they rely on native binaries
      config.externals = [
        ...(config.externals || []),
        "@sparticuz/chromium",
        "puppeteer-core",
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
