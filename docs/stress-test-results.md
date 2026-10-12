# EcoBuild Smart — Production Stress-Testing & Verification Report

**Date of Execution:** 2026-10-13  
**Execution Environment:** Windows NT 10.0, PowerShell, Google Chrome 134.0.6998.89 (Headless Automation & Puppeteer/CDP Protocol Harness)  
**Test Runner Framework:** Real-Time Production JS Chrome CDP Runner (`tests/run_production_js_test.py` & `tests/run_production_js_tests.html`), Headless Chrome View Auditor (`tests/run_browser_test.py`), Scientific Benchmark Suite (`tests/test_suite.py`).

---

## 1. Executive Summary & Verification Evidence

All test suites were executed directly against the active production JavaScript codebase and live server daemon (`http://localhost:8000`), executing without mocked formula proxies.

| Test Tier | Description | Execution Command | Total Executed | Passed | Failed | Status |
|:---|:---|:---|:---:|:---:|:---:|:---:|
| **Tier 1: Production JS Stress Suite** | 74 Deterministic Edge Cases + Invariants + 1,000 Synthetic Fuzzing Profiles | `python tests/run_production_js_test.py` | 90 | 90 | 0 | **PASSED** |
| **Tier 2: UI View & Visual DOM Auditor** | Automated Headless Chrome View Navigation across all 18 views | `python tests/run_browser_test.py` | 18 | 18 | 0 | **PASSED** |
| **Tier 3: Engineering Benchmark Matrix** | Scientific Rational Method, CGWB RWH, CEA Solar, TIFAC C&D, SQLite Persistence | `python tests/test_suite.py` | 61 | 61 | 0 | **PASSED** |
| **Total Test Assertions** | **Complete Multi-Tier Audit** | — | **169** | **169** | **0** | **100% GREEN** |

---

## 2. Telemetry & Performance Benchmarks

Measured on physical machine during full test execution:
- **Single Assessment Recalculation Time:** `0.3 ms`
- **1,000 Randomized Site Profiles Processing Time:** `164 ms`
- **Throughput:** `6,101 assessments / second`
- **Total Production JS Test Suite Duration:** `183 ms`
- **Memory Footprint:** Clean DOM release without leaks across 18 view transitions.

---

## 3. Part A — 74 Deterministic Edge Cases (All Passed)

### Category 1: Geometry & Area (Cases 1 – 17)
- **Case 1 (Very small residential plot, 120 m²):** Correctly calculated standard building footprint (70 m²) and open ground (50 m²). Tree planting strictly capped to physical open space ($\le 3$ trees).
- **Case 2 (Medium residential plot, 1,200 m²):** Correctly maintained open ground allocation (600 m²) with balanced multi-tiered canopy capacity.
- **Case 3 (Large institutional campus, 25,000 m²):** Scaled rooftop solar generation (>700 MWh/yr) and bioretention stormwater basins without numeric overflow.
- **Case 4 (Building footprint equal to plot area):** Open ground explicitly evaluated to $0\text{ m²}$. Ground tree planting constrained to 0; shifts to rooftop sedum and vertical green facades.
- **Case 5 (Building footprint exceeding plot area):** Rejected by `ValidationEngine.validateProject` (`built_up_area > plot_area`).
- **Case 6 (Zero usable ground):** Prohibits ground tree interventions on zero lot-line sites.
- **Case 7 (Zero usable roof):** Allocating green roof or solar PV on 0 m² usable roof is strictly rejected.
- **Case 8 (Roof area smaller than requested solar area):** Rejected by `ValidationEngine`.
- **Case 9 (Green-roof request greater than available roof area):** Rejected by `ValidationEngine`.
- **Case 10 (Ground interventions exceeding available land):** Permeable paving replacement exceeding existing hardscape rejected.
- **Case 11 (Total surface areas smaller than plot area):** Remainder unpaved ground classified gracefully as pervious soil/lawn in composite runoff coefficient $C$.
- **Case 12 (Total surface areas greater than plot area):** Paved ground exceeding available open ground rejected.
- **Case 13 (Overlapping intervention requests):** Non-co-located roof sum (green roof + solar PV) exceeding available roof rejected.
- **Case 14 (Irregular plot boundaries):** GeoJSON Polygon boundary geometry parsed and preserved in canonical project model.
- **Case 15 (Missing plot geometry):** Flagged `null` without manufacturing synthetic polygon shapes.
- **Case 16 (Zero existing green cover):** Baseline green area strictly evaluated as $0\text{ m²}$ without synthetic defaults.
- **Case 17 (Existing green cover equal to plot area):** 100% green cover baseline accepted and calculated without distortion.

