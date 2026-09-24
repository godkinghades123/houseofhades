# PP Tool Router

**Permanent House of Hades component.** Cheap deterministic routing before PP loads tool schemas.

```
USER REQUEST
     ↓
TOOL SEARCH (this folder)
     ↓
Identify capability → tool(s)
     ↓
Load ONLY relevant connector(s)
     ↓
Execute → result → PP → optional learning log
```

## Files

| File | Role |
|------|------|
| `registry.json` | Tool index + capabilities |
| `aliases.json` | Exact phrases + hard routing rules |
| `router.py` | Rank / select tools |
| `README.md` | This doc |

## Three levels

1. **Exact match** — known phrases (`how is the market today` → web + notion)
2. **Capability / hard rules** — `commit/push` → GitHub; `continuity/signal log` → Notion
3. **Full discovery** — low confidence → multi-candidate or ask clarify

## Capability layer

```
CAPABILITY          TOOL         EXAMPLE
repo.modify      →  GitHub    →  push files / commit
knowledge.write  →  Notion    →  Continuity / Signal Log
knowledge.retrieve → Notion   →  fetch rules / treasury
db.query / data_source.query → Notion (query-data-source)
issue.create     →  GitHub    →  new execution issue
market.brief     →  Web+Notion→  briefing rule
reminder.create  →  Automations
ml.explain       →  ML        →  tools/ml/primitives.py (Phase-1 explain only)
engine.get_balances → Engine  →  Thanatos / Tartarus (read-only)
```

## ML Primitives (v1.4.0+)

- Path: `tools/ml/` — `ml_explain(algorithm, context?) → Explanation`
- Five algorithms: linear_regression, logistic_regression, decision_tree, svm, knn
- Gates: explain only · no training · no prediction · no auto-trade · no live publish
- Owner: Thanatos Veyr (Tartarus). Hard rule PP-ROUTE-007.

## Notion MCP ≥ 2.0.0

Old database tools are gone. Use data-source tools only. Full map + parameter changes: [`docs/NOTION_MCP_V2.md`](../../docs/NOTION_MCP_V2.md).

## CLI

```bash
cd pp/tool-router
python router.py "Update my Signal Log with this trade"
python router.py --json "Commit this change to House of Hades"
python router.py "Create a GitHub issue and link it to Notion"
python router.py "Explain linear regression"
```

## Split (never invert)

| Domain | Tool |
|--------|------|
| Execution (ship, issues, repo docs) | **GitHub** |
| Memory (Continuity, HQ ops data, Signal Log) | **Notion** |
| Reminders | **Automations** |
| Market brief trigger | **Web + Notion Vault** |
| ML algorithm explain | **ML Primitives** (`tools/ml`) |
| Engine balances | **Engine** (read-only) |

## Learning loop

Routing mistakes → `docs/LESSONS.md` (PP-ROUTE-xxx) + Continuity retrospective.  
See also `docs/TOOL_ROUTING.md` and `docs/PP_LEARNING.md`.

## Platform note

This router is the **HADES policy + local code** for tool selection.  
The chat runtime may still expose platform tool lists; PP should still *behave* as if routing through this registry (prefer Notion for memory, GitHub for execution, avoid loading unrelated connectors conceptually).
