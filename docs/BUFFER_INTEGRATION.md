# Buffer Social Media Integration Guide

## Overview

HADES content cadence routing via Buffer API. Publishes market signals and trading updates to Instagram, X (Twitter), and TikTok programmatically.

**Part of:** Stage 1 execution — content shipping discipline  
**Status:** Staging (local + validated channels) → Production (live publishing)

---

## Setup

### 1. Get Buffer Channel IDs

1. Log into [buffer.com](https://buffer.com)
2. Go to **Settings → Social Accounts** and select each channel
3. Copy the **Channel ID** for:
   - Instagram
   - X (Twitter)
   - TikTok

### 2. Add Secrets to GitHub

Navigate to **Settings → Secrets and variables → Actions** and add:

| Secret | Value | Required |
|--------|-------|----------|
| `BUFFER_CHANNEL_INSTAGRAM` | Your Instagram channel ID | ✓ |
| `BUFFER_CHANNEL_X` | Your X channel ID | ✓ |
| `BUFFER_CHANNEL_TIKTOK` | Your TikTok channel ID | ✓ |
| `BUFFER_API_TOKEN` | Buffer API token (for production) | Optional* |
| `BUFFER_ENVIRONMENT` | `staging` or `production` | Optional |

*Required only for production mode (automatic API publishing).

### 3. Local Development

Create `.env` in repo root (never commit):

```bash
BUFFER_CHANNEL_INSTAGRAM=xxxxx
BUFFER_CHANNEL_X=yyyyy
BUFFER_CHANNEL_TIKTOK=zzzzz
BUFFER_API_TOKEN=your_token_here
BUFFER_ENVIRONMENT=staging
```

`.gitignore` already excludes `.env` and `.env.*`.

---

## Usage

### Python API (Direct)

```python
from scripts.survival.buffer_publisher import publish_signal

# Publish to X only
result = publish_signal(
    "NFLX showing reversal at $220 — Engine trade active 🔥",
    signal_id="SIG-2026-09-14-001",
    platforms=["x"]
)

print(result)
# {
#   "timestamp": "2026-09-14T08:29:30.123456",
#   "content_preview": "NFLX showing reversal at $220...",
#   "platforms": ["x"],
#   "status": "scheduled_staging",
#   "channel_ids": {"x": "yyyyy"},
#   "errors": []
# }
```

### Command Line

```bash
# Test configuration
python scripts/survival/buffer_config.py

# Publish from CLI
python scripts/survival/buffer_publisher.py "HADES Signal: Market discipline holds. Engine steady. 🔥"
```

### GitHub Actions (Automated)

#### Scheduled Cadence (Mon/Wed/Fri 9am UTC)

Automatically published by `.github/workflows/buffer-content-cadence.yml`.

#### Manual Dispatch

1. Go to **Actions → Buffer Content Cadence**
2. Click **Run workflow**
3. Fill in:
   - **Content:** Post text (max 280 chars for X)
   - **Platforms:** `x,instagram,tiktok` (default: `x`)
4. Submit

---

## Staging vs Production

### Staging (Default)

- Channel IDs validated locally
- **No live publishing** — logs only to `collector_log.jsonl`
- Safe for testing; no actual posts created
- **Use for:** Development, validation, testing

```bash
BUFFER_ENVIRONMENT=staging
```

### Production

- Actual Buffer API calls → live posts
- Requires `BUFFER_API_TOKEN`
- Failure halts workflow
- **Use for:** Content shipping, cadence automation

```bash
BUFFER_ENVIRONMENT=production
```

---

## File Structure

```
houseofhades/
├── .env.example                          # Template (commit this)
├── .env                                  # Local secrets (gitignored)
├── .github/
│   └── workflows/
│       └── buffer-content-cadence.yml    # Scheduled + manual publishing
├── scripts/survival/
│   ├── buffer_config.py                  # Config validation + env loading
│   ├── buffer_publisher.py               # Publishing API + logging
│   ├── collector_log.jsonl               # Publishing history (gitignored)
│   └── .gitignore                        # Excludes .env, *.local.json, logs
└── docs/
    └── BUFFER_INTEGRATION.md             # This file
```

---

## Logging & Debugging

### Collector Log

Every publish event (success or staging) logs to `scripts/survival/collector_log.jsonl`:

```json
{
  "event": "buffer_publish",
  "result": {
    "timestamp": "2026-09-14T08:29:30.123456",
    "content_preview": "NFLX reversal...",
    "platforms": ["x"],
    "status": "scheduled_staging",
    "channel_ids": {"x": "yyyyy"},
    "errors": []
  },
  "metadata": {"signal_id": "SIG-2026-09-14-001", "type": "market_signal"}
}
```

### Validation

Run validation anytime:

```bash
python scripts/survival/buffer_config.py
```

Output:

```
=== BUFFER INTEGRATION STATUS ===
Environment: staging
Instagram Channel: ✓
X Channel: ✓
TikTok Channel: ✓
API Token: ✗ (missing)

✓ All required channels configured
```

### Workflow Logs

1. Go to **Actions → Buffer Content Cadence**
2. Select a run
3. Click **Publish to Buffer** job for logs
4. Download artifact: **buffer-logs** (contains full `collector_log.jsonl`)

---

## Common Issues

### "BUFFER_CHANNEL_X not set"

**Fix:** Add `BUFFER_CHANNEL_X` secret to GitHub Actions settings.

```bash
# Verify locally:
python scripts/survival/buffer_config.py
```

### Production mode fails with API token error

**Fix:** Add `BUFFER_API_TOKEN` secret if using `BUFFER_ENVIRONMENT=production`.

For now, staging (default) is recommended—no token needed.

### Content not logging locally

**Fix:** Ensure `scripts/survival/collector_log.jsonl` has write permissions.

```bash
touch scripts/survival/collector_log.jsonl
chmod 644 scripts/survival/collector_log.jsonl
```

### Workflow doesn't run on schedule

**Fix:** GitHub Actions schedules only trigger on `main` branch.

Verify:
- Workflow file is in `main` branch
- GitHub Actions enabled in repo settings
- Repository is not archived

---

## Production Roadmap

- [ ] Add Buffer API token validation (production mode)
- [ ] Implement actual HTTP calls to Buffer REST API
- [ ] Add batch publishing (multiple posts per workflow)
- [ ] Notion integration: pull Signal Log posts → publish
- [ ] Analytics logging: track engagement (likes, shares, etc.)
- [ ] DM notification on publish success/failure
- [ ] A/B testing for content timing

---

## Reference

- **Buffer API Docs:** https://buffer.com/developers/api
- **Channel ID:** Settings → Social Accounts → [Account] → Channel ID
- **HADES Rules:** See `docs/CONTINUITY.md` for content brand/identity
- **HADES Execution Project:** GitHub Issues + Project board
