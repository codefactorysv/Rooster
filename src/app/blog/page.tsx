import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { siteConfig } from "@/lib/content";
import { blogIndexSchema } from "@/lib/schema";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileCTA } from "@/components/MobileCTA";
import { Reveal } from "@/components/Reveal";
import { BlogTagFilter } from "@/components/BlogTagFilter";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/Icon";

const description =
  "Practical tree care and lawn care advice from the crew that does the work — spotting a dangerous tree, what stump grinding actually involves, and choosing between sod and seed.";

export const metadata: Metadata = {
  title: "Tree & Lawn Care Advice",
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/blog`,
    title: `Tree & Lawn Care Advice | ${siteConfig.name}`,
    description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Tree & Lawn Care Advice | ${siteConfig.name}`,
    description,
    images: [siteConfig.ogImage],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-forest-950 pb-16 pt-28 sm:pb-20 sm:pt-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-24 size-[28rem] rounded-full bg-forest-700/25 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-sun-400">
                From the Crew
              </p>
              <h1 className="mt-3 text-balance font-display text-4xl font-semibold leading-[1.08] text-cream-50 sm:text-5xl lg:text-6xl">
                Tree &amp; Lawn Care, Explained
              </h1>
              <p
                data-speakable
                className="mt-5 max-w-2xl text-lg text-cream-100/80 sm:text-xl"
              >
                Straight answers about the work we do every day — what to look for, what
                actually happens on a job, and when something needs handling now.
              </p>
              <a
                href={siteConfig.phoneHref}
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-sun-300/45 bg-sun-400/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-sun-200 transition-colors hover:bg-sun-400/25"
              >
                <Icon name="emergency" className="size-3.5" strokeWidth={2.25} />
                Tree emergency? Call {siteConfig.phoneDisplay} — 24/7
              </a>
            </Reveal>
          </div>
        </section>

        <section className="bg-cream-100 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <p className="text-lg text-ink-700/80">
                No articles published yet — check back soon.
              </p>
            ) : (
              <BlogTagFilter tags={tags} posts={posts} />
            )}

            <Reveal delay={0.1}>
              <div className="mt-16 flex flex-col items-start gap-5 rounded-3xl bg-forest-900 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
                    Got a tree or a yard that needs work?
                  </h2>
                  <p className="mt-2 max-w-xl text-cream-100/80">
                    Free estimates, no obligation. Regular hours {siteConfig.hours}.
                  </p>
                </div>
                <Link
                  href="/#contact"
                  className="shrink-0 rounded-full bg-sun-400 px-7 py-4 text-sm font-bold uppercase tracking-wide text-ink-900 shadow-lg shadow-sun-700/25 transition-all hover:-translate-y-0.5 hover:bg-sun-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Get a Free Estimate
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <MobileCTA />
      <JsonLd id="blog-schema" data={blogIndexSchema(posts)} />
    </>
  );
}
