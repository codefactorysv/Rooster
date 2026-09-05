// Post types and pure helpers — no filesystem access, so this module is safe
// to import from Client Components. The filesystem loader lives in
// `src/lib/blog.ts` and must only be imported from the server.

export type PostFrontmatter = {
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  /** Path under /public. Every cover is one of the owner's own job photos. */
  cover: string;
  coverAlt: string;
  tags: string[];
  draft?: boolean;
  /** Optional object-position utility so a cover crops on its subject. */
  coverPosition?: string;
  /**
   * Steps rendered as HowTo structured data. Must match, one for one, the
   * numbered steps written in the article body.
   */
  howTo?: { name: string; text: string }[];
  howToName?: string;
  /**
   * FAQ shown in a visible accordion at the end of the article. The FAQPage
   * JSON-LD is generated from this exact list, so the markup can never claim
   * an answer the reader cannot see.
   */
  faq?: { question: string; answer: string }[];
};

export type Post = PostFrontmatter & {
  /** Rendered HTML body. */
  html: string;
  /** Rough reading time in minutes, for the article header. */
  readingMinutes: number;
};

export function formatPostDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
