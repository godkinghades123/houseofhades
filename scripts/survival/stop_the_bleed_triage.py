#!/usr/bin/env python3
"""
stop_the_bleed_triage.py — Stage 1 cash-pressure triage

Ranks the highest-leverage places money is leaking and prints a prioritized
action list. Uses local numbers only (or a simple JSON state file).

NOT LEGAL ADVICE. Decision aid only. Verify with a licensed attorney or CPA.

Usage:
  python scripts/survival/stop_the_bleed_triage.py
  python scripts/survival/stop_the_bleed_triage.py --state path/to/state.json

State file shape (optional):
{
  "rent": 600,
  "food": 250,
  "chime": 40,
  "keybank": 65,
  "keybank_floor_min": 700,
  "water_sales_weekly": 50,
  "amazon_hours_week": 20,
  "amazon_rate": 18.50,
  "debt_min_payments": 0,
  "collector_pressure": "high" | "medium" | "low" | "none",
  "notes": "optional free text"
}
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


# Default Stage 1 snapshot (edit or override via --state)
DEFAULTS: dict[str, Any] = {
    "rent": 600.0,
    "food": 250.0,
    "chime": 40.0,
    "keybank": 65.0,
    "keybank_floor_min": 700.0,
    "keybank_floor_target": 2000.0,
    "water_sales_weekly": 50.0,
    "amazon_hours_week": 20.0,
    "amazon_rate": 18.50,
    "debt_min_payments": 0.0,
    "collector_pressure": "medium",
    "notes": "",
}


@dataclass
class BleedItem:
    name: str
    severity: int  # 1–10
    monthly_impact: float
    action: str
    owner: str = "Javarous"
    tags: list[str] = field(default_factory=list)


def load_state(path: Path | None) -> dict[str, Any]:
    state = dict(DEFAULTS)
    if path and path.exists():
        data = json.loads(path.read_text())
        state.update(data)
    return state


def amazon_monthly(state: dict[str, Any]) -> float:
    # rough: hours/week * rate * 4.3 weeks
    return float(state["amazon_hours_week"]) * float(state["amazon_rate"]) * 4.3


def water_monthly(state: dict[str, Any]) -> float:
    return float(state["water_sales_weekly"]) * 4.3


def triage(state: dict[str, Any]) -> list[BleedItem]:
    items: list[BleedItem] = []

    chime = float(state["chime"])
    keybank = float(state["keybank"])
    floor = float(state["keybank_floor_min"])
    rent = float(state["rent"])
    food = float(state["food"])
    debt_min = float(state["debt_min_payments"])
    pressure = str(state.get("collector_pressure", "none")).lower()

    amazon = amazon_monthly(state)
    water = water_monthly(state)
    total_in = amazon + water
    fixed_out = rent + food + debt_min
    gap = fixed_out - total_in

    # 1. KeyBank below floor
    if keybank < floor:
        short = floor - keybank
        items.append(
            BleedItem(
                name="KeyBank below build floor",
                severity=9,
                monthly_impact=short,
                action=(
                    f"KeyBank ${keybank:.0f} is ${short:.0f} under the ${floor:.0f} floor. "
                    "Do not treat any of this as deployable capital. Route every surplus "
                    "dollar here first until floor is hit."
                ),
                tags=["cash-floor", "capital-routing"],
            )
        )

    # 2. Monthly income vs fixed costs
    if gap > 0:
        items.append(
            BleedItem(
                name="Monthly income gap vs fixed costs",
                severity=10,
                monthly_impact=gap,
                action=(
                    f"Fixed out ~${fixed_out:.0f} (rent ${rent:.0f} + food ${food:.0f} "
                    f"+ debt min ${debt_min:.0f}). In ~${total_in:.0f} "
                    f"(Amazon ${amazon:.0f} + water ${water:.0f}). "
                    f"Gap ≈ ${gap:.0f}/mo. Close with more hours, more water volume, "
                    "or cut non-essentials. This is the primary bleed."
                ),
                tags=["income", "rent", "food"],
            )
        )
    else:
        items.append(
            BleedItem(
                name="Monthly income covers fixed costs",
                severity=2,
                monthly_impact=0.0,
                action=(
                    f"In ~${total_in:.0f} covers fixed ~${fixed_out:.0f}. "
                    "Surplus should still route to KeyBank floor before any other use."
                ),
                tags=["income"],
            )
        )

    # 3. Chime (daily spend) running thin
    if chime < 50:
        items.append(
            BleedItem(
                name="Chime daily-spend buffer low",
                severity=7,
                monthly_impact=chime,
                action=(
                    f"Chime ${chime:.0f}. Daily-spend only. Keep it from hitting zero. "
                    "Do not pull from KeyBank below floor to top it up unless true emergency."
                ),
                tags=["liquidity"],
            )
        )

    # 4. Collector pressure
    if pressure in ("high", "medium"):
        sev = 8 if pressure == "high" else 5
        items.append(
            BleedItem(
                name=f"Debt collector pressure ({pressure})",
                severity=sev,
                monthly_impact=0.0,
                action=(
                    "Use debt_collector_scripts.py for response templates. "
                    "Log every contact. Do not ignore certified mail. "
                    "Do not admit debt or make payment promises you cannot keep."
                ),
                tags=["debt", "collectors"],
            )
        )

    # 5. Water sales under target
    water_target_weekly = 75.0
    if float(state["water_sales_weekly"]) < water_target_weekly:
        items.append(
            BleedItem(
                name="Water sales under weekly target",
                severity=6,
                monthly_impact=(water_target_weekly - float(state["water_sales_weekly"])) * 4.3,
                action=(
                    f"Current ~${state['water_sales_weekly']:.0f}/wk vs target $50–75. "
                    "Volume here directly reduces rent pressure. Treat as active work, not side."
                ),
                tags=["income", "water"],
            )
        )

    # 6. Amazon hours — still the bridge
    if float(state["amazon_hours_week"]) < 30:
        items.append(
            BleedItem(
                name="Amazon bridge hours room to expand",
                severity=4,
                monthly_impact=0.0,
                action=(
                    f"Currently {state['amazon_hours_week']} h/wk @ ${state['amazon_rate']}. "
                    "More hours = faster KeyBank floor and lower rent stress. "
                    "Protect sleep and recovery — do not burn out the bridge."
                ),
                tags=["income", "amazon"],
            )
        )

    # Sort: highest severity first, then highest monthly impact
    items.sort(key=lambda x: (-x.severity, -x.monthly_impact))
    return items


def print_report(state: dict[str, Any], items: list[BleedItem]) -> None:
    print("=" * 60)
    print("STOP-THE-BLEED TRIAGE  |  House of Hades  |  Stage 1")
    print("=" * 60)
    print(f"Chime (daily):     ${float(state['chime']):.0f}")
    print(f"KeyBank:           ${float(state['keybank']):.0f}  (floor ${float(state['keybank_floor_min']):.0f})")
    print(f"Rent / Food:       ${float(state['rent']):.0f} / ${float(state['food']):.0f}")
    print(f"Amazon (est/mo):   ${amazon_monthly(state):.0f}")
    print(f"Water  (est/mo):   ${water_monthly(state):.0f}")
    print(f"Collector pressure:{state.get('collector_pressure', 'n/a')}")
    if state.get("notes"):
        print(f"Notes:             {state['notes']}")
    print("-" * 60)
    print("PRIORITIZED ACTIONS (highest severity first)\n")

    for i, item in enumerate(items, 1):
        print(f"{i}. [{item.severity}/10] {item.name}")
        if item.monthly_impact:
            print(f"   Impact: ~${item.monthly_impact:.0f}/mo relevant")
        print(f"   → {item.action}")
        print()

    print("-" * 60)
    print("DISCLAIMER: Decision aid only. Not legal, tax, or financial advice.")
    print("Verify any action with a licensed attorney or CPA where relevant.")
    print("Engine capital stays Phase 1 and is not part of this triage.")
    print("=" * 60)


def main() -> None:
    parser = argparse.ArgumentParser(description="Stage 1 stop-the-bleed triage")
    parser.add_argument(
        "--state",
        type=Path,
        default=None,
        help="Optional JSON state file (see docstring)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit machine-readable JSON instead of text report",
    )
    args = parser.parse_args()

    state = load_state(args.state)
    items = triage(state)

    if args.json:
        out = {
            "state": state,
            "items": [
                {
                    "name": i.name,
                    "severity": i.severity,
                    "monthly_impact": i.monthly_impact,
                    "action": i.action,
                    "owner": i.owner,
                    "tags": i.tags,
                }
                for i in items
            ],
        }
        print(json.dumps(out, indent=2))
    else:
        print_report(state, items)


if __name__ == "__main__":
    main()
