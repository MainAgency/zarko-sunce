import Link from "next/link";
import type { CSSProperties } from "react";

import { ABOUT, PHOTOS } from "@/lib/content";

import { Frame } from "./Frame";

export function About() {
  return (
    <section id="o-nama" className="px-page bg-paper py-28 lg:py-40">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="relative lg:col-span-6">
          <Frame photo={PHOTOS.stair} width={1400} className="aspect-[4/5] w-[82%]" />
          <Frame
            photo={PHOTOS.vases}
            width={800}
            delay={250}
            className="absolute! bottom-[-6%] right-0 aspect-square w-[40%] border-8 border-paper"
          />
        </div>

        <div className="self-center lg:col-span-5 lg:col-start-8">
          <h2 data-reveal className="heading text-[clamp(1.875rem,3.2vw,2.75rem)]">
            Gradimo prostor u kojem se <em>dobro živi.</em>
          </h2>
          <div data-reveal style={{ "--rd": "160ms" } as CSSProperties} className="mt-8 space-y-4 text-muted">
            {ABOUT.text.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <ul data-reveal style={{ "--rd": "240ms" } as CSSProperties} className="mt-10 border-t border-line">
            {ABOUT.values.map((value, i) => (
              <li key={value} className="flex items-baseline gap-6 border-b border-line py-3">
                <span className="label text-muted">0{i + 1}</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
          <Link href="/kontakt" data-reveal className="label link mt-10 inline-block pb-1">
            Upoznajmo se →
          </Link>
        </div>
      </div>
    </section>
  );
}
