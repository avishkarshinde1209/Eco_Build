# EcoBuild Smart — User Guide & Application Walkthrough

Welcome to **EcoBuild Smart**, the Dynamic Environmental Impact Assessment & Green Infrastructure Planner.

- 🌐 **Instant Online Access (No Installation Required):** [https://eco-build-avishkar6.vercel.app](https://eco-build-avishkar6.vercel.app)
- 📁 **GitHub Repository:** [https://github.com/avishkarshinde1209/Eco_Build](https://github.com/avishkarshinde1209/Eco_Build)

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
- **Quick Action Bar**: One-click shortcuts to Nature Recovery, Save Snapshot, Scenario Studio, Technical Studio, Plan History, and Official EIA Report.
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

### 5. ⚖️ Scenario & What-If Studio
Interactive sensitivity sliders allowing immediate real-time exploration:
- Adjust Permeable Paving percentage ($0 - 100\%$)
- Adjust Rooftop Green Roof allocation ($0 - 70\%$)
- Adjust Rooftop Solar PV allocation ($0 - 70\%$)
- Adjust Compensatory Tree planting numbers
- Observe real-time changes in Composite Score, Peak Runoff, Carbon Payback, and UHI Cooling.

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

