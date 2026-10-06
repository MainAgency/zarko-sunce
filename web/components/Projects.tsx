import { PROJECTS, photoUrl, type Photo } from "@/lib/content";

import { SectionIntro } from "./SectionIntro";
import { CinematicList, type CinematicItem } from "./ui/cinematic-list";
import { ZoomIntro } from "./ZoomIntro";

const ITEMS: CinematicItem[] = PROJECTS.map((project, i) => ({
  id: String(i + 1).padStart(2, "0"),
  title: project.title,
  meta: `${project.category} · ${project.area}`,
  href: `/projekti/${project.slug}`,
  src: photoUrl(project.cover, 2000),
  alt: project.cover.alt,
}));

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
      {/* Full-bleed zoom intro; the anchor below skips past it straight to the list. */}
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

        {/* A wrapper carries the reveal: on the rows themselves it would override their height transition. */}
        <div data-reveal className="mt-16 lg:mt-24">
          <CinematicList items={ITEMS} />
        </div>
      </div>
    </section>
  );
}
