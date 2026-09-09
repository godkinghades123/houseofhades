#!/usr/bin/env python3
"""
PP Learning Sync — Notion → GitHub docs mirror.

Reads the Notion database set by NOTION_DATABASE_ID (PP Learning Records),
appends new/changed entries into docs/LESSONS.md (Synced from Notion section),
and records state in scripts/.pp_sync_state.json so the same page is not
duplicated forever.

GitHub Actions sets:
  steps.sync.outputs.has_changes
  steps.sync.outputs.entry_count
  steps.sync.outputs.pr_body

Requires:
  NOTION_API_KEY      — Notion integration secret
  NOTION_DATABASE_ID  — database id (32-char hex, with or without dashes)
"""

from __future__ import annotations

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / "docs" / "LESSONS.md"
PP_LEARNING = ROOT / "docs" / "PP_LEARNING.md"
STATE_PATH = ROOT / "scripts" / ".pp_sync_state.json"
NOTION_VERSION = "2022-06-28"


def gh_output(name: str, value: str) -> None:
    """Write a workflow step output (multiline-safe)."""
    out = os.environ.get("GITHUB_OUTPUT")
    if not out:
        print(f"::notice::{name}={value[:200]}")
        return
    # multiline delimiter
    if "\n" in value:
        delim = "EOF_PP_SYNC"
        with open(out, "a", encoding="utf-8") as f:
            f.write(f"{name}<<{delim}\n{value}\n{delim}\n")
    else:
        with open(out, "a", encoding="utf-8") as f:
            f.write(f"{name}={value}\n")


def load_state() -> dict:
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text(encoding="utf-8"))
    return {"pages": {}}


