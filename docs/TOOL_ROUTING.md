# PP Tool Routing (House of Hades)

Permanent architecture. Implementation: [`pp/tool-router/`](../pp/tool-router/) + [`pp/tool-intelligence/`](../pp/tool-intelligence/).

## Goal

Stop expensive “which of 80 functions?” reasoning. Run a **cheap registry search** first; load only matched tools. Then apply **learned scores** and permanent lessons.

## Flow

```
USER → PP CORE → TOOL ROUTER (fast) → scores + lessons check → GitHub | Notion | … → RESULT → SELF-CHECK → history / learning log
```

## Levels

| Level | When | Cost |
|-------|------|------|
| 1 Exact | Known phrase | Lowest |
| 2 Capability / hard rule | Clear intent | Low |
| 3 Discovery | Ambiguous | Higher — last resort |

## Hard rules (summary)

- **Repo / commit / push / GitHub issue** → GitHub  
- **Continuity / Signal Log / Treasury / HQ data** → Notion  
- **Issue + link to Notion** → GitHub then Notion  
- **Remind me / every 2 days** → Automations  
- **How is the market today** → Notion Vault snapshots + Web news  

## Capability map (short)

| Capability | Tool |
|------------|------|
| repo.modify / issue.* | GitHub |
| knowledge.* / db.* / data_source.* | Notion |
| market.brief | Web + Notion |
| reminder.create | Automations |

## Notion MCP v2.0.0 (data sources)

As of MCP server ≥ 2.0.0 the old database tools are **removed**:

| Removed (v1)          | Use instead              |
|-----------------------|--------------------------|
| `post-database-query` | `query-data-source`      |
| `update-a-database`   | `update-a-data-source`   |
| `create-a-database`   | `create-a-data-source`   |

Always pass `data_source_id` (not `database_id`) for query/update. If only a database_id is known, call `retrieve-a-database` first to obtain the data source ID(s). Full map: [`docs/NOTION_MCP_V2.md`](NOTION_MCP_V2.md).

## Tool Intelligence (scores)

See `pp/tool-intelligence/scores.json`.

- Prefer routes with enough samples and higher success rate.
- Always apply `known_fix` when present.
- Hard rules override score preference.
- Log meaningful outcomes to `history.json`.

## Learning

Wrong route → LESSONS `PP-ROUTE-xxx` + optional Continuity note + Notion Learning Record.  
Regression: `python pp/tool-router/router.py "…"` must hit expected tool.

## Connected vs aspirational

Connected: GitHub, Notion, Linear (optional), Automations, Calendar, Gmail, Drive, Voice.  
Todoist: **not** connected — do not route there; use GitHub Issues or Notion Tasks.
