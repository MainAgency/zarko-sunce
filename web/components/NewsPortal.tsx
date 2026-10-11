"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { NEWS } from "@/lib/content";

import { NewsMagazine } from "./NewsMagazine";
import { SectionIntro } from "./SectionIntro";
import GlyphPortal from "./ui/glyph-portal";

const FAMILY = '"Archivo", Arial, sans-serif';

/** The home page shows only the latest few; the rest live on /novosti. */
const LATEST = [...NEWS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

/**
 * "NOVOSTI" set large with a photo showing through the letters; scrolling
 * flies the camera through a letter into the news list.
 *
 * GlyphPortal locks itself static for good if the font is still loading or the
 * first animation frame arrives late (a tab opened in the background), so it
 * only mounts once Archivo is in and the page is visible. Until then — and for
 * crawlers — the plain list renders.
 */
export function NewsPortal() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let fontDone = false;
    const tryMount = () => {
      if (!cancelled && fontDone && document.visibilityState === "visible") setReady(true);
    };
    const fontLoaded = () => {
      fontDone = true;
      tryMount();
    };
    document.fonts.load('900 100px "Archivo"', "NOVOSTI").then(fontLoaded, fontLoaded);
    const timeout = window.setTimeout(fontLoaded, 2500);
    document.addEventListener("visibilitychange", tryMount);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", tryMount);
    };
  }, []);

  if (!ready) {
    return (
      <section id="novosti" className="px-page py-28 lg:py-40">
        <SectionIntro title="Novosti" />
        <div className="mt-16">
          <NewsMagazine items={LATEST} />
        </div>
        <AllNewsLink />
      </section>
    );
  }

  return (
    <div id="novosti" data-zs-portal>
      <GlyphPortal
        word="NOVOSTI"
        fontFamily={FAMILY}
        fontWeight={900}
        interactive={false}
        scrollLength={2.2}
        maxWordWidth={520}
        enterLabel="Uđite u novosti"
        // Field and type follow the theme: a warm light field with dark type, or a
        // near-black one with light type (--news-field / --foreground, globals.css).
        style={{
          "--gp-paper": "var(--background)",
          "--gp-ink": "var(--foreground)",
          "--gp-field": "var(--news-field)",
          "--gp-foreground": "var(--foreground)",
        }}
        background={
          <>
            {/* Seen through the letters at first, then all around the news: a plain
                field with one soft drifting glow, a fine grid and a touch of grain. */}
            <div
              className="zs-news-bg absolute inset-0 overflow-hidden"
              style={{ transform: "scale(var(--gp-field-scale,1))" }}
            >
              <div className="zs-news-bg__shade absolute inset-0" />
              <div className="zs-news-bg__light absolute inset-0">
                <span className="zs-news-bg__blob zs-news-bg__blob--a" />
              </div>
              <div className="zs-news-bg__grid absolute inset-0" />
              <div className="zs-news-bg__grain absolute inset-0" />
            </div>
            <Blueprint />
          </>
        }
        front={
          <>
            <p data-zs-portal-support>Obavijesti i priče iz našeg rada.</p>
          </>
        }
      >
        {/* Drifts up into place as the news fades in. */}
        <div className="zs-news-content mx-auto w-full max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="heading text-[clamp(1.875rem,3.4vw,3rem)]">Novosti</h2>
            </div>
            <Link href="/novosti" className="label link pb-1">
              Sve novosti →
            </Link>
          </div>
          <div className="mt-12">
            <NewsMagazine items={LATEST} />
          </div>
        </div>
      </GlyphPortal>
    </div>
  );
}

/**
 * A folding-rule ruler down the right edge of the news, drawn in from the top
 * as the news come in — the one building-trade detail in the field.
 */
function Blueprint() {
  return (
    <div className="zs-blueprint pointer-events-none absolute inset-0" aria-hidden="true">
      <span className="zs-blueprint__ruler">
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i} className="zs-blueprint__ruler-num" style={{ top: `${i * 80}px` }}>
            {i * 10}
          </span>
        ))}
      </span>
    </div>
  );
}

function AllNewsLink() {
  return (
    <Link
      href="/novosti"
      className="label mt-10 inline-flex h-12 items-center border border-ink px-6 transition-colors duration-300 hover:bg-ink hover:text-paper"
    >
      <span className="dot">Sve novosti</span>
    </Link>
  );
}
