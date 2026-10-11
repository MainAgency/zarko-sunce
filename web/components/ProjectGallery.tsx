"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import type { Photo } from "@/lib/content";

import { Frame } from "./Frame";
import { Lightbox } from "./Lightbox";

/*
 * Project gallery after margraf.it's product grid: same-size portrait tiles in
 * three columns (two on phones), and while you scroll each column drifts up
 * at its own pace — the middle one stays put, the left one rises slowly, the
 * right one twice as fast — so the rows shear apart and settle as you go.
 * The drift eases toward the scroll position for a smooth glide. Clicking a
 * photo opens it full screen, with every photo of the project to browse.
 */

/** Drift per pixel scrolled, by column: [left, middle, right] on desktop. */
const SPEED_DESKTOP = [0.08, 0, 0.16];
/** Phones: two columns, the second one drifts. */
const SPEED_PHONE = [0, 0.08];
const GLIDE = 0.12;

export function ProjectGallery({ photos }: { photos: Photo[] }) {
  const grid = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const el = grid.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let d: number | null = null;

    const render = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Pixels scrolled since the grid's top entered the screen, until it has left.
      const goal = Math.min(Math.max(vh - rect.top, 0), rect.height + vh);
      d = d === null ? goal : d + (goal - d) * GLIDE;
      if (Math.abs(goal - d) < 0.5) d = goal;
      el.style.setProperty("--gd", d.toFixed(1));
      if (d !== goal) frame = requestAnimationFrame(render);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <>
      <div
        ref={grid}
        className="zs-gallery grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:gap-6"
        style={{ "--gd": 0 } as CSSProperties}
      >
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            className="zs-gallery__item group"
            style={
              {
                "--sd": SPEED_DESKTOP[i % 3],
                "--sp": SPEED_PHONE[i % 2],
              } as CSSProperties
            }
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Otvori fotografiju ${i + 1} od ${photos.length}`}
              className="block w-full cursor-zoom-in outline-offset-4 focus-visible:outline-2 focus-visible:outline-yellow"
            >
              <Frame
                photo={photo}
                width={1100}
                delay={(i % 3) * 90}
                className="aspect-[3/4]"
                imgClassName="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
            </button>
          </div>
        ))}
      </div>
      {open !== null && <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}
