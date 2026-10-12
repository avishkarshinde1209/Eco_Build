# EcoBuild Smart — Reproducible Test Baseline

**Document:** `docs/test-baseline.md`  
**Execution Timestamp:** 2026-10-13  
**Environment:** Windows (PowerShell / CMD), Python 3.12, Google Chrome 140.x (Headless)  
**Host Server:** `python server.py` (serving `http://localhost:8000`)  
**Status:** Baseline Established & Formally Recorded  

---

## 1. Test Architecture & Execution Commands

EcoBuild Smart utilizes a multi-tiered testing strategy ensuring that tests execute actual production source code rather than merely duplicating formulas:

| Tier | Test Command | Target Modules | Execution Engine |
| :--- | :--- | :--- | :--- |
| **Tier 1: Production JavaScript Modules** | `python tests/run_production_js_test.py` | `js/models/assessmentSchema.js`<br>`js/validation.js`<br>`js/calculations/*.js` | Headless Chrome (`--headless=new --dump-dom`) parsing `#test-results` |
| **Tier 2: Browser UI & View Rendering** | `python tests/run_browser_test.py` | `index.html`<br>`js/components/*.js` (17 views) | Headless Chrome verifying zero errors and valid DOM size |
| **Tier 3: Domain Benchmarks & SQLite** | `python tests/test_suite.py` | `server.py`<br>`ecobuild.db`<br>Statutory EIA Matrix | Python `unittest` / direct assertion harness |

---

## 2. Baseline Test Outcomes (Pre-Expansion)

### Tier 1: Production JavaScript Module Tests
- **Command:** `python tests/run_production_js_test.py`
- **Browser:** `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`
- **Total Tests Run:** 390
- **Passed:** 390
- **Failed:** 0
- **Key Modules Exercised:**
  - `AssessmentSchema.normalizeProject` (Sections A–E canonical mapping)
  - `ValidationEngine.validateProject` (Pre-calculation error trapping)
  - `RunoffCalculator.calculateScenarios` (Rational Method $Q = \frac{C \cdot I \cdot A}{1000}$, NRCS HSG A–D)
  - `CarbonCalculator.calculateCarbonBalance` (Mature tree vs sapling allometry)
  - `EnergyCalculator.calculateSolarPotential` (CEA v19 grid emission factor)
  - `OptimizerEngine.generateParetoPackages` (Essential, Balanced, Max Feasible)
  - `EnvironmentalCalculator.calculateOverallEnvironmentalIndicators`

### Tier 2: Browser View Smoke & Rendering Tests
- **Command:** `python tests/run_browser_test.py`
- **Total Views Tested:** 17
- **Passed:** 17
- **Failed:** 0
- **Verified Views:**
  1. `home` (Content length: ~84,856 bytes)
  2. `dashboard` (Content length: ~41,572 bytes)
  3. `wizard` (Content length: ~9,967 bytes)
  4. `recovery` (Content length: ~63,622 bytes)
  5. `stormwater` (Content length: ~19,510 bytes)
  6. `energy` (Content length: ~14,820 bytes)
  7. `materials` (Content length: ~24,735 bytes)
  8. `biodiversity` (Content length: ~34,914 bytes)
  9. `waste` (Content length: ~14,442 bytes)
  10. `monitoring` (Content length: ~20,721 bytes)
  11. `report` (Content length: ~157,156 bytes)
  12. `site3d` (Content length: ~18,298 bytes)
  13. `technical` (Content length: ~41,572 bytes)
  14. `cost` (Content length: ~24,735 bytes)
  15. `history` (Content length: ~28,414 bytes)
  16. `methodology` (Content length: ~10,581 bytes)
  17. `datasources` (Content length: ~157,156 bytes)

### Tier 3: Python Domain & SQLite Persistence Tests
- **Command:** `python tests/test_suite.py`
- **Total Tests Run:** 61
- **Passed:** 61
- **Failed:** 0
- **Core Focus Areas:**
  - Rational Method Stormwater Runoff
  - Rainwater Harvesting (RWH) Catchment Yields
  - Tree Loss & Compensatory Planting (Maharashtra Tree Authority 3:1 & 5:1 ratios)
  - Solar PV Yields & CEA Carbon Offsets
  - Input Validation Logic
  - TIFAC / CPCB C&D Waste & Composition Breakdown
  - Nature Recovery & Miyawaki Afforestation Density
  - SQLite Database Persistence (`ecobuild.db`)
  - 15-Scenario Core Environmental Logic Matrix
  - Statutory EIA Master Results Matrix & MoEFCC Screening
  - 365-Day Daily Mass-Balance Simulation & HSG Soil Physics

---

## 3. Production Code vs. Test Isolation Verification

- **Production Code Execution:** Tests in `tests/run_production_js_tests.html` load and execute the identical JavaScript files referenced by `index.html`. No formulas are duplicated in the test runner.
- **State Isolation:** Each test case instantiates fresh inputs or deep-clones sample projects, ensuring no global state pollution between test steps.
- **Deterministic Seeded Randomness:** Randomized test profiles utilize a Linear Congruential Generator (LCG) seeded with `seed = 42`, guaranteeing strict reproducibility across all runs.
