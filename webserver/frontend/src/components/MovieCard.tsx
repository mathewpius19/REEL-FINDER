import Image from "next/image";

import { Interaction, Movie } from "@/lib/types";

type MovieCardProps = {
  movie: Movie;
  interaction?: Interaction;
  onOpen?: (movie: Movie) => void;
};

export function MovieCard({ movie, interaction, onOpen }: MovieCardProps) {
  const hasPoster = Boolean(movie.posterUrl);

  return (
    <article
      className="group overflow-hidden rounded-2xl border border-blue-300/10 bg-[#0a1730]/90 shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1.5 hover:border-red-400/55 hover:shadow-[0_18px_52px_rgba(239,51,64,0.1)]"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-[#101c36]">
        <button type="button" onClick={() => onOpen?.(movie)} className="block h-full w-full text-left">
          {hasPoster ? (
            <Image
              src={movie.posterUrl ?? ""}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(47,107,255,0.2),_transparent_55%),linear-gradient(180deg,_#101f42,_#030817)] px-6 text-center text-sm text-[#a9b6cf]">
              Poster unavailable
            </div>
          )}
        </button>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-bold text-white">{movie.title}</h3>
          <span className="shrink-0 rounded-full border border-blue-300/15 bg-blue-500/[0.07] px-2 py-1 text-[11px] text-[#a9b6cf]">
            #{movie.movieId}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-[#8291ae]">{movie.genres || "Genres unavailable"}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2 py-1 text-[11px] text-[#a9b6cf]">
            {interaction?.clicks ?? 0} clicks
          </span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2 py-1 text-[11px] text-[#a9b6cf]">
            {interaction?.rating ?? 0}/5 rating
          </span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2 py-1 text-[11px] text-[#a9b6cf]">
            {interaction?.watched ? "Watched" : "Unwatched"}
          </span>
        </div>
      </div>
    </article>
  );
}
