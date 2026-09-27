import { MovieCard } from "@/components/MovieCard";
import { Interaction, Movie } from "@/lib/types";

type MovieGridProps = {
  movies: Movie[];
  interactions?: Record<number, Interaction>;
  onSelect?: (movie: Movie) => void;
};

export function MovieGrid({ movies, interactions, onSelect }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.movieId}
          movie={movie}
          interaction={interactions?.[movie.movieId]}
          onOpen={onSelect}
        />
      ))}
    </div>
  );
}
