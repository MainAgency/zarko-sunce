import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleView } from "@/components/ArticleView";
import { NEWS } from "@/lib/content";
import { buildSeoMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return NEWS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = NEWS.find((p) => p.slug === slug);
  if (!item) return {};
  return buildSeoMetadata({
    title: item.title,
    description: item.excerpt,
    path: `/novosti/${item.slug}/`,
    image: item.cover.src,
    imageAlt: item.cover.alt,
    type: "article",
  });
}

export default async function NewsItemPage({ params }: Props) {
  const { slug } = await params;
  const item = NEWS.find((p) => p.slug === slug);
  if (!item) notFound();

  return (
    <ArticleView
      article={item}
      section="Novosti"
      sectionHref="/novosti"
      basePath="/novosti"
      more={NEWS.filter((p) => p.slug !== slug).slice(0, 3)}
    />
  );
}
