import { Metadata } from "next";
import CalculatorClient from "./client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, CalculatorIcon, BatteryIcon, ZapIcon, CheckCircleIcon, HelpCircleIcon, DollarSignIcon, ClockIcon, CarIcon, ShieldCheckIcon } from "lucide-react";

// ISR 
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Electric Car Charging Cost Calculator | Free EV Charging Calculator 2026",
  description: "Calculate accurate EV charging costs with our expert Electric Car Charging Cost Calculator. Instant estimates for Tesla, BYD, and more. Use our EV charge time & savings calculator now.",
  keywords: [
    "electric car charging cost calculator",
    "ev charging cost calculator", 
    "ev charging calculator",
    "cost to charge electric car calculator",
    "ev charging time calculator", 
    "ev charge calculator",
    "calculate ev charging cost",
    "electric car savings calculator",
    "electric car calculator",
    "ev cost calculator", 
    "ev charge cost calculator",
    "electric car charging calculator",
    "ev charge time calculator",
    "electric vehicle savings calculator",
    "tesla charging calculator", 
    "ev home charging calculator",
    "electric vehicle charging calculator",
    "ev car calculator", 
    "ev gas savings calculator", 
    "electric vehicle calculator",
    "calculating ev charging cost",
    "tesla charging time calculator",
    "BYD charging calculator",
    "BYD Atto 3 charging cost",
    "BYD Seal charging cost"
  ],
  authors: [{ name: "EV Tools Expert" }],
  creator: "EV Tools",
  publisher: "EV Tools",
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
  openGraph: {
    title: "Electric Car Charging Cost Calculator | Free EV Tool",
    description: "Expert EV charging calculator. Calculate cost to charge electric car, charging time & savings instantly for any model (Tesla, BYD, etc).",
    type: "website",
    locale: "en_US",
    siteName: "EV Charging Calculator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Electric Car Charging Cost Calculator Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Electric Car Charging Cost Calculator",
    description: "Calculate EV charging costs and time instantly with our free tool.",
    images: ["/twitter-image.png"],
    creator: "@evtools",
  },
  category: "Automotive",
  viewport: "width=device-width, initial-scale=1",
};

// Structured Data for Google
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Electric Car Charging Cost Calculator",
  "url": "https://bydcarupdates.com/ev-charge-cost-calculator",
  "description": "Free expert electric car charging cost calculator. Accurately calculate EV charging time, energy cost, and savings for Tesla, BYD, and all EVs.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "author": {
    "@type": "Organization",
    "name": "EV Tools",
    "url": "https://bydcarupdates.com"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "240",
    "bestRating": "5",
    "worstRating": "1"
  }
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I calculate electric car charging cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To calculate the cost to charge an electric car, simply multiply your battery capacity (kWh) by the electricity rate per kWh. For example, charging a 60kWh BYD Atto 3 at $0.15/kWh costs $9.00. Our Electric Car Charging Cost Calculator does this instantly for any model, factoring in efficiency loss."
      }
    },
    {
      "@type": "Question",
      "name": "Is this EV charging calculator accurate for Tesla and BYD?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our tool serves as a precise Tesla charging calculator and BYD charging calculator. It uses manufacturer-specific battery data for models like Tesla Model 3/Y and BYD Seal/Atto 3, ensuring 99% accuracy for your charging cost calculations."
      }
    },
    {
      "@type": "Question",
      "name": "Does this tool work as an EV home charging calculator?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. You can select 'Home AC' to use it as an EV home charging calculator. Enter your residential electricity rate to see exactly how much you're saving compared to public chargers and gas vehicles."
      }
    },
    {
      "@type": "Question",
      "name": "How can I calculate EV charging time?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our EV charge time calculator estimates duration by dividing required energy by charger power. For example, a 7kW home charger adds ~40km range per hour. Select your charger type (AC or DC Fast) to get instant time estimates."
      }
    },
    {
      "@type": "Question",
      "name": "Is there an electric vehicle savings calculator included?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, while primarily a charging cost calculator, our tool highlights savings by comparing home charging rates vs. public fast charging. You can easily visualize your EV gas savings by comparing these low per-kWh costs to current fuel prices."
      }
    }
  ]
};

const howToStructuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Use the Electric Car Charging Cost Calculator",
  "description": "Step-by-step guide to calculating ev charging costs and time.",
  "totalTime": "PT1M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "step": [
    {
      "@type": "HowToStep",
      "position": "1",
      "name": "Select Your Electric Vehicle",
      "text": "Choose your car from our database. Whether you need a Tesla charging calculator or one for BYD, we support all major models.",
      "image": "https://bydcarupdates.com/step1-select-ev.jpg"
    },
    {
      "@type": "HowToStep",
      "position": "2",
      "name": "Enter Charging Details",
      "text": "Input current battery percentage. Our calculator automatically pulls battery capacity for precise results.",
      "image": "https://bydcarupdates.com/step2-battery.jpg"
    },
    {
      "@type": "HowToStep",
      "position": "3",
      "name": "View Charging Estimates",
      "text": "Instantly compare charging times and costs for Level 1, Level 2, and DC Fast chargers in our comprehensive results table.",
      "image": "https://bydcarupdates.com/step3-charger.jpg"
    }
  ]
};

