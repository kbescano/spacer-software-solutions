import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @resvg/resvg-js ships a native .node addon (platform-specific binary),
  // which Next's bundler can't inline — this tells it to `require()` the
  // package directly at runtime instead. Used server-side only, to
  // pre-rasterise the S3 mark for the OG/Twitter share images (Satori can't
  // scale nested SVG or SVG data URIs correctly — see src/lib/mark-server.ts).
  serverExternalPackages: ["@resvg/resvg-js"],
};

export default nextConfig;
