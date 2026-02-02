import { fetchGraphQL } from "@/lib/graphql";
import { GET_BLOG_BY_SLUG } from "@/lib/blog-queries";
import { Metadata } from "next";
import { generateHreflangForBlog } from "@/lib/blog-utils";
import { processContent } from "@/lib/toc-utils";
import TableOfContents from "@/components/TableOfContents";

// ISR 
export const revalidate = 120;

// Calculate read time for better UX
function calculateReadTime(content: string): number {
  if (!content) return 3;
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes < 1 ? 1 : minutes;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchGraphQL<{ blog: any }>(GET_BLOG_BY_SLUG, { slug });
  const blog = data?.blog;

  if (!blog)
    return {
      title: "Blog Post Not Found | BYD Car Updates",
      description:
        "The requested article does not exist. Browse our latest electric vehicle news and reviews.",
    };

  const seo = blog.seo ?? {};
  const ogImage =
    seo.ogimage?.node?.sourceUrl || blog.featuredImage?.node?.sourceUrl;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://backend.bydcarupdates.com";

  // Clean description
  const cleanDescription = (seo.meta_description || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);

  const hreflangData = await generateHreflangForBlog(slug, baseUrl);

  return {
    title: seo.meta_title || `${blog.title} | BYD Car Updates`,
    description: cleanDescription,
    keywords:
      seo.meta_keywords ||
      `${blog.title}, BYD blog, EV news, car review`,
    openGraph: {
      title: seo.meta_title || `${blog.title} | BYD Car Updates`,
      description: cleanDescription,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt:
                blog.featuredImage?.node?.altText ||
                `${blog.title} - BYD Blog`,
            },
          ]
        : [],
      type: "article",
      publishedTime: blog.date,
      modifiedTime: blog.modified,
      authors: [blog.author?.node?.name || "BYD Car Updates"],
      siteName: "BYD Car Updates",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.meta_title || `${blog.title} | BYD Car Updates`,
      description: cleanDescription,
      images: ogImage ? [ogImage] : [],
      creator: "@BYDCarUpdates",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}/blogs/${slug}`,
      languages: hreflangData.languages,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

// Format date consistently
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchGraphQL<{ blog: any }>(GET_BLOG_BY_SLUG, { slug });
  const blog = data?.blog;

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="p-8 text-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-red-100 dark:border-red-900/20 shadow-lg max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.282 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Article Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <a
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Browse All Blogs
          </a>
        </div>
      </div>
    );
  }

  const og =
    blog.seo?.ogimage?.node?.sourceUrl ||
    blog.featuredImage?.node?.sourceUrl ||
    null;

  const fixedHtml = blog.content || "";
  const { processedContent, tocItems } = await processContent(
    fixedHtml,
    blog.faq
  );

  // Calculate metrics
  const readTime = calculateReadTime(blog.content || "");
  const wordCount = blog.content?.split(/\s+/).length || 0;
  const formattedDate = formatDate(blog.date);
  const modifiedDate = blog.modified ? formatDate(blog.modified) : null;

  // Enhanced Schema data
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.seo?.meta_description || "",
    image: og ? [og] : [],
    datePublished: blog.date,
    dateModified: blog.modified || blog.date,
    author: {
      "@type": "Person",
      "name": blog.author?.node?.name || "BYD Car Updates",
      "url":
        "https://backend.bydcarupdates.com/author/" +
        (blog.author?.node?.slug || ""),
    },
    publisher: {
      "@type": "Organization",
      "name": "BYD Car Updates",
      "logo": {
        "@type": "ImageObject",
        "url": `${
          process.env.NEXT_PUBLIC_SITE_URL ||
          "https://backend.bydcarupdates.com"
        }/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://backend.bydcarupdates.com"
      }/blogs/${slug}`,
    },
    wordCount: wordCount,
    timeRequired: `PT${readTime}M`,
    articleSection: "Blogs",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [] as any[],
  };

  if (blog.faq) {
    for (let i = 1; i <= 10; i++) {
      const q = blog.faq[`faq_title_${i}`];
      const a = blog.faq[`faq_value_${i}`];
      if (q && a) {
        faqSchema.mainEntity.push({
          "@type": "Question",
          name: q,
          acceptedAnswer: {
            "@type": "Answer",
            text: a.replace(/<[^>]*>/g, ""),
          },
        });
      }
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item":
          process.env.NEXT_PUBLIC_SITE_URL ||
          "https://backend.bydcarupdates.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "BYD Blogs",
        "item": `${
          process.env.NEXT_PUBLIC_SITE_URL ||
          "https://backend.bydcarupdates.com"
        }/blogs`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": `${
          process.env.NEXT_PUBLIC_SITE_URL ||
          "https://backend.bydcarupdates.com"
        }/blogs/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        key="json-ld-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />
      {faqSchema.mainEntity.length > 0 && (
        <script
          key="json-ld-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          suppressHydrationWarning
        />
      )}
      <script
        key="json-ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        suppressHydrationWarning
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <nav className="mb-6 sm:mb-8" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center text-sm sm:text-base">
            <li>
              <a
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                aria-label="Home"
              >
                Home
              </a>
            </li>
            <li className="mx-2 text-gray-400">›</li>
            <li>
              <a
                href="/blogs"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                aria-label="All BYD Blogs"
              >
                BYD Blogs
              </a>
            </li>
            <li className="mx-2 text-gray-400">›</li>
            <li className="text-gray-900 dark:text-gray-100 font-semibold truncate max-w-[200px] sm:max-w-none">
              {blog.title}
            </li>
          </ol>
        </nav>

        <header className="mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white uppercase tracking-wider shadow-md">
            BYD Blog Article
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white dark:ring-gray-900 shadow">
                {blog.author?.node?.name?.charAt(0) || "B"}
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {blog.author?.node?.name ?? "BYD Expert"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Electric Vehicle Specialist
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <time
                  dateTime={blog.date}
                  className="font-medium text-gray-900 dark:text-white"
                >
                  {formattedDate}
                </time>
              </div>

              {modifiedDate && modifiedDate !== formattedDate && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="text-xs">
                    Updated:{" "}
                    <time dateTime={blog.modified}>{modifiedDate}</time>
                  </div>
                </>
              )}

              <span className="text-gray-300">•</span>

              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium text-gray-900 dark:text-white">
                  {readTime} min read
                </span>
                <span className="text-xs text-gray-500">
                  ({wordCount.toLocaleString()} words)
                </span>
              </div>
            </div>
          </div>
        </header>

        {og && (
          <figure className="mb-12 lg:mb-16 rounded-2xl overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
            <img
              src={og}
              alt={
                blog.featuredImage?.node?.altText ||
                `${blog.title} - BYD Blog`
              }
              className="w-full h-auto aspect-[16/9] object-cover"
              loading="eager"
              fetchPriority="high"
              width={1200}
              height={675}
              decoding="async"
            />
          </figure>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <TableOfContents items={tocItems} />

              {/* Quick Facts Box - preserved as requested in user query */}
              {blog.fact && (
                <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-lg">
                  <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Quick Insights
                  </h3>

                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                      const title = blog.fact[`fact_title_${num}`];
                      const value = blog.fact[`fact_value_${num}`];

                      if (!title || !value) return null;

                      return (
                        <div key={`fact-${num}`} className="group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800/50 transition-colors duration-200">
                             <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                              <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                                {num}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 leading-tight">
                                {title}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {value}
                              </div>
                            </div>
                          </div>

                          {num < 10 &&
                            blog.fact[`fact_title_${num + 1}`] && (
                              <div className="h-px bg-gray-200 dark:bg-gray-800 mx-3 last:hidden"></div>
                            )}
                        </div>
                      );
                    })}
                  </div>

                   {/* Add a note if no facts found */}
                  {![1, 2, 3, 4, 5, 6, 7, 8, 9, 10].some(
                    (num) =>
                      blog.fact[`fact_title_${num}`] &&
                      blog.fact[`fact_value_${num}`],
                  ) && (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                       {/* Optional empty state */}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-800">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Share This Article
                </h4>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Share
                  </button>
                  <button className="flex-1 py-2 px-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            <article className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-gray-100 dark:border-gray-800">
              <div
                className="prose prose-lg dark:prose-invert max-w-none wp-content"
                dangerouslySetInnerHTML={{ __html: processedContent }}
                suppressHydrationWarning
              />

              <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {modifiedDate && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Last updated:{" "}
                      <time dateTime={blog.modified}>{modifiedDate}</time>
                    </div>
                  )}
                </div>
              </footer>
            </article>
            
             {/* Quick Facts for Mobile */}
            {blog.fact && (
              <div className="lg:hidden mt-8">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900/30">
                  <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Quick Insights
                  </h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((num) => {
                      const title = blog.fact[`fact_title_${num}`];
                      const value = blog.fact[`fact_value_${num}`];
                      if (!title || !value) return null;

                      return (
                        <div
                          key={`mobile-fact-${num}`}
                          className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                        >
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {title}
                          </span>
                          <span className="font-bold text-gray-900 dark:text-white text-right max-w-[60%]">
                            {value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {blog.faq && faqSchema.mainEntity.length > 0 && (
          <section
            id="frequently-asked-questions"
            className="mt-16 lg:mt-20 max-w-4xl mx-auto"
            aria-label="Frequently Asked Questions"
          >
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const question = blog.faq[`faq_title_${num}`];
                const answer = blog.faq[`faq_value_${num}`];

                if (!question || !answer) return null;

                return (
                  <details
                    key={`faq-${num}`}
                    id={`faq-${num}`}
                    className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden open:shadow-2xl open:border-blue-200 dark:open:border-blue-900/50 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-700"
                    itemScope
                    itemType="https://schema.org/Question"
                  >
                    <summary
                      className="flex items-center justify-between p-6 cursor-pointer list-none text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group-open:text-blue-700 dark:group-open:text-blue-300"
                      itemProp="name"
                    >
                      <span>{question}</span>
                      <span className="transition-transform duration-300 group-open:rotate-180 flex-shrink-0 ml-4">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </summary>

                    <div
                      className="px-6 pb-8 pt-2 text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30"
                      itemScope
                      itemType="https://schema.org/Answer"
                      itemProp="acceptedAnswer"
                    >
                      <div itemProp="text">{answer}</div>
                    </div>
                  </details>
                );
              })}
            </div>
            {/* EV Charge CAlculator */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                A smart tool to calculate electric vehicle charging costs with
                precision.
              </p>
              <a
                href="/ev-charge-cost-calculator"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                EV Charge Calculator
              </a>
            </div>
          </section>
        )}

        <section className="mt-16 lg:mt-24 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-2xl p-8 sm:p-12 shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
              Explore More BYD New & Updates
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Discover the complete lineup of BYD electric vehicle articles,
              check specs, and find your perfect EV.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/blogs"
                className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Browse All 
              </a>
              <a
                href="/models"
                className="px-8 py-3 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Models
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
