"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { createPortal } from "react-dom";

import { photoUrl, type Photo } from "@/lib/content";

type LightboxProps = {
  photos: Photo[];
  /** Index of the photo on screen. */
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Full-screen photo viewer: the photo fitted to the screen, arrows and a
 * counter, and a strip of every photo along the bottom. Arrow keys, Escape and
 * a sideways swipe work too. Rendered into <body> so no transformed ancestor
 * can trap it; the page underneath stops scrolling while it is open.
 */
export function Lightbox({ photos, index, onIndex, onClose }: LightboxProps) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const swipeX = useRef<number | null>(null);

  const count = photos.length;
  const go = (i: number) => onIndex((i + count) % count);
  const photo = photos[index];

  // Lock page scroll and take focus on open; give both back on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      root.style.overflow = previous;
      opener?.focus();
    };
  }, []);

  // Keep the current thumbnail in view.
  useEffect(() => {
    strip.current?.querySelector<HTMLElement>(`[data-i="${index}"]`)?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    });
  }, [index]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "ArrowLeft") go(index - 1);
    else if (e.key === "Tab") {
      // Keep keyboard focus inside the viewer.
      const items = dialog.current?.querySelectorAll<HTMLElement>("button");
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    swipeX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeX.current === null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
  };

  const control =
    "grid size-11 place-content-center border border-white/25 text-white transition-colors duration-300 hover:border-yellow hover:bg-yellow hover:text-black";

  return createPortal(
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label="Galerija fotografija"
      onKeyDown={onKeyDown}
      className="zs-lightbox fixed inset-0 z-[70] flex flex-col bg-black/95 text-white backdrop-blur-sm"
    >
      {/* Top bar: counter and close. */}
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <p className="label tabular-nums text-white/70" aria-live="polite">
          {pad(index + 1)} / {pad(count)}
        </p>
        <button ref={closeButton} type="button" onClick={onClose} aria-label="Zatvori galeriju" className={control}>
          <X aria-hidden="true" strokeWidth={1.5} className="size-5" />
        </button>
      </div>

      {/* The photo, fitted to the space; swipe sideways on touch. Clicking the dark margin closes. */}
      <div
        className="relative min-h-0 flex-1 touch-pan-y select-none px-4 sm:px-20"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipeX.current = null)}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div key={photo.src} className="zs-lightbox__photo relative h-full w-full">
          <Image
            src={photoUrl(photo, 2000)}
            alt={photo.alt}
            fill
            sizes="100vw"
            draggable={false}
            className="object-contain"
            preload
          />
        </div>
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Prethodna fotografija"
              className={`${control} absolute left-4 top-1/2 hidden -translate-y-1/2 sm:grid`}
            >
              <ChevronLeft aria-hidden="true" strokeWidth={1.5} className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Sljedeća fotografija"
              className={`${control} absolute right-4 top-1/2 hidden -translate-y-1/2 sm:grid`}
            >
              <ChevronRight aria-hidden="true" strokeWidth={1.5} className="size-5" />
            </button>
          </>
        )}
      </div>

      {/* Every photo as a thumbnail; the current one is outlined in yellow. */}
      {count > 1 && (
        <div ref={strip} className="overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:px-6">
          {/* Centred while it fits, scrollable from the first photo once it does not. */}
          <div className="mx-auto flex w-max gap-2">
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                data-i={i}
                onClick={() => go(i)}
                aria-label={`Fotografija ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`relative h-14 w-11 shrink-0 overflow-hidden outline-offset-2 transition-opacity duration-300 sm:h-16 sm:w-12 ${
                  i === index ? "opacity-100 outline-2 outline-yellow" : "opacity-45 hover:opacity-100"
                }`}
              >
                <Image src={photoUrl(p, 160)} alt="" fill sizes="48px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
