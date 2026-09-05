import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatPostDate, type Post } from "@/lib/post";

/**
 * Article card. Follows the same visual language as the service cards on the
 * home page — photo, dark scrim, content anchored to the bottom.
 */
export function PostCard({ post, sizes }: { post: Post; sizes?: string }) {
  return (
    <article className="group relative isolate flex h-full min-h-[20rem] flex-col justify-end overflow-hidden rounded-3xl sm:min-h-[22rem]">
      <Image
        src={post.cover}
        alt={post.coverAlt}
        fill
        loading="lazy"
        sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
        className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
          post.coverPosition ?? ""
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/55 to-ink-900/10" />

      {post.tags[0] && (
        <span className="absolute left-6 top-6 rounded-full bg-cream-50/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-50 backdrop-blur-sm">
          {post.tags[0]}
        </span>
      )}

      <div className="relative flex flex-col gap-3 p-6 sm:p-7">
        <p className="text-xs font-medium uppercase tracking-wide text-cream-100/70">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden="true"> · </span>
          {post.readingMinutes} min read
        </p>
        <h3 className="font-display text-xl font-semibold text-cream-50 sm:text-2xl">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="text-sm text-cream-100/85">{post.description}</p>
        <span className="mt-1 inline-flex w-fit items-center gap-1 text-sm font-bold text-sun-300 transition-colors group-hover:text-sun-200">
          Read article
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
          />
        </span>
      </div>
    </article>
  );
}
