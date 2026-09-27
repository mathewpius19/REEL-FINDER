"use client";

import { FormEvent, KeyboardEvent, useState } from "react";

type SearchBarProps = {
  isLoading: boolean;
  initialValue?: string;
  placeholder?: string;
  onSearch: (query: string) => Promise<void> | void;
};

export function SearchBar({
  isLoading,
  initialValue = "",
  placeholder = "What would you like to watch, or ask me anything...",
  onSearch
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery || isLoading) {
      return;
    }

    void onSearch(trimmedQuery);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-[1.75rem] border border-white/12 bg-white/8 p-3 shadow-[0_24px_90px_rgba(2,8,23,0.35)] backdrop-blur"
    >
      <textarea
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        aria-label="Ask the movie assistant"
        className="min-h-24 w-full resize-none bg-transparent px-3 py-2 text-base leading-7 text-slate-100 outline-none placeholder:text-slate-500"
      />
      <div className="flex items-center justify-between gap-3 px-1">
        <span className="text-xs text-slate-500">Enter to send · Shift + Enter for a new line</span>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-cyan-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {isLoading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </form>
  );
}
