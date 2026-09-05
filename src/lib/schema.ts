// Single source of truth for every piece of structured data on the site.
//
// Two rules hold everything together:
//
// 1. ONE entity, ONE @id. The business is `${url}/#organization` everywhere —
//    home, blog index, every article. Anything that needs to point at it
//    references that @id instead of repeating the object, so an answer engine
//    reading any page resolves to the same business.
//
// 2. Only confirmed facts. No address, service area, geo, rating, review
//    count, founding date, licence or price appears anywhere below. The local
//    SEO block is written and ready but stays OFF until the data is confirmed
//    — see `localSeo` at the bottom of this file.

import { serviceOptions, services, siteConfig } from "@/lib/content";
import type { Post } from "@/lib/post";

const url = siteConfig.url;

/** Canonical @ids. Never build these ad hoc — import them. */
export const ID = {
  organization: `${url}/#organization`,
  website: `${url}/#website`,
  blog: `${url}/blog#blog`,
  article: (slug: string) => `${url}/blog/${slug}#article`,
  service: (slug: string) => `${url}/#service-${slug}`,
} as const;

const telephone = `+1-${siteConfig.phone}`;

const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

// ---------------------------------------------------------------------------
// GEO LOCAL — ready to activate, deliberately off.
//
// The business has not confirmed a postal address, a service area or
// coordinates, so asserting any of them would be inventing data. Fill this
// object in and the address / areaServed / geo keys appear in the JSON-LD
// automatically; while it is `null` those keys are omitted entirely — they are
// never emitted empty or with placeholders.
//
// To activate: replace `null` with the confirmed values (that is the one-line
// change) and nothing else in this file needs touching. See README.md
// → "Activating local SEO".
// ---------------------------------------------------------------------------
type LocalSeo = {
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  /** City / county / metro names the business confirms it serves. */
  areaServed: string[];
  geo?: { latitude: number; longitude: number };
  /** Confirmed operating days. Defaults to all seven only when activated. */
  openingDays?: readonly string[];
};

/**
 * ACTIVATE LOCAL SEO HERE.
 *
 * Replace `return null` with the confirmed values — that single line is the
 * whole switch. Everything downstream (the business schema and every Service
 * node) picks the data up automatically.
 *
 *   return {
 *     address: {
 *       streetAddress: "...", addressLocality: "...", addressRegion: "TX",
 *       postalCode: "...", addressCountry: "US",
 *     },
 *     areaServed: ["...", "..."],
 *   };
 *
 * Written as a function rather than a constant so TypeScript keeps the union
 * type instead of narrowing it to `null` and reporting the ready-to-use branch
 * as unreachable.
 */
function getLocalSeo(): LocalSeo | null {
  return null;
}

export const localSeo = getLocalSeo();

function localSeoFields() {
  if (!localSeo) return {};
  return {
    address: { "@type": "PostalAddress", ...localSeo.address },
    areaServed: localSeo.areaServed.map((name) => ({ "@type": "Place", name })),
    ...(localSeo.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: localSeo.geo.latitude,
            longitude: localSeo.geo.longitude,
          },
        }
      : {}),
  };
}

const openingDays = localSeo?.openingDays ?? ALL_DAYS;

// ---------------------------------------------------------------------------
// Entities
// ---------------------------------------------------------------------------

const organization = {
  "@type": "ProfessionalService",
  "@id": ID.organization,
  name: siteConfig.name,
  description:
    "Tree services, stump grinding, lawn services, sod installation, mulching, flower beds, wood fence, power washing and junk hauling. Open 7:00 AM - 7:00 PM, with 24/7 emergency tree service. Free estimates.",
  telephone,
  url,
  image: `${url}${siteConfig.ogImage}`,
  logo: `${url}/images/logo/rooster-logo.png`,
  knowsLanguage: ["en", "es"],
  // Regular trading hours. The 24/7 promise is NOT here on purpose — it is a
  // separate emergency channel below, so no engine can read the whole business
  // as being open around the clock.
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...openingDays],
      opens: "07:00",
      closes: "19:00",
    },
  ],
  availableChannel: {
    "@type": "ServiceChannel",
    name: siteConfig.emergencyLabel,
    servicePhone: {
      "@type": "ContactPoint",
      telephone,
      contactType: "emergency",
      availableLanguage: ["en", "es"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...ALL_DAYS],
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
  ...localSeoFields(),
};

const website = {
  "@type": "WebSite",
  "@id": ID.website,
  url,
  name: siteConfig.name,
  inLanguage: "en-US",
  publisher: { "@id": ID.organization },
};

/** One Service node per real service, each provided by the one organization. */
const serviceNodes = services.map((service) => ({
  "@type": "Service",
  "@id": ID.service(service.slug),
  name: service.title,
  description: service.description,
  serviceType: service.group,
  provider: { "@id": ID.organization },
  ...(localSeo
    ? { areaServed: localSeo.areaServed.map((name) => ({ "@type": "Place", name })) }
    : {}),
}));

/** Graph emitted on the home page. */
export function homeSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, ...serviceNodes],
  };
}

/** Graph emitted on the blog index. */
export function blogIndexSchema(posts: Post[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@id": ID.organization, "@type": "ProfessionalService", name: siteConfig.name },
      {
        "@type": "Blog",
        "@id": ID.blog,
        url: `${url}/blog`,
        name: `${siteConfig.name} Blog`,
        description:
          "Practical tree care and lawn care advice from the crew that does the work.",
        inLanguage: "en-US",
        publisher: { "@id": ID.organization },
        isPartOf: { "@id": ID.website },
        blogPost: posts.map((p) => ({ "@id": ID.article(p.slug) })),
      },
      breadcrumbs([{ name: "Home", item: url }, { name: "Blog", item: `${url}/blog` }]),
    ],
  };
}

function breadcrumbs(trail: { name: string; item: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

/** Graph emitted on a single article: BlogPosting + breadcrumbs + HowTo + FAQ. */
export function articleSchema(post: Post) {
  const articleUrl = `${url}/blog/${post.slug}`;
  const graph: Record<string, unknown>[] = [
    { "@id": ID.organization, "@type": "ProfessionalService", name: siteConfig.name },
    {
      "@type": "BlogPosting",
      "@id": ID.article(post.slug),
      headline: post.title,
      description: post.description,
      url: articleUrl,
      mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
      datePublished: post.date,
      dateModified: post.date,
      inLanguage: "en-US",
      keywords: post.tags,
      image: `${url}${post.cover}`,
      author: { "@type": "Person", name: post.author },
      publisher: { "@id": ID.organization },
      isPartOf: { "@id": ID.blog },
      // Points voice assistants at the parts of the page that answer well.
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "[data-speakable]"],
      },
    },
    breadcrumbs([
      { name: "Home", item: url },
      { name: "Blog", item: `${url}/blog` },
      { name: post.title, item: articleUrl },
    ]),
  ];

  // HowTo steps mirror the numbered steps visible in the article, one to one.
  if (post.howTo?.length) {
    graph.push({
      "@type": "HowTo",
      name: post.howToName ?? post.title,
      description: post.description,
      step: post.howTo.map((step, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: step.name,
        text: step.text,
        url: `${articleUrl}#step-${i + 1}`,
      })),
    });
  }

  // FAQ markup is generated from the same array the page renders, so it can
  // never describe an answer the reader cannot see.
  if (post.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
