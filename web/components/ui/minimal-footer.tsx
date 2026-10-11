import Link from "next/link";
import type { ReactNode } from "react";

import { CONTACT, NAV, SERVICES } from "@/lib/content";

import { Logo } from "../Logo";
import { FacebookIcon, InstagramIcon } from "../SocialIcons";

/*
 * Adapted from the 21st.dev "minimal footer" for this site:
 *  - Croatian copy; the links come from the site content, not placeholders;
 *  - theme tokens instead of shadcn's, so it follows the light/dark switch;
 *  - square corners (the brief allows no radius);
 *  - the glow in the corner is the foreground colour mixed into the page.
 */

const SOCIAL = [
  { href: CONTACT.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: CONTACT.facebook, label: "Facebook", Icon: FacebookIcon },
];

export function MinimalFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line">
      <div className="relative mx-auto max-w-6xl bg-[radial-gradient(35%_80%_at_30%_0%,color-mix(in_srgb,var(--foreground)_9%,transparent),transparent)] md:border-x md:border-line">
        <div className="grid grid-cols-6 gap-x-6 gap-y-10 px-6 pb-14 pt-16 md:px-10">
          <div className="col-span-6 flex flex-col gap-6 md:col-span-3">
            <Link href="/" aria-label="Žarko Sunce — početna" className="w-max">
              <Logo className="text-[42px]" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted text-balance">
              Adaptacije stanova i završni radovi — od pregradnog zida do ključa u ruke.
            </p>
            <ul className="-ml-1 flex gap-3">
              {SOCIAL.map(({ href, label, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="grid size-10 place-content-center text-muted transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-foreground"
                  >
                    <Icon className="size-6" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <FooterList title="Stranica">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link">
                  {n.label}
                </Link>
              </li>
            ))}
          </FooterList>
          <FooterList title="Usluge">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <Link href={`/#usluga-${s.id}`} className="link">
                  {s.title}
                </Link>
              </li>
            ))}
          </FooterList>
          <FooterList title="Kontakt">
            <li>
              <a href={CONTACT.phoneHref} className="link">
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="link">
                {CONTACT.email}
              </a>
            </li>
          </FooterList>
        </div>

        {/* Extra room at the bottom on phones so the floating corner button doesn't cover the line. */}
        <div className="label flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-line px-6 pb-16 pt-5 text-muted sm:pb-5 md:px-10">
          <span>© {year} Žarko Sunce d.o.o.</span>
          <a
            href="https://www.main.hr"
            target="_blank"
            rel="noopener noreferrer"
            className="link transition-colors duration-300 hover:text-foreground"
          >
            Main
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="col-span-3 md:col-span-1">
      <p className="label text-muted">{title}</p>
      <ul className="mt-5 space-y-2 text-sm">{children}</ul>
    </div>
  );
}
