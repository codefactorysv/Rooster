"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/content";
import { Icon } from "@/components/Icon";

const quickPoints = [
  { icon: "tree" as const, label: "Tree Services" },
  { icon: "stump" as const, label: "Stump Grinding" },
  { icon: "lawn" as const, label: "Lawn & Landscaping" },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, 140]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink-900"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="/images/real/front-yard-oak-fresh-mulch-beds.jpg"
          alt="Front yard with a large live oak and freshly mulched, freshly edged tree beds after a Rooster Tree - Lawn Services visit"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={75}
          className="object-cover object-[52%_58%]"
        />
      </motion.div>
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-forest-950/25"
      />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-ink-900/75 via-ink-900/20 to-transparent sm:block" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-36 sm:px-6 sm:pb-20 sm:pt-40 lg:px-8 lg:pb-24">
        <motion.a
          href={siteConfig.phoneHref}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-sun-300/45 bg-sun-400/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-sun-200 backdrop-blur-sm transition-colors hover:bg-sun-400/25 sm:text-[13px]"
        >
          <Icon name="emergency" className="size-3.5" strokeWidth={2.25} />
          {siteConfig.emergencyLabel}
        </motion.a>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-balance font-display text-4xl font-semibold leading-[1.05] text-cream-50 [text-shadow:0_2px_14px_rgb(10_26_12_/_0.6)] sm:[text-shadow:none] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Tree &amp; Lawn Services for Your Whole Property
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="mt-5 max-w-xl text-balance text-lg text-cream-100/90 [text-shadow:0_2px_14px_rgb(10_26_12_/_0.6)] sm:[text-shadow:none] sm:text-xl"
        >
          Tree work, stump grinding, mowing, sod, mulch and beds — one crew that takes
          care of the trees and the yard underneath them.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.44 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sun-400 px-7 py-4 text-sm font-bold uppercase tracking-wide text-ink-900 shadow-xl shadow-sun-700/25 transition-all hover:-translate-y-0.5 hover:bg-sun-300 sm:text-base"
          >
            Get a Free Estimate
          </Link>
          <a
            href={siteConfig.phoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-50/30 bg-cream-50/10 px-7 py-4 text-sm font-bold uppercase tracking-wide text-cream-50 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-cream-50/20 sm:text-base"
          >
            <Icon name="phone" className="size-4" />
            Call {siteConfig.phoneDisplay}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.56 }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-cream-50/15 pt-6 [text-shadow:0_2px_14px_rgb(10_26_12_/_0.6)] sm:[text-shadow:none]"
        >
          {quickPoints.map((point) => (
            <div key={point.label} className="flex items-center gap-2 text-sm text-cream-100/90">
              <Icon name={point.icon} className="size-4 text-sun-300" />
              {point.label}
            </div>
          ))}
          <div className="flex items-center gap-2 text-sm text-cream-100/90">
            <Icon name="clock" className="size-4 text-sun-300" />
            Open {siteConfig.hours}
          </div>
          <div className="flex items-center gap-2 rounded-full bg-cream-50/10 px-3 py-1 text-sm font-semibold text-cream-50 ring-1 ring-cream-50/20">
            <Icon name="language" className="size-4" />
            Hablamos Español
          </div>
        </motion.div>
      </div>
    </section>
  );
}
