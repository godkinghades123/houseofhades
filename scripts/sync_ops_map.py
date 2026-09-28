#!/usr/bin/env python3
"""
Sync Ops Map meta from Notion Headquarters + GitHub Issues + optional live Engine.

Writes: dashboard/src/data/synced_meta.json

Required env:
  NOTION_API_KEY       - Notion internal integration token
  NOTION_HQ_PAGE_ID    - HADES Headquarters page ID (UUID)

Optional:
  GITHUB_TOKEN         - auto-provided in Actions; used for open issues
  GITHUB_REPO          - default godkinghades123/houseofhades
  TASTYTRADE_CLIENT_SECRET + TASTYTRADE_REFRESH_TOKEN
                       - when present, live Engine balances override HQ Net Liq parse
  TASTYTRADE_CLIENT_ID, TASTYTRADE_ACCOUNT_NUMBER, TASTYTRADE_ENV

HQ page is freeform. We pull plain text and parse Stage 1 numbers with regex.
Live Tastytrade is preferred for engine.netLiq when secrets are set.
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

# Allow `python scripts/sync_ops_map.py` to import tools.engine
sys.path.insert(0, str(REPO_ROOT))


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


_NUM = r"(\d[\d,]*(?:\.\d+)?)"  # 1,234.56 | 245.32 | 700 (no trailing '.', commas ok)


def parse_money(text: str, patterns: list[str], default: float) -> float:
    """First pattern whose capture group parses as a number.

    Patterns should capture with _NUM and stay on one line: use [^\\d\\n]{0,40}
    between the label and the number so a label can't grab a number from another line.
    """
    for pat in patterns:
        m = re.search(pat, text, re.I)
        if m:
            try:
                return float(m.group(1).replace(",", ""))
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


def try_live_engine() -> dict | None:
    """Pull live Engine balances when Tastytrade secrets are present. Soft-fail."""
    if not os.environ.get("TASTYTRADE_CLIENT_SECRET") or not os.environ.get(
        "TASTYTRADE_REFRESH_TOKEN"
    ):
        print("INFO: Tastytrade secrets not set — Engine Net Liq from HQ parse only")
        return None
    try:
        from tools.engine.client import fetch_engine_snapshot

        snap = fetch_engine_snapshot()
        print(
            f"INFO: Live Engine account={snap.get('accountNumber')} "
            f"netLiq={snap.get('netLiq')} env={snap.get('env')}",
            file=sys.stderr,
        )
        return snap
    except Exception as e:
        print(f"WARN: Live Engine pull failed — falling back to HQ parse: {e}", file=sys.stderr)
        return None


def main() -> None:
    if not NOTION_API_KEY or not NOTION_HQ_PAGE_ID:
        die("NOTION_API_KEY and NOTION_HQ_PAGE_ID must be set")

    text = fetch_hq_text(NOTION_HQ_PAGE_ID)
    print(f"HQ text length: {len(text)} chars")

    net_liq = parse_money(
        text,
        [
            r"Net Liq[^\d\n]{0,40}\$?" + _NUM,
            r"Tastytrade[^\d\n]{0,40}\$?" + _NUM,
        ],
        287.0,
    )
    keybank = parse_money(
        text,
        [r"KeyBank(?: HYSA)?[^\d\n]{0,40}~?\$?" + _NUM],
        65.0,
    )
    chime = parse_money(text, [r"Chime[^\d\n]{0,40}~?\$?" + _NUM], 10.0)
    groundfloor = parse_money(text, [r"Groundfloor[^\d\n]{0,40}~?\$?" + _NUM], 30.11)
    fidelity = parse_money(text, [r"Fidelity Go[^\d\n]{0,40}~?\$?" + _NUM], 80.0)

    engine_live = try_live_engine()
    options_bp = 110.0
    engine_source = "notion-hq-parse"
    account_number = None
    cash_balance = None

    if engine_live and engine_live.get("netLiq") is not None:
        net_liq = float(engine_live["netLiq"])
        if engine_live.get("optionsBuyingPower") is not None:
            options_bp = float(engine_live["optionsBuyingPower"])
        engine_source = "tastytrade-live"
        account_number = engine_live.get("accountNumber")
        cash_balance = engine_live.get("cashBalance")

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
            "updated": "Live" if engine_source == "tastytrade-live" else "HQ",
            "priority": "high",
        }
    )

    links = [
        {"number": i["number"], "title": i["name"], "url": i["url"]}
        for i in issues
        if i.get("url")
    ]

    high = sum(1 for i in issues if i["priority"] == "high")

    engine_block: dict = {
        "netLiq": net_liq,
        "phase": 1,
        "ytd": "red",
        "maxLossPct": 7,
        "optionsBuyingPower": options_bp,
        "rule": "Defined-risk options only",
        "source": engine_source,
    }
    if account_number:
        engine_block["accountNumber"] = account_number
    if cash_balance is not None:
        engine_block["cashBalance"] = cash_balance

    payload = {
        "syncedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": (
            "Notion HQ + GitHub Issues + Tastytrade Engine"
            if engine_source == "tastytrade-live"
            else "Notion HQ + GitHub Issues (sync_ops_map.py)"
        ),
        "engine": engine_block,
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
                "change": "Phase 1 · live" if engine_source == "tastytrade-live" else "Phase 1",
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
