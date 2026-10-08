"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { CONTACT, NAV } from "@/lib/content";

import { Logo } from "./Logo";

/**
 * Frosted-glass square tile — the header is two of these, the menu panel a
 * third. Translucent enough that whatever scrolls underneath shows through,
 * heavily blurred.
 */
const tile = "bg-tile/45 backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300";

/**
 * Centred, floating header: a logo tile and a square menu tile side by side;
 * the menu drops down underneath them. Same layout on every screen.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

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

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div ref={ref} className="pointer-events-auto relative text-ink">
        <div className="flex gap-1">
          <Link
            href="/"
            aria-label="Žarko Sunce — početna"
            onClick={close}
            className={`${tile} flex h-14 items-center px-6 hover:bg-tile/70`}
          >
            <Logo className="text-[22px]" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="izbornik"
            aria-label={open ? "Zatvori izbornik" : "Otvori izbornik"}
            className={`${tile} zs-burger grid h-14 w-14 place-content-center hover:bg-tile/70${open ? " is-open" : ""}`}
          >
            <span className="zs-burger__line zs-burger__line--top" />
            <span className="zs-burger__line zs-burger__line--middle" />
            <span className="zs-burger__line zs-burger__line--bottom" />
          </button>
        </div>

        <nav
          id="izbornik"
          aria-label="Glavna navigacija"
          className={`${tile} absolute left-1/2 top-full mt-1 w-[max(100%,17rem)] -translate-x-1/2 transition-[opacity,translate,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
          }`}
        >
          {/* Links in the headings' voice: light sans, turning serif italic on hover. */}
          <ul className="py-5 text-center">
            {NAV.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  onClick={close}
                  className={`block py-1.5 text-[1.75rem] font-light leading-[1.15] tracking-[-0.015em] transition-[opacity,translate] duration-500 hover:font-serif hover:font-normal hover:italic hover:tracking-[-0.01em] focus-visible:font-serif focus-visible:font-normal focus-visible:italic ${
                    open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" } as CSSProperties}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-line p-4 text-center">
            <Link
              href="/kontakt"
              tabIndex={open ? 0 : -1}
              onClick={close}
              className="label flex h-11 items-center justify-center bg-ink text-paper transition-colors duration-300 hover:bg-yellow hover:text-ink"
            >
              Zatražite ponudu
            </Link>
            <a href={CONTACT.phoneHref} tabIndex={open ? 0 : -1} className="label mt-3 block text-muted transition-colors hover:text-ink">
              {CONTACT.phone}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
