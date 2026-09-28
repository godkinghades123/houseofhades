# Gumroad — HADES Academy (Phase 1, read-only)

Pulls **products** and **sales** for the HADES Underworld Education Academy.
Posts a weekly totals line to **Master Continuity** (append-only).

**Does not:** create/edit products, refund, change price, auto-publish to social.

## Secret

| Name | Required |
|------|----------|
| `HADES__GUMROAD` | yes — Gumroad OAuth access token |
| `NOTION_API_KEY` | yes for Continuity write |
| `NOTION_CONTINUITY_PAGE_ID` | yes for Continuity write |

Optional:

| Name | Purpose |
|------|---------|
| `GUMROAD_PRODUCT_ID` | Filter sales to one Academy product |
| `GUMROAD_AFTER` / `GUMROAD_BEFORE` | `YYYY-MM-DD` window (default last 7 days) |
| `GUMROAD_DRY_RUN` | `1` = print only, no Notion write |

## Local test

```bash
export HADES__GUMROAD=...
python -m tools.gumroad.client

# Sales window + Continuity dry run
export GUMROAD_DRY_RUN=1
python tools/gumroad/sync_sales.py
```

Expect real Academy sale counts. Zero sales is valid Stage 1 truth — report it, do not invent.

## Workflow

`.github/workflows/gumroad-academy-sync.yml` — weekly (or manual). Uses the secrets above.

## Ownership

Revenue truth → Treasury / HQ. Content about sales still goes through Marketing gates if posted publicly.
