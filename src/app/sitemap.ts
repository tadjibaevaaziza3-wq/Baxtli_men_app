import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://baxtli-men.uz';

    // Static routes
    const routes = ['', '/courses', '/trainer', '/faq'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic course routes
    const products = await prisma.product.findMany({
        where: { isPublished: true, isDeleted: false },
        select: { id: true, updatedAt: true },
    });

    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/courses/${product.id}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...routes, ...productRoutes];
}
