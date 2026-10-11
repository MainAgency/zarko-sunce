"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type PointerEvent } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HERO_SLIDES, photoUrl } from "@/lib/content";

const DURATION_MS = 5000;

const pad = (n: number) => String(n).padStart(2, "0");

/** How the incoming slide enters: grown out of the preview tile, or wiped in. */
type Dir = "tile" | "left" | "right";

/**
 * Full-screen hero carousel. The next slide waits in a tile in the corner,
 * framed by a line that draws itself around it. That line *is* the timer —
 * its CSS animation ending advances the slide, and the tile grows to fill the
 * screen — so pausing (hover, focus, the pause button) is just pausing it.
 */
export function HeroCarousel() {
  const slides = HERO_SLIDES;
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<Dir | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const dragStart = useRef<number | null>(null);

  const next = (index + 1) % slides.length;

  const go = (target: number) => {
    const to = (target + slides.length) % slides.length;
    if (to === index) return;
    setDir(to === next ? "tile" : target < index ? "left" : "right");
    setPrev(index);
    setIndex(to);
  };

  // The timer never runs under reduced motion; otherwise hover/focus/the
  // pause button only pause it, so it resumes where it stopped.
  const running = !reducedMotion;
  const paused = hovering || userPaused;

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

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label="Istaknuto"
      className="hero relative h-svh min-h-[36rem] touch-pan-y select-none overflow-hidden bg-black text-white"
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

      {/* Photos. The next slide sits above the active one, framed in the tile. */}
      {slides.map((slide, i) => (
        <div
          key={slide.label}
          className="slide absolute inset-0"
          data-state={i === index ? "active" : i === prev ? "prev" : i === next ? "next" : "idle"}
          data-dir={i === index ? (dir ?? undefined) : undefined}
          aria-hidden={i !== index}
          onAnimationEnd={(e) => {
            if (i === index && e.animationName.startsWith("slide-from")) setPrev(null);
          }}
        >
          <div className="slide-frame">
            <div className="slide-photo absolute inset-0">
              <Image
                src={photoUrl(slide.photo, 2200)}
                alt={slide.photo.alt}
                fill
                preload={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="slide-shade absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/35" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_100%,rgb(0_0_0/0.45),transparent_55%)]" />
            </div>
          </div>
        </div>
      ))}

      {/* Captions */}
      <div className="px-page absolute inset-x-0 bottom-36 z-[4] sm:bottom-40">
        <div className="grid sm:mr-[calc(var(--tile-w)+3rem)]">
          {slides.map((slide, i) => (
            <div
              key={slide.label}
              className="caption [grid-area:1/1]"
              data-active={i === index}
              aria-hidden={i !== index}
              role="group"
              aria-roledescription="slajd"
              aria-label={`${i + 1} od ${slides.length}`}
            >
              <p className="caption-line label text-white/80">
                <span style={{ "--i": 0 } as CSSProperties}>
                  {pad(i + 1)} — {slide.label}
                </span>
              </p>
              <h2 className="heading mt-5 text-[clamp(2.25rem,4.4vw,4rem)]">
                <span className="caption-line">
                  <span style={{ "--i": 1 } as CSSProperties}>{slide.title}</span>
                </span>
                <span className="caption-line pb-1">
                  <span style={{ "--i": 2 } as CSSProperties}>
                    <em>{slide.accent}</em>
                  </span>
                </span>
              </h2>
              <p className="caption-line mt-6 max-w-sm text-white/75">
                <span style={{ "--i": 3 } as CSSProperties}>{slide.text}</span>
              </p>
              <p className="caption-line mt-8">
                <span style={{ "--i": 4 } as CSSProperties}>
                  <a href={slide.cta.href} tabIndex={i === index ? 0 : -1} className="label link pb-1">
                    {slide.cta.label} →
                  </a>
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Next-slide tile: the line drawing around it is the timer. */}
      <div aria-hidden="true" className="hero-tile-label pointer-events-none z-[4] hidden sm:block">
        <div key={next} className="swap" style={{ "--i": 10 } as CSSProperties}>
          <p className="label text-white/60">
            {pad(next + 1)} — Sljedeće
          </p>
          <p className="heading mt-2 text-xl">
            <em>{slides[next].label}</em>
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => go(next)}
        aria-label={`Sljedeći slajd: ${slides[next].label}`}
        className="hero-tile group z-[4]"
      >
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible fill-none">
          <rect
            width="100%"
            height="100%"
            strokeWidth={1}
            className="stroke-white/35 transition-colors duration-300 group-hover:stroke-white/80"
          />
          <rect
            key={index}
            width="100%"
            height="100%"
            pathLength={1}
            strokeWidth={2}
            className="tile-progress stroke-yellow"
            style={{ "--duration": `${DURATION_MS}ms` } as CSSProperties}
            data-running={running}
            data-paused={paused}
            onAnimationEnd={() => go(next)}
          />
        </svg>
      </button>

      {/* Slide index and controls */}
      <div className="px-page absolute bottom-[var(--tile-b)] left-0 z-[4] flex items-center gap-5 sm:gap-8">
        <span className="label tabular-nums sm:hidden">
          {pad(index + 1)} <span className="text-white/50">/ {pad(slides.length)}</span>
        </span>
        <ol className="-mx-2 hidden sm:flex">
          {slides.map((slide, i) => (
            <li key={slide.label}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Slajd ${i + 1}: ${slide.label}`}
                aria-current={i === index}
                className={`label relative h-11 px-2 tabular-nums transition-colors ${i === index ? "text-white" : "text-white/45 hover:text-white/80"}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 top-1 h-1.5 w-1.5 -translate-x-1/2 bg-yellow transition-transform duration-500 ${i === index ? "scale-100" : "scale-0"}`}
                />
                {pad(i + 1)}
              </button>
            </li>
          ))}
        </ol>
        <div className="hidden sm:flex">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Prethodni slajd"
            className="grid h-11 w-11 place-items-center border border-white/35 transition-colors hover:bg-white hover:text-black"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Sljedeći slajd"
            className="grid h-11 w-11 place-items-center border border-l-0 border-white/35 transition-colors hover:bg-white hover:text-black"
          >
            →
          </button>
        </div>
        <button type="button" onClick={() => setUserPaused((v) => !v)} className="label link pb-1 text-white/70">
          {userPaused ? "Pokreni" : "Pauziraj"}
        </button>
      </div>
    </section>
  );
}
