# PP Tool Intelligence Layer

**Purpose:** Move PP from repeated tool-reasoning to a learned routing policy.

This folder sits beside `pp/tool-router/` and supplies **memory of what worked**.

```
USER REQUEST
     ↓
TOOL ROUTER (cheap select)
     ↓
CHECK scores.json + permanent lessons
     ↓
EXECUTE
     ↓
SELF-CHECK
     ↓
LOG → history.json + (on failure) lessons
```

## Files

| File | Role |
|------|------|
| `scores.json` | Quantified route success rates, avg attempts, last failure, known fix |
| `history.json` | Recent route outcomes (append-only style log) |
| `benchmarks.md` | Human-readable regression + performance notes |
| `README.md` | This doc |

## How PP should use this

1. Before selecting tools, run the router.
2. If `scores.json` has an entry for the matched capability/task class, prefer the highest-success route and apply any **known_fix**.
3. After execution, log outcome (success / failure / partial) into `history.json` and update scores when a pattern is clear.
4. Systemic failures still promote through the normal learning loop (`docs/PP_LEARNING.md` → Notion Learning Records → permanent rule).

## Relation to tool-router

- `tool-router/` = **how to choose** (deterministic + keywords).
- `tool-intelligence/` = **how well past choices worked** (policy memory).

Do not put live Treasury balances or session chat logs here.
