import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { formatDate, photoUrl, type Article } from "@/lib/content";

import { ReadMore } from "./ReadMore";

/**
 * Archive rows for the /novosti and /blog column: date, title and description
 * with the thumbnail on the right. `basePath` is the article route.
 */
export function NewsList({ items, basePath = "/novosti" }: { items: Article[]; basePath?: string }) {
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
            href={`${basePath}/${item.slug}`}
            className="group relative grid grid-cols-[1fr_7.5rem] items-center gap-5 py-7 sm:grid-cols-[1fr_13rem] sm:gap-10 sm:py-9 lg:grid-cols-[1fr_16rem]"
          >
            {/* Yellow marker that grows down the left edge on hover */}
            <span
              aria-hidden="true"
              className="absolute -left-px top-0 h-full w-[3px] origin-top scale-y-0 bg-yellow transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
            />

            <div className="transition-[padding] duration-500 group-hover:pl-4">
              <p className="label text-muted">
                <time dateTime={item.date}>{formatDate(item.date)}</time>
              </p>
              <h2 className="heading mt-3 text-[clamp(1.375rem,2.4vw,2.25rem)]">
                <span className="link pb-1">{item.title}</span>
              </h2>
              <p className="mt-3 line-clamp-2 max-w-xl text-muted sm:text-[17px]">{item.excerpt}</p>
              <ReadMore />
            </div>

            <div className="relative aspect-[4/3] overflow-hidden bg-ink/5 sm:aspect-[5/4]">
              <Image
                src={photoUrl(item.cover, 700)}
                alt={item.cover.alt}
                fill
                sizes="(min-width: 1024px) 256px, (min-width: 640px) 208px, 120px"
                className="object-cover grayscale-[35%] transition-[transform,filter] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
