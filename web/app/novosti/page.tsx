import type { Metadata } from "next";
import type { CSSProperties } from "react";

import { CtaRow } from "@/components/CtaRow";
import { NewsIndex } from "@/components/NewsIndex";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  title: "Novosti",
  description: "Obavijesti, završeni projekti i novosti iz rada Žarko Sunca.",
  path: "/novosti/",
});

export default function NewsPage() {
  return (
    <>
      {/* One centred column, half the page wide on large screens. */}
      <section className="px-page pb-28 pt-36 lg:pt-44">
        <div className="mx-auto w-full max-w-2xl lg:w-1/2 lg:max-w-none">
          <p data-reveal className="label dot text-muted">
            Novosti
          </p>
          <h1 data-reveal style={{ "--rd": "80ms" } as CSSProperties} className="heading mt-6 text-[clamp(1.875rem,3vw,2.75rem)]">
            Iz <em>radionice.</em>
          </h1>
          <p data-reveal style={{ "--rd": "160ms" } as CSSProperties} className="mt-4 text-muted">
            Obavijesti, završeni projekti i novosti iz našeg rada.
          </p>
          <div className="mt-12">
            <NewsIndex />
          </div>
        </div>
      </section>
      <CtaRow />
    </>
  );
}
