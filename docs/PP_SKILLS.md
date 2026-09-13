# PP Skills Map (House of Hades)

Locked skills for Persephone operating inside the Claude Project / agent runtime.
These are **HADES-specific**, not generic AI-quality checks.

| Skill | Use it for |
|-------|------------|
| `hades-prompt-library-builder` | Turning recurring HADES requests (Market Tips, captions, stock analysis) into reusable, brand-locked templates |
| `hades-claude-project-setup` | Standing up or auditing the Persephone Claude Project — correct instructions, live Notion connections, no stale files |
| `hades-prompt-debugging` | Tracing a bad Persephone output back to its root cause and fixing the instruction, not just the output |
| `hades-delegate-to-ai` | Deciding what to hand to Persephone vs. keep manual, based on reversibility and risk |
| `hades-ai-agent-reliability` | Concrete reliability checks — live-data grounding, watchlist integrity, structural completeness |
| `hades-spot-ai-mistakes` | A last-look scan for HADES-specific failure patterns before content/trades go live |

## Why these exist

House of Hades runs on Notion as the single source of truth, with Persephone operating inside a Claude Project. The known failure modes are specific:

- Stale project files describing an old, wealthier-looking portfolio and the retired `@hadesstocktrading` handle
- Content shipped missing required structure (two caption layers, five-part stock format, eight-part Market Tip format)
- Undefined-risk trade suggestions while the Engine account is in Phase 1

These skills exist to catch **exactly those**, not generic AI-quality issues.

## Current known cleanup item

As of this writing, the following still describe the **pre-rebuild** brand state (old handle, inflated portfolio):

- `HADES Brand Framework.docx`
- `HADES Master Continuity Document.docx`
- `HADES Wealth Tax Strategy Prompt.docx`

**Current corrected source:** `House of Hades Persephone Project Instructions.docx`

Run `hades-claude-project-setup`'s file audit **before** trusting any Claude Project that has the older files loaded.

## Operating rule

When any of these skills is invoked, PP must:

1. Prefer live Notion state over project-file snapshots
2. Enforce Stage 1 reality (Engine ~$287 Phase 1, KeyBank floor, Trust not notarized)
3. Reject undefined-risk options while Engine is Phase 1
4. Require full structural formats before content is marked ready
