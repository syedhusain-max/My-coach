export type PartnerLogo = {
  name: string;
  /** short mark shown to the left of the wordmark */
  mark: string;
  /** optional secondary word rendered in lighter weight */
  accent?: string;
};

export const PARTNER_LOGOS: PartnerLogo[] = [
  { name: "BSF", accent: "Performance", mark: "B" },
  { name: "Squash", accent: "Skills", mark: "S" },
  { name: "The Lyss", accent: "Method", mark: "L" },
  { name: "Physio", accent: "RX", mark: "R" },
  { name: "Drop", accent: "Gym", mark: "D" },
  { name: "Henley", accent: "Fitness", mark: "H" },
  { name: "Winning", accent: "Mentality", mark: "W" },
  { name: "Redefining", accent: "Strength", mark: "S" },
  { name: "Strength", accent: "Base", mark: "SB" },
  { name: "Boulay", accent: "Fit", mark: "BF" },
  { name: "InteGrit", accent: "Performance", mark: "IG" },
];

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#resources" },
  { label: "Blog", href: "#blog" },
];

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  display?: string;
  label: string;
  quote: string;
  author: string;
  role: string;
};

export const STATS: Stat[] = [
  {
    value: 82,
    prefix: "+",
    suffix: "%",
    label: "free trial conversion rate",
    quote:
      "Since using PulseFit, our pipeline has strengthened significantly, and our free trial conversions have had a major impact on our top line.",
    author: "Scott Deakins",
    role: "Founder and CEO of Under Par Performance Golf",
  },
  {
    value: 90,
    prefix: "+",
    suffix: "%",
    label: "Client Retention",
    quote:
      "PulseFit has been the game-changer behind my growth from 50 to over 1900 clients.",
    author: "Cori Leftkowith",
    role: "Founder of Redefining Strength",
  },
  {
    value: 5000,
    label: "New clients in 30 days",
    quote:
      "We ran our group program for the first time on PulseFit, and it's been the most dreamy thing ever. The amount of retention is significantly higher than before.",
    author: "Rachel Henley",
    role: "Founder of Henley Fitness",
  },
  {
    value: 25,
    suffix: "+",
    label: "Hours Per Week Freed Up On Admin Tasks",
    quote:
      "PulseFit was integrating and constantly upgrading how we can make the experience better for clients and coaches.",
    author: "Brian Foley",
    role: "Founder of TRNDAY",
  },
  {
    value: 12,
    suffix: "x",
    label: "Increase In Revenue In First 3 Months.",
    quote:
      "With PulseFit, everything is all right there. It makes it easy to manage everything and see everything all in one platform.",
    author: "Brandon Woo",
    role: "Founder of Winning Mentality Fitness",
  },
];

export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Integrations", "API"],
  },
  {
    title: "Resources",
    links: ["Blog", "Help Center", "Community", "Webinars"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Press"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security"],
  },
];
