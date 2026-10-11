import Image from "next/image";
import type { CSSProperties } from "react";

import { photoUrl, type Photo } from "@/lib/content";

type FrameProps = {
  photo: Photo;
  /** Pixel width requested from the image host. */
  width: number;
  className?: string;
  /** Reveal with the upward "blind" when it scrolls into view. */
  reveal?: boolean;
  /** Reveal delay in ms. */
  delay?: number;
  preload?: boolean;
  /** Extra classes on the <img>, e.g. a hover zoom. */
  imgClassName?: string;
  /** Extra inline style on the frame, e.g. an aspect ratio picked at run time. */
  style?: CSSProperties;
};

/** A cropped photo in a square-cornered frame. Size it with `className` (aspect or height). */
export function Frame({
  photo,
  width,
  className = "",
  reveal = true,
  delay = 0,
  preload = false,
  imgClassName = "",
  style,
}: FrameProps) {
  return (
    <div
      data-reveal={reveal ? "image" : undefined}
      style={delay ? ({ ...style, "--rd": `${delay}ms` } as CSSProperties) : style}
      className={`relative overflow-hidden ${className}`}
    >
      <div className="reveal-mask absolute inset-0 overflow-hidden bg-ink/5">
        <div className="reveal-inner absolute inset-0">
          <Image
            src={photoUrl(photo, width)}
            alt={photo.alt}
            fill
            preload={preload}
            sizes={`${width}px`}
            className={`object-cover ${imgClassName}`}
          />
        </div>
      </div>
    </div>
  );
}
