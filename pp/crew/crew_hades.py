#!/usr/bin/env python3
"""
Optional CrewAI-style multi-agent crew for House of Hades.

Requires: pip install -r pp/crew/requirements-optional.txt
          + OPENAI_API_KEY or ANTHROPIC_API_KEY (or your provider)

Hard gates enforced in prompts:
  - No Engine trades / undefined risk
  - No live publish without human approval
  - Trust / KeyBank stay Needs Human
  - All durable conclusions must be phrased as Registry/Continuity updates

Usage:
  python pp/crew/crew_hades.py --dry-run
  python pp/crew/crew_hades.py --task "List Needs Human agents and draft Continuity lines"
"""

from __future__ import annotations

import argparse
import sys

GATES = """
HARD GATES (non-negotiable):
1. Do not recommend undefined-risk options or any Engine trade for execution.
2. Do not claim Trust is notarized or KeyBank is above floor unless told so in the task.
3. Do not schedule live social posts; drafts only, approval required.
4. Every material recommendation must include a one-line Registry or Continuity update.
5. Persephone supervises; workers propose only.
"""


def dry_run() -> None:
    print("HADES Crew — dry run (CrewAI not required)")
    print(GATES)
    print("Roles that would be created:")
    roles = [
        ("Persephone", "Hades Office", "Supervisor — routes tasks, enforces gates"),
        ("Thanatos Veyr", "Tartarus", "Tool-router · deep systems · infrastructure"),
        ("Helveth", "Judgment Hall", "Legal / Trust accountability — escalate Needs Human"),
        ("Necrothys", "Tartarus", "Signal discipline — Phase 1 defined-risk only"),
        ("Acheron Vail", "Elysium", "Content drafts — two-layer captions, no publish"),
        ("Styxion", "Styx", "Distribution drafts — Buffer draft-by-default"),
        ("Morveth", "Asphodel", "Research synthesis · watchlists"),
    ]
    for name, realm, goal in roles:
        print(f"  · {name:16} [{realm}] {goal}")
    print("\nInstall: pip install -r pp/crew/requirements-optional.txt")
    print("Then:     python pp/crew/crew_hades.py --task \"...\"")


def run_crew(task: str) -> None:
    try:
        from crewai import Agent, Crew, Process, Task
    except ImportError:
        print(
            "CrewAI not installed.\n"
            "  pip install -r pp/crew/requirements-optional.txt\n"
            "Or use the zero-dep runner:\n"
            "  python pp/crew/handoff_runner.py --needs-human",
            file=sys.stderr,
        )
        sys.exit(1)

    persephone = Agent(
        role="Persephone — Hades Office Supervisor",
        goal="Orchestrate Underworld agents; enforce HADES gates; write durable state to Registry/Continuity form.",
        backstory=(
            "AI operator for House of Hades. Stage 1 only. Truth over hype. "
            "Never invent balances. Never authorize capital or Trust alone."
        ),
        allow_delegation=True,
        verbose=True,
    )
    thanatos = Agent(
        role="Thanatos Veyr — Tartarus Systems",
        goal="Tool-router, agent.registry routing, infrastructure proposals. No trades.",
        backstory="Deep systems resident. Coordinates via Registry status, not free chat.",
        allow_delegation=False,
        verbose=True,
    )
    helveth = Agent(
        role="Helveth — Judgment Hall Legal",
        goal="Surface legal/Trust blockers as Needs Human. Never mark Trust complete without notarization proof.",
        backstory="Tracks Hades Revocable Living Trust and structural obligations.",
        allow_delegation=False,
        verbose=True,
    )

    full_task = f"{task.strip()}\n\n{GATES}"
    t = Task(
        description=full_task,
        expected_output=(
            "Structured brief: (1) status of relevant agents, "
            "(2) proposed HANDOFF blocks if any, "
            "(3) Continuity one-liners, (4) explicit list of what still Needs Human."
        ),
        agent=persephone,
    )

    crew = Crew(
        agents=[persephone, thanatos, helveth],
        tasks=[t],
        process=Process.sequential,
        verbose=True,
    )
    result = crew.kickoff()
    print("\n=== CREW RESULT (proposal only — not live state) ===")
    print(result)
    print("\nWrite durable outcomes into Notion Agent Registry + Continuity before acting.")


def main() -> None:
    p = argparse.ArgumentParser(description="HADES optional CrewAI crew")
    p.add_argument("--dry-run", action="store_true")
    p.add_argument(
        "--task",
        default="Summarize who Needs Human and what Thanatos should finish next under TASK 001.1",
    )
    args = p.parse_args()
    if args.dry_run:
        dry_run()
        return
    run_crew(args.task)


if __name__ == "__main__":
    main()
