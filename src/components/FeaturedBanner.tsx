"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/Reveal";

export function FeaturedBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-60, 60]);

  return (
    <section ref={ref} className="relative isolate flex min-h-[70vh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-x-0 -top-16 -bottom-16">
          <Image
            src="/images/real/backyard-lawn-mowing-stripes.jpg"
            alt="Large backyard mowed in clean alternating stripes behind a single-story home"
            fill
            loading="lazy"
            sizes="100vw"
            quality={75}
            className="object-cover object-[50%_62%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/95 via-ink-900/78 to-ink-900/35" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sun-400">
              Trees And Lawn
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-cream-50 sm:text-4xl lg:text-5xl">
              The Yard Doesn&apos;t Stop at the Tree Line.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cream-100/85">
              Most tree companies leave once the tree is down. We are already mowing,
              edging, laying sod and mulching beds — so the property looks finished, not
              just cleared.
            </p>
            <Link
              href="#contact"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-sun-400 px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink-900 shadow-xl shadow-sun-700/25 transition-all hover:-translate-y-0.5 hover:bg-sun-300 sm:text-base"
            >
              Get Your Free Estimate
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
