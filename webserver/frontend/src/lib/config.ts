const fallbackBackendUrl = "http://localhost:8080/recommender";

export function getBackendBaseUrl() {
  return process.env.BACKEND_BASE_URL ?? fallbackBackendUrl;
}

export function getDefaultUserId() {
  const userId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID ?? "1";
  return Number.parseInt(userId, 10) || 1;
}
