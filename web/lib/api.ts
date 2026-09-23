import type {
  MediaImageType,
  MediaVideoType,
  PaginatedDocs,
} from "./types";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3001";

/** Seconds. Every getter may override it per call. */
const DEFAULT_REVALIDATE = 60;

type FetchOptions = {
  label: string;
  revalidate?: number;
};

/**
 * The single place that talks to the CMS. Everything below is built on it, so a
 * failing request is logged once, in one shape, with the caller's label.
 */
async function cmsFetch<T>(
  path: string,
  { label, revalidate = DEFAULT_REVALIDATE }: FetchOptions,
): Promise<T> {
  const url = `${CMS_URL}${path}`;
  const res = await fetch(url, { next: { revalidate } });

  if (!res.ok) {
    console.error(
      `[cms] ${label} failed: ${res.status} ${res.statusText} — ${url}`,
    );
    throw new Error(`[cms] ${label} failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

export async function getGlobal<T>(
  slug: string,
  options: { depth?: number; revalidate?: number } = {},
): Promise<T> {
  const { depth = 3, revalidate } = options;
  return cmsFetch<T>(`/api/globals/${slug}?depth=${depth}`, {
    label: `getGlobal(${slug})`,
    revalidate,
  });
}

export async function getCollection<T>(
  slug: string,
  options: { depth?: number; limit?: number; revalidate?: number } = {},
): Promise<T[]> {
  const { depth = 2, limit = 1000, revalidate } = options;
  const data = await cmsFetch<PaginatedDocs<T>>(
    `/api/${slug}?depth=${depth}&limit=${limit}`,
    { label: `getCollection(${slug})`, revalidate },
  );
  return data.docs;
}

export async function getBySlug<T>(
  collection: string,
  slug: string,
  options: { depth?: number; revalidate?: number } = {},
): Promise<T> {
  const { depth = 3, revalidate } = options;
  const data = await cmsFetch<PaginatedDocs<T>>(
    `/api/${collection}?where[slug][equals]=${encodeURIComponent(
      slug,
    )}&depth=${depth}&limit=1&draft=false`,
    { label: `getBySlug(${collection}, ${slug})`, revalidate },
  );

  const doc = data.docs?.[0];
  if (!doc) {
    throw new Error(`[cms] getBySlug(${collection}, ${slug}) found no document`);
  }
  return doc;
}

export async function getById<T>(
  collection: string,
  id: string | number,
  options: { depth?: number; revalidate?: number } = {},
): Promise<T> {
  const { depth = 3, revalidate } = options;
  return cmsFetch<T>(`/api/${collection}/${id}?depth=${depth}`, {
    label: `getById(${collection}, ${id})`,
    revalidate,
  });
}

/** Cheap liveness probe. Never throws — callers just get a boolean. */
export async function checkCmsHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${CMS_URL}/api/media-images?depth=0&limit=0`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getAllImages(): Promise<MediaImageType[]> {
  return getCollection<MediaImageType>("media-images", {
    depth: 0,
    limit: 1000,
  });
}

export async function getAllVideos(): Promise<MediaVideoType[]> {
  return getCollection<MediaVideoType>("media-videos", {
    depth: 0,
    limit: 1000,
  });
}

// Content getters (pages, news, staff, …) get added here as collections land.
