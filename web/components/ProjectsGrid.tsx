"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";

import type { Project } from "@/lib/content";

import { Frame } from "./Frame";

/*
 * Project grid after santalarch.com's works: photos of mixed heights in three
 * columns. While the grid scrolls past, the outer columns drift upward faster
 * than the middle one (eased toward the scroll, like the services band), so
 * the columns slide against each other. Phones get two columns, the right
 * one drifting the same way. Each tile carries only the project's name.
 */

/** Crops that vary the tile heights; the photos are mostly portrait. */
const ASPECTS = ["4/5", "1/1", "3/4", "3/4", "4/3", "4/5", "1/1", "4/5", "3/4"];
/** Phones: portrait only, so the title over the photo always has room. */
const ASPECTS_PHONE = ["3/4", "4/5", "4/5", "3/4", "3/4", "4/5", "4/5", "3/4", "3/4"];
/** How far (px) the outer columns travel across the grid's pass through the screen. */
const TRAVEL = 260;
const GLIDE = 0.12;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Splits the list into `n` columns, left to right, row by row. */
const columns = <T,>(items: T[], n: number) => Array.from({ length: n }, (_, c) => items.filter((_, i) => i % n === c));

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = grid.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let y: number | null = null;

    const render = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const t = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
      const goal = (0.5 - t) * TRAVEL; // +½ travel on entry, −½ on exit
      y = y === null ? goal : y + (goal - y) * GLIDE;
      if (Math.abs(goal - y) < 0.1) y = goal;
      el.style.setProperty("--pl", y.toFixed(2));
      if (y !== goal) frame = requestAnimationFrame(render);
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

  const items = projects.map((project, i) => ({ project, i }));

  return (
    <div ref={grid} style={{ "--pl": 0 } as CSSProperties}>
      {/* Desktop: three columns, the outer two drifting. */}
      <div className="hidden grid-cols-3 items-start gap-4 md:grid lg:gap-5">
        {columns(items, 3).map((col, c) => (
          <div key={c} className={`flex flex-col gap-12 ${c === 1 ? "pt-32" : "zs-drift"}`}>
            {col.map(({ project, i }) => (
              <Tile key={project.slug} project={project} index={i} />
            ))}
          </div>
        ))}
      </div>
      {/* Phones: two columns, the right one set lower and drifting. */}
      <div className="grid grid-cols-2 items-start gap-3 md:hidden">
        {columns(items, 2).map((col, c) => (
          <div key={c} className={`flex flex-col gap-6 ${c === 1 ? "zs-drift-sm pt-20" : ""}`}>
            {col.map(({ project, i }) => (
              <Tile key={project.slug} project={project} index={i} phone />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Tile({ project, index, phone = false }: { project: Project; index: number; phone?: boolean }) {
  return (
    <Link href={`/projekti/${project.slug}`} className="group block">
      <Frame
        photo={project.cover}
        width={900}
        delay={(index % 3) * 110}
        className="w-full"
        imgClassName="transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        style={{ aspectRatio: (phone ? ASPECTS_PHONE : ASPECTS)[index % ASPECTS.length] }}
      />
      {/* Just the project's name under the photo. */}
      <span className={`block leading-tight ${phone ? "mt-2 text-base" : "mt-4 text-lg sm:text-xl"}`}>
        <span className="link pb-0.5">{project.title}</span>
        {!phone && " →"}
      </span>
    </Link>
  );
}
