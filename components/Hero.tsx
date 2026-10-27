"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { Marquee } from "./Marquee";

const LINE = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-black pt-32 sm:pt-40"
    >
      {/* Parallax background: dot grid + gradient mesh */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="dot-grid absolute inset-0 opacity-70" />
        <motion.div
          style={reduce ? undefined : { scale: 1.08 }}
          className="absolute left-1/2 top-[-14rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-brand-500/25 blur-[120px] animate-pulse-glow"
        />
        <div className="absolute -left-32 top-40 h-[26rem] w-[26rem] rounded-full bg-cyanish-500/15 blur-[110px]" />
        <div className="absolute -right-28 top-24 h-[24rem] w-[24rem] rounded-full bg-brand-600/20 blur-[110px]" />
      </motion.div>

      <div className="container-x">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.12 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            variants={LINE}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur"
          >
            <Sparkles size={14} className="text-cyanish-400" />
            #1 Fitness and Wellness Coaching Platform
          </motion.div>

          <h1 className="text-[2.5rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            <motion.span
              variants={LINE}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="block"
            >
              The All-In-One
            </motion.span>
            <motion.span
              variants={LINE}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="block"
            >
              Platform for
            </motion.span>
            <motion.span
              variants={LINE}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="gradient-text block pb-2"
            >
              PulseFit
            </motion.span>
          </h1>

          <motion.p
            variants={LINE}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-base text-gray-400 sm:text-lg"
          >
            Unlock your full potential with the #1 platform to coach, scale, and
            win.
          </motion.p>

          <motion.div
            variants={LINE}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <a
              href="/signup"
              className="btn-primary w-full px-8 py-4 text-base hover:scale-[1.02] sm:w-auto"
            >
              Start Your Workout
            </a>
            <a
              href="#demo"
              className="btn-ghost-light w-full px-8 py-4 text-base hover:scale-[1.02] sm:w-auto"
            >
              <Play size={16} className="fill-current" />
              Watch Demo
            </a>
          </motion.div>

          <motion.p
            variants={LINE}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-12 text-sm font-medium text-gray-500"
          >
            Trusted by over 320,000 coaches
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="mt-8 pb-16 sm:pb-24"
      >
        <Marquee tone="light" duration="45s" />
      </motion.div>
    </section>
  );
}
