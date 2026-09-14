#!/usr/bin/env python3
"""
Sync Ops Map meta from Notion Headquarters + GitHub Issues.

Writes: dashboard/src/data/synced_meta.json

Required env:
  NOTION_API_KEY       - Notion internal integration token
  NOTION_HQ_PAGE_ID    - HADES Headquarters page ID (UUID)

Optional:
  GITHUB_TOKEN         - auto-provided in Actions; used for open issues
  GITHUB_REPO          - default godkinghades123/houseofhades

HQ page is freeform markdown-ish blocks. We pull plain text and parse
known Stage 1 numbers with regex (Net Liq, KeyBank, etc.).
"""

from __future__ import annotations

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import requests

NOTION_API_KEY = os.environ.get("NOTION_API_KEY", "").strip()
NOTION_HQ_PAGE_ID = os.environ.get("NOTION_HQ_PAGE_ID", "").strip()
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "").strip()
GITHUB_REPO = os.environ.get("GITHUB_REPO", "godkinghades123/houseofhades")
NOTION_VERSION = "2022-06-28"

REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_FILE = REPO_ROOT / "dashboard" / "src" / "data" / "synced_meta.json"


def die(msg: str) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def notion_headers() -> dict:
    return {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    }


def block_plain_text(block: dict) -> str:
    btype = block.get("type")
    if not btype:
        return ""
    data = block.get(btype) or {}
    rich = data.get("rich_text") or data.get("text") or []
    if isinstance(rich, list):
        return "".join(t.get("plain_text", "") for t in rich)
    return ""


def fetch_hq_text(page_id: str) -> str:
    url = f"https://api.notion.com/v1/blocks/{page_id}/children?page_size=100"
    texts: list[str] = []
    while url:
        resp = requests.get(url, headers=notion_headers(), timeout=30)
        if resp.status_code != 200:
            die(f"Notion blocks error {resp.status_code}: {resp.text}")
        data = resp.json()
        for block in data.get("results", []):
            t = block_plain_text(block)
            if t:
                texts.append(t)
            if block.get("type") == "table_row":
                cells = block.get("table_row", {}).get("cells", [])
                row = []
                for cell in cells:
                    row.append("".join(p.get("plain_text", "") for p in cell))
                texts.append(" | ".join(row))
        next_cursor = data.get("next_cursor")
        if data.get("has_more") and next_cursor:
            url = (
                f"https://api.notion.com/v1/blocks/{page_id}/children"
                f"?page_size=100&start_cursor={next_cursor}"
            )
        else:
            url = ""
    return "\n".join(texts)


def parse_money(text: str, patterns: list[str], default: float) -> float:
    for pat in patterns:
        m = re.search(pat, text, re.I)
        if m:
            raw = m.group(1).replace(",", "")
            try:
                return float(raw)
            except ValueError:
                continue
    return default


def fetch_github_issues() -> list[dict]:
    if not GITHUB_TOKEN:
        print("WARN: GITHUB_TOKEN not set — keeping issue list empty")
        return []
    url = f"https://api.github.com/repos/{GITHUB_REPO}/issues?state=open&per_page=50"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    resp = requests.get(url, headers=headers, timeout=30)
    if resp.status_code != 200:
        # Soft-fail: HQ sync should still succeed if issues are blocked
        print(
            f"WARN: GitHub issues {resp.status_code} — proceeding without issue data. "
            f"Body: {resp.text[:300]}",
            file=sys.stderr,
        )
        return []
    issues = []
    for item in resp.json():
        if "pull_request" in item:
            continue
        title = item.get("title") or ""
        number = item.get("number")
        priority = "medium"
        low = title.lower()
        if number in (3, 5) or "blocker" in low or "trust" in low or "keybank" in low or "water" in low:
            priority = "high"
        if "optional" in low or number in (9, 11, 12):
            priority = "low"
        owner = "PP"
        if any(x in low for x in ("trust", "water", "keybank", "rent")):
            owner = "Javarous"
        if "cadence" in low or "content" in low:
            owner = "PP / Javarous"
        typ = "Task"
        if "watch" in low or "signal" in low or "journal" in low or "vici" in low or "hims" in low:
            typ = "Signal"
        if "watchlist" in low:
            typ = "Watchlist"
        updated = (item.get("updated_at") or "")[:10]
        issues.append(
            {
                "id": f"i{number}",
                "name": title,
                "type": typ,
                "status": "Open",
                "owner": owner,
                "updated": updated,
                "priority": priority,
                "number": number,
                "url": item.get("html_url"),
            }
        )
    return issues


