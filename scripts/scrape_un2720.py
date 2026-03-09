#!/usr/bin/env python3
"""
Scrape UN2720 tracking/collected and output JSON. Optionally upload to GCS.
Run: pip install -r requirements-scrape.txt && python scripts/scrape_un2720.py
Env: GCS_BUCKET, GCS_OBJECT (e.g. un2720.json) to upload; otherwise prints to stdout.
"""
import json
import os
import sys
from datetime import datetime, timezone

from playwright.sync_api import sync_playwright

URL = "https://app.un2720.org/tracking/collected"


def parse_num(s: str) -> int:
    if not s:
        return 0
    s = str(s).replace(" ", "").replace(",", "")
    try:
        return int(float(s))
    except (ValueError, TypeError):
        return 0


def scrape() -> dict:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-setuid-sandbox"])
        try:
            page = browser.new_page()
            page.set_extra_http_headers({"User-Agent": "ESPA-Israel-Scraper/1.0 (+https://www.espa-israel.com)"})
            page.goto(URL, wait_until="networkidle", timeout=60000)
            page.wait_for_timeout(3000)

            # Summary from page text
            text = page.inner_text("body")
            summary = {"pallets": 0, "trucks": 0, "weightTonnes": 0, "numberOfRequests": 0}
            labels = ["Pallets", "Trucks", "Weight (t)", "Number of Requests"]
            keys = ["pallets", "trucks", "weightTonnes", "numberOfRequests"]
            for label, key in zip(labels, keys):
                i = text.find(label)
                if i != -1:
                    snippet = text[i + len(label) : i + len(label) + 30]
                    for word in snippet.replace(",", " ").split():
                        if word.replace(".", "").isdigit():
                            summary[key] = parse_num(word)
                            break

            # Table
            orgs = []
            table = page.query_selector("table")
            if table:
                headers = [th.inner_text().strip().lower() for th in table.query_selector_all("thead th")]
                col_org = next((i for i, h in enumerate(headers) if "organization" in h or "org" in h), 0)
                col_trucks = next((i for i, h in enumerate(headers) if "truck" in h), 1)
                col_pallets = next((i for i, h in enumerate(headers) if "pallet" in h), 2)
                col_weight = next((i for i, h in enumerate(headers) if "weight" in h), 3)
                col_req = next((i for i, h in enumerate(headers) if "request" in h), 4)
                for tr in table.query_selector_all("tbody tr"):
                    cells = tr.query_selector_all("td")
                    if len(cells) < 2:
                        continue
                    def get(i):
                        return cells[i].inner_text().strip() if 0 <= i < len(cells) else ""
                    orgs.append({
                        "organization": get(col_org),
                        "trucks": parse_num(get(col_trucks)),
                        "pallets": parse_num(get(col_pallets)),
                        "weightTonnes": parse_num(get(col_weight)),
                        "numberOfRequests": parse_num(get(col_req)),
                    })
            return {
                "summary": summary,
                "organizations": [o for o in orgs if o["organization"] or o["trucks"] or o["pallets"]],
                "fetchedAt": datetime.now(tz=timezone.utc).isoformat(),
            }
        finally:
            browser.close()


def main() -> None:
    data = scrape()
    payload = json.dumps(data, indent=2)

    bucket = os.environ.get("GCS_BUCKET")
    obj = os.environ.get("GCS_OBJECT", "un2720.json")
    if bucket:
        try:
            from google.cloud import storage
            client = storage.Client()
            blob = client.bucket(bucket).blob(obj)
            blob.upload_from_string(payload, content_type="application/json")
            # Public read: use bucket IAM (allUsers:objectViewer) if allowed by org policy
            print(f"Uploaded gs://{bucket}/{obj}", file=sys.stderr)
        except Exception as e:
            print(f"GCS upload failed: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        print(payload)


if __name__ == "__main__":
    main()
