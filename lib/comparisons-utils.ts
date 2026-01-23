// lib/comparisons-utils.ts
import { fetchGraphQL } from './graphql';
import { GET_COUNTRIES } from './queries';
import { parseCountryString } from './utils';

type CountryAvailability = {
    code: string;
    label: string;
    slug: string;
};

/**
 * Finds all countries that have a specific comparison (by slug match).
 * Returns array of { code, label, slug }.
 */
export async function getCountriesForComparison(comparisonSlug: string): Promise<CountryAvailability[]> {
    const data = await fetchGraphQL<{ countries: { nodes: any[] } }>(GET_COUNTRIES);
    const nodes = data?.countries?.nodes ?? [];

    const countries: CountryAvailability[] = [];

    for (const node of nodes) {
        // Check if this country node's slug matches the comparison slug
        // Note: This logic assumes that country nodes might have matching slugs or relation. 
        // If the pattern follows models, we keep the check against node.slug.
        if (node.slug === comparisonSlug && node.countryName?.countryName) {
            const { code, label } = parseCountryString(node.countryName.countryName);
            if (code) {
                countries.push({ code, label, slug: node.slug });
            }
        }
    }

    return countries;
}

/**
 * Generates hreflang alternate links for a comparison.
 * @param comparisonSlug - The slug of the comparison
 * @param baseUrl - Site base URL
 * @returns Object with alternates for Next.js metadata
 */
export async function generateHreflangForComparison(comparisonSlug: string, baseUrl: string) {
    const countries = await getCountriesForComparison(comparisonSlug);

    const languages: Record<string, string> = {
        'x-default': `${baseUrl}/comparisons/${comparisonSlug}`, // Global fallback
    };

    // Add each country as a locale variant
    for (const country of countries) {
        // Use ISO language codes (en-AE, en-US, etc.)
        const hreflangCode = `en-${country.code.toUpperCase()}`;
        languages[hreflangCode] = `${baseUrl}/${country.code}/comparisons/${comparisonSlug}`;
    }

    return { languages };
}