def main() -> None:
    if not NOTION_API_KEY or not NOTION_HQ_PAGE_ID:
        die("NOTION_API_KEY and NOTION_HQ_PAGE_ID must be set")

    text = fetch_hq_text(NOTION_HQ_PAGE_ID)
    print(f"HQ text length: {len(text)} chars")

    net_liq = parse_money(
        text,
        [
            r"Net Liq[^\d]*([\d.]+)",
            r"Tastytrade[^\d]*([\d.]+)",
            r"Engine[^\d]*([\d.]+)",
        ],
        287.0,
    )
    keybank = parse_money(
        text,
        [r"KeyBank[^\d]*~?\$?([\d.]+)", r"KeyBank HYSA[^\d]*([\d.]+)"],
        65.0,
    )
    chime = parse_money(text, [r"Chime[^\d]*~?\$?([\d.]+)"], 10.0)
    groundfloor = parse_money(text, [r"Groundfloor[^\d]*~?\$?([\d.]+)"], 30.11)
    fidelity = parse_money(text, [r"Fidelity Go[^\d]*~?\$?([\d.]+)"], 80.0)

    issues = fetch_github_issues()
    open_count = len(issues)

    table_rows = [
        {
            "id": i["id"],
            "name": i["name"],
            "type": i["type"],
            "status": i["status"],
            "owner": i["owner"],
            "updated": i["updated"],
            "priority": i["priority"],
        }
        for i in issues
    ]
    table_rows.append(
        {
            "id": "eng",
            "name": "Engine Phase 1 risk discipline",
            "type": "Position",
            "status": "Active",
            "owner": "PP",
            "updated": "Live",
            "priority": "high",
        }
    )

    links = [
        {"number": i["number"], "title": i["name"], "url": i["url"]}
        for i in issues
        if i.get("url")
    ]

    high = sum(1 for i in issues if i["priority"] == "high")

    payload = {
        "syncedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "Notion HQ + GitHub Issues (sync_ops_map.py)",
        "engine": {
            "netLiq": net_liq,
            "phase": 1,
            "ytd": "red",
            "maxLossPct": 3,
            "optionsBuyingPower": 110,
            "rule": "Defined-risk options only",
        },
        "cash": {
            "chime": chime,
            "keybank": keybank,
            "keybankFloor": {"min": 700, "target": 2000},
            "fidelityGo": fidelity,
            "groundfloor": groundfloor,
        },
        "trustNotarized": "notariz" in text.lower()
        and "not started" not in text.lower()
        and "not notarized" not in text.lower(),
        "openIssueCount": open_count,
        "kpis": [
            {
                "label": "Engine Net Liq",
                "value": f"${net_liq:g}",
                "change": "Phase 1",
                "tone": "neutral",
            },
            {
                "label": "KeyBank Build",
                "value": f"${keybank:g}",
                "change": "Floor $700",
                "tone": "neutral",
            },
            {
                "label": "Open Issues",
                "value": str(open_count),
                "change": f"{high} high",
                "tone": "neutral",
            },
            {
                "label": "Watchlists",
                "value": "36",
                "change": "stable",
                "tone": "positive",
            },
        ],
        "tableRows": table_rows,
        "openIssueLinks": links,
    }

    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"Wrote {OUT_FILE}")

    gh_out = os.environ.get("GITHUB_OUTPUT")
    if gh_out:
        with open(gh_out, "a") as f:
            f.write("has_changes=true\n")


if __name__ == "__main__":
    main()
