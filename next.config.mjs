/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: './dist',
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
}

export default nextConfig