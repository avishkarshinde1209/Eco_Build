/**
 * EcoBuild Smart - Biodiversity & Native Species Selection Module
 * Provides botanical filtering for Western Ghats and Deccan ecotones:
 * Shade trees, Fruit trees, Native trees, Shrubs, Ground cover, Pollinators.
 */

window.BiodiversityView = {
  activeCategory: "All",

  render(project, calculations, environmentalData) {
    const container = document.getElementById("biodiversity-view");
    if (!container) return;

    const rainfallMm = environmentalData?.rainfall?.annual_rainfall_mm || 1042.8;
    const plants = window.filterRecommendedPlants(this.activeCategory, rainfallMm);
    const categories = ["All", "Shade trees", "Native trees", "Fruit trees", "Shrubs", "Ground cover", "Pollinator-friendly plants"];

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              🦋 Urban Biodiversity & Native Flora
            </span>
            <h1 class="text-2xl font-bold text-slate-800 tracking-tight mt-1">Ecosystem Planting Matrix</h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Ecologically verified native species for ${project.location.city || 'Maharashtra / Western Ghats'} calibrated against annual precipitation (${rainfallMm} mm).
            </p>
          </div>
          <div class="text-xs text-slate-600 bg-slate-50 border px-3 py-2 rounded-lg">
            <span>Target Planting: <strong>${calculations.tree_impact.recommended_planting_quantity} Trees</strong> (${calculations.tree_impact.replacement_ratio}:1 replacement)</span>
          </div>
        </div>

        <!-- Category Filter Buttons -->
        <div class="flex flex-wrap gap-2">
          ${categories.map(cat => `
            <button 
              onclick="window.BiodiversityView.setCategory('${cat}')" 
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${this.activeCategory === cat ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}">
              ${cat === 'All' ? '🌱 All Species' : cat}
            </button>
          `).join("")}
        </div>

        <!-- Species Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${plants.map(p => `
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3 flex flex-col justify-between hover:border-emerald-400 transition">
              <div>
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base leading-tight">${p.name}</h3>
                    <div class="text-xs italic text-slate-500 font-serif">${p.botanical}</div>
                    <div class="text-xs font-medium text-emerald-800 mt-0.5">${p.marathi}</div>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
                    ${p.category}
                  </span>
                </div>

                <div class="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">Mature Canopy</span>
                    <span class="font-semibold text-slate-700">~${p.canopy_spread_m}m spread</span>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">CO₂ Sequestration</span>
                    <span class="font-semibold text-emerald-700">~${p.annual_co2_kg} kg/yr</span>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">Water Demand</span>
                    <span class="font-semibold text-slate-700">${p.water_requirement}</span>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">Root System</span>
                    <span class="font-semibold text-slate-700">${p.root_type.split(' ')[0]}</span>
                  </div>
                </div>

                <div class="mt-3 text-xs space-y-1 text-slate-600">
                  <div><strong>Eco-Benefit:</strong> ${p.air_quality_benefit}</div>
                  <div><strong>Site Placement:</strong> ${p.recommended_for}</div>
                </div>
              </div>

              <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Native Zone: ${p.native_zone.split(',')[0]}</span>
                <span class="text-emerald-600 font-semibold">✓ Non-Invasive</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  },

  setCategory(cat) {
    this.activeCategory = cat;
    this.render(window.App.currentProject, window.App.calculations, window.App.environmentalData);
  }
};
