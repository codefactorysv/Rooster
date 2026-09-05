import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { Reveal } from "@/components/Reveal";
import { PostCard } from "@/components/PostCard";

/** "From the blog" strip on the home page. Renders nothing with no posts. */
export function LatestPosts() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="latest-posts-heading"
      className="bg-cream-50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-forest-600">
              From the Crew
            </p>
            <h2
              id="latest-posts-heading"
              className="mt-3 text-balance font-display text-3xl font-semibold text-ink-900 sm:text-4xl"
            >
              Tree &amp; Lawn Care, Explained
            </h2>
            <p className="mt-4 text-lg text-ink-700/80">
              What to look for on your own property, and what actually happens when we
              show up to do the work.
            </p>
          </div>
          <Link
            href="/blog"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-forest-700 transition-colors hover:text-forest-500"
          >
            All articles
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
            />
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
