import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleView } from "@/components/ArticleView";
import { POSTS } from "@/lib/content";
import { buildSeoMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return buildSeoMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}/`,
    image: post.cover.src,
    imageAlt: post.cover.alt,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <ArticleView
      article={post}
      section="Blog"
      sectionHref="/blog"
      basePath="/blog"
      more={POSTS.filter((p) => p.slug !== slug).slice(0, 3)}
    />
  );
}
