"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useRef, type CSSProperties } from "react";

import { CONTACT, PHOTOS, photoUrl } from "@/lib/content";

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
 *
 * Each piece is an HTML layer (the photo as its background, cut with
 * clip-path) moved with transforms, so phones composite the animation instead
 * of repainting one big SVG every frame. The board is laid out in fixed units
 * and scaled to the figure's width.
 */

const COLS = 4;
const ROWS = 5;
const S = 100; // piece size in board units
/** How far a knob reaches past the piece's square, plus a little room for the stroke. */
const REACH = 0.22 * S + 3;
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

type Piece = {
  /** Outline in board units (for the gap drawn on the board). */
  path: string;
  /** The same outline relative to the piece's own box (for its clip and stroke). */
  local: string;
  /** The piece's box on the board: its square plus the knobs' reach. */
  bx: number;
  by: number;
  size: number;
  cx: number;
  cy: number;
  sx: number;
  sy: number;
  rot: number;
  delay: number;
};

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

  // One edge of the outline; `ox`/`oy` shift the coordinates into a local box.
  const edge = (
    ax: number,
    ay: number,
    bx: number,
    by: number,
    bulgeX: number,
    bulgeY: number,
    ox: number,
    oy: number,
  ) => {
    if (!bulgeX && !bulgeY) return `L${f(bx - ox)} ${f(by - oy)}`;
    const p = (t: number, h: number) =>
      `${f(ax + (bx - ax) * t + bulgeX * h * S - ox)} ${f(ay + (by - ay) * t + bulgeY * h * S - oy)}`;
    return `L${p(0.35, 0)}C${p(0.42, 0.02)} ${p(0.3, 0.22)} ${p(0.5, 0.22)}C${p(0.7, 0.22)} ${p(0.58, 0.02)} ${p(0.65, 0)}L${f(bx - ox)} ${f(by - oy)}`;
  };

  const pieces: Piece[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * S;
      const y = r * S;
      const outline = (ox: number, oy: number) =>
        `M${f(x - ox)} ${f(y - oy)}` +
        edge(x, y, x + S, y, 0, r > 0 ? hEdge[r][c] : 0, ox, oy) +
        edge(x + S, y, x + S, y + S, c < COLS - 1 ? vEdge[r][c + 1] : 0, 0, ox, oy) +
        edge(x + S, y + S, x, y + S, 0, r < ROWS - 1 ? hEdge[r + 1][c] : 0, ox, oy) +
        edge(x, y + S, x, y, c > 0 ? vEdge[r][c] : 0, 0, ox, oy) +
        "Z";
      const bx = x - REACH;
      const by = y - REACH;
      const cx = x + S / 2;
      const cy = y + S / 2;
      // Scatter outward from the middle of the board, with some jitter.
      const dx = cx - W / 2;
      const dy = cy - H / 2;
      const len = Math.hypot(dx, dy) || 1;
      const mag = 140 + rand() * 170;
      pieces.push({
        path: outline(0, 0),
        local: outline(bx, by),
        bx,
        by,
        size: S + 2 * REACH,
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
/** The photo cropped to the board's 4:5, so a plain W×H background lines up on every piece. */
const IMAGE = `${photoUrl(PHOTOS.livingWindow, 1000)}&h=${Math.round((1000 * H) / W)}`;
/** Shared by every piece: the whole photo as background, offset so this box shows its part. */
const pieceStyle = (piece: Piece): CSSProperties => ({
  left: piece.bx,
  top: piece.by,
  width: piece.size,
  height: piece.size,
  clipPath: `path("${piece.local}")`,
  backgroundImage: `url("${IMAGE}")`,
  backgroundSize: `${W}px ${H}px`,
  backgroundPosition: `${-piece.bx}px ${-piece.by}px`,
});
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const delay = (ms: number) => ({ "--rd": `${ms}ms` }) as CSSProperties;

export function LetsWorkTogether() {
  const figure = useRef<HTMLElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const pieces = useRef<(HTMLDivElement | null)[]>([]);

  // Drives the assembly from scroll position: 0 when the board's top enters
  // the bottom of the screen, 1 once it reaches the upper quarter.
  useLayoutEffect(() => {
    const svg = board.current;
    const fig = figure.current;
    const section = svg?.closest("section");
    if (!svg || !fig || !section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let complete = false;

    // The board is laid out in W×H units and scaled to the figure's width.
    const fit = () => fig.style.setProperty("--s", String(fig.clientWidth / W));
    fit();
    const sizer = new ResizeObserver(fit);
    sizer.observe(fig);

    const render = () => {
      frame = 0;
      // A 100svh probe: window.innerHeight jumps on phones as the address bar hides.
      const vh = probe.current?.offsetHeight || window.innerHeight;
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
      sizer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const missing = PIECES[MISSING];

  return (
    <section aria-labelledby="iz-ideje-u-stvarnost" className="overflow-hidden border-t border-line">
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
          <h2 id="iz-ideje-u-stvarnost" data-reveal style={delay(80)} className="heading mt-8 text-[clamp(2.75rem,5.8vw,5.5rem)]">
            Iz ideje <em>u stvarnost.</em>
          </h2>
          <p data-reveal style={delay(160)} className="mt-8 max-w-sm text-lg leading-relaxed text-muted">
            Recite nam što planirate. Dolazimo na besplatan izlazak na teren, pogledamo prostor i šaljemo
            jasnu ponudu — bez skrivenih stavki i bez obveze.
          </p>
          {/* Button: text block plus an arrow cell; on hover the arrow slides out and a
              second one slides in behind it, while the whole button turns yellow. */}
          <span data-reveal style={delay(220)} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <span className="btn-fill btn-fill--yellow inline-flex h-14 items-stretch bg-ink text-paper">
              <span className="flex items-center pl-7 pr-6 text-[15px] font-medium tracking-[-0.01em]">Pošaljite upit</span>
              <span
                aria-hidden="true"
                className="relative flex w-14 items-center justify-center overflow-hidden border-l border-paper/15 transition-colors duration-300 group-hover:border-black/15"
              >
                <ArrowUpRight
                  strokeWidth={1.75}
                  className="size-5 transition-transform duration-500 ease-out group-hover:-translate-y-8 group-hover:translate-x-8"
                />
                <ArrowUpRight
                  strokeWidth={1.75}
                  className="absolute size-5 -translate-x-8 translate-y-8 transition-transform duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
                />
              </span>
            </span>
            <span className="text-sm text-muted">ili nazovite {CONTACT.phone}</span>
          </span>
        </div>

        <figure
          ref={figure}
          className="relative mx-auto aspect-[4/5] w-full max-w-[26rem] lg:col-span-6 lg:col-start-7 lg:max-w-[30rem]"
          style={{ "--s": 1 } as CSSProperties}
        >
          <span
            ref={probe}
            aria-hidden="true"
            className="pointer-events-none invisible absolute left-0 top-0 h-svh w-0"
          />
          <div
            ref={board}
            role="img"
            aria-label="Fotografija uređenog interijera složena od puzzle komadića"
            className="zs-puzzle absolute left-0 top-0 origin-top-left"
            style={{ width: W, height: H, scale: "var(--s)" }}
          >
            {/* The gap your piece fills. */}
            <svg
              aria-hidden="true"
              viewBox={`0 0 ${missing.size} ${missing.size}`}
              className="zs-puzzle__hole absolute overflow-visible"
              style={{ left: missing.bx, top: missing.by, width: missing.size, height: missing.size }}
            >
              <path
                d={missing.local}
                fill="color-mix(in srgb, var(--foreground) 6%, transparent)"
                stroke="var(--muted)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            </svg>

            {PIECES.map((piece, i) =>
              i === MISSING ? null : (
                <div
                  key={i}
                  ref={(el) => {
                    pieces.current[i] = el;
                  }}
                  className="zs-puzzle__piece absolute"
                  style={{ ...pieceStyle(piece), transformOrigin: `${piece.cx - piece.bx}px ${piece.cy - piece.by}px` }}
                >
                  <svg
                    aria-hidden="true"
                    viewBox={`0 0 ${piece.size} ${piece.size}`}
                    className="absolute inset-0 overflow-visible"
                  >
                    <path d={piece.local} fill="none" stroke="rgb(255 255 255 / 0.4)" strokeWidth={0.75} />
                  </svg>
                </div>
              ),
            )}

            {/* Your piece: waits beside the gap, snaps in at the end of the section (or on hover). */}
            <div
              className="zs-puzzle__missing absolute"
              style={{
                left: missing.bx,
                top: missing.by,
                width: missing.size,
                height: missing.size,
                transformOrigin: `${missing.cx - missing.bx}px ${missing.cy - missing.by}px`,
              }}
            >
              <div
                className="zs-puzzle__bob absolute inset-0"
                style={{ transformOrigin: `${missing.cx - missing.bx}px ${missing.cy - missing.by}px` }}
              >
                <div className="absolute inset-0" style={{ ...pieceStyle(missing), left: 0, top: 0 }} />
                <svg
                  aria-hidden="true"
                  viewBox={`0 0 ${missing.size} ${missing.size}`}
                  className="absolute inset-0 overflow-visible"
                >
                  <path d={missing.local} fill="none" stroke="var(--yellow)" strokeWidth={2.5} />
                </svg>
              </div>
            </div>
          </div>
        </figure>
      </Link>
    </section>
  );
}
