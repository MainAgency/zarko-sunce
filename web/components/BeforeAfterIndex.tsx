"use client";

import { MoveHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

import { photoUrl, type Photo } from "@/lib/content";

import { BeforeAfter } from "./BeforeAfter";

export type Comparison = {
  id: string;
  before: Photo;
  after: Photo;
  project: { slug: string; title: string; meta: string };
};

type Group = { project: Comparison["project"]; items: Comparison[] };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * All before/after comparisons on one page, one chapter per project: a title
 * row, one wide slider showing the project's main pair, and — when there are
 * more — a strip of thumbnails that swap other pairs into the slider. A list
 * of the projects sticks on the right and tracks the chapter on screen.
 */
export function BeforeAfterIndex({ comparisons }: { comparisons: Comparison[] }) {
  // One chapter per project, in the order the projects (and their pairs) are listed.
  const groups = Array.from(
    comparisons
      .reduce((map, c) => {
        const group = map.get(c.project.slug) ?? { project: c.project, items: [] };
        group.items.push(c);
        return map.set(c.project.slug, group);
      }, new Map<string, Group>())
      .values(),
  );

  // The chapter nearest the top of the screen is marked in the project list as you scroll.
  const [current, setCurrent] = useState(groups[0]?.project.slug);
  useEffect(() => {
    const sections = groups
      .map((g) => document.getElementById(`usporedba-${g.project.slug}`))
      .filter((el) => el !== null);
    if (sections.length === 0) return;
    const pick = () => {
      const line = window.innerHeight * 0.4;
      let best = sections[0];
      for (const el of sections) if (el.getBoundingClientRect().top <= line) best = el;
      setCurrent(best.id.replace("usporedba-", ""));
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- groups derive from the comparisons prop
  }, [comparisons]);

  return (
    <section className="pb-28 pt-32 lg:pt-40">
      {/* Title and the hint, side by side on desktop. */}
      <header className="px-page grid gap-8 lg:grid-cols-12 lg:items-end">
        <h1 data-reveal className="heading text-[clamp(2.75rem,6vw,5.5rem)] lg:col-span-8">
          Prije nas, <em>poslije nas.</em>
        </h1>
        <p
          data-reveal
          style={{ "--rd": "120ms" } as CSSProperties}
          className="flex max-w-sm items-start gap-3 leading-relaxed text-muted lg:col-span-4 lg:justify-self-end"
        >
          <MoveHorizontal aria-hidden="true" strokeWidth={1.5} className="mt-1 size-5 shrink-0 text-ink" />
          Povucite crtu na fotografiji lijevo ili desno i usporedite prostor prije i nakon naših radova.
        </p>
      </header>

      <div className="px-page mt-14 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-x-10">
        {/* Project list, on the right on desktop: sticks beside the chapters and
            marks the one on screen with a yellow bar; clicking one jumps to it. */}
        <nav aria-label="Projekti" className="lg:sticky lg:top-32 lg:order-last lg:col-span-3 lg:self-start">
          <p className="label border-b border-line pb-3 text-muted">Projekti</p>
          <ol className="mt-3 border-l border-line">
            {groups.map((g, i) => {
              const active = g.project.slug === current;
              return (
                <li key={g.project.slug}>
                  <a
                    href={`#usporedba-${g.project.slug}`}
                    aria-current={active ? "true" : undefined}
                    className={`relative flex items-baseline gap-3 py-2.5 pl-5 transition-colors duration-300 ${
                      active ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute -left-px top-0 h-full w-0.5 origin-top bg-yellow transition-transform duration-300 ${
                        active ? "scale-y-100" : "scale-y-0"
                      }`}
                    />
                    <span className="label w-6 shrink-0 tabular-nums opacity-60">{pad(i + 1)}</span>
                    <span className="min-w-0 flex-1 text-[15px] leading-snug">
                      {g.project.title}
                      {g.project.meta && <span className="label mt-1 block opacity-60">{g.project.meta}</span>}
                    </span>
                    <span className="label shrink-0 tabular-nums opacity-60">{g.items.length}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <ol className="mt-12 space-y-24 lg:col-span-9 lg:mt-0 lg:space-y-32">
          {groups.map((g, i) => (
            <Chapter key={g.project.slug} group={g} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

/** One project: title row, the selected pair in a wide slider, and thumbnails of the other pairs. */
function Chapter({ group, index }: { group: Group; index: number }) {
  const [selected, setSelected] = useState(0);
  const { project, items } = group;
  const pair = items[selected];

  return (
    <li id={`usporedba-${project.slug}`} className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-b border-line pb-6">
        <div>
          <p className="label text-muted">
            <span className="tabular-nums">{pad(index + 1)}</span>
            {project.meta && <> · {project.meta}</>}
          </p>
          <h2 className="heading mt-3 text-[clamp(2rem,3.6vw,3.25rem)]">{project.title}</h2>
        </div>
        <Link
          href={`/projekti/${project.slug}`}
          className="btn-fill label inline-flex h-11 items-center gap-3 border border-line px-5 text-ink"
        >
          Pogledajte projekt <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="mt-8 lg:mt-10">
        {/* A new key per pair, so the divider starts in the middle again. */}
        <BeforeAfter
          key={pair.id}
          before={pair.before}
          after={pair.after}
          width={2000}
          className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/10]"
        />
      </div>

      {items.length > 1 && (
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Thumbnails: the "after" photo of every pair; the selected one is framed in yellow. */}
          <ol role="tablist" aria-label={`Usporedbe: ${project.title}`} className="flex gap-3 overflow-x-auto pb-1">
            {items.map((c, i) => {
              const active = i === selected;
              return (
                <li key={c.id} className="shrink-0">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelected(i)}
                    className={`group/thumb relative block aspect-[4/3] w-28 overflow-hidden bg-ink/5 outline-offset-[-3px] transition-opacity duration-300 sm:w-36 ${
                      active ? "outline outline-[3px] outline-yellow" : "opacity-55 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={photoUrl(c.after, 400)}
                      alt={`Usporedba ${i + 1}`}
                      fill
                      sizes="144px"
                      className={`object-cover transition-[filter] duration-500 ${active ? "" : "grayscale group-hover/thumb:grayscale-0"}`}
                    />
                    <span className="label absolute bottom-2 left-2 bg-black/60 px-1.5 py-0.5 text-white">{pad(i + 1)}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="label shrink-0 tabular-nums text-muted sm:pt-2">
            {pad(selected + 1)} / {pad(items.length)}
          </p>
        </div>
      )}
    </li>
  );
}
