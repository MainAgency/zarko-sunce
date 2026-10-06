"use client";

import { useState, type FormEvent } from "react";

import { CONTACT, SERVICES, type ServiceId } from "@/lib/content";

type Status = { state: "idle" | "sending" | "sent" } | { state: "error"; message: string };

const field =
  "w-full border-b border-ink/20 bg-transparent py-3 text-[15px] outline-none transition-colors placeholder:text-muted focus:border-ink";

/** The contact page form. `initialServices` comes from links like /kontakt?usluga=gletanje. */
export function Contact({ initialServices = [] }: { initialServices?: ServiceId[] }) {
  const [type, setType] = useState<"person" | "business">("person");
  const [services, setServices] = useState<ServiceId[]>(initialServices);
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const toggle = (id: ServiceId) =>
    setServices((current) => (current.includes(id) ? current.filter((s) => s !== id) : [...current, id]));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const chosen = SERVICES.filter((s) => services.includes(s.id)).map((s) => s.title);
    const note = String(data.get("note") || "").trim();
    const message = [`Usluge: ${chosen.length ? chosen.join(", ") : "nije odabrano"}`, "", note || "(bez poruke)"].join("\n");

    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, name: data.get("name"), email: data.get("email"), phone: data.get("phone"), message }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Slanje poruke nije uspjelo.");
      setStatus({ state: "sent" });
      form.reset();
      setServices([]);
    } catch (err) {
      setStatus({ state: "error", message: err instanceof Error ? err.message : "Došlo je do greške." });
    }
  };

  return (
    <section className="px-page pb-28 pt-36 lg:pb-40 lg:pt-44">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p data-reveal className="label dot text-muted">
            Kontakt
          </p>
          <h1 data-reveal className="heading mt-6 text-[clamp(2rem,3.6vw,3.25rem)]">
            Započnimo <em>razgovor.</em>
          </h1>
          <p data-reveal className="mt-6 max-w-sm text-muted">
            Dolazimo na besplatan izlazak na teren i šaljemo jasnu ponudu.
          </p>
          <dl data-reveal className="mt-12 border-t border-line">
            {[
              ["Telefon", <a key="t" href={CONTACT.phoneHref} className="link">{CONTACT.phone}</a>],
              ["E-mail", <a key="e" href={`mailto:${CONTACT.email}`} className="link">{CONTACT.email}</a>],
              ["Radno vrijeme", CONTACT.hours],
            ].map(([label, value]) => (
              <div key={label as string} className="grid grid-cols-[8rem_1fr] border-b border-line py-4">
                <dt className="label pt-1 text-muted">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <form data-reveal onSubmit={onSubmit} className="space-y-10 lg:col-span-6 lg:col-start-7">
          <fieldset>
            <legend className="label mb-4 text-muted">Što vam treba?</legend>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map((s) => {
                const on = services.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggle(s.id)}
                    aria-pressed={on}
                    className={`h-10 border px-4 text-sm transition-colors duration-300 ${
                      on ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                    }`}
                  >
                    {s.title}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="label mb-2 text-muted">Vaši podaci</legend>
            <div className="mb-2 flex gap-6">
              {(
                [
                  ["person", "Privatna osoba"],
                  ["business", "Tvrtka"],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="flex cursor-pointer items-center gap-2 py-2 text-sm">
                  <input
                    type="radio"
                    name="type"
                    value={value}
                    checked={type === value}
                    onChange={() => setType(value)}
                    className="h-3.5 w-3.5 appearance-none border border-ink checked:bg-ink"
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="grid gap-x-6 sm:grid-cols-2">
              <input name="name" required placeholder={type === "business" ? "Naziv tvrtke *" : "Ime i prezime *"} autoComplete="name" className={`${field} sm:col-span-2`} />
              <input name="email" type="email" required placeholder="E-mail *" autoComplete="email" className={field} />
              <input name="phone" type="tel" placeholder="Telefon" autoComplete="tel" className={field} />
              <textarea name="note" rows={3} placeholder="Ukratko o prostoru i radovima" className={`${field} resize-none sm:col-span-2`} />
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center gap-6">
            <button
              type="submit"
              disabled={status.state === "sending"}
              className="label inline-flex h-12 items-center gap-3 bg-ink px-7 text-paper transition-colors duration-300 hover:bg-yellow hover:text-ink disabled:cursor-wait disabled:opacity-60"
            >
              {status.state === "sending" ? "Šaljem…" : "Pošalji upit"} <span aria-hidden="true">→</span>
            </button>
            <p role="status" aria-live="polite" className="text-sm">
              {status.state === "sent" && "Hvala! Javit ćemo vam se uskoro."}
              {status.state === "error" && <span className="text-red-700">{status.message}</span>}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
