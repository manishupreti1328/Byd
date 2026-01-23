import Link from "next/link";
import Image from "next/image";
import { fetchGraphQL } from "@/lib/graphql";
import { GET_MODELS_WITH_PAGINATION, GET_COUNTRIES } from "@/lib/queries";
import { GET_COMPARISONS_WITH_PAGINATION } from "@/lib/comparisons-queries";
import type { Metadata } from 'next';


// ISR 
export const revalidate = 120;

export const metadata: Metadata = {
  title: "BYD Car Updates | The Ultimate Source for BYD EVs",
  description: "Your #1 source for the latest BYD electric vehicle news, comprehensive model reviews, detailed comparisons, and specifications.",
  keywords: "BYD, BYD electric cars, BYD EV, BYD reviews, BYD comparisons, electric vehicles, EV news",
  openGraph: {
    title: "BYD Car Updates | The Ultimate Source for BYD EVs",
    description: "Your #1 source for the latest BYD electric vehicle news, comprehensive model reviews, detailed comparisons, and specifications.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://bydcarupdates.com",
    siteName: "BYD Car Updates",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BYD Car Updates',
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BYD Car Updates | The Ultimate Source for BYD EVs",
    description: "Your #1 source for the latest BYD electric vehicle news, comprehensive model reviews, detailed comparisons, and specifications.",
    creator: "@BYDCarUpdates",
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
    }
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://bydcarupdates.com",
  },
};

// Helper to format dates
function formatDate(dateString?: string) {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateString));
}

export default async function Home() {
  // Fetch data in parallel
  const [modelsData, comparisonsData, countriesData] = await Promise.all([
    fetchGraphQL<{ models: { nodes: any[] } }>(GET_MODELS_WITH_PAGINATION, { first: 6 }),
    fetchGraphQL<{ comparisons: { nodes: any[] } }>(GET_COMPARISONS_WITH_PAGINATION, { first: 4 }),
    fetchGraphQL<{ countries: { nodes: any[] } }>(GET_COUNTRIES)
  ]);

  const recentModels = modelsData?.models?.nodes || [];
  const recentComparisons = comparisonsData?.comparisons?.nodes || [];
  const countries = countriesData?.countries?.nodes || [];

  return (
    <>
      {/* Hero Section - Modern Gradient Design */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent dark:from-blue-900/10 dark:via-transparent dark:to-transparent"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2.5 mb-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 animate-fade-in">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping bg-blue-400 rounded-full opacity-75"></div>
                  <div className="relative w-2.5 h-2.5 bg-white rounded-full"></div>
                </div>
                <span className="text-sm font-semibold tracking-wide">
                  THE #1 SOURCE FOR BYD EV NEWS
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
              <span className="block text-gray-900 dark:text-white mb-2">
                Discover the Future of
              </span>
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Electric Mobility
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Comprehensive reviews, detailed specifications, and expert
              comparisons of BYD electric vehicles worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/models"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative flex items-center gap-3">
                  Browse All Models
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </Link>
              <Link
                href="/comparisons"
                className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 text-gray-900 dark:text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Compare Vehicles
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { label: "EV Models", value: `${recentModels.length}+` },
                { label: "Countries", value: `${countries.length}+` },
                { label: "Comparisons", value: `${recentComparisons.length}+` },
                { label: "Updated Daily", value: "24/7" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Models Section */}
      <section className="py-20 lg:py-28 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div className="max-w-2xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">
                LATEST ARRIVALS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Explore BYD's{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Electric Lineup
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Discover detailed specifications, performance metrics, and
                expert reviews of the latest BYD electric vehicles.
              </p>
            </div>
            <Link
              href="/models"
              className="inline-flex items-center gap-3 group text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
            >
              View All Models
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentModels.slice(0, 3).map((model: any, index: number) => (
              <article
                key={model.id}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <Link href={`/models/${model.slug}`} className="block">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {model.featuredImage?.node?.sourceUrl ? (
                      <Image
                        src={model.featuredImage.node.sourceUrl}
                        alt={model.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800">
                        <svg
                          className="w-20 h-20 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-bold rounded-full shadow-lg">
                        NEW MODEL
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-lg">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <time className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(model.date)}
                      </time>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        BYD EV
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {model.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {model.excerpt ||
                        "Detailed review and specifications available. Explore performance, range, and features."}
                    </p>
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
                        Read Full Review
                        <svg
                          className="w-4 h-4 transition-transform group-hover:translate-x-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* View All Models Grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {recentModels.slice(3).map((model: any) => (
              <Link
                key={model.id}
                href={`/models/${model.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {model.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(model.date)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparisons Section with Images */}
      <section className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-semibold mb-4">
              COMPARISONS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Head-to-Head{" "}
              <span className="text-green-600 dark:text-green-400">
                Vehicle Analysis
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Detailed side-by-side comparisons to help you make informed
              decisions about BYD electric vehicles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {recentComparisons.map((comparison: any, index: number) => (
              <article
                key={comparison.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
              >
                <Link
                  href={`/comparisons/${comparison.slug}`}
                  className="block"
                >
                  <div className="relative h-64 overflow-hidden">
                    {comparison.featuredImage?.node?.sourceUrl ? (
                      <Image
                        src={comparison.featuredImage.node.sourceUrl}
                        alt={comparison.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-8 mb-4">
                            <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center">
                              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                A
                              </span>
                            </div>
                            <div className="text-3xl font-bold text-gray-400 dark:text-gray-500">
                              VS
                            </div>
                            <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center">
                              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                B
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 font-medium">
                            Feature Comparison
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                          COMPARISON
                        </span>
                        <span className="text-white/90 text-sm">
                          {formatDate(comparison.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {comparison.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                      {comparison.excerpt ||
                        "Detailed comparison of features, specifications, and performance metrics between popular BYD models."}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3 text-green-600 dark:text-green-400 font-semibold group-hover:gap-4 transition-all">
                        Compare Now
                        <svg
                          className="w-5 h-5 transition-transform group-hover:translate-x-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        8 min read • 10+ specs compared
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Global Coverage */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Global{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Market Coverage
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Find BYD vehicle availability, pricing, and specifications
              specific to your region.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {countries.slice(0, 12).map((country: any) => (
              <Link
                key={country.id}
                href={`/${country.slug}`}
                className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {country.featuredImage?.node?.sourceUrl ? (
                      <Image
                        src={country.featuredImage.node.sourceUrl}
                        alt={`${country.countryData?.country_name || country.title} flag`}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">🌍</span>
                    )}
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {country.countryData?.country_name || country.title}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    View Models
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full bg-white/15 backdrop-blur-md border border-white/30">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-white font-semibold text-sm tracking-wide">
                NEWSLETTER
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Calculate Your EV Charge
            </h2>

            {/* Description */}
            <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Calculate your EV charging cost instantly based on power, time,
              and electricity rate.
            </p>

            {/* Charge Calculator*/}
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Link
                href="/ev-charge-cost-calculator"
                role="button"
                className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold "
              >
                EV CHARGE CALCULATOR
              </Link>
            </form>

            {/* Privacy Note */}
            <p className="text-sm text-blue-200/80 mt-6">
              We respect your privacy. No spam, unsubscribe anytime.
              <Link
                href="/privacy"
                className="ml-2 underline hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}