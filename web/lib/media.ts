import type { MediaImageType, MediaVideoType } from "./types";

/**
 * Media lives in the Supabase bucket under `images/` and `videos/`, but the site
 * never links a raw storage URL. `next.config.ts` rewrites these site-local paths
 * onto the bucket, so an asset opened in a new tab stays on our own domain.
 *
 * This module is the only place that builds a media URL — components use these
 * helpers instead of `doc.url`.
 */

export const IMAGE_BASE_PATH = "/zarko-sunce/medija/slike";
export const VIDEO_BASE_PATH = "/zarko-sunce/medija/videa";

type MediaLike = Pick<MediaImageType | MediaVideoType, "filename"> | string;

const isAbsolute = (value: string) => /^https?:\/\//i.test(value);

const filenameOf = (media: MediaLike | null | undefined): string | undefined => {
  if (!media) return undefined;
  const filename = typeof media === "string" ? media : media.filename;
  if (!filename) return undefined;
  const trimmed = filename.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const join = (basePath: string, filename: string) =>
  `${basePath}/${filename.replace(/^\/+/, "")}`;

export function imageUrl(
  media: MediaLike | null | undefined,
): string | undefined {
  const filename = filenameOf(media);
  if (!filename) return undefined;
  if (isAbsolute(filename)) return filename;
  return join(IMAGE_BASE_PATH, filename);
}

export function videoUrl(
  media: MediaLike | null | undefined,
): string | undefined {
  const filename = filenameOf(media);
  if (!filename) return undefined;
  if (isAbsolute(filename)) return filename;
  return join(VIDEO_BASE_PATH, filename);
}

/** Absolute variant for sitemaps and OG tags, which cannot use relative paths. */
export function absoluteMediaUrl(
  path: string | null | undefined,
  siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL ||
    "https://zarko-sunce.hr",
): string | undefined {
  if (!path) return undefined;
  if (isAbsolute(path)) return path;
  return `${siteUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
