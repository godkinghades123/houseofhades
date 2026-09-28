#!/usr/bin/env python3
"""
PP Tool Router — deterministic, cheap tool selection for House of Hades.

Levels:
  1. Exact phrase match (aliases.json)
  2. Hard rules + keyword / capability score (registry.json)
  3. Ambiguous → return multi-tool or needs_clarification

Usage:
  python router.py "Update Signal Log with this trade"
  python router.py --json "Commit this change to House of Hades"
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent


def load_json(name: str) -> dict[str, Any]:
    with open(HERE / name, encoding="utf-8") as f:
        return json.load(f)


def normalize(text: str) -> str:
    t = text.lower().strip()
    t = re.sub(r"\s+", " ", t)
    return t


def has(needle: str, text: str) -> bool:
    """Whole-word match (allows plural/-ed/-ing) so 'pr' != 'improve', 'push' != 'pushback'."""
    n = needle.lower().strip()
    if not n:
        return False
    return re.search(r"(?<![a-z0-9])" + re.escape(n) + r"(?:s|es|ed|ing)?(?![a-z0-9])", text) is not None


def exact_match(text: str, aliases: dict[str, Any]) -> dict[str, Any] | None:
    phrases = aliases.get("exact_phrases", {})
    # Longest phrase first so a short phrase can't shadow a more specific one.
    for phrase, payload in sorted(phrases.items(), key=lambda kv: len(kv[0]), reverse=True):
        if has(phrase, text):
            tools = payload.get("tools") or [payload.get("tool")]
            tools = [t for t in tools if t]
            return {
                "level": 1,
                "tools": tools,
                "execution_order": payload.get("order") or tools,
                "capability": payload.get("capability"),
                "confidence": 0.99,
                "reason": f"Exact phrase: {phrase!r}",
            }
    return None


def hard_rules(
    text: str, aliases: dict[str, Any], *, priority_only: bool = False
) -> dict[str, Any] | None:
    for rule in aliases.get("hard_rules", []):
        # "priority" rules (e.g. reminders) run before exact phrases; the rest run after.
        if priority_only != bool(rule.get("priority")):
            continue
        needles = rule.get("if_contains_any", [])
        unless = rule.get("unless_contains", [])
        if unless and any(has(u, text) for u in unless):
            continue
        if any(has(n, text) for n in needles):
            if "force_tools" in rule:
                tools = rule["force_tools"]
                order = rule.get("order") or tools
            else:
                tools = [rule["force_tool"]]
                order = tools
            return {
                "level": 2,
                "tools": tools,
                "execution_order": order,
                "confidence": 0.97,
                "reason": f"{rule['id']}: {rule.get('reason', '')}",
                "rule_id": rule["id"],
                "capability": rule.get("capability"),
            }
    return None


def score_tools(text: str, registry: dict[str, Any]) -> list[tuple[str, float, list[str]]]:
    scores: list[tuple[str, float, list[str]]] = []
    tools = registry.get("tools", {})
    for key, meta in tools.items():
        if meta.get("status") == "not_connected":
            continue
        hits: list[str] = []
        score = 0.0
        for kw in meta.get("keywords", []):
            if has(kw, text):
                hits.append(kw)
                # longer keywords weigh more
                score += 1.0 + min(len(kw), 20) / 20.0
        for cap in meta.get("capabilities", []):
            # capability token fragments e.g. knowledge.write → knowledge
            parts = [p for p in cap.replace(".", " ").split() if len(p) > 3]
            if parts and all(has(p, text) for p in parts):
                score += 0.5
                hits.append(cap)
        if score > 0:
            scores.append((key, score, hits))
    scores.sort(key=lambda x: x[1], reverse=True)
    return scores


def capability_route(text: str, registry: dict[str, Any]) -> dict[str, Any] | None:
    caps = registry.get("capabilities", {})
    best = None
    best_score = 0.0
    for cap_name, meta in caps.items():
        examples = meta.get("examples", [])
        score = 0.0
        for ex in examples:
            if has(ex, text):
                score += 2.0
            else:
                # partial token overlap
                for tok in ex.split():
                    if len(tok) > 3 and has(tok, text):
                        score += 0.35
        # also match capability name tokens in text
        for tok in cap_name.replace(".", " ").split():
            if len(tok) > 3 and tok in text:
                score += 0.4
        if score > best_score:
            best_score = score
            best = (cap_name, meta)
    if best and best_score >= 1.0:
        cap_name, meta = best
        tools = [meta["tool"]]
        if meta.get("also"):
            tools = tools + list(meta["also"])
        conf = min(0.95, 0.7 + best_score * 0.05)
        return {
            "level": 2,
            "tools": tools,
            "execution_order": tools,
            "capability": cap_name,
            "confidence": conf,
            "reason": f"Capability match: {cap_name}",
        }
    return None


def route(user_request: str) -> dict[str, Any]:
    text = normalize(user_request)
    registry = load_json("registry.json")
    aliases = load_json("aliases.json")

    hit = hard_rules(text, aliases, priority_only=True)
    if hit:
        return finalize(hit, registry)

    hit = exact_match(text, aliases)
    if hit:
        return finalize(hit, registry)

    hit = hard_rules(text, aliases)
    if hit:
        return finalize(hit, registry)

    hit = capability_route(text, registry)
    if hit and hit["confidence"] >= 0.85:
        return finalize(hit, registry)

    ranked = score_tools(text, registry)
    if not ranked:
        return {
            "level": 3,
            "tools": [],
            "execution_order": [],
            "confidence": 0.0,
            "reason": "No tool matched — clarify domain (GitHub execution vs Notion memory vs market)",
            "needs_clarification": True,
        }

    top_tool, top_score, top_hits = ranked[0]
    # normalize confidence roughly
    conf = min(0.96, 0.45 + top_score * 0.08)
    tools = [top_tool]
    order = [top_tool]

    # multi-tool if second is close
    if len(ranked) > 1:
        second_tool, second_score, _ = ranked[1]
        if second_score >= top_score * 0.65 and second_score >= 1.5:
            tools.append(second_tool)
            # GitHub before Notion when both (execution then memory)
            if set(tools) >= {"github", "notion"}:
                order = ["github", "notion"]
            else:
                order = [t for t, _, _ in ranked[:2]]

    if conf < 0.55:
        return {
            "level": 3,
            "tools": tools,
            "execution_order": order,
            "confidence": conf,
            "reason": f"Low confidence keyword match: {top_hits[:5]}",
            "candidates": [
                {"tool": t, "score": s, "hits": h[:5]} for t, s, h in ranked[:4]
            ],
            "needs_clarification": True,
        }

    return finalize(
        {
            "level": 2 if conf >= 0.75 else 3,
            "tools": tools,
            "execution_order": order,
            "confidence": conf,
            "reason": f"Keyword score; hits={top_hits[:6]}",
            "candidates": [
                {"tool": t, "score": round(s, 2), "hits": h[:4]} for t, s, h in ranked[:4]
            ],
        },
        registry,
    )


def finalize(result: dict[str, Any], registry: dict[str, Any]) -> dict[str, Any]:
    displays = []
    for t in result.get("tools", []):
        meta = registry.get("tools", {}).get(t, {})
        displays.append(meta.get("display", t))
    result["tool_display"] = displays
    result["primary"] = (result.get("execution_order") or result.get("tools") or [None])[0]
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description="PP Tool Router")
    parser.add_argument("request", nargs="+", help="User request text")
    parser.add_argument("--json", action="store_true", help="Pretty JSON only")
    args = parser.parse_args()
    req = " ".join(args.request)
    out = route(req)
    if args.json:
        print(json.dumps(out, indent=2))
    else:
        print(f"Request: {req}")
        print(f"Level: {out.get('level')}  Confidence: {out.get('confidence')}")
        print(f"Tools: {out.get('tools')}  Order: {out.get('execution_order')}")
        print(f"Reason: {out.get('reason')}")
        if out.get("needs_clarification"):
            print("→ Needs clarification / Level 3")


if __name__ == "__main__":
    main()
