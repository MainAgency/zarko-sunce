import { CONTACT, NEWS, PHOTOS, POSTS, PROJECTS, SERVICES, type Photo } from "@/lib/content";

/** How a slide enters over the one before it (see .slide[data-enter] in globals.css). */
export type HeroEnter = "wipe" | "circle" | "blinds" | "diagonal";

export type HeroSlide = {
  /** Section name, shown under its segment of the progress bar. */
  label: string;
  title: string;
  /** Second title line. */
  accent: string;
  text: string;
  photo: Photo;
  /** The section's own link, next to the quote button. */
  cta: { href: string; label: string };
  /** Before/after pair: the slide shows the two photos split by a sweeping line. */
  compare?: { before: Photo; after: Photo };
  enter: HeroEnter;
};

const latest = <T extends { date: string }>(items: T[]) => [...items].sort((a, b) => b.date.localeCompare(a.date))[0];
const news = latest(NEWS);
const post = latest(POSTS);
const comparison = PROJECTS.flatMap((p) => p.comparisons ?? [])[0];

/**
 * The hero is a tour of the whole site: one slide per section, each with its
 * own photo, line and link, and each entering with a different transition.
 * Built from the site content, so it follows new projects, news and posts.
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    label: "Usluge",
    title: "Od pregradnog zida",
    accent: "do ključa u ruke",
    text: SERVICES.map((s) => s.title).join(" · "),
    photo: PHOTOS.livingGrey,
    cta: { href: "/#usluge", label: "Pogledajte usluge" },
    enter: "wipe",
  },
  ...(comparison
    ? [
        {
          label: "Prije ↔ poslije",
          title: "Prije nas,",
          accent: "poslije nas",
          text: "Isti prostori prije i nakon radova — povucite crtu i usporedite.",
          photo: comparison.after,
          compare: comparison,
          cta: { href: "/prije-i-poslije", label: "Usporedite" },
          enter: "blinds" as const,
        },
      ]
    : []),
  {
    label: "O nama",
    title: "Svaki detalj",
    accent: "na svom mjestu",
    text: "Jedna ekipa od početka do kraja — bez gubljenja rokova između različitih majstora.",
    photo: PHOTOS.stair,
    cta: { href: "/#o-nama", label: "O nama" },
    enter: "diagonal",
  },
  {
    label: "Projekti",
    title: "Radovi koji",
    accent: "govore za nas",
    text: "Stanovi, poslovni prostori, ugostiteljstvo i novogradnja — od grubih radova do završnog sloja.",
    photo: PROJECTS[0].cover,
    cta: { href: "/#projekti", label: "Svi projekti" },
    enter: "circle",
  },
  ...(news
    ? [
        {
          label: "Novosti",
          title: "Novosti",
          accent: news.title,
          text: news.excerpt,
          photo: news.cover,
          cta: { href: `/novosti/${news.slug}`, label: "Pročitajte" },
          enter: "wipe" as const,
        },
      ]
    : []),
  ...(post
    ? [
        {
          label: "Blog",
          title: "Savjeti i",
          accent: "inspiracija",
          text: post.title,
          photo: post.cover,
          cta: { href: `/blog/${post.slug}`, label: "Pročitajte savjet" },
          enter: "circle" as const,
        },
      ]
    : []),
  {
    label: "Kontakt",
    title: "Radimo",
    accent: "zajedno",
    text: "Besplatan izlazak na teren i jasna ponuda, bez obveze.",
    photo: PHOTOS.kitchen,
    cta: { href: CONTACT.phoneHref, label: `Nazovite ${CONTACT.phone}` },
    enter: "blinds",
  },
];
