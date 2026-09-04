# Capital routing (HADES)

> Live balances: Notion **Treasury** + **Headquarters**. This file = **routing rules only**.

## Engine vs Core

| Sleeve | Purpose | Default home |
|--------|---------|----------------|
| **Engine** | Active risk, defined-risk trades, learning edge | Tastytrade |
| **Core** | Long-term ownership, low turnover | Fidelity ZERO / DRIP / long holds |
| **Cash pad** | Survival + emergency | KeyBank HYSA + Chime spend |

- New *trading* ideas → **Engine** by default, not Core.  
- Core is for multi-year ownership theses, not tip-chasing.

## Bank / cash floors

| Account | Role | Rule |
|---------|------|------|
| **Chime** | Daily spend | Small float only |
| **KeyBank HYSA** | Cash-on-hand / emergency pad | **Build zone under $700–$2,000** (floor untouchable). **Deployable surplus only at $3,000+** |
| **Fidelity Go** | Core-adjacent robo | **Hold** — do not sell to fund Engine or experiments |

**Hard rule:** Do not pull KeyBank for investments until the floor is met. No “just $5 more into Go” while under floor unless explicitly logged as exception (last exception was Aug 29 $5 — do not repeat under floor).

## Short-horizon capital (≤ 2–3 years)

- Target **30%–50% equity** (prefer lower half of range).  
- Sequence-of-returns risk dominates.  
- **60%+ equity** only for true long-term Core.  

## Background / illiquid

- **Groundfloor** — small RE debt notes; background income only (live size is tens of dollars, not legacy large note figures).  
- **LION / long locks** — treat as non-existent until maturity.  
- **WMT DRIP** — Core ownership, reinvest.  

## Income philosophy

Income that buys **ownership**. Never count paper yield as spendable cash until paid.  
Tastytrade income sleeve (last HQ view): **SCHD, SCHH, BP** holds — sold names stay sold unless a new thesis is journaled.

## Routing checklist before moving money

1. Is KeyBank at/above floor?  
2. Engine or Core?  
3. Short horizon (≤3y) → 30–50% equity rule  
4. Notion Treasury + HQ updated after the move  
5. If Engine trade → full Engine rules (see `ENGINE_RULES.md`)
