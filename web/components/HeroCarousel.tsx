"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type CSSProperties, type PointerEvent } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { photoUrl } from "@/lib/content";

import { HERO_SLIDES } from "./heroSlides";

const DURATION_MS = 6000;

/**
 * Full-screen hero carousel: a tour of the whole site, one slide per section
 * (see heroSlides.ts). A large two-line title, a line of copy and the
 * section's link sit bottom left. Below, a small square per slide — unlabelled,
 * so the next section is a surprise — with the current one stretched into a
 * short bar that fills over the slide's time: that fill *is* the timer. Each
 * slide enters its own way (wipe, circle, blinds, diagonal); going back always
 * wipes from the left. Hover and focus pause it; arrows, keys, swipes and the
 * squares change slides.
 */
export function HeroCarousel() {
  const slides = HERO_SLIDES;
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [back, setBack] = useState(false);
  const [hovering, setHovering] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const dragStart = useRef<number | null>(null);

  const go = (target: number) => {
    const to = (target + slides.length) % slides.length;
    if (to === index) return;
    // Forward (including wrapping round to the first) uses the slide's own entrance.
    setBack(!(target > index || to === 0));
    setPrev(index);
    setIndex(to);
  };

  // The timer never runs under reduced motion; hover and focus only pause it,
  // so it resumes where it stopped.
  const running = !reducedMotion;
  const paused = hovering;

  const onPointerDown = (e: PointerEvent) => {
    if ((e.target as Element).closest("a, button")) return;
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
  };

  const control =
    "grid size-11 place-content-center border border-white/30 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black";

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label="Istaknuto"
      className="hero relative h-svh min-h-[38rem] touch-pan-y select-none overflow-clip bg-black text-white"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <h1 className="sr-only">Žarko Sunce — adaptacije stanova i završni radovi</h1>

      {/* Photos: the active one settles from a slight zoom; a new one wipes in over it. */}
      {slides.map((slide, i) => (
        <div
          key={slide.label}
          className="slide absolute inset-0"
          data-state={i === index ? "active" : i === prev ? "prev" : "idle"}
          data-enter={i === index && prev !== null ? (back ? "back" : slide.enter) : undefined}
          aria-hidden={i !== index}
          onAnimationEnd={(e) => {
            if (i === index && e.animationName.startsWith("hero-enter")) setPrev(null);
          }}
        >
          <div className="slide-photo absolute inset-0">
            <Image
              src={photoUrl(slide.photo, 2200)}
              alt={slide.photo.alt}
              fill
              preload={i === 0}
              // The current slide and the one after it load eagerly, so a photo is
              // ready by its turn (lazy images in hidden slides never start on their own).
              loading={i !== 0 && (i === index || i === (index + 1) % slides.length) ? "eager" : undefined}
              sizes="100vw"
              className="object-cover"
            />
            {/* Before/after slide: the "before" photo over the left part, its edge sweeping to and fro. */}
            {slide.compare && (
              <div aria-hidden="true" className="hero-compare absolute inset-0">
                <div className="hero-compare__before absolute inset-0">
                  <Image
                    src={photoUrl(slide.compare.before, 2200)}
                    alt=""
                    fill
                    loading={i === index || i === (index + 1) % slides.length ? "eager" : undefined}
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                <span className="hero-compare__line absolute inset-y-0 w-0.5 bg-white" />
              </div>
            )}
          </div>
          {/* Shade: darkest bottom left, where the copy sits; light at the top for the header. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />
        </div>
      ))}

      {/* Copy for the active slide. */}
      <div className="px-page absolute inset-x-0 bottom-32 z-[4] sm:bottom-36 lg:bottom-40">
        <div className="grid max-w-4xl">
          {slides.map((slide, i) => (
            <div
              key={slide.label}
              className="caption [grid-area:1/1]"
              data-active={i === index}
              aria-hidden={i !== index}
              role="group"
              aria-roledescription="slajd"
              aria-label={`${i + 1} od ${slides.length}: ${slide.label}`}
            >
              <h2
                className={`heading ${
                  // Long lines (a news headline) step down a size so they stay within a few lines.
                  slide.title.length + slide.accent.length > 34
                    ? "text-[clamp(2.25rem,4.2vw,4.25rem)]"
                    : "text-[clamp(2.75rem,6vw,5.75rem)]"
                }`}
              >
                <span className="caption-line">
                  <span style={{ "--i": 0 } as CSSProperties}>{slide.title}</span>
                </span>
                <span className="caption-line pb-[0.08em]">
                  <span style={{ "--i": 1 } as CSSProperties}>{slide.accent}</span>
                </span>
              </h2>
              <p className="caption-line mt-6 max-w-md text-white/80 sm:text-lg">
                <span style={{ "--i": 2 } as CSSProperties}>{slide.text}</span>
              </p>
              <div className="caption-line mt-9">
                <span style={{ "--i": 3 } as CSSProperties}>
                  <a
                    href={slide.cta.href}
                    tabIndex={i === index ? 0 : -1}
                    className="btn-fill btn-fill--white group/cta label inline-flex h-12 items-center gap-3 border border-white/50 px-6"
                  >
                    {slide.cta.label}
                    <ArrowRight
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1"
                    />
                  </a>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress: a small square per slide; the current one stretches into a short
          bar that fills as the timer. Arrows on the right. */}
      <div className="px-page absolute inset-x-0 bottom-6 z-[4] flex items-center justify-between gap-6 sm:bottom-8 lg:bottom-10">
        <ol className="flex items-center gap-1">
          {slides.map((slide, i) => {
            const state = i < index ? "done" : i === index ? "active" : "upcoming";
            return (
              <li key={slide.label}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Slajd ${i + 1}: ${slide.label}`}
                  aria-current={i === index}
                  className="group grid h-11 place-items-center px-1.5"
                >
                  <span
                    className={`relative block h-1.5 overflow-hidden transition-[width,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      i === index ? "w-14 bg-white/25 sm:w-16" : "w-1.5 bg-white/40 group-hover:bg-white/80"
                    }`}
                  >
                    <span
                      key={state === "active" ? `run-${index}` : state}
                      className="hero-bar absolute inset-0 origin-left bg-white"
                      data-state={state === "done" ? "upcoming" : state}
                      data-running={running}
                      data-paused={paused}
                      style={{ "--duration": `${DURATION_MS}ms` } as CSSProperties}
                      onAnimationEnd={() => state === "active" && go(index + 1)}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Prethodni slajd"
            className={`${control} hidden sm:grid`}
          >
            <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Sljedeći slajd"
            className={`${control} hidden sm:grid`}
          >
            <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