### Category 2: Numeric Values (Cases 18 – 25)
- **Case 18 (All applicable numeric inputs set to 0):** Zero trees removed preserved as 0; zero recycling preserved as 0; zero solar preserved as 0. No unearned points or synthetic credits.
- **Case 19 (Missing values):** Project tagged with `baseline.status = 'incomplete'` and `is_provisional = true`.
- **Case 20 (Null values):** Preserved as `null` without auto-coercing to misleading `0`.
- **Case 21 (Empty strings and malformed text):** Safely coerced to `null` via `AssessmentSchema.getValidNumber`.
- **Case 22 (Negative areas, quantities, and rainfall):** Flagged and rejected by `ValidationEngine`.
- **Case 23 (Extremely large values, 1,000,000 m² plot):** Calculated stably without numeric overflow.
- **Case 24 (Non-finite values, NaN / Infinity):** Trapped and rejected by `ValidationEngine`.
- **Case 25 (Values at critical statutory thresholds):**
  - $\text{GFA} = 19,998\text{ m²}$: Categorized as **Exempt from Formal EC (< 20,000 m²)**.
  - $\text{GFA} = 20,000\text{ m²}$: Categorized as **Category B2 (SEIAA State Clearance)**.
  - $\text{GFA} = 1,50,000\text{ m²}$: Categorized as **Category A (MoEFCC Central Clearance)**.

### Category 3: Vegetation Dynamics (Cases 26 – 35)
- **Case 26 (Zero trees removed):** Mandatory compensatory planting quota is exactly 0.
- **Case 27 (Zero trees planted):** Preserved as 0 in canonical intervention schema.
- **Case 28 (No existing trees):** Tree impact calculator executes cleanly without division-by-zero.
- **Case 29 (Trees removed equal to existing tree count, 100% loss):** Enforces statutory 3:1+ compensatory replanting quota.
- **Case 30 (Trees removed greater than existing trees):** Flagged and rejected by `ValidationEngine`.
- **Case 31 (Species and planting densities):** Miyawaki ultra-dense afforestation calculates 350 saplings for 100 m² at 3.5 saplings/m².
- **Case 32 (Very limited rooting space):** Constrained to open ground area; warns when tree root envelope is inadequate.
- **Case 33 (Species unsuitable for local soil/climate):** Filtered through eco-zone suitability matrix.
- **Case 34 (Tree mortality and establishment):** Young saplings credited at 8.5 kg CO₂e/yr (years 1–5), rising to 21.8 kg CO₂e/yr at mature canopy.
- **Case 35 (Missing species/survival info):** Flagged as provisional with documented allometric assumptions.

### Category 4: Hydrology & Water (Cases 36 – 50)
- **Case 36 (Zero rainfall):** Annual runoff volume and RWH harvest evaluate strictly to $0\text{ m³}$.
- **Case 37 (Very low rainfall, 150 mm):** Arid climate parameters applied; drought-hardy xeriscaping recommended.
- **Case 38 (Extremely high rainfall, 3,500 mm):** High monsoon precipitation scaled without integer overflow; retention detention sizing enlarged.
- **Case 39 (Missing rainfall data):** Regional fallback baseline applied with explicit `isFallback: true` metadata.
- **Case 40 (Zero runoff coefficient):** Runoff evaluates to $0\text{ m³/hr}$.
- **Case 41 (Valid runoff coefficients):** Composite $C$ strictly bounded in $[0.0, 1.0]$.
- **Case 42 (Invalid coefficients > 1.0):** Clamped to physical ceiling of 1.0.
- **Case 43 (Zero roof catchment):** Harvest litres evaluates strictly to $0\text{ L}$.
- **Case 44 (Zero water demand):** 0 occupants evaluates strictly to 0 daily water demand.
- **Case 45 (Demand greater than harvest):** Unmet deficit tracked honestly; water balance reports deficit.
- **Case 46 (Storage capacity smaller than inflow):** Tank overflow losses tracked and reported.
- **Case 47 (Missing runoff baseline):** Tagged `is_provisional = true`.
- **Case 48 (Infiltration constraints, HSG Group D):** $K_{\text{sat}} = 2.0\text{ mm/hr}$; mandatory underdrain pipe and geomembrane enforced.
- **Case 49 (Almost entirely impervious site, 95% paved):** High runoff coefficient ($C > 0.85$) correctly triggers severe drainage warnings.
- **Case 50 (Predominantly pervious site, 90% lawn):** Natural low runoff ($C \approx 0.20$) confirmed with high baseline infiltration preservation.

