# EcoBuild Smart — Source-Level Engineering & Environmental Audit

**Document:** `docs/ecobuild-audit.md`  
**System:** EcoBuild Smart Eco Management System  
**Audit Date:** 2026-10-13  
**Auditor:** Senior Environmental Software Architect & Scientific-Computing Engineer  
**Status:** Living Audit & Verification Record  

---

## 1. Executive Summary

EcoBuild Smart is a scientific environmental assessment, statutory EIA screening, site-constrained green-infrastructure recovery optimizer, and technical reporting platform. This audit documents confirmed defects, root causes, severity classification, reproduction test profiles, and verification statuses across the local repository.

### Severity Classification Standard
- **P0**: Incorrect or misleading environmental results, false legal claims, security vulnerabilities, or corrupted assessment data.
- **P1**: Incorrect recovery feasibility, calculation inconsistencies, failed critical workflows, or report contradictions.
- **P2**: Usability, performance, accessibility, and visual-quality issues.
- **P3**: Non-breaking enhancements and minor cosmetic refinements.

---

## 2. Confirmed Defects Register

### DEF-01 (Severity: P0) — Inappropriate Use of JavaScript `||` Overwriting Legitimate Zero Inputs
- **Affected Files:**
  - `js/models/assessmentSchema.js`
  - `js/calculations/carbonCalculator.js`
  - `js/calculations/waterCalculator.js`
  - `js/calculations/runoffCalculator.js`
  - `js/calculations/vegetationCalculator.js`
  - `js/calculations/scoreCalculator.js`
- **Functions:** `normalizeProject`, `calculateTreeLoss`, `calculateRWH`, `calculateCarbonBalance`, `calculateOverallEnvironmentalIndicators`
- **Reproduction Inputs:**
  ```javascript
  {
    vegetation: { existing_tree_count: 20, trees_removed: 0 },
    waste: { daily_organic_waste_kg: 0, recycling_pct: 0 },
    interventions: { trees_planted: 0, green_roof_m2: 0, solar_pv_area_m2: 0 }
  }
  ```
- **Actual Behaviour (Prior to Fix):**
  - Expressions like `trees_removed || 0`, `daily_organic_waste_kg || 45`, `recycling_pct || 25`, and `solar_pv_area_m2 || 300` caused user zeroes to mutate into arbitrary defaults.
  - Zero trees removed resulted in a false compensatory planting obligation of 90 trees.
  - Zero recycling yielded free performance score points (25% default).
- **Expected Behaviour:** Zero must remain strictly zero. Zero trees removed requires 0 compensatory saplings. Zero recycling yields 0 score points.
- **Remediation:** Implemented `getValidNumber(val, defaultVal)` in `js/models/assessmentSchema.js`. Null, undefined, and NaN fallback to specified defaults, but finite numeric `0` is strictly preserved.
- **Status:** **RESOLVED & VERIFIED** (Tested in `tests/run_production_js_tests.html`).

---

### DEF-02 (Severity: P0) — Synthetic Pre-Development Built Baselines
- **Affected File:** `js/calculations/runoffCalculator.js`
- **Function:** `calculateScenarios(project, environmentalData)`
- **Reproduction Inputs:** Site with unknown baseline green cover (`project.baseline = undefined` or `project.vegetation.existing_green_area = null`).
- **Actual Behaviour (Prior to Fix):** The calculator synthesized fictional pre-existing concrete, asphalt, and standard roof footprints to guarantee that post-development runoff would appear artificially mitigated.
- **Expected Behaviour:** Baselines must represent evidence-based site conditions. Incomplete baselines must be explicitly labeled `status: "incomplete"` and `is_provisional: true` with audit notes.
- **Remediation:** Removed synthetic surface generation. Incomplete baselines are marked provisional with USDA NRCS Hydrologic Soil Group (HSG) screening notes.
- **Status:** **RESOLVED & VERIFIED** (Tested in `tests/run_production_js_tests.html`).

---

### DEF-03 (Severity: P0) — Decoupling Environmental Composite Score from Statutory Legal Clearance
- **Affected Files:**
  - `js/calculations/scoreCalculator.js`
  - `js/calculations/environmentalCalculator.js`
  - `js/components/dashboard.js`
  - `js/components/report.js`
