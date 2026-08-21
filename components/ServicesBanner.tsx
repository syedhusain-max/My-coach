"use client";

import { Reveal } from "./Reveal";

/** Section 5 — minimal light-background statement banner. */
export function ServicesBanner() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
            Offer All Your Training Services Seamlessly In One Place
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-10 block h-1 w-40 rounded-full bg-gradient-to-r from-brand-500 to-cyanish-400"
          />
        </Reveal>
      </div>
    </section>
  );
}
