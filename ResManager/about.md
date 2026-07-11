# Reservoir Manager — Water Year Challenge

A single-page browser game built with HTML, CSS, and JavaScript. No dependencies.

## Concept

The player manages a reservoir over a 52-week water year. Each week, probabilistic forecasts (95% CI) are shown for both **inflow** and **downstream demand**. The player decides how much to release; then actuals are revealed, storage updates, and points are awarded.

There are two layers of uncertainty: inflow (how much water arrives) and demand (how much water must leave). A release that looks safe at mean inflow and mean demand can go wrong if actual inflow is low and actual demand is high simultaneously.

## Reservoir Zones

Total capacity: **1,000 units** (abstractly representing thousand acre-feet or similar).

| Zone | Storage Range | Weekly Score | Notes |
|---|---|---|---|
| Dead Pool | 0 – 100 | −20 pts | Water below this elevation cannot be released by gravity |
| Conservation Pool | 100 – 600 | +10 pts base, up to +12 proximity bonus | Active storage for water supply; optimal operating zone |
| Flood Control Pool | 600 – 850 | 0 pts | Reserved empty capacity to capture flood inflows |
| Surcharge Pool | 850 – 1,000 | −15 pts | Above normal operating range; structural risk zone |

**Conservation target:** 350 units (mid-conservation pool). A proximity bonus scales linearly from **+12 pts at exactly 350** down to 0 at the pool edges (±250 units away). Labels: "perfect target" (within 25), "near target" (within 75), "target proximity" (within 250).

**Overflow:** If storage would exceed 1,000, water spills uncontrolled over the dam. Storage is capped at capacity.

## Downstream Demands

The player must release enough water each week to cover three seasonal demand components plus a baseline environmental flow requirement. All demands are uncertain — only forecasts with 95% CIs are shown in advance.

| Component | Peak season | Typical range | Seasonal pattern |
|---|---|---|---|
| Urban water supply | Summer (week 30) | 5 – 15 units/wk | `base=10, amp=5, CV=12%` |
| Agriculture (irrigation) | Early summer (week 26) | 0 – 25 units/wk | `base=0, amp=25, CV=22%` — near zero in winter |
| Hydroelectric | Winter (week 4) | 2 – 14 units/wk | `base=8, amp=6, CV=18%` |
| Environmental flow | Year-round | 15 units/wk (fixed) | Minimum in-stream flow requirement |

**Shortfall penalty:** if release < environmental flow + actual total demand, penalty = `−max(1, round(shortfall / 8))` pts. Rationing is sometimes the right call — draining storage into the dead pool to meet demand costs far more than accepting a modest shortfall penalty.

The demand forecast is shown as a combined canvas with rows for total demand and each component, sharing an x-axis with the inflow forecast so the player can compare the two at a glance.

## Inflow Model

Inflows follow a seasonal sinusoidal pattern peaking around week 16 (spring snowmelt) and reaching a low around week 42 (late fall). The formula:

```
mean(week) = 58 + 52 × cos( (week − 16) / 52 × 2π )   [minimum: 6]
SD = mean × 0.42
```

The 95% confidence interval displayed is `mean ± 1.96 × SD`. Actual inflow is sampled from a normal distribution with those parameters, plus a ~6% chance of an extreme event that adds additional inflow. All values are floored at 0.

## Scoring Summary

| Condition | Points |
|---|---|
| Storage in Conservation Pool | +10 |
| Target proximity bonus (linear, max at 350) | +1 to +12 |
| Storage in Flood Control Pool | 0 |
| Storage in Surcharge Pool | −15 |
| Storage in Dead Pool | −20 |
| Demand + env. flow shortfall | −1 pt per 8 units short (min −1) |

Maximum theoretical score (52 weeks, perfect every week): **~1,144 pts**

### Grade Thresholds

| Grade | Score |
|---|---|
| A+ | 800+ |
| A | 650–799 |
| B | 500–649 |
| C | 350–499 |
| D | 175–349 |
| F | < 175 |

## Controls

- **Release slider** — sets the weekly release (0–250 units)
- The projected storage display updates live, showing where storage will land at the forecast mean, and the range if actual inflow hits the CI bounds
- **Release Water** — commits the decision; actual inflow is then revealed
- **Next Week** — advances to the next time step

The slider holds its value between weeks — it does not auto-reset. The "Min suggested" hint in the control panel shows `env. flow (15) + forecasted demand mean` as a starting reference.

## Files

- `index.html` — the complete game (HTML + CSS + JS, self-contained)
- `about.md` — this file
