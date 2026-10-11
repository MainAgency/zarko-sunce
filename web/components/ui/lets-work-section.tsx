"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useRef, type CSSProperties } from "react";

import { PHOTOS, photoUrl } from "@/lib/content";

/*
 * Closing call to action, reworked from the 21st.dev "Let's work together"
 * section. The whole section is one link to the contact page — no contact
 * details or form here, those live on /kontakt.
 *
 * Puzzle: a finished interior cut into real jigsaw pieces. They fly in from
 * scattered positions and click together as the section scrolls into view;
 * one piece — outlined in yellow, "your part" — waits beside its gap and
 * snaps in once you scroll to the end of the section, or earlier when the
 * pointer is over it; scrolling back up lifts it out and the board breaks apart
 * again.
 */

const COLS = 4;
const ROWS = 5;
const S = 100; // piece size in SVG units
const W = COLS * S;
const H = ROWS * S;
const MISSING = 2 * COLS + 2; // row 3, column 3

/** Small seeded PRNG so the cut and the scatter are the same on server and client. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Piece = { path: string; cx: number; cy: number; sx: number; sy: number; rot: number; delay: number };

/**
 * Cuts the board. Each inner edge gets a knob that bulges one way; the knob
 * shape is symmetric, so both neighbours trace the same curve.
 */
function cut(): Piece[] {
  const rand = rng(7);
  const sign = () => (rand() < 0.5 ? -1 : 1);
  const hEdge = Array.from({ length: ROWS + 1 }, () => Array.from({ length: COLS }, sign));
  const vEdge = Array.from({ length: ROWS }, () => Array.from({ length: COLS + 1 }, sign));
  const f = (n: number) => +n.toFixed(2);

  const edge = (ax: number, ay: number, bx: number, by: number, bulgeX: number, bulgeY: number) => {
    if (!bulgeX && !bulgeY) return `L${bx} ${by}`;
    const p = (t: number, h: number) =>
      `${f(ax + (bx - ax) * t + bulgeX * h * S)} ${f(ay + (by - ay) * t + bulgeY * h * S)}`;
    return `L${p(0.35, 0)}C${p(0.42, 0.02)} ${p(0.3, 0.22)} ${p(0.5, 0.22)}C${p(0.7, 0.22)} ${p(0.58, 0.02)} ${p(0.65, 0)}L${bx} ${by}`;
  };

  const pieces: Piece[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * S;
      const y = r * S;
      const path =
        `M${x} ${y}` +
        edge(x, y, x + S, y, 0, r > 0 ? hEdge[r][c] : 0) +
        edge(x + S, y, x + S, y + S, c < COLS - 1 ? vEdge[r][c + 1] : 0, 0) +
        edge(x + S, y + S, x, y + S, 0, r < ROWS - 1 ? hEdge[r + 1][c] : 0) +
        edge(x, y + S, x, y, c > 0 ? vEdge[r][c] : 0, 0) +
        "Z";
      const cx = x + S / 2;
      const cy = y + S / 2;
      // Scatter outward from the middle of the board, with some jitter.
      const dx = cx - W / 2;
      const dy = cy - H / 2;
      const len = Math.hypot(dx, dy) || 1;
      const mag = 140 + rand() * 170;
      pieces.push({
        path,
        cx,
        cy,
        sx: (dx / len) * mag + (rand() - 0.5) * 90,
        sy: (dy / len) * mag + (rand() - 0.5) * 90 + 50,
        rot: (rand() - 0.5) * 80,
        delay: rand() * 0.38,
      });
    }
  }
  return pieces;
}

const PIECES = cut();
const IMAGE = photoUrl(PHOTOS.livingWindow, 1000);
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const delay = (ms: number) => ({ "--rd": `${ms}ms` }) as CSSProperties;

