# scripts/survival/

Stage 1 survival toolkit. Internal operating tools only — **not legal advice**.

Every script ends with: **verify with a licensed attorney or CPA before acting.**

| Tool | Status | Purpose |
|------|--------|---------|
| [`stop_the_bleed_triage.py`](stop_the_bleed_triage.py) | Live | Rank cash leaks and prioritize the next action |
| [`debt_collector_scripts.py`](debt_collector_scripts.py) | Live | Response templates + local contact log |
| benefits-cliff-check | Planned | Model income vs benefits loss |
| wage-garnishment-response | Planned | Timeline + response checklist |
| bankruptcy-decision | Planned | Decision matrix support only |

## Quick start

```bash
# 1. Cash-pressure triage (uses built-in Stage 1 defaults)
python scripts/survival/stop_the_bleed_triage.py

# Optional: pass your own numbers
python scripts/survival/stop_the_bleed_triage.py --state scripts/survival/state.example.json

# Machine-readable
python scripts/survival/stop_the_bleed_triage.py --json

# 2. Debt collector scripts
python scripts/survival/debt_collector_scripts.py list
python scripts/survival/debt_collector_scripts.py show validation
python scripts/survival/debt_collector_scripts.py show cease_comm
python scripts/survival/debt_collector_scripts.py show phone_script

# Log a contact (writes local collector_log.jsonl — not committed)
python scripts/survival/debt_collector_scripts.py log \
  --who "XYZ Collections" --channel phone --notes "Asked for validation"

python scripts/survival/debt_collector_scripts.py log --show
```

## Rules

- No PII in public files. Personal numbers live in Notion (private) or local only.
- `collector_log.jsonl` is gitignored — keep it local.
- GitHub = code + issues. Notion = live state + decision logs.
- Truth standard: real numbers, real stage, no hype.
- KeyBank floor and Engine Phase 1 rules still apply — these tools do not touch trading capital.
