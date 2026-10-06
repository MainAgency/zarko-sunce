import Link from "next/link";
import type { ReactNode } from "react";

import { CONTACT, NAV, SERVICES } from "@/lib/content";

import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="px-page bg-ink pb-8 pt-20 text-paper">
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light className="text-[32px]" />
          <p className="mt-6 max-w-xs text-sm text-white/50">Adaptacije stanova i završni radovi — od pregradnog zida do ključa u ruke.</p>
        </div>
        <FooterList title="Stranica" className="lg:col-span-2 lg:col-start-6">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="link">{n.label}</Link>
            </li>
          ))}
        </FooterList>
        <FooterList title="Usluge" className="lg:col-span-2">
          {SERVICES.map((s) => (
            <li key={s.id}>
              <Link href={`/#usluga-${s.id}`} className="link">{s.title}</Link>
            </li>
          ))}
        </FooterList>
        <FooterList title="Kontakt" className="lg:col-span-3 lg:col-start-10">
          <li><a href={CONTACT.phoneHref} className="link">{CONTACT.phone}</a></li>
          <li><a href={`mailto:${CONTACT.email}`} className="link">{CONTACT.email}</a></li>
          <li><a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="link">WhatsApp</a></li>
          <li className="text-white/50">{CONTACT.hours}</li>
        </FooterList>
      </div>

      <div className="label mt-20 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-6 text-white/40">
        <span>© {new Date().getFullYear()} Žarko Sunce d.o.o.</span>
        <span>Adaptacije · Knauf · Glet · Stropovi</span>
      </div>
    </footer>
  );
}

function FooterList({ title, className = "", children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <p className="label text-white/40">{title}</p>
      <ul className="mt-5 space-y-2 text-sm">{children}</ul>
    </div>
  );
}
