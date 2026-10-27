"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";

const NODES = [
  { x: 18, y: 22, label: "Coach" },
  { x: 78, y: 18, label: "Client" },
  { x: 84, y: 66, label: "Client" },
  { x: 24, y: 74, label: "Coach" },
  { x: 12, y: 50, label: "Client" },
  { x: 68, y: 44, label: "Coach" },
];

export function MarketplaceCta() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3.5 py-1.5 text-xs font-semibold text-brand-600">
            <Sparkles size={13} />
            Marketplace
          </span>
          <h2 className="mt-5 text-3xl font-bold leading-[1.15] tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
            Join the PulseFit Community
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-600">
            AI-powered matchmaking that ensures ideal client/trainer
            connections.
          </p>
          <a
            href="#marketplace"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-500"
          >
            Learn more
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </a>
        </Reveal>

        {/* Abstract matchmaking network */}
        <Reveal delay={0.15}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.4)]">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="ef-link" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.25" />
                </linearGradient>
              </defs>
              {NODES.map((node, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="46"
                  x2={node.x}
                  y2={node.y}
                  stroke="url(#ef-link)"
                  strokeWidth="0.4"
                  strokeDasharray="2 2"
                />
              ))}
            </svg>

            <div className="absolute left-1/2 top-[46%] z-10 -translate-x-1/2 -translate-y-1/2">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-cyanish-500 text-xs font-extrabold text-white shadow-xl shadow-brand-500/30 animate-float">
                pulsefit
              </div>
            </div>

            {NODES.map((node, i) => (
              <div
                key={`${node.label}-${i}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-brand-500 to-cyanish-500" />
                  <span className="text-[10px] font-semibold text-gray-700">
                    {node.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
