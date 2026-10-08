"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import { photoUrl, type Photo } from "@/lib/content";

type BeforeAfterProps = {
  before: Photo;
  after: Photo;
  /** Pixel width requested from the image host. */
  width?: number;
  /** Size the frame here, e.g. an aspect ratio. */
  className?: string;
};

/**
 * Before/after comparison: the "after" photo fills the frame and the "before"
 * photo covers it up to a divider that can be dragged (or moved with the
 * arrow keys) — drag right to see more of how it was, left for how it is.
 */
export function BeforeAfter({ before, after, width = 1400, className = "aspect-square" }: BeforeAfterProps) {
  const [pos, setPos] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const moveTo = (clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    // A mouse click jumps straight there; a finger only moves the divider once
    // it drags sideways, so a vertical swipe over the photo still scrolls.
    if (e.pointerType === "mouse") moveTo(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(e.clientX);
  };
  const stop = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    const next =
      e.key === "ArrowLeft" ? pos - step
      : e.key === "ArrowRight" ? pos + step
      : e.key === "Home" ? 0
      : e.key === "End" ? 100
      : null;
    if (next === null) return;
    e.preventDefault();
    setPos(Math.min(100, Math.max(0, next)));
  };

  const sizes = `${width}px`;

  return (
    <div
      ref={frame}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
      className={`relative cursor-ew-resize touch-pan-y select-none overflow-hidden bg-ink/5 ${className}`}
    >
      <Image src={photoUrl(after, width)} alt={after.alt} fill sizes={sizes} draggable={false} className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={photoUrl(before, width)} alt={before.alt} fill sizes={sizes} draggable={false} className="object-cover" />
      </div>

      <span aria-hidden="true" className="label absolute left-3 top-3 bg-ink/70 px-2.5 py-1.5 text-white sm:left-4 sm:top-4">
        Prije
      </span>
      <span aria-hidden="true" className="label absolute right-3 top-3 bg-ink/70 px-2.5 py-1.5 text-white sm:right-4 sm:top-4">
        Poslije
      </span>

      {/* Divider and handle */}
      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white" style={{ left: `${pos}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Usporedba prije i poslije"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)} % fotografije prije radova`}
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-yellow text-ink shadow-[0_4px_20px_rgb(0_0_0/0.25)] outline-offset-4 focus-visible:outline-2 focus-visible:outline-white"
        >
          <ChevronLeft aria-hidden="true" strokeWidth={1.75} className="-mr-1 size-4" />
          <ChevronRight aria-hidden="true" strokeWidth={1.75} className="-ml-1 size-4" />
        </div>
      </div>
    </div>
  );
}
