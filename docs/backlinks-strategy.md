# Backlinks & Off-Page Strategy — Rooster Tree - Lawn Services

This is the work that happens **outside the codebase**. The site is technically
ready to be found; rankings for a local service business are then decided
mostly by the items below.

**Read the blocker column first.** Most of the local SEO axis depends on data
the business has not confirmed yet, and doing these steps with placeholder or
inconsistent data is worse than not doing them at all.

---

## The one thing that blocks almost everything

Nearly every item here needs a **consistent NAP** — Name, Address, Phone —
repeated identically everywhere. Right now only two thirds of that exist:

| Field | Status | Value to use |
| --- | --- | --- |
| **N**ame | Confirmed | `Rooster Tree - Lawn Services` — exactly this, every time |
| **A**ddress | **Missing** | Not confirmed. Blocks most directory listings |
| **P**hone | Confirmed | `(832) 989-8795` — same format everywhere |

Also missing and needed repeatedly below: a **business email address**, a
**service area** (which cities/areas the business will travel to), and whether
the business is **licensed and insured** (many directories ask, and customers
filter on it).

Decide the service area before starting any of this. Changing it later means
editing every listing by hand.

---

## Priority 1 — Google Business Profile

Highest-impact single item by a wide margin. For a local service business, GBP
drives the map pack, and the map pack is where most "tree service near me"
clicks go.

| Step | Blocked by |
| --- | --- |
| Create the profile at business.google.com | — |
| Choose a listing type: storefront (needs address) or **service-area business** (hides address, lists areas served) | **Service area not confirmed.** A tree/lawn crew is almost certainly a service-area business |
| Complete verification (postcard, phone or video) | Address or service area |
| Add services — use the same names as the site | — |
| Add photos | Ready: use `public/images/real/` |
| Set hours: 7:00 AM – 7:00 PM | **Which days?** Not confirmed |
| Mark 24/7 emergency availability in the description, **not** in the hours field | — |

Once GBP is live, activate the local schema on the site so the two match —
see `README.md` → "Activating local SEO". Matching data between GBP and the
site's structured data is a large part of the benefit.

**Recommended description** (uses only confirmed facts):

> Rooster Tree - Lawn Services handles tree work and lawn care for residential
> properties: tree trimming and removal, stump grinding, mowing, sod
> installation, mulching, flower beds, wood fence, power washing and junk
> hauling. Free estimates. Regular hours 7:00 AM – 7:00 PM, with 24/7
> emergency tree service for storm damage, fallen trees and dangerous
> branches. Hablamos Español.

---

## Priority 2 — Industry directories

Free or low-cost, and they rank for the searches this business wants. Do these
after GBP so the NAP is already settled.

| Directory | Notes | Blocked by |
| --- | --- | --- |
| Yelp for Business | High trust, strong local rankings | Service area |
| Angi | Lead-heavy; expect sales contact | Address, licence/insurance |
| Thumbtack | Quote-based, good for tree/lawn | Service area |
| HomeAdvisor | Often asks for licence details | Licence/insurance |
| Nextdoor Business | Very strong for neighbourhood-level lawn work | Service area |
| Better Business Bureau | Optional, paid, adds trust | Address |
| Bing Places | Quick win, imports from GBP | After GBP |
| Apple Business Connect | Feeds Apple Maps | After GBP |

Rule for every one of them: paste the **same** business name and phone. A
listing that says "Rooster Tree and Lawn" or formats the phone differently
splits the citation instead of strengthening it.

---

## Priority 3 — Local citations

General directories that mainly matter as consistent NAP signals.

- Yellow Pages, Manta, Hotfrog, Cylex, Chamber of Commerce directories
- Local newspaper / community site business listings
- Neighbourhood and HOA directories in the areas served

All blocked by address / service area. Batch them once NAP is fixed — an hour
of copy-paste is worth more than spreading it over months.

---

## Priority 4 — Local relationships (the durable links)

These are the hardest to get and the hardest for a competitor to copy.

- **Local chamber of commerce** — membership usually includes a followed link
- **Trade associations** — an arborist or landscaping association listing
  carries real topical relevance
- **Suppliers** — nurseries, sod farms, equipment dealers often have a
  "contractors we work with" page; ask
- **Complementary trades** — roofers, fence installers, landscapers,
  pool companies, property managers and realtors all meet customers who need
  tree work. A reciprocal referral page benefits both sides
- **Community sponsorship** — youth sports teams, school events, local
  festivals; small cost, genuine local link
- **Storm response** — after a significant storm, local news and community
  groups actively look for tree services to point people at. This is the one
  moment where the 24/7 emergency service is a news hook rather than a
  marketing line

---

## Priority 5 — Reviews

Reviews affect both map-pack ranking and conversion. Neither is optional for a
service business, and this is the one axis that needs an ongoing habit rather
than a one-time setup.

- Ask **at the job**, when the customer is standing in a finished yard and is
  happiest — not by email days later
- Send the GBP review link by text the same day; a link beats instructions
- Encourage specifics: the service, the outcome. "Ground the stump out and
  hauled everything off" is worth more than "great job"
- Reply to every review, including critical ones
- **Never** buy, incentivise or write reviews. Beyond the policy violations,
  fake reviews are the fastest way to lose a GBP listing entirely

The site claims **no** reviews, ratings or testimonials today, and that is
deliberate — see `README.md`. Once real reviews exist, they can be added to
the site and to the `aggregateRating` field in the structured data.

---

## What NOT to do

- Paid link schemes, link farms, PBNs
- Bulk directory-submission services — they generate inconsistent NAP at scale,
  which is the exact opposite of the goal
- Guest-post networks unrelated to tree or lawn care
- Listing an address that is not actually a place of business
- Claiming licences, insurance or years in business that are not confirmed —
  on the site, on GBP, or in any directory

---

## Suggested order

1. Confirm service area, address (or decide on a service-area listing),
   email, and licence/insurance status
2. Google Business Profile → verify → complete
3. Activate local SEO in the site's schema so the two agree
4. Bing Places + Apple Business Connect (import from GBP)
5. Yelp, Nextdoor, Thumbtack
6. Local citations in one batch
7. Start the review habit — this one never finishes
8. Chamber, associations, supplier and trade relationships
