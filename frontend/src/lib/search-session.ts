import { StoredSearchResult } from "@/lib/types";

const SEARCH_RESULT_KEY = "recommender-search-result";

export function saveSearchResult(result: StoredSearchResult) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(SEARCH_RESULT_KEY, JSON.stringify(result));
}

export function getSearchResult() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedResult = window.sessionStorage.getItem(SEARCH_RESULT_KEY);

  if (!storedResult) {
    return null;
  }

  try {
    return JSON.parse(storedResult) as StoredSearchResult;
  } catch {
    return null;
  }
}
