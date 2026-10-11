import type { Metadata } from "next";

import { ArticleArchive } from "@/components/ArticleArchive";
import { POSTS } from "@/lib/content";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  title: "Blog",
  description: "Savjeti i inspiracija za adaptacije i završne radove — prije nego što krenete s radovima.",
  path: "/blog/",
});

export default function BlogPage() {
  return (
    <ArticleArchive
      title={
        <>
          Savjeti i <em>inspiracija.</em>
        </>
      }
      text="Kratko i korisno — prije nego što krenete s radovima."
      items={POSTS}
      basePath="/blog"
    />
  );
}
