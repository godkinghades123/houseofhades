# Notion MCP v2.0.0 — PP Tool Mapping (House of Hades)

**Locked 2026-09-12.** Source: official `@notionhq/notion-mcp-server` v2.0.0.

Notion API 2025-09-03 made **data sources** the primary abstraction for what were previously called databases. The MCP server removed the old database tools and replaced them. PP must never hardcode the removed tool names.

## Breaking change summary

| Old Tool (v1.x)       | New Tool (v2.0)        | Parameter change                  |
|-----------------------|------------------------|-----------------------------------|
| `post-database-query` | `query-data-source`    | `database_id` → `data_source_id`  |
| `update-a-database`   | `update-a-data-source` | `database_id` → `data_source_id`  |
| `create-a-database`   | `create-a-data-source` | uses `parent.page_id`             |

**Still available:** `retrieve-a-database` — returns database metadata **including its data source IDs**. Use this first when you only have a database_id, then call the data-source tools with the real `data_source_id`.

### New tools added in v2

- `query-data-source`
- `retrieve-a-data-source`
- `update-a-data-source`
- `create-a-data-source`
- `list-data-source-templates`
- `move-page`
- `retrieve-a-database` (metadata + data source IDs)

Total tools: **22** (was 19).

### Search filter change

Filter values changed from `["page", "database"]` to `["page", "data_source"]`.

## PP operating rule

1. Prefer the new data-source tools for all query / schema / update work.
2. If only a classic `database_id` is known, call `retrieve-a-database` once to obtain the `data_source_id`(s), then proceed.
3. Do **not** reference or attempt `post-database-query`, `update-a-database`, or `create-a-database` — they no longer exist.
4. Page content as Markdown tools (`retrieve-page-markdown`, `update-page-markdown`) remain the preferred path for long Continuity / HQ / Signal Log edits (token-efficient). They require Notion-Version `2026-03-11` and are handled automatically by the server.

## Capability mapping (registry)

| PP Capability     | Preferred MCP tool(s)              |
|-------------------|------------------------------------|
| `db.query`        | `query-data-source`                |
| `db.update`       | `update-a-data-source`             |
| knowledge schema  | `retrieve-a-data-source`           |
| page create/move  | page tools + `move-page`           |
| full page rewrite | `update-page-markdown` (prefer)    |

## Installation / client note (for reference only)

PP itself does not publish the package. The official server is installed by clients via:

```bash
npx -y @notionhq/notion-mcp-server
```

with `NOTION_TOKEN` (or `OPENAPI_MCP_HEADERS`). House of Hades uses the connected Notion integration; no local publish step is required for PP operation.

## Why this lives in GitHub

Notion is the live memory plane. Tool names are an execution contract. Keeping the migration map in `docs/` + the tool-router registry prevents PP from regenerating dead tool calls after any client upgrades to MCP server ≥ 2.0.0.
