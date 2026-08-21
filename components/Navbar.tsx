"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/content";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // The mobile sheet is white, so the bar must go solid with it.
  const solid = scrolled || open;
  const onDark = !solid;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "bg-white/80 shadow-[0_1px_24px_rgba(15,23,42,0.08)] backdrop-blur-md"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav className="container-x flex h-16 items-center justify-between sm:h-[72px]">
        <a
          href="#top"
          className={[
            "text-xl font-extrabold tracking-tight transition-colors duration-300",
            onDark ? "text-white" : "text-gray-950",
          ].join(" ")}
        >
          Everfit
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={[
                  "text-sm font-medium transition-colors duration-200",
                  onDark
                    ? "text-white/75 hover:text-white"
                    : "text-gray-600 hover:text-gray-950",
                ].join(" ")}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 md:flex">
          <a
            href="#login"
            className={[
              "text-sm font-medium transition-colors duration-200",
              onDark
                ? "text-white/75 hover:text-white"
                : "text-gray-600 hover:text-gray-950",
            ].join(" ")}
          >
            Log In
          </a>
          <a
            href="#trial"
            className="btn-primary px-5 py-2.5 hover:scale-[1.02]"
          >
            Start Free Trial
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={[
            "-mr-2 grid h-10 w-10 place-items-center rounded-lg transition-colors md:hidden",
            onDark
              ? "text-white hover:bg-white/10"
              : "text-gray-950 hover:bg-gray-900/5",
          ].join(" ")}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-t border-gray-900/10 bg-white md:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-base font-medium text-gray-800 hover:bg-gray-50"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-medium text-gray-800 hover:bg-gray-50"
              >
                Log In
              </a>
              <a
                href="#trial"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 w-full"
              >
                Start Free Trial
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
