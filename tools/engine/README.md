# Engine (Tastytrade) — read-only

Phase 1 only: **balances** + **balance-snapshots**. No order submission.

## Account lock

1. Create an OAuth client under **your** tastytrade login  
   (Manage → My Profile → API → OAuth Applications).
2. Store secrets in GitHub Actions / env (never commit).
3. Client always calls `GET /customers/me/accounts` first.
4. Optional hard lock: set `TASTYTRADE_ACCOUNT_NUMBER`. Mismatch aborts.

## Secrets

| Name | Required |
|------|----------|
| `TASTYTRADE_CLIENT_SECRET` | yes |
| `TASTYTRADE_REFRESH_TOKEN` | yes |
| `TASTYTRADE_CLIENT_ID` | optional |
| `TASTYTRADE_ACCOUNT_NUMBER` | recommended |
| `TASTYTRADE_ENV` | optional (`prod` default, or `cert`) |

## Local test

```bash
export TASTYTRADE_CLIENT_SECRET=...
export TASTYTRADE_REFRESH_TOKEN=...
export TASTYTRADE_ACCOUNT_NUMBER=5WTxxxxx   # optional hard lock
python -m tools.engine.client
```

Expect Net Liq in the Stage 1 range (~$287) if tokens are production and yours.

## Dashboard

`scripts/sync_ops_map.py` calls `fetch_engine_snapshot()` when secrets are present and writes live `engine.netLiq` into `dashboard/src/data/synced_meta.json`.
