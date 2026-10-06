import type { NextConfig } from "next";

const BUCKET_URL =
  process.env.NEXT_PUBLIC_BUCKET_URL || "http://localhost:3001";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

const { remotePatterns, bucketIsLocal } = (() => {
  try {
    const url = new URL(BUCKET_URL);
    const pattern: RemotePattern = {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port || "",
      pathname: "/**",
    };
    return {
      remotePatterns: [pattern],
      bucketIsLocal: LOCAL_HOSTS.has(url.hostname),
    };
  } catch {
    // Malformed NEXT_PUBLIC_BUCKET_URL — fall back to the local CMS.
    const pattern: RemotePattern = {
      protocol: "http",
      hostname: "localhost",
      port: "3001",
      pathname: "/**",
    };
    return { remotePatterns: [pattern], bucketIsLocal: true };
  }
})();

const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 100],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Unsplash hosts the placeholder photos until real project photos land in the CMS.
    remotePatterns: [
      ...remotePatterns,
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    unoptimized: process.env.NODE_ENV === "development" || bucketIsLocal,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/zarko-sunce/medija/slike/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CACHE }],
      },
      {
        source: "/zarko-sunce/medija/videa/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CACHE }],
      },
      {
        source: "/:path*.woff2",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CACHE }],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/zarko-sunce/medija/slike/:path*",
        destination: `${BUCKET_URL}/images/:path*`,
      },
      {
        source: "/zarko-sunce/medija/videa/:path*",
        destination: `${BUCKET_URL}/videos/:path*`,
      },
    ];
  },

  async redirects() {
    // Content redirects get added here as routes change.
    return [];
  },
};

export default nextConfig;
