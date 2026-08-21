"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
};

type FeatureSectionProps = {
  id?: string;
  label: string;
  headline: string;
  subheadline?: string;
  features: Feature[];
  tone: "light" | "dark";
  footer?: ReactNode;
};

export function FeatureSection({
  id,
  label,
  headline,
  subheadline,
  features,
  tone,
  footer,
}: FeatureSectionProps) {
  const dark = tone === "dark";

  return (
    <section
      id={id}
      className={[
        "relative overflow-hidden py-24 sm:py-28",
        dark ? "bg-gray-950" : "bg-white",
      ].join(" ")}
    >
      {dark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-brand-600/10 blur-[130px]"
        />
      )}

      <div className="container-x relative">
        <Reveal className="max-w-3xl">
          <p
            className={[
              "text-xs font-semibold uppercase tracking-[0.24em]",
              dark ? "text-cyanish-400" : "text-brand-500",
            ].join(" ")}
          >
            {label}
          </p>
          <h2
            className={[
              "mt-4 text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl",
              dark ? "text-white" : "text-gray-950",
            ].join(" ")}
          >
            {headline}
          </h2>
          {subheadline ? (
            <p
              className={[
                "mt-3 text-lg italic sm:text-xl",
                dark ? "text-gray-400" : "text-gray-500",
              ].join(" ")}
            >
              {subheadline}
            </p>
          ) : null}
        </Reveal>

        <RevealGroup
          className={[
            "mt-14 grid gap-5",
            features.length === 1
              ? "max-w-2xl grid-cols-1"
              : "sm:grid-cols-2 lg:grid-cols-3",
          ].join(" ")}
        >
          {features.map(({ icon: Icon, title, description, badge }) => (
            <RevealItem key={title}>
              <div
                className={[
                  "group h-full rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1",
                  dark
                    ? "border-white/10 bg-white/[0.03] hover:border-cyanish-500/40 hover:bg-white/[0.06]"
                    : "border-gray-200 bg-gray-50/60 hover:border-brand-500/40 hover:bg-white hover:shadow-[0_18px_50px_-24px_rgba(15,23,42,0.3)]",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={[
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors",
                      dark
                        ? "bg-white/5 text-cyanish-400 ring-1 ring-inset ring-white/10"
                        : "bg-brand-500/10 text-brand-600",
                    ].join(" ")}
                  >
                    <Icon size={19} />
                  </span>
                  <h3
                    className={[
                      "text-base font-bold leading-snug",
                      dark ? "text-white" : "text-gray-950",
                    ].join(" ")}
                  >
                    {title}
                    {badge ? (
                      <span className="ml-2 inline-flex items-center rounded-full bg-gradient-to-r from-brand-500/20 to-cyanish-500/20 px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-cyanish-400 ring-1 ring-inset ring-cyanish-500/30">
                        {badge}
                      </span>
                    ) : null}
                  </h3>
                </div>
                <p
                  className={[
                    "mt-4 text-sm leading-relaxed",
                    dark ? "text-gray-400" : "text-gray-600",
                  ].join(" ")}
                >
                  {description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {footer ? <Reveal className="mt-10">{footer}</Reveal> : null}
      </div>
    </section>
  );
}
