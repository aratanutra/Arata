/** @type {import('next').NextConfig} */

const isStaticExport = process.env.STATIC_EXPORT === "true";

const staticConfig = {
  output: "export",
  basePath: "/Arata",
  assetPrefix: "/Arata",
  trailingSlash: true,
  images: { unoptimized: true }
};

// Baseline security headers applied to every response. Deliberately
// leaves Content-Security-Policy out for now — CSP interacts with
// Razorpay checkout.js, Google Fonts, and Next.js's inline hydration
// scripts; enabling it without a staging URL to validate would risk
// breaking checkout. Add once a preview/branch URL exists.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self \"https://checkout.razorpay.com\"), interest-cohort=()"
  },
  { key: "X-DNS-Prefetch-Control", value: "on" }
];

const serverConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.aeternyx.com" }
    ]
  },
  experimental: {
    serverActions: { bodySizeLimit: "8mb" }
  },
  async headers() {
    return [
      {
        // Apply to everything except Next.js's internal static assets
        // (they're already immutable + fingerprinted, don't need HSTS
        // repeated on each chunk).
        source: "/((?!_next/static/).*)",
        headers: securityHeaders
      }
    ];
  }
};

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // strip X-Powered-By: Next.js — small fingerprint reduction
  ...(isStaticExport ? staticConfig : serverConfig)
};

export default nextConfig;
