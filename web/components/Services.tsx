import Link from "next/link";
import type { CSSProperties } from "react";

import { SERVICES, type ServiceId } from "@/lib/content";

import { Frame } from "./Frame";
import { SectionIntro } from "./SectionIntro";

/** Display order: key-in-hand leads. */
const ORDER: ServiceId[] = ["kljuc-u-ruke", "adaptacije", "knauf", "gletanje", "stropovi"];
const CARDS = ORDER.map((id) => SERVICES.find((s) => s.id === id)).filter((s) => s !== undefined);

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Five plain service cards — one row on desktop, stacked on phones, two to a
 * row in between. Each card opens the contact page with that service already
 * ticked.
 */
export function Services() {
  return (
    <section id="usluge" className="py-28 lg:py-40">
      <div className="px-page">
        <SectionIntro
          label="Usluge"
          title={
            <>
              Pet usluga, <em>jedna ekipa.</em>
            </>
          }
          text="Od pregradnog zida do ključa u ruke. Odaberite uslugu i pošaljite upit — dolazimo na besplatan izlazak na teren."
        />
      </div>

      <ul className="px-page mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-5">
        {CARDS.map((service, i) => (
          <li key={service.id}>
            <Link id={`usluga-${service.id}`} href={`/kontakt?usluga=${service.id}`} className="group block">
              <Frame
                photo={service.photo}
                width={800}
                delay={i * 90}
                className="aspect-[3/4]"
                imgClassName="transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
              {/* Hairline that turns yellow on hover — and when a footer link targets the card */}
              <span aria-hidden="true" className="relative mt-4 block h-px bg-line">
                <span className="absolute inset-0 origin-left scale-x-0 bg-yellow transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 group-target:scale-x-100" />
              </span>
              <div data-reveal style={{ "--rd": `${i * 90 + 100}ms` } as CSSProperties}>
                <p className="label mt-4 flex items-center justify-between text-muted">
                  <span className="tabular-nums">{pad(i + 1)}</span>
                  <span aria-hidden="true" className="transition-[transform,color] duration-500 group-hover:-rotate-45 group-hover:text-ink">
                    →
                  </span>
                </p>
                <h3 className="heading mt-3 text-xl lg:text-[1.375rem]">{service.title}</h3>
                <p className="mt-2 text-sm text-muted">{service.short}</p>
                <span className="label link mt-5 inline-block pb-0.5">Zatražite ponudu</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
