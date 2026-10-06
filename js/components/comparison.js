/**
 * EcoBuild Smart - 3-State Before vs. After Simulation Engine
 * Compares:
 * 1. Pre-Development Site (Baseline pristine / existing conditions)
 * 2. Proposed Development (Conventional unmitigated construction)
 * 3. Green Intervention Plan (Optimized green infrastructure recovery)
 */

window.ComparisonView = {
  charts: {},

  render(project, calculations, environmentalData) {
    const container = document.getElementById("comparison-view");
    if (!container) return;

    const pre = calculations.runoff.pre_development;
    const prop = calculations.runoff.proposed_development;
    const green = calculations.runoff.with_green_infrastructure;
    const plot = project.site.plot_area;

    // State 1 metrics (Existing Pre-Development)
    const s1 = {
      name: "Existing Site",
      subtitle: "Pre-Development State",
      green_area_m2: project.vegetation.existing_green_area,
      green_pct: Math.round((project.vegetation.existing_green_area / plot) * 100),
      impervious_m2: Math.max(0, plot - project.vegetation.existing_green_area - 300),
      impervious_pct: Math.round(((plot - project.vegetation.existing_green_area - 300) / plot) * 100),
      tree_count: project.vegetation.existing_tree_count,
      peak_runoff_m3_hr: pre.peak_runoff_m3_hr,
      composite_c: pre.composite_c,
      annual_rwh_m3: 0,
      annual_solar_kwh: 0,
      annual_carbon_seq_kg: Math.round(project.vegetation.existing_tree_count * 21.8),
      score: 58,
      theme: "slate"
    };

    // State 2 metrics (Proposed Construction)
    const s2 = {
      name: "Proposed Development",
      subtitle: "Baseline Construction (No Green Infra)",
      green_area_m2: Math.max(0, project.vegetation.existing_green_area - (project.site.built_up_area * 0.5)),
      green_pct: Math.round((Math.max(0, project.vegetation.existing_green_area - (project.site.built_up_area * 0.5)) / plot) * 100),
      impervious_m2: project.site.built_up_area + project.surfaces.concrete_area + (project.surfaces.asphalt_area || 0),
      impervious_pct: Math.round(((project.site.built_up_area + project.surfaces.concrete_area + (project.surfaces.asphalt_area || 0)) / plot) * 100),
      tree_count: Math.max(0, project.vegetation.existing_tree_count - project.vegetation.trees_removed),
      peak_runoff_m3_hr: prop.peak_runoff_m3_hr,
      composite_c: prop.composite_c,
      annual_rwh_m3: 0,
      annual_solar_kwh: 0,
      annual_carbon_seq_kg: Math.round((project.vegetation.existing_tree_count - project.vegetation.trees_removed) * 21.8),
      score: 34,
      theme: "rose"
    };

    // State 3 metrics (With Green Infrastructure Interventions)
    const greenRoofM2 = project.interventions?.green_roof_m2 || calculations.green_infra_potential.recommended_green_roof_m2;
    const permPaveM2 = project.interventions?.permeable_pavement_m2 || calculations.green_infra_potential.recommended_permeable_pavement_m2;
    const treesPlanted = project.interventions?.trees_planted || calculations.tree_impact.recommended_planting_quantity;
    const effectiveGreenM2 = s2.green_area_m2 + greenRoofM2 + Math.round(permPaveM2 * 0.5);

    const s3 = {
      name: "Green Intervention Plan",
      subtitle: "Sustainable Regenerative Infrastructure",
      green_area_m2: effectiveGreenM2,
      green_pct: Math.round((effectiveGreenM2 / plot) * 100),
      impervious_m2: Math.max(0, s2.impervious_m2 - permPaveM2 - (greenRoofM2 * 0.6)),
      impervious_pct: Math.round((Math.max(0, s2.impervious_m2 - permPaveM2 - (greenRoofM2 * 0.6)) / plot) * 100),
      tree_count: s2.tree_count + treesPlanted,
      peak_runoff_m3_hr: green.peak_runoff_m3_hr,
      composite_c: green.composite_c,
      annual_rwh_m3: Math.round(calculations.rwh.annual_potential_m3),
      annual_solar_kwh: calculations.energy.annual_generation_kwh,
      annual_carbon_seq_kg: Math.round((s2.tree_count + treesPlanted) * 21.8),
      score: calculations.score.composite_score,
      theme: "emerald"
    };

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Banner -->
        <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-300">
              ⚖️ Tri-State Dynamic Comparative Modeling
            </span>
            <h1 class="text-2xl font-bold text-slate-800 tracking-tight mt-1">Before vs. After Simulation</h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Side-by-side comparison across 3 project states: Pre-Development Baseline &rarr; Unmitigated Proposed &rarr; Green Interventions.
            </p>
          </div>
          <div class="text-xs text-slate-500 font-medium">
            Dynamic updates as user edits project inputs
          </div>
        </div>

        <!-- 3 Side-by-Side State Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- State 1: Existing Site -->
          <div class="bg-white rounded-xl border-2 border-slate-300 shadow-sm overflow-hidden flex flex-col">
            <div class="bg-slate-700 text-white p-4">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">State 1</span>
              <h3 class="text-base font-bold">${s1.name}</h3>
              <p class="text-xs text-slate-300">${s1.subtitle}</p>
            </div>
            <div class="p-5 space-y-4 flex-1 text-xs">
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Green Area:</span>
                <span class="font-bold text-slate-800">${s1.green_area_m2.toLocaleString()} m² (${s1.green_pct}%)</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Impervious Surface:</span>
                <span class="font-bold text-slate-800">${s1.impervious_m2.toLocaleString()} m² (${s1.impervious_pct}%)</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Tree Count:</span>
                <span class="font-bold text-slate-800">${s1.tree_count} mature trees</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Peak Runoff (Q):</span>
                <span class="font-bold text-slate-800">${s1.peak_runoff_m3_hr} m³/hr (C=${s1.composite_c})</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Rainwater Harvesting:</span>
                <span class="font-bold text-slate-400">None (0 m³)</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Solar Generation:</span>
                <span class="font-bold text-slate-400">None (0 kWh)</span>
              </div>
              <div class="flex justify-between pt-1">
                <span class="text-slate-500 font-semibold">Sustainability Score:</span>
                <span class="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">${s1.score} / 100</span>
              </div>
            </div>
          </div>

          <!-- State 2: Proposed Construction -->
          <div class="bg-white rounded-xl border-2 border-rose-300 shadow-sm overflow-hidden flex flex-col">
            <div class="bg-rose-700 text-white p-4">
              <span class="text-[10px] font-bold uppercase tracking-wider text-rose-200 block">State 2</span>
              <h3 class="text-base font-bold">${s2.name}</h3>
              <p class="text-xs text-rose-200">${s2.subtitle}</p>
            </div>
            <div class="p-5 space-y-4 flex-1 text-xs">
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Green Area:</span>
                <span class="font-bold text-rose-700">${s2.green_area_m2.toLocaleString()} m² (${s2.green_pct}%) <span class="text-[10px] text-rose-500">(-${s1.green_area_m2 - s2.green_area_m2}m²)</span></span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Impervious Surface:</span>
                <span class="font-bold text-rose-700">${s2.impervious_m2.toLocaleString()} m² (${s2.impervious_pct}%)</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Tree Count:</span>
                <span class="font-bold text-rose-700">${s2.tree_count} trees <span class="text-[10px] text-rose-500">(-${project.vegetation.trees_removed})</span></span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Peak Runoff (Q):</span>
                <span class="font-bold text-rose-700">${s2.peak_runoff_m3_hr} m³/hr (C=${s2.composite_c})</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Rainwater Harvesting:</span>
                <span class="font-bold text-slate-400">None (0 m³)</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Solar Generation:</span>
                <span class="font-bold text-slate-400">None (0 kWh)</span>
              </div>
              <div class="flex justify-between pt-1">
                <span class="text-slate-500 font-semibold">Sustainability Score:</span>
                <span class="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">${s2.score} / 100</span>
              </div>
            </div>
          </div>

          <!-- State 3: Green Intervention Plan -->
          <div class="bg-white rounded-xl border-2 border-emerald-500 shadow-md overflow-hidden flex flex-col relative">
            <div class="bg-emerald-700 text-white p-4">
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">State 3</span>
              <h3 class="text-base font-bold">${s3.name}</h3>
              <p class="text-xs text-emerald-200">${s3.subtitle}</p>
            </div>
            <div class="p-5 space-y-4 flex-1 text-xs">
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Effective Green Cover:</span>
                <span class="font-bold text-emerald-700">${s3.green_area_m2.toLocaleString()} m² (${s3.green_pct}%)</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Impervious Surface:</span>
                <span class="font-bold text-emerald-700">${s3.impervious_m2.toLocaleString()} m² (${s3.impervious_pct}%)</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Tree Count:</span>
                <span class="font-bold text-emerald-700">${s3.tree_count} trees (+${treesPlanted} planted)</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Peak Runoff (Q):</span>
                <span class="font-bold text-emerald-700">${s3.peak_runoff_m3_hr} m³/hr (C=${s3.composite_c})</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Rainwater Harvesting:</span>
                <span class="font-bold text-blue-700">${s3.annual_rwh_m3.toLocaleString()} m³/yr</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-slate-500">Solar Generation:</span>
                <span class="font-bold text-amber-600">${s3.annual_solar_kwh.toLocaleString()} kWh/yr</span>
              </div>
              <div class="flex justify-between pt-1">
                <span class="text-slate-500 font-semibold">Sustainability Score:</span>
                <span class="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-sm">${s3.score} / 100</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Comparative Multi-Bar Charts -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Chart 1: Peak Stormwater Runoff (Q) Across 3 States -->
          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 class="text-sm font-bold text-slate-800">Peak Stormwater Runoff Comparison (m³/hr)</h3>
            <div class="relative h-64">
              <canvas id="chart-compare-runoff"></canvas>
            </div>
            <p class="text-[11px] text-slate-500">
              Notice how unmitigated development drastically spikes peak runoff, whereas permeable paving and green roofs suppress runoff below baseline levels.
            </p>
          </div>

          <!-- Chart 2: Tree Inventory & Canopy Dynamics -->
          <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 class="text-sm font-bold text-slate-800">Tree Inventory & Ecosystem Retention</h3>
            <div class="relative h-64">
              <canvas id="chart-compare-trees"></canvas>
            </div>
            <p class="text-[11px] text-slate-500">
              Compensatory planting (3:1 ratio) neutralizes the canopy deficit and increases site biodiversity over a 10-year growth timeline.
            </p>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.initCharts(s1, s2, s3);
    }, 100);
  },

  initCharts(s1, s2, s3) {
    if (!window.Chart) return;
    Object.values(this.charts).forEach(c => { if (c) c.destroy(); });
    this.charts = {};

    // 1. Runoff Comparison Bar Chart
    const ctxRunoff = document.getElementById("chart-compare-runoff");
    if (ctxRunoff) {
      this.charts.runoff = new window.Chart(ctxRunoff, {
        type: "bar",
        data: {
          labels: ["Pre-Development", "Proposed Construction", "Green Intervention Plan"],
          datasets: [{
            label: "Peak Runoff Rate Q (m³/hr)",
            data: [s1.peak_runoff_m3_hr, s2.peak_runoff_m3_hr, s3.peak_runoff_m3_hr],
            backgroundColor: ["#64748b", "#f43f5e", "#10b981"],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: "#f8fafc" }, title: { display: true, text: "Peak Runoff (m³/hr)" } }
          }
        }
      });
    }

    // 2. Tree Inventory Comparison Bar Chart
    const ctxTrees = document.getElementById("chart-compare-trees");
    if (ctxTrees) {
      this.charts.trees = new window.Chart(ctxTrees, {
        type: "bar",
        data: {
          labels: ["Pre-Development", "Proposed Construction", "Green Intervention Plan"],
          datasets: [{
            label: "Tree Count",
            data: [s1.tree_count, s2.tree_count, s3.tree_count],
            backgroundColor: ["#64748b", "#f43f5e", "#059669"],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: "#f8fafc" }, title: { display: true, text: "Tree Population" } }
          }
        }
      });
    }
  }
};
