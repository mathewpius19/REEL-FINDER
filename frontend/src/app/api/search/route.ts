import { NextRequest, NextResponse } from "next/server";

import { getBackendBaseUrl } from "@/lib/config";
import { Movie, SearchResult } from "@/lib/types";

function normalizeMovies(payload: unknown): Movie[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map((movie) => {
    const entry = movie as Partial<Movie>;

    return {
      movieId: Number(entry.movieId ?? 0),
      title: String(entry.title ?? "Untitled"),
      genres: String(entry.genres ?? ""),
      posterUrl: entry.posterUrl ? String(entry.posterUrl) : null
    };
  });
}

function normalizeSearchResult(payload: unknown): SearchResult {
  if (Array.isArray(payload)) {
    return {
      type: "movie_recommendation",
      response: "Here are the movies I found for you.",
      movies: normalizeMovies(payload)
    };
  }

  const entry = payload as Partial<SearchResult> | null;
  const type = entry?.type === "movie_recommendation" ? "movie_recommendation" : "assistant";

  return {
    type,
    response: typeof entry?.response === "string" ? entry.response : "",
    movies: normalizeMovies(entry?.movies)
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const response = await fetch(`${getBackendBaseUrl()}/movies/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: body.query ?? ""
      }),
      cache: "no-store"
    });

    const text = await response.text();
    const payload = text ? JSON.parse(text) : [];

    if (!response.ok) {
      return NextResponse.json(
        { message: "Search request failed.", details: payload },
        { status: response.status }
      );
    }

    return NextResponse.json(normalizeSearchResult(payload));
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to connect to the backend search endpoint.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
