import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Disable static page generation for pages that depend on runtime env vars */
  output: undefined,
};

export default nextConfig;
