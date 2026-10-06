import Link from "next/link";
import type { CSSProperties } from "react";

import { formatDate, type Article } from "@/lib/content";

import { Frame } from "./Frame";

const zoom = "transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]";

type NewsMagazineProps = {
  items: Article[];
  /** Light type for the dark portal field. */
  dark?: boolean;
};

/** A row of news cards with the copy under the photo. */
export function NewsMagazine({ items, dark = false }: NewsMagazineProps) {
  const soft = dark ? "text-white/60" : "text-muted";

  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <Link key={item.slug} href={`/novosti/${item.slug}`} className="group block">
          <Frame photo={item.cover} width={1000} delay={i * 120} className="aspect-[4/3]" imgClassName={zoom} />
          {/* Hairline under the photo that turns yellow on hover */}
          <span aria-hidden="true" className={`relative mt-5 block h-px ${dark ? "bg-white/15" : "bg-line"}`}>
            <span className="absolute inset-0 origin-left scale-x-0 bg-yellow transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
          </span>
          <div data-reveal style={{ "--rd": `${i * 120 + 100}ms` } as CSSProperties}>
            <p className={`label mt-4 ${soft}`}>
              {formatDate(item.date)} · {item.category}
            </p>
            <h3 className="mt-3 text-xl leading-snug tracking-tight">
              <span className="link pb-0.5">{item.title}</span>
            </h3>
            <p className={`mt-2 line-clamp-2 text-sm ${soft}`}>{item.excerpt}</p>
            <span className="label mt-5 inline-flex items-center gap-3">
              Pročitaj
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
