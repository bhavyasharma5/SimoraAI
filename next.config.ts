import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Externalize packages that have native dependencies
  // These won't work in serverless environments but are available for local dev
  serverExternalPackages: [
    '@remotion/bundler',
    '@remotion/renderer',
    '@remotion/cli',
    'esbuild',
  ],
  
  // Turbopack configuration (required for Next.js 16)
  turbopack: {},
  
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
