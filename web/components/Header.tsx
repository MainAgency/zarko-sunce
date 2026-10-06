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

/** 3×3 dot grid; opening the menu drops the four edge dots, leaving an X. */
function DotsIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="grid grid-cols-3 gap-[3px]">
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className={`h-[3px] w-[3px] bg-current transition-[opacity,transform] duration-300 ${
            open && i % 2 === 1 ? "scale-0 opacity-0" : ""
          }`}
          style={{ transitionDelay: `${i * 25}ms` }}
        />
      ))}
    </span>
  );
}

/**
 * Centred, floating header: a logo tile and a menu tile side by side; the menu
 * drops down underneath them at the same width. Same layout on every screen.
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
            className={`${tile} label flex h-14 w-40 items-center justify-between px-6 hover:bg-tile/70`}
          >
            {open ? "Zatvori" : "Meni"}
            <DotsIcon open={open} />
          </button>
        </div>

        <nav
          id="izbornik"
          aria-label="Glavna navigacija"
          className={`${tile} absolute inset-x-0 top-full mt-1 transition-[opacity,transform,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <ul className="py-4 text-center">
            {NAV.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  onClick={close}
                  className={`label block py-2.5 transition-[opacity,transform,color] duration-500 hover:text-muted ${
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