- **Functions:** `calculatePerformanceScore`, `evaluateEiaScreening`, `renderReport`
- **Reproduction Inputs:** Project with score $\ge 65$ and Gross Floor Area (GFA) $< 20,000\text{ m}^2$ or GFA $\ge 1,50,000\text{ m}^2$.
- **Actual Behaviour (Prior to Fix):** Dashboard and report claimed "Statutory Environmental Clearance Approved" based solely on an internal score $\ge 65$.
- **Expected Behaviour:** Environmental score is an internal design metric. Statutory clearance must strictly evaluate the **MoEFCC EIA Notification 2006 Schedule 8** thresholds based on Gross Floor Area (GFA):
  - $\text{GFA} < 20,000\text{ m}^2$: Exempt from formal SEIAA/MoEFCC Prior EC.
  - $20,000 \le \text{GFA} < 1,50,000\text{ m}^2$: Category B2 appraisal via SEIAA / SEAC.
  - $\text{GFA} \ge 1,50,000\text{ m}^2$: Category A appraisal via Central MoEFCC EAC.
- **Remediation:** Implemented legal screening engine strictly based on MoEFCC 2006 thresholds; score display renamed to "EcoBuild Environmental Performance Score" with prominent disclaimer that it does not constitute government clearance.
- **Status:** **RESOLVED & VERIFIED** (Tested in `tests/run_production_js_tests.html`).

---

### DEF-04 (Severity: P0) — Server-Side Request Forgery (SSRF) Vulnerability in Meteorological Proxy
- **Affected File:** `server.py`
- **Endpoint:** `POST /api/environmental/proxy`
- **Reproduction Inputs:** `{"url": "http://127.0.0.1:8000/private_file"}` or `{"url": "http://169.254.169.254/latest/meta-data/"}`
- **Actual Behaviour (Prior to Fix):** Server made arbitrary HTTP/HTTPS requests to any host, allowing internal reconnaissance or unauthorized requests.
- **Expected Behaviour:** Proxy must enforce HTTPS-only and restrict target hosts to an explicit domain allowlist (`api.open-meteo.com`, `archive-api.open-meteo.com`, `air-quality-api.open-meteo.com`, `nominatim.openstreetmap.org`).
- **Remediation:** Added strict HTTPS scheme validation and domain allowlist checking in `server.py`.
- **Status:** **RESOLVED & VERIFIED**.

---

### DEF-05 (Severity: P1) — Cross-Module Property Name & Unit Inconsistencies
- **Affected Files:**
  - `js/calculations/energyCalculator.js`
  - `js/calculations/carbonCalculator.js`
  - `js/calculations/recoveryCalculator.js`
  - `js/components/dashboard.js`
  - `js/components/report.js`
- **Functions:** Property getters across energy, carbon, and recovery engines.
- **Reproduction Inputs:** Changing solar PV area in wizard and inspecting carbon offset in reports.
- **Actual Behaviour (Prior to Fix):**
  - `energyCalculator` returned `annual_generation_kwh` and `annual_co2_offset_tonnes`.
  - `carbonCalculator` queried `annual_solar_generation_kwh`.
  - `recoveryCalculator` queried `annual_co2_saved_tonnes`.
  - Resulted in undefined values or stale recalculation propagation.
- **Expected Behaviour:** Canonical properties must be shared across all consumers:
  - `annual_generation_kwh`
  - `annual_co2_offset_tonnes`
  - `total_embodied_tonnes`
- **Remediation:** Canonical fields standardized in `assessmentSchema.js` and exposed with backward-compatible aliases.
- **Status:** **RESOLVED & VERIFIED** (Tested in `tests/run_production_js_tests.html`).

---

### DEF-06 (Severity: P1) — Stormwater Runoff Rational Method Dimensional Consistency
- **Affected File:** `js/calculations/runoffCalculator.js`
- **Function:** `calculateScenarios`
- **Reproduction Inputs:** Rainfall $I = 35\text{ mm/hr}$, Area $A = 5,000\text{ m}^2$, $C = 0.90$.
- **Actual Behaviour (Prior to Fix):** Conflated peak flow equations with annual volume; failed to scale with NRCS Hydrologic Soil Groups.
- **Expected Behaviour:**
  - Peak flow: $Q_{\text{peak}} = \frac{C \cdot I \cdot A}{1000}\text{ [m}^3\text{/hr]} = 157.5\text{ m}^3\text{/hr}$.
  - Peak discharge: $\text{Discharge} = \frac{Q_{\text{peak}} \times 1000}{3600}\text{ [L/s]} = 43.75\text{ L/s}$.
  - Annual volume: $V_{\text{annual}} = \frac{C \cdot P \cdot A}{1000}\text{ [m}^3\text{]}$.
