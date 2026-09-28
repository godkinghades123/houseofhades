"""
create_post.py
---------------
Creates (or drafts) a Buffer post for HADES / House of Hades content.

HARD RULES ENFORCED BY THIS SCRIPT (do not bypass these — they exist because
the brand's own standard says "if it can't be assigned, it doesn't go up"):

  1. --pillar and --highlight are REQUIRED. Content with no pillar/highlight
     assignment cannot be created, even as a draft.

  2. The caption text must contain the mandatory hashtag close: #HADES #hadesmarkets

  3. Nothing goes LIVE (queued or scheduled) without --approved.
     Without --approved, the post is always created as a Buffer DRAFT
     (saveToDraft: true) regardless of --mode, so a human always reviews
     before it can publish.

  4. Every run is appended to approval_log.jsonl for an audit trail —
     who/what/when, never the Buffer token itself.

Usage:
    python tools/marketing/create_post.py \\
        --platform instagram \\
        --pillar "Market Commentary" \\
        --highlight "MARKET TIPS" \\
        --text-file caption.txt \\
        --mode queue \\
        --approved

Platforms map to channel IDs via env vars (see list_channels.py):
    BUFFER_CHANNEL_INSTAGRAM
    BUFFER_CHANNEL_X
    BUFFER_CHANNEL_TIKTOK
"""

import os
import re
import json
import argparse
import datetime

from buffer_client import graphql_request, eprint, BufferAPIError

VALID_PILLARS = {"Chart Education", "Hades Philosophy", "Market Commentary"}

VALID_HIGHLIGHTS = {
    "START HERE", "WINS", "LESSONS", "REVERSALS", "WATCHLIST",
    "MINDSET", "ASK YOURSELF", "JOURNEY", "MARKET TIPS", "THE BLUEPRINT",
}

MANDATORY_HASHTAGS = ["#HADES", "#hadesmarkets"]

CHANNEL_ENV_MAP = {
    "instagram": "BUFFER_CHANNEL_INSTAGRAM",
    "x": "BUFFER_CHANNEL_X",
    "tiktok": "BUFFER_CHANNEL_TIKTOK",
}

CREATE_POST_MUTATION = """
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    ... on PostActionSuccess {
      post {
        id
        text
        dueAt
        status
      }
    }
    ... on MutationError {
      message
    }
  }
}
"""

LOG_PATH = os.path.join(os.path.dirname(__file__), "approval_log.jsonl")


def resolve_channel_id(platform: str, explicit_id: str | None) -> str:
    if explicit_id:
        return explicit_id
    env_var = CHANNEL_ENV_MAP.get(platform)
    channel_id = os.environ.get(env_var) if env_var else None
    if not channel_id:
        raise SystemExit(
            f"No channel id for '{platform}'. Set {env_var} (run list_channels.py "
            f"to find it) or pass --channel-id."
        )
    return channel_id


def validate_content(pillar: str, highlight: str, text: str):
    errors = []
    if pillar not in VALID_PILLARS:
        errors.append(f"--pillar must be one of {sorted(VALID_PILLARS)}")
    if highlight not in VALID_HIGHLIGHTS:
        errors.append(f"--highlight must be one of {sorted(VALID_HIGHLIGHTS)}")
    for tag in MANDATORY_HASHTAGS:
        # Whole-tag match: "#hadesmarkets" must NOT satisfy "#HADES".
        if not re.search(re.escape(tag) + r"(?![A-Za-z0-9_])", text, re.I):
            errors.append(f"Caption is missing the mandatory hashtag close: {tag}")
    if errors:
        eprint("[blocked] This post violates HADES content rules:")
        for err in errors:
            eprint(f"  - {err}")
        raise SystemExit(1)


def log_run(record: dict):
    record["logged_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with open(LOG_PATH, "a") as f:
        f.write(json.dumps(record) + "\n")


def main():
    ap = argparse.ArgumentParser(description="Create a HADES post via Buffer.")
    ap.add_argument("--platform", required=True, choices=sorted(CHANNEL_ENV_MAP))
    ap.add_argument("--channel-id", help="Override the channel id directly.")
    ap.add_argument("--pillar", required=True, help="One of the 3 HADES content pillars.")
    ap.add_argument("--highlight", required=True, help="One of the 10 HADES IG highlights.")
    ap.add_argument("--text", help="Caption text (or use --text-file).")
    ap.add_argument("--text-file", help="Path to a file containing the caption text.")
    ap.add_argument(
        "--mode", choices=["queue", "schedule"], default="queue",
        help="queue = addToQueue, schedule = customScheduled (requires --due-at).",
    )
    ap.add_argument("--due-at", help="ISO 8601 datetime, required if --mode schedule.")
    ap.add_argument(
        "--approved", action="store_true",
        help="Human has reviewed and approved this post to go live. "
             "Without this flag the post is always saved as a Buffer draft.",
    )
    args = ap.parse_args()

    if args.text_file:
        with open(args.text_file) as f:
            text = f.read().strip()
    elif args.text:
        text = args.text
    else:
        raise SystemExit("Provide --text or --text-file.")

    validate_content(args.pillar, args.highlight, text)
    channel_id = resolve_channel_id(args.platform, args.channel_id)

    post_input = {
        "text": text,
        "channelId": channel_id,
        "schedulingType": "automatic",
        "mode": "addToQueue" if args.mode == "queue" else "customScheduled",
    }
    if args.mode == "schedule":
        if not args.due_at:
            raise SystemExit("--due-at is required when --mode schedule.")
        post_input["dueAt"] = args.due_at

    # Approval gate: unapproved content is always forced into Buffer's draft state.
    if not args.approved:
        post_input["saveToDraft"] = True
        eprint("[info] --approved not set — creating as a DRAFT for human review.")

    try:
        result = graphql_request(CREATE_POST_MUTATION, {"input": post_input})
    except BufferAPIError as e:
        eprint(f"[error] {e}")
        log_run({
            "platform": args.platform, "pillar": args.pillar,
            "highlight": args.highlight, "approved": args.approved,
            "mode": args.mode, "result": "error", "detail": str(e),
        })
        raise SystemExit(1)

    outcome = result.get("createPost", {})
    log_run({
        "platform": args.platform, "pillar": args.pillar,
        "highlight": args.highlight, "approved": args.approved,
        "mode": args.mode, "result": outcome,
    })

    if outcome.get("post"):
        post = outcome["post"]
        print(f"[ok] Post {post['id']} created — status: {post.get('status')}, "
              f"dueAt: {post.get('dueAt')}")
    else:
        eprint(f"[error] Buffer rejected the post: {outcome.get('message')}")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
