# Rooster Tree - Lawn Services — Landing Page

Conversion-focused landing page for **Rooster Tree - Lawn Services**
_"Tree & Lawn Services, Done Right the First Time."_

Contact: **Kevin Cruz** · Phone: **(832) 989-8795** · Hablamos Español
Regular hours: **7:00 AM – 7:00 PM** · **24/7 emergency tree service**

---

## Stack

| Piece      | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | Next.js 16 (App Router) + React 19       |
| Language   | TypeScript                               |
| Styling    | Tailwind CSS v4 (CSS-first theme tokens) |
| Animation  | Motion (`motion/react`)                  |
| Icons      | lucide-react                             |
| Validation | Zod (shared client + server schema)      |
| Email      | Resend                                   |
| Content    | Markdown + gray-matter + marked          |

---

## Requirements

- Node.js 20 or newer
- npm 10 or newer

---

## Quick start

```bash
npm install                  # install dependencies
cp .env.example .env.local   # create your local env file
npm run dev                  # start dev server at http://localhost:3000
```

Other commands:

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
```

---

## Environment variables

Copy `.env.example` to `.env.local`. Never commit a real `.env` file.

| Variable               | Required            | Purpose                                                                   |
| ---------------------- | ------------------- | ------------------------------------------------------------------------- |
| `RESEND_API_KEY`       | Yes, in production  | Sends Free Estimate submissions. Create at https://resend.com/api-keys.    |
| `CONTACT_TO_EMAIL`     | Yes, in production  | Inbox that receives estimate requests. **No default — must be set.**       |
| `CONTACT_FROM_EMAIL`   | No                  | "From" address. Defaults to `onboarding@resend.dev`.                       |
| `NEXT_PUBLIC_SITE_URL` | Recommended         | Canonical/OG/sitemap base URL. Defaults to `https://roosterserviceshtx.com`.  |

In development, if `RESEND_API_KEY` or `CONTACT_TO_EMAIL` is missing the form
still works end to end and the submission is logged to the server console. In
production a missing value returns a "please call us" message with the phone
number rather than silently dropping a lead.

To send from a branded address, verify the Rooster domain in Resend
(Dashboard → Domains) and set `CONTACT_FROM_EMAIL=estimates@<your-domain>`.

---

## Project structure

```
src/
  app/
    layout.tsx          site-wide metadata and fonts
    page.tsx            section composition
    globals.css         Tailwind v4 theme tokens (brand palette)
    manifest.ts         PWA/web manifest
    robots.ts           robots.txt
    sitemap.ts          sitemap.xml
    llms.txt/route.ts   plain-text business summary for AI crawlers
    blog/page.tsx       blog index (cards + tag filter)
    blog/[slug]/page.tsx  article page
    api/contact/route.ts  form handler: validation, rate limit, Resend
  components/           one file per section, plus Logo/Icon/Reveal/Lightbox
  lib/
    content.ts          ALL site copy + structured data (single source of truth)
    schema.ts           ALL JSON-LD, with the canonical @id graph
    blog.ts             Markdown loader (server only — reads the filesystem)
    post.ts             post types + pure helpers (safe for Client Components)
    validation.ts       shared Zod schema (client + server)
    rate-limit.ts       in-memory limiter for the contact endpoint
content/
  blog/*.md             the articles themselves, front-matter + Markdown
public/
  images/real/          the owner's own job photos (no stock imagery anywhere)
  images/logo/          logo lockups, mark, app icons
  images/og-*.jpg       Open Graph / social share image
  favicon.svg           rooster mark on the brand green tile
```

**Edit copy in `src/lib/content.ts`.** Services, gallery captions, trust points,
the form's service dropdown, phone number and hours all live there, so nothing
needs hunting through JSX.

---

## Blog

Articles are Markdown files in `content/blog/`. Adding a post means adding a
file — there is no CMS and no build step to remember.

```
---
title: "How Do You Know If a Tree Is Dangerous?"
slug: "how-to-tell-if-a-tree-is-dangerous"   # must match the filename
description: "One or two sentences. Used for SEO and the card."
date: "2026-08-18"                            # YYYY-MM-DD
author: "Rooster Tree - Lawn Services"
cover: "/images/real/hazard-tree-before-removal.jpg"
coverAlt: "Describe the photo for screen readers"
coverPosition: "object-[50%_45%]"             # optional crop
tags: ["Tree Care", "Safety"]
draft: false                                   # true hides it in production
howToName: "How to check a tree for warning signs"
howTo:                                         # optional, see below
  - name: "Look at the trunk first"
    text: "..."
faq:                                           # optional, see below
  - question: "..."
    answer: "..."
---
```

Rules that keep the structured data honest:

- **`cover` must be one of the owner's own photos** in `public/images/real/`.
  Everything on this site is real work and the footer says so — no stock.
- **`howTo` steps must match the numbered steps in the body one for one.**
  The HowTo schema is generated from this list; if they drift apart the markup
  describes something the page does not show.
- **`faq` is rendered visibly** as an accordion at the end of the article, and
  the FAQPage schema is generated from the same array. Never add a question
  whose honest answer needs data from "Before launch" below.
