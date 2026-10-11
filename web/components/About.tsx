import type { CSSProperties } from "react";

import { ABOUT } from "@/lib/content";

import { Frame } from "./Frame";
import { PartnersMarquee } from "./PartnersMarquee";

export function About() {
  return (
    <section id="o-nama" className="px-page bg-paper py-28 lg:py-40">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="relative lg:col-span-6">
          <Frame photo={ABOUT.photo} width={1400} className="aspect-[4/5] w-[82%]" />
          <Frame
            photo={ABOUT.detail}
            width={800}
            delay={250}
            className="absolute! bottom-[-6%] right-0 aspect-square w-[40%] border-8 border-paper"
            imgClassName="object-[center_58%]"
          />
        </div>

        {/* Text at the top; on desktop the partners sit at the bottom of the column,
            level with the small photo on the left. */}
        <div className="flex min-w-0 flex-col lg:col-span-5 lg:col-start-8 lg:justify-between lg:py-[8%]">
          <div>
            <h2 data-reveal className="heading text-[clamp(2.25rem,4vw,3.5rem)]">
              Svaki detalj <em>na svom mjestu.</em>
            </h2>
            <div data-reveal style={{ "--rd": "160ms" } as CSSProperties} className="mt-8 space-y-4 text-muted">
              {ABOUT.text.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>

          <div className="mt-16 lg:mt-12">
            <h3 data-reveal className="heading text-[clamp(1.5rem,2.2vw,2rem)]">
              Partneri
            </h3>
            <div data-reveal style={{ "--rd": "120ms" } as CSSProperties} className="mt-6 border-y border-line py-5">
              <PartnersMarquee />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
