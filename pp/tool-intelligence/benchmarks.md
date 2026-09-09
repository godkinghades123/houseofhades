# Tool Intelligence Benchmarks

Lightweight regression and performance notes for PP routing.

## Router CLI checks (must stay green)

```bash
cd pp/tool-router
python router.py "Commit this change to House of Hades"
# → github

python router.py "Update Signal Log with this trade"
# → notion

python router.py "Create a GitHub issue and link Notion"
# → github, notion

python router.py "Remind me in 2 weeks about VICI"
# → automations

python router.py "How is the market today"
# → notion + web (or web + notion)
```

## Score policy

- Prefer routes with `samples >= 5` and higher `success_rate`.
- Always surface `known_fix` when present.
- Hard rules in `aliases.json` / `docs/LESSONS.md` (PP-ROUTE-*) override score preference.

## Target improvements

| Metric | Target |
|--------|--------|
| Avg attempts on common tasks | ≤ 1.3 |
| Wrong-domain route rate | < 5% |
| Time spent re-deciding tools | trending down |

Update this file when a new permanent routing lesson lands.
