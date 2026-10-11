import Image from "next/image";

import { PARTNERS, type Partner } from "@/lib/content";

/**
 * Partner logos gliding past in an endless strip. The row is rendered twice
 * and shifted by one copy's width, so the loop is seamless; it pauses on hover
 * and fades out at both edges. Logos show in their own colours and grow a
 * touch on hover. Reduced-motion visitors get a still, wrapping row.
 */
export function PartnersMarquee() {
  return (
    <div className="zs-partners group relative overflow-hidden">
      <div className="zs-partners__track flex w-max group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {PARTNERS.map((partner) => (
              <li key={partner.name} className="flex h-10 items-center px-7 sm:px-9">
                <Logo partner={partner} focusable={copy === 0} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function Logo({ partner, focusable }: { partner: Partner; focusable: boolean }) {
  const mark = (
    <Image
      src={partner.logo}
      alt={partner.name}
      width={partner.width}
      height={partner.height}
      style={{ height: partner.display, width: "auto" }}
      className="max-w-none object-contain transition-transform duration-500 hover:scale-105"
    />
  );

  return partner.href ? (
    <a
      href={partner.href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={focusable ? 0 : -1}
      aria-label={partner.name}
    >
      {mark}
    </a>
  ) : (
    mark
  );
}
