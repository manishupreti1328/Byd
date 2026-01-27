import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BYD Car Updates | Latest BYD Electric Vehicle News & Reviews",
    template: "%s | BYD Car Updates",
  },
  description:
    "Stay updated with the latest BYD electric vehicle news, comprehensive model reviews, specifications, and industry insights. Your trusted source for BYD EV information.",
  keywords: ["BYD", "electric vehicles", "EV news", "BYD reviews", "electric cars"],
  authors: [{ name: "BYD Car Updates Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://bydcarupdates.com",
    siteName: "BYD Car Updates",
    title: "BYD Car Updates | Latest BYD Electric Vehicle News & Reviews",
    description:
      "Your trusted source for BYD electric vehicle news, reviews, and insights.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BYD Car Updates",
    description: "Latest BYD electric vehicle news and reviews",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BYD Car Updates",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://bydcarupdates.com",
    logo: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://bydcarupdates.com"
    }/logo.png`,
    description:
      "Leading source for BYD electric vehicle news, reviews, and insights",
    sameAs: [],
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BYD Car Updates",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://bydcarupdates.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://bydcarupdates.com"
        }/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8218973671500448"
          crossOrigin="anonymous"
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 dark:bg-black dark:text-gray-100`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
