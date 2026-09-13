#!/usr/bin/env python3
"""
debt_collector_scripts.py — Response templates + contact log

Generates short, firm, non-admitting response scripts and appends a simple
local log of collector contacts. Designed for Stage 1 reality.

NOT LEGAL ADVICE. Templates are decision aids only.
Verify with a licensed attorney before sending anything formal.
Do not admit the debt. Do not promise payments you cannot keep.

Usage:
  # List available scripts
  python scripts/survival/debt_collector_scripts.py list

  # Print a specific script
  python scripts/survival/debt_collector_scripts.py show dispute
  python scripts/survival/debt_collector_scripts.py show cease_comm
  python scripts/survival/debt_collector_scripts.py show validation
  python scripts/survival/debt_collector_scripts.py show payment_hold

  # Log a contact
  python scripts/survival/debt_collector_scripts.py log --who "XYZ Collections" --channel phone --notes "Called, asked for validation"

  # Show log
  python scripts/survival/debt_collector_scripts.py log --show

Log file default: scripts/survival/collector_log.jsonl  (local, not committed)
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

LOG_PATH = Path(__file__).resolve().parent / "collector_log.jsonl"

SCRIPTS: dict[str, dict[str, str]] = {
    "validation": {
        "title": "Debt Validation Request",
        "when": "First contact or when they claim you owe money",
        "body": (
            "I am writing to request validation of the debt you claim I owe.\n\n"
            "Please provide in writing:\n"
            "1. The name of the original creditor\n"
            "2. The account number (original and current)\n"
            "3. The amount you claim is owed, with an itemized breakdown\n"
            "4. Proof that you are licensed to collect in my state\n"
            "5. Proof that the statute of limitations has not expired\n\n"
            "Until I receive complete validation, I dispute this debt and "
            "request that you cease collection activity and reporting.\n\n"
            "This is not an acknowledgment of the debt.\n\n"
            "Sincerely,\n"
            "[Your Name]\n"
            "[Date]\n"
        ),
    },
    "dispute": {
        "title": "Formal Dispute",
        "when": "You do not recognize the debt or the amount is wrong",
        "body": (
            "I dispute the debt referenced in your recent communication.\n\n"
            "I do not acknowledge that I owe this amount. Please provide "
            "complete validation as required under applicable law, including "
            "the original creditor, account history, and itemized balance.\n\n"
            "Until validation is received and reviewed, do not contact me "
            "by phone regarding this matter. All further communication must "
            "be in writing.\n\n"
            "This letter is not an admission of liability.\n\n"
            "Sincerely,\n"
            "[Your Name]\n"
            "[Date]\n"
        ),
    },
    "cease_comm": {
        "title": "Cease Communication (phone/email)",
        "when": "Harassment, repeated calls, or you want only written contact",
        "body": (
            "I am requesting that you cease all telephone and electronic "
            "communication with me regarding this matter.\n\n"
            "All future communication must be in writing and sent by mail "
            "to the address on file.\n\n"
            "Continued phone or electronic contact after receipt of this "
            "request may violate applicable consumer protection laws.\n\n"
            "This is not an acknowledgment of any debt.\n\n"
            "Sincerely,\n"
            "[Your Name]\n"
            "[Date]\n"
        ),
    },
    "payment_hold": {
        "title": "No Payment Commitment",
        "when": "They push for a payment plan you cannot keep",
        "body": (
            "I am not able to commit to a payment plan at this time.\n\n"
            "Any payment I may make in the future will be made voluntarily "
            "and does not restart or extend any statute of limitations, "
            "nor does it constitute an admission of the full amount claimed.\n\n"
            "Please send all future correspondence in writing. Do not call.\n\n"
            "This communication is not an acknowledgment of the debt.\n\n"
            "Sincerely,\n"
            "[Your Name]\n"
            "[Date]\n"
        ),
    },
    "phone_script": {
        "title": "Live Phone Script (short)",
        "when": "They call and you answer",
        "body": (
            "I do not discuss debts over the phone.\n"
            "Please send all information in writing.\n"
            "I do not acknowledge any debt at this time.\n"
            "Goodbye.\n\n"
            "(Then hang up. Log the call immediately.)\n"
        ),
    },
}


def cmd_list() -> None:
    print("Available scripts:\n")
    for key, meta in SCRIPTS.items():
        print(f"  {key:15}  {meta['title']}")
        print(f"  {'':15}  When: {meta['when']}\n")


def cmd_show(name: str) -> None:
    if name not in SCRIPTS:
        print(f"Unknown script: {name}", file=sys.stderr)
        print("Use: list", file=sys.stderr)
        sys.exit(1)
    meta = SCRIPTS[name]
    print("=" * 60)
    print(meta["title"])
    print(f"When: {meta['when']}")
    print("=" * 60)
    print(meta["body"])
    print("-" * 60)
    print("NOT LEGAL ADVICE. Customize with real name/date. Review with an attorney if formal.")
    print("Do not admit the debt. Do not promise payments you cannot keep.")
    print("=" * 60)


def append_log(who: str, channel: str, notes: str) -> None:
    entry = {
        "ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "who": who,
        "channel": channel,
        "notes": notes,
    }
    with LOG_PATH.open("a") as f:
        f.write(json.dumps(entry) + "\n")
    print(f"Logged → {LOG_PATH}")
    print(json.dumps(entry, indent=2))


def show_log() -> None:
    if not LOG_PATH.exists():
        print("No log yet.")
        return
    print(f"Log: {LOG_PATH}\n")
    for line in LOG_PATH.read_text().splitlines():
        if not line.strip():
            continue
        try:
            e = json.loads(line)
            print(f"{e.get('ts')}  |  {e.get('who')}  |  {e.get('channel')}")
            if e.get("notes"):
                print(f"  notes: {e['notes']}")
        except json.JSONDecodeError:
            print(f"(raw) {line}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Debt collector response scripts + contact log (Stage 1)"
    )
    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("list", help="List available scripts")

    p_show = sub.add_parser("show", help="Print a script by name")
    p_show.add_argument(
        "name",
        choices=list(SCRIPTS.keys()),
        help="Script name",
    )

    p_log = sub.add_parser("log", help="Append or show contact log")
    p_log.add_argument("--who", help="Collector / agency name")
    p_log.add_argument(
        "--channel",
        choices=["phone", "mail", "email", "text", "other"],
        help="Contact channel",
    )
    p_log.add_argument("--notes", default="", help="What happened")
    p_log.add_argument("--show", action="store_true", help="Print existing log")

    args = parser.parse_args()

    if args.cmd == "list":
        cmd_list()
    elif args.cmd == "show":
        cmd_show(args.name)
    elif args.cmd == "log":
        if args.show:
            show_log()
        else:
            if not args.who or not args.channel:
                print("--who and --channel required to log a contact", file=sys.stderr)
                sys.exit(1)
            append_log(args.who, args.channel, args.notes)


if __name__ == "__main__":
    main()
