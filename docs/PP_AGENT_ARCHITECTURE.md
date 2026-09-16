# PP Agent Architecture (House of Hades)

Target: PP operates as an **automated agent**, not only a chatbot.

## Diagram

```
                    ┌──────────────┐
                    │   PP CORE    │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
        TASK ROUTER                MEMORY
              │                         │
       ┌──────┼──────┐          ┌───────┴───────┐
       │      │      │          │               │
    GitHub  Notion  Web      Lessons        Preferences
       │      │      │          │               │
       └──────┼──────┘          └───────┬───────┘
              │                         │
              └──────────┬──────────────┘
                         │
                  ┌──────▼──────┐
                  │   EXECUTE   │
                  └──────┬──────┘
                         │
                  ┌──────▼──────┐
                  │ SELF-CHECK  │
                  └──────┬──────┘
                         │
              ┌──────────▼──────────┐
              │ LOG SUCCESS/FAILURE │
              └─────────────────────┘
```

## Implementation map

| Layer | Location |
|-------|----------|
| Task Router | `pp/tool-router/` |
| Tool Intelligence (scores, history) | `pp/tool-intelligence/` |
| Learning layer | `pp/learning/` + `docs/PP_LEARNING.md` + Notion PP Learning System |
| Multi-agent crew (optional) | `pp/crew/` — CrewAI-style roles + zero-dep handoff runner |
| Permanent rules | `docs/*.md` |
| Live memory | Notion (Continuity, HQ, Treasury, Signal Log, **Agent Registry**) |

## Loop

1. User request
2. Router classifies + selects tools (`agent.registry` → Notion colony)
3. Check scores + permanent lessons
4. Execute
5. Self-check
6. Log outcome
7. Promote systemic lessons

## Multi-agent (Stage 1)

**Coordination protocol:** HANDOFF blocks written to Agent Registry Notes + Continuity.  
**Not** unstructured agent chat as source of truth.

| Mode | Path | Needs API key? |
|------|------|----------------|
| Registry protocol | `python pp/crew/handoff_runner.py` | No |
| Role crew (CrewAI, optional) | `python pp/crew/crew_hades.py` | Yes (LLM provider) |

**Framework choice**

- **CrewAI (MIT)** — default optional layer: roles map to Underworld realms; sequential process under Persephone.
- **AutoGen** — conversation-heavy; adopt later if debate patterns are needed.
- **LangGraph** — production graph later when handoffs are daily habit.

**Gates:** no Engine auto-trades, no live publish without approval, Trust/KeyBank stay Needs Human until the Duke closes them. See `pp/crew/README.md`.

**Thanatos TASK 001.1:** `agent.registry` / `colony.status` capabilities in `pp/tool-router/registry.json` + aliases for "who needs the Duke", "colony status", etc.

## Notion backup

Architecture and status are also mirrored under **PP Learning System** in Notion so memory stays dual-homed (GitHub procedures + Notion experience).
