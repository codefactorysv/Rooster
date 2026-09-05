import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { formatPostDate, getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/content";
import { articleSchema } from "@/lib/schema";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileCTA } from "@/components/MobileCTA";
import { PostCard } from "@/components/PostCard";
import { PostFaq } from "@/components/PostFaq";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/Icon";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: post.cover, width: 1200, height: 630, alt: post.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.cover],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug);

  return (
    <>
      <Navbar />
      <main>
        <article>
          {/* Header */}
          <header className="relative overflow-hidden bg-forest-950 pb-14 pt-28 sm:pb-16 sm:pt-36">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-32 -top-16 size-[30rem] rounded-full bg-forest-700/20 blur-3xl"
            />
            <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cream-100/70 transition-colors hover:text-sun-300"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
                All articles
              </Link>

              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-cream-50/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-100/85"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="mt-5 text-balance font-display text-3xl font-semibold leading-[1.12] text-cream-50 sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <p
                data-speakable
                className="mt-5 text-lg leading-relaxed text-cream-100/80"
              >
                {post.description}
              </p>
              <p className="mt-6 text-sm text-cream-100/55">
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                <span aria-hidden="true"> · </span>
                {post.readingMinutes} min read
                <span aria-hidden="true"> · </span>
                {post.author}
              </p>
            </div>
          </header>

          {/* Cover */}
          <div className="bg-cream-100">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="relative -mt-8 aspect-[16/10] w-full overflow-hidden rounded-3xl shadow-xl shadow-forest-950/20 sm:-mt-10 sm:aspect-[16/9]">
                <Image
                  src={post.cover}
                  alt={post.coverAlt}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 64rem, 100vw"
                  className={`object-cover ${post.coverPosition ?? ""}`}
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-cream-100 pb-20 pt-12 sm:pb-24 sm:pt-14">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <div
                className="prose-rooster"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />

              {post.faq && <PostFaq items={post.faq} />}

              {/* Conversion block */}
              <aside className="mt-14 rounded-3xl bg-forest-900 p-7 sm:p-9">
                <h2 className="font-display text-2xl font-semibold text-cream-50">
                  Want us to take a look?
                </h2>
                <p className="mt-3 text-cream-100/80">
                  Free estimates, no obligation. Regular hours {siteConfig.hours} —
                  tree emergencies are the exception and we answer those 24/7.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center justify-center rounded-full bg-sun-400 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-900 transition-all hover:-translate-y-0.5 hover:bg-sun-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    Get a Free Estimate
                  </Link>
                  <a
                    href={siteConfig.phoneHref}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-50/25 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-cream-50 transition-colors hover:bg-cream-50/10"
                  >
                    <Icon name="phone" className="size-4" />
                    {siteConfig.phoneDisplay}
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section
            aria-labelledby="related-heading"
            className="border-t border-forest-900/10 bg-cream-50 py-16 sm:py-20"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2
                id="related-heading"
                className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl"
              >
                Keep reading
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {related.map((item) => (
                  <PostCard
                    key={item.slug}
                    post={item}
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <MobileCTA />
      <JsonLd id={`article-schema-${post.slug}`} data={articleSchema(post)} />
    </>
  );
}
