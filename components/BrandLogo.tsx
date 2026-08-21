import type { PartnerLogo } from "@/lib/content";

/**
 * Text-based stand-in for a partner brand mark: a monogram tile plus a
 * two-weight wordmark, so the marquee reads like real logos rather than text.
 * The tile carries the colour, which is what makes grayscale/hover swaps read.
 */
export function BrandLogo({
  logo,
  tone = "light",
}: {
  logo: PartnerLogo;
  tone?: "light" | "dark";
}) {
  const isLight = tone === "light";

  return (
    <div className="flex shrink-0 items-center gap-2.5 whitespace-nowrap">
      <span
        className={[
          "grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br text-[11px] font-black tracking-tight text-white",
          isLight
            ? "from-brand-500 to-cyanish-500 ring-1 ring-inset ring-white/20"
            : "from-brand-600 to-cyanish-500 ring-1 ring-inset ring-gray-900/10",
        ].join(" ")}
        aria-hidden="true"
      >
        {logo.mark}
      </span>
      <span
        className={[
          "text-[15px] font-extrabold uppercase leading-none tracking-tight",
          isLight ? "text-white" : "text-gray-900",
        ].join(" ")}
      >
        {logo.name}
        {logo.accent ? (
          <span className="font-light opacity-70"> {logo.accent}</span>
        ) : null}
      </span>
    </div>
  );
}
