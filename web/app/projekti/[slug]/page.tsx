import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CtaRow } from "@/components/CtaRow";
import { Frame } from "@/components/Frame";
import { PROJECTS, SERVICES } from "@/lib/content";
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

  const facts = [
    ["Kategorija", project.category],
    ["Površina", project.area],
    ["Trajanje", project.duration],
    ["Usluge", services.map((s) => s.title).join(", ")],
  ];

  return (
    <>
      <article className="px-page pb-28 pt-36 lg:pt-44">
        <div className="grid gap-8 lg:grid-cols-12">
          <p data-reveal className="label text-muted lg:col-span-3 lg:pt-3">
            <Link href="/#projekti" className="link text-ink">
              ← Projekti
            </Link>
          </p>
          <div className="lg:col-span-8 lg:col-start-5">
            <p data-reveal className="label text-muted">
              Projekt 0{index + 1}
            </p>
            <h1 data-reveal className="heading mt-6 text-[clamp(2rem,4vw,3.5rem)]">
              {project.title}
            </h1>
            <p data-reveal className="mt-6 max-w-xl text-lg text-muted">
              {project.summary}
            </p>
          </div>
        </div>

        <Frame photo={project.cover} width={2200} preload className="mt-16 aspect-[16/10] sm:aspect-[16/8]" />

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <dl data-reveal className="border-t border-line lg:col-span-3">
            {facts.map(([label, value]) => (
              <div key={label} className="border-b border-line py-4">
                <dt className="label text-muted">{label}</dt>
                <dd className="mt-1">{value}</dd>
              </div>
            ))}
          </dl>
          <div data-reveal className="space-y-6 text-[17px] leading-relaxed text-ink/80 lg:col-span-7 lg:col-start-5">
            {project.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>

        {project.gallery.length > 1 && (
          <div className="mt-20 grid gap-6 sm:grid-cols-2">
            {project.gallery.slice(1).map((photo, i) => (
              <Frame key={photo.src} photo={photo} width={1400} delay={i * 120} className="aspect-[4/5]" />
            ))}
          </div>
        )}
      </article>

      <Link href={`/projekti/${next.slug}`} className="group px-page grid gap-8 border-t border-line py-20 lg:grid-cols-12">
        <span className="label text-muted lg:col-span-3 lg:pt-3">Sljedeći projekt</span>
        <span className="lg:col-span-5 lg:col-start-5">
          <span className="heading block text-[clamp(1.875rem,3.4vw,3rem)]">
            <span className="link pb-1">{next.title}</span> →
          </span>
          <span className="label mt-4 block text-muted">
            {next.category} · {next.area}
          </span>
        </span>
        <Frame
          photo={next.cover}
          width={900}
          className="aspect-[4/3] lg:col-span-3 lg:col-start-10"
          imgClassName="transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
      </Link>

      <CtaRow />
    </>
  );
}
