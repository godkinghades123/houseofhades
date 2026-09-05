# PP Learning System

## Purpose

Persephone (PP) improves through documented feedback, not by silently rewriting rules after individual failures.

**System boundary:**
- **Notion = experience and operational memory.**
- **GitHub = validated procedures, rules, and implementation.**
- **Signal Log = market evidence and outcomes.**
- **PP = decision-maker that must consult relevant memory and rules before acting.**

## Learning loop

1. PP makes or tracks a decision.
2. Record the decision/evidence in the appropriate Notion log (especially Signal Log for market signals).
3. Record the outcome when resolved.
4. If PP was wrong, violated a rule, missed information, or communicated poorly, create a PP Learning entry in Notion.
5. Perform a post-mortem: expected result, actual result, evidence used, evidence missed, root cause, and applicable HADES rule.
6. Classify the event: Analysis, Process, Information, Timing, Risk, Communication, or Memory/Continuity.
7. Decide whether the result is an observation, lesson, or rule candidate.
8. Repeated/systemic issues become a GitHub learning issue.
9. After review, validated rules are added to the appropriate GitHub rule file and linked back to the Notion lesson.
10. Add a regression test/example whenever practical.
11. Future PP decisions must check relevant permanent lessons before acting.

## Learning levels

- **Observation:** one event; no behavior change by itself.
- **Lesson candidate:** a plausible recurring pattern.
- **Repeated:** observed across multiple independent cases.
- **Validated:** supported by enough evidence to justify a procedural change.
- **Permanent:** incorporated into the applicable GitHub rule set and regression-tested.

## Guardrails

- One bad trade does not automatically create a new rule.
- A losing trade is not automatically a mistake; evaluate process separately from outcome.
- Do not optimize rules solely for hindsight or a single ticker/timeframe.
- Never remove an existing HADES rule merely because it produced a losing outcome.
- Distinguish **rule failure** from **rule violation**.
- Preserve the original decision and evidence; do not rewrite history after the outcome.
- Rule changes require explicit validation/review before becoming permanent.
- High-impact capital/risk changes should remain subject to the existing HADES capital and Engine constraints.

## Post-mortem questions

1. What did PP believe before acting?
2. What evidence supported the belief?
3. What evidence contradicted it?
4. What information was missing or unavailable?
5. Which HADES rule applied?
6. Was the rule missing, ambiguous, ignored, or incorrectly applied?
7. Was the failure analysis, process, information, timing, risk, communication, or continuity related?
8. Has the same failure happened before?
9. What specific behavior should change?
10. What test would prove PP no longer repeats the failure?

## Regression principle

Every important procedural correction should have a repeatable scenario that can be presented to PP without revealing the expected answer. The goal is to test behavior, not memorization.

Example:
- Failure: RSI improvement was treated as reversal confirmation while structure remained bearish.
- Correction: RSI cannot independently confirm a reversal.
- Regression scenario: RSI improves while price continues lower lows and volume confirms selling pressure.
- Expected behavior: PP identifies the setup as unconfirmed and does not call a reversal solely from RSI.

## Notion alignment

Use the existing HADES Notion architecture rather than creating duplicate operating systems:

- **Master Continuity:** permanent identity, policies, and session memory.
- **Signal Log:** market signals, evidence, status, and outcomes.
- **Treasury/HQ:** live capital, positions, cash, scorecard, and operations.
- **PP Learning Log:** proposed lessons, post-mortems, repeated failures, and validation status.
- **HADES Bible / Academy:** finalized philosophy and educational doctrine where appropriate.

Do not place live numbers or full session history in this repo file. GitHub mirrors durable procedures; Notion remains the detailed memory layer.

## Rule promotion

A lesson should normally move into a permanent GitHub rule only when:

- the failure is clearly defined;
- the root cause is understood;
- the correction is specific and actionable;
- the correction does not conflict with higher-priority HADES rules;
- the lesson is supported by repeated or sufficiently strong evidence; and
- a regression test/example exists or is explicitly waived with a reason.

## Change record

When a permanent rule changes, record:
- rule identifier;
- previous behavior;
- new behavior;
- reason for change;
- supporting Notion lesson/log;
- validation evidence;
- date.
