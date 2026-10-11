"use client";

import { Moon, Sun } from "lucide-react";

const THEME_COLOR = { light: "#f3f2ee", dark: "#151514" } as const;

/**
 * Light / dark switch. The theme lives on <html data-theme> (set before paint
 * by the inline script in layout.tsx) and in localStorage; light is the default.
 * No React state: the icons swap through the `dark:` variant, so the server
 * and client markup match whatever theme the visitor saved.
 */
export function ThemeToggle({ tabIndex, className = "" }: { tabIndex?: number; className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[next]);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode: the choice just lasts the visit */
    }
  };

  const icon = "absolute inset-0 size-4 transition-[opacity,transform] duration-500";
  return (
    <button
      type="button"
      onClick={toggle}
      tabIndex={tabIndex}
      aria-label="Promijeni svijetlu / tamnu temu"
      title="Svijetla / tamna tema"
      className={`grid place-content-center border border-line text-muted transition-colors duration-300 hover:border-ink hover:text-ink ${className}`}
    >
      {/* Both icons stay mounted so the swap is a small cross-fade, not a pop. */}
      <span className="relative block size-4">
        <Moon aria-hidden="true" strokeWidth={1.5} className={`${icon} rotate-0 opacity-100 dark:rotate-90 dark:opacity-0`} />
        <Sun aria-hidden="true" strokeWidth={1.5} className={`${icon} -rotate-90 opacity-0 dark:rotate-0 dark:opacity-100`} />
      </span>
    </button>
  );
}
