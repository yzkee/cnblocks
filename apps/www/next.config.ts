/** @type {import('next').NextConfig} */

const nextConfig = {
    productionBrowserSourceMaps: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'ik.imagekit.io',
            },
            {
                protocol: 'https',
                hostname: 'pro.tailark.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
}

export default nextConfig
