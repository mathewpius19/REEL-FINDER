import { NextResponse } from "next/server";

import { getBackendBaseUrl } from "@/lib/config";
import { Movie } from "@/lib/types";

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

export async function GET() {
  try {
    const response = await fetch(`${getBackendBaseUrl()}/movies`, {
      cache: "no-store"
    });

    const text = await response.text();
    const payload = text ? JSON.parse(text) : [];

    if (!response.ok) {
      return NextResponse.json(
        { message: "Movies request failed.", details: payload },
        { status: response.status }
      );
    }

    return NextResponse.json(normalizeMovies(payload));
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to connect to the movies endpoint.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
