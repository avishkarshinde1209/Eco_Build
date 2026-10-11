/**
 * EcoBuild Smart - Hyper-Realistic 3D Environmental Digital Twin & 2D Cadastre Masterplan
 * 
 * Features:
 * - 1:1 Metric Geometric Scaling: Plot area, building footprint, and remaining open space
 *   (permeable paving, landscaped buffers, bioswales, Miyawaki groves) are mathematically
 *   matched down to the exact square meter in both 2D and 3D views (Plot Area = Footprint + Remaining Area).
 * - Photorealistic Three.js PBR Rendering: Real procedural architectural materials
 *   (limestone facade panels with expansion joints, double-glazed curtain walls with dark anodized mullions,
 *   monocrystalline solar PV cells with busbars, sedum succulent vegetative roof, permeable interlocking pavers
 *   with EV parking bays, river cobble bioswales with water reflections, realistic 3D native trees, and parked cars for scale).
 * - Authentic Architectural Entourage: Modern electric vehicles, landscape light bollards, teak benches,
 *   downspouts, and underground RWH cistern with water level indicator.
 * - Dynamic Sun Trajectory Simulator: Interactive sun dial (08:00 to 18:00) with real-time shadow casting,
 *   golden hour color temperature shifts, and evening architectural interior room illumination.
 * - Dynamic Atmospheric Rain Simulator: Falling raindrops with stormwater surge routing.
 * - 5 Instant Camera Angle Presets: Isometric Hero, Entry Eye-Level, Rooftop Solar & Bio-Roof, SuDS Drainage, and Top-Down Plan.
 * - High-Precision 2D Cadastre Blueprints: Dimensionally to-scale Before vs After schematics with CAD callouts and area balance bar.
 * 
 * Author: Avishkar Shinde
 */

