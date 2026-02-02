// lib/blog-utils.ts
import { fetchGraphQL } from './graphql';
import { GET_COUNTRIES } from './queries';
import { parseCountryString } from './utils';

type CountryAvailability = {
    code: string;
    label: string;
    slug: string;
};

/**
 * Finds all countries that have a specific blog (by slug match).
 * Returns array of { code, label, slug }.
 */
export async function getCountriesForBlog(blogSlug: string): Promise<CountryAvailability[]> {
    const data = await fetchGraphQL<{ countries: { nodes: any[] } }>(GET_COUNTRIES);
    const nodes = data?.countries?.nodes ?? [];

    const countries: CountryAvailability[] = [];

    for (const node of nodes) {
        // Check if this country node's slug matches the blog slug
        // Note: This logic assumes that country nodes might have matching slugs or relation. 
        if (node.slug === blogSlug && node.countryName?.countryName) {
            const { code, label } = parseCountryString(node.countryName.countryName);
            if (code) {
                countries.push({ code, label, slug: node.slug });
            }
        }
    }

    return countries;
}

/**
 * Generates hreflang alternate links for a blog.
 * @param blogSlug - The slug of the blog
 * @param baseUrl - Site base URL
 * @returns Object with alternates for Next.js metadata
 */
export async function generateHreflangForBlog(blogSlug: string, baseUrl: string) {
    const countries = await getCountriesForBlog(blogSlug);

    const languages: Record<string, string> = {
        'x-default': `${baseUrl}/blogs/${blogSlug}`, // Global fallback
    };

    // Add each country as a locale variant
    for (const country of countries) {
        // Use ISO language codes (en-AE, en-US, etc.)
        const hreflangCode = `en-${country.code.toUpperCase()}`;
        languages[hreflangCode] = `${baseUrl}/${country.code}/blogs/${blogSlug}`;
    }

    return { languages };
}
