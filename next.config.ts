// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'], // ✅ Allow Google's image domain
  },
};

module.exports = nextConfig;