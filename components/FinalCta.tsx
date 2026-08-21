"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <section
      id="trial"
      className="relative isolate overflow-hidden bg-black py-28 sm:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-900/25 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20 blur-[130px] animate-pulse-glow" />
        <div className="dot-grid absolute inset-0 opacity-40" />
      </div>

      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Join the Coaching Evolution today!
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
            Start your 30-day free trial today and unlock the tools to scale,
            motivate, and succeed!
          </p>
          <a
            href="#signup"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-9 py-4 text-base font-semibold text-white shadow-[0_0_40px_-6px_rgba(59,130,246,0.75)] transition-all duration-200 hover:scale-[1.02] hover:bg-brand-600 hover:shadow-[0_0_60px_-4px_rgba(59,130,246,0.9)]"
          >
            Start Free Trial
            <ArrowRight size={18} />
          </a>
          <p className="mt-5 text-xs text-gray-500">
            No credit card required · Cancel anytime
          </p>
        </Reveal>
      </div>
    </section>
  );
}
