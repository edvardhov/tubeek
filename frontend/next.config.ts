import type { NextConfig } from "next";

const isDemo = process.env.NEXT_PUBLIC_APP_MODE === "demo";
// Empty for local `npx serve out`; set to `/tubeek` in CI for GitHub Pages project sites.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isDemo
    ? {
        output: "export" as const,
        ...(basePath
          ? { basePath, assetPrefix: basePath, trailingSlash: true }
          : {}),
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
