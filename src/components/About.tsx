import Image from "next/image";
import { siteConfig } from "@/lib/content";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { Logo } from "@/components/Logo";

const points = [
  { icon: "tree" as const, text: "Trees and lawn handled by the same crew" },
  { icon: "emergency" as const, text: "24/7 for storm damage and fallen trees" },
  { icon: "clock" as const, text: `Regular hours ${siteConfig.hours}` },
  { icon: "estimate" as const, text: "Free estimates before any work begins" },
  { icon: "hauling" as const, text: "Debris hauled off — we clean up after ourselves" },
  { icon: "language" as const, text: "Friendly service in English and Español" },
];

export function About() {
  return (
    <section id="about" className="relative bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl sm:aspect-[4/3] lg:aspect-[4/5]">
              <Image
                src="/images/real/property-cleanup-front-yard.jpg"
                alt="Front yard and driveway left tidy after a Rooster Tree - Lawn Services property clean-up"
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[50%_58%]"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-forest-600">
              About Us
            </p>
            <Logo
              className="mt-4 h-14 w-auto max-w-full sm:h-16"
              wordClassName="fill-forest-800"
              taglineClassName="fill-forest-600"
            />
            <p className="mt-6 text-lg leading-relaxed text-ink-700/85">
              Rooster is a tree and lawn crew run by {siteConfig.contactName}. The work
              happens right next to people&apos;s homes — over roofs, along fences, across
              lawns they look at every day — so we treat every job like the property
              belongs to someone who cares about it.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-700/85">
              Trees come down in sections, stumps get ground out instead of left behind,
              and the debris leaves with us. Then, because we do the lawn side too, we can
              put the yard back together — sod, mulch, beds and all.
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {points.map((point) => (
                <li key={point.text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-forest-800 text-sun-300">
                    <Icon name={point.icon} className="size-4" />
                  </span>
                  <span className="text-sm text-ink-800">{point.text}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
