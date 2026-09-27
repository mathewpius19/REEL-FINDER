"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { BrandMark } from "@/components/BrandMark";
import { signinUser } from "@/lib/api";
import { saveUserSession } from "@/lib/session";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await signinUser({ email, password });
      saveUserSession(user);
      router.push("/feed");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="reel-page relative min-h-screen overflow-hidden px-4 py-10 text-white sm:px-6">
      <div className="reel-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full border-[38px] border-red-500/[0.08]" />
      <section className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <div className="w-full rounded-2xl border border-blue-300/15 bg-[#08142c]/90 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-8">
          <Link href="/" className="mb-9 inline-flex">
            <BrandMark />
          </Link>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-400">Welcome back</p>
            <h1 className="text-4xl font-bold">Sign in</h1>
            <p className="text-sm text-[#91a0bd]">
              Access your personalized movie feed and recommendation history.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block space-y-2 text-sm text-[#b8c4da]">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-h-12 w-full rounded-xl border border-blue-300/15 bg-[#030817]/70 px-4 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15"
                required
              />
            </label>

            <label className="block space-y-2 text-sm text-[#b8c4da]">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-12 w-full rounded-xl border border-blue-300/15 bg-[#030817]/70 px-4 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15"
                required
              />
            </label>

            {error ? <p className="text-sm text-red-300">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-12 w-full rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-[0_12px_32px_rgba(47,107,255,0.28)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-900 disabled:text-blue-300"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-[#91a0bd]">
            New here?{" "}
            <Link href="/signup" className="font-semibold text-red-300 underline decoration-red-400/20 underline-offset-4 hover:text-red-200">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
