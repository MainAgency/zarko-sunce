import type { Metadata } from "next";

import { ArticleArchive } from "@/components/ArticleArchive";
import { NEWS } from "@/lib/content";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  title: "Novosti",
  description: "Obavijesti, završeni projekti i novosti iz rada Žarko Sunca.",
  path: "/novosti/",
});

export default function NewsPage() {
  return (
    <ArticleArchive
      title="Novosti"
      text="Obavijesti, završeni projekti i novosti iz našeg rada."
      items={NEWS}
      basePath="/novosti"
    />
  );
}
