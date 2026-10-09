import Link from "next/link";

import { PROJECTS, projectMeta, type Photo, type Project } from "@/lib/content";

import { BeforeAfter } from "./BeforeAfter";
import { Frame } from "./Frame";
import { SectionIntro } from "./SectionIntro";
import { ZoomIntro } from "./ZoomIntro";

const zoom = "transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]";

/**
 * A selection of four projects in two columns (1.2 : 0.8). Tall and short
 * tiles swap sides, so the columns' heights stagger against each other.
 */
const [a, b, c, d] = PROJECTS;
const COLUMNS: { width: number; tiles: { project: Project; tall: boolean }[] }[] = [
  { width: 1400, tiles: [{ project: a, tall: true }, { project: b, tall: false }] },
  { width: 1000, tiles: [{ project: c, tall: false }, { project: d, tall: true }] },
].map((col) => ({ ...col, tiles: col.tiles.filter((t) => t.project) }));

/**
 * Zoom intro collage built from the projects themselves — covers first, then
 * gallery shots, no repeats — so it follows the real projects once they land.
 */
const INTRO_PHOTOS: Photo[] = Array.from(
  new Map(
    [...PROJECTS.map((p) => p.cover), ...PROJECTS.flatMap((p) => p.gallery)].map((photo) => [photo.src, photo]),
  ).values(),
);

/** The first before/after pair among the projects, shown as a wide slider under the selection. */
const FEATURED_COMPARISON = PROJECTS.flatMap((p) => (p.comparisons ?? []).map((c) => ({ project: p, ...c })))[0];

export function Projects() {
  return (
    <section aria-label="Projekti">
      {/* Full-bleed zoom intro; the anchor below skips past it straight to the selection. */}
      <ZoomIntro photos={INTRO_PHOTOS} />

      <div id="projekti" className="px-page py-28 lg:py-40">
        <SectionIntro
          label="Projekti"
          title={
            <>
              Odabrani <em>radovi.</em>
            </>
          }
          text="Izbor adaptacija i završnih radova — stanovi, kuće i poslovni prostori."
        />

        <div className="mt-16 grid grid-cols-[1.2fr_0.8fr] gap-[25px] lg:mt-24">
          {COLUMNS.map((col, i) => (
            <div key={i} className="flex min-w-0 flex-col gap-[25px]">
              {col.tiles.map(({ project, tall }, j) => (
                <Link key={project.slug} href={`/projekti/${project.slug}`} className="group relative block">
                  <Frame
                    photo={project.cover}
                    width={col.width}
                    delay={(i + j) * 120}
                    className={tall ? "h-[420px]" : "h-[260px]"}
                    imgClassName={zoom}
                  />
                  {/* Title fades in over the photo on hover. */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-16 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-6 sm:pt-20">
                    <p className="label text-white/75">{projectMeta(project)}</p>
                    <p className="mt-2 text-lg leading-tight sm:text-xl">{project.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Before/after slider: drag the divider to compare the space before and after the work. */}
        {FEATURED_COMPARISON && (
          <div className="mt-20 lg:mt-28">
            <div className="grid gap-4 lg:grid-cols-12">
              <p data-reveal className="label dot text-muted lg:col-span-3 lg:pt-1">
                Prije i poslije
              </p>
              <p data-reveal className="max-w-md text-muted lg:col-span-8 lg:col-start-5">
                Povucite crtu lijevo ili desno i usporedite prostor prije i nakon radova.
              </p>
            </div>
            <div data-reveal className="mt-10">
              <BeforeAfter
                before={FEATURED_COMPARISON.before}
                after={FEATURED_COMPARISON.after}
                width={2000}
                className="aspect-square sm:aspect-[16/10]"
              />
              <Link
                href={`/projekti/${FEATURED_COMPARISON.project.slug}`}
                className="group mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
              >
                <span className="text-lg leading-tight sm:text-xl">
                  <span className="link pb-1">{FEATURED_COMPARISON.project.title}</span> →
                </span>
                <span className="label text-muted">{projectMeta(FEATURED_COMPARISON.project)}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
