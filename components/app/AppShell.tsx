"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, BookOpen, LayoutDashboard, LogOut, Zap } from "lucide-react";
import type { User } from "@/lib/db";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/workouts", label: "Workout library", icon: BookOpen },
];

export function AppShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) throw new Error("Unable to log out. Please try again.");
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] flex-col border-r border-slate-200 bg-white px-5 py-7 lg:flex">
        <Link href="/" className="flex items-center gap-3 px-2 text-xl font-extrabold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">
            <Activity size={20} strokeWidth={2.5} />
          </span>
          <span>Pulse<span className="text-blue-600">Fit</span></span>
        </Link>
        <p className="mb-3 mt-12 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Train
        </p>
        <nav aria-label="Main navigation" className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-slate-950 p-5 text-white">
          <span className="mb-4 grid h-9 w-9 place-items-center rounded-xl bg-blue-500/20 text-blue-300">
            <Zap size={19} />
          </span>
          <p className="text-sm font-bold">Small steps. Big energy.</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Your next personal best starts with showing up.
          </p>
        </div>
      </aside>

      <div className="lg:pl-[250px]">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur sm:px-8">
          <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight lg:hidden">
              <Activity size={20} className="text-blue-600" />
              Pulse<span className="text-blue-600">Fit</span>
            </Link>
            <nav aria-label="Main navigation" className="flex items-center gap-1 overflow-x-auto lg:hidden">
              {NAV_ITEMS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold ${
                    pathname === href
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex shrink-0 items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-slate-500">Athlete</p>
              </div>
              <span
                aria-hidden="true"
                className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700"
              >
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <button
                type="button"
                onClick={() => void logout().catch((error: unknown) => window.alert(error instanceof Error ? error.message : "Unable to log out."))}
                aria-label="Log out"
                className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1400px] px-4 py-7 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
