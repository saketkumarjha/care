import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['caresetubackend-g5eacseahxevh5bp.centralindia-01.azurewebsites.net'],
  },
  env: {
    API_BASE_URL: 'https://caresetubackend-g5eacseahxevh5bp.centralindia-01.azurewebsites.net/api/v1',
  },
};

export default nextConfig;
