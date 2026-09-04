# Engine rules (HADES)

> Account: **Tastytrade Engine**. Phase 1 = process over size.  
> Live Net Liq / BP: Notion HQ / Treasury (do not hardcode stale equity here).

## Risk

- **Default max loss per trade:** ≤ **3%** of Engine Net Liq  
- **≤ 8%** only with a full evidence stack (rare; still journaled)  
- Respect **OPT BP / buying power** — never size past what the platform allows  
- **Cash floors** (KeyBank) still apply before adding Engine cash  

## Options

- **Defined risk only** (hard Engine rule)  
- Max loss must be known *before* entry and ≤ 3% Net Liq (and ≤ available BP)  
- Undefined-risk structures are out of policy in Phase 1  

## Engine Indicator Checklist (before any Engine entry)

Any **NO** → no trade.

1. Thesis written — why this name; **Engine**, not Core by default  
2. Market structure — HH/HL or LH/LL clear on decision timeframe  
3. Key level — support / resistance / zone defined  
4. Trend filter — price vs MAs (e.g. 20/40/50) fits the bias  
5. Momentum — RSI constructive **with** structure, not alone  
6. Volume — participation confirms the move or reaction  
7. Stop + invalidation — written **before** size  
8. Risk size — ≤ 3% Engine equity (≤ 8% only with full stack); cash floors respected  
9. Journal — Signal Log / Trade Log updated  

## Journal / Signal Log

- Watches and entries → **Signal Log** in Notion (Status, Thesis, Engine or Core, **GitHub Issue** URL when linked)  
- Close Signal Log rows when resolved (Outcome filled)  
- Optional: open an **Engine watch / trade** issue from templates for levels + checklist  

## Phase 1 posture

- Equity curve may still be climbing out of drawdown — **process over recovery FOMO**  
- No revenge sizing  
- Consumer vs investor: Engine is a machine for **capital to fund the business**, not dopamine  

Logged also in Scroll Library / Academy Module 02 (Notion).
