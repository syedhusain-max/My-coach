import { Marquee } from "./Marquee";

/** Section 3 — light-background continuous logo carousel. */
export function LogoMarquee() {
  return (
    <section className="border-y border-gray-200/70 bg-gray-50 py-14 sm:py-16">
      <div className="container-x mb-9 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
          Powering the world&apos;s best coaching businesses
        </p>
      </div>
      <Marquee tone="dark" duration="55s" hoverColor />
    </section>
  );
}
