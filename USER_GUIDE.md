# EcoBuild Smart — User Guide & Application Walkthrough

Welcome to **EcoBuild Smart**, the Dynamic Environmental Impact Assessment & Green Infrastructure Planner.

- 🌐 **Instant Online Access (No Installation Required):** [https://eco-build-avishkar1209-blush-sigma.vercel.app/](https://eco-build-avishkar1209-blush-sigma.vercel.app/)
- 📁 **GitHub Repository:** [https://github.com/avishkarshinde1209/Eco_Build](https://github.com/avishkarshinde1209/Eco_Build)

---

## 🚀 How to Use EcoBuild (Homepage Quick Start & Walkthrough)

On the home screen, EcoBuild Smart provides two complementary guidance layers designed for both first-time planners and engineering students:

### A. The 8-Step Quick-Start Flow
The homepage features a high-visibility, 8-step quick-start workflow with direct interactive jump links:
1. **1. Set Location** — Enter site address or GPS coordinates to bind local weather grids and soil groups.
2. **2. Describe Site** — Enter plot dimensions, built-up footprint, and number of floors.
3. **3. Existing Baseline** — Record pre-development vegetation, existing trees, and soil permeability.
4. **4. Proposed Development** — Specify planned hardscapes, building geometry, water demand, and electricity use.
5. **5. Review Assumptions** — Verify external climatic datasets, grid carbon factors, and runoff coefficients.
6. **6. Run Assessment** — Execute the canonical calculation engine across all 7 environmental domains.
7. **7. Compare Recovery Plans** — Evaluate Essential, Balanced, and Maximum Feasible restoration packages.
8. **8. Export EIA Reports** — Download or print academic-grade EIA reports, DXF CAD layers, and monitoring plans.

> 📋 **Preparation Checklist:** Before beginning, have your total plot area ($m^2$), building footprint ($m^2$), number of floors, estimated occupant count, and count of existing trees ready.

---

### B. The 13-Step Interactive Walkthrough Modal
Click **"📖 Open Step-by-Step Guide"** on the home screen or in the top navigation bar to launch the step-by-step modal:
- **Step 1: Create a Project** — Choose a descriptive name, select typology, and understand demo vs. real projects.
- **Step 2: Enter Location & Coordinates** — Geocoding, weather grid binding, and offline fallback behavior.
- **Step 3: Define Site Geometry** — Strict dimensional separation between plot, footprint, GFA, roof, and open ground.
- **Step 4: Record Pre-Development Baseline** — Why genuine zeros ($0$ trees removed) must be preserved and how unmeasured baselines are labeled provisional.
- **Step 5: Detail Proposed Construction** — Paving, parking hardscapes, water demands, and electricity profiles.
- **Step 6: Review Traceable Climatic Data** — Understanding IMD rain grids, NASA POWER solar GHI, and CEA grid factors.
- **Step 7: Physical Constraint Validation** — How the engine prevents physical impossibilities (allocations exceeding available ground or roof).
- **Step 8: Execute the Assessment Engine** — Generating before, proposed, and mitigated conditions simultaneously.
- **Step 9: Interpret Results Correctly** — Understanding environmental scores, data confidence ratings, and why scores are decoupled from statutory approvals.
- **Step 10: Compare Recovery Scenarios** — Exploring Essential, Balanced, and Maximum Feasible packages.
- **Step 11: Review Statutory EIA Clearances** — Categorization under MoEFCC EIA Notification 2006 Schedule 8(a)/8(b).
- **Step 12: Save, Compare & Export** — Named snapshots, side-by-side delta variances, and PDF print formatting.
- **Step 13: Explore the Academic Demo** — Hands-on walkthrough using the synthetic Kolhapur Academic Campus profile.

---

## 📌 Navigating the Application

The application features a clean, responsive navigation bar with 8 primary studios:

### 1. 📊 Dashboard
- **Overall Sustainability Score**: Real-time composite rating from 0 to 100 with qualitative tiers (Outstanding, Good, Moderate, High Deficit).
- **Core Deficit Badges**: Upfront embodied carbon deficit, tree canopy removal deficit, impervious surface ratio, and baseline peak stormwater runoff rate.
- **Interactive Visualizations**:
  - Site Land-Cover Doughnut Chart
  - Monthly Rainwater Harvesting (RWH) Potential Bar Chart
  - 7-Dimension Multi-Criteria Radar Score
- **Quick Action Bar**: One-click shortcuts to Nature Recovery, Save Snapshot, 3D Environmental Twin, Technical Studio, Plan History, and Official EIA Report.
- **Showcase Banner**: Direct launch into the Two-Phase Nature Recovery & Circular Materials Action Plan.

---

### 2. 📝 Project Wizard (8-Step Dynamic Data Input)
The wizard employs an **Inter-Parameter Correlation Engine** to assist users during input:
- **Step 1: General Info**: Project name, typology (Residential, Institutional, Commercial, Industrial, Mixed).
- **Step 2: Location & Climate**: Interactive OpenStreetMap locator, automatic GPS geocoding, and one-click city presets (Kolhapur, Mumbai, Pune, Nagpur, Delhi, Bangalore, etc.).
- **Step 3: Site & Building Geometry**: Plot area, built-up footprint, floors, and roof area (with automatic NBC ground coverage suggestions).
- **Step 4: Vegetation & Tree Loss**: Existing green cover, tree counts, category, and trees slated for removal.
- **Step 5: External Surfaces**: Concrete paving, asphalt, interlocking tiles, and open ground (auto-balanced to match plot geometry).
- **Step 6: Water & Energy**: Occupants (auto-calculated from NBC density), daily consumption LPCD, annual electricity kWh, and rooftop orientation.
- **Step 7: Waste & Circularity (TIFAC / CPCB / CPHEEO)**:
  - Auto-fills construction waste (tonnes) based on official TIFAC benchmark rates ($50-65\text{ kg/m}^2$ GFA).
  - Displays CPCB 7-stream material composition breakdown (concrete rubble, soil/sand, masonry, metals, timber, bitumen, packaging).
  - Auto-fills daily municipal solid waste (MSW) and on-site compost yield.
  - Allows manual adjustments or one-click recalculation via official datasets.
- **Step 8: Review & Live Verification**: Queries live Open-Meteo meteorological and air quality feeds for the site coordinates, verifying all parameters before submission.

---

### 3. 🌱 Nature Recovery & Mitigation Portfolio
Presents a quantified, two-phase ecological restoration roadmap:
- **Phase 1: Construction-Phase Mitigation (While Creating the Building)**:
  - Topsoil salvage volume ($m^3$) and stockpile surface area ($\le 2\text{ m}$ height) under NBC 2016 Part 11.
  - CPCB perimeter $6\text{ m}$ dust barrier and high-pressure mist cannons ($\sim 72\%$ PM10 suppression).
  - Low-carbon green concrete ($35\%$ GGBS clinker replacement) avoiding upfront embodied emissions.
  - On-site crushed concrete rubble diverted as road sub-base.
  - Perimeter silt fencing and sediment traps for monsoon soil erosion prevention.
- **Phase 2: Post-Construction Operational Nature Recovery (Permanent Ecological Restoration)**:
  - **Akira Miyawaki Ultra-Dense Native Forest**: Sizing plot area, sapling count ($3.5\text{ trees/m}^2$), and annual CO2 absorption ($10\times$ faster growth).
  - **4-Tier Species Composition Guide**: Specific native Indian species for Canopy, Sub-canopy, Tree, and Shrub layers.
  - **Sponge City Bioretention Bioswales**: Aquifer infiltration rates and pollutant filtering.
  - **Bio-Solar Roof Synergy**: Evapotranspirative green roof cooling boosting PV generation by $+4.5\%$.
  - **On-Site Bio-Composting**: $100\%$ circular conversion of cafeteria organic waste.
  - **Biodiversity Net Gain (BNG)**: Post-development net ecological unit increase ($>+10\%$).

---

### 4. 📁 Plan History & Results Studio
- **Saved Plan Catalog**: Persistent history of running and previous environmental assessments saved in SQLite (`ecobuild.db`) and browser storage.
- **👁️ View Full Results Modal**: Click on any past or running plan to view its complete computed assessment (scores, runoff mitigation, carbon balance, solar kWh, C&D waste, topsoil, and Miyawaki metrics) without losing active unsaved work.
- **⚖️ Side-by-Side Scenario Comparison Modal**: Select any two saved plans to compare key environmental indicators side-by-side with differential ($\Delta$) variance and color-coded winner highlights.
- **💾 Save Named Snapshot**: Enter custom snapshot names or version tags (e.g., *"Scenario 2 - 40% Solar & Miyawaki"*) at any point during active design.
- **Scenario Cloning & Deletion**: Duplicate any plan with one click to explore design variations.

---

### 5. 🌐 3D Environmental Digital Twin & 2D Cadastre Blueprint
Photorealistic 1:1 metric spatial digital twin physically dimensioned to your site cadastre:
- **1:1 Metric Geometric Scaling**: Total plot area, building footprint, and remaining area (permeable paving, living greenery, bioswales) are mathematically matched down to the exact square meter in both 2D and 3D views.
- **Photorealistic Architectural 3D Rendering**: Authentic architectural precast limestone, double-glazed curtain walls, floor slabs, tilted solar PV arrays, permeable interlocking pavers, bioswales, and multi-tier 3D trees with dynamic shadows.
- **Dynamic Sun Trajectory Dial**: Interactive sun dial (08:00 to 18:00) with real-time shadow casting and atmospheric daylight rendering.
- **Rain Simulator**: Atmospheric rainfall particles with stormwater surge routing.
- **2D Cadastre Blueprint**: Side-by-side and curtain-split Before vs After schematics with dimension callouts.

---

### 6. 🔬 Technical Analysis Studio
Comprehensive engineering drill-downs into each domain:
- **Stormwater & Hydrology**: Rational Method equations, runoff coefficients, hydrograph simulations.
- **Rainwater Harvesting**: Mass-balance dry-spell storage curves and sizing recommendations.
- **Carbon Balance**: Embodied carbon intensity vs. annual grid displacement.
- **Urban Heat Island**: Albedo surface-temperature equations.
- **Explainability Inspector**: Click any *"ℹ️ Explain"* button across the app to inspect the mathematical formula, variable origins, data confidence rating, and scientific assumptions.

---

### 7. 🎓 Academic Methodology
Detailed documentation of all scientific formulas, constants, and institutional references (US EPA, CPHEEO, NBC 2016, TIFAC, CPCB, IPCC).

---

### 8. 📄 Official EIA Report
A formal, academic-grade Environmental Impact Assessment document complete with:
- Executive Summary & Project Identifiers
- Site Geometry & Land-Cover Tables
- Quantitative Impact Assessment Matrix (Baseline vs. Mitigated)
- Actionable Green Infrastructure Mitigation Plan
- Two-Phase Nature Recovery & Circular Waste Protocol
- Official Student & Faculty Evaluator Sign-Off Blocks
- Print / Save as PDF button (clean print layout).

---

## 💻 Download & Run on Any PC (Offline Package)

Anyone can download and run EcoBuild Smart on any computer or phone in any browser:

1. **Direct Download**:
   - Click **"⬇️ Download App"** in the top navigation bar or sidebar.
   - Choose **"Download App (.ZIP)"** to save `EcoBuildSmart_App.zip` (~630 KB).
2. **How to Run on Any Windows PC**:
   - Extract `EcoBuildSmart_App.zip`.
   - Double-click `LaunchApp.bat` to launch the local server and automatically open the application in your default browser.
3. **How to Run on Any Mac, Linux, or PC without Python**:
   - Extract `EcoBuildSmart_App.zip`.
   - Double-click `index.html` to run immediately in Chrome, Edge, Firefox, Safari, Brave, or Opera (100% functional with offline calculations and local storage).
4. **Mobile Phone Access**:
   - Connect your phone to the same Wi-Fi network.
   - Scan the QR code shown in the Download Modal or enter the local network URL (e.g., `http://<LAN_IP>:8000`) in Chrome (Android) or Safari (iOS).

