import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";

const highlights = [
  "Semantic search with natural-language queries",
  "Personalized user recommendations based on saved preferences",
  "Interaction-aware feed with clicks, ratings, and watch history"
];

export default function HomePage() {
  return (
    <main className="reel-page relative min-h-screen overflow-hidden text-white">
      <div className="reel-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-28 right-[8%] h-72 w-72 rounded-full border-[42px] border-blue-500/10" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full border-[34px] border-red-500/10" />

      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-14 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl space-y-7">
          <BrandMark />
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-400">Your taste. In focus.</p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[0.96] tracking-[-0.035em] sm:text-7xl">
              Find the film you&apos;re already thinking about.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[#a9b6cf] sm:text-lg">
              Describe a mood, a memory, or a movie you love. ReelFinder turns natural language and your personal taste into a sharper watchlist.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-[0_12px_35px_rgba(47,107,255,0.28)] transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Create account
            </Link>
            <Link
              href="/signin"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-red-400/35 bg-red-500/10 px-6 text-sm font-bold text-red-100 transition hover:-translate-y-0.5 hover:bg-red-500/20"
            >
              Sign in
            </Link>
            <Link
              href="/feed"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-[#bdc8dc] transition hover:border-blue-400/35 hover:text-white"
            >
              Open feed
            </Link>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {highlights.map((highlight, index) => (
            <article
              key={highlight}
              className="bg-[#08142c]/95 p-6 text-sm leading-6 text-[#a9b6cf] backdrop-blur"
            >
              <span className={`mb-4 block text-xs font-bold tracking-[0.22em] ${index === 1 ? "text-red-400" : "text-blue-400"}`}>
                0{index + 1}
              </span>
              <p>{highlight}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