- Drafts stay visible in `npm run dev` and are excluded from the production
  build, the sitemap and `llms.txt`.

## SEO / AEO / GEO

| Layer | Where |
| --- | --- |
| Metadata, canonical, OG/Twitter | `layout.tsx` + `generateMetadata` per route |
| JSON-LD (`@id` graph) | `src/lib/schema.ts` — the only place schema is written |
| Sitemap (home + blog + posts) | `src/app/sitemap.ts` |
| robots, incl. AI crawlers | `src/app/robots.ts` |
| Plain-text summary for LLMs | `src/app/llms.txt/route.ts` → `/llms.txt` |
| HowTo / FAQPage / speakable | generated from post front-matter |

The business is one entity, `${SITE_URL}/#organization`, referenced by `@id`
from every page. Import the ids from `ID` in `schema.ts` rather than building
them by hand.

### Activating local SEO

`areaServed`, `PostalAddress` and `geo` are written and ready but switched off,
because no address or service area is confirmed. While off, those keys are
omitted from the JSON-LD entirely — never emitted empty.

To turn it on, edit **one function** in `src/lib/schema.ts`:

```ts
function getLocalSeo(): LocalSeo | null {
  return null;   // <- replace with the confirmed values
}
```

```ts
function getLocalSeo(): LocalSeo | null {
  return {
    address: {
      streetAddress: "<confirmed street>",
      addressLocality: "<confirmed city>",
      addressRegion: "<confirmed state, e.g. TX>",
      postalCode: "<confirmed ZIP>",
      addressCountry: "US",
    },
    areaServed: ["<confirmed area>", "<confirmed area>"],
    // geo: { latitude: 0, longitude: 0 },            // optional
    // openingDays: ["Monday", ...],                  // if not all seven
  };
}
```

Nothing else needs changing — the business schema and every `Service` node pick
it up. Make the values match the Google Business Profile exactly; the two
agreeing is most of the benefit. See `docs/backlinks-strategy.md`.

---

## Brand

| Token           | Value     | Use                                              |
| --------------- | --------- | ------------------------------------------------ |
| `forest-800`    | `#0b450b` | The logo green, sampled from the artwork          |
| `forest-950`    | `#041f06` | Dark section backgrounds                          |
| `sun-400`       | `#fdb725` | Accent — CTAs, emergency callouts                 |
| `cream-100`     | `#f8f7f1` | Page background                                   |
| `ink-900`       | `#0a1a0c` | Body text, text on the accent                     |

The logo was vectorised from the supplied artwork and lives in
`src/components/Logo.tsx` as inline SVG paths, so it can take the colour of the
surrounding section (cream over the hero, green once the header goes solid)
without a second request. Standalone files for external use are in
`public/images/logo/`.

---

## Availability rules (important)

The business runs **7:00 AM – 7:00 PM**. The **24/7** promise is deliberately
scoped to **tree emergencies only** — storm damage, fallen trees, dangerous
branches, emergency removals. When editing copy, never present the full service
list as available around the clock. `siteConfig.emergencyLabel` and
`EmergencyBanner.tsx` are where that message lives.

---

## Before launch

These are unconfirmed and intentionally absent from the site. Add them only
once the owner confirms:

- [ ] **Business email address** — set `siteConfig.email` in `src/lib/content.ts`
      and the email contact card renders automatically.
- [ ] **Real domain** — set `NEXT_PUBLIC_SITE_URL`, and update
      `siteConfig.url` fallback.
- [ ] **Address / city / service area** — then add `address` and `areaServed`
      to the JSON-LD in `src/app/layout.tsx`.
- [ ] **Licensing & insurance** — no "Licensed & Insured" claim appears anywhere
      until this is confirmed.
- [ ] **Days of the week** — the JSON-LD currently lists 7:00–19:00 for all
      seven days; narrow it if the business is closed on some days.
- [ ] **"Hablamos Español"** — inferred from the owner's own messages; confirm.
- [ ] **Reviews / testimonials / years in business** — none are claimed. A
      testimonials section can be added once real reviews exist. Once they do,
      add `aggregateRating` to the organization node in `src/lib/schema.ts`.
- [ ] **Local SEO** — turn on `getLocalSeo()` in `src/lib/schema.ts` once the
      address and service area are confirmed (see "Activating local SEO").
- [ ] **Off-page / backlinks** — see `docs/backlinks-strategy.md`. Most of it
      is blocked on the same address and service-area data.

---

## Deployment

Deploys cleanly to Vercel (or any Node host running `npm run build && npm start`).

1. Import the repository.
2. Set the environment variables above in the host's dashboard.
3. Point the domain at the deployment and update `NEXT_PUBLIC_SITE_URL`.

---

## Notes

- Images are served through `next/image` (AVIF → WebP → JPEG) with lazy loading
  everywhere except the hero, which is `priority`.
- The contact endpoint is rate limited to 5 submissions per IP per 10 minutes
  and carries a honeypot field. Swap `lib/rate-limit.ts` for Redis/Upstash if
  the site is ever scaled beyond a single instance.
- `prefers-reduced-motion` is respected: all scroll/parallax motion is disabled.
