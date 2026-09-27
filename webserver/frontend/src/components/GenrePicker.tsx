import { GENRE_OPTIONS } from "@/lib/constants";

type GenrePickerProps = {
  selectedGenres: string[];
  onChange: (genres: string[]) => void;
};

export function GenrePicker({ selectedGenres, onChange }: GenrePickerProps) {
  function toggleGenre(genre: string) {
    if (selectedGenres.includes(genre)) {
      onChange(selectedGenres.filter((entry) => entry !== genre));
      return;
    }

    onChange([...selectedGenres, genre]);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {GENRE_OPTIONS.map((genre) => {
        const selected = selectedGenres.includes(genre);

        return (
          <button
            key={genre}
            type="button"
            onClick={() => toggleGenre(genre)}
            className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
              selected
                ? "border-red-400 bg-red-500/15 text-red-100 shadow-[0_8px_24px_rgba(239,51,64,0.08)]"
                : "border-blue-300/15 bg-blue-500/[0.045] text-[#a9b6cf] hover:border-blue-400/35 hover:bg-blue-500/10"
            }`}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
}
