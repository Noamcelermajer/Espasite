/**
 * UN2720 tracking dashboard: https://app.un2720.org/tracking/collected
 * Data is loaded client-side; no public API. This module provides the dashboard URL
 * and optional server-side fetch for future use (e.g. if they add embedded data or API).
 */

export const UN2720_COLLECTED_URL = "https://app.un2720.org/tracking/collected";
export const UN2720_INFO_URL = "https://info.un2720.org/#about";

export interface Un2720Summary {
  pallets: number;
  trucks: number;
  weightTonnes: number;
  numberOfRequests: number;
}

export interface Un2720OrgRow {
  organization: string;
  trucks: number;
  pallets: number;
  weightTonnes: number;
  numberOfRequests: number;
}

export interface Un2720Data {
  summary: Un2720Summary;
  organizations: Un2720OrgRow[];
  fetchedAt: string;
}

/** URL of scraped JSON. Set UN2720_DATA_URL (e.g. GCS public URL) or UN2720_GCS_BUCKET for server-side GCS read. */
const DATA_URL =
  process.env.UN2720_DATA_URL ||
  `${(process.env.NEXT_PUBLIC_SITE_URL || "https://www.espa-israel.com").replace(/\/$/, "")}/data/un2720.json`;

async function fetchFromGcs(): Promise<Un2720Data | null> {
  const bucket = process.env.UN2720_GCS_BUCKET;
  const object = process.env.UN2720_GCS_OBJECT || "un2720.json";
  if (!bucket) return null;
  try {
    const { Storage } = await import("@google-cloud/storage");
    const storage = new Storage();
    const [contents] = await storage.bucket(bucket).file(object).download();
    const data = JSON.parse(contents.toString()) as unknown;
    if (!data || typeof data !== "object" || !("summary" in data)) return null;
    const out = data as Un2720Data;
    if (!out.summary || !Array.isArray(out.organizations)) return null;
    return out;
  } catch {
    return null;
  }
}

/**
 * Load UN2720 data from GCS (when UN2720_GCS_BUCKET set), backend URL, or static fallback. Revalidate every 30 min.
 */
export async function fetchUn2720CollectedData(): Promise<Un2720Data | null> {
  if (process.env.UN2720_GCS_BUCKET) return fetchFromGcs();
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const data = (await res.json()) as unknown;
    if (!data || typeof data !== "object" || !("summary" in data)) return null;
    const out = data as Un2720Data;
    if (!out.summary || !Array.isArray(out.organizations)) return null;
    return out;
  } catch {
    return null;
  }
}
