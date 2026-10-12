# EcoBuild Smart — UI Wireframe & Interaction Specification

**Document:** `docs/ui-wireframes.md`  
**System:** EcoBuild Smart Eco Management System  
**Version:** 3.0.0 Architecture Specification  
**Status:** Approved & Implemented Specification  

---

## 1. Global Interface & Design System Principles

EcoBuild Smart utilizes a **3D Crystalline Engineering Design System** blending architectural rigor with scientific clarity:

- **Color Tokens:**
  - `Forest Deep`: `#123C32` (Primary Brand & Dark Surfaces)
  - `Emerald Active`: `#237A57` / `#10B981` (Accents, Verified Badges, Positive Gains)
  - `Warm Ivory`: `#F6F6F0` (Card Backgrounds & Soft Sections)
  - `Sage Border`: `#D5E0D7` / `#E7EEE7` (Structural Dividers & Panels)
  - `Amber Alert`: `#D99A36` (Uncertainty, Incomplete Baselines, Regulatory Notes)
  - `Red Deficit`: `#B94D4D` (Negative Impacts, Tree Loss, Runoff Surge)
- **Typography:**
  - Headings & Branding: `Newsreader` (Editorial Serif) & `Plus Jakarta Sans`
  - Body & UI: `Inter` & `Plus Jakarta Sans`
  - Formulas & Numerical Data: `JetBrains Mono` with `tabular-nums`
- **Component Rules:**
  - **No Decorative-Only Controls:** Every interactive element triggers genuine calculation or state updates.
  - **No Duplicate Scores:** Scores are displayed with their distinct sub-indicators and never duplicated across competing cards.
  - **Data Completeness Indicators:** Separate performance tier from data confidence rating and statutory legal screening.
  - **Accessibility:** Full keyboard navigability, WCAG AA contrast, visible focus rings, and `@media (prefers-reduced-motion)` compliance.

---

