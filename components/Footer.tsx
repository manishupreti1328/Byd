import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* Brand & Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                BYD CAR UPDATES
              </h2>
              <p className="mt-4 text-gray-300 text-lg leading-relaxed max-w-md">
                Discover the Future of Electric Mobility Comprehensive reviews,
                detailed specifications, and expert comparisons of BYD electric
                vehicles worldwide.
              </p>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/models", label: "All Models" },
                  { href: "/comparisons", label: "Comparisons" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-indigo-300 transition-colors text-sm flex items-center group"
                    >
                      <span className="w-1 h-1 bg-gray-600 rounded-full mr-3 group-hover:bg-indigo-400 transition-colors"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Company
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/about", label: "About Us" },
                  { href: "/contact", label: "Contact" },
                  { href: "/disclaimer", label: "Disclaimer" },
                  { href: "/privacy-policy", label: "Privacy Policy" },
                  {
                    href: "/term-and-conditions",
                    label: "Term and Conditions",
                  },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-blue-300 transition-colors text-sm flex items-center group"
                    >
                      <span className="w-1 h-1 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-400 transition-colors"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <p>© {currentYear} Bydcarupdates. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link
                href="/privacy-policy"
                className="hover:text-indigo-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-indigo-300 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="hover:text-indigo-300 transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                href="/sitemap.xml"
                className="hover:text-indigo-300 transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>

          {/* SEO Keywords */}
          <div className="mt-4 md:mt-0 text-xs text-gray-500 text-center md:text-right">
            <p>BYD Models • BYD Comparisons • BYD Model 2026 </p>
          </div>
        </div>
      </div>
    </footer>
  );
}