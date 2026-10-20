import type { Metadata } from "next";

import type { MediaImageType } from "./types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://zarko-sunce.hr";

export const SITE_NAME = "Žarko Sunce";

export const DEFAULT_DESCRIPTION =
  "Žarko Sunce d.o.o. iz Splita: adaptacije stanova, Knauf pregradni zidovi, gletanje i bojanje, spušteni stropovi i radovi po principu ključ u ruke u Splitu i okolici. Besplatan izlazak na teren i jasna ponuda.";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3001";

const absolute = (path: string, base: string) =>
  /^https?:\/\//i.test(path)
    ? path
    : `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

export type SeoInput = {
  title: string;
  description?: string;
  /** Site-relative path, e.g. `/o-nama/`. Defaults to the site root. */
  path?: string;
  /** Absolute or site-relative image URL for OG / Twitter cards. */
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function buildSeoMetadata(input: SeoInput): Metadata {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    path = "/",
    image,
    imageAlt,
    type = "website",
    noIndex = false,
  } = input;

  const canonical = absolute(path, SITE_URL);
  const ogImage = image ? absolute(image, SITE_URL) : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "hr-HR": canonical,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "hr_HR",
      type,
      ...(ogImage
        ? { images: [{ url: ogImage, alt: imageAlt || title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    other: {
      "content-language": "hr",
    },
  };
}

/** Spread into the root layout's `metadata`. */
export const seoRootDefaults: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} — Adaptacije stanova i završni radovi, Split`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export type BusinessContact = {
  phone?: string;
  email?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    postalCode?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  /** e.g. [{ dayOfWeek: ["Monday"], opens: "08:00", closes: "16:00" }] */
  openingHours?: {
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }[];
  logo?: string;
  /** Places the business serves, e.g. ["Split", "Kaštela"]. */
  areaServed?: string[];
};

export function buildBusinessJsonLd(contact: BusinessContact = {}) {
  const { phone, email, address, openingHours, logo, areaServed } = contact;

  const postalAddress = address
    ? {
        "@type": "PostalAddress",
        ...address,
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: SITE_NAME,
        url: SITE_URL,
        ...(DEFAULT_DESCRIPTION ? { description: DEFAULT_DESCRIPTION } : {}),
        ...(phone ? { telephone: phone } : {}),
        ...(email ? { email } : {}),
        ...(postalAddress ? { address: postalAddress } : {}),
        ...(areaServed?.length
          ? { areaServed: areaServed.map((name) => ({ "@type": "City", name })) }
          : {}),
        ...(logo ? { image: absolute(logo, SITE_URL) } : {}),
        ...(openingHours?.length
          ? {
              openingHoursSpecification: openingHours.map((entry) => ({
                "@type": "OpeningHoursSpecification",
                dayOfWeek: entry.dayOfWeek,
                opens: entry.opens,
                closes: entry.closes,
              })),
            }
          : {}),
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        ...(logo ? { logo: absolute(logo, SITE_URL) } : {}),
        ...(phone || email
          ? {
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "customer service",
                  ...(phone ? { telephone: phone } : {}),
                  ...(email ? { email } : {}),
                  areaServed: "HR",
                  availableLanguage: ["hr"],
                },
              ],
            }
          : {}),
      },
    ],
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path, SITE_URL),
    })),
  };
}

/**
 * Absolute CMS URL for a media doc — metadata only. Anything rendered on the
 * page goes through `lib/media.ts` so it stays on our own domain.
 */
export function resolveCmsImageUrl(
  image: Pick<MediaImageType, "url" | "filename"> | string | null | undefined,
): string | undefined {
  if (!image) return undefined;

  if (typeof image === "string") {
    return absolute(image, CMS_URL);
  }

  const raw = image.url || (image.filename ? `/api/media-images/file/${image.filename}` : undefined);
  if (!raw) return undefined;

  return absolute(raw, CMS_URL);
}
