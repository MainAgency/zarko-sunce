import Link from "next/link";
import type { CSSProperties } from "react";

import { formatDate, type Article } from "@/lib/content";

import { Frame } from "./Frame";
import { ReadMore } from "./ReadMore";

const zoom = "transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]";

/** A row of news cards: photo, then date, title and description. Colours follow the theme. */
export function NewsMagazine({ items }: { items: Article[] }) {
  const soft = "text-muted";

  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <Link key={item.slug} href={`/novosti/${item.slug}`} className="group block">
          <Frame photo={item.cover} width={1000} delay={i * 120} className="aspect-[4/3]" imgClassName={zoom} />
          {/* Hairline under the photo that turns yellow on hover */}
          <span aria-hidden="true" className="relative mt-5 block h-px bg-line">
            <span className="absolute inset-0 origin-left scale-x-0 bg-yellow transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
          </span>
          <div data-reveal style={{ "--rd": `${i * 120 + 100}ms` } as CSSProperties}>
            <p className={`label mt-4 ${soft}`}>
              <time dateTime={item.date}>{formatDate(item.date)}</time>
            </p>
            <h3 className="mt-3 text-xl leading-snug tracking-tight">
              <span className="link pb-0.5">{item.title}</span>
            </h3>
            <p className={`mt-2 line-clamp-2 text-sm ${soft}`}>{item.excerpt}</p>
            <ReadMore />
          </div>
        </Link>
      ))}
    </div>
  );
}
