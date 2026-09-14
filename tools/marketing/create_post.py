#!/usr/bin/env python3
"""
Create / schedule a Buffer post for HADES Marketing agent.

Enforces:
  - pillar + highlight required
  - caption must contain #HADES and #hadesmarkets
  - without --approved → always saveToDraft (cannot go live)

Usage examples:
  python tools/marketing/create_post.py \\
    --platform instagram \\
    --pillar "Market Commentary" \\
    --highlight "MARKET TIPS" \\
    --text-file drafts/tip.txt \\
    --mode queue

  # After human review:
  ... same args ... --approved
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from buffer_client import BufferError, die, graphql

# --- HADES content rules ---
ALLOWED_PILLARS = {
    "Chart Education",
    "Hades Philosophy",
    "Market Commentary",
}

ALLOWED_HIGHLIGHTS = {
    "START HERE",
    "WINS",
    "LESSONS",
    "REVERSALS",
    "WATCHLIST",
    "MINDSET",
    "ASK YOURSELF",
    "JOURNEY",
    "MARKET TIPS",
    "THE BLUEPRINT",
}

PLATFORM_ENV = {
    "instagram": "BUFFER_CHANNEL_INSTAGRAM",
    "x": "BUFFER_CHANNEL_X",
    "twitter": "BUFFER_CHANNEL_X",
    "tiktok": "BUFFER_CHANNEL_TIKTOK",
}

MODE_MAP = {
    "queue": "addToQueue",
    "now": "shareNow",
    "schedule": "customScheduled",
}

CREATE_MUTATION = """
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    ... on PostActionSuccess {
      post {
        id
        text
        status
        dueAt
        channelId
      }
    }
    ... on MutationError {
      message
    }
  }
}
"""

LOG_PATH = Path(__file__).resolve().parent / "approval_log.jsonl"


def append_log(entry: dict) -> None:
    entry = dict(entry)
    entry["ts"] = datetime.now(timezone.utc).isoformat()
    # Never log secrets
    for key in list(entry.keys()):
        if "token" in key.lower() or "secret" in key.lower() or "bearer" in key.lower():
            entry.pop(key, None)
    with LOG_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def resolve_channel_id(platform: str, explicit: str | None) -> str:
    if explicit:
        return explicit.strip()
    env_key = PLATFORM_ENV.get(platform.lower())
    if not env_key:
        die(f"Unknown platform '{platform}'. Use: instagram, x, twitter, tiktok")
    cid = os.environ.get(env_key, "").strip()
    if not cid:
        die(
            f"No channel id for {platform}. Set {env_key} or pass --channel-id. "
            f"Run list_channels.py first."
        )
    return cid


def load_text(args: argparse.Namespace) -> str:
    if args.text_file:
        path = Path(args.text_file)
        if not path.is_file():
            die(f"Text file not found: {path}")
        return path.read_text(encoding="utf-8").strip()
    if args.text:
        return args.text.strip()
    die("Provide --text or --text-file")


def validate_content(text: str, pillar: str, highlight: str) -> None:
    if pillar not in ALLOWED_PILLARS:
        die(
            f"Invalid pillar '{pillar}'. Allowed: {', '.join(sorted(ALLOWED_PILLARS))}"
        )
    # Allow case-insensitive highlight match but store canonical
    hl_map = {h.upper(): h for h in ALLOWED_HIGHLIGHTS}
    if highlight.upper() not in hl_map:
        die(
            f"Invalid highlight '{highlight}'. Allowed: {', '.join(sorted(ALLOWED_HIGHLIGHTS))}"
        )
    if "#HADES" not in text or "#hadesmarkets" not in text.lower().replace(" ", ""):
        # Strict: both tags must appear (hadesmarkets case-insensitive)
        lower = text.lower()
        if "#hades" not in lower or "#hadesmarkets" not in lower:
            die(
                "Caption must contain mandatory hashtags #HADES and #hadesmarkets. "
                "Refusing to post."
            )


def build_input(
    *,
    text: str,
    channel_id: str,
    mode: str,
    approved: bool,
    due_at: str | None,
) -> dict:
    share_mode = MODE_MAP[mode]
    payload: dict = {
        "text": text,
        "channelId": channel_id,
        "schedulingType": "automatic",
        "mode": share_mode,
    }
    # Approval gate: without --approved always draft
    if not approved:
        payload["saveToDraft"] = True
    if mode == "schedule":
        if not due_at:
            die("--mode schedule requires --due-at (ISO 8601 UTC, e.g. 2026-09-15T14:00:00.000Z)")
        payload["dueAt"] = due_at
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(
        description="HADES Marketing — create Buffer post (draft by default)"
    )
    parser.add_argument(
        "--platform",
        required=True,
        choices=["instagram", "x", "twitter", "tiktok"],
        help="Target platform (maps to BUFFER_CHANNEL_* env)",
    )
    parser.add_argument("--pillar", required=True, help="Content pillar")
    parser.add_argument("--highlight", required=True, help="Instagram highlight name")
    parser.add_argument("--text", help="Caption text (include L1 + L2 + hashtags)")
    parser.add_argument("--text-file", help="Path to caption file")
    parser.add_argument(
        "--mode",
        choices=["queue", "now", "schedule"],
        default="queue",
        help="queue=addToQueue, now=shareNow, schedule=customScheduled",
    )
    parser.add_argument(
        "--due-at",
        help="ISO 8601 UTC when --mode schedule (e.g. 2026-09-15T14:00:00.000Z)",
    )
    parser.add_argument(
        "--channel-id",
        help="Override BUFFER_CHANNEL_* for this run",
    )
    parser.add_argument(
        "--approved",
        action="store_true",
        help="Human approved this exact caption. Without this flag, always draft.",
    )
    args = parser.parse_args()

    text = load_text(args)
    validate_content(text, args.pillar, args.highlight)
    channel_id = resolve_channel_id(args.platform, args.channel_id)

    # Canonical highlight for logging
    hl_canonical = {h.upper(): h for h in ALLOWED_HIGHLIGHTS}[args.highlight.upper()]

    post_input = build_input(
        text=text,
        channel_id=channel_id,
        mode=args.mode,
        approved=args.approved,
        due_at=args.due_at,
    )

    log_base = {
        "platform": args.platform,
        "pillar": args.pillar,
        "highlight": hl_canonical,
        "mode": args.mode,
        "approved": bool(args.approved),
        "channel_id": channel_id,
        "text_preview": text[:120].replace("\n", " "),
    }

    try:
        data = graphql(CREATE_MUTATION, {"input": post_input})
    except BufferError as e:
        append_log({**log_base, "outcome": "error", "error": str(e)})
        die(str(e))

    result = data.get("createPost") or {}
    if "message" in result and "post" not in result:
        # MutationError shape
        msg = result.get("message") or "Unknown Buffer mutation error"
        append_log({**log_base, "outcome": "mutation_error", "error": msg})
        die(msg)

    post = result.get("post") or {}
    post_id = post.get("id")
    status = post.get("status")
    due_at = post.get("dueAt")

    outcome = "draft" if not args.approved else args.mode
    append_log(
        {
            **log_base,
            "outcome": outcome,
            "post_id": post_id,
            "status": status,
            "due_at": due_at,
        }
    )

    print("ok")
    print(f"  post_id:  {post_id}")
    print(f"  status:   {status}")
    if due_at:
        print(f"  due_at:   {due_at}")
    print(f"  approved: {args.approved}")
    if not args.approved:
        print("  note: saved as Buffer DRAFT (no --approved). Review in Buffer, then re-run with --approved to queue/schedule.")


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    main()
