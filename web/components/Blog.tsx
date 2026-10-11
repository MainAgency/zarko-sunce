import Link from "next/link";
import type { CSSProperties } from "react";

import { POSTS, formatDate } from "@/lib/content";

import { Frame } from "./Frame";
import { ReadMore } from "./ReadMore";
import { SectionIntro } from "./SectionIntro";

/** Posts in one row on desktop, a swipeable strip on phones and tablets. */
export function Blog() {
  return (
    <section id="blog" className="bg-paper py-28 lg:py-40">
      {/* Title on the left, the link to every post on the right. */}
      <div className="px-page flex flex-wrap items-end justify-between gap-6">
        <SectionIntro
          title={
            <>
              Savjeti i <em>inspiracija.</em>
            </>
          }
          text="Kratko i korisno — prije nego što krenete s radovima."
        />
        <Link href="/blog" className="label link pb-1">
          Svi članci →
        </Link>
      </div>

      <ul className="px-page mt-16 flex snap-x snap-mandatory scroll-pl-6 gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] sm:scroll-pl-10 lg:mt-24 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
        {POSTS.map((post, i) => (
          <li key={post.slug} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-auto">
            <Link href={`/blog/${post.slug}`} className="group block">
              <Frame
                photo={post.cover}
                width={900}
                delay={i * 90}
                className="aspect-[4/5]"
                imgClassName="transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              <div data-reveal style={{ "--rd": `${i * 90}ms` } as CSSProperties}>
                <p className="label mt-5 text-muted">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </p>
                <h3 className="mt-2 text-lg leading-snug tracking-tight">
                  <span className="link pb-0.5">{post.title}</span>
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
                <ReadMore />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
