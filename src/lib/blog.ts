// Blog content loader. Posts are Markdown files in `content/blog/`, read at
// build time — same "edit files, no CMS" philosophy as `src/lib/content.ts`.
//
// Everything here runs on the server only (it touches the filesystem). Import
// it from Server Components, `generateStaticParams`, `sitemap.ts` and route
// handlers — never from a "use client" component.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked, type Tokens } from "marked";
import type { Post, PostFrontmatter } from "@/lib/post";

// Types and pure helpers live in `@/lib/post` so Client Components can import
// them without pulling this module's `node:fs` dependency into the browser
// bundle. Re-exported here for server-side convenience.
export type { Post, PostFrontmatter } from "@/lib/post";
export { formatPostDate } from "@/lib/post";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Trailing `{#custom-id}` on a heading, the same syntax Pandoc, kramdown and
 * remark-heading-id use. `marked` has no built-in support and would print it
 * as literal text, so this pulls it off the heading and emits it as the id.
 */
const HEADING_ID = /\s*\{#([A-Za-z][\w:.-]*)\}\s*$/;

/**
 * A dedicated parser instance so the override cannot leak into any other
 * `marked` user. Article headings need stable ids because the HowTo schema
 * links each step to `#step-N` (see src/lib/schema.ts).
 */
const markdown = new Marked({
  renderer: {
    heading({ tokens, depth, text }: Tokens.Heading) {
      const match = HEADING_ID.exec(text);
      if (!match) return false; // fall through to the default renderer

      // The id suffix is plain text to the inline lexer, so it sits at the
      // end of the last text token. Strip it there before rendering.
      const last = [...tokens].reverse().find((t) => "text" in t && typeof t.text === "string");
      if (last && "text" in last) {
        last.text = last.text.replace(HEADING_ID, "");
        if ("raw" in last) last.raw = last.raw.replace(HEADING_ID, "");
      }

      return `<h${depth} id="${match[1]}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
    },
  },
});

function isPublished(data: { draft?: boolean }) {
  // Drafts stay visible while developing so they can be previewed locally.
  return process.env.NODE_ENV !== "production" || data.draft !== true;
}

function readPostFile(fileName: string): Post | null {
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;

  if (!fm.title || !fm.slug || !fm.date) {
    throw new Error(
      `content/blog/${fileName}: frontmatter needs at least title, slug and date.`,
    );
  }
  if (!isPublished(fm)) return null;

  const words = content.trim().split(/\s+/).length;

  return {
    ...fm,
    tags: fm.tags ?? [],
    html: markdown.parse(content, { async: false }),
    readingMinutes: Math.max(1, Math.round(words / 200)),
  };
}

/** All published posts, newest first. */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map(readPostFile)
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** Every tag in use, alphabetical, deduplicated. */
export function getAllTags(): string[] {
  return [...new Set(getAllPosts().flatMap((p) => p.tags))].sort((a, b) =>
    a.localeCompare(b),
  );
}

/** Other posts to surface at the end of an article, newest first. */
export function getRelatedPosts(slug: string, limit = 2): Post[] {
  const current = getPostBySlug(slug);
  const others = getAllPosts().filter((p) => p.slug !== slug);
  if (!current) return others.slice(0, limit);

  // Prefer posts sharing a tag, then fall back to the most recent.
  const scored = others.map((p) => ({
    post: p,
    shared: p.tags.filter((t) => current.tags.includes(t)).length,
  }));
  scored.sort((a, b) => b.shared - a.shared || (a.post.date < b.post.date ? 1 : -1));
  return scored.slice(0, limit).map((s) => s.post);
}
