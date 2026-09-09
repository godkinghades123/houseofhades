# PP Learning Layer

Pairs with `docs/PP_LEARNING.md`, `docs/LESSONS.md`, and Notion **PP Learning System**.

## Structure (agent memory)

| Path | Role |
|------|------|
| `docs/LESSONS.md` | Condensed permanent + routing lessons |
| `docs/PP_LEARNING.md` | Full learning loop + promotion rules |
| `pp/tool-intelligence/` | Route scores, history, benchmarks |
| Notion PP Learning Records | Detailed post-mortems (source of truth for experience) |

## Folders (lightweight)

Use these markdown stubs for patterns that are not yet permanent rules:

- `mistakes.md` — recent process/routing mistakes (short)
- `successful_patterns.md` — repeated wins worth repeating
- `failed_patterns.md` — repeated failure modes

**Do not** store live portfolio balances here — Notion Treasury only.

## Pre-flight rule for PP

Before executing a non-trivial task:

1. Classify capability (repo / knowledge / market / reminder / …).
2. Check `pp/tool-intelligence/scores.json` for preferred route + known_fix.
3. Check `docs/LESSONS.md` for PP-ROUTE-* and permanent process lessons.
4. Execute → self-check → log outcome to `history.json` when meaningful.
