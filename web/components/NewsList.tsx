import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { formatDate, photoUrl, type Article } from "@/lib/content";

/** News archive rows for a narrow column: date and category, title, excerpt — thumbnail on the right. */
export function NewsList({ items }: { items: Article[] }) {
  return (
    <ul className="border-t border-ink">
      {items.map((item, i) => (
        <li
          key={item.slug}
          data-reveal
          style={{ "--rd": `${i * 80}ms` } as CSSProperties}
          className="border-b border-line"
        >
          <Link
            href={`/novosti/${item.slug}`}
            className="group relative grid grid-cols-[1fr_6.5rem] items-center gap-5 py-6 sm:grid-cols-[1fr_9rem] sm:gap-8 sm:py-7"
          >
            {/* Yellow marker that grows down the left edge on hover */}
            <span
              aria-hidden="true"
              className="absolute -left-px top-0 h-full w-[3px] origin-top scale-y-0 bg-yellow transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
            />

            <div className="transition-[padding] duration-500 group-hover:pl-4">
              <p className="label text-muted">
                <time dateTime={item.date}>{formatDate(item.date)}</time> · {item.category}
              </p>
              <h2 className="heading mt-3 text-[clamp(1.25rem,1.8vw,1.625rem)]">
                <span className="link pb-1">{item.title}</span>
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{item.excerpt}</p>
              <span className="label mt-4 inline-flex items-center gap-3">
                Pročitaj
                <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
              </span>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
              <Image
                src={photoUrl(item.cover, 400)}
                alt={item.cover.alt}
                fill
                sizes="400px"
                className="object-cover grayscale-[35%] transition-[transform,filter] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
