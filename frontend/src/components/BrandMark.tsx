type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`.trim()} aria-label="ReelFinder">
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-blue-300/40 bg-blue-500/15 shadow-[0_0_24px_rgba(47,107,255,0.35)]">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,51,64,0.9)]" />
      </span>
      <span className="reel-brand text-sm text-white sm:text-base">
        Reel<span className="text-blue-400">Finder</span>
      </span>
    </span>
  );
}
