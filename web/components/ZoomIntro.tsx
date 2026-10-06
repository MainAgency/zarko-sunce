"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { photoUrl, type Photo } from "@/lib/content";

import { ZoomParallax } from "./ui/zoom-parallax";

/**
 * Width requested for each of ZoomParallax's seven slots. Slot 0 sits in the
 * middle and ends up filling the screen; the rest fly off-screen.
 */
const SLOT_WIDTHS = [2400, 1200, 900, 900, 900, 900, 600];

/**
 * Scroll-driven zoom "entrance" into a section: a collage of up to seven
 * photos that the camera pushes into until the first one fills the screen.
 * Left out entirely for reduced-motion visitors.
 */
export function ZoomIntro({ photos }: { photos: Photo[] }) {
  if (usePrefersReducedMotion()) return null;
  const images = photos.slice(0, SLOT_WIDTHS.length).map((photo, i) => ({
    src: photoUrl(photo, SLOT_WIDTHS[i]),
    alt: photo.alt,
  }));
  return <ZoomParallax images={images} />;
}