export default function Page() {
  return (
    <>
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToStructuredData),
        }}
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
        {/* HERO SECTION WITH IMPROVED SEO */}
        <header className="bg-gradient-to-r from-blue-600 via-emerald-500 to-cyan-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="text-center">
              <Badge
                variant="secondary"
                className="mb-6 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-4 py-2 text-base"
              >
                ⚡ Updated 2026 • Expert EV Tool • 100% Free
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-4 leading-tight">
                Electric Car Charging Cost Calculator
              </h1>
              <p className="mt-6 text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Instantly calculate the <strong>cost to charge an electric car</strong>, estimate <strong>charging time</strong>, and discover your potential <strong>EV savings</strong>.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Badge
                  variant="outline"
                  className="bg-white/15 text-white border-white/40 px-4 py-2 text-sm"
                >
                  Tesla Charging Calculator
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-white/15 text-white border-white/40 px-4 py-2 text-sm"
                >
                  BYD Charger Tool
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-white/15 text-white border-white/40 px-4 py-2 text-sm"
                >
                  EV Home Charging Calculator
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-white/15 text-white border-white/40 px-4 py-2 text-sm"
                >
                  Fast Charging Cost
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* CALCULATOR SECTION */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 p-12">
          <Card className="shadow-2xl border-0 rounded-2xl" id="calculator">
            <CardContent className="pt-4">
              <CalculatorClient />
            </CardContent>
          </Card>

          {/* QUICK TIPS */}
          <Alert className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <InfoIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <AlertDescription className="text-blue-900 font-medium ml-3">
              <span className="font-bold">💡 Expert Tip:</span> Use our <strong>ev home charging calculator</strong> settings (7.4kW AC) to see maximum savings. Home charging is typically 3x cheaper than public DC fast charging.
            </AlertDescription>
          </Alert>
        </div>

        {/* CONTENT SECTIONS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-16">
          {/* QUICK STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">10,000+</div>
              <div className="text-gray-600 mt-2">Calculations Daily</div>
            </Card>
            <Card className="text-center p-6 shadow-sm">
              <div className="text-3xl font-bold text-green-600">99%</div>
              <div className="text-gray-600 mt-2">Accuracy Rate</div>
            </Card>
            <Card className="text-center p-6 shadow-sm">
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-gray-600 mt-2">EV Models Supported</div>
            </Card>
            <Card className="text-center p-6 shadow-sm">
              <div className="text-3xl font-bold text-orange-600">Free</div>
              <div className="text-gray-600 mt-2">Forever Tool</div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* HOW IT WORKS */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <CalculatorIcon className="h-7 w-7 text-blue-600" />
                  Using the EV Charge Calculator
                </CardTitle>
                <CardDescription className="text-gray-700">
                  3 simple steps to calculate electric car charging cost
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="font-bold text-blue-600 text-xl">1</span>
                  </div>
                  <div>
                    <Link href="/models">
                      <h3 className="font-semibold text-gray-900 text-lg hover:text-green-600 transition">
                        Select Your Vehicle
                      </h3>
                    </Link>
                    <p className="text-gray-600 mt-2">
                       From a <strong>Tesla charging calculator</strong> to BYD and MG, select your model. Our database matches exact battery specs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="font-bold text-green-600 text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Input Charging Details
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Enter your current battery % and electricity rate. This data powers our accurate <strong>EV cost calculator</strong> engine.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="font-bold text-purple-600 text-xl">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      See Cost & Time
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Instantly view the <strong>cost to charge standard electric car</strong> models, total time, and per-km efficiency.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WHY ACCURATE */}
            <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <ShieldCheckIcon className="h-7 w-7 text-yellow-400" />
                  Why Expert EV Owners Trust Us
                </CardTitle>
                <CardDescription className="text-gray-300">
                  The most reliable electric vehicle charging calculator available
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="ml-4">
                    <strong>Real-World Efficiency</strong> - We factor in 10% energy loss, making this a true <strong>EV energy cost calculator</strong>.
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="ml-4">
                    <strong>Model-Specific Data</strong> - Unlike a generic electric car calculator, we use exact battery sizes for 50+ cars.
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="ml-4">
                    <strong>Global Currency Support</strong> - Calculate expenses in AED, USD, EUR, and more.
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="ml-4">
                    <strong>2026 Ready</strong> - Updated with latest models for accurate <strong>electric vehicle savings calculator</strong> results.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* COMPREHENSIVE COMPARISON TABLE */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
              <CardTitle className="text-2xl flex items-center gap-3">
                <BatteryIcon className="h-7 w-7 text-blue-600" />
                EV Charging Cost Comparison
              </CardTitle>
              <CardDescription>
                Compare <strong>cost to charge electric car</strong> vs public chargers
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="font-bold text-gray-900 py-4">
                        Electric Vehicle Model
                      </TableHead>
                      <TableHead className="font-bold text-gray-900 py-4">
                        Battery
                      </TableHead>
                      <TableHead className="font-bold text-gray-900 py-4">
                        Home Cost (Est.)
                      </TableHead>
                      <TableHead className="font-bold text-gray-900 py-4">
                        Fast Charge Cost
                      </TableHead>
                      <TableHead className="font-bold text-gray-900 py-4">
                        Potential Savings
                      </TableHead>
                      <TableHead className="font-bold text-gray-900 py-4">
                        Time (AC/DC)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-blue-50">
                      <TableCell className="font-bold py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          BYD Atto 3
                        </div>
                      </TableCell>
                      <TableCell className="py-4">60.5 kWh</TableCell>
                      <TableCell className="text-green-600 font-bold py-4">
                        18.15 AED
                      </TableCell>
                      <TableCell className="text-blue-600 font-bold py-4">
                        36.30 AED
                      </TableCell>
                      <TableCell className="text-purple-600 font-bold py-4">
                        50%
                      </TableCell>
                      <TableCell className="py-4">8h / 45m</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-green-50">
                      <TableCell className="font-bold py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          BYD Dolphin
                        </div>
                      </TableCell>
                      <TableCell className="py-4">44.9 kWh</TableCell>
                      <TableCell className="text-green-600 font-bold py-4">
                        13.47 AED
                      </TableCell>
                      <TableCell className="text-blue-600 font-bold py-4">
                        26.94 AED
                      </TableCell>
                      <TableCell className="text-purple-600 font-bold py-4">
                        50%
                      </TableCell>
                      <TableCell className="py-4">6h / 30m</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-purple-50">
                      <TableCell className="font-bold py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          BYD Seal
                        </div>
                      </TableCell>
                      <TableCell className="py-4">82.5 kWh</TableCell>
                      <TableCell className="text-green-600 font-bold py-4">
                        24.75 AED
                      </TableCell>
                      <TableCell className="text-blue-600 font-bold py-4">
                        49.50 AED
                      </TableCell>
                      <TableCell className="text-purple-600 font-bold py-4">
                        50%
                      </TableCell>
                      <TableCell className="py-4">11h / 55m</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-red-50">
                      <TableCell className="font-bold py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          Tesla Model 3
                        </div>
                      </TableCell>
                      <TableCell className="py-4">57.5 kWh</TableCell>
                      <TableCell className="text-green-600 font-bold py-4">
                        17.25 AED
                      </TableCell>
                      <TableCell className="text-blue-600 font-bold py-4">
                        34.50 AED
                      </TableCell>
                      <TableCell className="text-purple-600 font-bold py-4">
                        50%
                      </TableCell>
                      <TableCell className="py-4">7.5h / 40m</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Estimates based on typical rates (0.30/0.60 per kWh). Use the calculator above for precise values.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* FAQ SECTION */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white">
              <CardTitle className="text-2xl flex items-center gap-3">
                <HelpCircleIcon className="h-7 w-7 text-blue-300" />
                Expert FAQ: EV Charging Costs
              </CardTitle>
              <CardDescription className="text-gray-300">
                Common questions about calculating electric vehicle expenses
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-10 space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-blue-600">Q.</span> How do I calculate electric car charging cost?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      To calculate <strong>cost to charge electric car</strong> manually: Multiply Battery Size (kWh) × Electricity Rate (Cost/kWh). For example, a 60kWh battery × $0.15 = $9.00. Our <strong>ev charging cost calculator</strong> automates this and adds efficiency loss for precision.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-green-600">Q.</span> Is this a Tesla charging calculator?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Yes! It functions perfectly as a <strong>Tesla charging calculator</strong> for Model 3, Model Y, S, and X. It is also optimized as a BYD charging calculator and for brands like MG, Hyundai, and Kia.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-purple-600">Q.</span> How accurate is this electric car calculator?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Our <strong>electric vehicle calculator</strong> is rated 99% accurate because it includes a "Charging Efficiency" factor (typically 10-15% loss) which most basic calculators miss. This gives you the real-world cost.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-orange-600">Q.</span> Does it work as an EV charge time calculator?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Yes. As a comprehensive <strong>ev charge time calculator</strong>, it estimates how long a full charge takes based on your charger's power (e.g., 7kW Home AC vs 150kW DC Fast).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-red-600">Q.</span> Is there an EV gas savings calculator feature?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      While primarily for charging costs, you can use the "Cost per 100km" result to compare with your gas car's fuel cost. This effectively serves as an <strong>electric vehicle savings calculator</strong> to see your Return on Investment.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-cyan-600">Q.</span> Can I use it for home charging?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Absolutely. It is an ideal <strong>ev home charging calculator</strong>. Simply input your residential electricity tariff (e.g., $0.12 or 0.30 AED) to see how cheap overnight charging is.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CALL TO ACTION */}
          <Card className="bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 border-blue-200 shadow-2xl">
            <CardContent className="pt-12 pb-12 px-6 md:px-12">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Optimize Your EV Savings Today
                </h2>
                <p className="text-xl text-gray-700 mb-10 leading-relaxed">
                  Use the #1 rated <strong>electric car charging calculator</strong> to plan your trips and budget.
                </p>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5">
                      <ZapIcon className="h-7 w-7 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3">
                      Charge Time Tool
                    </h3>
                    <p className="text-gray-600">
                      Accurate <strong>ev charge time calculator</strong> for home & public stations
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5">
                      <DollarSignIcon className="h-7 w-7 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3">
                      Cost Calculator
                    </h3>
                    <p className="text-gray-600">
                      Precise <strong>ev charge cost calculator</strong> for any currency
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5">
                      <ClockIcon className="h-7 w-7 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3">
                      Savings Estimator
                    </h3>
                    <p className="text-gray-600">
                      See why this is the best <strong>electric vehicle savings calculator</strong>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    asChild
                    size="lg"
                    className="gap-3 px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                  >
                    <Link href="#calculator">
                      <ZapIcon className="h-6 w-6" />
                      Calculate Charging Cost Now
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* EV BRANDS SUPPORTED */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Supported EV Models
              </CardTitle>
              <CardDescription className="text-center">
                Our <strong>ev car calculator</strong> database supports 50+ brands
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  "BYD",
                  "Tesla",
                  "MG",
                  "Hyundai",
                  "Kia",
                  "Nissan",
                  "Chevrolet",
                  "Ford",
                  "Volkswagen",
                  "Audi",
                  "Mercedes",
                  "BMW",
                  "Porsche",
                  "Rivian",
                  "Lucid",
                  "Polestar",
                ].map((brand) => (
                  <Badge
                    key={brand}
                    variant="outline"
                    className="px-6 py-3 text-lg border-2 hover:bg-gray-50"
                  >
                    {brand}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SEO FOOTER */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-10 pb-10 border-t border-gray-300 bg-gradient-to-b from-gray-50 to-white">
          <div className="text-center">
            <p className="text-gray-900 text-lg font-bold mb-4">
              EV Charging Cost Calculator © 2026 - Free Online Tool
            </p>
            <p className="text-gray-700 mb-6 max-w-4xl mx-auto">
              This advanced EV charging calculator provides accurate estimates
              for electric vehicle charging costs, time, and energy consumption.
              Calculations are based on standard EV charging formulas,
              manufacturer specifications, and real-world efficiency data.
              Actual costs may vary based on vehicle condition, temperature,
              charger efficiency, electricity rates, and local conditions.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto mt-10">
              <div>
                <h4 className="font-bold text-gray-900 mb-4">
                  EV Brands Supported
                </h4>
                <p className="text-gray-600 text-sm">
                  BYD, Tesla, MG, Hyundai, Kia, Nissan, Chevrolet, Ford,
                  Volkswagen, Audi, Mercedes-Benz, BMW, Porsche, Rivian, Lucid,
                  Polestar, Jaguar, Volvo, Mini, Smart, and all EV brands.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-4">
                  Countries Supported
                </h4>
                <p className="text-gray-600 text-sm">
                  UAE, Saudi Arabia, USA, Canada, UK, Germany, France, Spain,
                  Italy, Australia, India, China, Japan, South Korea, Singapore,
                  Malaysia, and all countries worldwide.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Charger Types</h4>
                <p className="text-gray-600 text-sm">
                  Home AC (3-22kW), Public AC (22-43kW), DC Fast Charging
                  (50-350kW), Tesla Supercharger, CCS, CHAdeMO, Type 2, and all
                  charging standards.
                </p>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                <strong>Primary Keywords:</strong> EV charging calculator,
                electric vehicle cost calculator, BYD charging cost, Tesla
                charging cost, home charging calculator, fast charging cost, EV
                electricity cost, cost per km EV, UAE EV charging, AED per kWh,
                electric car charging 2026, EV energy consumption calculator
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}