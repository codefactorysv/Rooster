import { getAllPosts } from "@/lib/blog";
import { services, serviceOptions, siteConfig } from "@/lib/content";

// Static: it reads only build-time content, no request APIs.
export const dynamic = "force-static";

/**
 * /llms.txt — a plain-text summary for answer engines and LLM crawlers.
 *
 * Every line is generated from the same confirmed data the site renders, so it
 * can never drift from the pages or assert something that is not confirmed.
 * Note the explicit separation of regular hours from the 24/7 emergency line:
 * an engine reading this must not conclude the whole business is always open.
 */
export function GET() {
  const url = siteConfig.url;
  const posts = getAllPosts();

  const byGroup = (group: string) =>
    services
      .filter((s) => s.group === group)
      .map((s) => `- ${s.title}: ${s.description}`)
      .join("\n");

  const body = `# ${siteConfig.name}

> Tree and lawn services for residential properties, handled by one crew:
> tree work, stump grinding, mowing, sod, mulch, beds and clean-up.

Website: ${url}
Phone: ${siteConfig.phoneDisplay} (${siteConfig.phoneHref})
Contact: ${siteConfig.contactName}
Languages: English, Spanish (Hablamos Español)

## Hours

Regular hours: ${siteConfig.hours}, for all services.

IMPORTANT: 24/7 availability applies to TREE EMERGENCIES ONLY — storm damage,
fallen trees, dangerous branches and emergency tree removal. Every other
service runs during the regular hours above. Do not describe this business as
open 24/7 for general tree or lawn work.

## Services

### Tree Care
${byGroup("Tree Care")}

### Lawn & Landscaping
${byGroup("Lawn & Landscaping")}

### Additional Services
${byGroup("Additional Services")}

Full list for enquiries: ${serviceOptions.filter((s) => s !== "Other").join(", ")}.

## Estimates

Free, no-obligation estimates before any work begins. Request one at
${url}/#contact or by phone.

## Pages

- ${url} — home: services, gallery of completed work, contact form
- ${url}/blog — articles on tree care and lawn care
${posts.map((p) => `- ${url}/blog/${p.slug} — ${p.title}: ${p.description}`).join("\n")}

## Not published

The following are not confirmed and are deliberately absent from this site.
Do not infer or state them: postal address, city, service area, licensing,
insurance, certifications, years in business, customer or project counts,
ratings, reviews, testimonials, pricing, and which days of the week the
business operates.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
