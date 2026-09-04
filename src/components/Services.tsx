import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services, siteConfig } from "@/lib/content";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";

const bigServices = services.filter((s) => s.size === "lg");
const smallServices = services.filter((s) => s.size === "sm");

export function Services() {
  return (
    <section id="services" className="relative bg-cream-100 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-forest-600">
            What We Do
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-ink-900 sm:text-4xl lg:text-5xl">
            Tree Care and Lawn Care, One Crew
          </h2>
          <p className="mt-4 text-lg text-ink-700/80">
            From a dangerous tree over the roof to the mulch beds under it — we handle the
            whole property instead of leaving you to line up three different companies.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {bigServices.map((service, i) => (
            <Reveal
              key={service.slug}
              delay={(i % 3) * 0.08}
              className={service.span === 2 ? "lg:col-span-2" : undefined}
            >
              <article className="group relative isolate flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl sm:min-h-[24rem]">
                <Image
                  src={service.image as string}
                  alt={service.imageAlt ?? service.title}
                  fill
                  loading="lazy"
                  sizes={service.span === 2 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
                  className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                    service.imagePosition ?? ""
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/55 to-ink-900/10" />

                <span className="absolute left-6 top-6 rounded-full bg-cream-50/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-50 backdrop-blur-sm sm:left-8 sm:top-8">
                  {service.group}
                </span>

                <div className="relative flex flex-col gap-3 p-6 sm:p-8">
                  <div className="flex size-11 items-center justify-center rounded-full bg-sun-400 text-ink-900 shadow-lg">
                    <Icon name={service.icon} className="size-5" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-cream-50">
                    {service.title}
                  </h3>
                  <p className="max-w-md text-sm text-cream-100/85">{service.description}</p>
                  <Link
                    href="#contact"
                    className="mt-1 inline-flex w-fit items-center gap-1 text-sm font-bold text-sun-300 transition-colors hover:text-sun-200"
                  >
                    Request Service
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14" delay={0.1}>
          <h3 className="font-display text-xl font-semibold text-ink-900">
            Also part of what we do
          </h3>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {smallServices.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.06} y={16}>
              {service.emergency ? (
                <a
                  href={siteConfig.phoneHref}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-sun-500/40 bg-sun-50 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-sun-500 hover:shadow-lg"
                >
                  <div className="flex size-9 items-center justify-center rounded-full bg-sun-400 text-ink-900">
                    <Icon name={service.icon} className="size-4.5" />
                  </div>
                  <p className="font-semibold text-ink-900">{service.title}</p>
                  <p className="text-xs leading-relaxed text-ink-700/70">{service.description}</p>
                  <span className="mt-auto pt-1 text-xs font-bold text-forest-700 underline underline-offset-2">
                    Call {siteConfig.phoneDisplay}
                  </span>
                </a>
              ) : (
                <Link
                  href="#contact"
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-forest-900/10 bg-cream-50 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-forest-300 hover:shadow-lg"
                >
                  <div className="flex size-9 items-center justify-center rounded-full bg-forest-50 text-forest-700 transition-colors group-hover:bg-sun-400 group-hover:text-ink-900">
                    <Icon name={service.icon} className="size-4.5" />
                  </div>
                  <p className="font-semibold text-ink-900">{service.title}</p>
                  <p className="text-xs leading-relaxed text-ink-700/70">{service.description}</p>
                </Link>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-8 text-sm text-ink-700/70">
            Regular hours are {siteConfig.hours}.{" "}
            <span className="font-semibold text-ink-800">
              Tree emergencies are the exception — call any hour, day or night.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
