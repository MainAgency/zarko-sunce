import type { CSSProperties, ReactNode } from "react";

type SectionIntroProps = {
  label: string;
  title: ReactNode;
  text?: string;
  /** Light type for dark backgrounds. */
  light?: boolean;
};

/** Section opener: small label on the left, a calm heading and optional line of copy on the right. */
export function SectionIntro({ label, title, text, light = false }: SectionIntroProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <p data-reveal className={`label dot lg:col-span-3 lg:pt-3 ${light ? "text-white/70" : "text-muted"}`}>
        {label}
      </p>
      <div className="lg:col-span-8 lg:col-start-5">
        <h2 data-reveal style={{ "--rd": "80ms" } as CSSProperties} className="heading text-[clamp(1.875rem,3.4vw,3rem)]">
          {title}
        </h2>
        {text && (
          <p data-reveal style={{ "--rd": "160ms" } as CSSProperties} className={`mt-6 max-w-md ${light ? "text-white/60" : "text-muted"}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
