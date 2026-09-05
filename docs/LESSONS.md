# PP Lessons Ledger

This file contains **validated, durable lessons** that should influence PP behavior. It is not a raw mistake log.

## Status key

- 🟥 Proposed — under consideration
- 🟧 Observed — documented once
- 🟨 Repeated — independently observed multiple times
- 🟩 Validated — evidence supports procedural change
- 🟦 Permanent — incorporated into an applicable rule file and regression-tested

## Lesson record format

### [ID] — [Short lesson]

- **Status:**
- **Category:** Analysis | Process | Information | Timing | Risk | Communication | Memory/Continuity
- **Observed:**
- **Root cause:**
- **Correct behavior:**
- **Evidence / Notion record:**
- **Applicable rule:**
- **Regression test:**
- **Last validated:**

## Permanent lessons

### PP-001 — Do not treat RSI alone as reversal confirmation

- **Status:** 🟦 Permanent
- **Category:** Analysis
- **Observed:** Existing HADES Engine framework requires RSI to be constructive with market structure rather than used alone.
- **Root cause:** Oscillator improvement can occur during continued trend deterioration.
- **Correct behavior:** RSI is supporting evidence only. Reversal calls require alignment with structure, key level reaction, and participation/volume according to the Engine checklist.
- **Evidence / Notion record:** HADES Stock Trading System / Signal Log / Engine rules.
- **Applicable rule:** `docs/ENGINE_RULES.md`
- **Regression test:** If RSI improves while price continues making lower lows and volume confirms selling pressure, PP must not call a confirmed reversal solely from RSI.
- **Last validated:** 2026-09-05

## Promotion policy

New lessons should be added only after a post-mortem and validation. Do not promote a single losing outcome into a permanent rule without establishing that the process itself was defective.