window.SitePlannerView = {
  viewMode: '3d', // '3d' | '2d'
  scenario: 'proposed', // 'proposed' | 'baseline'
  selectedElement: 'solar',
  splitPos: 50,
  active2DTab: 'side_by_side', // 'side_by_side' | 'before' | 'after' | 'split'
  
  // Active 3D layer visibility
  layers: {
    solar_pv: true,
    green_roof: true,
    permeable_paving: true,
    bioswales: true,
    water_rwh: true,
    biodiversity: true,
    building: true,
    cars: true
  },

  // 3D Scene Runtime Handles
  _three: {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    animId: null,
    container: null,
    autoRotate: false,
    sunTime: 12,
    sunLight: null,
    ambientLight: null,
    fillLight: null,
    skyMesh: null,
    interiorLights: [],
    rainActive: false,
    rainGeo: null,
    rainMesh: null,
    textures: {}
  },

  set3DMode() {
    this.viewMode = '3d';
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  },

  set2DMode() {
    this.viewMode = '2d';
    this.destroy3D();
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  },

  set2DTab(tabKey) {
    this.active2DTab = tabKey;
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  },

  setScenario(scenarioKey) {
    this.scenario = scenarioKey;
    if (scenarioKey === 'baseline') {
      this.selectedElement = 'baseline';
    } else if (this.selectedElement === 'baseline') {
      this.selectedElement = 'solar';
    }
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  },

  selectElement(elKey) {
    this.selectedElement = elKey;
    this.updateInspectionPanel();

    if (this.viewMode === '3d') {
      if (elKey === 'solar' || elKey === 'green_roof') this.setCameraPreset('rooftop');
      else if (elKey === 'bioswale') this.setCameraPreset('bioswale');
      else if (elKey === 'permeable') this.setCameraPreset('entry');
      else if (elKey === 'biodiversity') this.setCameraPreset('canopy');
      else if (elKey === 'rwh') this.setCameraPreset('bioswale');
      else this.setCameraPreset('iso');
    }
  },

  toggleLayer(key) {
    this.layers[key] = !this.layers[key];
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  },

  // 100% Mathematically Matched Spatial Area Balancer
  getSpatialParams(project, calculations) {
    const proj = project || window.App?.currentProject || {};
    const calc = calculations || window.App?.calculations || {};
    const site = proj.site || {};
    const surfaces = proj.surfaces || {};

    // 1. Total Plot Area (A_plot)
    const plotArea = Math.max(200, Number(site.plot_area) || 5000);

    // 2. Building Footprint Area (A_footprint)
    const builtUp = Math.max(50, Math.min(plotArea * 0.88, Number(site.built_up_area) || Math.round(plotArea * 0.44)));

    // 3. Remaining Unbuilt Open Area (A_remaining = A_plot - A_footprint)
    const openArea = Math.max(0, plotArea - builtUp);

    const floors = Math.max(1, parseInt(site.floors, 10) || 2);
    const roofArea = Math.max(50, Number(site.roof_area) || builtUp);
    const gfa = Number(site.total_floor_area) || (builtUp * floors);
    const fsi = (gfa / Math.max(1, plotArea)).toFixed(2);
    const buildingHeightEst = (floors * 3.6).toFixed(1);

    // 4. Breakdown of Remaining Open Area (A_remaining = A_paved + A_green)
    // Sized to exactly match ground partitioning
    let hardscape = (surfaces.concrete_area || 0) + (surfaces.asphalt_area || 0) + (surfaces.tiles_pavers || 0);
    if (hardscape <= 0 || hardscape >= openArea) {
      hardscape = Math.round(openArea * 0.428); // e.g., ~1,200 m² for 2,800 m² open
    }
    hardscape = Math.min(openArea - 50, Math.max(50, hardscape));
    const greenArea = Math.max(0, openArea - hardscape); // Remainder is 100% Living Greenery

    // 5. Metric Dimensions (Aspect ratio 1.25 : 1 for realistic urban/institutional plot)
    const plotAspect = 1.25;
    const plotWidthM = Math.round(Math.sqrt(plotArea * plotAspect) * 10) / 10;
    const plotDepthM = Math.round((plotArea / plotWidthM) * 10) / 10;

    const bldgWidthM = Math.round(Math.sqrt(builtUp * plotAspect) * 10) / 10;
    const bldgDepthM = Math.round((builtUp / bldgWidthM) * 10) / 10;

    // Paved zone dimensions (Driveway & Parking apron)
    const paverWidthM = Math.round(Math.min(plotWidthM * 0.88, bldgWidthM + 6) * 10) / 10;
    const paverDepthM = Math.round((hardscape / Math.max(1, paverWidthM)) * 10) / 10;

    // Percentages strictly summing to 100%
    const coveragePct = Math.round((builtUp / plotArea) * 100);
    const hardscapePct = Math.round((hardscape / plotArea) * 100);
    const greenPct = 100 - coveragePct - hardscapePct; // Guaranteed exact 100% sum
    const openPct = 100 - coveragePct;

    const occupants = proj.occupancy?.total_occupants || proj.water?.occupants || 250;
    const treesRemoved = proj.vegetation?.trees_removed !== undefined ? proj.vegetation.trees_removed : 12;
    const treesExisting = proj.vegetation?.mature_trees_count || 30;

    // Interventions
    const iv = proj.interventions || {};
    const treesPlanted = iv.trees_planted !== undefined ? iv.trees_planted : Math.min(Math.max(15, treesRemoved * 3), Math.floor((greenArea * 0.7) / 16));
    const greenRoofM2 = iv.green_roof_m2 !== undefined ? Math.min(roofArea * 0.7, iv.green_roof_m2) : Math.round(roofArea * 0.32);
    const permM2 = iv.permeable_pavement_m2 !== undefined ? Math.min(hardscape, iv.permeable_pavement_m2) : Math.round(hardscape * 0.95);
    const tankL = iv.rwh_tank_capacity_l !== undefined ? iv.rwh_tank_capacity_l : Math.round(Math.min(roofArea * 45, Math.max(20000, occupants * 45 * 20)));
    const solarM2 = iv.solar_pv_area_m2 !== undefined ? Math.min(roofArea - greenRoofM2, iv.solar_pv_area_m2) : Math.round(Math.min(roofArea * 0.38, Math.max(0, roofArea - greenRoofM2)));
    const solarKwp = Math.round(solarM2 / 5.5);
    const rainGardenM2 = iv.rain_garden_m2 !== undefined ? Math.min(greenArea * 0.35, iv.rain_garden_m2) : Math.round(Math.min(greenArea * 0.24, 380));
    const miyawakiM2 = Math.round(Math.min(greenArea - rainGardenM2, Math.max(150, treesPlanted * 7.5)));
    const lawnM2 = Math.max(0, greenArea - rainGardenM2 - miyawakiM2);
    const terraceArea = Math.max(0, roofArea - greenRoofM2 - solarM2);

    // Hydrology & Score Indicators
    const preImp = calc.surface_analysis?.impervious_percentage || Math.min(95, Math.round(((hardscape + builtUp) / Math.max(1, plotArea)) * 100));
    const postImp = Math.max(12, Math.round((((hardscape - permM2) + (builtUp - greenRoofM2)) / Math.max(1, plotArea)) * 100));
    const impDiff = Math.max(0, preImp - postImp);

    const qPre = calc.runoff?.pre_development?.peak_runoff_m3_hr || Math.round(((0.75 * 65 * plotArea) / 1000) * 10) / 10;
    const qPost = calc.runoff?.with_interventions?.peak_runoff_m3_hr || Math.round((qPre * 0.32) * 10) / 10;
    const qDiffPct = Math.round(((qPre - qPost) / Math.max(0.1, qPre)) * 100);

    const treesNet = treesExisting - treesRemoved + treesPlanted;
    const canopyRestored = Math.round(treesPlanted * 16);

    const preScore = calc.overall_score?.current_score || 38;
    const postScore = calc.overall_score?.post_intervention_score || 88;
    const scoreDiff = postScore - preScore;

    return {
      proj, calc, site, plotArea, builtUp, floors, roofArea, openArea, gfa, fsi, buildingHeightEst,
      hardscape, greenArea, rainGardenM2, miyawakiM2, lawnM2, terraceArea,
      plotWidthM, plotDepthM, bldgWidthM, bldgDepthM, paverWidthM, paverDepthM,
      coveragePct, openPct, hardscapePct, greenPct,
      treesRemoved, treesExisting, occupants,
      treesPlanted, greenRoofM2, permM2, tankL, solarM2, solarKwp,
      preImp, postImp, impDiff, qPre, qPost, qDiffPct, treesNet, canopyRestored, preScore, postScore, scoreDiff
    };
  },

  render(project, calculations, environmentalData) {
    const container = document.getElementById("site3d-view") || document.getElementById("siteplanner-view");
    if (!container) return;

    const data = this.getSpatialParams(project, calculations);

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-stone-800 animate-fade-in">
        
        <!-- HEADER CONTROL BAR (Deep Emerald Forest Architectural Styling) -->
        <div class="bg-gradient-to-br from-[#071814] via-[#0B241E] to-[#123C32] rounded-3xl p-6 sm:p-7 border border-emerald-500/40 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-white">
          <div class="space-y-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#04120e] text-emerald-300 border border-emerald-500/60 font-mono shadow-sm">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>3D ENVIRONMENTAL DIGITAL TWIN</span>
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-900/90 text-stone-200 border border-stone-700">
                Plot: ${data.plotWidthM}m × ${data.plotDepthM}m (${data.plotArea.toLocaleString()} m²) • Footprint: ${data.bldgWidthM}m × ${data.bldgDepthM}m (${data.builtUp.toLocaleString()} m²)
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${this.scenario === 'proposed' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-rose-950 text-rose-300 border border-rose-800'}">
                ${this.scenario === 'proposed' ? '🌿 PROPOSED: SPONGE CAMPUS' : '⚠️ BASELINE: HARDSCAPE DEFICIT'}
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              ${this.viewMode === '3d' ? 'Photorealistic 3D Environmental Digital Twin' : '2D Cadastre Spatial Masterplan — Area Balanced'}
            </h1>
            <p class="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed">
              ${this.viewMode === '3d' 
                ? `1:1 metric spatial digital twin: Total plot area (${data.plotArea.toLocaleString()} m²) strictly balances with building footprint (${data.builtUp.toLocaleString()} m², ${data.coveragePct}%) and remaining open land (${data.openArea.toLocaleString()} m² = ${data.hardscape.toLocaleString()} m² paved + ${data.greenArea.toLocaleString()} m² living landscape). Rendered with authentic architectural PBR materials, dynamic daylighting, and scale entourage.`
                : `Precision 2D architectural cadastre blueprints contrasting baseline pre-development hardscape deficits against sized post-assessment sponge infrastructure, dimensionally matching survey cadastre square meters.`
              }
            </p>
          </div>

          <!-- Mode & Scenario Switchers -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start lg:self-center">
            
            <!-- View Mode Switcher -->
            <div class="flex items-center bg-[#071814]/90 p-1 rounded-xl border border-emerald-800/80 text-xs font-bold shadow-md">
              <button onclick="window.SitePlannerView.set3DMode()" class="px-3.5 py-1.5 rounded-lg transition ${this.viewMode === '3d' ? 'bg-[#237A57] text-white shadow-md' : 'text-stone-300 hover:text-white'}">
                🌐 3D Twin
              </button>
              <button onclick="window.SitePlannerView.set2DMode()" class="px-3.5 py-1.5 rounded-lg transition ${this.viewMode === '2d' ? 'bg-[#237A57] text-white shadow-md' : 'text-stone-300 hover:text-white'}">
                🗺️ 2D Cadastre
              </button>
            </div>

            <!-- Scenario Switcher (Baseline vs Proposed) -->
            <div class="flex items-center bg-[#071814]/90 p-1 rounded-xl border border-emerald-800/80 text-xs font-bold shadow-md">
              <button onclick="window.SitePlannerView.setScenario('baseline')" class="px-3.5 py-1.5 rounded-lg transition ${this.scenario === 'baseline' ? 'bg-rose-800 text-white shadow-md' : 'text-stone-400 hover:text-white'}">
                Baseline Deficit
              </button>
              <button onclick="window.SitePlannerView.setScenario('proposed')" class="px-3.5 py-1.5 rounded-lg transition ${this.scenario === 'proposed' ? 'bg-emerald-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}">
                Proposed Recovery
              </button>
            </div>

          </div>
        </div>

        <!-- MATHEMATICALLY MATCHED AREA BALANCE STRIP -->
        <div class="crystal-3d-card p-4 rounded-2xl border border-stone-200/80 shadow-sm space-y-3">
          <div class="flex items-center justify-between text-xs font-bold text-stone-800 flex-wrap gap-2">
            <span class="flex items-center gap-1.5">
              <span>📐</span>
              <span>Metric Area Balance Equation: Plot Area (${data.plotArea.toLocaleString()} m²) = Footprint (${data.builtUp.toLocaleString()} m²) + Remaining Area (${data.openArea.toLocaleString()} m²)</span>
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
              100.0% Exact Match
            </span>
          </div>

          <!-- Horizontal Proportional Area Balance Bar -->
          <div class="w-full h-4 rounded-full overflow-hidden flex shadow-inner border border-stone-300/70">
            <div style="width: ${data.coveragePct}%;" class="bg-slate-700 h-full flex items-center justify-center text-[9px] font-bold text-white font-mono" title="Building Footprint: ${data.builtUp.toLocaleString()} m² (${data.coveragePct}%)">
              ${data.coveragePct > 15 ? `Footprint ${data.coveragePct}%` : ''}
            </div>
            <div style="width: ${data.hardscapePct}%;" class="bg-amber-600 h-full flex items-center justify-center text-[9px] font-bold text-white font-mono" title="Paved Driveway/Parking: ${data.hardscape.toLocaleString()} m² (${data.hardscapePct}%)">
              ${data.hardscapePct > 15 ? `Paved ${data.hardscapePct}%` : ''}
            </div>
            <div style="width: ${data.greenPct}%;" class="bg-emerald-600 h-full flex items-center justify-center text-[9px] font-bold text-white font-mono" title="Living Green Space & SuDS: ${data.greenArea.toLocaleString()} m² (${data.greenPct}%)">
              ${data.greenPct > 15 ? `Greenery ${data.greenPct}%` : ''}
            </div>
          </div>

          <!-- Area Allocation KPI Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs pt-1">
            <div class="p-2.5 bg-white/80 rounded-xl border border-stone-200 shadow-xs space-y-0.5">
              <span class="text-stone-400 block text-[9px] font-bold uppercase tracking-wider">Total Plot Area</span>
              <div class="text-stone-900 text-sm font-black font-mono">${data.plotArea.toLocaleString()} m²</div>
              <span class="text-[10px] text-stone-500 block font-semibold">${data.plotWidthM}m × ${data.plotDepthM}m</span>
            </div>

            <div class="p-2.5 bg-white/80 rounded-xl border border-stone-200 shadow-xs space-y-0.5">
              <span class="text-stone-400 block text-[9px] font-bold uppercase tracking-wider">Building Footprint</span>
              <div class="text-stone-900 text-sm font-black font-mono">${data.builtUp.toLocaleString()} m²</div>
              <span class="text-[10px] text-slate-700 block font-bold">${data.coveragePct}% Ground Coverage</span>
            </div>

            <div class="p-2.5 bg-white/80 rounded-xl border border-stone-200 shadow-xs space-y-0.5">
              <span class="text-stone-400 block text-[9px] font-bold uppercase tracking-wider">Remaining Open Land</span>
              <div class="text-stone-900 text-sm font-black font-mono">${data.openArea.toLocaleString()} m²</div>
              <span class="text-[10px] text-stone-600 block font-bold">${data.openPct}% Unbuilt Land</span>
            </div>

            <div class="p-2.5 bg-white/80 rounded-xl border border-stone-200 shadow-xs space-y-0.5">
              <span class="text-stone-400 block text-[9px] font-bold uppercase tracking-wider">Paved Circulation</span>
              <div class="text-stone-900 text-sm font-black font-mono">${data.hardscape.toLocaleString()} m²</div>
              <span class="text-[10px] text-amber-700 block font-bold">${data.hardscapePct}% of Plot</span>
            </div>

            <div class="p-2.5 bg-white/80 rounded-xl border border-stone-200 shadow-xs space-y-0.5">
              <span class="text-stone-400 block text-[9px] font-bold uppercase tracking-wider">Living Landscape & SuDS</span>
              <div class="text-stone-900 text-sm font-black font-mono">${data.greenArea.toLocaleString()} m²</div>
              <span class="text-[10px] text-emerald-700 block font-bold">${data.greenPct}% Infiltration Area</span>
            </div>
          </div>
        </div>

        <!-- MAIN WORKSPACE: 3D DIGITAL TWIN OR 2D CADASTRE -->
        ${this.viewMode === '3d' ? this.render3DWorkspace(data) : this.render2DWorkspace(data)}

      </div>
    `;

    if (this.viewMode === '3d') {
      setTimeout(() => {
        this.initThreeScene(project, calculations);
      }, 50);
    }
  },

  render3DWorkspace(data) {
    const isBaseline = this.scenario === 'baseline';

    return `
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        <!-- Left 3 Cols: 3D Canvas Viewport Container -->
        <div class="lg:col-span-3 space-y-3">
          
          <div class="relative w-full aspect-[16/10] bg-[#0c1322] rounded-3xl overflow-hidden border border-emerald-950/40 shadow-2xl select-none">
            
            <!-- Three.js Canvas Mount Container -->
            <div id="site3d-canvas-mount" class="w-full h-full cursor-grab active:cursor-grabbing"></div>

            <!-- Top HUD Overlay: Camera Presets & Scenario Badge -->
            <div class="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none flex-wrap gap-2">
              <div class="flex items-center gap-1.5 pointer-events-auto bg-[#071814]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-700/50 text-[11px] font-bold text-white shadow-lg">
                <span class="text-emerald-400">📷 Camera:</span>
                <button onclick="window.SitePlannerView.setCameraPreset('iso')" class="px-2 py-0.5 rounded hover:bg-emerald-800 transition">Perspective</button>
                <button onclick="window.SitePlannerView.setCameraPreset('entry')" class="px-2 py-0.5 rounded hover:bg-emerald-800 transition">Street Entry</button>
                <button onclick="window.SitePlannerView.setCameraPreset('rooftop')" class="px-2 py-0.5 rounded hover:bg-emerald-800 transition">Rooftop Solar</button>
                <button onclick="window.SitePlannerView.setCameraPreset('bioswale')" class="px-2 py-0.5 rounded hover:bg-emerald-800 transition">SuDS Drainage</button>
                <button onclick="window.SitePlannerView.setCameraPreset('plan')" class="px-2 py-0.5 rounded hover:bg-emerald-800 transition">Top-Down Plan</button>
              </div>

              <!-- Spin & Weather Toggles -->
              <div class="flex items-center gap-1.5 pointer-events-auto">
                <button id="site3d-spin-toggle" onclick="window.SitePlannerView.toggleAutoRotate()" class="px-3 py-1 rounded-xl text-[11px] font-bold transition shadow-md ${this._three.autoRotate ? 'bg-emerald-800 text-white' : 'bg-stone-900/90 text-stone-300 border border-stone-700'}">
                  Spin: ${this._three.autoRotate ? 'ON' : 'OFF'}
                </button>
                <button id="site3d-rain-btn" onclick="window.SitePlannerView.toggleRain()" class="px-3 py-1 rounded-xl text-[11px] font-bold transition shadow-md ${this._three.rainActive ? 'bg-sky-600 text-white' : 'bg-stone-900/90 text-stone-300 border border-stone-700'}">
                  🌧️ Rain: ${this._three.rainActive ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <!-- Bottom Left HUD: Sun Simulator Slider -->
            <div class="absolute bottom-4 left-4 pointer-events-auto bg-[#071814]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-emerald-700/50 text-white text-xs flex items-center gap-3 shadow-xl">
              <span class="text-amber-400 font-bold flex items-center gap-1">☀️ <span id="site3d-sun-label">${this._three.sunTime}:00</span></span>
              <input type="range" min="8" max="18" value="${this._three.sunTime}" oninput="window.SitePlannerView.setSunTime(this.value)" class="w-28 accent-amber-400 cursor-pointer">
              <span class="text-[10px] text-stone-400 font-mono">Sun Arc</span>
            </div>

            <!-- Bottom Right Metric Telemetry Badge -->
            <div class="absolute bottom-4 right-4 pointer-events-none bg-[#071814]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-emerald-700/50 text-right text-xs shadow-xl">
              <div class="text-[10px] font-bold uppercase text-stone-400">Scale Verification</div>
              <div class="font-mono font-bold text-emerald-300 text-sm">1 Unit = 1.0 Meter</div>
              <div class="text-[10px] text-stone-300">${data.builtUp.toLocaleString()} m² footprint + ${data.openArea.toLocaleString()} m² open = ${data.plotArea.toLocaleString()} m²</div>
            </div>

          </div>

          <!-- Bottom Layer Toggles & Instructions -->
          <div class="crystal-glass-card p-4 rounded-2xl border border-stone-200/80 shadow-sm flex items-center justify-between gap-4 flex-wrap text-xs">
            <div class="flex items-center gap-2 text-stone-600">
              <span class="font-bold text-stone-800">3D Navigation:</span>
              <span>Left-click drag to rotate • Right-click drag to pan • Scroll to zoom</span>
            </div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-[10px] font-bold uppercase text-stone-400 mr-1">Layers:</span>
              <button onclick="window.SitePlannerView.toggleLayer('solar_pv')" class="px-2.5 py-1 rounded-lg font-bold border transition ${this.layers.solar_pv ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-stone-100 text-stone-400 border-stone-200'}">Solar PV</button>
              <button onclick="window.SitePlannerView.toggleLayer('green_roof')" class="px-2.5 py-1 rounded-lg font-bold border transition ${this.layers.green_roof ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-stone-100 text-stone-400 border-stone-200'}">Green Roof</button>
              <button onclick="window.SitePlannerView.toggleLayer('permeable_paving')" class="px-2.5 py-1 rounded-lg font-bold border transition ${this.layers.permeable_paving ? 'bg-stone-200 text-stone-900 border-stone-400' : 'bg-stone-100 text-stone-400 border-stone-200'}">Permeable Pavers</button>
              <button onclick="window.SitePlannerView.toggleLayer('bioswales')" class="px-2.5 py-1 rounded-lg font-bold border transition ${this.layers.bioswales ? 'bg-teal-100 text-teal-900 border-teal-300' : 'bg-stone-100 text-stone-400 border-stone-200'}">Bioswales</button>
              <button onclick="window.SitePlannerView.toggleLayer('water_rwh')" class="px-2.5 py-1 rounded-lg font-bold border transition ${this.layers.water_rwh ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-stone-100 text-stone-400 border-stone-200'}">RWH Cistern</button>
              <button onclick="window.SitePlannerView.toggleLayer('biodiversity')" class="px-2.5 py-1 rounded-lg font-bold border transition ${this.layers.biodiversity ? 'bg-purple-100 text-purple-900 border-purple-300' : 'bg-stone-100 text-stone-400 border-stone-200'}">Native Trees</button>
              <button onclick="window.SitePlannerView.toggleLayer('cars')" class="px-2.5 py-1 rounded-lg font-bold border transition ${this.layers.cars ? 'bg-sky-100 text-sky-900 border-sky-300' : 'bg-stone-100 text-stone-400 border-stone-200'}">Scale Vehicles</button>
            </div>
          </div>

        </div>

        <!-- Right 1 Col: Contextual Element Inspector -->
        <div class="space-y-4">
          <div class="crystal-3d-card p-5 rounded-3xl border border-stone-200/80 shadow-md space-y-4">
            <div class="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Spatial Inspector</span>
                <h3 class="text-base font-bold text-stone-900 font-serif">Element Details</h3>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">Live Model</span>
            </div>

            <!-- Clickable Element Selector Pills -->
            <div class="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
              <button onclick="window.SitePlannerView.selectElement('solar')" class="p-2 rounded-xl text-left transition border ${this.selectedElement === 'solar' ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs' : 'bg-stone-50 text-stone-600 border-stone-200'}">
                ☀️ Solar Array
              </button>
              <button onclick="window.SitePlannerView.selectElement('green_roof')" class="p-2 rounded-xl text-left transition border ${this.selectedElement === 'green_roof' ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs' : 'bg-stone-50 text-stone-600 border-stone-200'}">
                🌿 Green Roof
              </button>
              <button onclick="window.SitePlannerView.selectElement('permeable')" class="p-2 rounded-xl text-left transition border ${this.selectedElement === 'permeable' ? 'bg-stone-200 text-stone-900 border-stone-400 shadow-xs' : 'bg-stone-50 text-stone-600 border-stone-200'}">
                🧱 Porous Pavers
              </button>
              <button onclick="window.SitePlannerView.selectElement('bioswale')" class="p-2 rounded-xl text-left transition border ${this.selectedElement === 'bioswale' ? 'bg-teal-50 text-teal-900 border-teal-300 shadow-xs' : 'bg-stone-50 text-stone-600 border-stone-200'}">
                🌧️ Bioswales
              </button>
              <button onclick="window.SitePlannerView.selectElement('rwh')" class="p-2 rounded-xl text-left transition border ${this.selectedElement === 'rwh' ? 'bg-blue-50 text-blue-900 border-blue-300 shadow-xs' : 'bg-stone-50 text-stone-600 border-stone-200'}">
                💧 RWH Cistern
              </button>
              <button onclick="window.SitePlannerView.selectElement('biodiversity')" class="p-2 rounded-xl text-left transition border ${this.selectedElement === 'biodiversity' ? 'bg-purple-50 text-purple-900 border-purple-300 shadow-xs' : 'bg-stone-50 text-stone-600 border-stone-200'}">
                🌲 Native Trees
              </button>
            </div>

            <!-- Inspection Card Dynamic Mount -->
            <div id="element-inspection-card">
              ${this.getInspectionCardHtml(data)}
            </div>
          </div>
        </div>

      </div>
    `;
  },

  render2DWorkspace(data) {
    return `
      <div class="space-y-6">
        
        <!-- 2D View Tabs Bar -->
        <div class="crystal-glass-card p-3 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between gap-3 flex-wrap text-xs">
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-stone-700 mr-1">Blueprint Mode:</span>
            <button onclick="window.SitePlannerView.set2DTab('side_by_side')" class="px-3 py-1.5 rounded-xl font-bold transition ${this.active2DTab === 'side_by_side' ? 'bg-[#14281D] text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}">
              Side-by-Side (Separated)
            </button>
            <button onclick="window.SitePlannerView.set2DTab('split')" class="px-3 py-1.5 rounded-xl font-bold transition ${this.active2DTab === 'split' ? 'bg-[#14281D] text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}">
              Curtain Split Slider
            </button>
            <button onclick="window.SitePlannerView.set2DTab('before')" class="px-3 py-1.5 rounded-xl font-bold transition ${this.active2DTab === 'before' ? 'bg-rose-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}">
              Before Only
            </button>
            <button onclick="window.SitePlannerView.set2DTab('after')" class="px-3 py-1.5 rounded-xl font-bold transition ${this.active2DTab === 'after' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}">
              After Only
            </button>
          </div>

          <div class="text-stone-500 font-mono text-[11px]">
            Plot: ${data.plotWidthM}m × ${data.plotDepthM}m (${data.plotArea.toLocaleString()} m²) • 100% Mathematically Scaled
          </div>
        </div>

        ${this.render2DContent(data)}

      </div>
    `;
  },

  render2DContent(data) {
    if (this.active2DTab === 'before') {
      return this.getBeforeDiagramCard(data, true);
    }
    if (this.active2DTab === 'after') {
      return this.getAfterDiagramCard(data, true);
    }
    if (this.active2DTab === 'split') {
      return `
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                ◀ BEFORE: Baseline Concrete Deficit
              </span>
              <span class="text-xs text-stone-400 font-bold">vs</span>
              <span class="text-xs font-bold text-[#123C32] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                AFTER: Sized Sponge Masterplan ▶
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="text-stone-500 font-bold">Curtain Split:</span>
              <input type="range" min="0" max="100" value="${this.splitPos}" oninput="window.SitePlannerView.onSliderMove(this.value)" class="w-36 accent-[#237A57] cursor-pointer">
              <span class="font-mono font-bold text-stone-800">${this.splitPos}%</span>
            </div>
          </div>

          <div class="relative w-full aspect-[16/10] bg-stone-100 rounded-2xl overflow-hidden border border-stone-300 select-none shadow-inner">
            <div class="absolute inset-0 w-full h-full">
              ${this.getBeforeCadastreSvg(data)}
            </div>
            <div class="absolute inset-0 overflow-hidden" style="width: ${this.splitPos}%;">
              <div style="width: 1000px; height: 100%; min-width: 1000px;">
                ${this.getAfterCadastreSvg(data)}
              </div>
            </div>
            <div class="absolute top-0 bottom-0 pointer-events-none" style="left: ${this.splitPos}%;">
              <div class="w-1 h-full bg-white shadow-2xl relative">
                <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-stone-900 border-2 border-white text-white flex items-center justify-center text-xs font-bold shadow-lg">
                  ⇄
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Default: Side-by-Side
    return `
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        ${this.getBeforeDiagramCard(data, false)}
        ${this.getAfterDiagramCard(data, false)}
      </div>
    `;
  },

  getBeforeDiagramCard(data, isFullWidth) {
    return `
      <div class="bg-stone-50/90 rounded-2xl border-2 border-rose-200 p-4 sm:p-5 space-y-4 shadow-sm hover:border-rose-300 transition">
        <div class="flex items-center justify-between border-b border-rose-100 pb-3 gap-2 flex-wrap">
          <div>
            <span class="text-[10px] font-mono uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded font-bold">
              STAGE 1: BEFORE CONSTRUCTION
            </span>
            <h3 class="text-base sm:text-lg font-bold text-stone-900 font-serif mt-1">
              Baseline Deficit Cadastre Blueprint
            </h3>
          </div>
          <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-900 text-rose-100">
            🔴 High Runoff Hazard
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div class="p-2 bg-white rounded-xl border border-stone-200">
            <span class="text-stone-400 block text-[9px] uppercase font-bold">Impervious Area</span>
            <strong class="text-stone-800 font-mono">${data.preImp}%</strong>
            <span class="text-[9px] text-rose-600 block font-semibold">100% Sealed</span>
          </div>
          <div class="p-2 bg-white rounded-xl border border-stone-200">
            <span class="text-stone-400 block text-[9px] uppercase font-bold">Peak Runoff (Q)</span>
            <strong class="text-stone-800 font-mono">${data.qPre} <span class="font-normal text-[9px]">m³/hr</span></strong>
            <span class="text-[9px] text-rose-600 block font-semibold">Flash Hazard</span>
          </div>
          <div class="p-2 bg-white rounded-xl border border-stone-200">
            <span class="text-stone-400 block text-[9px] uppercase font-bold">Tree Canopy</span>
            <strong class="text-stone-800 font-mono">${data.treesExisting} Trees</strong>
            <span class="text-[9px] text-rose-600 block font-semibold">−${data.treesRemoved} Felled</span>
          </div>
          <div class="p-2 bg-white rounded-xl border border-stone-200">
            <span class="text-stone-400 block text-[9px] uppercase font-bold">Recovery Score</span>
            <strong class="text-rose-700 font-mono">${data.preScore} / 100</strong>
            <span class="text-[9px] text-stone-500 block">Critical Deficit</span>
          </div>
        </div>

        <div class="w-full overflow-hidden rounded-xl border border-stone-300 shadow-inner bg-slate-100">
          ${this.getBeforeCadastreSvg(data)}
        </div>
      </div>
    `;
  },

  getAfterDiagramCard(data, isFullWidth) {
    return `
      <div class="bg-emerald-50/60 rounded-2xl border-2 border-emerald-300 p-4 sm:p-5 space-y-4 shadow-sm hover:border-emerald-400 transition">
        <div class="flex items-center justify-between border-b border-emerald-200 pb-3 gap-2 flex-wrap">
          <div>
            <span class="text-[10px] font-mono uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
              STAGE 2: AFTER ASSESSMENT
            </span>
            <h3 class="text-base sm:text-lg font-bold text-[#123C32] font-serif mt-1">
              Mitigated Sponge Masterplan Blueprint
            </h3>
          </div>
          <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-800 text-emerald-100">
            🟢 100% Sized Sponge Campus
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div class="p-2 bg-white rounded-xl border border-emerald-200">
            <span class="text-stone-400 block text-[9px] uppercase font-bold">Impervious Area</span>
            <strong class="text-emerald-800 font-mono">${data.postImp}%</strong>
            <span class="text-[9px] text-emerald-600 block font-semibold">−${data.impDiff}% Relieved</span>
          </div>
          <div class="p-2 bg-white rounded-xl border border-emerald-200">
            <span class="text-stone-400 block text-[9px] uppercase font-bold">Peak Runoff (Q)</span>
            <strong class="text-emerald-800 font-mono">${data.qPost} <span class="font-normal text-[9px]">m³/hr</span></strong>
            <span class="text-[9px] text-emerald-600 block font-semibold">−${data.qDiffPct}% Attenuated</span>
          </div>
          <div class="p-2 bg-white rounded-xl border border-emerald-200">
            <span class="text-stone-400 block text-[9px] uppercase font-bold">Living Canopy</span>
            <strong class="text-emerald-800 font-mono">${data.treesNet} Trees</strong>
            <span class="text-[9px] text-emerald-600 block font-semibold">+${data.canopyRestored.toLocaleString()} m² Shade</span>
          </div>
          <div class="p-2 bg-white rounded-xl border border-emerald-200">
            <span class="text-stone-400 block text-[9px] uppercase font-bold">Recovery Score</span>
            <strong class="text-emerald-700 font-mono">${data.postScore} / 100</strong>
            <span class="text-[9px] text-emerald-600 block font-bold">+${data.scoreDiff} Pts</span>
          </div>
        </div>

        <div class="w-full overflow-hidden rounded-xl border border-emerald-300 shadow-inner bg-emerald-950/5">
          ${this.getAfterCadastreSvg(data)}
        </div>
      </div>
    `;
  },

  // High-Precision Mathematically Scaled 2D SVG Before Schematic
  getBeforeCadastreSvg(data) {
    const W_svg = 840;
    const D_svg = Math.min(480, Math.round(W_svg * (data.plotDepthM / data.plotWidthM)));
    const X0 = 80;
    const Y0 = 70;

    // Proportional dimensions matching exact meters (S = pixels per meter)
    const scale = W_svg / data.plotWidthM;
    const bldgW_svg = Math.round(data.bldgWidthM * scale);
    const bldgD_svg = Math.round(data.bldgDepthM * scale);
    const bldgX_svg = X0 + Math.round((W_svg - bldgW_svg) / 2);
    const bldgY_svg = Y0 + Math.round(D_svg * 0.10); // Standard rear/north setback

    const paveW_svg = Math.round(data.paverWidthM * scale);
    const paveD_svg = Math.round(data.paverDepthM * scale);
    const paveX_svg = X0 + Math.round((W_svg - paveW_svg) / 2);
    const paveY_svg = bldgY_svg + bldgD_svg + Math.round(10 * scale);

    return `
      <svg viewBox="0 0 1000 640" class="w-full h-auto block select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-before-cadastre" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" stroke-width="0.8"/>
          </pattern>
          <pattern id="concrete-hatch-before" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 0 16 L 16 0 M 0 0 L 16 16" fill="none" stroke="#94a3b8" stroke-width="0.6"/>
          </pattern>
        </defs>

        <!-- Background Canvas -->
        <rect width="1000" height="640" fill="#f8fafc"/>
        <rect width="1000" height="640" fill="url(#grid-before-cadastre)"/>

        <!-- Cadastre Site Boundary -->
        <rect x="${X0}" y="${Y0}" width="${W_svg}" height="${D_svg}" rx="10" fill="#cbd5e1" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="8,4"/>

        <!-- Plot Dimension Labels -->
        <text x="500" y="${Y0 - 18}" text-anchor="middle" font-size="12" font-weight="900" fill="#0f172a">
          PLOT WIDTH: ${data.plotWidthM} m (Cadastre Area: ${data.plotArea.toLocaleString()} m²)
        </text>
        <text x="${X0 + W_svg + 24}" y="${Y0 + Math.round(D_svg / 2)}" text-anchor="middle" font-size="12" font-weight="900" fill="#0f172a" transform="rotate(90, ${X0 + W_svg + 24}, ${Y0 + Math.round(D_svg / 2)})">
          DEPTH: ${data.plotDepthM} m
        </text>

        <!-- North Arrow -->
        <g transform="translate(930, 50)">
          <circle cx="0" cy="0" r="16" fill="#ffffff" stroke="#ef4444" stroke-width="1.5"/>
          <path d="M 0 -12 L 4 -2 L 0 0 L -4 -2 z" fill="#ef4444"/>
          <text x="0" y="-15" text-anchor="middle" font-size="9" font-weight="900" fill="#991b1b">N</text>
        </g>

        <!-- Unmitigated Impervious Concrete Hardscape (Front Driveway) -->
        <rect x="${paveX_svg}" y="${paveY_svg}" width="${paveW_svg}" height="${paveD_svg}" rx="6" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
        <rect x="${paveX_svg}" y="${paveY_svg}" width="${paveW_svg}" height="${paveD_svg}" rx="6" fill="url(#concrete-hatch-before)"/>
        
        <g transform="translate(500, ${paveY_svg + Math.round(paveD_svg / 2)})">
          <rect x="-240" y="-18" width="480" height="36" rx="8" fill="#1e293b" opacity="0.95"/>
          <text x="0" y="-1" text-anchor="middle" font-size="11" font-weight="900" fill="#f87171">
            UNMITIGATED HARDSCAPE: ${data.hardscape.toLocaleString()} m² (${data.hardscapePct}%)
          </text>
          <text x="0" y="14" text-anchor="middle" font-size="10" font-weight="700" fill="#cbd5e1" font-family="monospace">
            Runoff C = 0.90 • 100% Surface Runoff to Drains • Heat Sink (48°C)
          </text>
        </g>

        <!-- Main Building Footprint (Proportionally Sized) -->
        <rect x="${bldgX_svg}" y="${bldgY_svg}" width="${bldgW_svg}" height="${bldgD_svg}" rx="8" fill="#334155" stroke="#0f172a" stroke-width="3"/>
        
        <g transform="translate(500, ${bldgY_svg + Math.round(bldgD_svg / 2)})">
          <text x="0" y="-12" text-anchor="middle" font-size="13" font-weight="900" fill="#ffffff">
            BUILDING FOOTPRINT: ${data.builtUp.toLocaleString()} m² (${data.coveragePct}% Coverage)
          </text>
          <text x="0" y="8" text-anchor="middle" font-size="11" font-weight="800" fill="#fca5a5" font-family="monospace">
            ${data.bldgWidthM}m × ${data.bldgDepthM}m • ${data.floors} Storeys (~${data.buildingHeightEst}m) • GFA: ${data.gfa.toLocaleString()} m²
          </text>
          <text x="0" y="26" text-anchor="middle" font-size="10" font-weight="700" fill="#e2e8f0">
            Bare RCC Roof Membrane • Zero Retention • Extreme Solar Heat Gain
          </text>
        </g>

        <!-- Felled Trees Deficit Markers in Setbacks -->
        <g transform="translate(${X0 + 35}, ${bldgY_svg + 35})">
          <circle cx="0" cy="0" r="12" fill="#78350f"/>
          <path d="M -6 -6 L 6 6 M -6 6 L 6 -6" stroke="#ef4444" stroke-width="2"/>
          <text x="18" y="4" font-size="10" font-weight="800" fill="#991b1b">Tree Stump (−1)</text>
        </g>
        <g transform="translate(${X0 + W_svg - 100}, ${bldgY_svg + 35})">
          <circle cx="0" cy="0" r="12" fill="#78350f"/>
          <path d="M -6 -6 L 6 6 M -6 6 L 6 -6" stroke="#ef4444" stroke-width="2"/>
          <text x="18" y="4" font-size="10" font-weight="800" fill="#991b1b">Tree Stump (−1)</text>
        </g>

        <!-- Bottom Warning Banner -->
        <g transform="translate(500, 610)">
          <rect x="-320" y="-16" width="640" height="32" rx="8" fill="#991b1b"/>
          <text x="0" y="5" text-anchor="middle" font-size="11" font-weight="900" fill="#fef2f2">
            ⚠️ BASELINE DEFICIT: ${data.preImp}% IMPERVIOUS • PEAK Q: ${data.qPre} m³/hr • SCORE: ${data.preScore}/100
          </text>
        </g>
      </svg>
    `;
  },

  // High-Precision Mathematically Scaled 2D SVG After Schematic
  getAfterCadastreSvg(data) {
    const W_svg = 840;
    const D_svg = Math.min(480, Math.round(W_svg * (data.plotDepthM / data.plotWidthM)));
    const X0 = 80;
    const Y0 = 70;

    const scale = W_svg / data.plotWidthM;
    const bldgW_svg = Math.round(data.bldgWidthM * scale);
    const bldgD_svg = Math.round(data.bldgDepthM * scale);
    const bldgX_svg = X0 + Math.round((W_svg - bldgW_svg) / 2);
    const bldgY_svg = Y0 + Math.round(D_svg * 0.10);

    // Roof sub-divisions
    const grRatio = Math.min(0.85, Math.max(0, data.greenRoofM2 / Math.max(1, data.roofArea)));
    const pvRatio = Math.min(0.85, Math.max(0, data.solarM2 / Math.max(1, data.roofArea)));
    const sumRatio = Math.max(0.1, grRatio + pvRatio);
    const grW_svg = Math.round((bldgW_svg - 10) * (grRatio / sumRatio));
    const pvW_svg = (bldgW_svg - 10) - grW_svg;

    // Ground paved and bioswale zones
    const paveW_svg = Math.round(data.paverWidthM * scale);
    const paveD_svg = Math.round(data.paverDepthM * scale);
    const paveX_svg = X0 + Math.round((W_svg - paveW_svg) / 2);
    const paveY_svg = bldgY_svg + bldgD_svg + Math.round(8 * scale);

    const bioW_svg = paveW_svg;
    const bioD_svg = Math.max(22, Math.round((data.rainGardenM2 / Math.max(1, data.paverWidthM)) * scale));
    const bioY_svg = paveY_svg + paveD_svg + 6;

    return `
      <svg viewBox="0 0 1000 640" class="w-full h-auto block select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-after-cadastre" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#dcfce7" stroke-width="0.8"/>
          </pattern>
          <pattern id="paver-interlock" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 0 0 L 12 0 L 12 12 L 0 12 z M 0 6 L 12 6 M 6 0 L 6 12" fill="none" stroke="#cbd5e1" stroke-width="0.8"/>
          </pattern>
        </defs>

        <!-- Background Canvas -->
        <rect width="1000" height="640" fill="#f0fdf4"/>
        <rect width="1000" height="640" fill="url(#grid-after-cadastre)"/>

        <!-- Cadastre Site Boundary (Living Green Infiltration Edge) -->
        <rect x="${X0}" y="${Y0}" width="${W_svg}" height="${D_svg}" rx="10" fill="#14532d" fill-opacity="0.12" stroke="#10b981" stroke-width="2.5"/>

        <!-- Plot Dimension Labels -->
        <text x="500" y="${Y0 - 18}" text-anchor="middle" font-size="12" font-weight="900" fill="#064e3b">
          SPONGE CAMPUS PLOT: ${data.plotWidthM} m × ${data.plotDepthM} m (${data.plotArea.toLocaleString()} m²)
        </text>

        <!-- North Arrow -->
        <g transform="translate(930, 50)">
          <circle cx="0" cy="0" r="16" fill="#ffffff" stroke="#10b981" stroke-width="1.5"/>
          <path d="M 0 -12 L 4 -2 L 0 0 L -4 -2 z" fill="#10b981"/>
          <text x="0" y="-15" text-anchor="middle" font-size="9" font-weight="900" fill="#064e3b">N</text>
        </g>

        <!-- Permeable Interlocking Pavers (PICP) Driveway & Parking -->
        <rect x="${paveX_svg}" y="${paveY_svg}" width="${paveW_svg}" height="${paveD_svg}" rx="8" fill="#f8fafc" stroke="#d97706" stroke-width="2"/>
        <rect x="${paveX_svg}" y="${paveY_svg}" width="${paveW_svg}" height="${paveD_svg}" rx="8" fill="url(#paver-interlock)"/>
        
        <g transform="translate(500, ${paveY_svg + Math.round(paveD_svg / 2)})">
          <rect x="-240" y="-18" width="480" height="36" rx="8" fill="#0f172a" opacity="0.95"/>
          <text x="0" y="-1" text-anchor="middle" font-size="11" font-weight="900" fill="#fbbf24">
            PERMEABLE PAVERS (PICP): ${data.permM2.toLocaleString()} m² (${data.hardscapePct}%)
          </text>
          <text x="0" y="14" text-anchor="middle" font-size="10" font-weight="700" fill="#e2e8f0" font-family="monospace">
            IRC:SP:63 Porous Sub-Base • Runoff C = 0.20 • Direct Infiltration
          </text>
        </g>

        <!-- Engineered Bioretention Bioswale (Discharge Edge) -->
        <rect x="${paveX_svg}" y="${bioY_svg}" width="${bioW_svg}" height="${bioD_svg}" rx="8" fill="#0891b2" fill-opacity="0.3" stroke="#0284c7" stroke-width="2"/>
        <text x="500" y="${bioY_svg + Math.round(bioD_svg / 2) + 4}" text-anchor="middle" font-size="10" font-weight="900" fill="#0c4a6e">
          🌧️ ENGINEERED BIORETENTION BIOSWALE: ${data.rainGardenM2.toLocaleString()} m² (C = 0.15 • TSS Filtration • +35 min Delay)
        </text>

        <!-- Main Building Footprint with Dual Eco-Roof -->
        <rect x="${bldgX_svg}" y="${bldgY_svg}" width="${bldgW_svg}" height="${bldgD_svg}" rx="8" fill="#0f172a" stroke="#064e3b" stroke-width="3"/>

        <!-- Left Roof: Sedum Green Roof -->
        <rect x="${bldgX_svg + 5}" y="${bldgY_svg + 5}" width="${grW_svg}" height="${bldgD_svg - 10}" rx="6" fill="#15803d" stroke="#166534" stroke-width="1.5"/>
        <g transform="translate(${bldgX_svg + 5 + Math.round(grW_svg / 2)}, ${bldgY_svg + Math.round(bldgD_svg / 2)})">
          <text x="0" y="-8" text-anchor="middle" font-size="11" font-weight="900" fill="#ffffff">
            🌿 SEDUM GREEN ROOF
          </text>
          <text x="0" y="8" text-anchor="middle" font-size="10" font-weight="800" fill="#bbf7d0" font-family="monospace">
            ${data.greenRoofM2.toLocaleString()} m² • C = 0.30
          </text>
          <text x="0" y="22" text-anchor="middle" font-size="9" font-weight="700" fill="#dcfce7">
            70% Storm Retention • 16°C Cooler
          </text>
        </g>

        <!-- Right Roof: Solar PV Array -->
        <rect x="${bldgX_svg + 5 + grW_svg}" y="${bldgY_svg + 5}" width="${pvW_svg}" height="${bldgD_svg - 10}" rx="6" fill="#0f172a" stroke="#eab308" stroke-width="1.5"/>
        <g transform="translate(${bldgX_svg + 5 + grW_svg + Math.round(pvW_svg / 2)}, ${bldgY_svg + Math.round(bldgD_svg / 2)})">
          <text x="0" y="-8" text-anchor="middle" font-size="11" font-weight="900" fill="#facc15">
            ☀️ SOLAR PV ARRAY
          </text>
          <text x="0" y="8" text-anchor="middle" font-size="10" font-weight="800" fill="#fef08a" font-family="monospace">
            ${data.solarKwp} kWp (${data.solarM2.toLocaleString()} m²)
          </text>
          <text x="0" y="22" text-anchor="middle" font-size="9" font-weight="700" fill="#ffffff">
            Clean Electricity & Decarbonization
          </text>
        </g>

        <!-- West Setback: Subsurface RWH Cistern -->
        <rect x="${X0 + 15}" y="${bldgY_svg + 10}" width="50" height="${bldgD_svg - 20}" rx="6" fill="#1d4ed8" stroke="#1e40af" stroke-width="2"/>
        <g transform="translate(${X0 + 40}, ${bldgY_svg + Math.round(bldgD_svg / 2)})">
          <text x="0" y="-8" text-anchor="middle" font-size="13">💧</text>
          <text x="0" y="8" text-anchor="middle" font-size="9" font-weight="900" fill="#ffffff">RWH TANK</text>
          <text x="0" y="20" text-anchor="middle" font-size="9" font-weight="800" fill="#93c5fd" font-family="monospace">${(data.tankL / 1000).toFixed(0)} kL</text>
        </g>

        <!-- East Setback: Miyawaki Forest & Native Trees -->
        <rect x="${X0 + W_svg - 65}" y="${bldgY_svg + 10}" width="50" height="${bldgD_svg - 20}" rx="6" fill="#84cc16" fill-opacity="0.3" stroke="#65a30d" stroke-width="2"/>
        <g transform="translate(${X0 + W_svg - 40}, ${bldgY_svg + Math.round(bldgD_svg / 2)})">
          <text x="0" y="-8" text-anchor="middle" font-size="13">🌲</text>
          <text x="0" y="8" text-anchor="middle" font-size="9" font-weight="900" fill="#166534">MIYAWAKI</text>
          <text x="0" y="20" text-anchor="middle" font-size="9" font-weight="800" fill="#14532d" font-family="monospace">${data.treesPlanted} Trees</text>
        </g>

        <!-- Bottom Mitigated Badge -->
        <g transform="translate(500, 610)">
          <rect x="-330" y="-16" width="660" height="32" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
          <text x="0" y="5" text-anchor="middle" font-size="11" font-weight="900" fill="#a7f3d0">
            🟢 MITIGATED SPONGE: ${data.postImp}% IMPERVIOUS (−${data.impDiff}%) • PEAK Q: ${data.qPost} m³/hr (−${data.qDiffPct}%) • SCORE: ${data.postScore}/100
          </text>
        </g>
      </svg>
    `;
  },

  getInspectionCardHtml(data) {
    const elementsData = {
      solar: {
        badge: "☀️ CLEAN ENERGY",
        badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
        name: "Rooftop Monocrystalline Solar PV Array",
        category: "Clean Energy & Grid Decarbonization",
        area: `${data.solarM2} m² (${data.solarKwp} kWp DC Capacity)`,
        runoffC: "C = 0.90 (Structural roof catchment directed to RWH filtration)",
        ecoFunc: `Generates ~${Math.round(data.solarKwp * 1450).toLocaleString()} kWh/yr of green electricity. Offsets ~${Math.round(data.solarKwp * 1.45 * 0.82)} tonnes CO₂e/yr while providing solar shading.`,
        capex: `₹ ${(data.solarKwp * 0.62).toFixed(1)} Lakhs (@ ₹62,000/kWp turnkey installed)`,
        opex: `₹ ${Math.round(data.solarKwp * 450).toLocaleString()} / year (Quarterly dusting & electrical inverter audit)`,
        standard: "NBC 2016 Part 11 Cl 4.3; CEA Technical Standards for Grid Connectivity; MNRE Guidelines"
      },
      green_roof: {
        badge: "🌿 NATURE-BASED INFRASTRUCTURE",
        badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
        name: "Extensive Sedum Vegetative Terrace Mat",
        category: "Nature-Based Sponge Architecture",
        area: `${data.greenRoofM2.toLocaleString()} m² (120mm engineered multi-layer substrate)`,
        runoffC: "C = 0.30 (70% retention of first-flush rainfall events)",
        ecoFunc: "Mitigates urban heat island effect, lowering rooftop membrane temperatures by 14–18°C. Extends roof waterproofing lifespan by 2.5× while providing urban biodiversity corridors.",
        capex: `₹ ${((data.greenRoofM2 * 1850) / 100000).toFixed(1)} Lakhs (@ ₹1,850/m² modular drainage & sedum mat)`,
        opex: `₹ ${Math.round(data.greenRoofM2 * 65).toLocaleString()} / year (Semi-annual slow-release nutrition & weeding)`,
        standard: "NBC 2016 Part 11 Cl 5.2; German FLL Guidelines for Green Roof Design & Maintenance"
      },
      permeable: {
        badge: "🧱 SUSTAINABLE DRAINAGE (SuDS)",
        badgeColor: "bg-stone-200 text-stone-900 border-stone-400",
        name: "IRC:SP:63 Porous Interlocking Concrete Pavers (PICP)",
        category: "Sustainable Drainage Systems (SuDS)",
        area: `${data.permM2.toLocaleString()} m² (80mm paver blocks on 250mm open-graded stone reservoir)`,
        runoffC: "C = 0.20 (Reduces surface runoff surge by 78% vs standard RCC slab)",
        ecoFunc: "Recharges shallow aquifers directly from driveway/parking rainfall. Traps 85% of total suspended solids (TSS) and petroleum oils, completely preventing parking surface ponding.",
        capex: `₹ ${((data.permM2 * 1450) / 100000).toFixed(1)} Lakhs (@ ₹1,450/m² complete installation)`,
        opex: `₹ ${Math.round(data.permM2 * 25).toLocaleString()} / year (Annual regenerative vacuum sweeping)`,
        standard: "IRC:SP:63-2018 Guidelines for Interlocking Concrete Block Pavement; CPWD SuDS Guidelines"
      },
      bioswale: {
        badge: "🌧️ BIORETENTION BASIN",
        badgeColor: "bg-teal-100 text-teal-900 border-teal-300",
        name: "Engineered Bioretention Bioswale & Infiltration Basin",
        category: "Urban Hydrology & Aquifer Replenishment",
        area: `${data.rainGardenM2.toLocaleString()} m² (Vegetated parabolic swale with check dams)`,
        runoffC: "C = 0.15 (85% volumetric attenuation of peak overland flows)",
        ecoFunc: "Delays peak storm arrival time of concentration by +35 minutes. Biologically filters vehicular heavy metals and nutrients via hyperaccumulating native wetland reeds.",
        capex: `₹ ${((data.rainGardenM2 * 950) / 100000).toFixed(1)} Lakhs (@ ₹950/m² including grading & native grasses)`,
        opex: `₹ ${Math.round(data.rainGardenM2 * 45).toLocaleString()} / year (Pre-monsoon trash clearance & desilting)`,
        standard: "MoHUA Urban Drainage Manual; Central Ground Water Board (CGWB) Rainwater Harvesting Directives"
      },
      rwh: {
        badge: "💧 CLOSED-LOOP WATER",
        badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
        name: "Subsurface Modular Rainwater Cistern & Dual Filtration",
        category: "Closed-Loop Water Conservation",
        area: `${(data.tankL / 1000).toFixed(0)} kL (${data.tankL.toLocaleString()} Liters Reinforced Cistern)`,
        runoffC: "C = 0.05 (Direct diversion of roof storm volume via vortex sediment filter)",
        ecoFunc: "Supplies campus toilet flushing and landscape irrigation needs throughout 45-day monsoon dry spells, dramatically reducing municipal water dependency.",
        capex: `₹ ${((data.tankL * 7.5) / 100000).toFixed(1)} Lakhs (@ ₹7.5 / Liter capacity turnkey RCC)`,
        opex: `₹ ${Math.round(data.tankL * 0.15).toLocaleString()} / year (Semi-annual vortex filter wash & pump servicing)`,
        standard: "NBC 2016 Part 9 Section 1 Cl 4.4; CGWB Model Bill for Rainwater Harvesting"
      },
      biodiversity: {
        badge: "🌲 URBAN FORESTRY",
        badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
        name: "High-Density Native Miyawaki Micro-Forest & Buffer",
        category: "Urban Ecology & Thermal Microclimate",
        area: `${data.miyawakiM2.toLocaleString()} m² (${data.treesPlanted} Native Saplings)`,
        runoffC: "C = 0.10 (Deep organic mulch sponge absorption)",
        ecoFunc: "Grows 10× faster and sequesters 30× more carbon than traditional monoculture landscaping. Lowers localized ambient air temperature by 2.6°C via intense evapotranspiration.",
        capex: `₹ ${((data.treesPlanted * 750) / 100000).toFixed(1)} Lakhs (@ ₹750/sapling with 2-yr growth warranty)`,
        opex: `₹ ${Math.round(data.treesPlanted * 120).toLocaleString()} / year (Biological composting & initial drip irrigation)`,
        standard: "Maharashtra Tree Protection Act 1975; MoEFCC Urban Green Space Guidelines"
      },
      baseline: {
        badge: "⚠️ BASELINE DEFICIT",
        badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
        name: "Impermeable Concrete Hardscape & Heat Sink Slab",
        category: "Pre-Intervention Baseline Deficit",
        area: `${data.hardscape.toLocaleString()} m² Unmitigated RCC Paving & Asphalt`,
        runoffC: "C = 0.90 (90% immediate flash storm runoff into municipal gutters)",
        ecoFunc: "Zero biological or retention function. Albedo < 0.18 results in extreme surface heat (up to 48°C), intensifying the Urban Heat Island effect and stressing downstream drainage.",
        capex: "₹ 0.0 Lakhs (Existing baseline state requiring ecological remediation)",
        opex: "High indirect flood damage & municipal stormwater cess exposure",
        standard: "Fails NBC 2016 Part 11 Sustainability & GRIHA Water Sensitive Urban Design criteria"
      }
    };

    const d = elementsData[this.selectedElement] || elementsData.solar;

    return `
      <div class="space-y-3 text-xs text-stone-700 animate-fade-in">
        <div class="border-b border-stone-200 pb-2.5 space-y-1">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${d.badgeColor}">
              ${d.badge}
            </span>
            <span class="text-[10px] font-mono text-stone-400 font-semibold">ELEMENT INSPECTION</span>
          </div>
          <h3 class="text-sm font-bold text-[#123C32] font-serif leading-tight">
            ${d.name}
          </h3>
          <p class="text-[11px] text-[#607067]">
            ${d.category}
          </p>
        </div>

        <div class="p-2.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
          <div class="flex justify-between items-center text-[10px] uppercase font-bold text-stone-500">
            <span>Dimension</span>
            <span>Runoff Coeff (C)</span>
          </div>
          <div class="flex justify-between items-baseline font-mono text-xs font-bold text-stone-900">
            <span>${d.area}</span>
            <span class="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">${d.runoffC.split(' ')[0]} ${d.runoffC.split(' ')[1] || ''}</span>
          </div>
        </div>

        <div class="space-y-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Ecological Impact:</span>
          <p class="text-[11px] text-stone-700 leading-relaxed bg-white p-2.5 rounded-xl border border-stone-200">
            ${d.ecoFunc}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 bg-stone-50 rounded-xl border border-stone-200">
            <span class="text-stone-400 block text-[9px] uppercase font-bold">Estimated CapEx</span>
            <strong class="text-stone-900 font-mono">${d.capex}</strong>
          </div>
          <div class="p-2 bg-stone-50 rounded-xl border border-stone-200">
            <span class="text-stone-400 block text-[9px] uppercase font-bold">Annual OpEx</span>
            <strong class="text-stone-900 font-mono">${d.opex}</strong>
          </div>
        </div>

        <div class="pt-1 text-[10px] text-stone-500">
          <strong>Code:</strong> ${d.standard}
        </div>
      </div>
    `;
  },

  updateInspectionPanel() {
    const card = document.getElementById("element-inspection-card");
    if (!card) return;
    const data = this.getSpatialParams(window.App?.currentProject, window.App?.calculations);
    card.innerHTML = this.getInspectionCardHtml(data);
  },

  // High-Resolution Procedural Texture Generator
  _createTextures() {
    if (this._three.textures.initialized) return;

    // 1. Natural Botanical Lawn Grass Texture (Fine micro-stippling)
    const lawnCanvas = document.createElement("canvas");
    lawnCanvas.width = 512;
    lawnCanvas.height = 512;
    const lCtx = lawnCanvas.getContext("2d");
    lCtx.fillStyle = "#2a5f36";
    lCtx.fillRect(0, 0, 512, 512);
    // Subtle organic grass blade and soil dapple
    for (let i = 0; i < 40000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random();
      lCtx.fillStyle = r > 0.6 ? "#387847" : (r > 0.3 ? "#234e2c" : "#1e4426");
      lCtx.fillRect(x, y, 1.5, 2.5);
    }
    const lawnTex = new THREE.CanvasTexture(lawnCanvas);
    lawnTex.wrapS = THREE.RepeatWrapping;
    lawnTex.wrapT = THREE.RepeatWrapping;
    lawnTex.repeat.set(8, 8);
    this._three.textures.lawn = lawnTex;

    // 2. Permeable Interlocking Pavers (PICP) Texture with Parking Lines & EV Badge
    const paverCanvas = document.createElement("canvas");
    paverCanvas.width = 512;
    paverCanvas.height = 512;
    const pCtx = paverCanvas.getContext("2d");
    pCtx.fillStyle = "#d4d1cb";
    pCtx.fillRect(0, 0, 512, 512);
    // Fine aggregate noise
    for (let i = 0; i < 8000; i++) {
      pCtx.fillStyle = Math.random() > 0.5 ? "#b8b4ad" : "#e3e0db";
      pCtx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    // Interlocking block grid joints
    pCtx.strokeStyle = "#44403c";
    pCtx.lineWidth = 2.5;
    const bW = 64;
    const bH = 32;
    for (let y = 0; y <= 512; y += bH) {
      pCtx.beginPath();
      pCtx.moveTo(0, y);
      pCtx.lineTo(512, y);
      pCtx.stroke();
      const shift = ((y / bH) % 2 === 0) ? 0 : bW / 2;
      for (let x = shift; x <= 512; x += bW) {
        pCtx.beginPath();
        pCtx.moveTo(x, y);
        pCtx.lineTo(x, y + bH);
        pCtx.stroke();
      }
    }
    const paverTex = new THREE.CanvasTexture(paverCanvas);
    paverTex.wrapS = THREE.RepeatWrapping;
    paverTex.wrapT = THREE.RepeatWrapping;
    paverTex.repeat.set(6, 4);
    this._three.textures.paver = paverTex;

    // 3. Fine-Aggregate Bituminous Asphalt Road Texture
    const asphCanvas = document.createElement("canvas");
    asphCanvas.width = 512;
    asphCanvas.height = 512;
    const aCtx = asphCanvas.getContext("2d");
    aCtx.fillStyle = "#252830";
    aCtx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 15000; i++) {
      aCtx.fillStyle = Math.random() > 0.5 ? "#1b1d22" : "#343842";
      aCtx.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5);
    }
    const asphTex = new THREE.CanvasTexture(asphCanvas);
    asphTex.wrapS = THREE.RepeatWrapping;
    asphTex.wrapT = THREE.RepeatWrapping;
    asphTex.repeat.set(6, 6);
    this._three.textures.asphalt = asphTex;

    // 4. Honed Architectural Limestone Facade Panels with Reveal Joints
    const limeCanvas = document.createElement("canvas");
    limeCanvas.width = 512;
    limeCanvas.height = 512;
    const lmCtx = limeCanvas.getContext("2d");
    lmCtx.fillStyle = "#edebe6";
    lmCtx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 6000; i++) {
      lmCtx.fillStyle = Math.random() > 0.5 ? "#dedad2" : "#f7f5f0";
      lmCtx.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5);
    }
    // Horizontal and vertical expansion reveals
    lmCtx.strokeStyle = "#8c857b";
    lmCtx.lineWidth = 3;
    for (let y = 128; y < 512; y += 128) {
      lmCtx.beginPath();
      lmCtx.moveTo(0, y);
      lmCtx.lineTo(512, y);
      lmCtx.stroke();
    }
    for (let x = 256; x < 512; x += 256) {
      lmCtx.beginPath();
      lmCtx.moveTo(x, 0);
      lmCtx.lineTo(x, 512);
      lmCtx.stroke();
    }
    const limeTex = new THREE.CanvasTexture(limeCanvas);
    limeTex.wrapS = THREE.RepeatWrapping;
    limeTex.wrapT = THREE.RepeatWrapping;
    limeTex.repeat.set(4, 2);
    this._three.textures.limestone = limeTex;

    // 5. Monocrystalline Photovoltaic Silicon Cells with Busbars
    const solCanvas = document.createElement("canvas");
    solCanvas.width = 512;
    solCanvas.height = 512;
    const sCtx = solCanvas.getContext("2d");
    sCtx.fillStyle = "#081326";
    sCtx.fillRect(0, 0, 512, 512);
    const cellW = 512 / 6;
    const cellH = 512 / 6;
    sCtx.strokeStyle = "#ffffff";
    sCtx.lineWidth = 1;
    // Cell grid
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        sCtx.strokeRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2);
      }
    }
    // Silver Busbar lines
    sCtx.strokeStyle = "#94a3b8";
    sCtx.lineWidth = 1.8;
    for (let i = 1; i < 6; i++) {
      sCtx.beginPath();
      sCtx.moveTo(0, i * cellH);
      sCtx.lineTo(512, i * cellH);
      sCtx.stroke();
    }
    const solTex = new THREE.CanvasTexture(solCanvas);
    solTex.wrapS = THREE.RepeatWrapping;
    solTex.wrapT = THREE.RepeatWrapping;
    solTex.repeat.set(3, 4);
    this._three.textures.solar = solTex;

    // 6. Multi-species Sedum Succulent Green Roof Mat
    const sedCanvas = document.createElement("canvas");
    sedCanvas.width = 512;
    sedCanvas.height = 512;
    const sdCtx = sedCanvas.getContext("2d");
    sdCtx.fillStyle = "#275c34";
    sdCtx.fillRect(0, 0, 512, 512);
    const sedHues = ["#387d46", "#1e4c29", "#b45309", "#4d7c0f", "#15803d"];
    for (let i = 0; i < 500; i++) {
      const cx = Math.random() * 512;
      const cy = Math.random() * 512;
      const rad = 4 + Math.random() * 12;
      sdCtx.fillStyle = sedHues[Math.floor(Math.random() * sedHues.length)];
      sdCtx.beginPath();
      sdCtx.arc(cx, cy, rad, 0, Math.PI * 2);
      sdCtx.fill();
    }
    const sedTex = new THREE.CanvasTexture(sedCanvas);
    sedTex.wrapS = THREE.RepeatWrapping;
    sedTex.wrapT = THREE.RepeatWrapping;
    sedTex.repeat.set(6, 4);
    this._three.textures.sedum = sedTex;

    // 7. Architectural Teak Wood Slats
    const woodCanvas = document.createElement("canvas");
    woodCanvas.width = 256;
    woodCanvas.height = 256;
    const wCtx = woodCanvas.getContext("2d");
    wCtx.fillStyle = "#5c3d28";
    wCtx.fillRect(0, 0, 256, 256);
    wCtx.strokeStyle = "#2e1c12";
    wCtx.lineWidth = 2;
    for (let y = 0; y <= 256; y += 16) {
      wCtx.beginPath();
      wCtx.moveTo(0, y);
      wCtx.lineTo(256, y);
      wCtx.stroke();
    }
    const woodTex = new THREE.CanvasTexture(woodCanvas);
    woodTex.wrapS = THREE.RepeatWrapping;
    woodTex.wrapT = THREE.RepeatWrapping;
    woodTex.repeat.set(2, 6);
    this._three.textures.wood = woodTex;

    this._three.textures.initialized = true;
  },

  // Initialize Photorealistic Three.js Scene
  initThreeScene(project, calculations) {
    if (typeof THREE === "undefined") {
      console.warn("Three.js not loaded.");
      return;
    }

    const canvasContainer = document.getElementById("site3d-canvas-mount");
    if (!canvasContainer) return;

    this.destroy3D();
    this._createTextures();

    const width = canvasContainer.clientWidth || 800;
    const height = canvasContainer.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd9e8f5); // Soft architectural daylight sky
    scene.fog = new THREE.Fog(0xd9e8f5, 110, 320);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 600);
    const data = this.getSpatialParams(project, calculations);

    // Isometric Hero position adapted to plot dimensions
    camera.position.set(data.plotWidthM * 0.82, Math.max(26, data.plotDepthM * 0.70), data.plotDepthM * 0.95);

    // 3. Renderer with ACESFilmic PBR tone mapping & soft shadow maps
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    canvasContainer.appendChild(renderer.domElement);

    // 4. Photorealistic Architectural Lighting
    // Ambient / Hemisphere light: sky daylight from above, soft grass bounce from below
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x1b3b2b, 0.75);
    hemiLight.position.set(0, 90, 0);
    scene.add(hemiLight);

    // Primary Directional Sun Light with High-Resolution Soft Shadow
    const sunLight = new THREE.DirectionalLight(0xfffbf0, 1.45);
    sunLight.position.set(40, 50, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 350;
    const dDist = Math.max(50, Math.max(data.plotWidthM, data.plotDepthM) * 0.75);
    sunLight.shadow.camera.left = -dDist;
    sunLight.shadow.camera.right = dDist;
    sunLight.shadow.camera.top = dDist;
    sunLight.shadow.camera.bottom = -dDist;
    sunLight.shadow.bias = -0.0002;
    scene.add(sunLight);

    // Subtle Secondary Fill Light
    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.35);
    fillLight.position.set(-35, 25, -30);
    scene.add(fillLight);

    // 5. OrbitControls
    let controls = null;
    if (typeof THREE.OrbitControls !== "undefined") {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = this._three.autoRotate;
      controls.autoRotateSpeed = 0.55;
      controls.maxPolarAngle = Math.PI * 0.48; // Prevent going underneath ground
      controls.minDistance = 6;
      controls.maxDistance = 220;
      controls.target.set(0, Math.min(6, data.floors * 1.6), 0);
    }

    // 6. Build 1:1 Metric 3D Geometry
    const modelGroup = new THREE.Group();
    this.buildSiteGeometry(modelGroup, project, calculations);
    scene.add(modelGroup);

    // 7. Store references
    this._three.scene = scene;
    this._three.camera = camera;
    this._three.renderer = renderer;
    this._three.controls = controls;
    this._three.container = canvasContainer;
    this._three.sunLight = sunLight;
    this._three.ambientLight = hemiLight;
    this._three.fillLight = fillLight;

    if (this._three.sunTime !== 12) {
      this.setSunTime(this._three.sunTime);
    }

    // 8. Animation Loop
    const animate = () => {
      this._three.animId = requestAnimationFrame(animate);
      if (this._three.controls) {
        this._three.controls.update();
      }

      // Rain animation
      if (this._three.rainActive && this._three.rainGeo) {
        const pos = this._three.rainGeo.attributes.position.array;
        for (let i = 1; i < pos.length; i += 3) {
          pos[i] -= 1.15;
          if (pos[i] < 0) pos[i] = 45;
        }
        this._three.rainGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Listener
    this._three.onResize = () => {
      if (!this._three.container || !this._three.camera || !this._three.renderer) return;
      const w = this._three.container.clientWidth;
      const h = this._three.container.clientHeight;
      this._three.camera.aspect = w / h;
      this._three.camera.updateProjectionMatrix();
      this._three.renderer.setSize(w, h);
    };
    window.addEventListener("resize", this._three.onResize);
  },

  // Builds 1:1 metric procedural 3D model matching exact site dimensions
  buildSiteGeometry(group, project, calculations) {
    const isBaseline = this.scenario === 'baseline';
    const data = this.getSpatialParams(project, calculations);
    const tex = this._three.textures;

    // Reset interior lights list
    this._three.interiorLights = [];

    // Exact Ground Plot Dimensions (1 unit = 1 meter)
    const groundW = data.plotWidthM;
    const groundD = data.plotDepthM;

    // --- 1. SITE BASE TERRAIN ---
    // Soft Ambient Contact Shadow Underneath Site Base
    const shadowGeo = new THREE.PlaneGeometry(groundW * 1.3, groundD * 1.3);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.32;
    group.add(shadowMesh);

    // Raised Ground Plinth Base
    const baseGeo = new THREE.BoxGeometry(groundW, 0.3, groundD);
    const baseMat = new THREE.MeshStandardMaterial({
      map: isBaseline ? null : tex.lawn,
      color: isBaseline ? 0x64748b : 0xffffff,
      roughness: isBaseline ? 0.95 : 0.85,
      metalness: 0.02
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.15;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // Beveled Granite Curb Boundary Line
    const curbGeo = new THREE.BoxGeometry(groundW + 0.3, 0.2, groundD + 0.3);
    const curbMat = new THREE.MeshStandardMaterial({
      color: isBaseline ? 0xef4444 : 0x78716c,
      roughness: 0.85
    });
    const curb = new THREE.Mesh(curbGeo, curbMat);
    curb.position.y = -0.22;
    curb.receiveShadow = true;
    group.add(curb);

    // Front Public Access Road with Asphalt Texture and Curbs
    const roadW = groundW * 1.4;
    const roadD = 8.5;
    const roadZ = (groundD / 2) + (roadD / 2) + 0.4;
    const roadGeo = new THREE.BoxGeometry(roadW, 0.18, roadD);
    const roadMat = new THREE.MeshStandardMaterial({
      map: tex.asphalt,
      roughness: 0.92,
      metalness: 0.05
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.position.set(0, -0.21, roadZ);
    road.receiveShadow = true;
    group.add(road);

    // Road White Center Dashed Markings
    for (let rm = -3; rm <= 3; rm++) {
      const stripeGeo = new THREE.PlaneGeometry(3.5, 0.2);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(rm * 6.5, -0.11, roadZ);
      group.add(stripe);
    }

    // Pedestrian Zebra Crosswalk at Main Entrance
    for (let zx = -4; zx <= 4; zx++) {
      const zebra = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 3.8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      zebra.rotation.x = -Math.PI / 2;
      zebra.position.set(zx * 0.9, -0.11, roadZ - 1.8);
      group.add(zebra);
    }

    // --- 2. MAIN BUILDING: MODERN ARCHITECTURAL MASSING ---
    const bldgW = data.bldgWidthM;
    const bldgD = data.bldgDepthM;
    const floorH = 3.6; // 3.6 meters standard storey height
    const bldgH = data.floors * floorH;
    const bldgZ = -((groundD - bldgD) * 0.20); // North setback

    // Elevated Building Foundation Plinth
    const plinthH = 0.35;
    const plinthGeo = new THREE.BoxGeometry(bldgW + 1.2, plinthH, bldgD + 1.2);
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.7 });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.set(0, plinthH / 2, bldgZ);
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    group.add(plinth);

    // Architectural Core Mass
    const coreGeo = new THREE.BoxGeometry(bldgW, bldgH, bldgD);
    const coreMat = new THREE.MeshStandardMaterial({
      map: isBaseline ? null : tex.limestone,
      color: isBaseline ? 0x475569 : 0xffffff,
      roughness: isBaseline ? 0.75 : 0.45,
      metalness: 0.05
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, plinthH + (bldgH / 2), bldgZ);
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    group.add(coreMesh);

    // Storey-by-Storey Floor Slabs, Window Glazing Ribbons & Mullions
    for (let f = 0; f < data.floors; f++) {
      const slabY = plinthH + f * floorH;

      // Cantilevered Architectural Floor Slab with Crisp Reveal
      const slabGeo = new THREE.BoxGeometry(bldgW + 0.7, 0.32, bldgD + 0.7);
      const slabMat = new THREE.MeshStandardMaterial({
        color: isBaseline ? 0x334155 : 0xf5f5f4,
        roughness: 0.4
      });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.set(0, slabY + 0.16, bldgZ);
      slab.castShadow = true;
      group.add(slab);

      // Floor-to-Ceiling High-Performance Double Glazed Curtain Wall
      const winH = floorH * 0.62;
      const winGeo = new THREE.BoxGeometry(bldgW + 0.16, winH, bldgD + 0.16);
      const winMat = new THREE.MeshStandardMaterial({
        color: isBaseline ? 0x334155 : 0x0284c7,
        roughness: 0.05,
        metalness: 0.92,
        transparent: true,
        opacity: isBaseline ? 0.5 : 0.75
      });
      const win = new THREE.Mesh(winGeo, winMat);
      win.position.set(0, slabY + 0.32 + (winH / 2), bldgZ);
      group.add(win);

      // Vertical Anodized Dark Aluminum Mullion Fins (every 3 meters)
      const numMullions = Math.max(3, Math.floor(bldgW / 3.0));
      for (let m = -numMullions; m <= numMullions; m++) {
        const mx = (m / numMullions) * (bldgW / 2);
        const mullion = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, winH, 0.14),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.85 })
        );
        mullion.position.set(mx, slabY + 0.32 + (winH / 2), bldgZ + (bldgD / 2) + 0.09);
        group.add(mullion);
      }

      // Interior Architectural Room Light (for evening illumination)
      if (!isBaseline) {
        const roomLight = new THREE.PointLight(0xfef08a, 0.0, 18);
        roomLight.position.set(0, slabY + 1.8, bldgZ);
        group.add(roomLight);
        this._three.interiorLights.push(roomLight);
      }
    }

    // Ground Floor Entrance Canopy / Portico
    const canopyW = Math.min(8.0, bldgW * 0.4);
    const canopyD = 3.2;
    const canopyH = 0.22;
    const canopyGeo = new THREE.BoxGeometry(canopyW, canopyH, canopyD);
    const canopyMat = new THREE.MeshStandardMaterial({
      map: isBaseline ? null : tex.wood,
      color: isBaseline ? 0x334155 : 0xffffff,
      roughness: 0.5
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, plinthH + 3.2, bldgZ + (bldgD / 2) + (canopyD / 2));
    canopy.castShadow = true;
    group.add(canopy);

    // Canopy Structural Steel Support Columns
    [-canopyW / 2 + 0.3, canopyW / 2 - 0.3].forEach(cx => {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.9 })
      );
      col.position.set(cx, plinthH + 1.6, bldgZ + (bldgD / 2) + canopyD - 0.4);
      col.castShadow = true;
      group.add(col);
    });

    // Real Architectural Parapet: 4 Perimeter Walls (Leaves central roof deck open for solar & green roof)
    const parapetH = 0.65;
    const wallThick = 0.35;
    const parapetMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.55 });

    // North wall
    const pNorth = new THREE.Mesh(new THREE.BoxGeometry(bldgW + 0.4, parapetH, wallThick), parapetMat);
    pNorth.position.set(0, plinthH + bldgH + (parapetH / 2), bldgZ - (bldgD / 2) + (wallThick / 2));
    pNorth.castShadow = true;
    group.add(pNorth);
    // South wall
    const pSouth = new THREE.Mesh(new THREE.BoxGeometry(bldgW + 0.4, parapetH, wallThick), parapetMat);
    pSouth.position.set(0, plinthH + bldgH + (parapetH / 2), bldgZ + (bldgD / 2) - (wallThick / 2));
    pSouth.castShadow = true;
    group.add(pSouth);
    // West wall
    const pWest = new THREE.Mesh(new THREE.BoxGeometry(wallThick, parapetH, bldgD - (wallThick * 2)), parapetMat);
    pWest.position.set(-(bldgW / 2) + (wallThick / 2), plinthH + bldgH + (parapetH / 2), bldgZ);
    pWest.castShadow = true;
    group.add(pWest);
    // East wall
    const pEast = new THREE.Mesh(new THREE.BoxGeometry(wallThick, parapetH, bldgD - (wallThick * 2)), parapetMat);
    pEast.position.set((bldgW / 2) - (wallThick / 2), plinthH + bldgH + (parapetH / 2), bldgZ);
    pEast.castShadow = true;
    group.add(pEast);

    // Roof Terrace Deck Floor Slab
    const roofFloor = new THREE.Mesh(
      new THREE.BoxGeometry(bldgW - 0.6, 0.1, bldgD - 0.6),
      new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.6 })
    );
    roofFloor.position.set(0, plinthH + bldgH + 0.05, bldgZ);
    roofFloor.receiveShadow = true;
    group.add(roofFloor);

    // Rooftop Elevator Overrun / Penthouse Core
    const pentW = Math.max(3.5, bldgW * 0.22);
    const pentD = Math.max(3.5, bldgD * 0.22);
    const pentH = 2.6;
    const penthouse = new THREE.Mesh(
      new THREE.BoxGeometry(pentW, pentH, pentD),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
    );
    penthouse.position.set(0, plinthH + bldgH + (pentH / 2), bldgZ);
    penthouse.castShadow = true;
    group.add(penthouse);

    const roofY = plinthH + bldgH + 0.1;
    const roofUsableW = bldgW - 1.4;
    const roofUsableD = bldgD - 1.4;

    // --- 3. ROOFTOP ECO-INTERVENTIONS (PROPOSED) VS BARE RCC (BASELINE) ---
    if (!isBaseline) {
      const grRatio = Math.min(0.85, Math.max(0, data.greenRoofM2 / Math.max(1, data.roofArea)));
      const pvRatio = Math.min(0.85, Math.max(0, data.solarM2 / Math.max(1, data.roofArea)));
      const sumRatio = Math.max(0.1, grRatio + pvRatio);

      const grWidth = this.layers.green_roof ? Math.max(3.5, roofUsableW * (grRatio / sumRatio)) : 0;
      const pvWidth = this.layers.solar_pv ? Math.max(3.5, roofUsableW - grWidth - 0.6) : 0;

      // Extensive Sedum Vegetative Green Roof (West Side)
      if (this.layers.green_roof && grWidth > 0) {
        const grX = -(roofUsableW / 2) + (grWidth / 2);
        
        // Recessed Soil Tray
        const grGeo = new THREE.BoxGeometry(grWidth - 0.4, 0.22, roofUsableD);
        const grMat = new THREE.MeshStandardMaterial({
          map: tex.sedum,
          roughness: 0.88,
          metalness: 0.02
        });
        const greenRoof = new THREE.Mesh(grGeo, grMat);
        greenRoof.position.set(grX, roofY + 0.11, bldgZ);
        greenRoof.receiveShadow = true;
        group.add(greenRoof);

        // Gravel Ballast Drainage Edge Border
        const borderGeo = new THREE.BoxGeometry(grWidth - 0.2, 0.15, roofUsableD + 0.2);
        const borderMat = new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.95 });
        const border = new THREE.Mesh(borderGeo, borderMat);
        border.position.set(grX, roofY + 0.05, bldgZ);
        group.add(border);
      }

      // Monocrystalline Solar PV Array with Racking Legs (East Side)
      if (this.layers.solar_pv && pvWidth > 0) {
        const pvX = (roofUsableW / 2) - (pvWidth / 2);
        const numRows = Math.max(2, Math.floor(roofUsableD / 2.2));
        const numCols = Math.max(2, Math.floor((pvWidth - 0.8) / 1.6));

        for (let r = 0; r < numRows; r++) {
          const rz = bldgZ - (roofUsableD / 2) + 1.2 + r * 2.0;
          for (let c = 0; c < numCols; c++) {
            const rx = pvX - (pvWidth / 2) + 0.9 + c * 1.5;

            // Structural Aluminum Racking Legs (Front 0.2m, Rear 0.55m -> 15° Solar Tilt)
            const legMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3, metalness: 0.85 });
            const legF = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 6), legMat);
            legF.position.set(rx, roofY + 0.11, rz + 0.4);
            group.add(legF);

            const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.52, 6), legMat);
            legR.position.set(rx, roofY + 0.26, rz - 0.4);
            group.add(legR);

            // Tilted PV Panel Module
            const panelGeo = new THREE.BoxGeometry(1.35, 0.04, 0.95);
            const panelMat = new THREE.MeshStandardMaterial({
              map: tex.solar,
              roughness: 0.15,
              metalness: 0.9
            });
            const panel = new THREE.Mesh(panelGeo, panelMat);
            panel.rotation.x = -0.26; // ~15° solar tilt
            panel.position.set(rx, roofY + 0.32, rz);
            panel.castShadow = true;
            group.add(panel);
          }
        }
      }
    } else {
      // Baseline Barren Concrete Roof Slab with Severe Thermal Heat Sink
      const bareRoof = new THREE.Mesh(
        new THREE.BoxGeometry(roofUsableW, 0.12, roofUsableD),
        new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.95 })
      );
      bareRoof.position.set(0, roofY + 0.06, bldgZ);
      group.add(bareRoof);

      // Thermal Heat Gain Warning Overlay
      const heatOverlay = new THREE.Mesh(
        new THREE.PlaneGeometry(roofUsableW * 0.96, roofUsableD * 0.96),
        new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.25 })
      );
      heatOverlay.rotation.x = -Math.PI / 2;
      heatOverlay.position.set(0, roofY + 0.15, bldgZ);
      group.add(heatOverlay);
    }

    // --- 4. PERMEABLE POROUS PAVERS & PARKING APRON ---
    const paverW = data.paverWidthM;
    const paverD = data.paverDepthM;
    const paverZ = bldgZ + (bldgD / 2) + (paverD / 2) + 1.2;

    if (this.layers.permeable_paving || isBaseline) {
      const paverGeo = new THREE.BoxGeometry(paverW, 0.12, paverD);
      const paverMat = new THREE.MeshStandardMaterial({
        map: isBaseline ? null : tex.paver,
        color: isBaseline ? 0x64748b : 0xffffff,
        roughness: isBaseline ? 0.94 : 0.65,
        metalness: 0.05
      });
      const paverMesh = new THREE.Mesh(paverGeo, paverMat);
      paverMesh.position.set(0, 0.06, paverZ);
      paverMesh.receiveShadow = true;
      group.add(paverMesh);

      // Striped Parking Divider Lines
      if (!isBaseline) {
        const numBays = Math.min(8, Math.max(3, Math.floor(paverW / 3.2)));
        for (let b = -Math.floor(numBays / 2); b <= Math.floor(numBays / 2); b++) {
          const bx = b * 3.0;
          const pLine = new THREE.Mesh(
            new THREE.PlaneGeometry(0.12, Math.min(5.0, paverD * 0.65)),
            new THREE.MeshBasicMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.85 })
          );
          pLine.rotation.x = -Math.PI / 2;
          pLine.position.set(bx, 0.13, paverZ);
          group.add(pLine);
        }

        // Realistic Modern Electric Vehicles for Human Scale Reference
        if (this.layers.cars) {
          this.addScaleCar(group, -4.5, paverZ, 0x0284c7); // Deep Blue EV Sedan
          this.addScaleCar(group, 4.5, paverZ, 0xf1f5f9);  // Pearl White EV SUV
        }
      }
    }

    // --- 5. ENGINEERED BIORETENTION BIOSWALE (SuDS) ---
    if (!isBaseline && this.layers.bioswales) {
      const bioW = Math.min(groundW * 0.84, paverW * 0.95);
      const bioD = Math.max(2.2, Math.min(5.0, data.rainGardenM2 / Math.max(1, bioW)));
      const bioZ = paverZ + (paverD / 2) + (bioD / 2) + 0.8;

      if (bioZ < (groundD / 2) - 0.5) {
        // Depression Channel
        const bioGeo = new THREE.BoxGeometry(bioW, 0.24, bioD);
        const bioMat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.08,
          metalness: 0.75,
          transparent: true,
          opacity: 0.82
        });
        const bioswale = new THREE.Mesh(bioGeo, bioMat);
        bioswale.position.set(0, 0.08, bioZ);
        group.add(bioswale);

        // River Stones / Cobbles Along Banks
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.95 });
        for (let s = 0; s < 26; s++) {
          const sx = -(bioW / 2) + 1.2 + (s * ((bioW - 2.4) / 25));
          const sz = bioZ + ((s % 2 === 0) ? -bioD / 2 + 0.2 : bioD / 2 - 0.2);
          const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18 + (s % 3) * 0.06, 0), stoneMat);
          stone.position.set(sx, 0.18, sz);
          stone.castShadow = true;
          group.add(stone);
        }

        // Native Marsh Reeds
        const reedMat = new THREE.MeshStandardMaterial({ color: 0x2e663a, roughness: 0.8 });
        for (let r = 0; r < 20; r++) {
          const rx = -(bioW / 2) + 2.0 + (r * ((bioW - 4.0) / 19));
          const reed = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.9, 4), reedMat);
          reed.position.set(rx, 0.45, bioZ + ((r % 3 - 1) * 0.4));
          group.add(reed);
        }
      }
    }

    // --- 6. SUBSURFACE RAINWATER CISTERN (WEST SETBACK) ---
    if (!isBaseline && this.layers.water_rwh) {
      const tankSize = Math.max(3.2, Math.min(6.5, Math.cbrt(data.tankL / 1000) * 1.15));
      const tankX = -(groundW / 2) + (tankSize / 2) + 1.8;
      
      const tank = new THREE.Mesh(
        new THREE.BoxGeometry(tankSize, tankSize * 0.55, tankSize),
        new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.2, metalness: 0.8, transparent: true, opacity: 0.75 })
      );
      tank.position.set(tankX, (tankSize * 0.55) / 2, bldgZ);
      tank.castShadow = true;
      group.add(tank);

      // Downspout Pipe running from building roof down to cistern
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, bldgH, 8),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.8 })
      );
      pipe.position.set(-(bldgW / 2) - 0.1, plinthH + (bldgH / 2), bldgZ);
      group.add(pipe);
    }

    // --- 7. BOTANICAL 3D TREES & MIYAWAKI GROVE ---
    if (!isBaseline) {
      if (this.layers.biodiversity) {
        const treeCount = Math.min(18, Math.max(6, Math.round(data.treesPlanted / 5)));
        
        // East boundary Miyawaki dense micro-forest
        for (let t = 0; t < Math.ceil(treeCount * 0.65); t++) {
          const zPos = bldgZ - 4 + (t * (groundD * 0.65 / Math.ceil(treeCount * 0.65)));
          const xPos = (groundW / 2) - 3.2 - ((t % 2) * 2.2);
          if (zPos < (groundD / 2) - 2.5 && zPos > -(groundD / 2) + 2.5) {
            this.addRealisticTree(group, xPos, zPos, 2.2 + (t % 3) * 0.35, 0x1f5c2b);
          }
        }

        // West boundary buffer trees
        for (let t = 0; t < Math.floor(treeCount * 0.35); t++) {
          const zPos = bldgZ + 4 + (t * 4.0);
          const xPos = -(groundW / 2) + 3.2 + ((t % 2) * 2.0);
          if (zPos < (groundD / 2) - 2.5 && zPos > -(groundD / 2) + 2.5) {
            this.addRealisticTree(group, xPos, zPos, 2.0 + (t % 2) * 0.4, 0x2a7a3b);
          }
        }

        // Entrance Ornamental Tree
        this.addRealisticTree(group, -(bldgW / 2) - 2.0, (groundD / 2) - 4.0, 1.8, 0x3d854d);
      }

      // Modernist LED Light Bollards along walkways
      [[-2.0, paverZ + (paverD / 2) + 0.3], [2.0, paverZ + (paverD / 2) + 0.3], [bldgW / 2 + 1.2, bldgZ]].forEach(([bx, bz]) => {
        const bollard = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.85 })
        );
        bollard.position.set(bx, 0.35, bz);
        group.add(bollard);

        const glowCap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.052, 0.052, 0.08, 8),
          new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        glowCap.position.set(bx, 0.66, bz);
        group.add(glowCap);
      });
    } else {
      // Baseline Felled Tree Stumps
      const stumpCount = Math.min(10, Math.max(3, Math.round(data.treesRemoved / 2.5)));
      for (let s = 0; s < stumpCount; s++) {
        const zPos = bldgZ - 2 + (s * 3.5);
        const xPos = (groundW / 2) - 3.5 - ((s % 2) * 2.5);
        if (zPos < (groundD / 2) - 2.5) {
          this.addStump(group, xPos, zPos);
        }
      }
    }
  },

  // Realistic Scale Electric Car Model (Provides Intuitive Human Scale)
  addScaleCar(group, x, z, carColor = 0x0284c7) {
    const carGroup = new THREE.Group();

    // Car Body Chassis
    const bodyGeo = new THREE.BoxGeometry(2.1, 0.65, 4.4);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: carColor,
      roughness: 0.15,
      metalness: 0.85
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.52;
    body.castShadow = true;
    carGroup.add(body);

    // Cabin Greenhouse & Tinted Windshields
    const cabinGeo = new THREE.BoxGeometry(1.85, 0.6, 2.4);
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.05,
      metalness: 0.95
    });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 1.05, -0.2);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // 4 Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.24, 12);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    wheelGeo.rotateZ(Math.PI / 2);

    [[-1.0, 1.3], [1.0, 1.3], [-1.0, -1.3], [1.0, -1.3]].forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(wx, 0.32, wz);
      carGroup.add(wheel);
    });

    carGroup.position.set(x, 0.06, z);
    group.add(carGroup);
  },

  // Realistic Multi-Canopy 3D Tree with Fluted Trunk, Root Flare, Mulch Ring & Volumetric Foliage
  addRealisticTree(group, x, z, scale = 2.0, baseLeafColor = 0x245431) {
    const treeGroup = new THREE.Group();

    // Timber Mulch Bed at Base
    const mulchGeo = new THREE.CylinderGeometry(0.85 * scale, 1.05 * scale, 0.08, 12);
    const mulchMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.98 });
    const mulch = new THREE.Mesh(mulchGeo, mulchMat);
    mulch.position.y = 0.04;
    mulch.receiveShadow = true;
    treeGroup.add(mulch);

    // Tapered Fluted Bark Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.14 * scale, 0.28 * scale, 2.3 * scale, 8);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x4a3222,
      roughness: 0.95
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.15 * scale;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // Root Flare Base
    const rootGeo = new THREE.CylinderGeometry(0.28 * scale, 0.46 * scale, 0.35 * scale, 8);
    const rootMesh = new THREE.Mesh(rootGeo, trunkMat);
    rootMesh.position.y = 0.18 * scale;
    treeGroup.add(rootMesh);

    // 4 Overlapping Organic Foliage Clusters in Natural Tones (Rich Botanical Green)
    const foliageColors = [baseLeafColor, 0x2e6b3c, 0x1d4726, 0x397d49];
    
    // Lower main canopy cluster
    const c1Geo = new THREE.DodecahedronGeometry(1.35 * scale, 1);
    const c1Mat = new THREE.MeshStandardMaterial({ color: foliageColors[0], roughness: 0.88 });
    const c1 = new THREE.Mesh(c1Geo, c1Mat);
    c1.position.set(0, 2.4 * scale, 0);
    c1.scale.set(1.2, 0.82, 1.1);
    c1.rotation.set(0.2, 0.5, -0.1);
    c1.castShadow = true;
    treeGroup.add(c1);

    // Mid apex cluster
    const c2Geo = new THREE.DodecahedronGeometry(1.05 * scale, 1);
    const c2Mat = new THREE.MeshStandardMaterial({ color: foliageColors[1], roughness: 0.85 });
    const c2 = new THREE.Mesh(c2Geo, c2Mat);
    c2.position.set(0.18 * scale, 3.3 * scale, 0.12 * scale);
    c2.rotation.set(-0.3, 0.8, 0.2);
    c2.castShadow = true;
    treeGroup.add(c2);

    // Sub canopy crown
    const c3Geo = new THREE.DodecahedronGeometry(0.9 * scale, 1);
    const c3Mat = new THREE.MeshStandardMaterial({ color: foliageColors[2], roughness: 0.85 });
    const c3 = new THREE.Mesh(c3Geo, c3Mat);
    c3.position.set(-0.3 * scale, 2.9 * scale, -0.22 * scale);
    c3.rotation.set(0.4, -0.4, 0.3);
    c3.castShadow = true;
    treeGroup.add(c3);

    // Top sun highlight cluster
    const c4Geo = new THREE.DodecahedronGeometry(0.65 * scale, 1);
    const c4Mat = new THREE.MeshStandardMaterial({ color: foliageColors[3], roughness: 0.82 });
    const c4 = new THREE.Mesh(c4Geo, c4Mat);
    c4.position.set(0.1 * scale, 3.9 * scale, -0.1 * scale);
    c4.castShadow = true;
    treeGroup.add(c4);

    treeGroup.position.set(x, 0, z);
    group.add(treeGroup);
  },

  addStump(group, x, z) {
    const stumpGeo = new THREE.CylinderGeometry(0.4, 0.5, 0.45, 8);
    const stumpMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.95 });
    const stump = new THREE.Mesh(stumpGeo, stumpMat);
    stump.position.set(x, 0.22, z);
    stump.castShadow = true;
    group.add(stump);

    // Red X Statutory Deficit Marker
    const markGeo = new THREE.BoxGeometry(1.0, 0.06, 0.18);
    const markMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const mark1 = new THREE.Mesh(markGeo, markMat);
    mark1.position.set(x, 0.48, z);
    mark1.rotation.y = Math.PI / 4;
    group.add(mark1);

    const mark2 = new THREE.Mesh(markGeo, markMat);
    mark2.position.set(x, 0.48, z);
    mark2.rotation.y = -Math.PI / 4;
    group.add(mark2);
  },

  // Instant Camera Presets adapted to true building and plot dimensions
  setCameraPreset(name) {
    if (!this._three.camera) return;
    const c = this._three.camera;
    const ctrl = this._three.controls;
    if (ctrl) ctrl.autoRotate = false;

    const data = this.getSpatialParams(window.App?.currentProject, window.App?.calculations);
    const bldgH = data.floors * 3.6;
    const bldgZ = -((data.plotDepthM - data.bldgDepthM) * 0.20);

    if (name === 'entry') { // Street Eye-Level
      c.position.set(0, 3.2, (data.plotDepthM / 2) + 7.5);
      if (ctrl) ctrl.target.set(0, bldgH * 0.4, bldgZ + (data.bldgDepthM / 2));
    } else if (name === 'rooftop') { // Close-up Rooftop Eco-Infrastructure
      c.position.set(0, bldgH + 13, bldgZ + 16);
      if (ctrl) ctrl.target.set(0, bldgH, bldgZ);
    } else if (name === 'bioswale') { // Sustainable Drainage & Permeable Pavers
      c.position.set(-data.plotWidthM * 0.25, 6, data.plotDepthM * 0.48);
      if (ctrl) ctrl.target.set(0, 1.0, data.plotDepthM * 0.30);
    } else if (name === 'canopy') { // Biodiversity Miyawaki Canopy
      c.position.set(data.plotWidthM * 0.45, 8, bldgZ);
      if (ctrl) ctrl.target.set(data.plotWidthM * 0.35, 3, bldgZ);
    } else if (name === 'plan') { // True 90° Top-Down Plan
      c.position.set(0, Math.max(50, data.plotWidthM * 1.1), 0.1);
      if (ctrl) ctrl.target.set(0, 0, 0);
    } else { // Isometric Hero Axonometric
      c.position.set(data.plotWidthM * 0.82, Math.max(26, data.plotDepthM * 0.70), data.plotDepthM * 0.95);
      if (ctrl) ctrl.target.set(0, bldgH * 0.35, 0);
    }

    if (ctrl) ctrl.update();
  },

  toggleAutoRotate() {
    this._three.autoRotate = !this._three.autoRotate;
    if (this._three.controls) {
      this._three.controls.autoRotate = this._three.autoRotate;
    }
    const btn = document.getElementById("site3d-spin-toggle");
    if (btn) {
      btn.innerText = `Spin: ${this._three.autoRotate ? 'ON' : 'OFF'}`;
      btn.className = `px-3 py-1 rounded-xl text-[11px] font-bold transition shadow-md ${this._three.autoRotate ? 'bg-emerald-800 text-white' : 'bg-stone-900/90 text-stone-300 border border-stone-700'}`;
    }
  },

  setSunTime(hour) {
    this._three.sunTime = parseInt(hour, 10) || 12;
    if (this._three.sunLight) {
      const hAngle = ((this._three.sunTime - 12) * 15 * Math.PI) / 180;
      const x = Math.sin(hAngle) * 58;
      const y = Math.max(10, Math.cos(hAngle) * 54);
      this._three.sunLight.position.set(x, y, 30);

      // Color temperature shift (crisp white at noon, warm gold at sunset)
      if (this._three.sunTime >= 16) {
        this._three.sunLight.color.setHex(0xffa245); // Golden hour amber
        this._three.sunLight.intensity = 1.15;
      } else if (this._three.sunTime <= 9) {
        this._three.sunLight.color.setHex(0xffb86c); // Morning dawn gold
        this._three.sunLight.intensity = 1.2;
      } else {
        this._three.sunLight.color.setHex(0xfffbf0); // Noon daylight
        this._three.sunLight.intensity = 1.45;
      }
    }

    // Toggle interior room lights on in evening (after 16:30)
    const interiorActive = this._three.sunTime >= 17 || this._three.sunTime <= 8;
    if (this._three.interiorLights) {
      this._three.interiorLights.forEach(light => {
        light.intensity = interiorActive ? 1.6 : 0.0;
      });
    }

    const lbl = document.getElementById("site3d-sun-label");
    if (lbl) lbl.innerText = `${this._three.sunTime}:00`;
  },

  toggleRain() {
    this._three.rainActive = !this._three.rainActive;
    if (this._three.rainActive) {
      if (!this._three.rainMesh && this._three.scene && typeof THREE !== 'undefined') {
        const count = 1400;
        const geom = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const data = this.getSpatialParams(window.App?.currentProject, window.App?.calculations);
        for (let i = 0; i < count * 3; i += 3) {
          pos[i] = (Math.random() - 0.5) * (data.plotWidthM * 1.5);
          pos[i + 1] = Math.random() * 45;
          pos[i + 2] = (Math.random() - 0.5) * (data.plotDepthM * 1.5);
        }
        geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.22, transparent: true, opacity: 0.85 });
        this._three.rainGeo = geom;
        this._three.rainMesh = new THREE.Points(geom, mat);
        this._three.scene.add(this._three.rainMesh);
      } else if (this._three.rainMesh) {
        this._three.rainMesh.visible = true;
      }
    } else if (this._three.rainMesh) {
      this._three.rainMesh.visible = false;
    }
    const btn = document.getElementById("site3d-rain-btn");
    if (btn) {
      btn.innerText = `🌧️ Rain: ${this._three.rainActive ? 'ON' : 'OFF'}`;
      btn.className = `px-3 py-1 rounded-xl text-[11px] font-bold transition shadow-md ${this._three.rainActive ? 'bg-sky-600 text-white shadow-sky-500/50' : 'bg-stone-900/90 text-stone-300 border border-stone-700'}`;
    }
  },

  destroy3D() {
    if (this._three.animId) {
      cancelAnimationFrame(this._three.animId);
      this._three.animId = null;
    }
    if (this._three.controls) {
      this._three.controls.dispose();
      this._three.controls = null;
    }
    if (this._three.renderer && this._three.renderer.domElement && this._three.container) {
      if (this._three.container.contains(this._three.renderer.domElement)) {
        this._three.container.removeChild(this._three.renderer.domElement);
      }
      this._three.renderer.dispose();
      this._three.renderer = null;
    }
    if (this._three.onResize) {
      window.removeEventListener("resize", this._three.onResize);
      this._three.onResize = null;
    }
    this._three.scene = null;
    this._three.camera = null;
  },

  onSliderMove(val) {
    this.splitPos = parseInt(val, 10) || 50;
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  }
};
