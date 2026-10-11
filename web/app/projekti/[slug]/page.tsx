import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BeforeAfter } from "@/components/BeforeAfter";
import { Frame } from "@/components/Frame";
import { ProjectGallery } from "@/components/ProjectGallery";
import { PROJECTS, SERVICES, projectMeta } from "@/lib/content";
import { buildSeoMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return buildSeoMetadata({
    title: project.title,
    description: project.summary,
    path: `/projekti/${project.slug}/`,
    image: project.cover.src,
    imageAlt: project.cover.alt,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const services = SERVICES.filter((s) => project.services.includes(s.id));

  // Only the facts we actually have.
  const facts = [
    ["Kategorija", project.category],
    ["Lokacija", project.location],
    ["Status", project.status],
    ["Površina", project.area],
    ["Trajanje", project.duration],
    ["Usluge", services.map((s) => s.title).join(", ")],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]));

  const gallery = project.gallery.slice(1);

  return (
    <>
      <article className="px-page pb-28 pt-32 lg:pt-40">
        <p data-reveal className="label text-muted">
          <Link href="/#projekti" className="link text-ink">
            ← Svi projekti
          </Link>
        </p>

        {/* Facts on the left stay in view while the cover and the story scroll on the right. */}
        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-10">
          <aside className="self-start lg:sticky lg:top-28 lg:col-span-5">
            <h1 data-reveal className="heading text-[clamp(2.25rem,4.4vw,4rem)]">
              {project.title}
            </h1>
            <p data-reveal className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              {project.summary}
            </p>
            <dl data-reveal className="mt-10 grid grid-cols-2 border-t border-line">
              {facts.map(([label, value]) => (
                <div key={label} className="border-b border-line py-4 pr-4 odd:border-r odd:border-line even:pl-4">
                  <dt className="label text-muted">{label}</dt>
                  <dd className="mt-1 text-[15px] leading-snug">{value}</dd>
                </div>
              ))}
            </dl>
            <Link
              href="/kontakt"
              data-reveal
              className="label mt-8 inline-flex h-12 items-center gap-3 bg-ink px-6 text-paper transition-colors duration-300 hover:bg-yellow hover:text-black"
            >
              Želim sličan projekt <span aria-hidden="true">→</span>
            </Link>
          </aside>

          <div className="lg:col-span-6 lg:col-start-7">
            <Frame photo={project.cover} width={1200} preload className="aspect-[4/5]" />
            <div data-reveal className="mt-12 space-y-6 text-[17px] leading-relaxed text-ink/80">
              {project.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Before/after sliders: one wide, or two to a row. */}
        {project.comparisons && project.comparisons.length > 0 && (
          <section aria-label="Prije i poslije" className="mt-28">
            <div className="grid gap-4 lg:grid-cols-12">
              <h2 data-reveal className="heading text-[clamp(1.75rem,3vw,2.5rem)] lg:col-span-4">
                Prije ↔ poslije
              </h2>
              <p data-reveal className="text-muted lg:col-span-7 lg:col-start-6 lg:pt-2">
                Povucite crtu lijevo ili desno i usporedite prostor prije i nakon radova.
              </p>
            </div>
            {/* Kept well inside the page on desktop: one slider centred, or several two to a row. */}
            <div
              data-reveal
              className={
                project.comparisons.length === 1
                  ? "mx-auto mt-10 max-w-3xl"
                  : "mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2"
              }
            >
              {project.comparisons.map(({ before, after }, i, all) => (
                <BeforeAfter
                  key={before.src}
                  before={before}
                  after={after}
                  width={all.length === 1 ? 1400 : 1000}
                  className={all.length === 1 ? "aspect-square sm:aspect-[4/3]" : "aspect-square"}
                />
              ))}
            </div>
          </section>
        )}

        {/* Gallery: same-size tiles whose columns drift apart as you scroll (see ProjectGallery). */}
        {gallery.length > 0 && (
          <section aria-label="Galerija" className="mt-28">
            <div className="flex items-baseline justify-between gap-6 border-t border-line pt-8">
              <h2 className="heading text-[clamp(1.75rem,3vw,2.5rem)]">Galerija</h2>
              <p className="text-muted tabular-nums">{gallery.length} fotografija</p>
            </div>
            {/* Head room: the outer columns rise into it as you scroll, so they never cover the heading. */}
            <div className="pb-24 pt-20 md:pb-40 md:pt-40">
              <ProjectGallery photos={gallery} />
            </div>
          </section>
        )}
      </article>

      <Link
        href={`/projekti/${next.slug}`}
        className="group px-page grid gap-8 border-t border-line py-20 lg:grid-cols-12"
      >
        <span className="label text-muted lg:col-span-3 lg:pt-3">Sljedeći projekt</span>
        <span className="lg:col-span-5 lg:col-start-5">
          <span className="heading block text-[clamp(1.875rem,3.4vw,3rem)]">
            <span className="link pb-1">{next.title}</span> →
          </span>
          <span className="label mt-4 block text-muted">{projectMeta(next)}</span>
        </span>
        <Frame
          photo={next.cover}
          width={900}
          className="aspect-[4/3] lg:col-span-3 lg:col-start-10"
          imgClassName="transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
      </Link>
    </>
  );
}
