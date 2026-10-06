/**
 * EcoBuild Smart - Academic Methodology & Engineering Architecture View
 * Comprehensive documentation of scientific formulation, systems engineering,
 * data pipelines, algorithms, limitations, and bibliographic references.
 */

window.MethodologyView = {
  render() {
    const container = document.getElementById("methodology-view");
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-8 max-w-5xl mx-auto pb-16 font-sans text-stone-800">
        <!-- Title Banner -->
        <div class="bg-[#14281D] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800">
          <div class="space-y-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Scientific Documentation & Engineering Standards</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight font-serif text-white mt-1">
              Academic Methodology & System Architecture
            </h1>
            <p class="text-stone-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Theoretical foundation, mathematical models, algorithm definitions, and empirical data pipelines governing EcoBuild Smart.
            </p>
          </div>
        </div>

        <!-- 1. Problem Statement & Objectives -->
        <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>🎯</span> 1. Problem Statement & Objectives
          </h2>
          <div class="text-xs text-slate-600 space-y-3 leading-relaxed">
            <p>
              <strong>Problem Statement:</strong> Rapid urban expansion often involves unmitigated soil sealing, extensive tree felling, and the replacement of permeable vegetative ground with impervious concrete and asphalt hardscape. Conventional architectural tools focus on building energy simulation but fail to dynamically couple real-world localized meteorological datasets (rainfall intensity, ambient AQI, solar radiation) with site-level landscape hydrology and ecological deficit recovery.
            </p>
            <p>
              <strong>Primary Engineering Objectives:</strong>
            </p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Formulate a responsive mathematical calculation engine that computes stormwater runoff ($Q=CIA$), rainwater harvesting potential, embodied carbon deficit, and tree loss replacement ratios without hardcoded lookup tables.</li>
              <li>Integrate live open scientific APIs (Open-Meteo, Copernicus CAMS, OpenStreetMap Nominatim) with zero client-side secret exposure and resilient offline fallback caching.</li>
              <li>Develop an interactive tri-state scenario simulator (Pre-Development vs Proposed vs Green Interventions) and live What-If sensitivity sliders for decision support.</li>
              <li>Provide total scientific explainability ("What caused this result?") showing exact equations, variables, and data confidence ratings for every metric.</li>
            </ul>
          </div>
        </div>

        <!-- 2. System Architecture Pipeline (Requirement 43) -->
        <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>🏗️</span> 2. System Architecture & Data Flow
          </h2>
          <p class="text-xs text-slate-500">
            End-to-end data pipeline executing the 12-tier architecture specified in project guidelines:
          </p>

          <div class="p-6 bg-slate-900 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner">
            <pre class="leading-relaxed">
USER / ACADEMIC EVALUATOR
        │
        ▼
WEB APPLICATION INTERFACE (Modern Responsive Single-Page Application)
        │
        ▼
PROJECT & SITE INPUT MODULE (8 Guided Steps: Basic & Advanced Modes)
        │
        ▼
LOCATION MODULE (Interactive Leaflet Map, Reverse Geocoding & Lat/Lon)
        │
        ▼
ENVIRONMENTAL DATA SERVICE (Open-Meteo Weather, Copernicus CAMS AQI, Solar API)
        │
        ▼
DATA VALIDATION ENGINE (Geometric Sanity, Non-Negative Checks, Area Balance)
        │
        ▼
ENVIRONMENTAL CALCULATION ENGINE (Runoff, RWH, Carbon, Canopy, Solar, UHI)
        │
        ▼
DYNAMIC IMPACT ASSESSMENT (Quantified Deficit & Ecological Indicators)
        │
        ▼
RULE-BASED RECOMMENDATION ENGINE (Site-Specific Green Infrastructure Sizing)
        │
        ▼
WHAT-IF SIMULATION ENGINE (Real-Time Reactive Sliders & Tri-State Modeling)
        │
        ▼
ANALYTICS DASHBOARD (Cards, Donut/Bar/Radar Charts, Explainability Drawers)
        │
        ▼
ACADEMIC PDF ASSESSMENT REPORT (Publication-Grade Export & Sign-Off)
            </pre>
          </div>
        </div>

        <!-- 3. Mathematical Formulations & Algorithms -->
        <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>📐</span> 3. Mathematical Formulations
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <!-- Stormwater Rational Method -->
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span class="font-bold text-slate-800">A. Stormwater Peak Runoff (Rational Method)</span>
              <div class="font-mono text-emerald-800 font-bold bg-white p-2 rounded border">Q = C × I × A</div>
              <p class="text-slate-600">
                Where $Q$ = peak runoff ($m^3/\text{hr}$), $C$ = area-weighted composite runoff coefficient ($\sum C_i A_i / \sum A_i$), $I$ = design rainfall intensity ($\text{mm/hr}$), and $A$ = catchment area ($m^2$).
              </p>
            </div>

            <!-- RWH Potential -->
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span class="font-bold text-slate-800">B. Rainwater Harvesting Yield</span>
              <div class="font-mono text-blue-800 font-bold bg-white p-2 rounded border">V = P × A_roof × C_roof × η_filter</div>
              <p class="text-slate-600">
                Where $V$ = harvest volume (Litres), $P$ = annual precipitation (mm), $A_{\text{roof}}$ = catchment roof ($m^2$), $C_{\text{roof}} = 0.85$, and $\eta_{\text{filter}} = 0.85$ (15% first-flush diversion).
              </p>
            </div>

            <!-- Compensatory Tree Model -->
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span class="font-bold text-slate-800">C. Compensatory Tree Planting Ratio</span>
              <div class="font-mono text-rose-800 font-bold bg-white p-2 rounded border">R_trees = N_felled × Ratio_statutory (3:1 to 5:1)</div>
              <p class="text-slate-600">
                Prescribed under the Maharashtra Urban Areas Tree Preservation Act. Replaces felled canopy area ($\approx 35 m^2/\text{tree}$) over a 10-year growth timeline.
              </p>
            </div>

            <!-- Rooftop Solar PV Potential -->
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span class="font-bold text-slate-800">D. Rooftop Solar Photovoltaic Yield</span>
              <div class="font-mono text-amber-800 font-bold bg-white p-2 rounded border">E_annual = Capacity (kWp) × PSH × 365 × PR</div>
              <p class="text-slate-600">
                Where $\text{Capacity} = A_{\text{solar}} \times 0.18 \text{ kWp/m}^2$, $\text{PSH}$ = Peak Sun Hours from NASA satellite data, and $\text{PR} = 0.75$ (inverter and thermal derating).
              </p>
            </div>
          </div>
        </div>

        <!-- 4. Limitations & Scientific Assumptions -->
        <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>🔬</span> 4. Scientific Assumptions & Limitations
          </h2>
          <div class="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              • <strong>Rational Method Applicability:</strong> Standard engineering assumes the Rational Method is valid for urban catchments under 80 hectares ($\approx 800,000 m^2$) where time of concentration is short.
            </p>
            <p>
              • <strong>Biological Sequestration Variability:</strong> The annual carbon sequestration rate of 21.8 kg CO₂e/tree reflects an average mature tropical broadleaf specimen. Species-specific wood density, soil depth, and mycorrhizal activity introduce natural biological variance.
            </p>
            <p>
              • <strong>Academic Disclaimer:</strong> This decision-support system provides conceptual engineering indicators. Structural roof load assessments and sanctioned municipal development plans must be conducted by licensed civil engineers prior to construction.
            </p>
          </div>
        </div>

        <!-- 5. Bibliographic References -->
        <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>📚</span> 5. Authoritative References & Standards
          </h2>
          <ul class="text-xs text-slate-600 space-y-2 list-decimal pl-5">
            <li><strong>Bureau of Indian Standards (BIS):</strong> National Building Code (NBC) of India 2016, Volume 2, Part 9 (Plumbing Services) and Part 11 (Approach to Sustainability).</li>
            <li><strong>CPHEEO:</strong> Manual on Water Supply and Treatment, Ministry of Housing and Urban Affairs, Government of India.</li>
            <li><strong>US EPA:</strong> Stormwater Management and Green Infrastructure Compendium (EPA 833-R-00-002), Rational Method coefficients.</li>
            <li><strong>Central Ground Water Board (CGWB):</strong> Manual on Artificial Recharge of Ground Water, Ministry of Jal Shakti, India.</li>
            <li><strong>Central Electricity Authority (CEA):</strong> CO₂ Baseline Database for the Indian Power Sector, Version 19.0 (0.82 kg CO₂e/kWh grid emission factor).</li>
            <li><strong>IPCC:</strong> 2019 Refinement to the 2006 IPCC Guidelines for National Greenhouse Gas Inventories (Volume 4: Agriculture, Forestry and Other Land Use).</li>
            <li><strong>Open-Meteo Weather API:</strong> Copernicus ERA5-Land Reanalysis and CAMS Atmospheric Monitoring Service (Open Academic License).</li>
          </ul>
        </div>
      </div>
    `;
  }
};
