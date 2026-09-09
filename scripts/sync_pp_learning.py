#!/usr/bin/env python3
"""
Sync new/edited rows from the Notion "PP Learning Records" database into
House of Hades:
  - docs/LESSONS.md      <- every row touched since the last run (full log)
  - docs/PP_LEARNING.md  <- only rows whose Status is "Validated" or
                            "Permanent" (the durable-rule mirror)

State (the timestamp of the last successful run) is kept in
scripts/.pp_sync_state.json so each run only pulls what's new. On first run
(no state file), it looks back 7 days.

Required env vars:
  NOTION_API_KEY      - Notion internal integration token, shared with the
                         PP Learning Records database
  NOTION_DATABASE_ID  - the database (data source) ID for PP Learning Records

When run inside GitHub Actions, writes has_changes / entry_count / pr_body
to $GITHUB_OUTPUT so the workflow can decide whether to open a PR.
"""

import json
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import requests

NOTION_API_KEY = os.environ.get("NOTION_API_KEY")
NOTION_DATABASE_ID = os.environ.get("NOTION_DATABASE_ID")
NOTION_VERSION = "2022-06-28"

REPO_ROOT = Path(__file__).resolve().parent.parent
STATE_FILE = Path(__file__).resolve().parent / ".pp_sync_state.json"
LESSONS_FILE = REPO_ROOT / "docs" / "LESSONS.md"
PP_LEARNING_FILE = REPO_ROOT / "docs" / "PP_LEARNING.md"

DURABLE_STATUSES = {"Validated", "Permanent"}


def die(msg: str) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def load_last_run() -> str:
    if STATE_FILE.exists():
        data = json.loads(STATE_FILE.read_text())
        return data["last_run"]
    # First run: look back 7 days rather than pulling the entire history.
    fallback = datetime.now(timezone.utc) - timedelta(days=7)
    return fallback.strftime("%Y-%m-%dT%H:%M:%S.000Z")


def save_state(run_started_at: str) -> None:
    STATE_FILE.write_text(json.dumps({"last_run": run_started_at}, indent=2) + "\n")


def query_notion(since_iso: str) -> list[dict]:
    url = f"https://api.notion.com/v1/databases/{NOTION_DATABASE_ID}/query"
    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    }
    payload = {
        "filter": {
            "timestamp": "last_edited_time",
            "last_edited_time": {"after": since_iso},
        },
        "sorts": [{"timestamp": "created_time", "direction": "ascending"}],
        "page_size": 100,
    }
    results = []
    while True:
        resp = requests.post(url, headers=headers, json=payload, timeout=30)
        if resp.status_code != 200:
            die(f"Notion API error {resp.status_code}: {resp.text}")
        data = resp.json()
        results.extend(data.get("results", []))
        if not data.get("has_more"):
            break
        payload["start_cursor"] = data["next_cursor"]
    return results


# --- Notion property helpers -------------------------------------------------

def prop_title(props: dict, name: str) -> str:
    parts = props.get(name, {}).get("title", [])
    return "".join(p.get("plain_text", "") for p in parts).strip()


def prop_rich_text(props: dict, name: str) -> str:
    parts = props.get(name, {}).get("rich_text", [])
    return "".join(p.get("plain_text", "") for p in parts).strip()


def prop_select(props: dict, name: str) -> str:
    sel = props.get(name, {}).get("select")
    return sel["name"] if sel else ""


def prop_date(props: dict, name: str) -> str:
    d = props.get(name, {}).get("date")
    return d["start"] if d else ""


def prop_checkbox(props: dict, name: str) -> bool:
    return bool(props.get(name, {}).get("checkbox", False))


def prop_url(props: dict, name: str) -> str:
    return props.get(name, {}).get("url") or ""


def parse_row(page: dict) -> dict:
    props = page["properties"]
    return {
        "name": prop_title(props, "Name"),
        "date": prop_date(props, "Date"),
        "status": prop_select(props, "Status"),
        "category": prop_select(props, "Category"),
        "severity": prop_select(props, "Severity"),
        "recurrence": prop_checkbox(props, "Recurrence"),
        "root_cause": prop_rich_text(props, "Root Cause"),
        "correction": prop_rich_text(props, "Correction"),
        "regression_test": prop_rich_text(props, "Regression Test"),
        "signal_log_link": prop_url(props, "Signal Log Link"),
        "github_issue": prop_url(props, "GitHub Issue"),
        "notion_url": page.get("url", ""),
    }


