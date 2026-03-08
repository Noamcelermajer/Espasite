import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.espa-israel.com";
const root = baseUrl.replace(/\/$/, "");

const staticPaths = ["", "mandate", "operations", "compliance", "philanthropy", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      const pathname = path ? `/${locale}/${path}` : `/${locale}`;
      entries.push({
        url: `${root}${pathname}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
