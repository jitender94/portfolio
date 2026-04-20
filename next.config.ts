import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/building", destination: "/#building", permanent: false },
      { source: "/work", destination: "/#work", permanent: false },
    ];
  },
};

export default nextConfig;
