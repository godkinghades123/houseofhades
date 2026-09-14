# TradingView Tools (HADES Engine)

Reusable chart indicators and scripts for the **Tastytrade Engine** layer.

> These are **visual / signal filters only**.  
> They do **not** replace the HADES entry format or Phase 1 risk rules.

## HalfTrend Long/Short Signal Engine [BigBeluga]

**File:** [`halftrend-long-short-signal-engine.pine`](halftrend-long-short-signal-engine.pine)

- Source: BigBeluga (CC BY-NC-SA 4.0)  
- Core logic: everget HalfTrend  
- TradingView public script: https://www.tradingview.com/script/ZHGPnlAz-HalfTrend-Long-Short-Signal-Engine-BigBeluga/

### What it provides
- Non-repainting LONG / SHORT regime flips
- Adaptive HalfTrend line + ATR channel
- Auto-projected Entry / SL / TP1–TP3 (ATR-based)
- Simple win-rate table + multi-asset trend scan

### HADES usage rules
1. **Never** treat a LONG/SHORT label as automatic permission to trade.
2. Use the projected SL and TP levels as **inputs** into the full HADES format:
   - Entry
   - Stop / Invalidation
   - Size (so Max L ≤ 3% Net Liq and ≤ OPT BP)
   - Reason (one clear sentence)
   - Watchlist / Idea link
3. Still log every acted signal in **Signal Log** and the execution in **Trade Log**.
4. Phase 1 only: defined-risk structures. No undefined-risk options.
5. Internal win-rate table is educational only — does not include fees, slippage, or real sizing.

### Recommended settings (starting point)
- Amplitude: 20 (test 12–24 per symbol)
- Channel Deviation: 2.0
- Base Risk: 3 (adjust so the resulting stop still respects 3% Net Liq after sizing)

### Placement in OS
- Chart overlay for Engine decision timeframe
- Cross-check with Watchtower live holdings and Investment Research Vault watchlists
- Reference from `docs/ENGINE_RULES.md` checklist (trend filter + stop written before size)

Logged: Sep 14, 2026 — added to House of Hades repo for PP continuity and future Engine use.
