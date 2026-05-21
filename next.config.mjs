/** @type {import('next').NextConfig} */

const isStaticExport = process.env.STATIC_EXPORT === "true";

const staticConfig = {
  output: "export",
  basePath: "/Arata",
  assetPrefix: "/Arata",
  trailingSlash: true,
  images: { unoptimized: true }
};

const serverConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.aeternyx.com" }
    ]
  },
  experimental: {
    serverActions: { bodySizeLimit: "8mb" }
  }
};

const nextConfig = {
  reactStrictMode: true,
  ...(isStaticExport ? staticConfig : serverConfig)
};

export default nextConfig;
