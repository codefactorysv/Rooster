import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Script from "next/script";
import { serviceOptions, siteConfig } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const description =
  "Rooster Tree - Lawn Services provides tree services, stump grinding, lawn services, sod installation, mulching, flower beds, wood fence, power washing and junk hauling. Open 7:00 AM - 7:00 PM, with 24/7 emergency tree service. Free estimates. Hablamos Español.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Tree Services, Stump Grinding & Lawn Care`,
    template: `%s | ${siteConfig.name}`,
  },
  description,
  keywords: [
    "tree services",
    "stump grinding",
    "lawn services",
    "sod installation",
    "mulching",
    "flower beds",
    "emergency tree service",
    "24/7 tree removal",
    "wood fence",
    "power washing",
    "junk hauling",
    "lawn maintenance",
  ],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Tree Services, Stump Grinding & Lawn Care`,
    description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — tree and lawn services, ${siteConfig.phoneDisplay}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Tree Services, Stump Grinding & Lawn Care`,
    description: siteConfig.slogan,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Only facts confirmed by the owner appear here. No postal address, service
// area, rating, review count, price or founding date is asserted — add
// `address`, `areaServed` and `aggregateRating` once those are confirmed.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.name,
  description,
  telephone: `+1-${siteConfig.phone}`,
  url: siteConfig.url,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  logo: `${siteConfig.url}/images/logo/rooster-logo.png`,
  knowsLanguage: ["en", "es"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "07:00",
      closes: "19:00",
    },
  ],
  // 24/7 availability is scoped to tree emergencies, not the whole business.
  availableChannel: {
    "@type": "ServiceChannel",
    name: siteConfig.emergencyLabel,
    servicePhone: {
      "@type": "ContactPoint",
      telephone: `+1-${siteConfig.phone}`,
      contactType: "emergency",
      availableLanguage: ["en", "es"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    },
  },
  makesOffer: serviceOptions
    .filter((name) => name !== "Other")
    .map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream-100 text-ink-900">
        {children}
        <Script
          id="local-business-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