- **Remediation:** Corrected Rational Method dimensional formulas and incorporated USDA NRCS Soil Groups A, B, C, D.
- **Status:** **RESOLVED & VERIFIED** (Tested in `tests/test_suite.py` and `tests/run_production_js_tests.html`).

---

### DEF-07 (Severity: P1) — Physically Infeasible Recovery Area Allocations
- **Affected File:** `js/calculations/optimizerEngine.js`
- **Function:** `generateParetoPackages(project)`
- **Reproduction Inputs:** Plot area $1,000\text{ m}^2$, Built-up area $1,000\text{ m}^2$ (Zero open ground).
- **Actual Behaviour (Prior to Fix):** Recommended ground tree planting and bioswales despite zero available open ground.
- **Expected Behaviour:**
  - $\sum A_{\text{ground}} \le A_{\text{plot}} - A_{\text{built-up}}$
  - $\sum A_{\text{roof}} \le A_{\text{roof}}$ (unless `bio_solar_colocated: true`)
  - If open ground is 0, allocate 0 ground trees and divert green interventions to roof or vertical surfaces.
- **Remediation:** Added strict geometric boundary clamping and area accounting in `optimizerEngine.js` and `validation.js`.
- **Status:** **RESOLVED & VERIFIED** (Tested in `tests/run_production_js_tests.html`).

---

### DEF-08 (Severity: P2) — Report Generator Fabricated IDs & Signatures
- **Affected File:** `js/components/report.js`
- **Function:** `renderReport`
- **Reproduction Inputs:** Generate downloadable EIA Report.
- **Actual Behaviour (Prior to Fix):** Hardcoded fake PARIVESH IDs (e.g., `SIA/MH/INFRA2/481920/2026`) and fictional NABET/QCI lead auditor accreditation numbers.
- **Expected Behaviour:** EIA report must display real project identifiers, assessment run IDs, data provenance timestamps, and clearly identify itself as an EcoBuild Preliminary Environmental Assessment / Academic Screening Model.
- **Remediation:** Replaced fake IDs with dynamic canonical assessment IDs and clear statutory disclaimers.
- **Status:** **RESOLVED & VERIFIED**.

---

## 3. Continuous Audit & Defect Tracking Log

| Defect ID | Description | Severity | Module | Status | Verification Date |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DEF-01** | `\|\|` zero fallback bug | P0 | Schema & Calculations | RESOLVED | 2026-10-13 |
| **DEF-02** | Synthetic pre-dev baseline | P0 | Runoff Calculator | RESOLVED | 2026-10-13 |
| **DEF-03** | Arbitrary legal compliance claim | P0 | Score & EIA Screening | RESOLVED | 2026-10-13 |
| **DEF-04** | SSRF proxy vulnerability | P0 | Backend `server.py` | RESOLVED | 2026-10-13 |
| **DEF-05** | Property name mismatch | P1 | Energy / Carbon / Recovery | RESOLVED | 2026-10-13 |
| **DEF-06** | Rational Method dimensional unit error | P1 | Runoff Calculator | RESOLVED | 2026-10-13 |
| **DEF-07** | Infeasible spatial allocations | P1 | Recovery Optimizer | RESOLVED | 2026-10-13 |
| **DEF-08** | Fictional EIA IDs and signatures | P2 | Report Generator | RESOLVED | 2026-10-13 |
| **DEF-09** | Zero rainfall fallback evaluated to default | P0 | Runoff Calculator | RESOLVED | 2026-10-13 |
| **DEF-10** | Missing homepage how-to guide | P2 | Home View | IN PROGRESS | 2026-10-13 |
| **DEF-11** | Wireframes documentation missing | P2 | Docs Architecture | IN PROGRESS | 2026-10-13 |
