"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One IntersectionObserver for the whole page. Anything marked `data-reveal`
 * gets `data-revealed` the first time it scrolls into view; globals.css owns
 * the actual transitions. Elements that mount later (the Novosti portal waits
 * for its font) are picked up by a MutationObserver.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-reveal]").forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    let queued = 0;
    const scan = () => {
      queued = 0;
      document.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((el) => io.observe(el));
    };
    scan();

    const mo = new MutationObserver(() => {
      if (!queued) queued = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(queued);
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
