"use client";

import { Quote, Star } from "lucide-react";
import { STATS } from "@/lib/content";
import { CountUp } from "./CountUp";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

export function Stats() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-black py-24 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="absolute left-1/2 top-10 h-[30rem] w-[52rem] -translate-x-1/2 rounded-full bg-brand-600/10 blur-[140px]" />
      </div>

      <div className="container-x relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                className="fill-cyanish-400 text-cyanish-400"
              />
            ))}
            <span className="ml-1.5 text-xs font-medium text-white/70">
              4.9 average rating
            </span>
          </div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            The #1 Rated Personal Training Platform
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((stat) => (
            <RevealItem key={stat.author}>
              <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  className="gradient-text text-5xl font-extrabold tracking-tight sm:text-[3.25rem]"
                />
                <p className="mt-2 text-sm font-bold uppercase tracking-wide text-white">
                  {stat.label}
                </p>
                <Quote
                  size={22}
                  className="mt-6 shrink-0 text-white/20"
                  aria-hidden="true"
                />
                <blockquote className="mt-3 flex-1 text-sm italic leading-relaxed text-gray-300">
                  &ldquo;{stat.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <p className="text-sm font-semibold text-white">
                    {stat.author}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-400">
                    {stat.role}
                  </p>
                </figcaption>
              </figure>
            </RevealItem>
          ))}

          {/* Sixth tile keeps the 3-column grid balanced. */}
          <RevealItem>
            <div className="flex h-full flex-col justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-brand-600/20 to-cyanish-500/10 p-7 backdrop-blur">
              <p className="text-5xl font-extrabold tracking-tight text-white">
                320k+
              </p>
              <p className="mt-2 text-sm font-bold uppercase tracking-wide text-white/90">
                Coaches on Everfit
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Join the coaches who moved their programming, nutrition, and
                payments into one platform.
              </p>
              <a
                href="#trial"
                className="btn-primary mt-7 self-start hover:scale-[1.02]"
              >
                Start Free Trial
              </a>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
