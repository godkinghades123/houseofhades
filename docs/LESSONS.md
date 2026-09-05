# PP lessons

Condensed from Notion Continuity retrospectives + routing policy.

## Placement & memory

1. **Do not insert new logs at the top of Notion pages** — bottom or best-fitting section only.
2. **Do not put rules on Headquarters** — HQ is morning ops; Continuity holds rules/session memory.
3. **Do not rename Signal Log to a GitHub URL** — that is not a synced Issues database.
4. **Do not leave Continuity §05 stale** after sells/transfers — rewrite the section.
5. **Do not treat Aug 3–7 weekly tables as “last week” forever** — refresh Vault snapshots.
6. **Do not promise GitHub Projects automation** without Projects connector scope.

## Tool routing (PP-ROUTE)

| ID | Rule |
|----|------|
| **PP-ROUTE-001** | Repository modifications (commit/push/repo files/issue templates) → **GitHub** |
| **PP-ROUTE-002** | Continuity / Signal Log / Treasury / HQ data / Scroll Library → **Notion** |
| **PP-ROUTE-003** | “Create issue and link to Notion” → **GitHub then Notion** |
| **PP-ROUTE-004** | Reminders / recurring checks → **Automations** (not Todoist) |
| **PP-ROUTE-005** | “How is the market today” → **Notion Vault + Web**; write Signal Log when actionable |
| **PP-ROUTE-006** | Execution board work → **GitHub Issues**; do not paste full Continuity into Project cards |

### Regression phrases

```
"Commit this change to House of Hades"     → github
"Update Signal Log with this trade"      → notion
"Create a GitHub issue and link Notion"  → github, notion
"Remind me in 2 weeks about VICI"        → automations
"How is the market today"                → notion + web
```

Run: `python pp/tool-router/router.py "…"`

## Split

| Layer | Tool |
|-------|------|
| Execution | GitHub Issues + HADES Execution board |
| Memory / rules | Notion Continuity |
| Ops snapshot | Notion HQ (no policy essays) |
| Condensed rules | `docs/*.md` |
| Tool selection | `pp/tool-router/` |
