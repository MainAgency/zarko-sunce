"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { SERVICES, photoUrl, type ServiceId } from "@/lib/content";

/** Display order: adaptations lead, key-in-hand before ceilings. */
const ORDER: ServiceId[] = ["adaptacije", "knauf", "gletanje", "kljuc-u-ruke", "stropovi"];
const ITEMS = ORDER.map((id) => SERVICES.find((s) => s.id === id)).filter((s) => s !== undefined);
const N = ITEMS.length;

const pad = (n: number) => String(n).padStart(2, "0");
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
/** Share of the remaining distance the row covers each frame — the glide behind the scroll.
 *  Touch scrolling already has its own momentum, so phones follow more closely. */
const GLIDE = 0.1;
const GLIDE_TOUCH = 0.22;
/** How far past the half-way point the row must go before the text switches service,
 *  so it does not flip back and forth when scrolling stops near a boundary. */
const HYSTERESIS = 0.12;

/*
 * Services, after santalarch.com: a dark band that pins to the screen while
 * you scroll through it. The service names run sideways in one long row; a
 * window column lights up whichever name is passing through it (full colour over
 * grey), and the service photos slide through the same window underneath, in
 * step. The description, the counter and the quote link follow the service
 * in the window.
 *
 * Layout is driven by two CSS variables: --col (column width) and --win (the
 * window's left edge), so phones get one wide column instead of a quarter.
 * Scroll sets --x: the window's position along the row, -1 before the first
 * service up to N-1 at the last. It follows the scroll position continuously
 * (no stops between services) and eases toward it frame by frame, so a wheel
 * notch turns into a smooth glide instead of a jump.
 */
export function Services() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = section.current;
    const st = stage.current;
    if (!el || !st) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glide = window.matchMedia("(pointer: coarse)").matches ? GLIDE_TOUCH : GLIDE;
    let frame = 0;
    let x: number | null = null; // shown position; null until the first frame
    let shown = 0; // service whose text is on screen

    // Measured against the pinned stage (100svh), not window.innerHeight: on phones
    // innerHeight jumps as the address bar hides and shows, which made the row jump.
    const target = () => {
      const rect = el.getBoundingClientRect();
      const travel = rect.height - st.offsetHeight;
      return -1 + clamp(-rect.top / travel, 0, 1) * N; // -1 … N-1
    };

    const render = () => {
      frame = 0;
      const goal = target();
      x = x === null || reduce ? goal : x + (goal - x) * glide;
      if (Math.abs(goal - x) < 0.0005) x = goal;
      st.style.setProperty("--x", x.toFixed(4));
      st.style.setProperty("--intro", clamp(x + 1, 0, 1).toFixed(4));
      // Switch the text only once the row is clearly past the half-way point.
      if (x > shown + 0.5 + HYSTERESIS || x < shown - 0.5 - HYSTERESIS) {
        shown = clamp(Math.round(x), 0, N - 1);
        setActive(shown);
      }
      // Keep gliding until the row has caught up with the scroll.
      if (x !== goal) frame = requestAnimationFrame(render);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const current = ITEMS[active];

  return (
    <section
      id="usluge"
      ref={section}
      aria-label="Usluge"
      className="relative bg-background text-foreground"
      style={{ height: `${(N + 1) * 100}svh` }}
    >
      {/* Anchors for /#usluga-… links: each lands with its service in the window. */}
      {ITEMS.map((s, i) => (
        <span
          key={s.id}
          id={`usluga-${s.id}`}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 h-px w-px"
          style={{ top: `calc(${i + 1} * 100svh + 5rem)` }}
        />
      ))}

      <div
        ref={stage}
        className="zs-svc sticky top-0 h-svh overflow-hidden"
        style={{ "--x": -1, "--intro": 0 } as CSSProperties}
      >
        {/* Column rails framing the window. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[var(--win)] w-px bg-line" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-[calc(var(--win)+var(--col))] w-px bg-line"
        />

        {/* Opening title, set on the window's left rail; fades and lifts away as the first service arrives. */}
        <div
          className="absolute left-[var(--win)] right-0 top-24 pl-5 lg:top-28 lg:pl-6"
          style={{ opacity: "calc(1 - var(--intro))", translate: "0 calc(var(--intro) * -3rem)" }}
        >
          <h2 className="heading text-[clamp(2.75rem,7.5vw,7rem)]">Usluge</h2>
        </div>

        {/* Service names: a faint row, and a full-colour copy shown only inside the window. */}
        {/* Anchored by their bottom edge, so two-line names still end just above the photo. */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-[76svh] md:bottom-[56svh]">
          <TitleRow className="text-foreground/20" />
          <div className="zs-svc__lit absolute inset-0">
            <TitleRow className="text-foreground" />
          </div>
        </div>

        {/* Photos slide through the window in step with the names. */}
        <div className="absolute left-[var(--win)] top-[25svh] h-[42svh] w-[var(--col)] overflow-hidden md:top-[45svh] md:h-[47svh]">
          <div className="zs-svc__row zs-svc__row--photos flex h-full">
            {ITEMS.map((s, i) => (
              <Link
                key={s.id}
                href={`/kontakt?usluga=${s.id}`}
                tabIndex={i === active ? 0 : -1}
                aria-hidden={i !== active}
                className="relative block h-full w-[var(--col)] shrink-0 overflow-hidden"
              >
                <Image
                  src={photoUrl(s.photo, 900)}
                  alt={s.photo.alt}
                  fill
                  // Only five photos: load them up front so none pops in mid-slide.
                  loading="eager"
                  sizes="(min-width: 768px) 25vw, 84vw"
                  className="object-cover"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Text for the service in the window — on phones it sits between the rails, centred. */}
        <div
          className="absolute left-[var(--win)] top-[70svh] w-[var(--col)] text-center px-page-md md:left-0 md:top-[45svh] md:w-[calc(var(--win)-2rem)] md:max-w-md md:text-left"
          style={{ opacity: "var(--intro)" }}
        >
          <div key={current.id} className="zs-svc__swap">
            <h3 className="sr-only">{current.title}</h3>
            <p className="label text-muted">{current.short}</p>
            <p className="mx-auto mt-4 max-w-sm text-foreground/75 md:mx-0 md:text-lg md:leading-relaxed">
              {current.description}
            </p>
            <Link
              href={`/kontakt?usluga=${current.id}`}
              className="label mt-6 inline-flex h-12 items-center gap-3 bg-yellow px-6 text-black transition-colors duration-300 hover:bg-ink hover:text-paper"
            >
              Zatražite ponudu <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Counter and progress. */}
        <div
          className="label absolute bottom-6 left-[var(--win)] flex w-[var(--col)] items-center justify-center gap-6 text-muted px-page-md md:inset-x-0 md:w-auto md:justify-between"
          style={{ opacity: "var(--intro)" }}
        >
          <span className="hidden md:inline">Odaberite uslugu i pošaljite upit</span>
          <span className="flex items-center gap-4 tabular-nums md:ml-auto">
            <span className="text-foreground">{current.title}</span>
            <span>
              {pad(active + 1)} / {pad(N)}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

function TitleRow({ className }: { className: string }) {
  return (
    <div className={`zs-svc__row flex items-end ${className}`}>
      {ITEMS.map((s) => (
        <span
          key={s.id}
          className="heading block w-[var(--col)] shrink-0 px-3 text-center text-[clamp(2.25rem,3.6vw,3.75rem)] md:pl-0 md:pr-6 md:text-left"
        >
          {s.title}
        </span>
      ))}
    </div>
  );
}
