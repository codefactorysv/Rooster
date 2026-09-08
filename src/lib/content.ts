// Central content/data source for the Rooster Tree - Lawn Services landing page.
// Keeping copy and structured data here makes it easy to edit from a phone
// (one file, no hunting through JSX) and keeps components presentation-only.
//
// GROUND RULE: everything in this file is confirmed by the business owner.
// No invented address, service area, years in business, certifications,
// licensing, review counts or testimonials. If a claim is not confirmed it
// does not go on the page — see README.md ("Before launch").

export const siteConfig = {
  name: "Rooster Tree - Lawn Services",
  shortName: "Rooster",
  contactName: "Kevin Cruz",
  slogan: "Tree & Lawn Services, Done Right the First Time.",
  phone: "832-989-8795",
  phoneHref: "tel:+18329898795",
  phoneDisplay: "(832) 989-8795",
  /** Regular business hours, as confirmed by the owner. */
  hours: "7:00 AM - 7:00 PM",
  hoursShort: "7 AM - 7 PM",
  /**
   * 24/7 availability applies to TREE EMERGENCIES ONLY (storm damage, fallen
   * trees, dangerous limbs). Everything else runs on the regular hours above —
   * never present the full service list as 24/7.
   */
  emergencyLabel: "24/7 Emergency Tree Service",
  // No public email address has been confirmed yet. Estimate requests are
  // delivered to CONTACT_TO_EMAIL (see .env.example); the site itself shows
  // the phone number only. Set `email` once an address is confirmed and the
  // contact card will appear automatically.
  email: "" as string,
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://roostertreelawn.com",
  ogImage: "/images/og-rooster-tree-lawn-services.jpg",
} as const;

