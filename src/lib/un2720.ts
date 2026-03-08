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

/**
 * Attempt to fetch and parse UN2720 collected page for embedded data.
 * The dashboard is client-rendered; this may return null if no data is in HTML.
 * Revalidate every 1 hour to avoid over-requesting.
 */
export async function fetchUn2720CollectedData(): Promise<Un2720Data | null> {
  try {
    const res = await fetch(UN2720_COLLECTED_URL, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "ESPA-Israel-Site/1.0 (compliance; +https://www.espa-israel.com)" },
    });
    if (!res.ok) return null;
    const html = await res.text();
    // Try to find JSON in script tags (common SPA patterns)
    const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    if (!scriptMatch) return null;
    for (const script of scriptMatch) {
      const inner = script.replace(/<\/?script[^>]*>/gi, "").trim();
      const jsonMatch = inner.match(/\{[\s\S]*"trucks"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[0]) as unknown;
          if (data && typeof data === "object" && "summary" in data) {
            return data as Un2720Data;
          }
        } catch {
          // ignore parse errors
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}
