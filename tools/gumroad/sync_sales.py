"""
tools/gumroad/sync_sales.py
---------------------------
Pull Academy sales from Gumroad and optionally append a totals line
to Master Continuity (Notion) — append-only, bottom of page.

Env:
  HADES__GUMROAD              required
  NOTION_API_KEY              required for Continuity write
  NOTION_CONTINUITY_PAGE_ID   required for Continuity write
  GUMROAD_PRODUCT_ID          optional — filter to one Academy product
  GUMROAD_AFTER               optional — YYYY-MM-DD start of window
  GUMROAD_BEFORE              optional — YYYY-MM-DD end of window
  GUMROAD_DRY_RUN             if "1" / "true", print only (no Notion write)

Phase 1: truth snapshot only. No social posts, no product mutations.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

# Allow `python tools/gumroad/sync_sales.py` from repo root
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO_ROOT))

from tools.gumroad.client import (  # noqa: E402
    GumroadError,
    fetch_academy_snapshot,
)

NOTION_VERSION = "2022-06-28"


def eprint(*args):
    print(*args, file=sys.stderr)


def default_window() -> tuple[str, str]:
    """Last 7 full days ending today (UTC)."""
    today = date.today()
    after = (today - timedelta(days=7)).isoformat()
    before = today.isoformat()
    return after, before


def notion_append_paragraph(page_id: str, text: str) -> None:
    token = os.environ.get("NOTION_API_KEY", "").strip()
    if not token:
        raise SystemExit("NOTION_API_KEY required to write Continuity")

    url = f"https://api.notion.com/v1/blocks/{page_id}/children"
    payload = {
        "children": [
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {"content": text[:1900]},
                        }
                    ]
                },
            }
        ]
    }
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        method="PATCH",
        headers={
            "Authorization": f"Bearer {token}",
            "Notion-Version": NOTION_VERSION,
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            resp.read()
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise SystemExit(f"Notion append failed HTTP {e.code}: {detail}") from e


def format_continuity_line(snap: dict) -> str:
    s = snap["summary"]
    window = snap.get("window") or {}
    after = window.get("after") or "?"
    before = window.get("before") or "?"
    ts = snap.get("syncedAt") or datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")

    by = s.get("byProduct") or {}
    product_bits = "; ".join(
        f"{name}: {meta['count']} sales / ${meta['net']:g} net"
        for name, meta in by.items()
    ) or "no product split"

    return (
        f"[Gumroad Academy sync {ts}] Window {after} → {before}: "
        f"{s['saleCount']} sales · gross ${s['gross']:g} · net ${s['net']:g}. "
        f"{product_bits}. Source: gumroad-api (Phase 1 read-only)."
    )


def main() -> None:
    after = os.environ.get("GUMROAD_AFTER") or None
    before = os.environ.get("GUMROAD_BEFORE") or None
    if not after and not before:
        after, before = default_window()

    product_id = os.environ.get("GUMROAD_PRODUCT_ID") or None
    dry = (os.environ.get("GUMROAD_DRY_RUN") or "").lower() in ("1", "true", "yes")

    try:
        snap = fetch_academy_snapshot(
            after=after, before=before, product_id=product_id
        )
    except GumroadError as e:
        eprint(f"[gumroad] {e}")
        raise SystemExit(1) from e

    line = format_continuity_line(snap)
    print(json.dumps({"summary": snap["summary"], "line": line}, indent=2))

    if dry:
        eprint("[gumroad] DRY RUN — Continuity not updated")
        return

    page_id = (os.environ.get("NOTION_CONTINUITY_PAGE_ID") or "").strip()
    if not page_id:
        eprint(
            "[gumroad] NOTION_CONTINUITY_PAGE_ID not set — snapshot printed only, "
            "Continuity not updated"
        )
        return

    notion_append_paragraph(page_id, line)
    eprint(f"[gumroad] Appended sales totals to Continuity page {page_id[:8]}…")


if __name__ == "__main__":
    main()
