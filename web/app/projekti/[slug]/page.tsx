import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BeforeAfter } from "@/components/BeforeAfter";
import { Frame } from "@/components/Frame";
import { ProjectGallery } from "@/components/ProjectGallery";
import { PROJECTS, SERVICES, photoUrl, projectMeta } from "@/lib/content";
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
  const nextIndex = (index + 1) % PROJECTS.length;
  const next = PROJECTS[nextIndex];
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

      {/* Next project: its cover full width, the title large over it. On hover the
          photo eases in, the arrow square fills yellow, and the bar along the bottom
          shows where the next project sits in the list. */}
      <Link
        href={`/projekti/${next.slug}`}
        className="group relative block h-[72svh] min-h-[28rem] overflow-hidden bg-black text-white"
      >
        <Image
          src={photoUrl(next.cover, 2000)}
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover opacity-80 transition-[transform,opacity] duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />

        <div className="px-page relative flex h-full flex-col justify-between py-10 lg:py-14">
          <div className="flex items-baseline justify-between gap-6 text-white/75">
            <span className="text-lg">Sljedeći projekt</span>
            <span className="tabular-nums">
              {String(nextIndex + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-end justify-between gap-8">
            <div className="min-w-0">
              <h2 className="heading text-[clamp(2.5rem,7vw,6.5rem)]">{next.title}</h2>
              <p className="mt-5 text-white/70 sm:text-lg">{projectMeta(next)}</p>
            </div>
            <span
              aria-hidden="true"
              className="relative grid size-16 shrink-0 place-content-center overflow-hidden border border-white/40 transition-colors duration-500 group-hover:border-yellow group-hover:bg-yellow group-hover:text-black sm:size-24"
            >
              <ArrowRight
                strokeWidth={1.25}
                className="size-7 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-16 sm:size-9"
              />
              <ArrowRight
                strokeWidth={1.25}
                className="absolute inset-0 m-auto size-7 -translate-x-16 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 sm:size-9"
              />
            </span>
          </div>
        </div>

        {/* Position of the next project among all of them. */}
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
          <span
            className="absolute inset-y-0 left-0 bg-yellow"
            style={{ width: `${((nextIndex + 1) / PROJECTS.length) * 100}%` }}
          />
        </span>
      </Link>
    </>
  );
}
