import Link from "next/link";

import { PROJECTS, projectMeta, type Photo, type Project } from "@/lib/content";

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
      </div>
    </section>
  );
}
