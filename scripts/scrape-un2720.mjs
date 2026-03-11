#!/usr/bin/env node
/**
 * Scrapes UN2720 tracking/collected dashboard (client-rendered) and outputs JSON.
 * Run: node scripts/scrape-un2720.mjs [output-path]
 * Output path default: public/data/un2720.json
 * Requires: npm install puppeteer (or run via GitHub Action with puppeteer in deps).
 */

import { launch } from "puppeteer";
import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

const URL = "https://app.un2720.org/tracking/collected";
const DEFAULT_OUT = "public/data/un2720.json";

async function scrape() {
  const browser = await launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    const apiPayloads = [];

    // Capture JSON API responses that back the dashboard charts (crossings, commodities, daily trends, etc.)
    page.on("response", async (response) => {
      try {
        const url = response.url();
        if (!url.startsWith("https://app.un2720.org/")) return;
        const contentType = (response.headers()["content-type"] || "").toLowerCase();
        if (!contentType.includes("application/json")) return;
        const body = await response.json().catch(() => null);
        if (!body) return;
        apiPayloads.push({ url, body });
      } catch {
        // Ignore capture errors; scraping must remain resilient
      }
    });
    await page.setUserAgent("ESPA-Israel-Scraper/1.0 (+https://www.espa-israel.com)");
    await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });

    // Wait for dashboard content (stats or table)
    await page.waitForSelector("table, [class*='table'], h2, h3, [class*='summary']", {
      visible: true,
      timeout: 15000,
    }).catch(() => null);
    await new Promise((r) => setTimeout(r, 3000));

    const data = await page.evaluate(() => {
      const orgRows = [];

      const parseNum = (s) => {
        const n = parseInt(String(s).replace(/\s|,/g, ""), 10);
        return Number.isNaN(n) ? 0 : n;
      };

      // Table: find table and extract rows (Organization, Trucks, Pallets, Weight (t), Number of Requests)
      const table = document.querySelector("table");
      if (table) {
        const rows = Array.from(table.querySelectorAll("tbody tr"));
        const headerCells = table.querySelectorAll("thead th");
        const headerTexts = Array.from(headerCells).map((th) => th.innerText.trim().toLowerCase());
        const colOrg = headerTexts.findIndex((h) => h.includes("organization") || h.includes("org"));
        const colTrucks = headerTexts.findIndex((h) => h.includes("truck"));
        const colPallets = headerTexts.findIndex((h) => h.includes("pallet"));
        const colWeight = headerTexts.findIndex((h) => h.includes("weight"));
        const colRequests = headerTexts.findIndex((h) => h.includes("request"));

        for (const tr of rows) {
          const cells = tr.querySelectorAll("td");
          if (cells.length < 2) continue;
          const get = (idx) => (idx >= 0 && cells[idx] ? cells[idx].innerText.trim() : "");
          orgRows.push({
            organization: get(colOrg >= 0 ? colOrg : 0),
            trucks: parseNum(get(colTrucks >= 0 ? colTrucks : 1)),
            pallets: parseNum(get(colPallets >= 0 ? colPallets : 2)),
            weightTonnes: parseNum(get(colWeight >= 0 ? colWeight : 3)),
            numberOfRequests: parseNum(get(colRequests >= 0 ? colRequests : 4)),
          });
        }
      }

      const summary = {
        pallets: orgRows.reduce((sum, r) => sum + r.pallets, 0),
        trucks: orgRows.reduce((sum, r) => sum + r.trucks, 0),
        weightTonnes: orgRows.reduce((sum, r) => sum + r.weightTonnes, 0),
        numberOfRequests: orgRows.reduce((sum, r) => sum + r.numberOfRequests, 0),
      };

      return { summary, organizations: orgRows };
    });

    const out = {
      summary: data.summary,
      organizations: data.organizations.filter((r) => r.organization || r.trucks || r.pallets),
      fetchedAt: new Date().toISOString(),
      // Raw API payloads include data for:
      // - weight by crossing
      // - collected weight by commodity
      // - collected daily trends (pallets / trucks / weight over time)
      apiPayloads,
    };
    return out;
  } finally {
    await browser.close();
  }
}

const outPath = process.argv[2] || DEFAULT_OUT;
scrape()
  .then((json) => {
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, JSON.stringify(json, null, 2), "utf8");
    console.log("Wrote", outPath);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
