import { Interaction, Movie } from "@/lib/types";

type InteractionPanelProps = {
  movie: Movie | null;
  interaction: Interaction | null;
  isSaving: boolean;
  onClose: () => void;
  onRate: (rating: number) => void;
  onToggleWatched: (watched: boolean) => void;
};

const ratingOptions = [1, 2, 3, 4, 5];

export function InteractionPanel({
  movie,
  interaction,
  isSaving,
  onClose,
  onRate,
  onToggleWatched
}: InteractionPanelProps) {
  if (!movie) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-end bg-[#020612]/75 p-4 backdrop-blur-sm">
      <aside className="w-full max-w-md rounded-2xl border border-blue-300/20 bg-[#07132b]/95 p-6 text-white shadow-[0_24px_90px_rgba(0,0,0,0.6)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-red-400">Your activity</p>
            <h2 className="text-3xl font-bold">{movie.title}</h2>
            <p className="mt-1 text-sm text-[#91a0bd]">{movie.genres || "Genres unavailable"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-blue-300/15 px-3 py-1 text-sm text-[#a9b6cf] transition hover:border-red-400/35 hover:bg-red-500/10 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Clicks" value={String(interaction?.clicks ?? 0)} />
          <Stat label="Rating" value={`${interaction?.rating ?? 0}/5`} />
          <Stat label="Watched" value={interaction?.watched ? "Yes" : "No"} />
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Rate this movie</h3>
            <div className="flex flex-wrap gap-2">
              {ratingOptions.map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => onRate(rating)}
                  disabled={isSaving}
                  className={`rounded-2xl border px-4 py-2 text-sm transition ${
                    interaction?.rating === rating
                      ? "border-red-400 bg-red-500/15 text-red-100"
                      : "border-blue-300/15 bg-blue-500/[0.06] text-[#a9b6cf] hover:bg-blue-500/15"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Watch status</h3>
            <button
              type="button"
              onClick={() => onToggleWatched(!(interaction?.watched ?? false))}
              disabled={isSaving}
              className="rounded-xl border border-blue-300/20 bg-blue-500/[0.08] px-4 py-3 text-sm text-[#d9e1f0] transition hover:border-blue-400/45 hover:bg-blue-500/15"
            >
              Mark as {interaction?.watched ? "unwatched" : "watched"}
            </button>
          </div>

          {interaction?.lastInteraction ? (
            <p className="text-sm text-[#8291ae]">Last interaction: {interaction.lastInteraction}</p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-blue-300/10 bg-blue-500/[0.055] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[#647493]">{label}</p>
      <p className="mt-2 text-lg font-bold text-white">{value}</p>
    </div>
  );
}