// Hrefs are root-relative, not bare fragments, so the same nav works from the
// blog routes as well as the home page. From "/" the browser still resolves
// them to an in-page anchor and `scroll-behavior: smooth` applies.
export const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Services", href: "/#services" },
  { label: "Our Work", href: "/#our-work" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export type ServiceGroup = "Tree Care" | "Lawn & Landscaping" | "Additional Services";

export type ServiceItem = {
  slug: string;
  title: string;
  description: string;
  icon: IconName;
  group: ServiceGroup;
  size: "lg" | "sm";
  /** Columns the card spans on the large grid (lg cards only). */
  span?: 1 | 2;
  image?: string;
  imageAlt?: string;
  /** Tailwind object-position utility so photos crop on the subject. */
  imagePosition?: string;
  /** Emergency work is the only thing available outside regular hours. */
  emergency?: boolean;
};

/**
 * The six headline services get a real photograph. Spans alternate 2-1 / 1-2 /
 * 2-1 so the three-column grid fills exactly, with no ragged final row.
 *
 * Every photo on this site is the owner's own work — there is no stock imagery
 * anywhere, which is why there is no photo-credits block.
 */
export const services: ServiceItem[] = [
  {
    slug: "tree-services",
    title: "Tree Services",
    description:
      "Trimming, pruning, and complete tree removal — including large trees growing close to homes, driveways, fences, and power lines.",
    icon: "tree",
    group: "Tree Care",
    size: "lg",
    span: 2,
    image: "/images/real/large-tree-service-dump-trailer.jpg",
    imageAlt:
      "Rooster Tree - Lawn Services crew truck and dump trailer parked under a large pecan tree at a residential tree job",
    imagePosition: "object-[50%_45%]",
  },
  {
    slug: "stump-grinding",
    title: "Stump Grinding",
    description:
      "We grind the stump out instead of leaving it behind, so the yard is level, safe, and ready for grass or new landscaping.",
    icon: "stump",
    group: "Tree Care",
    size: "lg",
    span: 1,
    image: "/images/real/stump-grinding-yard-cleared.jpg",
    imageAlt: "Front yard after stump grinding, with the ground mulch left level where a tree once stood",
    imagePosition: "object-[50%_62%]",
  },
  {
    slug: "lawn-services",
    title: "Lawn Services",
    description:
      "Clean, even mowing, edging, and trimming that keeps your yard looking cared for week after week.",
    icon: "lawn",
    group: "Lawn & Landscaping",
    size: "lg",
    span: 1,
    image: "/images/real/lawn-service-manicured-front-yard.jpg",
    imagePosition: "object-[50%_66%]",
    imageAlt: "Freshly mowed and edged front lawn in a residential neighborhood",
  },
  {
    slug: "sod-installation",
    title: "Sod Installation",
    description:
      "Fresh sod laid over bare, patchy, or worn-out ground to give you a full green lawn from day one.",
    icon: "sod",
    group: "Lawn & Landscaping",
    size: "lg",
    span: 2,
    image: "/images/real/sod-installation-green-lawn.jpg",
    imageAlt: "Full, healthy green lawn covering a residential front yard after sod installation",
    imagePosition: "object-[50%_72%]",
  },
  {
    slug: "mulching",
    title: "Mulching",
    description:
      "Fresh mulch around trees and beds — it holds moisture, protects the roots, and instantly sharpens up the whole yard.",
    icon: "mulch",
    group: "Lawn & Landscaping",
    size: "lg",
    span: 2,
    image: "/images/real/mulching-tree-rings-front-yard.jpg",
    imageAlt: "Freshly mulched rings around two front-yard trees with crisp edges cut into the lawn",
    imagePosition: "object-[50%_70%]",
  },
  {
    slug: "flower-beds",
    title: "Flower Beds",
    description:
      "Beds built, edged, shaped, and mulched — clean lines and healthy plants right where people see them first.",
    icon: "flower",
    group: "Lawn & Landscaping",
    size: "lg",
    span: 1,
    image: "/images/real/flower-bed-shrubs-black-mulch.jpg",
    imageAlt:
      "Curved flower bed with trimmed boxwood shrubs, black mulch, steel edging and stepping stones beside a green lawn",
    imagePosition: "object-[55%_50%]",
  },
  {
    slug: "emergency-tree-service",
    title: "Emergency Tree Service",
    description: "Storm damage, fallen trees and dangerous limbs — 24/7.",
    icon: "emergency",
    group: "Tree Care",
    size: "sm",
    emergency: true,
  },
  {
    slug: "maintenance",
    title: "Maintenance",
    description: "Ongoing upkeep so the yard never gets away from you.",
    icon: "maintenance",
    group: "Lawn & Landscaping",
    size: "sm",
  },
  {
    slug: "wood-fence",
    title: "Wood Fence",
    description: "Wood fencing built and repaired around your property.",
    icon: "fence",
    group: "Additional Services",
    size: "sm",
  },
  {
    slug: "power-washing",
    title: "Power Washing",
    description: "Driveways, walkways and siding washed back to clean.",
    icon: "wash",
    group: "Additional Services",
    size: "sm",
  },
  {
    slug: "junk-hauling",
    title: "Junk Hauling",
    description: "Yard debris and unwanted junk loaded up and hauled off.",
    icon: "hauling",
    group: "Additional Services",
    size: "sm",
  },
];

export type IconName =
  | "tree"
  | "stump"
  | "lawn"
  | "sod"
  | "mulch"
  | "flower"
  | "emergency"
  | "maintenance"
  | "fence"
  | "wash"
  | "hauling"
  | "leaf"
  | "shears"
  | "clock"
  | "shield"
  | "estimate"
  | "equipment"
  | "building"
  | "language"
  | "phone"
  | "mail"
  | "check";

export const trustPoints = [
  {
    icon: "tree" as IconName,
    title: "Tree & Lawn in One Call",
    description: "One crew for the trees and the yard around them.",
  },
  {
    icon: "emergency" as IconName,
    title: siteConfig.emergencyLabel,
    description: "Storm damage and fallen trees, any hour.",
  },
  {
    icon: "clock" as IconName,
    title: `Open ${siteConfig.hoursShort}`,
    description: "Regular hours for everything else.",
  },
  {
    icon: "estimate" as IconName,
    title: "Free Estimates",
    description: "No-obligation quotes before any work begins.",
  },
  {
    icon: "language" as IconName,
    title: "English & Español",
    description: "Hablamos Español — always happy to help.",
  },
];

export type GalleryCategory = "Lawn and sod" | "Mulch and flower beds" | "Tree and stump";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  caption: string;
};

