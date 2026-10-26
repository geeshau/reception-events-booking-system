import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;

let repo = 'reception-events-booking-system';
let assetPrefix = '';
let basePath = '';

if (isGithubActions) {
  const repoNameMatch = process.env.GITHUB_REPOSITORY?.match(/.*?\/(.*)/);
  repo = repoNameMatch ? repoNameMatch[1] : repo;
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

const nextConfig: NextConfig = {
  assetPrefix,
  basePath,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
