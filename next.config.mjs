/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  experimental: {
    esmExternals: "loose",
  },
};
export default nextConfig;