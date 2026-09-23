import { readFile } from "node:fs/promises";
import path from "node:path";

import { getAllImages, getAllVideos } from "@/lib/api";
import { imageUrl, videoUrl } from "@/lib/media";
import { SITE_URL } from "@/lib/seo";
import { generateUrlSetXml, type SitemapUrlEntry } from "@/utils/sitemap";

export const runtime = "nodejs";

const GENERATED = path.join(process.cwd(), ".generated", "media-sitemap.xml");

const xmlResponse = (body: string) =>
  new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });

export async function GET() {
  try {
    const prebuilt = await readFile(GENERATED, "utf8");
    if (prebuilt.trim()) return xmlResponse(prebuilt);
  } catch {
    // no generated media sitemap — build one from the CMS below
  }

  const [images, videos] = await Promise.all([
    getAllImages().catch(() => []),
    getAllVideos().catch(() => []),
  ]);

  const entries: SitemapUrlEntry[] = [
    // Site-local media paths only — never the bucket URL.
    ...images.flatMap((image) => {
      const loc = imageUrl(image);
      return loc
        ? [{ loc, lastmod: image.updatedAt, changefreq: "monthly", priority: 0.4 } as SitemapUrlEntry]
        : [];
    }),
    ...videos.flatMap((video) => {
      const loc = videoUrl(video);
      return loc
        ? [{ loc, lastmod: video.updatedAt, changefreq: "monthly", priority: 0.4 } as SitemapUrlEntry]
        : [];
    }),
  ];

  return xmlResponse(generateUrlSetXml(entries, SITE_URL));
}
