import { MetadataRoute } from 'next';
import { fetchGraphQL } from '@/lib/graphql';
import { GET_ALL_MODELS } from '@/lib/queries';
import { GET_ALL_COMPARISONS } from '@/lib/comparisons-queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bydcarupdates.com';

    // Fetch all models
    const modelsData = await fetchGraphQL<{ models: { nodes: Array<{ slug: string; modified?: string; date?: string }> } }>(GET_ALL_MODELS);
    const models = modelsData?.models?.nodes ?? [];

    // Fetch all comparisons
    const comparisonsData = await fetchGraphQL<{ comparisons: { nodes: Array<{ slug: string; modified?: string; date?: string }> } }>(GET_ALL_COMPARISONS);
    const comparisons = comparisonsData?.comparisons?.nodes ?? [];

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/models`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/comparisons`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/ev-charge-cost-calculator`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        // Information pages
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms-and-conditions`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/disclaimer`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // Dynamic model pages
    const modelPages: MetadataRoute.Sitemap = models.map((model) => ({
        url: `${baseUrl}/models/${model.slug}`,
        lastModified: model.modified ? new Date(model.modified) : (model.date ? new Date(model.date) : new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Dynamic comparison pages
    const comparisonPages: MetadataRoute.Sitemap = comparisons.map((comp) => ({
        url: `${baseUrl}/comparisons/${comp.slug}`,
        lastModified: comp.modified ? new Date(comp.modified) : (comp.date ? new Date(comp.date) : new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...staticPages, ...modelPages, ...comparisonPages];
}
