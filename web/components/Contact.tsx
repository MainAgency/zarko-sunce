"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from "react";

import { CONTACT, SERVICES, type ServiceId } from "@/lib/content";

type Status = { state: "idle" | "sending" | "sent" } | { state: "error"; message: string };
type Kind = "person" | "business";

const KINDS: [Kind, string][] = [
  ["person", "Privatne osobe"],
  ["business", "Tvrtke"],
];

const WORKS = SERVICES.map((s) => s.title);

/** Staggered rise-in: `--d` is the item's place in the sequence. */
const delay = (d: number) => ({ "--d": d }) as CSSProperties;

function Select({ name, placeholder, options, value }: { name: string; placeholder: string; options: string[]; value?: string }) {
  return (
    <select
      name={name}
      aria-label={placeholder}
      defaultValue={value && options.includes(value) ? value : ""}
      className="cm-field"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

/**
 * The contact page. On desktop it is a single screen: the title runs as a
 * vertical marquee down the left, the contact details sit mid-page and the
 * form on the right. `initialServices` comes from links like /kontakt?usluga=gletanje.
 */
export function Contact({ initialServices = [] }: { initialServices?: ServiceId[] }) {
  const [kind, setKind] = useState<Kind>("person");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [copied, setCopied] = useState(false);
  // Switching tabs remounts the fields (so they rise in again); what was
  // typed carries over through `draft`. `round` clears everything after a send.
  const [draft, setDraft] = useState((): Record<string, string> => {
    const service = SERVICES.find((s) => s.id === initialServices[0]);
    return service ? { work: service.title } : {};
  });
  const [round, setRound] = useState(0);
  const [switched, setSwitched] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // On desktop everything is sized in vw, shrunk on short screens so the page
  // always fits one screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const fit = () => el.style.setProperty("--cm-fit", String(Math.min(1, window.innerHeight / 950)));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${CONTACT.email}`;
    }
  };

  const switchKind = (next: Kind) => {
    if (next === kind) return;
    if (formRef.current) {
      setDraft(Object.fromEntries([...new FormData(formRef.current)].map(([k, v]) => [k, String(v)])));
    }
    setSwitched(true);
    setKind(next);
  };

  // Tabs pattern: arrow keys move between the two tabs.
  const onTabKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const to = (i + (e.key === "ArrowRight" ? 1 : -1) + KINDS.length) % KINDS.length;
    switchKind(KINDS[to][0]);
    tabRefs.current[to]?.focus();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    const details = [
      ["Kontakt osoba", get("contact")],
      ["Vrsta radova", get("work")],
    ].filter(([, value]) => value);
    const message = [...details.map(([label, value]) => `${label}: ${value}`), "", get("note") || "(bez poruke)"].join("\n");

    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: kind, name: get("name"), email: get("email"), phone: get("phone"), message }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Slanje poruke nije uspjelo.");
      setStatus({ state: "sent" });
      setDraft({});
      setRound((r) => r + 1);
    } catch (err) {
      setStatus({ state: "error", message: err instanceof Error ? err.message : "Došlo je do greške." });
    }
  };

  const business = kind === "business";
  let d = 0;

  return (
    <section ref={sectionRef} className="cm">
      <h1 className="sr-only">Kontakt</h1>

      {/* The page title, drifting past on a loop. */}
      <div aria-hidden="true" className="cm-rotate">
        <div className="cm-marquee">
          <div className="cm-reveal">
            <div className="cm-track">
              {Array.from({ length: 6 }, (_, n) => (
                <span key={n} className="cm-word">
                  Kontakt
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="cm-stack">
        <p className="cm-talk cm-fade">Razgovarajmo.</p>
        <div className="cm-channels" aria-label="Kontakt podaci">
          <div className="cm-channel cm-in" style={delay(0)}>
            <p className="cm-label">E-mail</p>
            <button
              type="button"
              onClick={copyEmail}
              aria-label={`Kopiraj e-mail adresu ${CONTACT.email}`}
              className={`cm-value cm-underline cm-copy${copied ? " is-copied" : ""}`}
            >
              <span className="cm-copy-label">{CONTACT.email}</span>
              <span aria-hidden="true" className="cm-copy-feedback">
                <svg viewBox="0 0 14 14" fill="none" className="size-[0.95em]">
                  <path d="M2.5 7.5 5.5 10.5 11.5 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                E-mail kopiran
              </span>
            </button>
            <span role="status" className="sr-only">
              {copied && "E-mail adresa kopirana"}
            </span>
          </div>
          <div className="cm-channel cm-in" style={delay(1)}>
            <p className="cm-label">WhatsApp</p>
            <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="cm-value cm-underline">
              Pošaljite poruku
            </a>
          </div>
          <div className="cm-channel cm-in" style={delay(2)}>
            <p className="cm-label">Telefon</p>
            <a href={CONTACT.phoneHref} className="cm-value cm-underline">
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="cm-aside">
        <div role="tablist" aria-label="Tko šalje upit" className="cm-tabs cm-in" style={delay(3)}>
          {KINDS.map(([value, label], n) => (
            <button
              key={value}
              ref={(el) => {
                tabRefs.current[n] = el;
              }}
              type="button"
              role="tab"
              id={`kontakt-tab-${value}`}
              aria-selected={kind === value}
              aria-controls="kontakt-forma"
              tabIndex={kind === value ? 0 : -1}
              onClick={() => switchKind(value)}
              onKeyDown={(e) => onTabKey(e, n)}
              className="cm-tab"
            >
              {label}
            </button>
          ))}
        </div>

        <form
          key={`${kind}-${round}`}
          ref={formRef}
          id="kontakt-forma"
          role="tabpanel"
          aria-labelledby={`kontakt-tab-${kind}`}
          onSubmit={onSubmit}
          className="cm-form"
          style={{ "--cm-base": switched ? "0ms" : "520ms" } as CSSProperties}
        >
          {business ? (
            <div className="cm-row cm-in" style={delay(d++)}>
              <input name="name" required defaultValue={draft.name} aria-label="Naziv tvrtke" placeholder="Naziv tvrtke*" autoComplete="organization" className="cm-field" />
              <input name="contact" defaultValue={draft.contact} aria-label="Kontakt osoba" placeholder="Kontakt osoba" autoComplete="name" className="cm-field" />
            </div>
          ) : (
            <div className="cm-in" style={delay(d++)}>
              <input name="name" required defaultValue={draft.name} aria-label="Ime i prezime" placeholder="Ime i prezime*" autoComplete="name" className="cm-field" />
            </div>
          )}
          <div className="cm-in" style={delay(d++)}>
            <input name="email" type="email" required defaultValue={draft.email} aria-label="E-mail" placeholder="E-mail*" autoComplete="email" className="cm-field" />
          </div>
          <div className="cm-in" style={delay(d++)}>
            <input name="phone" type="tel" required defaultValue={draft.phone} aria-label="Telefon" placeholder="Telefon*" autoComplete="tel" className="cm-field" />
          </div>
          <div className="cm-in" style={delay(d++)}>
            <Select name="work" placeholder="Vrsta radova" options={WORKS} value={draft.work} />
          </div>
          <div className="cm-in" style={delay(d++)}>
            <textarea name="note" defaultValue={draft.note} aria-label="Poruka" placeholder="Poruka" className="cm-field" />
          </div>
          <label className="cm-consent cm-in" style={delay(d++)}>
            <input type="checkbox" name="consent" required defaultChecked={draft.consent === "on"} />
            <span>Slažem se da Žarko Sunce koristi moje podatke kako bi odgovorio na ovaj upit i javio mi se u vezi radova.</span>
          </label>
          <div className="cm-footer cm-in" style={delay(d++)}>
            <button type="submit" disabled={status.state === "sending"} className="cm-submit">
              {status.state === "sending" ? "Šaljem…" : "Pošalji"}
            </button>
            <p role="status" aria-live="polite" className="cm-value">
              {status.state === "sent" && "Hvala! Javit ćemo vam se uskoro."}
              {status.state === "error" && <span className="text-red-700">{status.message}</span>}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
