/* eslint-disable @bob-obringer/no-process-env */
import bundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/posthog-ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/posthog-ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

// eslint-disable-next-line @bob-obringer/next-prefer-named-exports
export default process.env.ANALYZE === "true"
  ? bundleAnalyzer()(nextConfig)
  : nextConfig;
