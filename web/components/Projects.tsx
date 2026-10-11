import Link from "next/link";

import { PROJECTS, projectMeta } from "@/lib/content";

import { BeforeAfter } from "./BeforeAfter";
import { ProjectsGrid } from "./ProjectsGrid";
import { SectionIntro } from "./SectionIntro";

/** The first before/after pair among the projects, shown as a wide slider under the selection. */
const FEATURED_COMPARISON = PROJECTS.flatMap((p) => (p.comparisons ?? []).map((c) => ({ project: p, ...c })))[0];

export function Projects() {
  return (
    <section aria-label="Projekti">
      <div id="projekti" className="px-page py-28 lg:py-40">
        <SectionIntro
          title={
            <>
              Odabrani <em>radovi.</em>
            </>
          }
          text="Adaptacije i završni radovi — stanovi, kuće i poslovni prostori. Otvorite projekt za cijelu priču i fotografije."
        />

        {/* All projects, three drifting columns (see ProjectsGrid). */}
        <div className="mt-16 lg:mt-24">
          <ProjectsGrid projects={PROJECTS} />
        </div>

        {/* Before/after slider: drag the divider to compare the space before and after the work. */}
        {FEATURED_COMPARISON && (
          <div className="mt-20 lg:mt-28">
            <div className="grid gap-4 lg:grid-cols-12">
              <h3 data-reveal className="heading text-[clamp(1.75rem,3vw,2.5rem)] lg:col-span-4">
                Prije ↔ poslije
              </h3>
              <p data-reveal className="max-w-md text-muted lg:col-span-7 lg:col-start-6 lg:pt-2">
                Povucite crtu lijevo ili desno i usporedite prostor prije i nakon radova.
              </p>
            </div>
            {/* Narrower than the page on desktop so the slider doesn't swallow the screen. */}
            <div data-reveal className="mx-auto mt-10 max-w-4xl">
              <BeforeAfter
                before={FEATURED_COMPARISON.before}
                after={FEATURED_COMPARISON.after}
                width={1600}
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
              <Link href="/prije-i-poslije" className="label link mt-8 inline-block pb-1">
                Sve usporedbe prije ↔ poslije
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
