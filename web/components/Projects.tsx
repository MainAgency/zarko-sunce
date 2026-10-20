import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PROJECTS, projectMeta } from "@/lib/content";

import { BeforeAfter } from "./BeforeAfter";
import { ProjectsGrid } from "./ProjectsGrid";
import { SectionIntro } from "./SectionIntro";

/** The first before/after pair among the projects, shown as a wide slider above the selection. */
const FEATURED_COMPARISON = PROJECTS.flatMap((p) => (p.comparisons ?? []).map((c) => ({ project: p, ...c })))[0];

export function Projects() {
  return (
    <section aria-label="Projekti">
      <div id="projekti" className="px-page py-28 lg:py-40">
        {/* Before/after slider first: drag the divider to compare the space before and after the work. */}
        {FEATURED_COMPARISON && (
          <div>
            {/* Heading left, the link to every comparison top right (like the blog's "Svi članci"). */}
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
              <div className="grid gap-4 lg:grid-cols-12">
                <h2 data-reveal className="heading text-[clamp(2.25rem,4.2vw,3.75rem)] lg:col-span-5">
                  Prije ↔ poslije
                </h2>
                <p data-reveal className="max-w-md text-muted lg:col-span-6 lg:col-start-7 lg:pt-2">
                  Povucite crtu lijevo ili desno i usporedite prostor prije i nakon radova.
                </p>
              </div>
              <Link
                href="/prije-i-poslije"
                className="btn-fill label group inline-flex h-12 items-center gap-3 border border-ink px-6"
              >
                Sve usporedbe prije ↔ poslije
                <ArrowRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
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
            </div>
          </div>
        )}

        {/* The selection, under the slider. */}
        <div className={FEATURED_COMPARISON ? "mt-28 lg:mt-40" : ""}>
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
        </div>
      </div>
    </section>
  );
}
