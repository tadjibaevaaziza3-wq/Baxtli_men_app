import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://baxtli-men.uz';

    return {
        rules: {
            userAgent: '*',
            allow: ['/', '/courses', '/trainer', '/faq'],
            disallow: [
                '/admin',
                '/admin/',
                '/api',
                '/api/',
                '/tma',
                '/tma/',
                '/_next',
                '/dashboard',
                '?token=',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