# --- Markdown rendering ------------------------------------------------------

def render_lesson_entry(row: dict) -> str:
    lines = [f"### {row['name'] or '(untitled)'}"]
    meta = []
    if row["date"]:
        meta.append(f"**Date:** {row['date']}")
    if row["status"]:
        meta.append(f"**Status:** {row['status']}")
    if row["category"]:
        meta.append(f"**Category:** {row['category']}")
    if row["severity"]:
        meta.append(f"**Severity:** {row['severity']}")
    if row["recurrence"]:
        meta.append("**Recurrence:** yes")
    if meta:
        lines.append(" · ".join(meta))
    if row["root_cause"]:
        lines.append(f"- **Root cause:** {row['root_cause']}")
    if row["correction"]:
        lines.append(f"- **Correction:** {row['correction']}")
    if row["regression_test"]:
        lines.append(f"- **Regression test:** {row['regression_test']}")
    links = []
    if row["signal_log_link"]:
        links.append(f"[Signal Log]({row['signal_log_link']})")
    if row["github_issue"]:
        links.append(f"[GitHub Issue]({row['github_issue']})")
    if row["notion_url"]:
        links.append(f"[Notion record]({row['notion_url']})")
    if links:
        lines.append(f"- **Links:** {' · '.join(links)}")
    lines.append("")
    return "\n".join(lines)


def render_rule_entry(row: dict) -> str:
    lines = [f"### {row['name'] or '(untitled)'}"]
    if row["correction"]:
        lines.append(row["correction"])
    elif row["root_cause"]:
        lines.append(row["root_cause"])
    if row["category"]:
        lines.append(f"_Category: {row['category']}_")
    lines.append(f"_Source: [Notion record]({row['notion_url']})_")
    lines.append("")
    return "\n".join(lines)


def append_section(path: Path, heading: str, body: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    existing = path.read_text() if path.exists() else f"# {path.stem}\n\n"
    if not existing.endswith("\n\n"):
        existing = existing.rstrip("\n") + "\n\n"
    existing += f"## {heading}\n\n{body}"
    path.write_text(existing)


def set_output(name: str, value: str) -> None:
    gh_out = os.environ.get("GITHUB_OUTPUT")
    if not gh_out:
        return
    # Multiline-safe GitHub Actions output format.
    delim = "PP_SYNC_EOF"
    with open(gh_out, "a") as f:
        f.write(f"{name}<<{delim}\n{value}\n{delim}\n")


def main() -> None:
    if not NOTION_API_KEY or not NOTION_DATABASE_ID:
        die("NOTION_API_KEY and NOTION_DATABASE_ID must be set")

    run_started_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    since_iso = load_last_run()
    pages = query_notion(since_iso)

    if not pages:
        print("No new or edited PP Learning records since last run.")
        save_state(run_started_at)
        set_output("has_changes", "false")
        set_output("entry_count", "0")
        return

    rows = [parse_row(p) for p in pages]
    batch_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    lessons_body = "\n".join(render_lesson_entry(r) for r in rows)
    append_section(LESSONS_FILE, f"Sync batch — {batch_date}", lessons_body)

    durable_rows = [r for r in rows if r["status"] in DURABLE_STATUSES]
    if durable_rows:
        rules_body = "\n".join(render_rule_entry(r) for r in durable_rows)
        append_section(PP_LEARNING_FILE, f"Sync batch — {batch_date}", rules_body)

    save_state(run_started_at)

    pr_body_lines = [
        f"Automated PP Learning sync — {len(rows)} record(s) touched since {since_iso}.",
        "",
        f"- Logged to `docs/LESSONS.md`: {len(rows)}",
        f"- Promoted to `docs/PP_LEARNING.md` (Validated/Permanent): {len(durable_rows)}",
        "",
        "Review before merging — this mirrors Notion, it doesn't validate the rules.",
    ]
    set_output("has_changes", "true")
    set_output("entry_count", str(len(rows)))
    set_output("pr_body", "\n".join(pr_body_lines))

    print(
        f"Synced {len(rows)} record(s), {len(durable_rows)} promoted to PP_LEARNING.md."
    )


if __name__ == "__main__":
    main()
