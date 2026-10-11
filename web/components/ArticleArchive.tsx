import type { CSSProperties, ReactNode } from "react";

import type { Article } from "@/lib/content";

import { NewsList } from "./NewsList";

type ArticleArchiveProps = {
  title: ReactNode;
  text: string;
  items: Article[];
  /** Route prefix of the articles, e.g. "/blog". */
  basePath: string;
};

/** The /novosti and /blog archives: one centred column, newest first, no filters. */
export function ArticleArchive({ title, text, items, basePath }: ArticleArchiveProps) {
  const newestFirst = [...items].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <section className="px-page pb-28 pt-36 lg:pt-44">
      {/* One centred column, about two thirds of the page on large screens. */}
      <div className="mx-auto w-full max-w-3xl lg:w-2/3 lg:max-w-5xl">
        <h1 data-reveal className="heading text-[clamp(3rem,6.5vw,6rem)]">
          {title}
        </h1>
        <p data-reveal style={{ "--rd": "160ms" } as CSSProperties} className="mt-5 max-w-xl text-lg text-muted">
          {text}
        </p>
        <div className="mt-14">
          <NewsList items={newestFirst} basePath={basePath} />
        </div>
      </div>
    </section>
  );
}
