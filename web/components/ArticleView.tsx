import Link from "next/link";

import { formatDate, type Article } from "@/lib/content";

import { CtaRow } from "./CtaRow";
import { Frame } from "./Frame";

type ArticleViewProps = {
  article: Article;
  /** Section name shown in the breadcrumb, e.g. "Blog". */
  section: string;
  /** Home-page anchor for the section, e.g. "/#blog". */
  sectionHref: string;
  /** Route prefix for the "more" cards, e.g. "/blog". */
  basePath: string;
  more: Article[];
};

/** Shared layout for blog posts and news items. */
export function ArticleView({ article, section, sectionHref, basePath, more }: ArticleViewProps) {
  return (
    <>
      <article className="px-page pb-28 pt-36 lg:pt-44">
        <div className="grid gap-8 lg:grid-cols-12">
          <p data-reveal className="label text-muted lg:col-span-3 lg:pt-3">
            <Link href={sectionHref} className="link text-ink">
              ← {section}
            </Link>
          </p>
          <div className="lg:col-span-8 lg:col-start-5">
            <p data-reveal className="label text-muted">
              {article.category} · {formatDate(article.date)} · {article.readingTime} čitanja
            </p>
            <h1 data-reveal className="heading mt-6 text-[clamp(2rem,4vw,3.5rem)]">
              {article.title}
            </h1>
            <p data-reveal className="mt-6 max-w-xl text-lg text-muted">
              {article.excerpt}
            </p>
          </div>
        </div>

        <Frame photo={article.cover} width={2200} preload className="mt-16 aspect-[16/10] sm:aspect-[16/8]" />

        <div className="mt-16 grid lg:grid-cols-12">
          <div className="space-y-6 text-[17px] leading-relaxed lg:col-span-7 lg:col-start-5">
            {article.body.map((block, i) =>
              block.type === "h2" ? (
                <h2 key={i} className="heading pt-6 text-2xl">
                  {block.text}
                </h2>
              ) : (
                <p key={i} className="text-ink/80">
                  {block.text}
                </p>
              ),
            )}
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="px-page border-t border-line bg-paper py-24">
          <p className="label dot text-muted">Još iz rubrike {section}</p>
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((item) => (
              <Link key={item.slug} href={`${basePath}/${item.slug}`} className="group block">
                <Frame
                  photo={item.cover}
                  width={1000}
                  className="aspect-[4/3]"
                  imgClassName="transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                <p className="label mt-5 text-muted">{formatDate(item.date)}</p>
                <h3 className="mt-2 text-lg leading-snug tracking-tight">
                  <span className="link pb-0.5">{item.title}</span>
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CtaRow />
    </>
  );
}
