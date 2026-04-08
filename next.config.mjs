/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/controlador/:path*',
        destination: 'https://lookitag.com/motus/controlador/:path*',
      },
    ];
  },
};

export default nextConfig;