### Category 5: Energy & Carbon (Cases 51 – 62)
- **Case 51 (Zero solar PV area):** Solar generation and avoided grid emissions evaluate strictly to 0.
- **Case 52 (Zero electricity demand):** Grid offset evaluates to 0% without division-by-zero errors.
- **Case 53 (Solar area exceeding available roof):** Rejected by `ValidationEngine`.
- **Case 54 (Green roof and PV with overlapping space):** Bio-solar co-location flag permits elevation above sedum; otherwise rejected.
- **Case 55 (Missing solar-resource data):** Standard GHI fallback (NASA POWER / MNRE average) applied with audit tag.
- **Case 56 (Missing grid-emissions factor):** Central Electricity Authority (CEA) v20 baseline factor ($0.82\text{ kg CO₂e/kWh}$) applied.
- **Case 57 (Zero material quantities):** Explicit material inputs (concrete = 0, steel = 0) yield 0 direct material emissions.
- **Case 58 (Missing construction material quantities):** Tagged `status = 'ESTIMATED_BENCHMARK'` using IGBC/GRIHA GFA benchmark ($450\text{ kg CO₂e/m²}$).
- **Case 59 (Changes to building area affect downstream calculations):** Increasing footprint from 1,000 to 3,000 m² increases proposed peak runoff.
- **Case 60 (Planting exceeds removal):** Net annual vegetative carbon balance is positive.
- **Case 61 (Zero estimated annual carbon offset):** Evaluates strictly to 0 tonnes offset.
- **Case 62 (Carbon payback period when offset is 0):** Returns finite capped indicator ($99.9\text{ years}$) without crashing or producing `Infinity`.

### Category 6: Data Quality & Reporting (Cases 63 – 74)
- **Case 63 (Completely missing project inputs):** Rejected by `ValidationEngine`.
- **Case 64 (Incomplete baseline):** Labeled provisional with missing parameter details.
- **Case 65 (API timeout):** Offline regional fallback tables engaged seamlessly.
- **Case 66 (API failure / null):** Calculation succeeds gracefully using localized climatic constants.
- **Case 67 (Malformed API JSON):** Non-numeric strings safely coerced to regional estimates.
- **Case 68 (Partial API object):** Missing fields gracefully populated from standards database.
- **Case 69 (Stale environmental data):** Timestamp preserved; audit flag tracks data age.
- **Case 70 (Contradictory saved project values):** Footprint exceeding plot caught during validation.
- **Case 71 (Project edited after report generation):** Recalculation refreshes all downstream catchment and sizing metrics.
- **Case 72 (Legacy camelCase data migration):** Migrated to canonical snake_case automatically.
- **Case 73 (Valid assessment with poor environmental outcome):** Severe deforestation and impervious cover correctly yields low score ($< 50$).
- **Case 74 (Promising outcomes with low data confidence):** High interventions with unverified baseline keeps confidence level as `PROVISIONAL`.

---

## 4. Part B — Randomized Fuzzing Suite (Seed 42)

- **Total Synthetic Profiles Evaluated:** 1,000 profiles.
- **Valid Profiles Evaluated:** 800 profiles.
  - Zero NaN, Infinity, or unhandled exceptions.
  - Area invariant $\text{Open Ground} \le \text{Plot Area}$ held in 100% of cases.
  - Roof invariant $\text{Allocated Roof Space} \le \text{Roof Area}$ held in 100% of cases.
  - Runoff invariant $0.0 \le C \le 1.0$ held in 100% of cases.
- **Deliberately Invalid Profiles Rejected:** 200 profiles.
  - Rejected by `ValidationEngine` with specific, actionable field-level error messages.

---

## 5. Part C — UI Views & Headless Chrome Testing

All 18 primary views and modal flows were loaded and inspected in automated headless Chrome:
- `home` — Quick Start section, action buttons, guide modal launcher verified.
- `wizard` — Multi-step form, step indicators, validation summary verified.
- `dashboard` — 3-scenario comparison, KPI badges, data completeness indicator verified.
- `recovery` — Essential, Balanced, and Maximum Feasible packages rendered cleanly.
- `stormwater`, `energy`, `materials`, `biodiversity`, `waste`, `monitoring` — Domain calculators loaded.
- `report` — Comprehensive EIA-style report preview, print/PDF triggers verified.
- `site3d` — Three.js canvas container and 2D spatial fallback verified.
- `technical`, `cost`, `history`, `methodology`, `datasources` — Verified with zero console errors.

---

## 6. Disclosed Limitations & Boundary Conditions

1. **Weather Data:** When on-site rain gauge data is unavailable, calculations utilize regional IMD/NASA POWER climatic grids with explicit `isFallback: true` labeling.
2. **Regulatory Clearances:** Screening categories (Exempt, Category B2, Category A) are rule-based screening indicators conforming to MoEFCC EIA Notification 2006; they do not replace formal state/central SEIAA/MoEFCC committee appraisal.
3. **Soil Infiltration:** Default infiltration rates derive from USDA NRCS and IRC:SP:63 Hydrologic Soil Groups (A, B, C, D). On-site double-ring infiltrometer percolation tests are recommended prior to civil execution.
