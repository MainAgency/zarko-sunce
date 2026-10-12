"use client";

import { CornerDownRight, Sparkle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { CONTACT, NAV } from "@/lib/content";

import { Logo } from "./Logo";
import { FacebookIcon, InstagramIcon } from "./SocialIcons";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Frosted-glass square tile — the header is two of these, the menu card a
 * third. Translucent enough that whatever scrolls underneath shows through,
 * heavily blurred, in the theme's own tint.
 */
// transform-gpu gives each frosted tile its own compositing layer: WebKit on real
// iPhones otherwise lets backdrop-filter children of a fixed header lag behind
// the scroll and visibly slide before snapping back.
const tile = "bg-tile/45 backdrop-blur-2xl backdrop-saturate-150 transform-gpu transition-colors duration-300";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Menu links: the contact page is left out — the quote button at the foot of the menu goes there. */
const MENU = NAV.filter((n) => n.href !== "/kontakt");

/** The small two-column block under the links: contact on the left, social icons on the right. */
const CONTACTS = [
  { href: CONTACT.phoneHref, label: CONTACT.phone },
  { href: `mailto:${CONTACT.email}`, label: CONTACT.email },
];
const SOCIAL = [
  { href: CONTACT.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: CONTACT.facebook, label: "Facebook", Icon: FacebookIcon },
];

/* Lines inside the card rise in order once the card has started unfolding (ms). */
const LINE_START = 220;
const LINE_STEP = 35;

/**
 * Centred, floating header: a logo tile and a square menu tile side by side.
 * The menu is a frosted card that unfolds downward from under the tiles (the
 * lines fold into an X, the page dims): the big
 * links sit on the left with a marker on the current page, contact and social
 * links follow in two small columns, the quote button and the theme switch
 * close the card. The page dims behind it.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  // The current page gets a marker; the home sections go by the URL hash.
  useEffect(() => {
    const read = () => setHash(window.location.hash);
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [pathname]);
  // Routes render with a trailing slash, so compare without it.
  const current = pathname.replace(/\/+$/, "") || "/";
  const isActive = (href: string) => {
    const [path, frag] = href.split("#");
    return frag ? current === path && hash === `#${frag}` : current === path;
  };

  // Escape or a click anywhere outside closes the menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const tab = open ? 0 : -1;
  /** Stagger for the card's masked lines, top to bottom, after the card has unfolded. */
  const line = (i: number): CSSProperties =>
    ({ "--d": open ? `${LINE_START + i * LINE_STEP}ms` : "0ms" }) as CSSProperties;
  // Lines reveal in order: title, links, the two small columns, then the button row.
  const subStart = 1 + MENU.length;
  const buttonIndex = subStart + CONTACTS.length;

  return (
    <>
      {/* Dims the page while the menu is open; any click on it closes the menu. */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-500 ${EASE} ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex transform-gpu justify-center px-4">
        <div ref={ref} className="pointer-events-auto relative text-foreground">
          <div className="flex">
            <Link
              href="/"
              aria-label="Žarko Sunce — početna"
              onClick={close}
              className={`${tile} mr-1 flex h-16 items-center px-7 hover:bg-tile/70`}
            >
              <Logo className="text-[36px]" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="izbornik"
              aria-label={open ? "Zatvori izbornik" : "Otvori izbornik"}
              className={`${tile} zs-burger grid h-16 w-16 place-content-center hover:bg-tile/70${open ? " is-open" : ""}`}
            >
              <span className="zs-burger__line zs-burger__line--top" />
              <span className="zs-burger__line zs-burger__line--middle" />
              <span className="zs-burger__line zs-burger__line--bottom" />
            </button>
          </div>

          <nav
            id="izbornik"
            aria-label="Glavna navigacija"
            className={`zs-menu absolute left-1/2 top-full mt-1 w-[min(calc(100vw-2rem),26rem)] -translate-x-1/2 transform-gpu bg-tile/70 p-[clamp(1.75rem,3.75vw,3.25rem)] text-foreground backdrop-blur-2xl backdrop-saturate-150${
              open ? " is-open" : ""
            }`}
          >
            <p className="zs-menu__mask label mb-4 text-[10px] text-muted">
              <span className="zs-menu__line" style={line(0)}>
                Izbornik
              </span>
            </p>

            <ul className="space-y-2.5 sm:space-y-3">
              {MENU.map((item, i) => (
                <li
                  key={item.href}
                  className={`zs-menu__item zs-menu__mask relative${isActive(item.href) ? " is-active" : ""}`}
                >
                  <span className="zs-menu__line" style={line(1 + i)}>
                    {/* Four-point star against the page you are on (after fluid.glass's section marks). */}
                    {isActive(item.href) && (
                      <Sparkle
                        aria-hidden="true"
                        className="absolute -left-4 top-1/2 size-2.5 -translate-y-1/2 fill-current text-yellow"
                      />
                    )}
                    <Link
                      href={item.href}
                      tabIndex={tab}
                      onClick={close}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="zs-menu__link w-fit text-[clamp(1.875rem,2.5vw,2.375rem)] font-light leading-[1.15] tracking-[-0.02em]"
                    >
                      <span className="zs-menu__roll">{item.label}</span>
                      <span className="zs-menu__roll" aria-hidden="true">
                        {item.label}
                      </span>
                    </Link>
                  </span>
                </li>
              ))}
            </ul>

            <div className="my-7 grid grid-cols-2 gap-x-4 text-[12px] leading-[1.3] text-muted">
              <ul>
                {CONTACTS.map((item, i) => (
                  <li key={item.href} className="zs-menu__mask">
                    <span className="zs-menu__line" style={line(subStart + i)}>
                      <a
                        href={item.href}
                        tabIndex={tab}
                        className="block py-0.5 transition-colors duration-300 hover:text-foreground"
                      >
                        {item.label}
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
              <ul className="zs-menu__mask flex items-start justify-end gap-4">
                {SOCIAL.map(({ href, label, Icon }, i) => (
                  <li key={href} className="zs-menu__line" style={line(subStart + i)}>
                    <a
                      href={href}
                      tabIndex={tab}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="block py-0.5 transition-colors duration-300 hover:text-foreground"
                    >
                      <Icon className="size-6" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="zs-menu__mask">
              <span className="zs-menu__line" style={line(buttonIndex)}>
                <span className="flex items-stretch gap-1">
                  <Link
                    href="/kontakt"
                    tabIndex={tab}
                    onClick={close}
                    className="label flex h-11 flex-1 items-center justify-center gap-2.5 bg-ink text-[10px] text-paper transition-colors duration-300 hover:bg-yellow hover:text-black"
                  >
                    <CornerDownRight aria-hidden="true" strokeWidth={1.5} className="size-3.5" />
                    Zatražite ponudu
                  </Link>
                  <ThemeToggle tabIndex={tab} className="h-11 w-11" />
                </span>
              </span>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
