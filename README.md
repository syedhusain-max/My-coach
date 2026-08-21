# Everfit — Landing Page

A pixel-faithful, production-ready clone of the Everfit.io marketing page.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS 3.4**
- **Framer Motion 11** — hero stagger, scroll reveals, count-ups, hero parallax
- **Lucide React** — all icons
- **Inter** via `next/font/google` (self-hosted, no layout shift)

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Structure

```
app/
  layout.tsx          Inter font, metadata
  page.tsx            section order; below-fold sections are code-split
  globals.css         Tailwind layers + .container-x/.btn-*/.gradient-text
  icon.svg            favicon
components/
  Navbar.tsx          sticky, transparent → bg-white/80 backdrop-blur on scroll
  Hero.tsx            dark gradient + parallax mesh, staggered headline, marquee
  Marquee.tsx         CSS-only infinite logo loop (duplicated track, -50%)
  BrandLogo.tsx       text-based partner brand marks
  LogoMarquee.tsx     light logo carousel (grayscale → colour on hover)
  ValueProposition.tsx    4 pillar cards with "AI POWERED" badges
  ServicesBanner.tsx      centered statement + gradient rule
  TargetAudience.tsx      split layout + dashboard mockup
  FeatureSection.tsx      generic label/headline/grid section
  FeatureSections.tsx     Plan & Coach · Motivate & Measure · Engage · Scale · Branding
  Stats.tsx               glassmorphism testimonial/stat cards with count-up
  MarketplaceCta.tsx      marketplace pitch + SVG matchmaking network
  FinalCta.tsx            radial-gradient CTA with glowing button
  Footer.tsx              5 columns + social row
  Reveal.tsx              Reveal / RevealGroup / RevealItem scroll primitives
  CountUp.tsx             rAF count-up on first view
lib/content.ts        partner logos, nav links, stats, footer columns
```

## Notes

- Every animation is gated behind `prefers-reduced-motion`.
- Marquees are pure CSS (no JS on the main thread); reveals use
  `whileInView` with `once: true` so nothing re-runs on scroll-back.
- Verified with no horizontal overflow at 320 / 375 / 768 / 1024 / 1440px.
