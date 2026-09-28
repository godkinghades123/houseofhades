"""Regression tests for the PP tool router (run: python -m pytest pp/tool-router -q)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import router as R  # noqa: E402


def tools(q):
    return R.route(q)["tools"]


def test_original_examples():
    assert tools("Update Signal Log with this trade") == ["notion"]
    assert tools("Commit this change to House of Hades") == ["github"]


def test_no_substring_false_positives():
    assert tools("what's the pushback on my thesis") != ["github"]      # 'push'
    assert tools("how do I improve my reputation") != ["github"]        # 'pr'
    r = R.route("explain how the mlb season went")                      # 'ml'
    assert r.get("needs_clarification") or r["tools"] != ["ml"]


def test_reminder_beats_repo_verbs():
    r = R.route("remind me to commit the file tomorrow")
    assert r["tools"] == ["automations"] and r["rule_id"] == "PP-ROUTE-004"
    assert tools("remind me to commit this") == ["automations"]         # beats exact phrase too


def test_hard_rule_keeps_capability():
    assert R.route("net liquidating value")["capability"] == "engine.get_balances"
    assert R.route("tastytrade balance")["capability"] == "engine.get_balances"


def test_inflections_still_match():
    assert tools("I pushed the branch to the repo") == ["github"]
    assert tools("open github issues") == ["github"]


def test_case_insensitive_registry_phrases():
    assert R.route("Who needs the Duke")["capability"] == "agent.registry"
    assert R.route("Open Handoffs")["capability"] == "agent.registry"


def test_unknown_request_asks_for_clarification():
    r = R.route("I want to cook dinner")
    assert r["needs_clarification"] and r["tools"] == []
