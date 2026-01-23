import Link from "next/link";
import { fetchGraphQL } from "@/lib/graphql";
import { GET_COUNTRIES } from "@/lib/queries";
import type { Metadata } from 'next';


// ISR 
export const revalidate = 120;

type CountryNode = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  countryData?: {
    country_name?: string;
    country_code?: string;
  };
  featuredImage?: { node?: { sourceUrl?: string; altText?: string } };
  author?: { node?: { name?: string; slug?: string } };
};

// Helper to get country info from countryData
function getCountryInfo(nodes: CountryNode[], countryCode: string): { 
  name: string; 
  code: string;
  count: number;
} {
  // Find nodes for this country
  const countryNodes = nodes.filter(node => 
    node.countryData?.country_code?.toLowerCase() === countryCode.toLowerCase()
  );

  // Get country name from first matching node
  const countryName = countryNodes[0]?.countryData?.country_name || countryCode.toUpperCase();

  return {
    name: countryName,
    code: countryCode.toLowerCase(),
    count: countryNodes.length
  };
}

// Generate Metadata with countryData
export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const countryCode = resolvedParams.country.toLowerCase();
  
  const data = await fetchGraphQL<{ countries: { nodes: CountryNode[] } }>(GET_COUNTRIES);
  const nodes = data?.countries?.nodes ?? [];
  const countryInfo = getCountryInfo(nodes, countryCode);
  const currentYear = new Date().getFullYear();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://backend.bydcarupdates.com';

  return {
    title: `BYD Models in ${countryInfo.name} | ${currentYear} Prices & Reviews`,
    description: `Explore ${countryInfo.count} BYD electric car models available in ${countryInfo.name}. Complete specifications, dealer information, and expert reviews for ${currentYear}.`,
    keywords: [
      `BYD ${countryInfo.name}`,
      `BYD ${countryInfo.code.toUpperCase()}`,
      `electric cars ${countryInfo.name}`,
      `BYD price ${countryInfo.name}`,
      `BYD dealership ${countryInfo.name}`
    ].join(', '),
    openGraph: {
      title: `BYD Models in ${countryInfo.name}`,
      description: `Complete guide to BYD electric vehicles in ${countryInfo.name}`,
      url: `${baseUrl}/${countryInfo.code}/models`,
      type: 'website',
      siteName: 'BYD Car Updates',
      locale: countryInfo.code === 'ae' ? 'ar_AE' : 
              countryInfo.code === 'sa' ? 'ar_SA' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `BYD in ${countryInfo.name}`,
      description: `${countryInfo.count} BYD models available in ${countryInfo.name}`,
    },
    alternates: {
      canonical: `${baseUrl}/${countryInfo.code}/models`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Structured Data
function generateStructuredData(countryInfo: { name: string; code: string; count: number }, nodes: CountryNode[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://backend.bydcarupdates.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `BYD Models in ${countryInfo.name}`,
    "description": `BYD electric vehicle models available in ${countryInfo.name}`,
    "url": `${baseUrl}/${countryInfo.code}/models`,
    "about": {
      "@type": "Place",
      "name": countryInfo.name,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": countryInfo.code.toUpperCase()
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": countryInfo.count,
      "itemListElement": nodes
        .filter(node => node.countryData?.country_code?.toLowerCase() === countryInfo.code)
        .slice(0, 10)
        .map((model, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Vehicle",
            "name": model.title,
            "url": `${baseUrl}/${countryInfo.code}/models/${model.slug}`,
            "image": model.featuredImage?.node?.sourceUrl,
            "brand": { "@type": "Brand", "name": "BYD" },
            "vehicleConfiguration": "Electric Vehicle"
          }
        }))
    }
  };
}

// Breadcrumb schema
function generateBreadcrumbSchema(countryInfo: { name: string; code: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://backend.bydcarupdates.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `BYD ${countryInfo.name}`,
        "item": `${baseUrl}/${countryInfo.code}/models`
      }
    ]
  };
}

