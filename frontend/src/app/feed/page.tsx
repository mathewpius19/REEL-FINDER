"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { InteractionPanel } from "@/components/InteractionPanel";
import { RecommendationRail } from "@/components/RecommendationRail";
import { SearchBar } from "@/components/SearchBar";
import { getInteractions, getRecommendations, saveInteraction, searchMovies } from "@/lib/api";
import { saveSearchResult } from "@/lib/search-session";
import { clearUserSession, getUserSession } from "@/lib/session";
import { Interaction, InteractionInput, Movie, SearchResult, User } from "@/lib/types";

const examplePrompts = [
  "Movies like Interstellar",
  "Something emotional but not too long",
  "What is 27 × 14?"
];

export default function FeedPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [assistantAnswer, setAssistantAnswer] = useState<SearchResult | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [interactions, setInteractions] = useState<Record<number, Interaction>>({});
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [error, setError] = useState("");
  const [recommendationError, setRecommendationError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [isSavingInteraction, setIsSavingInteraction] = useState(false);

  useEffect(() => {
    const storedUser = getUserSession();

    if (!storedUser) {
      router.replace("/signin");
      return;
    }

    setUser(storedUser);

    void Promise.all([getRecommendations(storedUser.id), getInteractions(storedUser.id)])
      .then(([recommendedMovies, interactionHistory]) => {
        setRecommendations(recommendedMovies);
        setInteractions(
          interactionHistory.reduce<Record<number, Interaction>>((entries, interaction) => {
            entries[interaction.movieId] = interaction;
            return entries;
          }, {})
        );
      })
      .catch(() => {
        setRecommendationError("Your personalized suggestions are temporarily unavailable.");
      })
      .finally(() => {
        setIsLoadingRecommendations(false);
      });
  }, [router]);

  async function handleSearch(query: string) {
    setIsSearching(true);
    setError("");
    setAssistantAnswer(null);

    try {
      const result = await searchMovies(query);

      if (result.type === "movie_recommendation") {
        saveSearchResult({ ...result, query });
        router.push("/search/results");
        return;
      }

      setAssistantAnswer(result);
    } catch (searchError) {
      setError(
        searchError instanceof Error
          ? searchError.message
          : "Something went wrong while searching. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  }

  function handleSignOut() {
    clearUserSession();
    router.push("/signin");
  }

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

    try {
      const saved = await saveInteraction(payload);
      setInteractions((currentInteractions) => ({
        ...currentInteractions,
        [saved.movieId]: saved
      }));
    } catch {
      setRecommendationError("Unable to save that interaction right now.");
    } finally {
      setIsSavingInteraction(false);
    }
  }

  async function handleMovieOpen(movie: Movie) {
    setSelectedMovie(movie);
    const current = interactions[movie.movieId];
    await persistInteraction(movie, { clicks: (current?.clicks ?? 0) + 1 });
  }

  if (!user) {
    return null;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050b14] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,_rgba(34,211,238,0.12),_transparent_30%),radial-gradient(circle_at_85%_80%,_rgba(249,115,22,0.08),_transparent_26%)]" />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="text-sm font-semibold tracking-[0.18em] text-slate-200 uppercase">
          Movie Recommender
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-500 sm:inline">{user.userName}</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto min-h-[calc(100vh-84px)] w-full max-w-7xl px-4 pt-[9vh] pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-medium tracking-[0.28em] text-cyan-300 uppercase">Ask or discover</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
              What would you like to explore?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Search here for any movie recommendation, or choose from your personalized picks below.
            </p>
          </div>

          <SearchBar isLoading={isSearching} onSearch={handleSearch} />

          {!assistantAnswer && !isSearching ? (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {examplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void handleSearch(prompt)}
                  className="rounded-full border border-white/8 bg-white/[0.035] px-4 py-2 text-xs text-slate-400 transition hover:border-cyan-300/30 hover:text-slate-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}

          {isSearching ? (
            <div className="mt-7 flex items-center justify-center gap-3 text-sm text-slate-400" role="status">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
              Thinking through your request...
            </div>
          ) : null}

          {error ? (
            <div className="mt-7 rounded-2xl border border-amber-300/20 bg-amber-300/8 px-5 py-4 text-sm text-amber-100">
              {error}
            </div>
          ) : null}

          {assistantAnswer ? (
            <article className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
              <p className="mb-3 text-xs font-medium tracking-[0.22em] text-cyan-300 uppercase">Response</p>
              <p className="whitespace-pre-wrap text-base leading-7 text-slate-200">{assistantAnswer.response}</p>
            </article>
          ) : null}
        </div>

        <section className="mt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-medium tracking-[0.24em] text-orange-300 uppercase">Selected for you</p>
              <h2 className="text-2xl font-semibold tracking-tight">Based on your preferences</h2>
            </div>
            {!isLoadingRecommendations && recommendations.length > 0 ? (
              <span className="hidden text-xs text-slate-500 sm:block">Scroll to explore</span>
            ) : null}
          </div>

          {recommendationError ? (
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/8 px-5 py-4 text-sm text-amber-100">
              {recommendationError}
            </div>
          ) : isLoadingRecommendations ? (
            <RecommendationRailSkeleton />
          ) : recommendations.length > 0 ? (
            <RecommendationRail movies={recommendations} interactions={interactions} onSelect={handleMovieOpen} />
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] px-6 py-10 text-center text-sm text-slate-400">
              No personalized suggestions yet. Update your preferences or interact with a few movies first.
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

function RecommendationRailSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden pb-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="aspect-[2/3] w-[178px] shrink-0 animate-pulse rounded-3xl border border-white/8 bg-white/5 sm:w-[205px]"
        />
      ))}
    </div>
  );
}
