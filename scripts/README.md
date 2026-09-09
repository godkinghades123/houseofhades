# scripts/

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
