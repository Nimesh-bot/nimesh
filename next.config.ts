import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    LINKEDIN_PROFILE: "https://www.linkedin.com/in/nimesh-shakya-4966451b6/",
    GITHUB_PROFILE: "https://github.com/nimesh-bot"
  }
};

export default nextConfig;
