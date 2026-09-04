import { siteConfig } from "@/lib/content";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-forest-950 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 size-[32rem] rounded-full bg-forest-700/25 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          <Reveal className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sun-400">
              Free Estimate
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-cream-50 sm:text-4xl lg:text-5xl">
              Tell Us What the Yard Needs
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-cream-100/75">
              Send a few details — photos help a lot — and we&apos;ll come back with a
              free, no-obligation estimate. Prefer to talk it through? Call us.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <a
                href={siteConfig.phoneHref}
                className="flex items-center gap-3 rounded-2xl border border-cream-50/10 bg-forest-900/60 p-4 transition-colors hover:border-sun-300/40"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sun-400/15 text-sun-300">
                  <Icon name="phone" className="size-5" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wide text-cream-100/50">
                    Call or text
                  </span>
                  <span className="block font-semibold text-cream-50">
                    {siteConfig.phoneDisplay}
                  </span>
                </span>
              </a>

              <div className="flex items-center gap-3 rounded-2xl border border-cream-50/10 bg-forest-900/60 p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sun-400/15 text-sun-300">
                  <Icon name="clock" className="size-5" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wide text-cream-100/50">
                    Regular hours
                  </span>
                  <span className="block font-semibold text-cream-50">{siteConfig.hours}</span>
                </span>
              </div>

              <a
                href={siteConfig.phoneHref}
                className="flex items-center gap-3 rounded-2xl border border-sun-400/40 bg-sun-400/10 p-4 transition-colors hover:bg-sun-400/20"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sun-400 text-ink-900">
                  <Icon name="emergency" className="size-5" strokeWidth={2.25} />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wide text-sun-200/80">
                    Tree emergency
                  </span>
                  <span className="block font-semibold text-cream-50">
                    Available 24/7 — call us
                  </span>
                </span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
