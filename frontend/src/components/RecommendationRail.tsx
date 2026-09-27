import { MovieCard } from "@/components/MovieCard";
import { Interaction, Movie } from "@/lib/types";

type RecommendationRailProps = {
  movies: Movie[];
  interactions: Record<number, Interaction>;
  onSelect: (movie: Movie) => void;
};

export function RecommendationRail({ movies, interactions, onSelect }: RecommendationRailProps) {
  return (
    <div className="recommendation-rail flex snap-x gap-4 overflow-x-auto pb-4">
      {movies.map((movie, index) => (
        <div
          key={movie.movieId}
          className="recommendation-card-enter w-[178px] shrink-0 snap-start sm:w-[205px]"
          style={{ animationDelay: `${Math.min(index, 8) * 75}ms` }}
        >
          <MovieCard
            movie={movie}
            interaction={interactions[movie.movieId]}
            onOpen={onSelect}
          />
        </div>
      ))}
    </div>
  );
}
