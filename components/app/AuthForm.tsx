"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Activity, ArrowLeft, ArrowRight } from "lucide-react";

export function AuthForm({ mode }: { mode: "signup" | "login" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const signup = mode === "signup";

  async function submitFromForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitForm();
  }

  async function submitForm() {
    const form = document.querySelector("form[data-auth-form='true']") as HTMLFormElement | null;
    if (!form) return;
    setError("");
    setLoading(true);
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "We couldn’t complete your request.");
        return;
      }

      const target = "/dashboard";
      if (typeof window !== "undefined") {
        window.location.replace(target);
        return;
      }
      router.replace(target);
      router.refresh();
    } catch {
      setError("Unable to connect. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-white">
      <section className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-12 text-white lg:flex">
        <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-50" />
        <div aria-hidden="true" className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-[100px]" />
        <Link href="/" className="relative flex items-center gap-3 text-xl font-extrabold tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500">
            <Activity size={22} />
          </span>
          Pulse<span className="text-blue-400">Fit</span>
        </Link>
        <div className="relative max-w-lg">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
            Make every rep count
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight">
            The strongest version of you starts here.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
            Build consistency, track every win, and make progress you can feel.
          </p>
        </div>
        <p className="relative text-xs text-slate-400">Your pace. Your progress. Your PulseFit.</p>
      </section>
      <section className="flex flex-1 items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950">
            <ArrowLeft size={16} />
            Back to home
          </Link>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            {signup ? "Your next chapter" : "Welcome back"}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
            {signup ? "Create your account" : "Log in to PulseFit"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {signup
              ? "Your training journey starts with one small step."
              : "Pick up right where your progress left off."}
          </p>
          <form
            data-auth-form="true"
            method="post"
            action={signup ? "/signup" : "/login"}
            onSubmit={submitFromForm}
            className="mt-8 space-y-5"
          >
            {signup && (
              <label className="block text-sm font-semibold text-slate-700">
                Your name
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={80}
                  className="mt-2 block h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  placeholder="Alex Morgan"
                />
              </label>
            )}
            <label className="block text-sm font-semibold text-slate-700">
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2 block h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                placeholder="you@example.com"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <input
                name="password"
                type="password"
                autoComplete={signup ? "new-password" : "current-password"}
                required
                minLength={signup ? 8 : undefined}
                className="mt-2 block h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                placeholder={signup ? "At least 8 characters" : "Your password"}
              />
            </label>
            {signup && (
              <p className="-mt-3 text-xs text-slate-500">
                Use at least 8 characters, including a number and upper- and lowercase letters.
              </p>
            )}
            {error && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? "Please wait…" : signup ? "Create account" : "Log in"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">
            {signup ? "Already have an account?" : "New to PulseFit?"}{" "}
            <Link
              href={signup ? "/login" : "/signup"}
              className="font-bold text-blue-700 hover:text-blue-800"
            >
              {signup ? "Log in" : "Create an account"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
