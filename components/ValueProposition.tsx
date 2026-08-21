"use client";

import { Apple, Dumbbell, Target, Trophy } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

const CARDS = [
  {
    icon: Dumbbell,
    title: "Workout Programming",
    description:
      "Deliver personalized training through workout planning, powered by AI.",
    badge: "AI POWERED",
  },
  {
    icon: Apple,
    title: "Nutrition",
    description:
      "Provide guidance & accountability with flexible meal plan features.",
    badge: "AI POWERED",
  },
  {
    icon: Target,
    title: "Habit Coaching",
    description: "Create routines that drive lasting results and longevity.",
  },
  {
    icon: Trophy,
    title: "Sport Coaching",
    description:
      "Go beyond workouts with skill-based drills, and performance analytics.",
  },
];

export function ValueProposition() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-gray-950 py-24 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-brand-600/10 blur-[120px]"
      />
      <div className="container-x relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            The industry&apos;s Premier Solution for Health and Fitness Coaching
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ icon: Icon, title, description, badge }) => (
            <RevealItem key={title}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:bg-white/[0.06]">
                {badge ? (
                  <span className="mb-5 inline-flex items-center rounded-full bg-gradient-to-r from-brand-500/20 to-cyanish-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyanish-400 ring-1 ring-inset ring-cyanish-500/30">
                    {badge}
                  </span>
                ) : (
                  <span className="mb-5 block h-[26px]" aria-hidden="true" />
                )}
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-cyanish-500 text-white shadow-lg shadow-brand-500/20">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-gray-400">
                  {description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
