"use client";

import {
  ArrowRight,
  BarChart3,
  Bell,
  CalendarClock,
  ClipboardList,
  CreditCard,
  Flag,
  HeartPulse,
  ListChecks,
  MessageCircle,
  MessagesSquare,
  PlayCircle,
  Plug,
  Radio,
  Wallet,
  Salad,
  Smartphone,
  Store,
  Trophy,
  UserPlus,
  Workflow,
} from "lucide-react";
import { FeatureSection, type Feature } from "./FeatureSection";

const PLAN_AND_COACH: Feature[] = [
  {
    icon: ClipboardList,
    title: "Client Programming",
    description:
      "Create structured, progressive workout plans in minutes, assisted by AI.",
  },
  {
    icon: Salad,
    title: "Macros Tracking",
    description:
      "Build macro-based meal plans and give clients flexible ways to log meals. Now powered by AI with instant meal scanning through MacroSnap.",
  },
  {
    icon: ListChecks,
    title: "Habit Tracking",
    description: "Boost and refine client motivation with daily insights.",
  },
  {
    icon: PlayCircle,
    title: "On-Demand Training",
    description:
      "Enable client access to workout programs and resources, anytime.",
  },
];

const MOTIVATE_AND_MEASURE: Feature[] = [
  {
    icon: BarChart3,
    title: "Data Analytics",
    description: "Use powerful data to coach better and retain clients.",
  },
  {
    icon: Flag,
    title: "Goal Setting",
    description: "Set clear, actionable goals that align with client ambitions.",
  },
  {
    icon: Trophy,
    title: "Fitness Challenges",
    description:
      "Design engaging online challenges to foster friendly competition.",
  },
  {
    icon: HeartPulse,
    title: "Check-ins",
    description:
      "Encourage client check-ins with built-in forms, and in-app messages.",
  },
  {
    icon: Plug,
    title: "Integrations",
    description: "Connect to all your favorite tools and devices.",
  },
];

const ENGAGE: Feature[] = [
  {
    icon: MessageCircle,
    title: "1-1 Messaging",
    description:
      "Stay close with clients using direct messages and voice notes.",
  },
  {
    icon: CalendarClock,
    title: "Scheduled Messaging",
    description:
      "Automate communication to stay organized and boost engagement.",
  },
  {
    icon: MessagesSquare,
    title: "Community Forum",
    description: "Create a vibrant community your members love.",
  },
  {
    icon: Radio,
    title: "Broadcast Messaging",
    description: "Send messages at scale to keep your client base engaged.",
  },
  {
    icon: Bell,
    title: "Announcements",
    description: "Push notifications for promotions and updates.",
  },
];

const SCALE: Feature[] = [
  {
    icon: UserPlus,
    title: "Streamline Onboarding",
    description:
      "Easily scale operations by automating client onboarding and admin tasks.",
  },
  {
    icon: Workflow,
    title: "Automate Workflows",
    description: "Effortlessly deliver group coaching to 1000s of clients.",
  },
  {
    icon: CreditCard,
    title: "Integrated Payments",
    description:
      "Simplify transactions with one-time or recurring payments, discount codes and free trials.",
  },
  {
    icon: Wallet,
    title: "HSA/FSA",
    description:
      "Enable qualifying clients to pay for coaching with pre-tax HSA/FSA funds.",
  },
  {
    icon: Store,
    title: "Marketplace for Lead Generation",
    badge: "beta",
    description: "Generate leads through our marketplace.",
  },
];

const BRANDING: Feature[] = [
  {
    icon: Smartphone,
    title: "White Label Solution",
    description:
      "Launch the custom branded fitness app of your dreams on iOS and Android.",
  },
];

export function PlanAndCoach() {
  return (
    <FeatureSection
      id="plan-and-coach"
      tone="light"
      label="Plan & Coach"
      headline="Plan With Precision, Coach With Confidence."
      features={PLAN_AND_COACH}
    />
  );
}

export function MotivateAndMeasure() {
  return (
    <FeatureSection
      id="motivate-and-measure"
      tone="dark"
      label="Motivate & Measure"
      headline="track, analyze, adapt."
      subheadline="every session. every session."
      features={MOTIVATE_AND_MEASURE}
    />
  );
}

export function Engage() {
  return (
    <FeatureSection
      id="engage"
      tone="light"
      label="Engage"
      headline="stay connected."
      subheadline="anytime, anywhere."
      features={ENGAGE}
    />
  );
}

export function Scale() {
  return (
    <FeatureSection
      id="scale"
      tone="dark"
      label="Scale"
      headline="Personalize, Perfect, Perform."
      features={SCALE}
    />
  );
}

export function Branding() {
  return (
    <FeatureSection
      id="branding"
      tone="light"
      label="Branding"
      headline="Elevate Your Presence, Expand Your Reach."
      features={BRANDING}
      footer={
        <a href="#contact-sales" className="btn-outline-blue hover:scale-[1.02]">
          Contact Sales
          <ArrowRight size={16} />
        </a>
      }
    />
  );
}