def save_state(state: dict) -> None:
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(state, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def notion_headers(token: str) -> dict:
    return {
        "Authorization": f"Bearer {token}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    }


def normalize_db_id(raw: str) -> str:
    h = re.sub(r"[^0-9a-fA-F]", "", raw)
    if len(h) != 32:
        return raw.strip()
    return f"{h[0:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"


def plain_rich(prop: dict | None) -> str:
    if not prop:
        return ""
    t = prop.get("type")
    if t == "title":
        return "".join(x.get("plain_text", "") for x in prop.get("title", []))
    if t == "rich_text":
        return "".join(x.get("plain_text", "") for x in prop.get("rich_text", []))
    if t == "select":
        sel = prop.get("select")
        return (sel or {}).get("name", "") if sel else ""
    if t == "multi_select":
        return ", ".join(x.get("name", "") for x in prop.get("multi_select", []))
    if t == "status":
        st = prop.get("status")
        return (st or {}).get("name", "") if st else ""
    if t == "url":
        return prop.get("url") or ""
    if t == "date":
        d = prop.get("date") or {}
        return d.get("start") or ""
    if t == "number":
        n = prop.get("number")
        return "" if n is None else str(n)
    if t == "checkbox":
        return "yes" if prop.get("checkbox") else "no"
    return ""


def query_all(db_id: str, token: str) -> list[dict]:
    url = f"https://api.notion.com/v1/databases/{db_id}/query"
    results: list[dict] = []
    cursor = None
    while True:
        body: dict = {"page_size": 100}
        if cursor:
            body["start_cursor"] = cursor
        r = requests.post(url, headers=notion_headers(token), json=body, timeout=60)
        if r.status_code == 404:
            # try without reformatting
            raise SystemExit(
                f"Notion database not found (404). Check NOTION_DATABASE_ID and "
                f"that the integration is shared on the database. body={r.text[:300]}"
            )
        r.raise_for_status()
        data = r.json()
        results.extend(data.get("results", []))
        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")
    return results


def page_snapshot(page: dict) -> dict:
    props = page.get("properties") or {}
    # Flexible property names — match common PP Learning fields
    def first(*names: str) -> str:
        lower = {k.lower(): k for k in props}
        for n in names:
            k = lower.get(n.lower())
            if k:
                return plain_rich(props[k])
        # fallback: any title
        for k, v in props.items():
            if v.get("type") == "title":
                return plain_rich(v)
        return page.get("id", "")

    return {
        "id": page.get("id", ""),
        "url": page.get("url", ""),
        "last_edited": page.get("last_edited_time", ""),
        "title": first("Name", "Title", "Signal", "Lesson", "Summary"),
        "category": first("Category", "Type", "Class"),
        "status": first("Status", "Level", "Validation"),
        "root_cause": first("Root Cause", "Root cause", "Cause"),
        "correction": first("Correction", "Fix", "Rule"),
        "notes": first("Notes", "Description", "Thesis", "Body"),
    }


def format_block(entry: dict) -> str:
    lines = [
        f"### {entry['title'] or entry['id']}",
        f"- **Notion id:** `{entry['id']}`",
        f"- **Edited:** {entry['last_edited']}",
    ]
    if entry.get("url"):
        lines.append(f"- **URL:** {entry['url']}")
    if entry.get("category"):
        lines.append(f"- **Category:** {entry['category']}")
    if entry.get("status"):
        lines.append(f"- **Status:** {entry['status']}")
    if entry.get("root_cause"):
        lines.append(f"- **Root cause:** {entry['root_cause']}")
    if entry.get("correction"):
        lines.append(f"- **Correction:** {entry['correction']}")
    if entry.get("notes"):
        lines.append(f"- **Notes:** {entry['notes']}")
    lines.append("")
    return "\n".join(lines)


def ensure_section(md: str, heading: str) -> str:
    if heading in md:
        return md
    return md.rstrip() + f"\n\n{heading}\n\n_Synced automatically from Notion PP Learning Records._\n\n"


def upsert_blocks(md: str, heading: str, blocks: list[tuple[str, str]]) -> str:
    """Replace or append blocks keyed by Notion id under heading."""
    md = ensure_section(md, heading)
    for page_id, block in blocks:
        marker = f"`{page_id}`"
        # remove old block for this id if present (simple heuristic)
        pattern = re.compile(
            rf"### .*?\n(?:- \*\*.*?\n)*?- \*\*Notion id:\*\* `{re.escape(page_id)}`\n(?:- \*\*.*?\n)*\n",
            re.MULTILINE,
        )
        md = pattern.sub("", md)
        # append under section
        if heading in md:
            parts = md.split(heading, 1)
            md = parts[0] + heading + parts[1].rstrip() + "\n\n" + block + "\n"
        else:
            md = md + "\n" + block
    return md


def main() -> int:
    token = os.environ.get("NOTION_API_KEY", "").strip()
    db_raw = os.environ.get("NOTION_DATABASE_ID", "").strip()

    if not token or not db_raw:
        print("NOTION_API_KEY and NOTION_DATABASE_ID are required.", file=sys.stderr)
        gh_output("has_changes", "false")
        gh_output("entry_count", "0")
        gh_output("pr_body", "Missing Notion secrets — sync skipped.")
        return 1

    db_id = normalize_db_id(db_raw)
    state = load_state()
    pages_state: dict = state.setdefault("pages", {})

    try:
        raw_pages = query_all(db_id, token)
    except requests.HTTPError as e:
        print(f"Notion query failed: {e} {getattr(e.response, 'text', '')[:400]}", file=sys.stderr)
        gh_output("has_changes", "false")
        gh_output("entry_count", "0")
        gh_output("pr_body", f"Notion query failed: {e}")
        return 1

    changed: list[dict] = []
    for page in raw_pages:
        snap = page_snapshot(page)
        pid = snap["id"]
        prev = pages_state.get(pid)
        if prev and prev.get("last_edited") == snap["last_edited"]:
            continue
        changed.append(snap)
        pages_state[pid] = {
            "last_edited": snap["last_edited"],
            "title": snap["title"],
        }

    if not changed:
        print("No new/edited learning records.")
        gh_output("has_changes", "false")
        gh_output("entry_count", "0")
        gh_output("pr_body", "No Notion learning records changed since last sync.")
        return 0

    lessons = LESSONS.read_text(encoding="utf-8") if LESSONS.exists() else "# PP lessons\n"
    heading = "## Synced from Notion (PP Learning Records)"
    blocks = [(c["id"], format_block(c)) for c in changed]
    lessons = upsert_blocks(lessons, heading, blocks)
    LESSONS.write_text(lessons if lessons.endswith("\n") else lessons + "\n", encoding="utf-8")

    # Light touch on PP_LEARNING.md — stamp last sync only
    if PP_LEARNING.exists():
        stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
        text = PP_LEARNING.read_text(encoding="utf-8")
        line = f"\n\n<!-- last_pp_learning_sync: {stamp} | records_touched: {len(changed)} -->\n"
        text = re.sub(r"\n<!-- last_pp_learning_sync:.*?-->\n", "\n", text)
        PP_LEARNING.write_text(text.rstrip() + line, encoding="utf-8")

    state["last_sync"] = datetime.now(timezone.utc).isoformat()
    save_state(state)

    titles = ", ".join((c["title"] or c["id"][:8]) for c in changed[:10])
    pr_body = (
        f"Automated PP Learning Sync mirrored **{len(changed)}** new/edited Notion record(s).\n\n"
        f"Titles: {titles}\n\n"
        f"Source database: `{db_id}`\n"
        f"Review before merge. Notion remains memory; GitHub holds durable lesson mirrors."
    )
    gh_output("has_changes", "true")
    gh_output("entry_count", str(len(changed)))
    gh_output("pr_body", pr_body)
    print(f"Synced {len(changed)} record(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
