import { ChevronDown } from "lucide-react";

/**
 * Visible FAQ at the end of an article.
 *
 * Built on <details>/<summary> so it is keyboard operable and expandable by
 * find-in-page with no JavaScript at all — which also means the answers are in
 * the DOM for crawlers even while collapsed. The FAQPage JSON-LD is generated
 * from the same array this renders, so markup and page can never disagree.
 */
export function PostFaq({ items }: { items: { question: string; answer: string }[] }) {
  if (!items.length) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-14 border-t border-forest-900/10 pt-10">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-forest-600">
        Common Questions
      </p>
      <h2
        id="faq-heading"
        className="mt-3 font-display text-2xl font-semibold text-ink-900 sm:text-3xl"
      >
        Frequently Asked Questions
      </h2>

      <div className="mt-6 flex flex-col gap-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl border border-forest-900/10 bg-cream-50 px-5 open:border-forest-300 open:shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown
                aria-hidden="true"
                className="size-5 shrink-0 text-forest-600 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <p className="pb-5 pr-9 text-ink-700/85">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
