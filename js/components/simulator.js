/**
 * EcoBuild Smart - Interactive What-If Scenario Simulator
 * Allows academic evaluators and planners to drag intervention sliders
 * and observe immediate real-time recalculation of hydrological,
 * carbon, microclimate, and composite sustainability indicators.
 */

window.SimulatorView = {
  interventions: {
    trees_planted: 90,
    green_roof_m2: 600,
    permeable_pavement_m2: 1200,
    rwh_tank_capacity_l: 85000,
    solar_pv_area_m2: 700
  },

  render(project, calculations, environmentalData) {
    const container = document.getElementById("simulator-view");
    if (!container) return;

    const site = project.site || {};
    const surfaces = project.surfaces || {};
    const plotArea = site.plot_area || 5000;
    const roofArea = site.roof_area || 2200;
    const concreteArea = (surfaces.concrete_area || 0) + (surfaces.asphalt_area || 0) || Math.max(0, plotArea - roofArea) || 2600;
    const openArea = site.open_area || Math.max(0, plotArea - (site.built_up_area || roofArea));
    const treesRemoved = project.vegetation?.trees_removed || 0;
    const occupants = project.occupancy?.total_occupants || 250;

    const dynTrees = Math.min(Math.max(15, treesRemoved * 3), Math.floor((openArea * 0.6) / 16));
    const dynGreenRoof = Math.round(roofArea * 0.27);
    const dynPerm = Math.round(Math.min(concreteArea * 0.45, concreteArea));
    const dynRwh = Math.round(Math.min(roofArea * 40, Math.max(15000, occupants * 45 * 18)));
    const dynSolar = Math.round(Math.min(roofArea * 0.35, Math.max(0, roofArea - dynGreenRoof)));

    // Load initial intervention values from project if present, or use dynamic defaults
    if (project.interventions) {
      this.interventions = {
        trees_planted: project.interventions.trees_planted ?? dynTrees,
        green_roof_m2: project.interventions.green_roof_m2 ?? dynGreenRoof,
        permeable_pavement_m2: project.interventions.permeable_pavement_m2 ?? dynPerm,
        rwh_tank_capacity_l: project.interventions.rwh_tank_capacity_l ?? dynRwh,
        solar_pv_area_m2: project.interventions.solar_pv_area_m2 ?? dynSolar
      };
    } else {
      this.interventions = {
        trees_planted: dynTrees,
        green_roof_m2: dynGreenRoof,
        permeable_pavement_m2: dynPerm,
        rwh_tank_capacity_l: dynRwh,
        solar_pv_area_m2: dynSolar
      };
    }

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Title & Instruction Header -->
        <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              🎛️ Real-Time Sensitivity Analysis
            </span>
            <h1 class="text-2xl font-bold text-slate-800 tracking-tight mt-1">What-If Intervention Simulator</h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Drag the green infrastructure sliders below to simulate hypothetical mitigation policies. Calculations update instantly.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="window.SimulatorView.resetToRecommended()" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition">
              Reset to Recommendations
            </button>
            <button onclick="window.SimulatorView.resetToZero()" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 transition">
              Zero Interventions (Baseline)
            </button>
          </div>
        </div>

        <!-- Simulator Grid: Sliders on Left, Live Outcome Cards on Right -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left Column: Interactive Sliders (7 cols) -->
          <div class="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 class="text-sm font-bold text-slate-800 border-b pb-3">Green Infrastructure Levers</h3>

            <!-- Slider 1: Compensatory Trees Planted -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-xs">
                <label class="font-bold text-slate-700 flex items-center gap-1.5">
                  <span>🌳</span> Native Trees Planted
                </label>
                <span id="val-trees" class="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ${this.interventions.trees_planted} Trees
                </span>
              </div>
              <input 
                type="range" 
                id="slider-trees" 
                min="0" 
                max="${Math.max(100, Math.floor(openArea / 16))}" 
                step="5" 
                value="${this.interventions.trees_planted}" 
                oninput="window.SimulatorView.onSliderChange('trees_planted', parseInt(this.value))"
                class="w-full accent-emerald-600 cursor-pointer">
              <div class="flex justify-between text-[10px] text-slate-400">
                <span>0 (Zero planting)</span>
                <span>Recommended: ${calculations.tree_impact?.recommended_planting_quantity || dynTrees} trees</span>
                <span>${Math.max(100, Math.floor(openArea / 16))} trees</span>
              </div>
            </div>

            <!-- Slider 2: Green Roof Area -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-xs">
                <label class="font-bold text-slate-700 flex items-center gap-1.5">
                  <span>🌿</span> Extensive Green Roof (m²)
                </label>
                <span id="val-green-roof" class="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  ${this.interventions.green_roof_m2} m² (${Math.round((this.interventions.green_roof_m2 / roofArea) * 100)}% of roof)
                </span>
              </div>
              <input 
                type="range" 
                id="slider-green-roof" 
                min="0" 
                max="${roofArea}" 
                step="50" 
                value="${this.interventions.green_roof_m2}" 
                oninput="window.SimulatorView.onSliderChange('green_roof_m2', parseFloat(this.value))"
                class="w-full accent-teal-600 cursor-pointer">
              <div class="flex justify-between text-[10px] text-slate-400">
                <span>0 m²</span>
                <span>Recommended: ${calculations.green_infra_potential.recommended_green_roof_m2} m²</span>
                <span>${roofArea} m² (Full Roof)</span>
              </div>
            </div>

            <!-- Slider 3: Permeable Pavement Conversion -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-xs">
                <label class="font-bold text-slate-700 flex items-center gap-1.5">
                  <span>🧱</span> Permeable Pavement Conversion (m²)
                </label>
                <span id="val-perm-pave" class="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  ${this.interventions.permeable_pavement_m2} m² (${Math.round((this.interventions.permeable_pavement_m2 / concreteArea) * 100)}% of paved)
                </span>
              </div>
              <input 
                type="range" 
                id="slider-perm-pave" 
                min="0" 
                max="${concreteArea}" 
                step="50" 
                value="${this.interventions.permeable_pavement_m2}" 
                oninput="window.SimulatorView.onSliderChange('permeable_pavement_m2', parseFloat(this.value))"
                class="w-full accent-blue-600 cursor-pointer">
              <div class="flex justify-between text-[10px] text-slate-400">
                <span>0 m²</span>
                <span>Recommended: ${calculations.green_infra_potential.recommended_permeable_pavement_m2} m²</span>
                <span>${concreteArea} m² (Full Pavement)</span>
              </div>
            </div>

            <!-- Slider 4: Rainwater Storage Capacity -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-xs">
                <label class="font-bold text-slate-700 flex items-center gap-1.5">
                  <span>💧</span> RWH Storage Tank Capacity (Litres)
                </label>
                <span id="val-rwh-tank" class="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  ${(this.interventions.rwh_tank_capacity_l / 1000).toFixed(0)} kL (${this.interventions.rwh_tank_capacity_l.toLocaleString()} L)
                </span>
              </div>
              <input 
                type="range" 
                id="slider-rwh-tank" 
                min="0" 
                max="${Math.max(50000, Math.round(roofArea * 80))}" 
                step="5000" 
                value="${this.interventions.rwh_tank_capacity_l}" 
                oninput="window.SimulatorView.onSliderChange('rwh_tank_capacity_l', parseFloat(this.value))"
                class="w-full accent-sky-600 cursor-pointer">
              <div class="flex justify-between text-[10px] text-slate-400">
                <span>0 L</span>
                <span>Recommended: ${(calculations.rwh?.recommended_storage_range_litres?.optimum || dynRwh).toLocaleString()} L</span>
                <span>${(Math.max(50000, Math.round(roofArea * 80)) / 1000).toFixed(0)} kL</span>
              </div>
            </div>

            <!-- Slider 5: Solar PV Area -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-xs">
                <label class="font-bold text-slate-700 flex items-center gap-1.5">
                  <span>☀️</span> Rooftop Solar PV Area (m²)
                </label>
                <span id="val-solar-pv" class="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  ${this.interventions.solar_pv_area_m2} m² (~${Math.round(this.interventions.solar_pv_area_m2 * 0.18)} kWp)
                </span>
              </div>
              <input 
                type="range" 
                id="slider-solar-pv" 
                min="0" 
                max="${roofArea}" 
                step="50" 
                value="${this.interventions.solar_pv_area_m2}" 
                oninput="window.SimulatorView.onSliderChange('solar_pv_area_m2', parseFloat(this.value))"
                class="w-full accent-amber-500 cursor-pointer">
              <div class="flex justify-between text-[10px] text-slate-400">
                <span>0 m²</span>
                <span>Recommended: ${calculations.energy.solar_allocated_area_m2} m²</span>
                <span>${roofArea} m² (Max Roof)</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Live Recalculated Impact Indicators (5 cols) -->
          <div class="lg:col-span-5 space-y-4">
            <!-- Composite Score Widget -->
            <div class="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-xl p-6 shadow-md">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs text-emerald-200 font-semibold uppercase tracking-wider block">Live Simulated Score</span>
                  <div id="sim-tier" class="text-xs text-emerald-300 font-medium mt-0.5">${calculations.score.tier}</div>
                </div>
                <div id="sim-score" class="w-16 h-16 rounded-full border-4 border-amber-400 bg-white/10 flex items-center justify-center text-3xl font-black text-amber-300">
                  ${calculations.score.composite_score}
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-emerald-700/60 text-xs space-y-1.5 text-emerald-100">
                <div class="flex justify-between">
                  <span>Runoff Reduction:</span>
                  <span id="sim-runoff-pct" class="font-bold text-white">${calculations.runoff.impact_summary.runoff_reduction_pct}%</span>
                </div>
                <div class="flex justify-between">
                  <span>Carbon Offset / Year:</span>
                  <span id="sim-carbon-offset" class="font-bold text-white">${calculations.carbon.net_carbon_dynamics.total_annual_offset_tonnes} t CO₂e</span>
                </div>
                <div class="flex justify-between">
                  <span>RWH Water Sufficiency:</span>
                  <span id="sim-water-pct" class="font-bold text-white">${calculations.rwh.demand_offset_percentage}% of site demand</span>
                </div>
                <div class="flex justify-between">
                  <span>10-Yr Canopy Recovery:</span>
                  <span id="sim-canopy-m2" class="font-bold text-white">${calculations.tree_impact.projected_canopy_10yr_m2.toLocaleString()} m²</span>
                </div>
              </div>
            </div>

            <!-- Dynamic Delta Comparison Cards -->
            <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Dynamic Balance Indicators</h4>

              <!-- Delta 1: Runoff Peak -->
              <div class="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-xs space-y-1">
                <div class="flex justify-between font-semibold text-blue-900">
                  <span>Peak Runoff Rate (Q)</span>
                  <span id="sim-q-peak">${calculations.runoff.with_green_infrastructure.peak_runoff_m3_hr} m³/hr</span>
                </div>
                <div class="text-[11px] text-blue-700">
                  Baseline development was ${calculations.runoff.proposed_development.peak_runoff_m3_hr} m³/hr. Green interventions mitigate <span id="sim-q-saved" class="font-bold">${Math.round(calculations.runoff.proposed_development.peak_runoff_m3_hr - calculations.runoff.with_green_infrastructure.peak_runoff_m3_hr)} m³/hr</span>.
                </div>
              </div>

              <!-- Delta 2: Carbon Payback -->
              <div class="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
                <div class="flex justify-between font-semibold text-emerald-900">
                  <span>Carbon Payback Period</span>
                  <span id="sim-payback">${calculations.carbon.net_carbon_dynamics.carbon_payback_years} Years</span>
                </div>
                <div class="text-[11px] text-emerald-700">
                  Time required for compensatory trees and solar PV to sequester the ${calculations.carbon.embodied_emissions.total_embodied_tonnes} tonnes of construction embodied emissions.
                </div>
              </div>

              <!-- Delta 3: UHI Albedo -->
              <div class="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                <div class="flex justify-between font-semibold text-amber-900">
                  <span>Urban Heat Island Index</span>
                  <span id="sim-uhi">${calculations.uhi.uhi_vulnerability_index} / 100</span>
                </div>
                <div class="text-[11px] text-amber-700">
                  <span id="sim-uhi-risk">${calculations.uhi.uhi_risk_level}</span> (${calculations.uhi.estimated_ambient_cooling_benefit})
                </div>
              </div>
            </div>

            <!-- Apply & Save Interventions Button -->
            <button onclick="window.SimulatorView.applyToProject()" class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow transition flex items-center justify-center gap-2">
              <span>Apply These Interventions to Project Plan</span>
              <span>✓</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  onSliderChange(key, value) {
    this.interventions[key] = value;

    // Update slider label tags
    if (key === 'trees_planted') {
      document.getElementById("val-trees").innerText = `${value} Trees`;
    } else if (key === 'green_roof_m2') {
      const roof = window.App.currentProject.site.roof_area;
      document.getElementById("val-green-roof").innerText = `${value} m² (${Math.round((value/roof)*100)}% of roof)`;
    } else if (key === 'permeable_pavement_m2') {
      const paved = window.App.currentProject.surfaces.concrete_area;
      document.getElementById("val-perm-pave").innerText = `${value} m² (${Math.round((value/paved)*100)}% of paved)`;
    } else if (key === 'rwh_tank_capacity_l') {
      document.getElementById("val-rwh-tank").innerText = `${(value/1000).toFixed(0)} kL (${value.toLocaleString()} L)`;
    } else if (key === 'solar_pv_area_m2') {
      document.getElementById("val-solar-pv").innerText = `${value} m² (~${Math.round(value * 0.18)} kWp)`;
    }

    // Dynamic instant recalculation
    this.recalculateLive();
  },

  recalculateLive() {
    const projCopy = JSON.parse(JSON.stringify(window.App.currentProject));
    projCopy.interventions = { ...this.interventions };

    const newCalcs = window.EnvironmentalCalculator.calculateOverallEnvironmentalIndicators(projCopy, window.App.environmentalData);

    // Update DOM indicators instantly
    const sc = newCalcs.score;
    const simScoreEl = document.getElementById("sim-score");
    if (simScoreEl) {
      simScoreEl.innerText = sc.composite_score;
      document.getElementById("sim-tier").innerText = sc.tier;
      document.getElementById("sim-runoff-pct").innerText = `${newCalcs.runoff.impact_summary.runoff_reduction_pct}%`;
      document.getElementById("sim-carbon-offset").innerText = `${newCalcs.carbon.net_carbon_dynamics.total_annual_offset_tonnes} t CO₂e`;
      document.getElementById("sim-water-pct").innerText = `${newCalcs.rwh.demand_offset_percentage}% of site demand`;
      document.getElementById("sim-canopy-m2").innerText = `${newCalcs.tree_impact.projected_canopy_10yr_m2.toLocaleString()} m²`;

      document.getElementById("sim-q-peak").innerText = `${newCalcs.runoff.with_green_infrastructure.peak_runoff_m3_hr} m³/hr`;
      const qSaved = Math.max(0, newCalcs.runoff.proposed_development.peak_runoff_m3_hr - newCalcs.runoff.with_green_infrastructure.peak_runoff_m3_hr);
      document.getElementById("sim-q-saved").innerText = `${Math.round(qSaved * 10) / 10} m³/hr`;

      document.getElementById("sim-payback").innerText = `${newCalcs.carbon.net_carbon_dynamics.carbon_payback_years} Years`;
      document.getElementById("sim-uhi").innerText = `${newCalcs.uhi.uhi_vulnerability_index} / 100`;
      document.getElementById("sim-uhi-risk").innerText = newCalcs.uhi.uhi_risk_level;
    }
  },

  resetToRecommended() {
    const proj = window.App?.currentProject || {};
    const site = proj.site || {};
    const roof = site.roof_area || 2200;
    const concrete = proj.surfaces?.concrete_area || 2600;
    const openGround = site.open_area || Math.max(0, (site.plot_area || 5000) - (site.built_up_area || 2200));
    const treesRemoved = proj.vegetation?.trees_removed || 0;
    const occupants = proj.occupancy?.total_occupants || 250;

    const recs = window.App?.recommendations?.recovery_summary || {};
    this.interventions = {
      trees_planted: recs.trees_to_plant ?? Math.min(Math.max(15, treesRemoved * 3), Math.floor((openGround * 0.6) / 16)),
      green_roof_m2: recs.green_roof_area_m2 ?? Math.round(roof * 0.27),
      permeable_pavement_m2: recs.permeable_pavement_m2 ?? Math.round(Math.min(concrete * 0.45, concrete)),
      rwh_tank_capacity_l: recs.rwh_capacity_litres ?? Math.round(Math.min(roof * 40, Math.max(15000, occupants * 45 * 18))),
      solar_pv_area_m2: recs.solar_pv_area_m2 ?? Math.round(Math.min(roof * 0.35, Math.max(0, roof - Math.round(roof * 0.27))))
    };
    this.render(window.App.currentProject, window.App.calculations, window.App.environmentalData);
  },

  resetToZero() {
    this.interventions = {
      trees_planted: 0,
      green_roof_m2: 0,
      permeable_pavement_m2: 0,
      rwh_tank_capacity_l: 0,
      solar_pv_area_m2: 0
    };
    this.render(window.App.currentProject, window.App.calculations, window.App.environmentalData);
    this.recalculateLive();
  },

  applyToProject() {
    window.App.currentProject.interventions = { ...this.interventions };
    window.App.recalculateProject();
    alert("Simulator interventions successfully applied to the master environmental assessment plan!");
    window.App.switchView("dashboard");
  }
};
