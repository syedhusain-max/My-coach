import { PARTNER_LOGOS } from "@/lib/content";
import { BrandLogo } from "./BrandLogo";

/**
 * Pure-CSS infinite marquee: the logo list is rendered twice and the track is
 * translated -50%, so the loop is seamless with no JS on the main thread.
 */
export function Marquee({
  tone = "light",
  duration = "40s",
  reverse = false,
  hoverColor = false,
  className = "",
}: {
  tone?: "light" | "dark";
  duration?: string;
  reverse?: boolean;
  hoverColor?: boolean;
  className?: string;
}) {
  const items = [...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <div className={`mask-fade-x overflow-hidden ${className}`}>
      <div
        className={[
          "flex w-max items-center gap-10 sm:gap-14",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        ].join(" ")}
        style={{ ["--marquee-duration" as string]: duration }}
      >
        {items.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className={[
              "transition-all duration-300",
              hoverColor
                ? "opacity-50 grayscale hover:opacity-100 hover:grayscale-0"
                : "opacity-60 grayscale",
            ].join(" ")}
          >
            <BrandLogo logo={logo} tone={tone} />
          </div>
        ))}
      </div>
    </div>
  );
}
