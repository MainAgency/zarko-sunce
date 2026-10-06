import Link from "next/link";

/** Quiet closing prompt for the inner pages. */
export function CtaRow() {
  return (
    <section className="px-page border-t border-line py-24">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <h2 className="heading text-[clamp(1.875rem,3.4vw,3rem)]">
          Imate projekt? <em>Javite nam se.</em>
        </h2>
        <Link href="/kontakt" className="label inline-flex h-12 items-center self-start border border-ink px-6 transition-colors hover:bg-ink hover:text-paper lg:self-auto">
          <span className="dot">Zatražite ponudu</span>
        </Link>
      </div>
    </section>
  );
}
