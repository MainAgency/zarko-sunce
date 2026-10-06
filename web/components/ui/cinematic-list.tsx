import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/*
 * Adapted from the 21st.dev "cinematic list" for this site:
 *  - items come in as props and each row is a link;
 *  - colours use the site tokens (no dark: variants — the site is light-only,
 *    and those would turn the titles white on an OS in dark mode);
 *  - square icon box (the brief allows no rounded corners), calmer type;
 *  - hover/expand only for mouse pointers (`pointer-fine:`). On touch
 *    screens there is no hover, so rows show their photo all the time.
 */

export interface CinematicItem {
  id: string;
  title: string;
  /** Short line shown on the right on hover — under the title on touch / narrow screens. */
  meta: string;
  href: string;
  src: string;
  alt: string;
}

function CinematicListItem({ id, title, meta, href, src, alt }: CinematicItem) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex w-full flex-col justify-center overflow-hidden border-b border-line outline-none",
        // Height transition: fast start, slow end (quart ease)
        "transition-[height] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
        // Touch: tall row with the photo on / mouse: compact, grows on hover or keyboard focus
        "h-44 sm:h-56 pointer-fine:h-24 pointer-fine:hover:h-[400px] pointer-fine:focus-visible:h-[400px]",
      )}
    >
      {/* --- Background image layer --- */}
      <div
        className={cn(
          "absolute inset-0 z-0 h-full w-full transition-opacity duration-700 ease-out",
          "pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-visible:opacity-100",
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="scale-110 object-cover transition-transform duration-1000 ease-out group-hover:scale-100 group-focus-visible:scale-100"
        />
        {/* Stronger at the bottom for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      </div>

      {/* --- Content layer --- */}
      <div className="relative z-10 flex w-full items-center justify-between gap-6 px-4 sm:px-8 md:px-12">
        {/* Left: number & title */}
        <div className="flex items-center gap-6 md:gap-12">
          <span className="label tabular-nums text-white/70 transition-colors duration-500 pointer-fine:text-muted pointer-fine:group-hover:text-white/70 pointer-fine:group-focus-visible:text-white/70">
            {id}
          </span>

          <div className="flex flex-col">
            <h3
              className={cn(
                "heading text-2xl text-white md:text-4xl",
                "transition-[color,transform] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
                "pointer-fine:text-ink pointer-fine:group-hover:-translate-y-2 pointer-fine:group-hover:text-white",
                "pointer-fine:group-focus-visible:-translate-y-2 pointer-fine:group-focus-visible:text-white",
              )}
            >
              {title}
            </h3>
            {/* Under the title wherever the right-hand slot isn't used */}
            <span className="label mt-2 block text-white/70 pointer-fine:text-muted pointer-fine:md:hidden">{meta}</span>
          </div>
        </div>

        {/* Right: meta & action */}
        <div className="flex shrink-0 items-center gap-4 md:gap-8">
          {/* Slides up into view on hover (mouse, wide screens) */}
          <span className="label hidden translate-y-8 text-white opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 pointer-fine:md:block">
            {meta}
          </span>

          {/* Square icon box */}
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center border transition-all duration-500",
              "border-white text-white", // touch: always on the photo
              "pointer-fine:border-line pointer-fine:text-muted",
              "pointer-fine:group-hover:scale-110 pointer-fine:group-hover:border-white pointer-fine:group-hover:bg-white pointer-fine:group-hover:text-ink",
              "pointer-fine:group-focus-visible:border-white pointer-fine:group-focus-visible:bg-white pointer-fine:group-focus-visible:text-ink",
            )}
          >
            <MoveRight aria-hidden="true" className="h-5 w-5 transition-transform duration-500 group-hover:-rotate-45" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function CinematicList({ items }: { items: CinematicItem[] }) {
  return (
    <div className="flex flex-col border-t border-ink">
      {items.map((item) => (
        <CinematicListItem key={item.id} {...item} />
      ))}
    </div>
  );
}

export { CinematicList };