// Exclusively real photographs of the owner's own jobs. No stock imagery.
// Files live in /public/images/real/. Removing an entry here only removes it
// from the gallery — the same photo may still be used by another section.
export const galleryItems: GalleryItem[] = [
  // --- Lawn and sod ---------------------------------------------------------
  {
    id: "new-build-fresh-sod",
    src: "/images/real/new-build-front-yard-fresh-sod.jpg",
    alt: "New single-story white home with a freshly sodded front lawn and a wide concrete driveway",
    category: "Lawn and sod",
    caption: "Fresh sod on a new-build lot, curb to driveway",
  },
  {
    id: "graded-lot-before-sod",
    src: "/images/real/graded-lot-before-sod-installation.jpg",
    alt: "Bare, freshly graded dirt lot beside a new home, prepared before sod is laid",
    category: "Lawn and sod",
    caption: "Lot graded and prepped before the sod goes down",
  },
  {
    id: "sod-rolls-being-laid",
    src: "/images/real/sod-rolls-being-laid-new-lawn.jpg",
    alt: "Rolls of sod being laid across a sandy side yard next to a new white house",
    category: "Lawn and sod",
    caption: "Sod rolls going down on a new side yard",
  },
  {
    id: "sod-front-lawn",
    src: "/images/real/sod-installation-green-lawn.jpg",
    alt: "Thick green front lawn covering the full yard after sod installation",
    category: "Lawn and sod",
    caption: "Bare ground to a full green lawn",
  },
  {
    id: "mowed-lawn-trimmed-hedges",
    src: "/images/real/mowed-front-lawn-trimmed-hedges.jpg",
    alt: "Freshly mowed front lawn with crisp sidewalk edges and trimmed hedges along a ranch home",
    category: "Lawn and sod",
    caption: "Mowed, edged, hedges shaped",
  },
  {
    id: "corner-lot-lawn-oak",
    src: "/images/real/corner-lot-lawn-oak-and-garden-beds.jpg",
    alt: "Corner lot with a freshly cut lawn under a large oak, a brick driveway and mulched garden beds",
    category: "Lawn and sod",
    caption: "Corner lot cut clean around a mature oak",
  },
  // --- Mulch and flower beds -------------------------------------------------
  {
    id: "front-entry-beds-black-mulch",
    src: "/images/real/front-entry-flower-beds-black-mulch.jpg",
    alt: "Front entry beds with black mulch, boxwoods, purple loropetalum, gazanias and stone edging along a flagstone path",
    category: "Mulch and flower beds",
    caption: "Entry beds mulched, edged and planted",
  },
  {
    id: "modern-home-mulch-bed",
    src: "/images/real/modern-home-mulch-bed-boxwoods-steel-edging.jpg",
    alt: "Bed of black mulch with clipped boxwood spheres and steel edging beside a dark brick modern home",
    category: "Mulch and flower beds",
    caption: "Black mulch, boxwood spheres, steel edge",
  },
  {
    id: "poolside-bed-mulch",
    src: "/images/real/poolside-planting-bed-fresh-mulch.jpg",
    alt: "Freshly mulched planting bed with roses along a backyard pool wall and covered patio",
    category: "Mulch and flower beds",
    caption: "Poolside bed refreshed with new mulch",
  },
  {
    id: "oak-mulch-beds",
    src: "/images/real/front-yard-oak-fresh-mulch-beds.jpg",
    alt: "Front yard with a large live oak and freshly mulched, freshly edged tree beds",
    category: "Mulch and flower beds",
    caption: "New mulch beds cut in under the oaks",
  },
  // --- Tree and stump --------------------------------------------------------
  {
    id: "climber-trimming-tree",
    src: "/images/real/climber-trimming-large-tree-over-house.jpg",
    alt: "Crew member in a harness climbing a large tree that leans over a house, ropes staged on the lawn below",
    category: "Tree and stump",
    caption: "Roped in and trimming a large tree over the roof",
  },
  {
    id: "stump-grinding-wood-chips",
    src: "/images/real/stump-grinding-wood-chips-front-yard.jpg",
    alt: "Mound of fresh wood chips from stump grinding in a front yard beside a covered patio",
    category: "Tree and stump",
    caption: "Stump ground down to chips, ready to level",
  },
];

export type StoryItem = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
};

/**
 * One real job, start to finish — the same property photographed at each
 * stage. It carries the "how we work" story better than any claim could.
 */
export const storyItems: StoryItem[] = [
  {
    title: "We Start With What's Dangerous",
    description:
      "A split, hollowed trunk leaning toward a driveway is not a wait-and-see problem. We look at what is actually holding the tree up, and what is underneath it, before a single cut is made.",
    image: "/images/real/hazard-tree-before-removal.jpg",
    imageAlt: "Leaning tree with a split, decayed trunk standing beside a brick home before removal",
    imagePosition: "object-[50%_45%]",
  },
  {
    title: "Down in Sections, Under Control",
    description:
      "Close to a house there is no room for a tree to fall where it wants. It comes down piece by piece, on our terms, with the roof, the fence, and the neighbors accounted for.",
    image: "/images/real/tree-cut-down-to-stump.jpg",
    imageAlt: "Decayed trunk cut down to a low stump inside a brick ring in a front yard",
    imagePosition: "object-[50%_55%]",
  },
  {
    title: "The Stump Goes Too",
    description:
      "Most of the job is what you see afterward. The stump gets ground out, the debris gets hauled off, and the yard is left level and ready to plant — not a job site.",
    image: "/images/real/stump-removed-yard-restored.jpg",
    imageAlt: "The same front yard with the tree and stump gone and the ground raked level",
    imagePosition: "object-[50%_62%]",
  },
];

/** Options offered in the "Service Needed" dropdown on the estimate form. */
export const serviceOptions = [
  "Tree Services",
  "Emergency Tree Service",
  "Stump Grinding",
  "Lawn Services",
  "Sod Installation",
  "Mulching",
  "Flower Beds",
  "Wood Fence",
  "Power Washing",
  "Junk Hauling",
  "Maintenance",
  "Other",
] as const;

export const propertyTypeOptions = ["Residential", "Commercial"] as const;
