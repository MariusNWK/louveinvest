import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: false,
  transpilePackages: [
    "cn",
    "database",
    "date",
    "form",
    "my-components",
    "my-functions",
    "my-variables",
    "my-zod",
    "ui",
  ],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
