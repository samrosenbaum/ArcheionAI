/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only ignore during builds in production if needed
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    // Only ignore build errors in production if needed
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  images: {
    unoptimized: false, // Enable image optimization
    domains: ['localhost'], // Add your image domains here
  },
  experimental: {
    // Enable modern features
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
}

export default nextConfig
