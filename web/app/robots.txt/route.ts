import { SITE_URL } from "@/lib/seo";

export const runtime = "nodejs";

export async function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /*?*",
    "Disallow: /api/",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Sitemap: ${SITE_URL}/media-sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
