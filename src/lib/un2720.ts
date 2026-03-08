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

/** Base URL of this site; scraped data is at /data/un2720.json. */
const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.espa-israel.com";

/**
 * Load UN2720 data from our scraped snapshot (updated by cron 4x daily).
 * Revalidate every 30 min so we pick up new scrapes without over-requesting.
 */
export async function fetchUn2720CollectedData(): Promise<Un2720Data | null> {
  try {
    const url = `${SITE_BASE.replace(/\/$/, "")}/data/un2720.json`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
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
