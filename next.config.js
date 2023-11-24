const HRS_URL = process.env.NEXT_PUBLIC_HRS;

const nextConfig = {
  env: {
    HRS_URL: HRS_URL ?? "",
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "robohash.org",
      },
    ],
  },
};

module.exports = nextConfig;
