#!/usr/bin/env python3
"""
Zero-dependency HANDOFF protocol for House of Hades Agent Registry.

No CrewAI, no API keys. Formats handoffs and reads a local colony snapshot
so Stage 1 coordination works even when LLM multi-agent is offline.

Usage:
  python pp/crew/handoff_runner.py
  python pp/crew/handoff_runner.py --needs-human
  python pp/crew/handoff_runner.py --format-handoff --from Persephone --from-realm "Hades Office" \
      --to "Thanatos Veyr" --to-realm Tartarus --what "..." --where "..."
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
SNAPSHOT = Path(__file__).resolve().parent / "colony_snapshot.json"

# Seed mirrors Notion Agent Registry when offline (update when registry changes)
DEFAULT_COLONY: list[dict[str, Any]] = [
    {"name": "Persephone", "realm": "Hades Office", "status": "Working",
     "notes": "Orchestrator. Issues handoffs."},
    {"name": "Thanatos Veyr", "realm": "Tartarus", "status": "Working",
     "notes": "TASK 001.1 tool-router + agent.registry"},
    {"name": "Helveth", "realm": "Judgment Hall", "status": "Needs Human",
     "notes": "Trust not notarized"},
    {"name": "Mictlanor", "realm": "Judgment Hall", "status": "Needs Human",
     "notes": "Priority enforcement on open items"},
    {"name": "Necrothys", "realm": "Tartarus", "status": "Idle",
     "notes": "Signal & engine execution — Phase 1 only"},
    {"name": "Morveth", "realm": "Asphodel", "status": "Idle",
     "notes": "Research synthesis"},
    {"name": "Yamaeth", "realm": "Asphodel", "status": "Idle",
     "notes": "Long-term theses"},
    {"name": "Acheron Vail", "realm": "Elysium", "status": "Idle",
     "notes": "Content production — draft only"},
    {"name": "Melinoë Rhad", "realm": "Elysium", "status": "Idle",
     "notes": "Philosophy / Journey"},
    {"name": "Styxion", "realm": "Styx", "status": "Idle",
     "notes": "Distribution — draft-by-default"},
    {"name": "Anubarak", "realm": "Styx", "status": "Idle",
     "notes": "Outer-world brand"},
    {"name": "Thanagor", "realm": "The Ship / Crossing", "status": "Idle",
     "notes": "Handoffs · realm transfers"},
]

STATUS_VOCAB = {"Working", "Needs Human", "Blocked", "Idle", "Done", "Archived"}


def load_colony() -> list[dict[str, Any]]:
    if SNAPSHOT.exists():
        return json.loads(SNAPSHOT.read_text(encoding="utf-8"))
    return list(DEFAULT_COLONY)


def format_handoff(
    from_name: str,
    from_realm: str,
    to_name: str,
    to_realm: str,
    what: str,
    where: str,
    sender_status_after: str = "Working",
) -> str:
    if sender_status_after not in STATUS_VOCAB:
        raise ValueError(f"Invalid status: {sender_status_after}")
    return (
        f"HANDOFF\n"
        f"From: {from_name} · {from_realm}\n"
        f"To:   {to_name} · {to_realm}\n"
        f"What: {what}\n"
        f"Where: {where}\n"
        f"Status after handoff (sender): {sender_status_after}\n"
    )


def needs_human(colony: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [a for a in colony if a.get("status") == "Needs Human"]


def blocked(colony: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [a for a in colony if a.get("status") == "Blocked"]


def main() -> None:
    p = argparse.ArgumentParser(description="HADES HANDOFF protocol runner")
    p.add_argument("--needs-human", action="store_true", help="List Needs Human agents")
    p.add_argument("--blocked", action="store_true", help="List Blocked agents")
    p.add_argument("--format-handoff", action="store_true")
    p.add_argument("--from", dest="from_name", default="Persephone")
    p.add_argument("--from-realm", default="Hades Office")
    p.add_argument("--to", dest="to_name", default="")
    p.add_argument("--to-realm", default="")
    p.add_argument("--what", default="")
    p.add_argument("--where", default="Agent Registry + Continuity")
    p.add_argument("--write-snapshot", action="store_true", help="Write default colony_snapshot.json")
    args = p.parse_args()

    if args.write_snapshot:
        SNAPSHOT.write_text(json.dumps(DEFAULT_COLONY, indent=2) + "\n", encoding="utf-8")
        print(f"Wrote {SNAPSHOT}")
        return

    if args.format_handoff:
        if not (args.to_name and args.to_realm and args.what):
            p.error("--format-handoff requires --to --to-realm --what")
        print(
            format_handoff(
                args.from_name,
                args.from_realm,
                args.to_name,
                args.to_realm,
                args.what,
                args.where,
            )
        )
        return

    colony = load_colony()
    if args.needs_human or args.blocked:
        rows = needs_human(colony) if args.needs_human else blocked(colony)
        label = "Needs Human" if args.needs_human else "Blocked"
        if not rows:
            print(f"No agents in status: {label}")
            return
        print(f"=== {label} ({len(rows)}) — Needs the Duke ===")
        for a in rows:
            print(f"  · {a['name']} ({a['realm']}) — {a.get('notes', '')[:80]}")
        return

    # Default: status board
    print("=== Underworld Colony (local snapshot) ===")
    print("Source of truth remains Notion Agent Registry.\n")
    by_status: dict[str, list] = {}
    for a in colony:
        by_status.setdefault(a.get("status", "Idle"), []).append(a)
    for status in ("Needs Human", "Blocked", "Working", "Idle", "Done", "Archived"):
        rows = by_status.get(status, [])
        if not rows:
            continue
        print(f"{status} ({len(rows)})")
        for a in rows:
            print(f"  · {a['name']:20} {a['realm']}")
        print()


if __name__ == "__main__":
    main()
