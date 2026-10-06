"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type PointerEvent } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HERO_SLIDES, photoUrl } from "@/lib/content";

const DURATION_MS = 7000;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Full-screen hero carousel. Slides wipe in from the right; the active
 * progress line *is* the timer — its CSS animation ending advances the slide,
 * so pausing (hover, focus, the pause button) is just pausing that animation.
 */
export function HeroCarousel() {
  const slides = HERO_SLIDES;
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const dragStart = useRef<number | null>(null);

  const go = (target: number) => {
    const next = (target + slides.length) % slides.length;
    if (next === index) return;
    setPrev(index);
    setIndex(next);
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
      className="relative h-svh min-h-[36rem] touch-pan-y select-none overflow-hidden bg-ink text-white"
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

      {/* Photos */}
      {slides.map((slide, i) => (
        <div
          key={slide.label}
          className="slide absolute inset-0"
          data-state={i === index ? "active" : i === prev ? "prev" : "idle"}
          aria-hidden={i !== index}
        >
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
        </div>
      ))}
      <div aria-hidden="true" className="absolute inset-0 z-[3] bg-gradient-to-t from-black/70 via-black/15 to-black/35" />
      <div aria-hidden="true" className="absolute inset-0 z-[3] bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* Captions */}
      <div className="px-page absolute inset-x-0 bottom-36 z-[4] grid sm:bottom-40">
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

      {/* Controls */}
      <div className="px-page absolute right-0 top-1/2 z-[4] hidden -translate-y-1/2 flex-col items-end gap-3 sm:flex">
        <div className="flex">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Prethodni slajd"
            className="grid h-11 w-11 place-items-center border border-white/35 transition-colors hover:bg-white hover:text-ink"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Sljedeći slajd"
            className="grid h-11 w-11 place-items-center border border-l-0 border-white/35 transition-colors hover:bg-white hover:text-ink"
          >
            →
          </button>
        </div>
        <button type="button" onClick={() => setUserPaused((v) => !v)} className="label link pb-1 text-white/70">
          {userPaused ? "Pokreni" : "Pauziraj"}
        </button>
      </div>

      {/* Slide index: tabs with progress lines */}
      <div className="px-page absolute inset-x-0 bottom-0 z-[4] pb-8">
        <div className="mb-4 flex items-center justify-between sm:hidden">
          <span className="label tabular-nums">
            {pad(index + 1)} <span className="text-white/50">/ {pad(slides.length)}</span>
          </span>
          <button type="button" onClick={() => setUserPaused((v) => !v)} className="label text-white/70">
            {userPaused ? "Pokreni" : "Pauziraj"}
          </button>
        </div>
        <ol className="grid grid-cols-4 gap-3 sm:gap-6">
          {slides.map((slide, i) => (
            <li key={slide.label}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Slajd ${i + 1}: ${slide.label}`}
                aria-current={i === index}
                className="group block w-full text-left"
              >
                <span className={`label hidden pb-3 transition-colors sm:block ${i === index ? "text-white" : "text-white/50 group-hover:text-white/80"}`}>
                  {pad(i + 1)} {slide.label}
                </span>
                <span className="relative block h-px bg-white/25">
                  {i < index && <span className="absolute inset-0 bg-white/70" />}
                  {i === index && (
                    <span
                      key={index}
                      className="slide-progress absolute inset-0 bg-yellow"
                      style={{ "--duration": `${DURATION_MS}ms` } as CSSProperties}
                      data-running={running}
                      data-paused={paused}
                      onAnimationEnd={() => go(index + 1)}
                    />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
