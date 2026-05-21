/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

export default nextConfig;
