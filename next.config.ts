import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The MCP route reads note MDX at request time; ship the files with it.
  outputFileTracingIncludes: {
    "/api/mcp": ["./content/course-notes/**/*"],
  },
};

export default nextConfig;
