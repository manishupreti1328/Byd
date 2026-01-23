import Link from "next/link";
import Image from "next/image";
import { fetchGraphQL } from "@/lib/graphql";
import { GET_COMPARISONS, GET_ALL_COMPARISONS } from "@/lib/comparisons-queries";
import type { Metadata } from 'next';

type ComparisonNode = {
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

// SEO Metadata with pagination support - FIXED VERSION
export async function generateMetadata(props: { 
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> 
}): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const searchParams = props.searchParams ? await props.searchParams : {};
  const currentPage = getCurrentPage(searchParams);
  const canonicalUrl = getCanonicalUrl(currentPage > 1 ? `/comparisons?page=${currentPage}` : '/comparisons');
  
  const title = currentPage > 1 
    ? `BYD Electric Car Comparisons ${currentYear} | Page ${currentPage}`
    : `BYD Electric Car Comparisons ${currentYear} | In-depth Side-by-Side Reviews`;
  
  const description = currentPage > 1
    ? `Page ${currentPage} of BYD electric vehicle comparisons. See how BYD models stack up against each other and competitors in detailed side-by-side analysis.`
    : `Compare BYD electric vehicle models in ${currentYear}. Detailed side-by-side specifications, performance analysis, and expert insights to help you choose the right EV.`;

  return {
    title,
    description,
    keywords: [
      'BYD comparisons',
      'BYD vs competitors', 
      'BYD model comparison',
      'electric vehicle comparison',
      'BYD specs comparison',
      `BYD ${currentYear} comparison`,
      'car comparison'
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'BYD Car Updates',
      images: [{
        url: `${getCanonicalUrl()}/api/og?title=BYD Comparisons ${currentYear}`,
        width: 1200,
        height: 630,
        alt: `BYD Electric Car Comparisons ${currentYear}`
      }],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${getCanonicalUrl()}/api/og?title=BYD Comparisons ${currentYear}`],
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

export default async function ComparisonsListPage(props: { 
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  // Await searchParams properly
  const searchParams = props.searchParams ? await props.searchParams : {};
  const currentPage = getCurrentPage(searchParams);
  
  // Strategy 1: Try to get all comparisons and paginate client-side
  // This is a fallback if cursor-based pagination doesn't work
  const allData = await fetchGraphQL<{ 
    comparisons: { 
      nodes: ComparisonNode[];
    } 
  }>(GET_ALL_COMPARISONS);

  const allNodes = allData?.comparisons?.nodes ?? [];
  
  // Paginate client-side
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const nodes = allNodes.slice(startIndex, endIndex);
  
  const totalComparisons = allNodes.length;
  const totalPages = Math.ceil(totalComparisons / ITEMS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const currentYear = new Date().getFullYear();
  
  // Generate comprehensive JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `BYD Electric Car Comparisons ${currentYear}${currentPage > 1 ? ` - Page ${currentPage}` : ''}`,
    "description": `Page ${currentPage} of complete BYD electric vehicle comparisons`,
    "url": getCanonicalUrl(currentPage > 1 ? `/comparisons?page=${currentPage}` : '/comparisons'),
    "numberOfItems": nodes.length,
    "itemListOrder": "https://schema.org/ItemListOrderAscending",
    "itemListElement": nodes.map((comparison, index) => ({
      "@type": "ListItem",
      "position": (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
      "item": {
        "@type": "Article",
        "headline": comparison.title,
        "description": `Detailed comparison: ${comparison.title}`,
        "url": getCanonicalUrl(`/comparisons/${comparison.slug}`),
        "image": comparison.featuredImage?.node?.sourceUrl ? {
          "@type": "ImageObject",
          "url": comparison.featuredImage.node.sourceUrl,
          "width": comparison.featuredImage.node.mediaDetails?.width || 1200,
          "height": comparison.featuredImage.node.mediaDetails?.height || 630,
          "caption": comparison.featuredImage.node.altText || comparison.title
        } : undefined,
        "datePublished": comparison.date,
        "dateModified": comparison.date,
        "author": {
          "@type": "Person",
          "name": comparison.author?.node?.name || "BYD Car Updates Expert",
          "url": comparison.author?.node?.slug ? getCanonicalUrl(`/author/${comparison.author?.node?.slug}`) : undefined
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
          "@id": getCanonicalUrl(`/comparisons/${comparison.slug}`)
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
        "name": currentPage > 1 ? `BYD Comparisons - Page ${currentPage}` : "BYD Comparisons",
        "item": getCanonicalUrl(currentPage > 1 ? `/comparisons?page=${currentPage}` : '/comparisons')
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
                href="/comparisons" 
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                aria-label="BYD Comparisons"
              >
                BYD Comparisons
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
              BYD Comparisons Collection {currentYear}
              {currentPage > 1 && ` - Page ${currentPage}`}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
              BYD Car Comparisons
              {currentPage > 1 && ` - Page ${currentPage}`}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
              {currentPage > 1
                ? `Continue exploring BYD car comparisons. Page ${currentPage} of ${totalPages}.`
                : `Explore our comprehensive collection of in-depth side-by-side reviews, specifications, and expert insights on all BYD comparisons for ${currentYear}.`
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
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{totalComparisons}</div>
                  <div className="text-gray-500 dark:text-gray-400">Total Comparisons</div>
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
              Showing <span className="font-bold text-gray-900 dark:text-white">{nodes.length}</span> comparisons on page {currentPage} of {totalPages}
              {totalComparisons > 0 && (
                <span className="ml-2">
                  ({(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalComparisons)} of {totalComparisons})
                </span>
              )}
            </div>
          </div>

          {/* GRID LAYOUT - SEO Optimized */}
          {nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="text-6xl mb-4">🚗</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Comparisons Found</h2>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                {currentPage > 1 
                  ? `No comparisons found on page ${currentPage}. Try going back to the first page.`
                  : "We're currently updating our BYD comparison database. Check back soon for comprehensive reviews."
                }
              </p>
              {currentPage > 1 && (
                <Link 
                  href="/comparisons"
                  className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Go to First Page
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {nodes.map((comparison) => {
                  const imageUrl = comparison.featuredImage?.node?.sourceUrl;
                  const imageAlt = comparison.featuredImage?.node?.altText || `${comparison.title} - BYD Comparison`;
                  const formattedDate = formatDate(comparison.date);
                  
                  return (
                    <Link 
                      key={comparison.id} 
                      href={`/comparisons/${comparison.slug}`}
                      className="group block h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl transition-all duration-300 hover:-translate-y-2"
                      aria-label={`Read comparison: ${comparison.title}`}
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
                                <span className="text-sm font-medium">{comparison.title}</span>
                              </div>
                            </div>
                          )}
                          
                          {/* Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-bold text-gray-900 dark:text-white rounded-full">
                              BYD Comparison
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
                                <time dateTime={comparison.date}>{formattedDate}</time>
                              </div>
                            )}
                            
                            {comparison.author?.node?.name && (
                              <div className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                <span className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  {comparison.author.node.name}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Title - H2 for hierarchy */}
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                            {comparison.title}
                          </h2>

                          {/* Static description since excerpt field is not available */}
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                            Read our detailed comparison of the {comparison.title}. We analyze features, specs, and value to help you make the right choice.
                          </div>

                          {/* CTA */}
                          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
                            <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all duration-300">
                              Read Full Comparison
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
                        href={`/comparisons?page=${currentPage - 1}`}
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
                        href="/comparisons"
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
                          href={`/comparisons?page=${currentPage - 1}`}
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
                          href={`/comparisons?page=${currentPage + 1}`}
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
                          href={`/comparisons?page=${totalPages}`}
                          className={`px-3 py-2 rounded-lg text-sm font-medium ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
                          aria-label={`Go to page ${totalPages}`}
                        >
                          {totalPages}
                        </Link>
                      )}
                    </div>

                    {hasNextPage && (
                      <Link
                        href={`/comparisons?page=${currentPage + 1}`}
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
                    Why Compare with Us?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    {currentPage > 1
                      ? `Continue reading more detailed breakdowns or contact us for data-backed advice.`
                      : `We provide unbiased, data-driven comparisons to help you decide. See why thousands trust our EV analysis.`
                    }
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    {currentPage === 1 && (
                      <Link 
                        href="/models"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Browse Models
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
                        href="/comparisons"
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