## 2. Wireframe A: Homepage (`#home-view`)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [🌱 EcoBuild 3D SMART]   Home   About   Condition Engine   Methodology  │
│                          [📲 Install App] [📊 Live Workspace] [Start]  │
├────────────────────────────────────────────────────────────────────────┤
│ HERO SECTION                                                           │
│ "Understand Your Site's Environmental Impact"                          │
│ "Assess conditions. Compare recovery plans. Plan with evidence."       │
│                                                                        │
│ [ Start New Assessment ]  [ Open Existing Project ]  [ Explore Demo ]  │
│                                                                        │
│ 3D Spatial Digital Twin Canvas (Metric 1:1 Scale Preview)              │
├────────────────────────────────────────────────────────────────────────┤
│ 📖 HOW TO USE ECOBUILD — QUICK START GUIDE                              │
│ "Assess your site. Understand its environmental impacts.               │
│  Compare realistic ways to improve it."                                │
│                                                                        │
│ ┌──────────────┬──────────────┬──────────────┬──────────────┐          │
│ │ 1. Start     │ 2. Location  │ 3. Conditions│ 4. Proposal  │          │
│ │ Project      │ & Dimensions │ & Baseline   │ & Materials  │          │
│ ├──────────────┼──────────────┼──────────────┼──────────────┤          │
│ │ 5. Climate   │ 6. Review    │ 7. Compare   │ 8. Generate  │          │
│ │ & Assumptions│ Assessment   │ Recovery     │ EIA Reports  │          │
│ └──────────────┴──────────────┴──────────────┴──────────────┘          │
│                                                                        │
│ [ 🚀 Open Interactive Step-by-Step Walkthrough Guide ]                 │
├────────────────────────────────────────────────────────────────────────┤
│ 13-STEP FIRST-TIME DETAILED WALKTHROUGH MODAL / EXPANDER               │
│ Step 1: Project Identity       Step 8: Assessment Generation           │
│ Step 2: Location & Coordinates Step 9: Results Interpretation          │
│ Step 3: Site & Surface Areas   Step 10: Recovery Scenario Selection    │
│ Step 4: Existing Baseline      Step 11: EIA Report Review              │
│ Step 5: Proposed Development   Step 12: Save, Compare & Export         │
│ Step 6: Environmental Data     Step 13: Demo Case Study                │
│ Step 7: Input Validation Layer                                         │
├────────────────────────────────────────────────────────────────────────┤
│ CORE SYSTEM PILLARS                                                    │
│ [ Hydrology & SUDs ] [ Carbon & Energy ] [ Nature Recovery ]          │
├────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                 │
│ Methodology • Academic Sources • Privacy & Offline Mode • Copyright    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Wireframe B: Assessment Input Wizard (`#wizard-view`)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ ← Back to Home          NEW ENVIRONMENTAL ASSESSMENT       [Save Draft]│
├──────────────────┬─────────────────────────────────┬───────────────────┤
│ STEP PROGRESS    │ ACTIVE FORM INPUT               │ REAL-TIME SITE    │
│                  │                                 │ AREA BALANCE      │
│ 1. Project Info  │ Step 3: Site & Building Geometry│                   │
│ 2. Location      │                                 │ Plot Area:        │
│ 3. Geometry (●)  │ Total Plot Area (m²):           │ 5,000 m²          │
│ 4. Baseline      │ [ 5000 ]                        │                   │
│ 5. Proposal      │                                 │ Built-Up Footprint│
│ 6. Water/Energy  │ Built-Up Footprint (m²):        │ 2,200 m² (44%)    │
│ 7. Waste/C&D     │ [ 2200 ]                        │                   │
│ 8. Review        │                                 │ Open Ground:      │
│                  │ Usable Roof Area (m²):          │ 2,800 m² (56%)    │
│                  │ [ 2200 ]                        │                   │
│                  │                                 │ Area Conflict:    │
│                  │ Number of Floors: [ 2 ]         │ None (Valid)      │
│                  │                                 │                   │
│                  │ ⚠️ Inline Validation:           │ Completeness:     │
│                  │ Built-up cannot exceed plot.    │ 85% Verified      │
├──────────────────┴─────────────────────────────────┴───────────────────┤
│ [ ← Back ]                                    [ Next: Baseline → ]     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Wireframe C: Assessment Results Dashboard (`#dashboard-view`)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Kolhapur Engineering Campus Expansion          Status: Complete        │
│ Assessment Run: #RUN-20261013-42               [🔄 Recalculate] [📄 EIA]│
├───────────────────┬───────────────────┬────────────────────────────────┤
│ PERFORMANCE SCORE │ DATA CONFIDENCE   │ STATUTORY EIA SCREENING        │
│ 86 / 100          │ High (92%)        │ Category: Exempt from Prior EC │
│ Tier: Outstanding │ Source: Verified  │ Authority: Local SPCB / Corp   │
│ (Design Metric)   │ On-Site Survey    │ Basis: GFA < 20,000 m²         │
├───────────────────┴───────────────────┴────────────────────────────────┤
│ BEFORE VS PROPOSED VS MITIGATED TRIPLE-SCENARIO MATRIX                 │
│ ┌───────────────────────────┬──────────┬──────────┬──────────┬────────┐│
│ │ Indicator                 │ Baseline │ Proposed │Mitigated │ Net Δ  ││
│ ├───────────────────────────┼──────────┼──────────┼──────────┼────────┤│
│ │ Green Cover Area (m²)     │ 2,400    │ 800      │ 2,100    │ -12.5% ││
│ │ Mature Tree Count         │ 80       │ 50       │ 140      │ +75.0% ││
│ │ Peak Runoff (m³/hr)       │ 35.0     │ 147.0    │ 58.8     │ -60.0% ││
│ │ Annual RWH Yield (kL)     │ 0        │ 0        │ 1,657    │ +100%  ││
│ │ Solar Electricity (MWh/yr)│ 0        │ 0        │ 182.8    │ +100%  ││
│ │ Avoided Carbon (t CO₂e/yr)│ 0        │ 0        │ 149.9    │ +149.9t││
│ └───────────────────────────┴──────────┴──────────┴──────────┴────────┘│
├────────────────────────────────────────────────────────────────────────┤
│ ENGINEERING DOMAINS (TABS)                                             │
│ [ Hydrology ] [ Carbon ] [ Energy ] [ Vegetation ] [ C&D Waste ]       │
│ Formula: Q = (C × I × A) / 1000 m³/hr   [ℹ️ Explain Formulation]       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Wireframe D: Recovery Planner (`#recovery-view`)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ NATURE RECOVERY & MITIGATION PORTFOLIO      Eligible Open Ground: 2,800│
│ Site-Constrained Pareto Optimizer Engine    Eligible Roof Deck: 2,200 m│
├───────────────────┬───────────────────┬────────────────────────────────┤
│ SCENARIO 1        │ SCENARIO 2        │ SCENARIO 3                     │
│ Essential (★)     │ Balanced (★★)     │ Maximum Feasible (★★★)         │
│ Cost: ₹14.5 Lakhs │ Cost: ₹32.8 Lakhs │ Cost: ₹68.4 Lakhs              │
│ Priority: Bylaws  │ Priority: Synergy │ Priority: Net-Zero Water & PV  │
│                   │                   │                                │
│ • 90 Native Trees │ • 90 Native Trees │ • 140 Native Trees             │
│ • Bioswales 180m² │ • Miyawaki 350m²  │ • Bio-Solar Roof (1,500 m²)    │
│ • Basic FirstFlush│ • Pavers 600m²    │ • Max Permeable Pavers         │
│                   │ • 126 kWp Solar PV│ • Advanced Tertiary STP        │
├───────────────────┴───────────────────┴────────────────────────────────┤
│ PHYSICAL AREA ACCOUNTING AUDIT                                         │
│ • Roof Envelope: Allocated 1,200 m² / Available 2,200 m² (FEASIBLE)    │
│ • Ground Area: Allocated 1,130 m² / Available 2,800 m² (FEASIBLE)      │
│ • Unit Cost Source: CPWD Delhi Schedule of Rates (DSR) 2023–24         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Wireframe E: Statutory EIA & Technical Report Centre (`#report-view`)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ DOCUMENT REPORT CENTRE             Active Project: Kolhapur Expansion  │
│ [🖨️ Print Report]  [📥 Download PDF]  [Export DXF CAD]  [Copy JSON]    │
├──────────────────────────┬─────────────────────────────────────────────┤
│ REPORT SELECTOR          │ UNIFIED DOCUMENT PREVIEW                    │
│                          │                                             │
│ 1. Executive Summary     │ Section 1: Project Identity & Scope         │
│ 2. EIA-Style Assessment  │ Section 2: Baseline Environmental Conditions│
│ 3. Detailed Recovery     │ Section 3: Proposed Development Pressures   │
│ 4. Cost & Implementation │ Section 4: Quantitative Impact Evaluation   │
│ 5. Technical Appendix    │ Section 5: Mitigation & Residual Impacts    │
│ 6. Data Quality & Audit  │ Section 6: Statutory MoEFCC 2006 Screening  │
│ 7. Monitoring Plan       │ Section 7: Sourced Implementation Schedule  │
│                          │                                             │
│                          │ * Note: Preliminary Environmental Modeling   │
│                          │   Document. Formal clearance via PARIVESH.  │
└──────────────────────────┴─────────────────────────────────────────────┘
```
