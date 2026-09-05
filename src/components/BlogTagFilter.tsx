"use client";

import { useMemo, useState } from "react";
import type { Post } from "@/lib/post";
import { PostCard } from "@/components/PostCard";
import { Reveal } from "@/components/Reveal";

/**
 * Tag filter for the blog index. Mirrors the gallery filter on the home page:
 * same pill shape, same active treatment, same `aria-pressed` semantics.
 *
 * All posts are rendered from data already on the page — filtering never hits
 * the network, and with JavaScript off the full list is what ships.
 */
export function BlogTagFilter({ tags, posts }: { tags: string[]; posts: Post[] }) {
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(
    () => (active === "All" ? posts : posts.filter((p) => p.tags.includes(active))),
    [active, posts],
  );

  const options = ["All", ...tags];

  return (
    <>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter articles by topic">
          {options.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={active === tag}
              onClick={() => setActive(tag)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all motion-reduce:transition-none ${
                active === tag
                  ? "bg-forest-800 text-cream-50 shadow-md"
                  : "bg-cream-50 text-ink-700 ring-1 ring-forest-900/10 hover:ring-forest-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post, i) => (
          <Reveal key={post.slug} delay={(i % 3) * 0.08}>
            <PostCard post={post} />
          </Reveal>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"} shown
      </p>
    </>
  );
}
