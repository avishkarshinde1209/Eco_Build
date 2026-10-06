/**
 * EcoBuild Smart - Plan History & Assessment Manager
 * Maintains a persistent log of running assessments, past scenarios,
 * and generated reports with one-click reloading, full result viewing,
 * side-by-side scenario comparison, and named snapshot persistence.
 */

window.HistoryManager = {
  STORAGE_KEY: "ecobuild_plans_history",

  getAllPlans() {
    let plans = [];
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) plans = JSON.parse(saved);
    } catch (e) {
      console.warn("Error parsing history from storage:", e);
    }

    // Always ensure the Kolhapur demo exists in the history catalog
    if (!plans.some(p => p.id === "proj_kolhapur_demo")) {
      const demo = JSON.parse(JSON.stringify(window.ECO_SAMPLE_PROJECTS.kolhapur_academic));
      demo.status = "Demo Reference";
      demo.saved_at = new Date().toISOString();
      plans.unshift(demo);
    }

    return plans;
  },

  saveCurrentPlan(project, calculations, customName = null) {
    if (!project) return;
    const plans = this.getAllPlans();
    const existingIdx = plans.findIndex(p => p.id === project.id);

    const planRecord = JSON.parse(JSON.stringify(project));
    if (customName) planRecord.name = customName;
    planRecord.saved_at = new Date().toISOString();
    planRecord.status = customName ? "Named Snapshot" : "Active Assessment";

    if (calculations) {
      planRecord.summary_score = calculations.score?.composite_score || 85;
      planRecord.summary_tier = calculations.score?.tier || "Good";
      planRecord.summary_runoff_reduction = calculations.runoff?.impact_summary?.runoff_reduction_pct || 28.7;
      planRecord.summary_trees_planted = calculations.tree_impact?.recommended_planting_quantity || 90;
      planRecord.summary_solar_kwp = calculations.energy?.installed_capacity_kwp || 88;
      planRecord.summary_waste_tonnes = project.waste?.construction_waste_tonnes || 330;
      planRecord.summary_diversion_pct = project.waste?.recycling_pct || 65;
      planRecord.summary_topsoil_m3 = calculations.recovery?.phase1_construction?.topsoil?.salvage_volume_m3 || Math.round((project.site.built_up_area || 2200) * 0.20);
      planRecord.summary_miyawaki_trees = calculations.recovery?.phase2_operational?.miyawaki_forest?.total_saplings || 2450;
      planRecord.summary_bng_gain = calculations.recovery?.phase2_operational?.biodiversity_net_gain?.net_gain_pct || 42;

      // Store cached full calculation output for instant offline viewing
      planRecord.cached_calculations = calculations;
    }

    if (existingIdx >= 0 && !customName) {
      plans[existingIdx] = planRecord;
    } else {
      plans.unshift(planRecord);
    }

    // Retain up to 25 historical plans
    if (plans.length > 25) plans.pop();

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(plans));

    // Async sync to SQLite backend
    this.syncToBackend(planRecord);
    return planRecord;
  },

  saveNamedSnapshot() {
    const current = window.App?.currentProject;
    const calcs = window.App?.calculations;
    if (!current) {
      alert("No active plan to snapshot.");
      return;
    }

    const defaultName = `${current.name} - Version ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const snapshotName = prompt("Enter a name or version label for this assessment snapshot:", defaultName);
    if (!snapshotName || !snapshotName.trim()) return;

    const snapshot = JSON.parse(JSON.stringify(current));
    snapshot.id = `proj_${Date.now()}`;
    snapshot.name = snapshotName.trim();

    this.saveCurrentPlan(snapshot, calcs, snapshot.name);
    this.render();
    alert(`Assessment snapshot saved successfully as: "${snapshot.name}".`);
  },

  async syncToBackend(planRecord) {
    try {
      await fetch("http://localhost:8000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planRecord)
      });
    } catch (e) {
      // Offline fallback is supported
    }
  },

  loadPlan(planId) {
    const plans = this.getAllPlans();
    const target = plans.find(p => p.id === planId);
    if (!target) return;

    window.App.loadProjectAndCalculate(JSON.parse(JSON.stringify(target)));
    window.App.switchView("dashboard");
  },

  duplicatePlan(planId) {
    const plans = this.getAllPlans();
    const target = plans.find(p => p.id === planId);
    if (!target) return;

    const copy = JSON.parse(JSON.stringify(target));
    copy.id = `proj_${Date.now()}`;
    copy.name = `${copy.name} (Variant Scenario)`;
    copy.saved_at = new Date().toISOString();
    copy.status = "Scenario Variant";

    plans.unshift(copy);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(plans));
    this.render();
    alert(`Duplicated scenario created: "${copy.name}".`);
  },

  deletePlan(planId) {
    if (planId === "proj_kolhapur_demo") {
      alert("The Kolhapur academic demonstration benchmark cannot be deleted.");
      return;
    }

    if (!confirm("Are you sure you want to delete this historical plan? This cannot be undone.")) return;

    let plans = this.getAllPlans();
    plans = plans.filter(p => p.id !== planId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(plans));
    this.render();
  },

  /**
   * Modal to inspect the full calculated assessment result of any past or running plan
   */
  viewPlanResults(planId) {
    const plans = this.getAllPlans();
    const target = plans.find(p => p.id === planId);
    if (!target) return;

    // Use cached calculations or compute dynamically on the fly
    let calcs = target.cached_calculations;
    if (!calcs && window.EnvironmentalCalculator) {
      calcs = window.EnvironmentalCalculator.calculateOverallEnvironmentalIndicators(target, window.App?.environmentalData);
    }

    const score = calcs?.score?.composite_score || target.summary_score || 85;
    const tier = calcs?.score?.tier || target.summary_tier || "Good";
    const dateStr = target.saved_at ? new Date(target.saved_at).toLocaleString() : "Preloaded Reference";
    const isActive = target.id === window.App?.currentProject?.id;

    // Waste and recovery metrics
    const wasteTonnes = target.waste?.construction_waste_tonnes || target.summary_waste_tonnes || 0;
    const diversionPct = target.waste?.recycling_pct || target.summary_diversion_pct || 65;
    const topsoilM3 = calcs?.recovery?.phase1_construction?.topsoil?.salvage_volume_m3 || target.summary_topsoil_m3 || 0;
    const miyawakiTrees = calcs?.recovery?.phase2_operational?.miyawaki_forest?.total_saplings || target.summary_miyawaki_trees || 0;
    const bngNet = calcs?.recovery?.phase2_operational?.biodiversity_net_gain?.net_gain_pct || target.summary_bng_gain || 0;
    const paybackYrs = calcs?.recovery?.phase2_operational?.carbon_restoration_balance?.carbon_neutrality_payback_years || 5.8;

    let modal = document.getElementById("history-results-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "history-results-modal";
      modal.className = "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto";
      document.body.appendChild(modal);
    }

    modal.classList.remove("hidden");
    modal.innerHTML = `
      <div class="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up">
        <!-- Modal Header -->
        <div class="bg-slate-900 text-white p-5 flex items-start justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}">
                ${isActive ? '🟢 ACTIVE RUNNING PLAN' : (target.status || 'SAVED ASSESSMENT')}
              </span>
              <span class="text-xs text-slate-400">ID: ${target.id}</span>
            </div>
            <h3 class="text-xl font-bold text-white">${target.name}</h3>
            <p class="text-xs text-slate-300">📍 ${target.location?.city || 'Kolhapur'}, ${target.location?.state || 'Maharashtra'} • Saved: ${dateStr}</p>
          </div>
          <button onclick="document.getElementById('history-results-modal').classList.add('hidden')" class="text-slate-400 hover:text-white text-2xl font-bold leading-none p-1">
            &times;
          </button>
        </div>

        <!-- Modal Content Body -->
        <div class="p-6 space-y-5 overflow-y-auto text-xs">
          <!-- Overall Composite Score Header -->
          <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">Comprehensive Environmental Score</span>
              <div class="flex items-baseline gap-2 mt-0.5">
                <span class="text-3xl font-black text-emerald-800">${score}</span>
                <span class="text-xs font-bold text-emerald-700">/ 100 (${tier} Performance)</span>
              </div>
              <p class="text-[11px] text-slate-600 mt-1">Weighted composite across Runoff, Carbon, Water, Heat Island, and Ecology.</p>
            </div>
            <div class="w-16 h-16 rounded-2xl bg-white border-2 border-emerald-500 flex flex-col items-center justify-center font-black text-emerald-700 shadow-sm shrink-0">
              <span class="text-xl">${score}</span>
              <span class="text-[8px] uppercase font-bold text-slate-400">RATING</span>
            </div>
          </div>

          <!-- 4 Core Quantitative Pillars -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span class="text-[9px] uppercase font-bold text-slate-400 block">Stormwater Runoff</span>
              <div class="text-base font-extrabold text-blue-700">-${calcs?.runoff?.impact_summary?.runoff_reduction_pct || target.summary_runoff_reduction || 28.7}%</div>
              <span class="text-[10px] text-slate-500">Peak flow mitigation</span>
            </div>
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span class="text-[9px] uppercase font-bold text-slate-400 block">Solar Clean Energy</span>
              <div class="text-base font-extrabold text-amber-600">${calcs?.energy?.installed_capacity_kwp || target.summary_solar_kwp || 88} kWp</div>
              <span class="text-[10px] text-slate-500">${calcs?.energy?.annual_generation_kwh?.toLocaleString() || '128,400'} kWh/yr</span>
            </div>
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span class="text-[9px] uppercase font-bold text-slate-400 block">Compensatory Trees</span>
              <div class="text-base font-extrabold text-emerald-700">${target.interventions?.trees_planted || target.summary_trees_planted || 90} Trees</div>
              <span class="text-[10px] text-slate-500">3:1 Replacement ratio</span>
            </div>
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span class="text-[9px] uppercase font-bold text-slate-400 block">Rainwater Harvested</span>
              <div class="text-base font-extrabold text-cyan-700">${((calcs?.rwh?.annual_harvested_litres || 1800000) / 1000).toLocaleString()} kL</div>
              <span class="text-[10px] text-slate-500">Monsoon potential</span>
            </div>
          </div>

          <!-- Waste & Nature Recovery Highlights -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Waste Pillar -->
            <div class="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-amber-900 text-xs">🏗️ C&D Waste & Circularity (TIFAC / CPCB)</span>
                <span class="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">${diversionPct}% Target</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span class="text-slate-500 block">Total Waste:</span>
                  <span class="font-bold text-slate-800">${wasteTonnes} Tonnes</span>
                </div>
                <div>
                  <span class="text-slate-500 block">Diverted Rubble:</span>
                  <span class="font-bold text-emerald-700">~${Math.round(wasteTonnes * (diversionPct / 100))} Tonnes</span>
                </div>
                <div>
                  <span class="text-slate-500 block">Daily MSW:</span>
                  <span class="font-bold text-slate-800">${target.waste?.daily_solid_waste_kg || 50} kg/day</span>
                </div>
                <div>
                  <span class="text-slate-500 block">Organic Compost:</span>
                  <span class="font-bold text-amber-800">~${Math.round((target.waste?.daily_organic_waste_kg || 25) * 365 * 0.25 / 1000 * 10) / 10} t/yr</span>
                </div>
              </div>
            </div>

            <!-- Nature Recovery Pillar -->
            <div class="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-emerald-900 text-xs">🌱 Nature Recovery (NBC & Miyawaki)</span>
                <span class="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">+${bngNet}% BNG</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span class="text-slate-500 block">Topsoil Salvage:</span>
                  <span class="font-bold text-slate-800">${topsoilM3.toLocaleString()} m³</span>
                </div>
                <div>
                  <span class="text-slate-500 block">Miyawaki Forest:</span>
                  <span class="font-bold text-emerald-700">${miyawakiTrees.toLocaleString()} Saplings</span>
                </div>
                <div>
                  <span class="text-slate-500 block">Carbon Payback:</span>
                  <span class="font-bold text-slate-800">~${paybackYrs} Years</span>
                </div>
                <div>
                  <span class="text-slate-500 block">Bio-Solar Bonus:</span>
                  <span class="font-bold text-emerald-700">+4.5% PV Yield</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            ${!isActive ? `
              <button onclick="window.HistoryManager.loadPlan('${target.id}'); document.getElementById('history-results-modal').classList.add('hidden');" class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition">
                Load as Active Plan
              </button>
            ` : `
              <span class="text-xs font-bold text-emerald-700">● Currently Loaded Active Plan</span>
            `}
            <button onclick="window.HistoryManager.openCompareModal(window.App?.currentProject?.id, '${target.id}'); document.getElementById('history-results-modal').classList.add('hidden');" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition">
              ⚖️ Compare with Running Plan
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="window.HistoryManager.loadPlan('${target.id}'); window.App.switchView('report'); document.getElementById('history-results-modal').classList.add('hidden');" class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 transition">
              📄 Official EIA Report
            </button>
            <button onclick="document.getElementById('history-results-modal').classList.add('hidden')" class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition">
              Close
            </button>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Side-by-side Comparative Analysis Modal between any two plans
   */
  openCompareModal(planAId, planBId) {
    const plans = this.getAllPlans();
    if (plans.length < 2) {
      alert("At least two plans are required to perform a side-by-side comparison. Duplicate your current plan or create another one.");
      return;
    }

    const aId = planAId || plans[0].id;
    const bId = planBId || (plans[1] ? plans[1].id : plans[0].id);

    const planA = plans.find(p => p.id === aId) || plans[0];
    const planB = plans.find(p => p.id === bId) || plans[1] || plans[0];

    let modal = document.getElementById("history-compare-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "history-compare-modal";
      modal.className = "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto";
      document.body.appendChild(modal);
    }

    modal.classList.remove("hidden");

    // Metrics for comparison
    const scoreA = planA.summary_score || 85;
    const scoreB = planB.summary_score || 85;
    const deltaScore = scoreB - scoreA;

    const runoffA = planA.summary_runoff_reduction || 28.7;
    const runoffB = planB.summary_runoff_reduction || 28.7;
    const deltaRunoff = Math.round((runoffB - runoffA) * 10) / 10;

    const solarA = planA.summary_solar_kwp || 88;
    const solarB = planB.summary_solar_kwp || 88;
    const deltaSolar = solarB - solarA;

    const wasteA = planA.waste?.construction_waste_tonnes || planA.summary_waste_tonnes || 320;
    const wasteB = planB.waste?.construction_waste_tonnes || planB.summary_waste_tonnes || 320;
    const deltaWaste = wasteB - wasteA;

    const topsoilA = planA.summary_topsoil_m3 || Math.round((planA.site?.built_up_area || 2200) * 0.20);
    const topsoilB = planB.summary_topsoil_m3 || Math.round((planB.site?.built_up_area || 2200) * 0.20);

    const miyawakiA = planA.summary_miyawaki_trees || 2450;
    const miyawakiB = planB.summary_miyawaki_trees || 2450;
    const deltaMiyawaki = miyawakiB - miyawakiA;

    const bngA = planA.summary_bng_gain || 42;
    const bngB = planB.summary_bng_gain || 42;
    const deltaBng = bngB - bngA;

    modal.innerHTML = `
      <div class="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up">
        <!-- Header -->
        <div class="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <span class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Scenario Comparative Studio</span>
            <h3 class="text-xl font-bold text-white">Side-by-Side Plan Differential Analysis</h3>
          </div>
          <button onclick="document.getElementById('history-compare-modal').classList.add('hidden')" class="text-slate-400 hover:text-white text-2xl font-bold leading-none p-1">
            &times;
          </button>
        </div>

        <!-- Plan Selectors Bar -->
        <div class="bg-slate-100 p-4 border-b border-slate-200 grid grid-cols-2 gap-4 text-xs font-semibold">
          <div class="space-y-1">
            <label class="text-[10px] text-slate-500 uppercase font-bold">Scenario A (Baseline)</label>
            <select onchange="window.HistoryManager.openCompareModal(this.value, '${planB.id}')" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-bold">
              ${plans.map(p => `<option value="${p.id}" ${p.id === planA.id ? 'selected' : ''}>${p.name} (Score: ${p.summary_score || 85})</option>`).join('')}
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-[10px] text-slate-500 uppercase font-bold">Scenario B (Comparison)</label>
            <select onchange="window.HistoryManager.openCompareModal('${planA.id}', this.value)" class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-bold">
              ${plans.map(p => `<option value="${p.id}" ${p.id === planB.id ? 'selected' : ''}>${p.name} (Score: ${p.summary_score || 85})</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Comparison Table -->
        <div class="p-6 overflow-y-auto space-y-4 text-xs">
          <div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600">
                  <th class="p-3">Key Environmental Metric</th>
                  <th class="p-3 text-center bg-blue-50/50 text-blue-900">${planA.name}</th>
                  <th class="p-3 text-center bg-emerald-50/50 text-emerald-900">${planB.name}</th>
                  <th class="p-3 text-center">Variance (Δ Delta)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium">
                <!-- Score -->
                <tr class="hover:bg-slate-50">
                  <td class="p-3 font-bold text-slate-800">Overall EIA Sustainability Score</td>
                  <td class="p-3 text-center font-extrabold text-blue-800 text-sm">${scoreA} / 100</td>
                  <td class="p-3 text-center font-extrabold text-emerald-800 text-sm">${scoreB} / 100</td>
                  <td class="p-3 text-center font-bold ${deltaScore >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
                    ${deltaScore >= 0 ? '+' : ''}${deltaScore} pts
                  </td>
                </tr>

                <!-- Stormwater -->
                <tr class="hover:bg-slate-50">
                  <td class="p-3 text-slate-700">Stormwater Runoff Mitigation %</td>
                  <td class="p-3 text-center text-slate-700">-${runoffA}%</td>
                  <td class="p-3 text-center text-slate-700">-${runoffB}%</td>
                  <td class="p-3 text-center font-bold ${deltaRunoff >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
                    ${deltaRunoff >= 0 ? '+' : ''}${deltaRunoff}%
                  </td>
                </tr>

                <!-- Solar -->
                <tr class="hover:bg-slate-50">
                  <td class="p-3 text-slate-700">Rooftop Solar PV Array</td>
                  <td class="p-3 text-center text-slate-700">${solarA} kWp</td>
                  <td class="p-3 text-center text-slate-700">${solarB} kWp</td>
                  <td class="p-3 text-center font-bold ${deltaSolar >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
                    ${deltaSolar >= 0 ? '+' : ''}${deltaSolar} kWp
                  </td>
                </tr>

                <!-- C&D Waste -->
                <tr class="hover:bg-slate-50">
                  <td class="p-3 text-slate-700">Construction Waste (TIFAC Norm)</td>
                  <td class="p-3 text-center text-slate-700">${wasteA} Tonnes</td>
                  <td class="p-3 text-center text-slate-700">${wasteB} Tonnes</td>
                  <td class="p-3 text-center font-bold ${deltaWaste <= 0 ? 'text-emerald-600' : 'text-amber-600'}">
                    ${deltaWaste >= 0 ? '+' : ''}${deltaWaste} Tonnes
                  </td>
                </tr>

                <!-- Topsoil -->
                <tr class="hover:bg-slate-50">
                  <td class="p-3 text-slate-700">Topsoil Salvaged (NBC 2016)</td>
                  <td class="p-3 text-center text-slate-700">${topsoilA.toLocaleString()} m³</td>
                  <td class="p-3 text-center text-slate-700">${topsoilB.toLocaleString()} m³</td>
                  <td class="p-3 text-center font-bold text-slate-600">
                    ${topsoilB - topsoilA >= 0 ? '+' : ''}${(topsoilB - topsoilA).toLocaleString()} m³
                  </td>
                </tr>

                <!-- Miyawaki Trees -->
                <tr class="hover:bg-slate-50">
                  <td class="p-3 text-slate-700">Miyawaki Native Saplings</td>
                  <td class="p-3 text-center text-slate-700">${miyawakiA.toLocaleString()} Trees</td>
                  <td class="p-3 text-center text-slate-700">${miyawakiB.toLocaleString()} Trees</td>
                  <td class="p-3 text-center font-bold ${deltaMiyawaki >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
                    ${deltaMiyawaki >= 0 ? '+' : ''}${deltaMiyawaki.toLocaleString()} Trees
                  </td>
                </tr>

                <!-- Biodiversity Net Gain -->
                <tr class="hover:bg-slate-50">
                  <td class="p-3 text-slate-700">Biodiversity Net Gain (BNG)</td>
                  <td class="p-3 text-center text-slate-700">+${bngA}%</td>
                  <td class="p-3 text-center text-slate-700">+${bngB}%</td>
                  <td class="p-3 text-center font-bold ${deltaBng >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
                    ${deltaBng >= 0 ? '+' : ''}${deltaBng}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span class="text-xs text-slate-500">Comparing active variables and ecological projections.</span>
          <button onclick="document.getElementById('history-compare-modal').classList.add('hidden')" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold">
            Close Comparison
          </button>
        </div>
      </div>
    `;
  },

  render() {
    const container = document.getElementById("history-view");
    if (!container) return;

    const plans = this.getAllPlans();
    const activeId = window.App.currentProject?.id;

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-stone-800">
        <!-- Header -->
        <div class="bg-[#14281D] rounded-3xl p-6 sm:p-8 text-white border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-1.5">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Assessment Logs & Archive</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white font-serif mt-1">
              Plan History & Variant Studio
            </h1>
            <p class="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Review running environmental simulations, inspect full results of past plans, save named version snapshots, and compare scenarios side-by-side.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2 self-start md:self-center">
            <button onclick="window.HistoryManager.saveNamedSnapshot()" class="px-4 py-2 text-xs font-bold rounded-xl bg-stone-900 text-stone-200 border border-stone-700 hover:bg-stone-800 hover:text-white transition flex items-center gap-1.5 shadow-sm">
              <span>💾 Save Snapshot</span>
            </button>
            <button onclick="window.HistoryManager.openCompareModal()" class="px-4 py-2 text-xs font-bold rounded-xl bg-stone-900 text-stone-200 border border-stone-700 hover:bg-stone-800 hover:text-white transition flex items-center gap-1.5 shadow-sm">
              <span>⚖️ Compare Plans</span>
            </button>
            <button onclick="window.App.switchView('wizard')" class="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 text-stone-950 hover:bg-emerald-400 shadow-lg shadow-emerald-900/30 transition flex items-center gap-1.5">
              <span>+ New Plan</span>
            </button>
          </div>
        </div>

        <!-- Plans Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${plans.map(p => {
            const isActive = p.id === activeId;
            const scoreVal = p.summary_score || 86;
            const dateStr = p.saved_at ? new Date(p.saved_at).toLocaleString() : "Preloaded Reference";
            const wasteTonnes = p.waste?.construction_waste_tonnes || p.summary_waste_tonnes || 320;
            const topsoilM3 = p.summary_topsoil_m3 || Math.round((p.site?.built_up_area || 2200) * 0.20);

            return `
              <div class="bg-white rounded-xl border-2 transition-all duration-200 shadow-sm overflow-hidden flex flex-col justify-between ${isActive ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' : 'border-slate-200 hover:border-slate-300'}">
                <div class="p-5 space-y-4">
                  <!-- Card Header -->
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <div class="flex items-center gap-1.5 mb-1">
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'}">
                          ${isActive ? '🟢 ACTIVE RUNNING' : (p.status || 'SAVED PLAN')}
                        </span>
                        <span class="text-[10px] font-semibold text-slate-500">${p.building_type}</span>
                      </div>
                      <h3 class="font-bold text-slate-800 text-base leading-tight">${p.name}</h3>
                      <div class="text-xs text-slate-500 mt-0.5">📍 ${p.location?.city || 'Kolhapur'}, ${p.location?.state || 'Maharashtra'}</div>
                    </div>

                    <!-- Circular Score Gauge -->
                    <div class="w-12 h-12 rounded-full border-2 ${scoreVal >= 70 ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-amber-500 text-amber-600 bg-amber-50'} flex flex-col items-center justify-center font-extrabold text-sm shrink-0">
                      <span>${scoreVal}</span>
                      <span class="text-[8px] font-normal leading-none text-slate-400">SCORE</span>
                    </div>
                  </div>

                  <!-- Key Metric Tags -->
                  <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <span class="text-slate-400 text-[10px] uppercase font-bold block">Plot Area</span>
                      <span class="font-semibold text-slate-800">${p.site?.plot_area?.toLocaleString() || 5000} m²</span>
                    </div>
                    <div>
                      <span class="text-slate-400 text-[10px] uppercase font-bold block">Runoff Mitigated</span>
                      <span class="font-semibold text-blue-700">~${p.summary_runoff_reduction || 28.7}%</span>
                    </div>
                    <div>
                      <span class="text-slate-400 text-[10px] uppercase font-bold block">C&D Waste</span>
                      <span class="font-semibold text-amber-800">${wasteTonnes} Tonnes</span>
                    </div>
                    <div>
                      <span class="text-slate-400 text-[10px] uppercase font-bold block">Topsoil Salvage</span>
                      <span class="font-semibold text-emerald-700">${topsoilM3.toLocaleString()} m³</span>
                    </div>
                  </div>

                  <div class="text-[10px] text-slate-400">
                    Saved: ${dateStr}
                  </div>
                </div>

                <!-- Action Toolbar Footer -->
                <div class="bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                  <div class="flex items-center gap-1.5">
                    <button onclick="window.HistoryManager.viewPlanResults('${p.id}')" class="px-2.5 py-1 text-xs font-bold rounded bg-emerald-700 hover:bg-emerald-800 text-white transition flex items-center gap-1" title="View Full Results">
                      <span>👁️ View Results</span>
                    </button>
                    ${!isActive ? `
                      <button onclick="window.HistoryManager.loadPlan('${p.id}')" class="px-2.5 py-1 text-xs font-semibold rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition">
                        Load
                      </button>
                    ` : ''}
                  </div>

                  <div class="flex items-center gap-1">
                    <button onclick="window.HistoryManager.duplicatePlan('${p.id}')" class="px-2 py-1 text-xs rounded border border-slate-200 text-slate-600 hover:bg-slate-200 transition" title="Duplicate scenario">
                      Clone
                    </button>
                    <button onclick="window.HistoryManager.loadPlan('${p.id}'); window.App.switchView('report');" class="px-2 py-1 text-xs font-medium text-slate-700 hover:text-emerald-700 transition" title="View PDF Assessment Report">
                      📄 Report
                    </button>
                    ${p.id !== 'proj_kolhapur_demo' ? `
                      <button onclick="window.HistoryManager.deletePlan('${p.id}')" class="px-2 py-1 text-xs text-rose-600 hover:text-rose-800 transition" title="Delete plan">
                        🗑️
                      </button>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }
};
