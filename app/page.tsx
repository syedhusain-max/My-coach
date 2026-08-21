import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LogoMarquee } from "@/components/LogoMarquee";
import { ValueProposition } from "@/components/ValueProposition";

// Below-the-fold sections are code-split so the hero ships the smallest bundle.
const ServicesBanner = dynamic(() =>
  import("@/components/ServicesBanner").then((m) => m.ServicesBanner),
);
const TargetAudience = dynamic(() =>
  import("@/components/TargetAudience").then((m) => m.TargetAudience),
);
const PlanAndCoach = dynamic(() =>
  import("@/components/FeatureSections").then((m) => m.PlanAndCoach),
);
const MotivateAndMeasure = dynamic(() =>
  import("@/components/FeatureSections").then((m) => m.MotivateAndMeasure),
);
const Engage = dynamic(() =>
  import("@/components/FeatureSections").then((m) => m.Engage),
);
const Scale = dynamic(() =>
  import("@/components/FeatureSections").then((m) => m.Scale),
);
const Branding = dynamic(() =>
  import("@/components/FeatureSections").then((m) => m.Branding),
);
const Stats = dynamic(() => import("@/components/Stats").then((m) => m.Stats));
const MarketplaceCta = dynamic(() =>
  import("@/components/MarketplaceCta").then((m) => m.MarketplaceCta),
);
const FinalCta = dynamic(() =>
  import("@/components/FinalCta").then((m) => m.FinalCta),
);
const Footer = dynamic(() =>
  import("@/components/Footer").then((m) => m.Footer),
);

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LogoMarquee />
        <ValueProposition />
        <ServicesBanner />
        <TargetAudience />
        <PlanAndCoach />
        <MotivateAndMeasure />
        <Engage />
        <Scale />
        <Branding />
        <Stats />
        <MarketplaceCta />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
