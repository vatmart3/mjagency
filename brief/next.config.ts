import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // La scène 3D n'est jamais rendue côté serveur : inutile d'alourdir le bundle RSC.
  transpilePackages: ["three"],
};

export default nextConfig;
