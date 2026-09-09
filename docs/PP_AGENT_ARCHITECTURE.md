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
| Permanent rules | `docs/*.md` |
| Live memory | Notion (Continuity, HQ, Treasury, Signal Log) |

## Loop

1. User request
2. Router classifies + selects tools
3. Check scores + permanent lessons
4. Execute
5. Self-check
6. Log outcome
7. Promote systemic lessons

## Notion backup

Architecture and status are also mirrored under **PP Learning System** in Notion so memory stays dual-homed (GitHub procedures + Notion experience).
