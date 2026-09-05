import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { siteConfig } from "@/lib/content";
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
      </body>
    </html>
  );
}
