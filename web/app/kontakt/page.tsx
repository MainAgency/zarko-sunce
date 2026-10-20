import type { Metadata } from "next";

import { Contact } from "@/components/Contact";
import { SERVICES, type ServiceId } from "@/lib/content";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata({
  title: "Kontakt",
  description: "Pošaljite upit za adaptaciju ili završne radove u Splitu i okolici — dolazimo na besplatan izlazak na teren i šaljemo jasnu ponudu.",
  path: "/kontakt/",
});

type Props = { searchParams: Promise<{ usluga?: string | string[] }> };

/** ?usluga=gletanje (one or several) pre-ticks those services in the form; unknown ids are ignored. */
export default async function ContactPage({ searchParams }: Props) {
  const { usluga } = await searchParams;
  const requested = Array.isArray(usluga) ? usluga : usluga ? [usluga] : [];
  const initialServices = SERVICES.map((s) => s.id).filter((id): id is ServiceId => requested.includes(id));

  return <Contact initialServices={initialServices} />;
}
