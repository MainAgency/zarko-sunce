#!/usr/bin/env node
/**
 * Pre-renders sitemap.xml and media-sitemap.xml into .generated/, which the
 * matching routes serve when present.
 *
 * Plain node: it does NOT read .env, so locally SITE_URL falls back to the
 * production domain. Hosts that inject real env vars get the right values.
 * Never hard-fails the build.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zarko-sunce.hr";
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3001";
const OUT_DIR = path.join(process.cwd(), ".generated");

const IMAGE_BASE_PATH = "/zarko-sunce/medija/slike";
const VIDEO_BASE_PATH = "/zarko-sunce/medija/videa";

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const resolveAbsoluteUrl = (p, siteUrl) =>
  /^https?:\/\//i.test(p)
    ? p
    : `${siteUrl.replace(/\/+$/, "")}/${p.replace(/^\/+/, "")}`;

const toIsoDate = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const generateUrlSetXml = (entries) => {
  const urls = entries
    .filter((entry) => entry && entry.loc)
    .map((entry) => {
      const loc = escapeXml(resolveAbsoluteUrl(entry.loc, SITE_URL));
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
        entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
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
};

const fetchDocs = async (collection) => {
  try {
    const res = await fetch(
      `${CMS_URL}/api/${collection}?depth=0&limit=1000`,
      { signal: AbortSignal.timeout(15000) },
    );
    if (!res.ok) {
      console.warn(
        `[sitemaps] ${collection} returned ${res.status} ${res.statusText} — skipping`,
      );
      return [];
    }
    const data = await res.json();
    return Array.isArray(data?.docs) ? data.docs : [];
  } catch (error) {
    console.warn(`[sitemaps] ${collection} unreachable — skipping:`, error.message);
    return [];
  }
};

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const now = new Date().toISOString();
  const pages = [
    { loc: "/", lastmod: now, changefreq: "weekly", priority: 1 },
    // CMS-driven routes get appended here as collections land.
  ];

  const [images, videos] = await Promise.all([
    fetchDocs("media-images"),
    fetchDocs("media-videos"),
  ]);

  const media = [
    ...images
      .filter((doc) => doc?.filename)
      .map((doc) => ({
        loc: `${IMAGE_BASE_PATH}/${doc.filename}`,
        lastmod: doc.updatedAt,
        changefreq: "monthly",
        priority: 0.4,
      })),
    ...videos
      .filter((doc) => doc?.filename)
      .map((doc) => ({
        loc: `${VIDEO_BASE_PATH}/${doc.filename}`,
        lastmod: doc.updatedAt,
        changefreq: "monthly",
        priority: 0.4,
      })),
  ];

  await writeFile(
    path.join(OUT_DIR, "sitemap.xml"),
    generateUrlSetXml(pages),
    "utf8",
  );
  await writeFile(
    path.join(OUT_DIR, "media-sitemap.xml"),
    generateUrlSetXml(media),
    "utf8",
  );

  console.log(
    `[sitemaps] wrote ${pages.length} page(s) and ${media.length} media entr(ies) to .generated/`,
  );
}

main().catch((error) => {
  console.warn("[sitemaps] generation failed, continuing build:", error);
  process.exitCode = 0;
});
