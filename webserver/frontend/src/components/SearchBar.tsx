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
      className="w-full rounded-2xl border border-blue-300/25 bg-[#091731]/90 p-3 shadow-[0_26px_90px_rgba(0,20,70,0.42),0_0_0_1px_rgba(47,107,255,0.06)] backdrop-blur-xl transition focus-within:border-blue-400/60 focus-within:shadow-[0_26px_90px_rgba(0,20,70,0.5),0_0_32px_rgba(47,107,255,0.12)]"
    >
      <textarea
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        aria-label="Ask the movie assistant"
        className="min-h-24 w-full resize-none bg-transparent px-3 py-2 text-base leading-7 text-white outline-none placeholder:text-[#647493]"
      />
      <div className="flex items-center justify-between gap-3 px-1">
        <span className="text-xs text-[#647493]">Enter to send · Shift + Enter for a new line</span>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-[0_10px_26px_rgba(47,107,255,0.3)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-[#1a2946] disabled:text-[#647493] disabled:shadow-none"
        >
          {isLoading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </form>
  );
}
