import { readFile } from "node:fs/promises";
import path from "node:path";

import { SITE_URL } from "@/lib/seo";
import { generateUrlSetXml, type SitemapUrlEntry } from "@/utils/sitemap";

export const runtime = "nodejs";

const GENERATED = path.join(process.cwd(), ".generated", "sitemap.xml");

const xmlResponse = (body: string) =>
  new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });

export async function GET() {
  // A prebuild-generated file wins when it exists — the live route is the fallback.
  try {
    const prebuilt = await readFile(GENERATED, "utf8");
    if (prebuilt.trim()) return xmlResponse(prebuilt);
  } catch {
    // no generated sitemap — build one below
  }

  const now = new Date().toISOString();

  const entries: SitemapUrlEntry[] = [
    { loc: "/", lastmod: now, changefreq: "weekly", priority: 1 },
    // CMS-driven routes get appended here as collections land.
  ];

  return xmlResponse(generateUrlSetXml(entries, SITE_URL));
}
