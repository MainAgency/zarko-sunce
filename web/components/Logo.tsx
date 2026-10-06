type LogoProps = {
  className?: string;
  /** White wordmark for dark backgrounds. */
  light?: boolean;
};

/**
 * Typeset recreation of the Žarko Sunce logo. It scales with `font-size`, so
 * size it through the className (e.g. `text-[28px]`).
 */
export function Logo({ className = "", light = false }: LogoProps) {
  return (
    <span
      className={`inline-flex flex-col font-display leading-none ${light ? "text-white" : "text-ink"} ${className}`}
    >
      <span className="text-[1em] font-black leading-[0.78] tracking-[-0.055em]">Žarko</span>
      <span className="mt-[0.1em] flex items-center gap-[0.14em]">
        <span className="text-[0.27em] font-extrabold tracking-[-0.03em]">sunce d.o.o</span>
        <span className="h-[0.13em] flex-1 bg-yellow" />
      </span>
    </span>
  );
}
