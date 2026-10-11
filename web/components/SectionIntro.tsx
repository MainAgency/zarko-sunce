import type { CSSProperties, ReactNode } from "react";

type SectionIntroProps = {
  title: ReactNode;
  text?: string;
};

/** Section opener: the heading and an optional line of copy — no eyebrow label. */
export function SectionIntro({ title, text }: SectionIntroProps) {
  return (
    <div>
      <h2 data-reveal className="heading max-w-4xl text-[clamp(1.875rem,3.4vw,3rem)]">
        {title}
      </h2>
      {text && (
        <p data-reveal style={{ "--rd": "120ms" } as CSSProperties} className="mt-6 max-w-md text-muted">
          {text}
        </p>
      )}
    </div>
  );
}
