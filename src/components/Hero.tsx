"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const path = ["BBA", "BS", "MBA", "MS", "PhD"];

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[680px] items-end overflow-hidden bg-ink text-white lg:min-h-svh">
      <Image
        src="/images/nbs.jpeg"
        alt="The main building of the University of Sargodha"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/70 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-40 pb-12 lg:px-10 lg:pb-16">
        <p className="text-sm font-medium text-primary-light">
          Faculty of Social Sciences, University of Sargodha
        </p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[1.02] font-semibold tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
          From your first BBA class to your PhD defence.
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/80">
          Malik Firoz Khan Noon Business School offers twelve degree programs in management,
          finance, commerce, analytics and entrepreneurship, with weekend options for working
          professionals.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#programs"
            className="rounded-full bg-white px-7 py-3.5 font-semibold text-ink transition-colors hover:bg-primary-light"
          >
            Explore programs
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/40 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            Contact admissions
          </a>
        </div>

        {/* Signature: the academic path, drawn once on load */}
        <a
          href="#programs"
          aria-label="The academic path at NBS: BBA, BS, MBA, MS and PhD. View programs."
          className="mt-16 block max-w-3xl rounded-2xl border border-white/15 bg-white/5 px-6 py-5 backdrop-blur-md transition-colors hover:bg-white/10"
        >
          <p className="text-xs text-white/60">Your path at NBS</p>
          <div className="relative mt-4">
            <motion.span
              className="absolute top-[7px] right-2 left-2 h-px origin-left bg-primary-light"
              initial={{ scaleX: reduce ? 1 : 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduce ? 0 : 1.8, ease: "easeInOut", delay: 0.4 }}
            />
            <ol className="relative flex justify-between">
              {path.map((step, i) => (
                <motion.li
                  key={step}
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.4 + i * 0.4, duration: 0.4 }}
                >
                  <span
                    className={`size-[15px] rounded-full border-2 border-primary-light ${
                      i === path.length - 1 ? "bg-primary-light" : "bg-ink"
                    }`}
                  />
                  <span className="font-display text-sm font-semibold sm:text-base">{step}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        </a>
      </div>
    </section>
  );
}
