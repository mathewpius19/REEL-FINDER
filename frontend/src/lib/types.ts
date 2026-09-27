export type Movie = {
  movieId: number;
  title: string;
  genres: string;
  posterUrl: string | null;
};

export type User = {
  id: number;
  email: string;
  userName: string;
  genrePref: string;
  createdAt?: string;
};

export type Interaction = {
  id?: number;
  userId: number;
  movieId: number;
  rating: number;
  clicks: number;
  watched: boolean;
  lastInteraction: string;
};

export type InteractionInput = {
  userId: number;
  movieId: number;
  rating: number;
  clicks: number;
  watched: boolean;
  lastInteraction: string;
};

export type AuthPayload = {
  email: string;
  password: string;
};

export type SignupPayload = AuthPayload & {
  userName: string;
  genrePref: string;
};

export type SearchResult = {
  type: "assistant" | "movie_recommendation";
  response: string;
  movies: Movie[];
};

export type StoredSearchResult = SearchResult & {
  query: string;
};
