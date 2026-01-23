import Link from "next/link";
import Image from "next/image";
import { fetchGraphQL } from "@/lib/graphql";
import { GET_MODELS } from "@/lib/queries";
import type { Metadata } from 'next';

type ModelNode = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  uri?: string;
  date?: string;
  featuredImage?: { 
    node?: { 
      sourceUrl?: string;
      altText?: string;
      mediaDetails?: {
        width?: number;
        height?: number;
      }
    } 
  };
  author?: { node?: { name?: string; slug?: string } };
};

// Helper function to format dates
function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);
}

// Generate canonical URL
function getCanonicalUrl(path: string = ''): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://backend.bydcarupdates.com';
  return `${baseUrl}${path}`;
}

// Get page from query parameters - SAFER VERSION
function getCurrentPage(searchParams?: { [key: string]: string | string[] | undefined }): number {
  if (!searchParams || typeof searchParams !== 'object') {
    return 1;
  }
  
  const page = searchParams.page;
  if (typeof page === 'string') {
    const parsed = parseInt(page, 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }
  return 1;
}

const ITEMS_PER_PAGE = 12;

// Let's check what fields are available in your GraphQL schema
// Based on the error, let's use a simpler query that matches your actual schema
const GET_MODELS_WITH_PAGINATION = `
  query GetModels($first: Int, $after: String) {
    models(first: $first, after: $after) {
      nodes {
        id
        slug
        title
        date
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        author {
          node {
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;

// Let's also get total count using a separate query
const GET_MODELS_COUNT = `
  query GetModelsCount {
    models {
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// For client-side pagination (fallback option)
const GET_ALL_MODELS = `
  query GetAllModels {
    models(first: 1000) {
      nodes {
        id
        slug
        title
        date
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        author {
          node {
            name
            slug
          }
        }
      }
    }
  }
`;

// SEO Metadata with pagination support - FIXED VERSION
export async function generateMetadata(props: { 
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> 
}): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const searchParams = props.searchParams ? await props.searchParams : {};
  const currentPage = getCurrentPage(searchParams);
  const canonicalUrl = getCanonicalUrl(currentPage > 1 ? `/models?page=${currentPage}` : '/models');
  
  const title = currentPage > 1 
    ? `BYD Electric Car Models ${currentYear} | Page ${currentPage}`
    : `BYD Electric Car Models ${currentYear} | Complete Reviews & Specifications`;
  
  const description = currentPage > 1
    ? `Page ${currentPage} of BYD electric vehicle reviews. Explore detailed specifications, performance analysis, pricing, and expert insights on the latest BYD EVs.`
    : `Explore comprehensive reviews of all BYD electric vehicle models in ${currentYear}. Detailed specifications, performance analysis, pricing, and expert insights on the latest BYD EVs.`;

  return {
    title,
    description,
    keywords: [
      'BYD electric cars',
      'BYD EV models', 
      'BYD reviews',
      'electric vehicles',
      'BYD specifications',
      'BYD pricing',
      `BYD ${currentYear}`,
      'BYD car reviews',
      'BYD model comparison'
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'BYD Car Updates',
      images: [{
        url: `${getCanonicalUrl()}/api/og?title=BYD Models ${currentYear}`,
        width: 1200,
        height: 630,
        alt: `BYD Electric Car Models ${currentYear}`
      }],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${getCanonicalUrl()}/api/og?title=BYD Models ${currentYear}`],
      creator: '@BYDCarUpdates',
      site: '@BYDCarUpdates',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default async function ModelsListPage(props: { 
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  // Await searchParams properly
  const searchParams = props.searchParams ? await props.searchParams : {};
  const currentPage = getCurrentPage(searchParams);
  
  // Strategy 1: Try to get all models and paginate client-side
  // This is a fallback if cursor-based pagination doesn't work
  const allData = await fetchGraphQL<{ 
    models: { 
      nodes: ModelNode[];
    } 
  }>(GET_ALL_MODELS);

  const allNodes = allData?.models?.nodes ?? [];
  
  // Paginate client-side
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const nodes = allNodes.slice(startIndex, endIndex);
  
  const totalModels = allNodes.length;
  const totalPages = Math.ceil(totalModels / ITEMS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const currentYear = new Date().getFullYear();
  
  // Generate comprehensive JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `BYD Electric Car Models ${currentYear}${currentPage > 1 ? ` - Page ${currentPage}` : ''}`,
    "description": `Page ${currentPage} of complete BYD electric vehicle reviews and specifications`,
    "url": getCanonicalUrl(currentPage > 1 ? `/models?page=${currentPage}` : '/models'),
    "numberOfItems": nodes.length,
    "itemListOrder": "https://schema.org/ItemListOrderAscending",
    "itemListElement": nodes.map((model, index) => ({
      "@type": "ListItem",
      "position": (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
      "item": {
        "@type": "Article",
        "headline": model.title,
        "description": `Detailed review of the ${model.title} electric vehicle`,
        "url": getCanonicalUrl(`/models/${model.slug}`),
        "image": model.featuredImage?.node?.sourceUrl ? {
          "@type": "ImageObject",
          "url": model.featuredImage.node.sourceUrl,
          "width": model.featuredImage.node.mediaDetails?.width || 1200,
          "height": model.featuredImage.node.mediaDetails?.height || 630,
          "caption": model.featuredImage.node.altText || model.title
        } : undefined,
        "datePublished": model.date,
        "dateModified": model.date,
        "author": {
          "@type": "Person",
          "name": model.author?.node?.name || "BYD Car Updates Expert",
          "url": model.author?.node?.slug ? getCanonicalUrl(`/author/${model.author.node.slug}`) : undefined
        },
        "publisher": {
          "@type": "Organization",
          "name": "BYD Car Updates",
          "logo": {
            "@type": "ImageObject",
            "url": `${getCanonicalUrl()}/logo.png`
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": getCanonicalUrl(`/models/${model.slug}`)
        }
      }
    }))
  };

  // Breadcrumb schema with pagination
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": getCanonicalUrl()
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": currentPage > 1 ? `BYD Models - Page ${currentPage}` : "BYD Models",
        "item": getCanonicalUrl(currentPage > 1 ? `/models?page=${currentPage}` : '/models')
      }
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        suppressHydrationWarning
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Breadcrumb Navigation */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8" aria-label="Breadcrumb">
          <ol className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <li>
              <Link 
                href="/" 
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                aria-label="Home"
              >
                Home
              </Link>
            </li>
            <li className="mx-2">›</li>
            <li>
              <Link 
                href="/models" 
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                aria-label="BYD Models"
              >
                BYD Models
              </Link>
            </li>
            {currentPage > 1 && (
              <>
                <li className="mx-2">›</li>
                <li className="font-semibold text-gray-900 dark:text-white">
                  Page {currentPage}
                </li>
              </>
            )}
          </ol>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* HERO SECTION - SEO Optimized */}
          <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-16">
            <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white uppercase tracking-wider shadow-lg">
              Complete BYD Collection {currentYear}
              {currentPage > 1 && ` - Page ${currentPage}`}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
              BYD Electric Car Models
              {currentPage > 1 && ` - Page ${currentPage}`}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
              {currentPage > 1
                ? `Continue exploring BYD electric vehicles. Page ${currentPage} of ${totalPages}.`
                : `Explore our comprehensive collection of in-depth reviews, specifications, and expert insights on all BYD electric vehicles for ${currentYear}.`
              }
            </p>
            
            {/* Stats Bar */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <span className="text-2xl">📄</span>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Page {currentPage}</div>
                  <div className="text-gray-500 dark:text-gray-400">of {totalPages}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <span className="text-2xl">🚗</span>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{totalModels}</div>
                  <div className="text-gray-500 dark:text-gray-400">Total Models</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <span className="text-2xl">📅</span>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{currentYear}</div>
                  <div className="text-gray-500 dark:text-gray-400">Updated</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter/Sort Bar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-bold text-gray-900 dark:text-white">{nodes.length}</span> BYD models on page {currentPage} of {totalPages}
              {totalModels > 0 && (
                <span className="ml-2">
                  ({(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalModels)} of {totalModels})
                </span>
              )}
            </div>
          </div>

          {/* GRID LAYOUT - SEO Optimized */}
          {nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="text-6xl mb-4">🚗</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Models Found</h2>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                {currentPage > 1 
                  ? `No models found on page ${currentPage}. Try going back to the first page.`
                  : "We're currently updating our BYD model database. Check back soon for comprehensive reviews of the latest electric vehicles."
                }
              </p>
              {currentPage > 1 && (
                <Link 
                  href="/models"
                  className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Go to First Page
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {nodes.map((model) => {
                  const imageUrl = model.featuredImage?.node?.sourceUrl;
                  const imageAlt = model.featuredImage?.node?.altText || `${model.title} - BYD Electric Vehicle Review`;
                  const formattedDate = formatDate(model.date);
                  
                  return (
                    <Link 
                      key={model.id} 
                      href={`/models/${model.slug}`}
                      className="group block h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl transition-all duration-300 hover:-translate-y-2"
                      aria-label={`Read review: ${model.title}`}
                    >
                      <article className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                        
                        {/* IMAGE CONTAINER - LCP Optimized */}
                        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                          {imageUrl ? (
                            <>
                              {/* Using div with background for better LCP control */}
                              <div 
                                className="w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700"
                                style={{ backgroundImage: `url(${imageUrl})` }}
                                role="img"
                                aria-label={imageAlt}
                              />
                              {/* Gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                              <div className="text-center">
                                <div className="text-4xl mb-2">🚗</div>
                                <span className="text-sm font-medium">{model.title}</span>
                              </div>
                            </div>
                          )}
                          
                          {/* Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-bold text-gray-900 dark:text-white rounded-full">
                              BYD EV
                            </span>
                          </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 p-6 sm:p-8 flex flex-col">
                          {/* Meta Info */}
                          <div className="flex items-center flex-wrap gap-3 text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
                            {formattedDate && (
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <time dateTime={model.date}>{formattedDate}</time>
                              </div>
                            )}
                            
                            {model.author?.node?.name && (
                              <div className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                <span className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  {model.author.node.name}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Title - H2 for hierarchy */}
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                            {model.title}
                          </h2>

                          {/* Static description since excerpt field is not available */}
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                            Discover the {model.title} - an innovative electric vehicle from BYD. Explore features, specifications, and expert insights in our detailed review.
                          </div>

                          {/* CTA */}
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
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center gap-4" aria-label="Pagination">
                    {hasPreviousPage && (
                      <Link
                        href={`/models?page=${currentPage - 1}`}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                        aria-label="Previous page"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </Link>
                    )}

                    <div className="flex items-center gap-2">
                      {/* Always show first page */}
                      <Link
                        href="/models"
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${currentPage === 1 ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
                        aria-label="Go to page 1"
                      >
                        1
                      </Link>

                      {/* Show ellipsis if needed */}
                      {currentPage > 3 && (
                        <span className="text-gray-400 dark:text-gray-600">...</span>
                      )}

                      {/* Show previous page if not first or second */}
                      {currentPage > 2 && (
                        <Link
                          href={`/models?page=${currentPage - 1}`}
                          className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          aria-label={`Go to page ${currentPage - 1}`}
                        >
                          {currentPage - 1}
                        </Link>
                      )}

                      {/* Show current page if not first */}
                      {currentPage > 1 && currentPage <= totalPages && (
                        <span className="px-3 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white">
                          {currentPage}
                        </span>
                      )}

                      {/* Show next page if not last */}
                      {currentPage < totalPages - 1 && (
                        <Link
                          href={`/models?page=${currentPage + 1}`}
                          className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          aria-label={`Go to page ${currentPage + 1}`}
                        >
                          {currentPage + 1}
                        </Link>
                      )}

                      {/* Show ellipsis if needed */}
                      {currentPage < totalPages - 2 && (
                        <span className="text-gray-400 dark:text-gray-600">...</span>
                      )}

                      {/* Always show last page if different from first */}
                      {totalPages > 1 && (
                        <Link
                          href={`/models?page=${totalPages}`}
                          className={`px-3 py-2 rounded-lg text-sm font-medium ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
                          aria-label={`Go to page ${totalPages}`}
                        >
                          {totalPages}
                        </Link>
                      )}
                    </div>

                    {hasNextPage && (
                      <Link
                        href={`/models?page=${currentPage + 1}`}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                        aria-label="Next page"
                      >
                        Next
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </nav>
                </div>
              )}

              {/* Bottom CTA */}
              <div className="mt-16 text-center">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 sm:p-12 border border-blue-100 dark:border-blue-900/30">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Need Help Choosing?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    {currentPage > 1
                      ? `Continue exploring more BYD models or contact our EV experts for personalized advice.`
                      : `Compare different BYD models side by side or contact our EV experts for personalized advice.`
                    }
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    {currentPage === 1 && (
                      <Link 
                        href="/comparisons"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Compare Models
                      </Link>
                    )}
                    <Link 
                      href="/contact"
                      className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                    >
                      Contact Experts
                    </Link>
                    {currentPage > 1 && (
                      <Link 
                        href="/models"
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Back to First Page
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}