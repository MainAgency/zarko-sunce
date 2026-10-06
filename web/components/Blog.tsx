import Link from "next/link";
import type { CSSProperties } from "react";

import { POSTS, formatDate } from "@/lib/content";

import { Frame } from "./Frame";
import { SectionIntro } from "./SectionIntro";

export function Blog() {
  return (
    <section id="blog" className="px-page bg-paper py-28 lg:py-40">
      <SectionIntro
        label="Blog"
        title={
          <>
            Savjeti i <em>inspiracija.</em>
          </>
        }
        text="Kratko i korisno — prije nego što krenete s radovima."
      />

      <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
        {POSTS.map((post, i) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <Frame
              photo={post.cover}
              width={900}
              delay={i * 90}
              className="aspect-[4/5]"
              imgClassName="transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            <div data-reveal style={{ "--rd": `${i * 90}ms` } as CSSProperties}>
              <p className="label mt-5 text-muted">
                {post.category} · {post.readingTime}
              </p>
              <h3 className="mt-2 text-lg leading-snug tracking-tight">
                <span className="link pb-0.5">{post.title}</span>
              </h3>
              <p className="label mt-3 text-muted">{formatDate(post.date)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
