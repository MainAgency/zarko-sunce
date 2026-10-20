"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { NEWS } from "@/lib/content";

import { NewsMagazine } from "./NewsMagazine";
import { NewsPortalLite } from "./NewsPortalLite";
import { SectionIntro } from "./SectionIntro";
import GlyphPortal from "./ui/glyph-portal";

const FAMILY = '"Archivo", Arial, sans-serif';
/** Same tracking as the site's headings (.heading in globals.css). */
const TRACKING = -0.045;

/** The home page shows only the latest few; the rest live on /novosti. */
const LATEST = [...NEWS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

/**
 * "NOVOSTI" set large with a photo showing through the letters; scrolling
 * flies the camera through a letter into the news list.
 *
 * GlyphPortal locks itself static for good if the font is still loading or the
 * first animation frame arrives late (a tab opened in the background), so it
 * only mounts once Archivo is in and the page is visible. Until then — and for
 * crawlers — the plain list renders. Touch screens get NewsPortalLite instead:
 * the same idea with only transforms and fades, which phones keep smooth.
 */
export function NewsPortal() {
  const [ready, setReady] = useState<false | "full" | "lite">(false);

  useEffect(() => {
    let cancelled = false;
    const lite = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    let fontDone = false;
    const tryMount = () => {
      if (!cancelled && fontDone && document.visibilityState === "visible") setReady(lite ? "lite" : "full");
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

  if (ready === "lite") return <NewsPortalLite items={LATEST} />;

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
        letterSpacing={TRACKING}
        interactive={false}
        scrollLength={2.2}
        maxWordWidth={440}
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
          /* A plain field in the theme's colour: the contrasting letter colour while it
             shows through the word, turning into the page background as the news come in. */
          <div className="zs-news-bg absolute inset-0" />
        }
        front={
          <>
            <p data-zs-portal-support>Obavijesti i priče iz našeg rada.</p>
          </>
        }
      >
        {/* Drifts up into place as the news fades in. The top padding is the landing
            room: once the camera is through the letter the heading sits well below
            the top edge, so a little scroll momentum doesn't cut the first card. */}
        <div className="zs-news-content mx-auto w-full max-w-7xl pt-[12svh] lg:pt-[16svh]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="heading text-[clamp(2.25rem,4.2vw,3.75rem)]">Novosti</h2>
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

function AllNewsLink() {
  return (
    <Link
      href="/novosti"
      className="btn-fill label mt-10 inline-flex h-12 items-center border border-ink px-6"
    >
      <span className="dot">Sve novosti</span>
    </Link>
  );
}
