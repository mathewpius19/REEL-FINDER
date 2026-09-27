"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { InteractionPanel } from "@/components/InteractionPanel";
import { MovieGrid } from "@/components/MovieGrid";
import { getInteractions, getRecommendations, saveInteraction } from "@/lib/api";
import { getSearchResult } from "@/lib/search-session";
import { getUserSession } from "@/lib/session";
import { Interaction, InteractionInput, Movie, StoredSearchResult, User } from "@/lib/types";

export default function SearchResultsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [result, setResult] = useState<StoredSearchResult | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [interactions, setInteractions] = useState<Record<number, Interaction>>({});
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isSavingInteraction, setIsSavingInteraction] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [error, setError] = useState("");
  const [recommendationError, setRecommendationError] = useState("");

  useEffect(() => {
    const storedUser = getUserSession();
    const storedResult = getSearchResult();

    if (!storedUser) {
      router.replace("/signin");
      return;
    }

    if (!storedResult || storedResult.type !== "movie_recommendation") {
      router.replace("/feed");
      return;
    }

    setUser(storedUser);
    setResult(storedResult);

    void getInteractions(storedUser.id)
      .then((history) => {
        setInteractions(
          history.reduce<Record<number, Interaction>>((entries, interaction) => {
            entries[interaction.movieId] = interaction;
            return entries;
          }, {})
        );
      })
      .catch(() => {
        setError("Movie results loaded, but your interaction history is temporarily unavailable.");
      });

    void getRecommendations(storedUser.id)
      .then(setRecommendations)
      .catch(() => {
        setRecommendationError("Personalized recommendations are temporarily unavailable.");
      })
      .finally(() => {
        setIsLoadingRecommendations(false);
      });
  }, [router]);

  async function persistInteraction(movie: Movie, updates: Partial<InteractionInput>) {
    if (!user) {
      return;
    }

    const current = interactions[movie.movieId];
    const payload: InteractionInput = {
      userId: user.id,
      movieId: movie.movieId,
      rating: updates.rating ?? current?.rating ?? 0,
      clicks: updates.clicks ?? current?.clicks ?? 0,
      watched: updates.watched ?? current?.watched ?? false,
      lastInteraction: new Date().toISOString().slice(0, 19)
    };

    setIsSavingInteraction(true);
    setError("");

    try {
      const saved = await saveInteraction(payload);
      setInteractions((currentInteractions) => ({
        ...currentInteractions,
        [saved.movieId]: saved
      }));
    } catch {
      setError("Unable to save that interaction right now.");
    } finally {
      setIsSavingInteraction(false);
    }
  }

  async function handleMovieOpen(movie: Movie) {
    setSelectedMovie(movie);
    const current = interactions[movie.movieId];
    await persistInteraction(movie, { clicks: (current?.clicks ?? 0) + 1 });
  }

  if (!user || !result) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_24%),linear-gradient(180deg,_#050b14,_#0f172a_52%,_#111827)] text-white">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-6 border-b border-white/8 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-medium tracking-[0.25em] text-cyan-300 uppercase">Movie results</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{result.query}</h1>
          </div>
          <Link
            href="/feed"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            New search
          </Link>
        </header>

        {error ? (
          <p className="mb-6 rounded-2xl border border-amber-300/20 bg-amber-300/8 px-4 py-3 text-sm text-amber-100">
            {error}
          </p>
        ) : null}

        {result.movies.length > 0 ? (
          <MovieGrid movies={result.movies} interactions={interactions} onSelect={handleMovieOpen} />
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] px-6 py-16 text-center text-sm text-slate-400">
            No matching movies were returned. Try a broader description.
          </div>
        )}

        <section className="mt-16 border-t border-white/8 pt-10">
          <div className="mb-6">
            <p className="mb-2 text-xs font-medium tracking-[0.25em] text-orange-300 uppercase">For you</p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Recommended from your taste</h2>
            <p className="mt-2 text-sm text-slate-400">
              Based on your genre preferences and previous movie interactions.
            </p>
          </div>

          {recommendationError ? (
            <p className="mb-6 rounded-2xl border border-amber-300/20 bg-amber-300/8 px-4 py-3 text-sm text-amber-100">
              {recommendationError}
            </p>
          ) : null}

          {isLoadingRecommendations ? (
            <RecommendationSkeleton />
          ) : recommendations.length > 0 ? (
            <MovieGrid movies={recommendations} interactions={interactions} onSelect={handleMovieOpen} />
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] px-6 py-12 text-center text-sm text-slate-400">
              No personalized recommendations are available yet. Interact with a few movies and try again.
            </div>
          )}
        </section>
      </section>

      <InteractionPanel
        movie={selectedMovie}
        interaction={selectedMovie ? interactions[selectedMovie.movieId] : null}
        isSaving={isSavingInteraction}
        onClose={() => setSelectedMovie(null)}
        onRate={(rating) => {
          if (selectedMovie) {
            void persistInteraction(selectedMovie, { rating });
          }
        }}
        onToggleWatched={(watched) => {
          if (selectedMovie) {
            void persistInteraction(selectedMovie, { watched });
          }
        }}
      />
    </main>
  );
}

function RecommendationSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="aspect-[2/3] animate-pulse rounded-3xl border border-white/8 bg-white/5"
        />
      ))}
    </div>
  );
}
