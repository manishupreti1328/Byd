// lib/hreflang-utils.ts
import { fetchGraphQL } from './graphql';
import { GET_COUNTRIES } from './queries';
import { parseCountryString } from './utils';

type CountryAvailability = {
    code: string;
    label: string;
    slug: string;
};

/**
 * Finds all countries that have a specific model (by slug match).
 * Returns array of { code, label, slug }.
 */
export async function getCountriesForModel(modelSlug: string): Promise<CountryAvailability[]> {
    const data = await fetchGraphQL<{ countries: { nodes: any[] } }>(GET_COUNTRIES);
    const nodes = data?.countries?.nodes ?? [];

    const countries: CountryAvailability[] = [];

    for (const node of nodes) {
        // Check if this country node's slug matches the model slug
        if (node.slug === modelSlug && node.countryName?.countryName) {
            const { code, label } = parseCountryString(node.countryName.countryName);
            if (code) {
                countries.push({ code, label, slug: node.slug });
            }
        }
    }

    return countries;
}

/**
 * Generates hreflang alternate links for a model.
 * @param modelSlug - The slug of the model
 * @param baseUrl - Site base URL
 * @returns Object with alternates for Next.js metadata
 */
export async function generateHreflangForModel(modelSlug: string, baseUrl: string) {
    const countries = await getCountriesForModel(modelSlug);

    const languages: Record<string, string> = {
        'x-default': `${baseUrl}/models/${modelSlug}`, // Global fallback
    };

    // Add each country as a locale variant
    for (const country of countries) {
        // Use ISO language codes (en-AE, en-US, etc.)
        const hreflangCode = `en-${country.code.toUpperCase()}`;
        languages[hreflangCode] = `${baseUrl}/${country.code}/models/${modelSlug}`;
    }

    return { languages };
}
