"use client";

import {
  Activity,
  ArrowRight,
  Building2,
  CalendarCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

const AUDIENCES = [
  { icon: Users, label: "Independent coaches" },
  { icon: Activity, label: "Studios & boutique gyms" },
  { icon: Building2, label: "Training organizations" },
];

export function TargetAudience() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-0 opacity-60"
      />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow">Built for every stage</p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.15] tracking-tight text-gray-950 sm:text-4xl lg:text-[2.75rem]">
            For Everyone from Inspiring Coaches to Training Organizations
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600">
            A proven blueprint to scale effortlessly, inspire clients, and ignite
            your business growth.
          </p>

          <ul className="mt-8 space-y-3.5">
            {AUDIENCES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500/10 text-brand-600">
                  <Icon size={17} />
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <a
            href="#trial"
            className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-500"
          >
            Start your 30-day free trial
            <ArrowRight size={16} />
          </a>
        </Reveal>

        {/* Abstract dashboard mockup */}
        <Reveal delay={0.15}>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-brand-500/20 via-cyanish-400/10 to-transparent blur-2xl"
            />
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)]">
              <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50/80 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="ml-3 text-[11px] font-medium text-gray-400">
                  everfit.io / coach dashboard
                </span>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <RevealGroup className="grid grid-cols-3 gap-3" stagger={0.08}>
                  {[
                    { icon: Users, k: "1,942", v: "Active clients" },
                    { icon: CalendarCheck, k: "96%", v: "Check-in rate" },
                    { icon: TrendingUp, k: "12x", v: "Revenue" },
                  ].map(({ icon: Icon, k, v }) => (
                    <RevealItem key={v} y={14}>
                      <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
                        <Icon size={15} className="text-brand-500" />
                        <p className="mt-2 text-base font-bold text-gray-950 sm:text-lg">
                          {k}
                        </p>
                        <p className="text-[10px] font-medium leading-tight text-gray-500">
                          {v}
                        </p>
                      </div>
                    </RevealItem>
                  ))}
                </RevealGroup>

                {/* Faux weekly volume chart */}
                <div className="rounded-xl border border-gray-100 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-800">
                      Weekly training volume
                    </p>
                    <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold text-brand-600">
                      +18%
                    </span>
                  </div>
                  <div className="flex h-24 items-end gap-1.5">
                    {[38, 55, 44, 72, 61, 88, 68, 95, 74, 100, 82, 91].map(
                      (h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}%` }}
                          className="flex-1 rounded-sm bg-gradient-to-t from-brand-500/30 to-cyanish-400/80"
                        />
                      ),
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-cyanish-500 text-[11px] font-bold text-white">
                    RH
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-gray-900">
                      Rachel completed Upper Body — Week 4
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Logged 2 minutes ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
