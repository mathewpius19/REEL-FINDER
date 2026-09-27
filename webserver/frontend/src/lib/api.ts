import {
  AuthPayload,
  Interaction,
  InteractionInput,
  Movie,
  SearchResult,
  SignupPayload,
  User
} from "@/lib/types";

async function readResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return [];
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("The server returned an invalid JSON response.");
  }
}

export async function searchMovies(query: string) {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });

  const data = (await readResponse(response)) as SearchResult;

  if (!response.ok) {
    throw new Error("Something went wrong while searching. Please try again.");
  }

  if (!data || !Array.isArray(data.movies) || typeof data.response !== "string") {
    throw new Error("The search service returned an unexpected response.");
  }

  return data;
}

export async function getRecommendations(userId: number) {
  const response = await fetch(`/api/recommendations?userId=${userId}`, {
    cache: "no-store"
  });
  const data = (await readResponse(response)) as Movie[];

  if (!response.ok) {
    throw new Error("Unable to load recommendations right now.");
  }

  return data;
}

export async function getMovies() {
  const response = await fetch("/api/movies", {
    cache: "no-store"
  });
  const data = (await readResponse(response)) as Movie[];

  if (!response.ok) {
    throw new Error("Unable to load movies right now.");
  }

  return data;
}

export async function signupUser(payload: SignupPayload) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const data = (await readResponse(response)) as User | { message?: string } | null;

  if (!response.ok) {
    const message =
      data && "message" in data && typeof data.message === "string"
        ? data.message
        : "Unable to create account right now.";
    throw new Error(message);
  }

  return data as User;
}

export async function signinUser(payload: AuthPayload) {
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const data = (await readResponse(response)) as User;

  if (!response.ok) {
    throw new Error("Unable to sign in right now.");
  }

  return data;
}

export async function getInteractions(userId: number) {
  const response = await fetch(`/api/interactions?userId=${userId}`, {
    cache: "no-store"
  });
  const data = (await readResponse(response)) as Interaction[];

  if (!response.ok) {
    throw new Error("Unable to load interaction history right now.");
  }

  return data;
}

export async function saveInteraction(payload: InteractionInput) {
  const response = await fetch("/api/interactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const data = (await readResponse(response)) as Interaction;

  if (!response.ok) {
    throw new Error("Unable to save the interaction right now.");
  }

  return data;
}
