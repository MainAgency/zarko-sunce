"use client";

import { MoveHorizontal } from "lucide-react";
import Link from "next/link";
import { useState, type CSSProperties } from "react";

import type { Photo } from "@/lib/content";

import { BeforeAfter } from "./BeforeAfter";

export type Comparison = {
  id: string;
  before: Photo;
  after: Photo;
  project: { slug: string; title: string; meta: string };
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Tile sizes for an editorial, asymmetric grid: rows alternate wide | narrow
 * and narrow | wide on a 12-column grid. The crops are picked so the two
 * tiles in a row come out at about the same height.
 */
const LAYOUT = [
  { span: "lg:col-span-7", aspect: "aspect-square sm:aspect-[4/3]" },
  { span: "lg:col-span-5", aspect: "aspect-square" },
  { span: "lg:col-span-5", aspect: "aspect-square" },
  { span: "lg:col-span-7", aspect: "aspect-square sm:aspect-[4/3]" },
];

/**
 * All before/after comparisons on one page: a heading, project filters, and
 * every slider live — drag any of them. Filtering re-flows the grid.
 */
export function BeforeAfterIndex({ comparisons }: { comparisons: Comparison[] }) {
  const [filter, setFilter] = useState<string | null>(null);

  // One filter per project that has comparisons, with its count.
  const projects = Array.from(
    comparisons
      .reduce((map, c) => {
        const entry = map.get(c.project.slug) ?? { ...c.project, count: 0 };
        entry.count += 1;
        return map.set(c.project.slug, entry);
      }, new Map<string, Comparison["project"] & { count: number }>())
      .values(),
  );
  const shown = filter ? comparisons.filter((c) => c.project.slug === filter) : comparisons;

  const chip = (active: boolean) =>
    `label inline-flex h-10 items-center gap-2 border px-4 transition-colors duration-300 ${
      active ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink hover:text-ink"
    }`;

  return (
    <section className="px-page pb-28 pt-32 lg:pt-40">
      <h1 data-reveal className="heading text-[clamp(2.75rem,6vw,5.5rem)]">
        Prije nas, <em>poslije nas.</em>
      </h1>
      <p
        data-reveal
        style={{ "--rd": "120ms" } as CSSProperties}
        className="mt-8 flex max-w-xl items-start gap-3 text-lg leading-relaxed text-muted"
      >
        <MoveHorizontal aria-hidden="true" strokeWidth={1.5} className="mt-1.5 size-5 shrink-0 text-ink" />
        Povucite crtu na bilo kojoj fotografiji lijevo ili desno i usporedite prostor prije i nakon naših radova.
      </p>

      {/* Filters: all, or one project at a time. */}
      <div
        role="group"
        aria-label="Filtriraj po projektu"
        className="mt-14 flex flex-wrap items-center gap-2 border-t border-line pt-6 lg:mt-20"
      >
        <button
          type="button"
          onClick={() => setFilter(null)}
          aria-pressed={filter === null}
          className={chip(filter === null)}
        >
          Sve <span className="tabular-nums opacity-60">{comparisons.length}</span>
        </button>
        {projects.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setFilter(p.slug)}
            aria-pressed={filter === p.slug}
            className={chip(filter === p.slug)}
          >
            {p.title} <span className="tabular-nums opacity-60">{p.count}</span>
          </button>
        ))}
      </div>

      <ul className="mt-12 grid items-end gap-x-6 gap-y-16 lg:grid-cols-12 lg:gap-y-24">
        {shown.map((c, i) => {
          // A lone comparison, or an odd one left over at the end, is centred instead of hugging one side.
          const alone = shown.length === 1 || (i === shown.length - 1 && i % 2 === 0);
          const tile = alone
            ? { span: "lg:col-span-8 lg:col-start-3", aspect: "aspect-square sm:aspect-[16/10]" }
            : LAYOUT[i % LAYOUT.length];
          return (
            <li key={c.id} className={`animate-[swap-in_0.6s_var(--ease)_both] ${tile.span}`}>
              <BeforeAfter before={c.before} after={c.after} width={1400} className={tile.aspect} />
              <div className="mt-5 flex items-baseline justify-between gap-6">
                <Link href={`/projekti/${c.project.slug}`} className="group text-lg leading-tight sm:text-xl">
                  <span className="link pb-1">{c.project.title}</span> →
                </Link>
                <span className="label shrink-0 tabular-nums text-muted">
                  {pad(i + 1)} / {pad(shown.length)}
                </span>
              </div>
              {c.project.meta && <p className="label mt-2 text-muted">{c.project.meta}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
