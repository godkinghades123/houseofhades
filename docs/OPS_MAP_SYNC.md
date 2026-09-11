# Ops Map Sync — Notion API key + GitHub

How the Atlanta Ops Map stays honest to Headquarters and open Issues.

## Files

| Path | Role |
|------|------|
| `dashboard/src/data/synced_meta.json` | Live KPIs, cash, open issues |
| `dashboard/src/data/live.ts` | Map pins + imports `synced_meta.json` |
| `scripts/sync_ops_map.py` | Pulls Notion HQ + GitHub Issues → writes JSON |
| `.github/workflows/ops-map-sync.yml` | Daily (and manual) Action |

## 1. Get a Notion API key (internal integration)

1. Open [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **New integration**
3. Name it e.g. `House of Hades Ops Sync`
4. Associate it with the workspace that holds HADES
5. Capabilities: enable **Read content** (write not required for this sync)
6. Submit → copy the **Internal Integration Secret** (starts with `secret_` or `ntn_`)

That secret is your **`NOTION_API_KEY`**. Treat it like a password.

## 2. Share Headquarters with the integration

Notion integrations cannot see a page until you share it:

1. Open **🏛 HADES Headquarters (CEO Dashboard)** in Notion
2. Click **•••** → **Connections** (or Share → Invite)
3. Add your integration **House of Hades Ops Sync**
4. Confirm it can view the page

Do the same for any other page/database you later add to the script (e.g. PP Learning Records).

## 3. Get the Headquarters page ID

From the browser URL:

```text
https://www.notion.so/c55194f27bfe4bc78b3ad12cb23bd22f
```

or

```text
https://www.notion.so/workspace/Name-c55194f27bfe4bc78b3ad12cb23bd22f
```

The **32-character hex** at the end is the page id:

```text
c55194f27bfe4bc78b3ad12cb23bd22f
```

Optional dashed form:

```text
c55194f2-7bfe-4bc7-8b3a-d12cb23bd22f
```

That value is **`NOTION_HQ_PAGE_ID`**.

## 4. Add secrets on GitHub

1. Repo **godkinghades123/houseofhades**
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** for each:

| Secret name | Value |
|-------------|--------|
| `NOTION_API_KEY` | Integration secret from step 1 |
| `NOTION_HQ_PAGE_ID` | Headquarters page id from step 3 |

Optional (already used by PP Learning Sync):

| Secret name | Value |
|-------------|--------|
| `NOTION_DATABASE_ID` | PP Learning Records database id |

`GITHUB_TOKEN` is provided automatically by Actions — do not create it yourself for this workflow.

## 5. Run the sync

**Manual**

1. **Actions** → **Ops Map Sync** → **Run workflow**
2. On success it commits `dashboard/src/data/synced_meta.json`
3. Vercel rebuilds the dashboard from `main`

**Scheduled**

- Daily at **09:15 UTC** via cron in `ops-map-sync.yml`

**Local test** (optional)

```bash
export NOTION_API_KEY="secret_..."
export NOTION_HQ_PAGE_ID="c55194f27bfe4bc78b3ad12cb23bd22f"
export GITHUB_TOKEN="ghp_..."   # classic PAT with repo read, or fine-grained issues read
python scripts/sync_ops_map.py
```

## 6. Same key for PP Learning Sync

`NOTION_API_KEY` can be shared by:

- Ops Map Sync (`NOTION_HQ_PAGE_ID`)
- PP Learning Sync (`NOTION_DATABASE_ID`)

Share **both** the Headquarters page and the PP Learning Records database with the same integration.

## Security

- Never commit the secret into the repo or Notion public pages
- If leaked: revoke the integration in Notion and create a new one; update the GitHub secret
- Prefer read-only capability until you need write
