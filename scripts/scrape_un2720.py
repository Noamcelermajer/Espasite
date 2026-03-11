#!/usr/bin/env python3
"""
Scrape UN2720 collected data JSON API and output a normalized JSON file.
Run: pip install -r requirements-scrape.txt && python scripts/scrape_un2720.py
Env: GCS_BUCKET, GCS_OBJECT (e.g. un2720.json) to upload; otherwise prints to stdout.
"""
from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timezone
from typing import Any, Dict, List

import requests

API_URL = "https://app.un2720.org/fetchCollectedData"


def parse_num(value: Any) -> int | float:
    if value is None:
        return 0
    s = str(value)
    s = s.replace(" ", "").replace(",", "")
    try:
        # Some fields are floats (e.g. weightTonnes)
        return float(s)
    except (ValueError, TypeError):
        return 0


def scrape() -> Dict[str, Any]:
    # Match dashboard date range behaviour (full history until today)
    params = {
        "start": "2025-05-19",
        "end": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
    }
    headers = {
        "referer": "https://app.un2720.org/tracking/collected",
        "user-agent": "ESPA-Israel-Scraper/1.0 (+https://www.espa-israel.com)",
        "accept": "application/json, text/plain, */*",
    }

    resp = requests.get(API_URL, params=params, headers=headers, timeout=60)
    resp.raise_for_status()
    raw = resp.json()

    # Top-level summary cards (exact values from API)
    summary = {
        "pallets": int(parse_num(raw.get("totalPallets"))),
        "trucks": int(parse_num(raw.get("totalTrucks"))),
        "weightTonnes": float(parse_num(raw.get("totalWeight"))),
        "numberOfRequests": int(parse_num(raw.get("totalUtns"))),
    }

    # Organizations: prefer orgTableData (normalized objects). Fallback to label/count arrays.
    orgs: List[Dict[str, Any]] = []

    table_data = raw.get("orgTableData")
    if isinstance(table_data, list) and table_data:
        for row in table_data:
            if not isinstance(row, dict):
                continue
            name = row.get("organization") or row.get("name") or row.get("org")
            if not name:
                continue
            orgs.append(
                {
                    "organization": str(name),
                    "trucks": int(parse_num(row.get("trucks") or row.get("truckCount"))),
                    "pallets": int(parse_num(row.get("pallets") or row.get("palletCount"))),
                    "weightTonnes": float(parse_num(row.get("weight") or row.get("weightTonnes"))),
                    "numberOfRequests": int(parse_num(row.get("utns") or row.get("requests") or 0)),
                }
            )
    else:
        labels = raw.get("orgLabels") or []
        truck_counts = raw.get("orgTruckCounts") or []
        pallet_counts = raw.get("orgPalletCounts") or []
        for idx, name in enumerate(labels):
            trucks = truck_counts[idx] if idx < len(truck_counts) else 0
            pallets = pallet_counts[idx] if idx < len(pallet_counts) else 0
            orgs.append(
                {
                    "organization": str(name),
                    "trucks": int(parse_num(trucks)),
                    "pallets": int(parse_num(pallets)),
                    # Weight / requests not directly available per org in this shape
                    "weightTonnes": 0.0,
                    "numberOfRequests": 0,
                }
            )

    # Attach full API payload for charts (daily trends, commodity pie, crossings, etc.)
    api_payloads = [
        {
            "url": API_URL,
            "body": raw,
        }
    ]

    return {
        "summary": summary,
        "organizations": orgs,
        "fetchedAt": datetime.now(tz=timezone.utc).isoformat(),
        "apiPayloads": api_payloads,
    }


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
