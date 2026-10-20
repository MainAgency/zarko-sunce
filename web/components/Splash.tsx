"use client";
import { useEffect, useState } from "react";

import { Logo } from "./Logo";

/** Total time on screen, including the fade-out; globals.css keys its timings off this. */
const SPLASH_MS = 2200;

/**
 * Opening screen on every page load, reloads included: the wordmark fades in,
 * its yellow bar fills from left to right, then the whole thing fades away and
 * the page is there. It is server-rendered so it is on screen from the very
 * first paint; the inline script in layout.tsx marks <html data-splash="on">
 * before paint. RevealObserver waits for the `splash:done` event so the scroll
 * reveals start once the page is visible.
 */
export function Splash() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    // The page stays put under the overlay. Touch is held off by touch-action
    // in globals.css; this covers the mouse wheel and touchpads.
    const block = (e: Event) => e.preventDefault();
    const finish = () => {
      window.removeEventListener("wheel", block);
      delete root.dataset.splash;
      setDone(true);
      window.dispatchEvent(new Event("splash:done"));
    };

    // No mark means this effect already finished once (a re-run under React
    // strict mode): nothing left to show.
    if (root.dataset.splash !== "on") {
      finish();
      return;
    }

    window.addEventListener("wheel", block, { passive: false });
    const timer = setTimeout(finish, SPLASH_MS);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", block);
    };
  }, []);

  if (done) return null;

  return (
    <div className="zs-splash" aria-hidden="true">
      <Logo
        className="zs-splash__logo text-[clamp(96px,22vw,180px)]"
        barClassName="zs-splash__bar"
      />
    </div>
  );
}
