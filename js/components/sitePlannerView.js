/**
 * EcoBuild Smart - Interactive 2D/3D Site Planner & Before/After Engine
 * 
 * Provides:
 * - 2D Cadastre Mode with Before / After Split Slider (BEFORE: concrete hardscape, heat hotspots | AFTER: green infrastructure, solar, bioswales)
 * - 3D Architectural Digital Twin Mode with OrbitControls, PBR shaders, 360° turntable, and 3D hotspots
 * - Map Legend with Layer Toggles:
 *   Dark Green: Existing Trees
 *   Light Green: Proposed Vegetation
 *   Blue: Water / Rainwater Tank
 *   Cyan: Bioswale / Rain Garden
 *   Brown: Permeable Pavement
 *   Yellow: Solar Panels
 *   Grey: Building Footprint
 *   Red: Environmental Hotspots
 *   Purple: Biodiversity Zone
 */

window.SitePlannerView = {
  viewMode: '2d', // '2d' | '3d'
  splitPos: 50,

  layers: {
    existing_trees: true,
    proposed_trees: true,
    building: true,
    water_rwh: true,
    bioswales: true,
    permeable_paving: true,
    solar_pv: true,
    hotspots: true,
    biodiversity: true
  },

  set3DMode() {
    this.viewMode = '3d';
    this.render(window.App.currentProject, window.App.calculations, window.App.environmentalData);
  },

  set2DMode() {
    this.viewMode = '2d';
    this.render(window.App.currentProject, window.App.calculations, window.App.environmentalData);
  },

  render(project, calculations, environmentalData) {
    const container = document.getElementById("siteplanner-view");
    if (!container) return;

    const site = project.site || {};
    const plotArea = site.plot_area || 5000;
    const builtUp = site.built_up_area || Math.round(plotArea * 0.44);
    const roofArea = site.roof_area || builtUp;
    const openArea = Math.max(0, plotArea - builtUp);
    const hardscape = (project.surfaces?.concrete_area || 0) + (project.surfaces?.asphalt_area || 0) + (project.surfaces?.tiles_pavers || 0) || Math.round(openArea * 0.45);
    const treesRemoved = project.vegetation?.trees_removed !== undefined ? project.vegetation.trees_removed : 0;
    const occupants = project.occupancy?.total_occupants || 250;

    const iv = project.interventions || {};
    const treesPlanted = iv.trees_planted !== undefined ? iv.trees_planted : Math.min(Math.max(15, treesRemoved * 3), Math.floor((openArea * 0.6) / 16));
    const greenRoofM2 = iv.green_roof_m2 !== undefined ? iv.green_roof_m2 : Math.round(roofArea * 0.27);
    const permM2 = iv.permeable_pavement_m2 !== undefined ? iv.permeable_pavement_m2 : Math.round(Math.min(hardscape * 0.45, hardscape));
    const tankL = iv.rwh_tank_capacity_l !== undefined ? iv.rwh_tank_capacity_l : Math.round(Math.min(roofArea * 40, Math.max(15000, occupants * 45 * 18)));
    const solarM2 = iv.solar_pv_area_m2 !== undefined ? iv.solar_pv_area_m2 : Math.round(Math.min(roofArea * 0.35, Math.max(0, roofArea - greenRoofM2)));
    const solarKwp = Math.round(solarM2 / 5.5);
    const rainGardenM2 = iv.rain_garden_m2 !== undefined ? iv.rain_garden_m2 : Math.round(Math.min(openArea * 0.12, 350));

    // Dynamic Before/After Metrics for site summary strip
    const preImp = calculations?.surface_analysis?.impervious_percentage || Math.min(95, Math.round(((hardscape + builtUp) / Math.max(1, plotArea)) * 100));
    const postImp = Math.max(10, Math.round((((hardscape - permM2) + (builtUp - greenRoofM2)) / Math.max(1, plotArea)) * 100));
    const impDiff = preImp - postImp;

    const qPre = calculations?.runoff?.pre_development?.peak_runoff_m3_hr || Math.round(((0.75 * 65 * plotArea) / 1000) * 10) / 10;
    const qPost = calculations?.runoff?.with_interventions?.peak_runoff_m3_hr || Math.round((qPre * 0.32) * 10) / 10;
    const qDiffPct = Math.round(((qPre - qPost) / Math.max(0.1, qPre)) * 100);

    const treesExisting = project.vegetation?.mature_trees_count || 30;
    const treesNet = treesExisting - treesRemoved + treesPlanted;
    const canopyRestored = Math.round(treesPlanted * 16);

    const preScore = calculations?.overall_score?.current_score || 35;
    const postScore = calculations?.overall_score?.post_intervention_score || 85;
    const scoreDiff = postScore - preScore;

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-stone-800 animate-fade-in">
        
        <!-- HEADER -->
        <div class="bg-[#0D1912] text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SPATIAL RECOVERY PLANNER</span>
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-800 text-stone-300 border border-stone-700">
                ${this.viewMode === '2d' ? '2D Cadastre & Split Slider' : '3D Architectural Digital Twin'}
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              ${this.viewMode === '2d' ? 'Spatial Recovery Plan & Before/After Simulator' : '3D Environmental Digital Twin & Microclimate Model'}
            </h1>
            <p class="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed">
              ${this.viewMode === '2d' 
                ? 'Examine the physical site layout, toggle thematic cadastre layers, and slide the Before/After curtain to observe the transformation from raw concrete hardscape into a regenerative sponge campus.'
                : 'Interactive 3D model powered by Three.js. Orbit 360°, inspect rooftop solar PV arrays, sedum green roof mats, bioswale basins, and underground RWH storage tanks.'}
            </p>
          </div>

          <!-- Mode & Split Toggles -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 self-start lg:self-center">
            
            <!-- View Mode Switcher -->
            <div class="flex items-center bg-stone-900 p-1 rounded-xl border border-stone-700 text-xs font-bold">
              <button onclick="window.SitePlannerView.set2DMode()" class="px-3 py-1.5 rounded-lg transition ${this.viewMode === '2d' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'}">
                🗺️ 2D Cadastre
              </button>
              <button onclick="window.SitePlannerView.set3DMode()" class="px-3 py-1.5 rounded-lg transition ${this.viewMode === '3d' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'}">
                📦 3D Model
              </button>
            </div>

            ${this.viewMode === '2d' ? `
              <!-- Quick Split Actions -->
              <div class="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-700 text-xs font-bold">
                <button onclick="window.SitePlannerView.setSplit(0)" class="px-2.5 py-1.5 rounded-lg transition ${this.splitPos === 0 ? 'bg-rose-900 text-white' : 'text-stone-400 hover:text-white'}">
                  Before
                </button>
                <button onclick="window.SitePlannerView.setSplit(50)" class="px-2.5 py-1.5 rounded-lg transition ${this.splitPos === 50 ? 'bg-emerald-700 text-white' : 'text-stone-400 hover:text-white'}">
                  Split 50/50
                </button>
                <button onclick="window.SitePlannerView.setSplit(100)" class="px-2.5 py-1.5 rounded-lg transition ${this.splitPos === 100 ? 'bg-emerald-800 text-white' : 'text-stone-400 hover:text-white'}">
                  After
                </button>
              </div>
            ` : ''}

          </div>
        </div>

        ${this.viewMode === '3d' ? `
          <!-- 3D DIGITAL TWIN VIEWPORT -->
          <div class="bg-[#0B1510] rounded-3xl border border-stone-800 overflow-hidden shadow-2xl relative">
            <div class="p-4 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2 text-stone-300">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="font-bold text-white">Three.js WebGL Viewport</span>
                <span class="text-stone-500">•</span>
                <span class="text-stone-400">Left-click drag to orbit • Right-click drag to pan • Scroll to zoom</span>
              </div>
              <div class="flex items-center gap-2">
                <button onclick="window.Hero3D && window.Hero3D.setCameraPreset('perspective')" class="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg font-semibold transition">
                  Perspective
                </button>
                <button onclick="window.Hero3D && window.Hero3D.setCameraPreset('solar')" class="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg font-semibold transition">
                  Rooftop Solar
                </button>
                <button onclick="window.Hero3D && window.Hero3D.setCameraPreset('bioswale')" class="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-teal-300 rounded-lg font-semibold transition">
                  Bioswale
                </button>
              </div>
            </div>

            <!-- Canvas Container -->
            <div id="site-planner-3d-container" class="w-full h-[600px] relative">
              <!-- Three.js mounts here -->
            </div>

            <!-- 3D Feature Indicator Bar -->
            <div class="p-4 bg-stone-900/90 border-t border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded bg-amber-400"></span>
                <span class="text-stone-300">${solarKwp} kWp Rooftop Solar PV</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded bg-emerald-600"></span>
                <span class="text-stone-300">${greenRoofM2.toLocaleString()} m² Sedum Green Roof</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded bg-blue-600"></span>
                <span class="text-stone-300">${Math.round(tankL / 1000)} kL Rainwater Cistern</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded bg-teal-500"></span>
                <span class="text-stone-300">${rainGardenM2.toLocaleString()} m² Bioswale Basin</span>
              </div>
            </div>
          </div>
        ` : `
          <!-- 2D CADASTRAL BEFORE/AFTER VIEWPORT -->
          <!-- LAYER TOGGLE CONTROLLER BAR (MAP LEGEND) -->
          <div class="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-stone-100 pb-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-stone-400">Thematic CAD Layers</span>
              <span class="text-xs text-stone-500">Toggle layers to filter spatial interventions</span>
            </div>

            <div class="flex flex-wrap items-center gap-2.5 text-xs">
              <button onclick="window.SitePlannerView.toggleLayer('existing_trees')" class="px-3 py-1.5 rounded-xl border flex items-center gap-2 font-bold transition ${this.layers.existing_trees ? 'bg-emerald-950 text-emerald-200 border-emerald-800 shadow-sm' : 'bg-stone-100 text-stone-400 border-stone-200 line-through'}">
                <span class="w-3 h-3 rounded-full bg-[#1b4332]"></span>
                <span>Existing Trees (${project.vegetation?.existing_tree_count || 80})</span>
              </button>

              <button onclick="window.SitePlannerView.toggleLayer('proposed_trees')" class="px-3 py-1.5 rounded-xl border flex items-center gap-2 font-bold transition ${this.layers.proposed_trees ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm' : 'bg-stone-100 text-stone-400 border-stone-200 line-through'}">
                <span class="w-3 h-3 rounded-full bg-[#52b788]"></span>
                <span>Proposed Trees (${treesPlanted})</span>
              </button>

              <button onclick="window.SitePlannerView.toggleLayer('building')" class="px-3 py-1.5 rounded-xl border flex items-center gap-2 font-bold transition ${this.layers.building ? 'bg-stone-800 text-white border-stone-700 shadow-sm' : 'bg-stone-100 text-stone-400 border-stone-200 line-through'}">
                <span class="w-3 h-3 rounded-full bg-[#475569]"></span>
                <span>Building Footprint (${builtUp.toLocaleString()} m²)</span>
              </button>

              <button onclick="window.SitePlannerView.toggleLayer('permeable_paving')" class="px-3 py-1.5 rounded-xl border flex items-center gap-2 font-bold transition ${this.layers.permeable_paving ? 'bg-amber-950/80 text-amber-200 border-amber-800 shadow-sm' : 'bg-stone-100 text-stone-400 border-stone-200 line-through'}">
                <span class="w-3 h-3 rounded-full bg-[#854d0e]"></span>
                <span>Permeable Paving (${permM2.toLocaleString()} m²)</span>
              </button>

              <button onclick="window.SitePlannerView.toggleLayer('water_rwh')" class="px-3 py-1.5 rounded-xl border flex items-center gap-2 font-bold transition ${this.layers.water_rwh ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-sm' : 'bg-stone-100 text-stone-400 border-stone-200 line-through'}">
                <span class="w-3 h-3 rounded-full bg-[#2563eb]"></span>
                <span>RWH Tank (${Math.round(tankL / 1000)} kL)</span>
              </button>

              <button onclick="window.SitePlannerView.toggleLayer('bioswales')" class="px-3 py-1.5 rounded-xl border flex items-center gap-2 font-bold transition ${this.layers.bioswales ? 'bg-cyan-50 text-cyan-800 border-cyan-300 shadow-sm' : 'bg-stone-100 text-stone-400 border-stone-200 line-through'}">
                <span class="w-3 h-3 rounded-full bg-[#06b6d4]"></span>
                <span>Bioswales (${rainGardenM2.toLocaleString()} m²)</span>
              </button>

              <button onclick="window.SitePlannerView.toggleLayer('solar_pv')" class="px-3 py-1.5 rounded-xl border flex items-center gap-2 font-bold transition ${this.layers.solar_pv ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm' : 'bg-stone-100 text-stone-400 border-stone-200 line-through'}">
                <span class="w-3 h-3 rounded-full bg-[#eab308]"></span>
                <span>Solar PV (${solarM2.toLocaleString()} m²)</span>
              </button>

              <button onclick="window.SitePlannerView.toggleLayer('hotspots')" class="px-3 py-1.5 rounded-xl border flex items-center gap-2 font-bold transition ${this.layers.hotspots ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-sm' : 'bg-stone-100 text-stone-400 border-stone-200 line-through'}">
                <span class="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                <span>Environmental Hotspots</span>
              </button>

              <button onclick="window.SitePlannerView.toggleLayer('biodiversity')" class="px-3 py-1.5 rounded-xl border flex items-center gap-2 font-bold transition ${this.layers.biodiversity ? 'bg-purple-50 text-purple-800 border-purple-300 shadow-sm' : 'bg-stone-100 text-stone-400 border-stone-200 line-through'}">
                <span class="w-3 h-3 rounded-full bg-[#9333ea]"></span>
                <span>Miyawaki Forest</span>
              </button>
            </div>
          </div>

          <!-- BEFORE/AFTER INTERACTIVE SPLIT CANVAS -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-4">
            
            <div class="flex items-center justify-between border-b border-stone-100 pb-3">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                  ◀ BEFORE: Baseline Hardscape Deficit
                </span>
                <span class="text-xs text-stone-400 font-bold">vs</span>
                <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  AFTER: Sized Ecological Recovery ▶
                </span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <span class="text-stone-400 font-bold">Curtain Split:</span>
                <input type="range" min="0" max="100" value="${this.splitPos}" oninput="window.SitePlannerView.onSliderMove(this.value)" class="w-32 accent-emerald-600 cursor-pointer">
                <span class="font-mono font-bold text-stone-700">${this.splitPos}%</span>
              </div>
            </div>

            <!-- SVG MASTERPLAN CANVAS CONTAINER -->
            <div id="site-planner-canvas-container" class="relative w-full aspect-[16/10] bg-stone-100 rounded-2xl overflow-hidden border border-stone-300 select-none shadow-inner">
              
              <!-- SVG: BEFORE CANVAS -->
              <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
                <!-- Base Ground -->
                <rect x="0" y="0" width="1000" height="600" fill="#e2e8f0"/>
                
                <!-- Impermeable Concrete Paving -->
                <rect x="100" y="320" width="800" height="240" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
                <text x="500" y="440" fill="#475569" font-size="14" font-weight="black" text-anchor="middle">Dense Impervious RCC Slab (2,600 m² - C = 0.90)</text>

                <!-- Building Footprint -->
                <rect x="250" y="80" width="500" height="200" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
                <text x="500" y="180" fill="#94a3b8" font-size="16" font-weight="black" text-anchor="middle">Institutional Building Footprint (2,200 m²)</text>
                <text x="500" y="205" fill="#f87171" font-size="11" font-weight="bold" text-anchor="middle">High Solar Heat Gain (48°C RCC Roof)</text>

                ${this.layers.hotspots ? `
                  <ellipse cx="500" cy="440" rx="380" ry="100" fill="#ef4444" fill-opacity="0.25"/>
                  <text x="500" y="480" fill="#b91c1c" font-size="13" font-weight="black" text-anchor="middle">⚠️ Severe Runoff Flash Zone (+178% surge)</text>
                ` : ''}

                ${this.layers.existing_trees ? `
                  <g fill="#166534" stroke="#14532d" stroke-width="1.5">
                    <circle cx="150" cy="150" r="18"/><circle cx="180" cy="220" r="16"/>
                    <circle cx="820" cy="150" r="16"/><circle cx="850" cy="220" r="16"/>
                  </g>
                  <g stroke="#ef4444" stroke-width="3">
                    <line x1="140" y1="140" x2="160" y2="160"/>
                    <line x1="160" y1="140" x2="140" y2="160"/>
                  </g>
                  <text x="165" y="250" fill="#b91c1c" font-size="10" font-weight="bold" text-anchor="middle">${treesRemoved} Trees Felled</text>
                ` : ''}
              </svg>

              <!-- SVG: AFTER CANVAS (Clipped by Split Slider) -->
              <div class="absolute inset-0 overflow-hidden" style="width: ${this.splitPos}%;">
                <svg class="w-full h-full" style="width: 1000px; height: 600px;" viewBox="0 0 1000 600" preserveAspectRatio="none">
                  <rect x="0" y="0" width="1000" height="600" fill="#dcfce7"/>

                  ${this.layers.permeable_paving ? `
                    <rect x="100" y="320" width="800" height="240" fill="#78350f" fill-opacity="0.15" stroke="#854d0e" stroke-width="2" stroke-dasharray="6,4"/>
                    <rect x="180" y="350" width="640" height="180" fill="#a8a29e" fill-opacity="0.3" stroke="#854d0e" stroke-width="1.5"/>
                    <text x="500" y="440" fill="#78350f" font-size="14" font-weight="black" text-anchor="middle">IRC:SP:63 Permeable Interlocking Pavers (${permM2.toLocaleString()} m² - C = 0.20)</text>
                  ` : ''}

                  ${this.layers.building ? `
                    <rect x="250" y="80" width="500" height="200" fill="#334155" stroke="#0f172a" stroke-width="3"/>
                    <rect x="260" y="90" width="220" height="180" fill="#15803d" stroke="#166534" stroke-width="2"/>
                    <text x="370" y="185" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">${greenRoofM2.toLocaleString()} m² Green Roof</text>

                    ${this.layers.solar_pv ? `
                      <rect x="500" y="90" width="240" height="180" fill="#1e293b" stroke="#eab308" stroke-width="2.5"/>
                      <text x="620" y="185" fill="#facc15" font-size="13" font-weight="black" text-anchor="middle">${solarKwp} kWp Solar PV</text>
                    ` : ''}
                  ` : ''}

                  ${this.layers.bioswales ? `
                    <path d="M 100 570 Q 500 550 900 570" stroke="#06b6d4" stroke-width="26" fill="none" stroke-linecap="round"/>
                    <text x="500" y="575" fill="#0e7490" font-size="12" font-weight="black" text-anchor="middle">${rainGardenM2.toLocaleString()} m² Bioretention Bioswale (C = 0.15)</text>
                  ` : ''}

                  ${this.layers.water_rwh ? `
                    <rect x="80" y="80" width="120" height="100" rx="16" fill="#1d4ed8" fill-opacity="0.85" stroke="#1e40af" stroke-width="2"/>
                    <text x="140" y="130" fill="#ffffff" font-size="12" font-weight="black" text-anchor="middle">${(tankL / 1000).toFixed(0)} kL Cistern</text>
                  ` : ''}

                  ${this.layers.biodiversity ? `
                    <rect x="840" y="80" width="130" height="200" rx="16" fill="#7e22ce" fill-opacity="0.2" stroke="#9333ea" stroke-width="2" stroke-dasharray="4,4"/>
                    <text x="905" y="180" fill="#6b21a8" font-size="11" font-weight="bold" text-anchor="middle">Miyawaki</text>
                  ` : ''}

                  ${this.layers.proposed_trees ? `
                    <g fill="#2d6a4f" stroke="#1b4332" stroke-width="1.5">
                      <circle cx="860" cy="110" r="14"/><circle cx="910" cy="110" r="14"/><circle cx="950" cy="110" r="14"/>
                      <circle cx="860" cy="150" r="14"/><circle cx="910" cy="150" r="14"/><circle cx="950" cy="150" r="14"/>
                    </g>
                    <text x="905" y="60" fill="#1b4332" font-size="12" font-weight="black" text-anchor="middle">${treesPlanted} Compensatory Trees</text>
                  ` : ''}
                </svg>
              </div>

              <!-- Dividing Guideline -->
              <div class="absolute top-0 bottom-0 pointer-events-none" style="left: ${this.splitPos}%;">
                <div class="w-1 h-full bg-white shadow-2xl relative">
                  <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-stone-900 border-2 border-white text-white flex items-center justify-center text-xs font-bold shadow-lg">
                    ⇄
                  </div>
                </div>
              </div>

            </div>

            <!-- Bottom Legend & Summary Metrics -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div class="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span class="text-stone-400 block text-[10px] font-bold uppercase">Impervious Surface</span>
                <strong class="text-stone-900 text-sm">${preImp}% &rarr; ${postImp}%</strong>
                <span class="text-[10px] text-emerald-700 block font-bold">−${impDiff}% Soil Sealing Cut</span>
              </div>
              <div class="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span class="text-stone-400 block text-[10px] font-bold uppercase">Peak Runoff (Q)</span>
                <strong class="text-stone-900 text-sm">${qPre} &rarr; ${qPost} m³/hr</strong>
                <span class="text-[10px] text-emerald-700 block font-bold">−${qDiffPct}% Surge Relief</span>
              </div>
              <div class="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span class="text-stone-400 block text-[10px] font-bold uppercase">Tree Canopy</span>
                <strong class="text-stone-900 text-sm">${treesExisting} &rarr; ${treesNet} Trees</strong>
                <span class="text-[10px] text-emerald-700 block font-bold">+${canopyRestored.toLocaleString()} m² Canopy Restored</span>
              </div>
              <div class="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span class="text-stone-400 block text-[10px] font-bold uppercase">Recovery Score</span>
                <strong class="text-stone-900 text-sm">${preScore} &rarr; ${postScore} / 100</strong>
                <span class="text-[10px] text-emerald-700 block font-bold">+${scoreDiff} Points Improvement</span>
              </div>
            </div>

          </div>
        `}

      </div>
    `;

    // If 3D mode is active, initialize Hero3D into site-planner-3d-container
    if (this.viewMode === '3d' && window.Hero3D) {
      setTimeout(() => {
        window.Hero3D.init("site-planner-3d-container");
      }, 50);
    }
  },

  onSliderMove(val) {
    this.splitPos = parseInt(val) || 50;
    this.render(window.App.currentProject, window.App.calculations, window.App.environmentalData);
  },

  setSplit(pos) {
    this.splitPos = pos;
    this.render(window.App.currentProject, window.App.calculations, window.App.environmentalData);
  },

  toggleLayer(layerKey) {
    this.layers[layerKey] = !this.layers[layerKey];
    this.render(window.App.currentProject, window.App.calculations, window.App.environmentalData);
  }
};
