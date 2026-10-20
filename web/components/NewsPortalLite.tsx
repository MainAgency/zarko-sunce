"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";

import type { Article } from "@/lib/content";

import { NewsMagazine } from "./NewsMagazine";
import { interior } from "./ui/glyph-portal";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (a: number, b: number, n: number) => {
  const t = clamp01((n - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const WORD = "NOVOSTI";
/** Same tracking as the site's headings (.heading in globals.css), in em. */
const TRACKING = -0.045;
/** Screens of scroll the flight through the letter takes. */
const LENGTH = 1.7;
/** The word is drawn this many times larger than shown, so it stays crisp into the zoom. */
const OVERSAMPLE = 4;
/** Share of the screen width the word takes at the start, and its cap. */
const WORD_WIDTH = 0.8;
const WORD_MAX = 420;

/**
 * The news entrance for touch screens: the same flight through a letter as
 * the desktop portal, but the word is one SVG text layer moved only with
 * transform and opacity, which phones composite without repainting.
 *
 * The letter with the fattest ink is the target (found with the portal's own
 * scan). As you scroll, the word zooms into that spot until the ink fills the
 * screen; a veil in the page colour then covers it and the news slide up into
 * place. Scroll position is measured against a 100svh probe, so the address
 * bar hiding and showing cannot jolt it.
 */
export function NewsPortalLite({ items }: { items: Article[] }) {
  const section = useRef<HTMLElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const glyph = useRef<SVGTextElement>(null);

  useEffect(() => {
    const el = section.current;
    const vhEl = probe.current;
    const stageEl = stage.current;
    const svgEl = svg.current;
    const textEl = glyph.current;
    if (!el || !vhEl || !stageEl || !svgEl || !textEl) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });

    let frame = 0;
    let ready = false;
    // Flight geometry, in CSS px of the stage.
    let endScale = 1; // relative to the start size
    let dx = 0;
    let dy = 0; // how far the target moves to reach the screen centre

    /** Measures the word in the font it renders with, places the SVG and picks the target letter. */
    const layout = () => {
      ready = false;
      if (reduce || !context) return;
      const font = getComputedStyle(textEl);
      // Tracking goes on both the SVG text and the canvas; where the canvas can't, neither gets it.
      const tracking = "letterSpacing" in context ? `${TRACKING * 100}px` : "0px";
      textEl.style.letterSpacing = tracking;
      context.font = `${font.fontWeight} 100px ${font.fontFamily}`;
      context.fontKerning = "none";
      context.letterSpacing = tracking;
      const metrics = context.measureText(WORD);
      const bounds = {
        x: -metrics.actualBoundingBoxLeft,
        y: -metrics.actualBoundingBoxAscent,
        width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
        height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
      };
      if (!bounds.width || !bounds.height) return;

      // Fattest ink across the letters, like the desktop portal.
      let target: { x: number; y: number; radius: number } | null = null;
      let offset = 0;
      for (const char of Array.from(WORD)) {
        context.font = `${font.fontWeight} 100px ${font.fontFamily}`;
        const advance = context.measureText(WORD.slice(0, offset)).width;
        const found = interior(context, char, `${font.fontWeight} 300px ${font.fontFamily}`);
        if (found && (!target || found.radius > target.radius)) target = { ...found, x: found.x + advance };
        offset += char.length;
      }
      if (!target) return;

      const W = stageEl.clientWidth;
      const H = vhEl.offsetHeight || window.innerHeight;
      const shown = Math.min(W * WORD_WIDTH, WORD_MAX); // word width on screen at the start
      const unit = shown / bounds.width; // px per font unit at the start
      const drawn = shown * OVERSAMPLE; // the SVG's own width
      const base = 1 / OVERSAMPLE; // scale that shows it at `shown`

      // The target point inside the SVG box, and where the word's centre should sit.
      const ox = (target.x - bounds.x) * unit * OVERSAMPLE;
      const oy = (target.y - bounds.y) * unit * OVERSAMPLE;
      const anchor = { x: W / 2, y: H * 0.46 };
      // Scaling about the target keeps it put, so the box is placed so the shrunken word is centred on the anchor.
      const targetScreen = {
        x: anchor.x - ((bounds.width * unit * OVERSAMPLE) / 2 - ox) * base,
        y: anchor.y - ((bounds.height * unit * OVERSAMPLE) / 2 - oy) * base,
      };
      dx = W / 2 - targetScreen.x;
      dy = H / 2 - targetScreen.y;
      endScale = Math.max(1, Math.hypot(W, H) / (target.radius * unit * 1.35));

      svgEl.setAttribute("viewBox", `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`);
      Object.assign(svgEl.style, {
        width: `${drawn}px`,
        height: `${(drawn * bounds.height) / bounds.width}px`,
        left: `${targetScreen.x - ox}px`,
        top: `${targetScreen.y - oy}px`,
        transformOrigin: `${ox}px ${oy}px`,
      });
      el.style.setProperty("--lite-base", String(base));
      ready = true;
    };

    const render = () => {
      frame = 0;
      const vh = vhEl.offsetHeight || window.innerHeight;
      // 0 as the stage pins, 1 after LENGTH screens of scroll.
      const p = reduce ? 1 : clamp01(-el.getBoundingClientRect().top / (vh * LENGTH));
      // The flight itself ends at 0.8; the rest is the veil and the news settling.
      const t = clamp01(p / 0.8);
      const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
      const scale = ready ? Math.exp(Math.log(endScale) * eased) : 1;
      const blend = ready && endScale > 1 ? (1 / scale - 1) / (1 / endScale - 1) : 0;
      const roll = -4 * smooth(0.06, 0.5, t) * (1 - smooth(0.62, 0.92, t));
      el.style.setProperty("--lite-s", scale.toFixed(4));
      el.style.setProperty("--lite-x", `${(dx * blend).toFixed(2)}px`);
      el.style.setProperty("--lite-y", `${(dy * blend + 0.04 * vh * eased).toFixed(2)}px`);
      el.style.setProperty("--lite-r", `${roll.toFixed(3)}deg`);
      el.style.setProperty("--cap-o", (1 - smooth(0.01, 0.16, p)).toFixed(3));
      // Once the ink fills the screen, the page colour takes over and the news arrive.
      el.style.setProperty("--veil-o", smooth(0.76, 0.86, p).toFixed(3));
      el.style.setProperty("--news-o", smooth(0.8, 0.95, p).toFixed(3));
      el.style.setProperty("--news-y", `${((1 - smooth(0.8, 1, p)) * 40).toFixed(1)}px`);
      el.toggleAttribute("data-entered", p >= 0.9);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      layout();
      schedule();
    };

    layout();
    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="novosti"
      ref={section}
      aria-label="Novosti"
      className="zs-lite relative bg-background"
      style={
        {
          "--lite-len": LENGTH,
          "--lite-base": 1 / OVERSAMPLE,
          "--lite-s": 1,
          "--lite-x": "0px",
          "--lite-y": "0px",
          "--lite-r": "0deg",
          "--cap-o": 1,
          "--veil-o": 0,
          "--news-o": 0,
          "--news-y": "40px",
        } as CSSProperties
      }
    >
      <span ref={probe} aria-hidden="true" className="pointer-events-none invisible absolute left-0 top-0 h-svh w-0" />

      {/* Pinned stage: the word, then a veil in the page colour once the camera is inside the ink. */}
      <div ref={stage} className="zs-lite__stage sticky top-0 h-svh overflow-hidden">
        <svg ref={svg} aria-hidden="true" className="zs-lite__word absolute">
          <text
            ref={glyph}
            x="0"
            y="0"
            className="font-display font-black"
            style={{ fontSize: 100, fontKerning: "none", fontVariantLigatures: "none" }}
          >
            {WORD}
          </text>
        </svg>
        <p className="zs-lite__caption absolute inset-x-6 top-[calc(46%+min(14vw,6rem))] text-center text-muted">
          Obavijesti i priče iz našeg rada.
        </p>
        <div aria-hidden="true" className="zs-lite__veil absolute inset-0 bg-background" />
      </div>

      {/* The news slide up over the stage and land with room above the heading. */}
      <div className="zs-lite__news px-page relative pb-28 pt-[14svh]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="heading text-[clamp(2.25rem,4.2vw,3.75rem)]">Novosti</h2>
          <Link href="/novosti" className="label link pb-1">
            Sve novosti →
          </Link>
        </div>
        <div className="mt-12">
          <NewsMagazine items={items} />
        </div>
      </div>
    </section>
  );
}
