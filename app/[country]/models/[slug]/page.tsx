import { fetchGraphQL } from "@/lib/graphql";
import { GET_COUNTRY_BY_SLUG } from "@/lib/queries";
import { notFound } from "next/navigation";
import TableOfContents from "@/components/TableOfContents";
import { processContent } from "@/lib/toc-utils";
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ country: string; slug: string }>;
};

// 1. Generate Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug, country } = resolvedParams;

  const data = await fetchGraphQL<{ country: any }>(GET_COUNTRY_BY_SLUG, { slug });
  const model = data?.country;

  if (!model) return { title: 'BYD Model Not Found' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://backend.bydcarupdates.com";
  const canonicalUrl = `${baseUrl}/${country}/models/${slug}`;
  const countryDisplay = country.toUpperCase();
  
  const hreflangData = await generateHreflangForModel(slug, baseUrl);

  // SEO titles and descriptions
  const title = model.seo?.meta_title || `${model.title} in ${countryDisplay} | BYD Price & Specs`;
  const description = model.seo?.meta_description || 
    `Complete ${model.title} review for ${countryDisplay}. Price, specifications, availability, and expert analysis.`;

  const cleanDesc = description
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, 155);

  return {
    title,
    description: cleanDesc,
    openGraph: {
      title,
      description: cleanDesc,
      url: canonicalUrl,
      type: 'article',
      images: model.seo?.ogimage?.node?.sourceUrl 
        ? [{ url: model.seo.ogimage.node.sourceUrl, width: 1200, height: 630 }]
        : model.featuredImage?.node?.sourceUrl 
          ? [{ url: model.featuredImage.node.sourceUrl, width: 1200, height: 630 }]
          : [],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangData.languages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  };
}

// 2. Main Component
export default async function CountryModelPage({ params }: Props) {
  const resolvedParams = await params;
  const { country: countryParam, slug } = resolvedParams;

  const data = await fetchGraphQL<{ country: any }>(GET_COUNTRY_BY_SLUG, { slug });
  const model = data?.country;

  if (!model) notFound();

  const countryDisplay = countryParam.toUpperCase();
  
  // Process content WITH FAQ for TOC
  const { processedContent, tocItems } = await processContent(model.content || "", model.faq);
  
  // Calculate read time
  const wordCount = model.content?.split(/\s+/).length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  
  const ogImage = model.seo?.ogimage?.node?.sourceUrl || model.featuredImage?.node?.sourceUrl;

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": model.title,
    "image": ogImage ? [ogImage] : [],
    "datePublished": model.date,
    "dateModified": model.modified || model.date,
    "author": {
      "@type": "Person",
      "name": model.author?.node?.name || "BYD Expert"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BYD Car Updates"
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": process.env.NEXT_PUBLIC_SITE_URL || "https://backend.bydcarupdates.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `${countryDisplay} BYD`,
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/${countryParam}/models`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": model.title
      }
    ]
  };

  return (
    <>
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} suppressHydrationWarning />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} suppressHydrationWarning />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
          <span className="mx-2">›</span>
          <a href={`/${countryParam}/models`} className="text-gray-600 hover:text-blue-600">BYD {countryDisplay}</a>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-medium">{model.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="inline-block px-3 py-1 mb-4 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
            {countryDisplay} REVIEW
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">{model.title} in {countryDisplay}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                {model.author?.node?.name?.charAt(0) || "B"}
              </div>
              <span>{model.author?.node?.name || "BYD Expert"}</span>
            </div>
            <time dateTime={model.date}>
              {new Date(model.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
            <span>•</span>
            <span>{readTime} min read</span>
          </div>
        </header>

        {/* Featured Image */}
        {ogImage && (
          <div className="mb-12 rounded-xl overflow-hidden">
            <img
              src={ogImage}
              alt={`${model.title} in ${countryDisplay}`}
              className="w-full h-auto"
              loading="eager"
              width={1200}
              height={630}
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - TOC + Quick Facts */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              {/* Table of Contents */}
              <div className="mb-6">
                <TableOfContents items={tocItems} />
              </div>

              {/* Quick Facts */}
              {model.fact && (
                <div className="bg-white rounded-xl border p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Quick Facts</h3>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((num) => {
                      const title = model.fact[`fact_title_${num}`];
                      const value = model.fact[`fact_value_${num}`];
                      if (!title || !value) return null;
                      
                      return (
                        <div key={num} className="pb-3 border-b last:border-0 last:pb-0">
                          <div className="text-sm font-medium text-gray-900">{title}</div>
                          <div className="text-sm text-gray-600 mt-1">{value}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-9">
            <article className="bg-white rounded-xl border p-8">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: processedContent }}
                suppressHydrationWarning
              />
            </article>

            {/* FAQ Section with ID for TOC */}
            {model.faq && (
              <section id="frequently-asked-questions" className="mt-12">
                <div className="bg-white rounded-xl border p-8">
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                      const question = model.faq[`faq_title_${num}`];
                      const answer = model.faq[`faq_value_${num}`];
                      if (!question || !answer) return null;

                      return (
                        <details key={num} id={`faq-${num}`} className="group">
                          <summary className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                            <span className="font-medium">{question}</span>
                            <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </summary>
                          <div className="p-4 text-gray-600">
                            {answer}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

// Helper function - add to your existing file
async function generateHreflangForModel(slug: string, baseUrl: string) {
  return {
    languages: {
      'en-us': `${baseUrl}/us/models/${slug}`,
      'en-gb': `${baseUrl}/uk/models/${slug}`,
      'ar-ae': `${baseUrl}/ae/models/${slug}`,
    }
  };
}