export function LetsWorkTogether() {
  const board = useRef<SVGSVGElement>(null);
  const pieces = useRef<(SVGGElement | null)[]>([]);

  // Drives the assembly from scroll position: 0 when the board's top enters
  // the bottom of the screen, 1 once it reaches the upper quarter.
  useLayoutEffect(() => {
    const svg = board.current;
    const section = svg?.closest("section");
    if (!svg || !section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let complete = false;

    const render = () => {
      frame = 0;
      const vh = window.innerHeight;
      const p = reduce ? 1 : clamp01((vh - svg.getBoundingClientRect().top) / (vh * 0.75));
      PIECES.forEach((piece, i) => {
        const el = pieces.current[i];
        if (!el || i === MISSING) return;
        const local = clamp01((p - piece.delay) / 0.62);
        const e = 1 - (1 - local) ** 3;
        const k = 1 - e;
        el.style.transform = `translate(${piece.sx * k}px, ${piece.sy * k}px) rotate(${piece.rot * k}deg)`;
        el.style.opacity = String(clamp01(local * 3));
      });

      const ready = p >= 0.98;
      svg.toggleAttribute("data-ready", ready);

      // The last piece clicks in once the section has been scrolled to its end
      // (its bottom edge on screen), and comes back out on the way up — with a
      // little slack so it does not flicker right at the edge.
      const bottom = section.getBoundingClientRect().bottom;
      if (!ready) complete = false;
      else if (bottom <= vh + 2) complete = true;
      else if (bottom > vh + 80) complete = false;
      svg.toggleAttribute("data-complete", complete);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const missing = PIECES[MISSING];

  return (
    <section aria-labelledby="radimo-zajedno" className="overflow-hidden border-t border-line">
      <Link
        href="/kontakt"
        className="group px-page grid items-center gap-16 py-28 outline-offset-[-6px] focus-visible:outline-2 focus-visible:outline-yellow lg:grid-cols-12 lg:gap-10 lg:py-40"
      >
        <div className="lg:col-span-5">
          <p data-reveal className="label flex items-center gap-3 text-muted">
            {/* Pulsing square: taking new projects. */}
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping bg-yellow opacity-75" />
              <span className="relative inline-flex size-2 bg-yellow" />
            </span>
            Primamo nove projekte
          </p>
          <h2 id="radimo-zajedno" data-reveal style={delay(80)} className="heading mt-8 text-[clamp(3rem,7vw,6.5rem)]">
            Radimo <em>zajedno.</em>
          </h2>
          <p data-reveal style={delay(160)} className="mt-8 max-w-sm text-lg leading-relaxed text-muted">
            Vaš prostor slažemo dio po dio — od prvog mjerenja do zadnjeg sloja boje. Nedostaje još samo vaš upit.
          </p>
          <span
            data-reveal
            style={delay(220)}
            className="label mt-10 inline-flex h-14 items-center gap-3 bg-ink px-7 text-paper transition-colors duration-300 group-hover:bg-yellow group-hover:text-black"
          >
            Pošaljite upit
            <ArrowUpRight
              aria-hidden="true"
              strokeWidth={1.75}
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>

        <figure className="mx-auto w-full max-w-[26rem] lg:col-span-6 lg:col-start-7 lg:max-w-[30rem]">
          <svg
            ref={board}
            viewBox={`0 0 ${W} ${H}`}
            className="zs-puzzle block h-auto w-full overflow-visible"
            role="img"
            aria-label="Fotografija uređenog interijera složena od puzzle komadića"
          >
            <defs>
              {PIECES.map((piece, i) => (
                <clipPath key={i} id={`zs-piece-${i}`}>
                  <path d={piece.path} />
                </clipPath>
              ))}
            </defs>

            {/* The gap your piece fills. */}
            <path
              d={missing.path}
              className="zs-puzzle__hole"
              fill="color-mix(in srgb, var(--foreground) 6%, transparent)"
              stroke="var(--muted)"
              strokeWidth={1}
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
            />

            {PIECES.map((piece, i) =>
              i === MISSING ? null : (
                <g
                  key={i}
                  ref={(el) => {
                    pieces.current[i] = el;
                  }}
                  className="zs-puzzle__piece"
                  style={{ transformOrigin: `${piece.cx}px ${piece.cy}px` }}
                >
                  <image
                    href={IMAGE}
                    width={W}
                    height={H}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#zs-piece-${i})`}
                  />
                  <path
                    d={piece.path}
                    fill="none"
                    stroke="rgb(255 255 255 / 0.4)"
                    strokeWidth={0.75}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ),
            )}

            {/* Your piece: waits beside the gap, snaps in at the end of the section (or on hover). */}
            <g className="zs-puzzle__missing" style={{ transformOrigin: `${missing.cx}px ${missing.cy}px` }}>
              <g className="zs-puzzle__bob" style={{ transformOrigin: `${missing.cx}px ${missing.cy}px` }}>
                <image
                  href={IMAGE}
                  width={W}
                  height={H}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#zs-piece-${MISSING})`}
                />
                <path
                  d={missing.path}
                  fill="none"
                  stroke="var(--yellow)"
                  strokeWidth={2.5}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </g>
          </svg>
          <figcaption className="label dot mt-8 text-muted">Nedostaje još samo vaš dio</figcaption>
        </figure>
      </Link>
    </section>
  );
}
