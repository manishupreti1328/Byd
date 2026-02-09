// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bydcarupdates.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/admin/', '/private/'],
            },
            {
                userAgent: 'GPTBot',
                disallow: '/',
            },
            {
                userAgent: 'CCBot',
                disallow: '/',
            },
            {
                userAgent: 'Google-Extended',
                disallow: '/',
            },
            {
                userAgent: 'Amazonbot',
                disallow: '/',
            },
            {
                userAgent: 'FacebookBot',
                disallow: '/',
            },
            {
                userAgent: 'Anthropic-AI',
                disallow: '/',
            },
            {
                userAgent: 'Claude-Web',
                disallow: '/',
            },
            {
                userAgent: 'cohere-ai',
                disallow: '/',
            },
            {
                userAgent: 'Omgilibot',
                disallow: '/',
            },
            {
                userAgent: 'Omgili',
                disallow: '/',
            },
            {
                userAgent: 'Bytespider',
                disallow: '/',
            },
            {
                userAgent: 'Diffbot',
                disallow: '/',
            },
            {
                userAgent: 'ImagesiftBot',
                disallow: '/',
            },
            {
                userAgent: 'PerplexityBot',
                disallow: '/',
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
