# HADES Marketing / Buffer Integration

Distribution layer for the Marketing/Brand agent. Reads a Buffer API token
from a secret and creates/schedules posts — but nothing goes live without
explicit human approval.

## Secret

| Name | `MARKETING__BRAND__AGENT` |
|------|---------------------------|
| Contains | Buffer API Bearer token (the value after `Authorization: Bearer ...`) |
| Where it lives | GitHub Actions repo secret, or local env var when running by hand |
| Where it's read | `buffer_client.py` via `os.environ["MARKETING__BRAND__AGENT"]` |

**Never commit the token. Never print it. Never put it in a log line.**

## Files

| File | Role |
|------|------|
| `buffer_client.py` | Shared GraphQL client (auth, request/error handling) |
| `list_channels.py` | One-time lookup: org ID + every connected channel ID/name/service |
| `create_post.py` | Creates a post, enforces HADES content rules, gates live action behind `--approved` |
| `approval_log.jsonl` | Append-only audit log (platform, pillar, highlight, approved flag, outcome — never the token) |

## Setup

1. Add the Buffer token as a repo secret named **`MARKETING__BRAND__AGENT`**  
   (Settings → Secrets and variables → Actions → New repository secret).
2. Locally: `export MARKETING__BRAND__AGENT="<token>"`
3. Run `python tools/marketing/list_channels.py` to get channel IDs for  
   Instagram (`@houseofhadesinc`), X (`@Javarous5`), and TikTok (`@hypejaay124`).
4. Set those as env vars (or pass `--channel-id` directly on each run):

```bash
export BUFFER_CHANNEL_INSTAGRAM="..."
export BUFFER_CHANNEL_X="..."
export BUFFER_CHANNEL_TIKTOK="..."
```

## Rules this integration enforces (not optional)

Matches the HADES Content Rules in the Master Continuity Document / Persephone Project Instructions:

- **Pillar + highlight required.** `--pillar` must be one of `Chart Education`, `Hades Philosophy`, `Market Commentary`. `--highlight` must be one of the ten Instagram highlights. If it can't be assigned, the script refuses to run — matching *"if it can't be assigned, it doesn't go up."*
- **Mandatory hashtag close.** Caption text must contain `#HADES` and `#hadesmarkets` or the script blocks the post.
- **Approval gate.** Without `--approved`, every post is created as a Buffer **draft** (`saveToDraft: true`) regardless of `--mode` — it cannot queue or schedule live. `--approved` is meant to be set only after a human (Javarous) has reviewed the exact caption and pillar/highlight assignment.
- **Two-layer captions.** This script does **not** generate captions — it only ships text that's handed to it. Layer 1 (HADES Standard) + Layer 2 (Black Wealth Initiative) must already be combined in the caption before it's passed via `--text` / `--text-file`.

## Example

```bash
python tools/marketing/create_post.py \
  --platform instagram \
  --pillar "Market Commentary" \
  --highlight "MARKET TIPS" \
  --text-file drafts/market_tip_005.txt \
  --mode queue \
  --approved
```

Drop `--approved` to save it as a draft in Buffer for review first — this is the recommended default until the approval workflow is battle-tested.

## Recommended workflow

1. Persephone (or you) drafts the full content package: Layer 1 + Layer 2 caption, pillar, highlight, script.
2. Save the caption to a file, review it.
3. Run `create_post.py` **without** `--approved` → lands as a Buffer draft.
4. Open Buffer, do a final human check.
5. Re-run with `--approved` (or approve directly inside Buffer) to queue/schedule.

## Known gaps / next steps

- No automated caption generation here on purpose — that stays a Persephone chat step, not a script, so a human is always in the loop on wording.
- `list_channels.py` and `create_post.py` are meant to be run manually or via a GitHub Actions workflow that's triggered manually (`workflow_dispatch`), not on a cron, until the approval process has been used a few times.
- Image/asset upload support can be added later; current scripts are text-first.

Logged: Sep 14, 2026 — Marketing distribution layer added to House of Hades OS.
