/**
 * EcoBuild Smart - Consolidated Technical Analysis Studio
 * Unifies Stormwater (Rational Method), Green Infrastructure,
 * Rooftop Solar PV, and Urban Biodiversity into a clean, tabbed workspace.
 */

window.TechnicalAnalysisView = {
  activeSubTab: "stormwater", // "stormwater", "greeninfra", "energy", "biodiversity"

  setSubTab(tab) {
    this.activeSubTab = tab;
    this.renderSubTabContent();
    this.updateTabButtons();
  },

  render(project, calculations, environmentalData) {
    const container = document.getElementById("technical-view");
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-stone-800">
        <!-- Studio Header -->
        <div class="bg-[#14281D] text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-1.5">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Multi-Domain Engineering Diagnostics</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight font-serif text-white mt-1">
              Technical Domain Studio
            </h1>
            <p class="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Academic calculations for rational hydrology, sponge city green infrastructure, solar PV yield curves, and native biodiversity metrics.
            </p>
          </div>

          <!-- Studio Navigation Pill Tabs -->
          <div class="flex items-center gap-1.5 bg-stone-900/90 p-1.5 rounded-2xl border border-stone-700/80 text-xs font-bold overflow-x-auto self-start md:self-center">
            <button id="tech-btn-stormwater" onclick="window.TechnicalAnalysisView.setSubTab('stormwater')" class="px-4 py-2 rounded-xl transition">
              🌧️ Stormwater
            </button>
            <button id="tech-btn-greeninfra" onclick="window.TechnicalAnalysisView.setSubTab('greeninfra')" class="px-4 py-2 rounded-xl transition">
              🌿 Green Infra
            </button>
            <button id="tech-btn-energy" onclick="window.TechnicalAnalysisView.setSubTab('energy')" class="px-4 py-2 rounded-xl transition">
              ☀️ Solar PV
            </button>
            <button id="tech-btn-biodiversity" onclick="window.TechnicalAnalysisView.setSubTab('biodiversity')" class="px-4 py-2 rounded-xl transition">
              🦋 Biodiversity
            </button>
          </div>
        </div>

        <!-- Dynamic Sub-Tab Content Shell -->
        <div id="technical-subtab-container" class="space-y-6"></div>
      </div>
    `;

    this.updateTabButtons();
    this.renderSubTabContent();
  },

  updateTabButtons() {
    const tabs = ["stormwater", "greeninfra", "energy", "biodiversity"];
    tabs.forEach(t => {
      const btn = document.getElementById(`tech-btn-${t}`);
      if (!btn) return;
      if (t === this.activeSubTab) {
        btn.className = "px-4 py-2 rounded-xl transition bg-emerald-600 text-white font-bold shadow-md";
      } else {
        btn.className = "px-4 py-2 rounded-xl transition text-stone-300 hover:text-white font-semibold hover:bg-stone-800/60";
      }
    });
  },

  renderSubTabContent() {
    const subContainer = document.getElementById("technical-subtab-container");
    if (!subContainer) return;

    // Delegate to existing dedicated sub-views within the unified container
    subContainer.id = `${this.activeSubTab}-view`;

    const proj = window.App.currentProject;
    const calc = window.App.calculations;
    const env = window.App.environmentalData;

    switch (this.activeSubTab) {
      case "stormwater":
        window.StormwaterView.render(proj, calc, env);
        break;
      case "greeninfra":
        window.GreenInfraView.render(proj, calc, env);
        break;
      case "energy":
        window.EnergyView.render(proj, calc, env);
        break;
      case "biodiversity":
        window.BiodiversityView.render(proj, calc, env);
        break;
    }
  }
};
