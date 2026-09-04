import { siteConfig } from "@/lib/content";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";

/**
 * The only place on the site that promises round-the-clock availability, and it
 * is deliberately scoped: 24/7 covers TREE EMERGENCIES. Everything else runs on
 * the regular hours, which are restated here so the two never blur together.
 */
const emergencies = [
  "Storm Damage",
  "Fallen Trees",
  "Dangerous Branches",
  "Emergency Tree Removal",
];

export function EmergencyBanner() {
  return (
    <section
      id="emergency"
      className="relative isolate overflow-hidden bg-forest-900 py-14 sm:py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sun-400/60 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-24 size-[26rem] rounded-full bg-sun-500/12 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-sun-400 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-900">
            <Icon name="emergency" className="size-3.5" strokeWidth={2.5} />
            Tree Emergency?
          </p>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold text-cream-50 sm:text-4xl">
            Call Us 24/7 for Tree Emergencies
          </h2>
          <p className="mt-3 max-w-xl text-cream-100/80">
            A tree does not wait for business hours to come down. When a storm hits or a
            limb ends up somewhere it should not be, we pick up.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {emergencies.map((item) => (
              <li
                key={item}
                className="rounded-full border border-cream-50/15 px-3 py-1 text-xs font-medium text-cream-100/85"
              >
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="shrink-0">
          <a
            href={siteConfig.phoneHref}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-sun-400 px-8 py-5 text-center shadow-xl shadow-sun-700/25 transition-all hover:-translate-y-0.5 hover:bg-sun-300 lg:w-auto"
          >
            <Icon name="phone" className="size-6 text-ink-900" strokeWidth={2.25} />
            <span className="text-left">
              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-ink-900/70">
                Call now — any hour
              </span>
              <span className="block text-xl font-bold text-ink-900 sm:text-2xl">
                {siteConfig.phoneDisplay}
              </span>
            </span>
          </a>
          <p className="mt-3 text-center text-xs text-cream-100/55 lg:text-right">
            All other services: {siteConfig.hours}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
