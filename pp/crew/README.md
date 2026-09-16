# PP Crew — Stage 1 multi-agent layer (House of Hades)

**Optional.** Free, MIT-friendly pattern for agents that coordinate without free-chat chaos.

This is **not** an always-on autonomous swarm. It is a controlled crew under Persephone (Hades Office), with memory in the **Notion Agent Registry** and **Continuity**.

## What you get

| Piece | Role |
|-------|------|
| `handoff_runner.py` | **Zero dependency.** Formats and validates HANDOFF blocks; lists Needs Human / Blocked from a local snapshot. Run this daily without any LLM API. |
| `crew_hades.py` | **Optional CrewAI.** Role-based crew mapped to Underworld realms. Only loads if `crewai` is installed. |
| `requirements-optional.txt` | `crewai` (and optional LLM providers). Do **not** add to dashboard/`package.json`. |

## Why CrewAI (not AutoGen by default)

| Framework | Fit for HADES |
|-----------|----------------|
| **CrewAI** (MIT) | Role/goal agents map cleanly to realms (Thanatos, Helveth, Styxion…). Fastest Stage 1 prototype. |
| **AutoGen / AG2** (MIT) | Conversation-heavy; easier to drift into unstructured chat. Use later if you want debate patterns. |
| **LangGraph** (MIT) | Best long-term production graph; heavier setup. Adopt when handoffs are daily habit. |

## Hard gates (non-negotiable)

1. **No free agent-to-agent chat as source of truth.** Every decision that matters is written to Agent Registry Notes and/or Continuity.
2. **No Engine trades** from crew output. Phase 1 defined-risk only; capital stays human/PP-gated.
3. **No live social publish** without approval flag (Marketing gates + `--approved`).
4. **Trust / KeyBank / legal** stay **Needs Human** until the Duke closes them.
5. **PP (Hades Office) is the only supervisor.** Worker agents propose; they do not self-authorize capital or Trust.

## Install (optional)

```bash
# from repo root — separate from dashboard Node deps
python -m venv .venv-crew
source .venv-crew/bin/activate   # Windows: .venv-crew\Scripts\activate
pip install -r pp/crew/requirements-optional.txt

# set your LLM key the way CrewAI expects, e.g.
# export OPENAI_API_KEY=...   or ANTHROPIC_API_KEY=...
```

## Run

```bash
# Protocol only (no LLM, no CrewAI)
python pp/crew/handoff_runner.py
python pp/crew/handoff_runner.py --needs-human
python pp/crew/handoff_runner.py --format-handoff \
  --from "Persephone" --from-realm "Hades Office" \
  --to "Thanatos Veyr" --to-realm "Tartarus" \
  --what "Wire agent.registry into tool-router" \
  --where "pp/tool-router + Continuity"

# Optional CrewAI demo (requires install + API key)
python pp/crew/crew_hades.py --dry-run
python pp/crew/crew_hades.py --task "Summarize who Needs Human and draft Continuity lines"
```

## Realm → crew role map

| Realm | Example resident | Crew role |
|-------|------------------|-----------|
| Hades Office | Persephone | Supervisor / orchestrator |
| Tartarus | Thanatos Veyr, Necrothys | Deep systems · tool-router · engine discipline |
| Judgment Hall | Helveth, Mictlanor | Legal · priority debt · Trust |
| Elysium | Acheron Vail, Melinoë Rhad | Content · philosophy (draft only) |
| Styx | Styxion, Anubarak | Distribution · brand (draft-by-default) |
| Asphodel | Morveth, Yamaeth | Research · watchlists · long theses |
| The Ship / Crossing | Thanagor | Handoffs · realm transfers |

## Relationship to existing stack

```
User / Duke
    → Persephone (orchestrator)
        → tool-router (pp/tool-router)     # which connector
        → Agent Registry (Notion)          # who is Working / Needs Human
        → Continuity                       # durable log
        → optional crew_hades.py           # multi-role draft pass
        → GitHub Issues                    # execution board
```

Crew output is a **proposal**. Shipping still goes through GitHub Issues, Marketing gates, and human approval where required.

## Stage 1 honesty

Do not treat a successful `crew.kickoff()` as “agents are alive in production.”  
Treat it as a structured drafting loop. Live state stays in Notion. Engine stays Phase 1.