// Model Card Component using countryData
const ModelCard = ({ m, countryCode }: { m: CountryNode, countryCode: string }) => {
  const countryName = m.countryData?.country_name || m.countryData?.country_code?.toUpperCase() || 'Global';
  const countryCodeFromData = m.countryData?.country_code?.toLowerCase() || '';
  const isMatch = countryCodeFromData === countryCode.toLowerCase();
  
  return (
    <Link 
      href={`/${countryCode}/models/${m.slug}`} 
      className="group block h-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
      aria-label={`Read ${m.title} review for ${countryName}`}
    >
      <article className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-700">
        
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-700">
          {m.featuredImage?.node?.sourceUrl ? (
            <>
              <img
                src={m.featuredImage.node.sourceUrl}
                alt={m.featuredImage.node.altText || m.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                width={800}
                height={450}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">🚗</div>
                <span className="text-sm font-medium text-gray-500">{m.title}</span>
              </div>
            </div>
          )}
          
          {/* Country Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm ${
              isMatch 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800/90 text-white'
            }`}>
              {countryName}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
            {m.date && (
              <time dateTime={m.date} className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </time>
            )}
            {countryName && (
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                <span className={`font-medium ${isMatch ? "text-blue-600 dark:text-blue-400" : ""}`}>
                  {countryName}
                </span>
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {m.title}
          </h2>

          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all duration-300">
              Read Full Review
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default async function CountryModelsListPage({ 
  params 
}: { 
  params: Promise<{ country: string }> 
}) {
  const resolvedParams = await params;
  const countryParam = resolvedParams.country.toLowerCase();
  
  // Fetch data
  const data = await fetchGraphQL<{ countries: { nodes: CountryNode[] } }>(GET_COUNTRIES);
  const allNodes = data?.countries?.nodes ?? [];
  
  const countryInfo = getCountryInfo(allNodes, countryParam);

  // Filter nodes
  const primaryNodes = allNodes.filter(node => 
    node.countryData?.country_code?.toLowerCase() === countryParam.toLowerCase()
  );

  const secondaryNodes = allNodes.filter(node => 
    node.countryData?.country_code?.toLowerCase() !== countryParam.toLowerCase()
  );

  // Generate structured data
  const structuredData = generateStructuredData(countryInfo, allNodes);
  const breadcrumbData = generateBreadcrumbSchema(countryInfo);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        suppressHydrationWarning
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Breadcrumb */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <a href="/" className="hover:text-blue-600">Home</a>
            <span className="mx-2">›</span>
            <span className="text-gray-900 dark:text-white font-semibold">
              BYD {countryInfo.name}
            </span>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-block px-4 py-2 mb-4 rounded-full text-sm font-bold bg-blue-600 text-white">
              BYD {countryInfo.code.toUpperCase()}
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">
              BYD Models in {countryInfo.name}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              Discover {countryInfo.count} BYD electric vehicles available in {countryInfo.name}
            </p>
            
            {/* Stats */}
            {countryInfo.count > 0 && (
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow border">
                <span className="text-2xl">🚗</span>
                <div>
                  <div className="font-bold">{countryInfo.count}</div>
                  <div className="text-sm text-gray-500">Available Models</div>
                </div>
              </div>
            )}
          </div>

          {/* Primary Section */}
          {primaryNodes.length > 0 ? (
            <>
              <section className="mb-16">
                <div className="flex items-center mb-8">
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                  <h2 className="mx-6 text-2xl font-bold text-gray-900 dark:text-white">
                    Available in {countryInfo.name}
                  </h2>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {primaryNodes.map(m => (
                    <ModelCard key={m.id} m={m} countryCode={countryParam} />
                  ))}
                </div>
              </section>

              {/* Global Models */}
              {secondaryNodes.length > 0 && (
                <section>
                  <div className="flex items-center mb-8">
                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                    <h2 className="mx-6 text-2xl font-bold text-gray-500 dark:text-gray-400">
                      Global BYD Collection
                    </h2>
                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {secondaryNodes.map(m => (
                      <ModelCard key={m.id} m={m} countryCode={countryParam} />
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow border">
              <div className="text-6xl mb-4">🚗</div>
              <h2 className="text-2xl font-bold mb-2">No BYD Models in {countryInfo.name}</h2>
              <p className="text-gray-600 mb-6">
                Currently no BYD models are available in {countryInfo.name}.
              </p>
              <a 
                href="/models" 
                className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
              >
                Browse Global Models
              </a>
            </div>
          )}

         
        </main>
      </div>
    </>
  );
}