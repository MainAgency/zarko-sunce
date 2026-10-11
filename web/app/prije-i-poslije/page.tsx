import type { Metadata } from "next";

import { BeforeAfterIndex, type Comparison } from "@/components/BeforeAfterIndex";
import { PROJECTS, projectMeta } from "@/lib/content";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  title: "Prije ↔ poslije",
  description:
    "Isti prostori prije i nakon radova — povucite crtu i usporedite adaptacije i završne radove Žarko Sunce.",
  path: "/prije-i-poslije/",
});

/** Every before/after pair from every project, in project order. */
const COMPARISONS: Comparison[] = PROJECTS.flatMap((project) =>
  (project.comparisons ?? []).map((c, i) => ({
    id: `${project.slug}-${i}`,
    before: c.before,
    after: c.after,
    project: { slug: project.slug, title: project.title, meta: projectMeta(project) },
  })),
);

export default function BeforeAfterPage() {
  return <BeforeAfterIndex comparisons={COMPARISONS} />;
}
