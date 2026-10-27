import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { FOOTER_COLUMNS } from "@/lib/content";

const SOCIALS = [
  { icon: Twitter, label: "Twitter", href: "#twitter" },
  { icon: Linkedin, label: "LinkedIn", href: "#linkedin" },
  { icon: Instagram, label: "Instagram", href: "#instagram" },
  { icon: Youtube, label: "YouTube", href: "#youtube" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gray-950 py-16 sm:py-20">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <p className="text-xl font-extrabold tracking-tight text-white">
              PulseFit
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
              The #1 fitness and wellness coaching platform — everything you need
              to coach, scale, and win, in one place.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-white">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} PulseFit. All rights reserved.
          </p>
          <ul className="flex items-center gap-2">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-gray-400 transition-all hover:border-white/25 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
