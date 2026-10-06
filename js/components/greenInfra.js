/**
 * EcoBuild Smart - Green Infrastructure & Sustainable Surfaces Module
 * Models extensive green roofs and permeable pavement retrofitting.
 */

window.GreenInfraView = {
  render(project, calculations, environmentalData) {
    const container = document.getElementById("greeninfra-view");
    if (!container) return;

    const infra = calculations.green_infra_potential;
    const roofArea = project.site.roof_area;
    const concreteArea = project.surfaces.concrete_area;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              🌿 Nature-Based Solutions (NbS)
            </span>
            <h1 class="text-2xl font-bold text-slate-800 tracking-tight mt-1">Green Infrastructure Engineering</h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Decentralized low-impact development (LID) strategies: Extensive green roofs and permeable pavement systems.
            </p>
          </div>
          <button onclick="window.App.switchView('simulator')" class="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">
            Adjust in Simulator &rarr;
          </button>
        </div>

        <!-- Two Column Module: Green Roof on Left, Permeable Pavement on Right -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- MODULE 1: GREEN ROOF -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5 flex flex-col">
            <div class="flex items-center justify-between border-b pb-3">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🌱</span>
                <div>
                  <h3 class="text-base font-bold text-slate-800">Extensive Green Roof System</h3>
                  <span class="text-[11px] text-slate-400">75 - 120mm engineered substrate mat</span>
                </div>
              </div>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                ${infra.green_roof_pct}% Roof Coverage
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div class="text-[10px] text-slate-400 uppercase font-bold">Recommended Area</div>
                <div class="text-xl font-bold text-emerald-700 mt-1">${infra.recommended_green_roof_m2.toLocaleString()} m²</div>
                <div class="text-[11px] text-slate-500">Out of ${roofArea.toLocaleString()} m² total roof</div>
              </div>
              <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div class="text-[10px] text-slate-400 uppercase font-bold">Stormwater Retention</div>
                <div class="text-xl font-bold text-teal-700 mt-1">~${infra.green_roof_stormwater_retention_pct}%</div>
                <div class="text-[11px] text-slate-500">Incident rainfall absorbed at source</div>
              </div>
            </div>

            <div class="space-y-3 text-xs text-slate-600 flex-1">
              <h4 class="font-bold text-slate-800">Biophysical & Thermal Benefits:</h4>
              <div class="flex items-start gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span><strong>Microclimate Cooling:</strong> Evapotranspiration lowers rooftop ambient temperatures by 1.5°C to 3.0°C during peak dry summers (EPA model).</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span><strong>Building Thermal Insulation:</strong> Reduces air conditioning heat flux through RCC ceiling slabs by up to 25%.</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span><strong>Substrate Vegetation:</strong> Recommended planting of drought-hardy succulents (Sedum), Portulaca, and native grasses with minimal drip irrigation.</span>
              </div>
            </div>

            <div class="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-900">
              <span class="font-semibold">Structural Consideration:</span> Extensive green roofs impose ~80-120 kg/m² saturated dead load, within typical RCC slab design safety margins.
            </div>
          </div>

          <!-- MODULE 2: PERMEABLE PAVEMENT -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5 flex flex-col">
            <div class="flex items-center justify-between border-b pb-3">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🧱</span>
                <div>
                  <h3 class="text-base font-bold text-slate-800">Permeable Pavement Conversion</h3>
                  <span class="text-[11px] text-slate-400">Porous asphalt / Interlocking concrete blocks</span>
                </div>
              </div>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                ${infra.permeable_pavement_conversion_pct}% Paving Converted
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div class="text-[10px] text-slate-400 uppercase font-bold">Recommended Area</div>
                <div class="text-xl font-bold text-blue-700 mt-1">${infra.recommended_permeable_pavement_m2.toLocaleString()} m²</div>
                <div class="text-[11px] text-slate-500">Converted from concrete hardscape</div>
              </div>
              <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div class="text-[10px] text-slate-400 uppercase font-bold">Runoff Mitigation</div>
                <div class="text-xl font-bold text-indigo-700 mt-1">-${infra.permeable_runoff_reduction_pct}%</div>
                <div class="text-[11px] text-slate-500">Runoff coefficient drops from 0.90 to 0.25</div>
              </div>
            </div>

            <div class="space-y-3 text-xs text-slate-600 flex-1">
              <h4 class="font-bold text-slate-800">Hydrogeological & Drainage Benefits:</h4>
              <div class="flex items-start gap-2">
                <span class="text-blue-600 font-bold">✓</span>
                <span><strong>Direct Groundwater Recharge:</strong> Permeable pavers with aggregate sub-base filter rainwater directly into unconfined aquifers.</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="text-blue-600 font-bold">✓</span>
                <span><strong>Storm Drain De-congestion:</strong> Alleviates municipal storm sewer choke points during high-intensity tropical cloudbursts.</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="text-blue-600 font-bold">✓</span>
                <span><strong>Puddle & Hydroplaning Elimination:</strong> Rapid drainage provides safe, slip-resistant pedestrian walkways and parking bays.</span>
              </div>
            </div>

            <div class="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-xs text-blue-900">
              <span class="font-semibold">Implementation Strategy:</span> Prioritize parking slots, walkways, and campus pedestrian plazas for permeable paving; retain heavy vehicular truck routes in reinforced concrete.
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
