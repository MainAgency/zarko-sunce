export type SitemapUrlEntry = {
  /** Absolute URL, or a site-relative path resolved against the site URL. */
  loc: string;
  lastmod?: string | Date | null;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  /** 0.0 – 1.0. Anything outside the range is dropped. */
  priority?: number;
};

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function resolveAbsoluteUrl(path: string, siteUrl: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

const toIsoDate = (value: string | Date | null | undefined) => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined; // skip invalid dates
  return date.toISOString();
};

export function generateUrlSetXml(
  entries: SitemapUrlEntry[],
  siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL ||
    "https://zarko-sunce.hr",
): string {
  const urls = entries
    .filter((entry) => Boolean(entry?.loc))
    .map((entry) => {
      const loc = escapeXml(resolveAbsoluteUrl(entry.loc, siteUrl));
      const lastmod = toIsoDate(entry.lastmod);
      const priority =
        typeof entry.priority === "number" &&
        entry.priority >= 0 &&
        entry.priority <= 1
          ? entry.priority.toFixed(1)
          : undefined;

      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        entry.changefreq
          ? `    <changefreq>${entry.changefreq}</changefreq>`
          : null,
        priority ? `    <priority>${priority}</priority>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
