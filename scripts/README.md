# scripts/

## Survival toolkit (`scripts/survival/`)

Stage 1 operating tools — **not legal advice**.

| Script | Purpose |
|--------|---------|
| `stop_the_bleed_triage.py` | Rank cash leaks, prioritize next action |
| `debt_collector_scripts.py` | Response templates + local contact log |

```bash
python scripts/survival/stop_the_bleed_triage.py
python scripts/survival/debt_collector_scripts.py list
```

See [`survival/README.md`](survival/README.md).

---

## `sync_pp_learning.py`

Used by [`.github/workflows/pp-learning-sync.yml`](../.github/workflows/pp-learning-sync.yml).

### Secrets (repo → Settings → Secrets and variables → Actions)

| Secret | Value |
|--------|--------|
| `NOTION_API_KEY` | Notion internal integration token |
| `NOTION_DATABASE_ID` | PP Learning Records database ID |

Share the integration with that database in Notion (Connect to / Connections).

### Local test

```bash
export NOTION_API_KEY=secret_...
export NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
python scripts/sync_pp_learning.py
```
