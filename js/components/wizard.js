/**
 * EcoBuild Smart - 8-Step Project Wizard with Inter-Parameter Correlation Engine
 * Features:
 * - Smart Auto-Correlation Toggle (ON by default)
 * - Automatic computation of Footprint, Roof, GFA, NBC Occupancy, Water Demand, and Tree counts
 * - 1-Click "Auto-Balance Open Surfaces"
 * - Basic & Advanced user modes
 * - Real-time validation and climate API retrieval
 */

window.ProjectWizard = {
  currentStep: 1,
  totalSteps: 8,
  userMode: "advanced",
  autoCorrelate: true,
  projectData: null,

  init(initialData = null) {
    this.projectData = initialData ? JSON.parse(JSON.stringify(initialData)) : JSON.parse(JSON.stringify(window.ECO_SAMPLE_PROJECTS.kolhapur_academic));
    this.userMode = this.projectData.user_mode || "advanced";
    this.currentStep = 1;
    this.render();
  },

  toggleAutoCorrelate() {
    this.autoCorrelate = !this.autoCorrelate;
    this.render();
  },

  setMode(mode) {
    this.userMode = mode;
    this.projectData.user_mode = mode;
    this.render();
  },

  goToStep(step) {
    if (step < 1 || step > this.totalSteps) return;

    if (step > this.currentStep) {
      const val = window.ValidationEngine.validateStep(this.currentStep, this.projectData);
      if (!val.isValid) {
        this.displayValidationErrors(val.errors);
        return;
      }
    }

    this.currentStep = step;
    this.render();

    if (this.currentStep === 8) {
      this.fetchEnvironmentalReview();
    }
    if (this.currentStep === 2 && window.MapModule) {
      setTimeout(() => {
        window.MapModule.init("wizard-site-map", this.projectData.location.latitude, this.projectData.location.longitude, this.projectData.site.plot_area);
      }, 100);
    }
  },

  displayValidationErrors(errors) {
    const errorContainer = document.getElementById("wizard-error-banner");
    if (!errorContainer) return;
    const messages = Object.values(errors).map(msg => `<li>• ${msg}</li>`).join("");
    errorContainer.innerHTML = `<ul class="text-xs text-rose-700 space-y-1 font-medium">${messages}</ul>`;
    errorContainer.classList.remove("hidden");
  },

  clearErrors() {
    const errorContainer = document.getElementById("wizard-error-banner");
    if (errorContainer) {
      errorContainer.innerHTML = "";
      errorContainer.classList.add("hidden");
    }
  },

  loadSample(key = "kolhapur_academic") {
    if (window.ECO_SAMPLE_PROJECTS[key]) {
      this.projectData = JSON.parse(JSON.stringify(window.ECO_SAMPLE_PROJECTS[key]));
      this.userMode = this.projectData.user_mode || "advanced";
      this.currentStep = 1;
      this.render();
    }
  },

  render() {
    const container = document.getElementById("wizard-container");
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden font-sans text-stone-800">
        <!-- Wizard Header -->
        <div class="bg-[#14281D] text-white p-6 md:p-8 border-b border-stone-800">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Step ${this.currentStep} of ${this.totalSteps}
                </span>
                <span class="text-xs text-stone-300 font-medium">Environmental Planning Intake</span>
              </div>
              <h2 class="text-2xl md:text-3xl font-black tracking-tight font-serif text-white">${this.getStepTitle(this.currentStep)}</h2>
              <p class="text-stone-300 text-xs mt-1 max-w-xl leading-relaxed">${this.getStepDescription(this.currentStep)}</p>
            </div>

            <!-- Smart Auto-Correlation Switch & Mode Control -->
            <div class="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
              <!-- Smart Correlation Toggle -->
              <button 
                type="button" 
                onclick="window.ProjectWizard.toggleAutoCorrelate()" 
                class="px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${this.autoCorrelate ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm' : 'bg-stone-900 text-stone-400 border-stone-700'}"
                title="When ON, entering plot or footprint auto-calculates open space, GFA, NBC occupants, water needs, and tree density">
                <span>⚡ Smart Correlation:</span>
                <span class="${this.autoCorrelate ? 'text-amber-300' : 'text-stone-500'} font-black">${this.autoCorrelate ? 'ON' : 'OFF'}</span>
              </button>

              <!-- Mode Toggle -->
              <div class="bg-stone-900/90 p-1 rounded-xl border border-stone-700 flex text-xs">
                <button onclick="window.ProjectWizard.setMode('basic')" class="px-3 py-1.5 rounded-lg font-medium transition ${this.userMode === 'basic' ? 'bg-white text-stone-900 font-bold shadow-sm' : 'text-stone-400 hover:text-white'}">
                  Basic
                </button>
                <button onclick="window.ProjectWizard.setMode('advanced')" class="px-3 py-1.5 rounded-lg font-medium transition ${this.userMode === 'advanced' ? 'bg-white text-stone-900 font-bold shadow-sm' : 'text-stone-400 hover:text-white'}">
                  Advanced
                </button>
              </div>

              <!-- Demo Button -->
              <button onclick="window.ProjectWizard.loadSample('kolhapur_academic')" class="px-3 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-emerald-300 border border-stone-700 transition">
                Load Kolhapur Demo
              </button>
            </div>
          </div>

          <!-- Step Navigation Progress Bar -->
          <div class="grid grid-cols-8 gap-2 mt-6">
            ${Array.from({ length: 8 }).map((_, idx) => {
              const sNum = idx + 1;
              const isActive = sNum === this.currentStep;
              const isPast = sNum < this.currentStep;
              return `
                <button onclick="window.ProjectWizard.goToStep(${sNum})" class="text-left group focus:outline-none">
                  <div class="h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-amber-400' : isPast ? 'bg-emerald-400' : 'bg-stone-800'}"></div>
                  <span class="text-[10px] hidden md:block mt-1.5 truncate ${isActive ? 'text-amber-300 font-bold' : isPast ? 'text-emerald-300 font-semibold' : 'text-stone-400'}">
                    ${this.getStepShortLabel(sNum)}
                  </span>
                </button>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Validation Error Banner -->
        <div id="wizard-error-banner" class="hidden p-4 bg-rose-50 border-b border-rose-200"></div>

        <!-- Form Step Content -->
        <div class="p-6 md:p-8">
          <form id="wizard-form" onsubmit="event.preventDefault();">
            ${this.renderStepContent(this.currentStep)}
          </form>
        </div>

        <!-- Footer Navigation -->
        <div class="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button 
            type="button" 
            onclick="window.ProjectWizard.goToStep(${this.currentStep - 1})"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition ${this.currentStep === 1 ? 'invisible' : ''}">
            &larr; Back
          </button>

          <div class="flex items-center gap-3">
            ${this.currentStep === this.totalSteps ? `
              <button 
                type="button" 
                onclick="window.ProjectWizard.submitProject()"
                class="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition flex items-center gap-2">
                <span>Run Environmental Assessment</span>
                <span>&rarr;</span>
              </button>
            ` : `
              <button 
                type="button" 
                onclick="window.ProjectWizard.goToStep(${this.currentStep + 1})"
                class="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 transition">
                Next: ${this.getStepShortLabel(this.currentStep + 1)} &rarr;
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  },

  getStepTitle(step) {
    const titles = [
      "",
      "Project Identification & Typology",
      "Site Spatial Dimensions & Location",
      "Vegetation & Existing Tree Inventory",
      "Surface Material Breakdown & Permeability",
      "Water Demand & Rainwater Infrastructure",
      "Energy Consumption & Rooftop Solar Potential",
      "Construction Waste & Recycling Strategy",
      "Real Online Environmental Conditions Review"
    ];
    return titles[step] || "";
  },

  getStepDescription(step) {
    const descs = [
      "",
      "Specify project identity and building classification. Typology establishes occupancy standards and water consumption baselines.",
      "Input total plot area, building footprint, floor count, and geographic coordinates. Coordinates trigger live meteorological retrieval.",
      "Document existing green space and tree counts. Tree felling triggers statutory compensatory planting calculations.",
      "Break down hardscape and natural ground covers. Surface distribution governs the Rational composite runoff coefficient (C).",
      "Quantify occupancy population and daily water needs. Computes harvestable rooftop rainwater and optimal storage tank sizing.",
      "Specify annual power usage and assess rooftop photovoltaic (PV) generation potential and grid carbon offset.",
      "Estimate construction debris and target recycling percentages under C&D Waste Management Rules.",
      "Inspect live meteorological, precipitation, air quality (AQI), and solar radiation datasets pulled from open scientific APIs."
    ];
    return descs[step] || "";
  },

  getStepShortLabel(step) {
    const labels = ["", "1. Project", "2. Site", "3. Vegetation", "4. Surfaces", "5. Water", "6. Energy", "7. Waste", "8. Environment"];
    return labels[step] || "";
  },

  renderStepContent(step) {
    const p = this.projectData;
    const isAdv = this.userMode === "advanced";
    const auto = this.autoCorrelate;

    switch (step) {
      case 1:
        return `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Project Name *</label>
                <input type="text" value="${p.name || ''}" onchange="window.ProjectWizard.updateField('name', this.value)" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Kolhapur Campus Expansion" required>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Building Typology / Classification *</label>
                <select onchange="window.ProjectWizard.handleTypologyChange(this.value)" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800">
                  ${["Institutional", "Residential", "Commercial", "Educational", "Industrial", "Mixed-use", "Other"].map(bt => `
                    <option value="${bt}" ${p.building_type === bt ? 'selected' : ''}>${bt}</option>
                  `).join("")}
                </select>
                <p class="text-[11px] text-slate-500 mt-1">Establishes NBC occupancy density and baseline per-capita water consumption (LPCD).</p>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Academic / Project Description</label>
                <textarea onchange="window.ProjectWizard.updateField('description', this.value)" rows="3" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500" placeholder="Academic project notes, research parameters...">${p.description || ''}</textarea>
              </div>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>⚡</span> Smart Parameter Auto-Correlation System
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                EcoBuild Smart features an intelligent correlation engine. As you type primary spatial dimensions (such as Plot Area or Building Type), related parameters (building footprint, roof area, NBC occupants, water demand, and surface allocations) automatically calculate sensible, physically sound defaults.
              </p>
              <div class="border-t border-slate-200 pt-3 text-xs space-y-1 text-slate-500">
                <div>• Current Auto-Correlation: <strong class="${auto ? 'text-emerald-700' : 'text-slate-600'}">${auto ? 'Active (Auto-fills dependent fields)' : 'Disabled (Manual entry)'}</strong></div>
                <div>• User Mode: <strong class="text-slate-800">${isAdv ? 'Advanced Engineering Mode' : 'Basic Student Mode'}</strong></div>
              </div>
            </div>
          </div>
        `;

      case 2:
        return `
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Plot Area (m²) *</label>
                </div>
                <input type="number" min="10" step="10" value="${p.site.plot_area}" oninput="window.ProjectWizard.handlePlotAreaChange(parseFloat(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-semibold">
                <span class="text-[11px] text-slate-500 block mt-1">Total cadastral boundary</span>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Building Footprint (m²) *</label>
                  ${auto ? '<span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Auto-Linked</span>' : ''}
                </div>
                <input type="number" min="10" step="10" value="${p.site.built_up_area}" oninput="window.ProjectWizard.handleBuiltUpChange(parseFloat(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-semibold">
                <span class="text-[11px] text-slate-500 block mt-1">Ground plinth area (${Math.round((p.site.built_up_area / p.site.plot_area) * 100)}% coverage)</span>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Number of Floors *</label>
                  ${auto ? '<span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Auto-Linked</span>' : ''}
                </div>
                <input type="number" min="1" max="50" value="${p.site.floors}" oninput="window.ProjectWizard.handleFloorsChange(parseInt(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-semibold">
                <span class="text-[11px] text-slate-500 block mt-1">Gross floor area = Footprint × Floors</span>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Roof Area (m²) *</label>
                  ${auto ? '<span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Auto-Linked</span>' : ''}
                </div>
                <input type="number" min="10" step="10" value="${p.site.roof_area}" onchange="window.ProjectWizard.updateSiteField('roof_area', parseFloat(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500">
                <span class="text-[11px] text-slate-500 block mt-1">Catchment for RWH and Solar array</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Calculated Open Ground (m²)</label>
                <input type="text" readonly value="${Math.max(0, p.site.plot_area - p.site.built_up_area).toLocaleString()} m²" class="w-full px-3.5 py-2 rounded-xl bg-slate-100 border text-sm font-bold text-slate-700">
                <span class="text-[11px] text-slate-500 block mt-1">Plot Area minus Footprint</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Gross Floor Area (m²)</label>
                <input type="text" readonly value="${(p.site.built_up_area * p.site.floors).toLocaleString()} m²" class="w-full px-3.5 py-2 rounded-xl bg-slate-100 border text-sm font-bold text-slate-700">
                <span class="text-[11px] text-slate-500 block mt-1">Determines NBC occupant density</span>
              </div>
            </div>

            <!-- Location Section -->
            <div class="border-t border-slate-200 pt-5 space-y-3">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Geographic Location & Coordinates</h4>
                <div class="flex items-center gap-1.5">
                  <button type="button" onclick="window.ProjectWizard.quickSetCity('kolhapur')" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Kolhapur</button>
                  <button type="button" onclick="window.ProjectWizard.quickSetCity('pune')" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">Pune</button>
                  <button type="button" onclick="window.ProjectWizard.quickSetCity('mumbai')" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">Mumbai</button>
                  <button type="button" onclick="window.ProjectWizard.quickSetCity('delhi')" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">Delhi</button>
                  <button type="button" onclick="window.MapModule.requestUserGeolocation()" class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1">
                    <span>📍</span> Use GPS
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-2 relative">
                  <input 
                    type="text" 
                    id="wizard-city-search" 
                    value="${p.location.address || p.location.city}" 
                    placeholder="Search city, town, or address..." 
                    class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500">
                  <button 
                    type="button" 
                    onclick="window.ProjectWizard.searchLocation()" 
                    class="absolute right-1.5 top-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold">
                    Search
                  </button>
                  <div id="wizard-geocode-results" class="hidden mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto text-xs z-20"></div>
                </div>

                <div class="flex gap-2">
                  <input type="number" step="0.0001" value="${p.location.latitude}" onchange="window.ProjectWizard.updateCoordinate('lat', parseFloat(this.value))" placeholder="Latitude" class="w-1/2 px-2.5 py-2 text-xs border rounded-xl font-mono">
                  <input type="number" step="0.0001" value="${p.location.longitude}" onchange="window.ProjectWizard.updateCoordinate('lon', parseFloat(this.value))" placeholder="Longitude" class="w-1/2 px-2.5 py-2 text-xs border rounded-xl font-mono">
                </div>
              </div>

              <div class="rounded-xl overflow-hidden border border-slate-300 relative shadow-inner">
                <div id="wizard-site-map" style="height: 240px;" class="w-full bg-slate-100"></div>
              </div>
            </div>
          </div>
        `;

      case 3:
        return `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Pre-Development Green Cover (m²) *</label>
                  ${auto ? '<span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Auto-Linked</span>' : ''}
                </div>
                <input type="number" min="0" step="50" value="${p.vegetation.existing_green_area}" oninput="window.ProjectWizard.handleGreenAreaChange(parseFloat(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold">
                <span class="text-[11px] text-slate-500 block mt-1">Lawn and natural unpaved soil</span>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Existing Mature Trees *</label>
                  ${auto ? '<span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Auto-Estimated (1 per 30m²)</span>' : ''}
                </div>
                <input type="number" min="0" step="1" value="${p.vegetation.existing_tree_count}" onchange="window.ProjectWizard.updateVegField('existing_tree_count', parseInt(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold">
                <span class="text-[11px] text-slate-500 block mt-1">Inventory of mature on-site trees</span>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-rose-800 uppercase tracking-wider">Trees Felled / Removed *</label>
                  ${auto ? '<span class="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">Auto-Estimated (~35%)</span>' : ''}
                </div>
                <input type="number" min="0" max="${p.vegetation.existing_tree_count}" step="1" value="${p.vegetation.trees_removed}" onchange="window.ProjectWizard.updateVegField('trees_removed', parseInt(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-rose-300 bg-rose-50/30 text-sm font-bold text-rose-900">
                <span class="text-[11px] text-rose-600 block mt-1">Triggers mandatory 3:1 replacement ratio</span>
              </div>

              ${isAdv ? `
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Tree Canopy Description</label>
                  <input type="text" value="${p.vegetation.tree_category || ''}" onchange="window.ProjectWizard.updateVegField('tree_category', this.value)" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" placeholder="e.g. Mixed Tropical (Neem, Karanj, Gulmohar)">
                </div>
              ` : ''}
            </div>

            <div class="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-3">
              <h4 class="text-xs font-bold text-emerald-900 uppercase tracking-wider">Canopy & Replacement Forecast</h4>
              <div class="space-y-2.5 text-xs text-emerald-900">
                <div class="flex justify-between">
                  <span>Existing Green Ratio:</span>
                  <span class="font-bold">${Math.round((p.vegetation.existing_green_area / p.site.plot_area) * 100)}% of plot</span>
                </div>
                <div class="w-full bg-emerald-200 rounded-full h-2">
                  <div class="bg-emerald-700 h-2 rounded-full" style="width: ${Math.min(100, Math.round((p.vegetation.existing_green_area / p.site.plot_area) * 100))}%"></div>
                </div>
                <div class="flex justify-between border-t border-emerald-200/80 pt-2">
                  <span>Trees Retained:</span>
                  <span class="font-bold">${Math.max(0, p.vegetation.existing_tree_count - p.vegetation.trees_removed)} trees</span>
                </div>
                <div class="flex justify-between">
                  <span>Statutory 3:1 Compensatory Planting:</span>
                  <span class="font-black text-rose-700">${p.vegetation.trees_removed * 3} trees</span>
                </div>
                <div class="flex justify-between">
                  <span>Canopy Area Lost:</span>
                  <span class="font-bold">~${p.vegetation.trees_removed * 35} m²</span>
                </div>
              </div>
            </div>
          </div>
        `;

      case 4:
        return `
          <div class="space-y-5">
            <div class="flex items-center justify-between">
              <p class="text-xs text-slate-500">
                External surface partitioning establishes the composite runoff coefficient ($C$).
              </p>
              <button 
                type="button" 
                onclick="window.ProjectWizard.autoBalanceSurfacesClick()" 
                class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 transition">
                <span>⚡ Auto-Balance Open Surfaces</span>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Concrete Paved (m²)</label>
                <input type="number" min="0" step="50" value="${p.surfaces.concrete_area}" onchange="window.ProjectWizard.updateSurfField('concrete_area', parseFloat(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold">
                <span class="text-[11px] text-slate-500">Runoff C = 0.90 (Impervious)</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Asphalt / Bitumen (m²)</label>
                <input type="number" min="0" step="50" value="${p.surfaces.asphalt_area || 0}" onchange="window.ProjectWizard.updateSurfField('asphalt_area', parseFloat(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold">
                <span class="text-[11px] text-slate-500">Runoff C = 0.85 (Impervious)</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Interlocking Tiles / Pavers (m²)</label>
                <input type="number" min="0" step="20" value="${p.surfaces.tiles_pavers || 0}" onchange="window.ProjectWizard.updateSurfField('tiles_pavers', parseFloat(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold">
                <span class="text-[11px] text-slate-500">Runoff C = 0.70</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Bare Soil / Open Ground (m²)</label>
                <input type="number" min="0" step="50" value="${p.surfaces.soil_open_ground || 0}" onchange="window.ProjectWizard.updateSurfField('soil_open_ground', parseFloat(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold">
                <span class="text-[11px] text-slate-500">Runoff C = 0.45 (Natural)</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Roof Area (from Step 2)</label>
                <input type="text" readonly value="${p.site.roof_area.toLocaleString()} m²" class="w-full px-3.5 py-2 rounded-xl bg-slate-100 border text-sm font-bold text-slate-700">
                <span class="text-[11px] text-slate-500">Runoff C = 0.85</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Available Open Site Area</label>
                <input type="text" readonly value="${Math.max(0, p.site.plot_area - p.site.built_up_area).toLocaleString()} m²" class="w-full px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-bold text-emerald-800">
                <span class="text-[11px] text-emerald-700">Plot Area minus Built Footprint</span>
              </div>
            </div>
          </div>
        `;

      case 5:
        return `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Number of Occupants *</label>
                  ${auto ? '<span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Auto-Linked (NBC Density)</span>' : ''}
                </div>
                <input type="number" min="1" step="5" value="${p.water.occupants}" onchange="window.ProjectWizard.updateWaterField('occupants', parseInt(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500">
                <span class="text-[11px] text-slate-500 block mt-1">Calculated from GFA (${p.site.built_up_area * p.site.floors} m²) and ${p.building_type} density</span>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Consumption Standard (LPCD)</label>
                  ${auto ? '<span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">NBC 2016 Standard</span>' : ''}
                </div>
                <input type="number" min="20" max="300" value="${p.water.daily_consumption_lpcd}" onchange="window.ProjectWizard.updateWaterField('daily_consumption_lpcd', parseFloat(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold">
                <span class="text-[11px] text-slate-500 block mt-1">Litres Per Capita per Day</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Existing Rainwater Tank Capacity (L)</label>
                <input type="number" min="0" step="5000" value="${p.water.storage_capacity_litres || 0}" onchange="window.ProjectWizard.updateWaterField('storage_capacity_litres', parseFloat(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm">
                <span class="text-[11px] text-slate-500 block mt-1">Existing storage (0 if new proposed development)</span>
              </div>
            </div>

            <div class="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 space-y-3">
              <h4 class="text-xs font-bold text-blue-900 uppercase tracking-wider">Daily Hydrological Demand</h4>
              <div class="space-y-2 text-xs text-blue-900">
                <div class="flex justify-between">
                  <span>Daily Demand:</span>
                  <span class="font-bold">${(p.water.occupants * p.water.daily_consumption_lpcd).toLocaleString()} L/day</span>
                </div>
                <div class="flex justify-between">
                  <span>Annual Water Requirement:</span>
                  <span class="font-bold">${Math.round((p.water.occupants * p.water.daily_consumption_lpcd * 365) / 1000).toLocaleString()} m³/yr</span>
                </div>
                <div class="flex justify-between border-t border-blue-200/80 pt-2">
                  <span>Non-Potable (Flushing & Landscaping):</span>
                  <span class="font-bold text-blue-950">${Math.round(p.water.occupants * p.water.daily_consumption_lpcd * 0.4).toLocaleString()} L/day (40%)</span>
                </div>
              </div>
            </div>
          </div>
        `;

      case 6:
        return `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Annual Electricity Consumption (kWh)</label>
                <input type="number" min="0" step="1000" value="${p.energy.annual_electricity_kwh}" onchange="window.ProjectWizard.updateEnergyField('annual_electricity_kwh', parseFloat(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold">
                <span class="text-[11px] text-slate-500 block mt-1">Grid power usage benchmark</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Existing Installed Solar Array (m²)</label>
                <input type="number" min="0" max="${p.site.roof_area}" step="20" value="${p.energy.solar_panel_area_m2 || 0}" onchange="window.ProjectWizard.updateEnergyField('solar_panel_area_m2', parseFloat(this.value))" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm">
                <span class="text-[11px] text-slate-500 block mt-1">0 for new proposed development</span>
              </div>
            </div>

            <div class="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-3">
              <h4 class="text-xs font-bold text-amber-900 uppercase tracking-wider">Rooftop Solar PV Feasibility</h4>
              <p class="text-xs text-amber-800 leading-relaxed">
                With <strong>${p.site.roof_area.toLocaleString()} m²</strong> of roof area, allocating ~35% (${Math.round(p.site.roof_area * 0.35)} m²) can accommodate a <strong>${Math.round(p.site.roof_area * 0.35 * 0.18)} kWp</strong> solar array producing ~${Math.round(p.site.roof_area * 0.35 * 0.18 * 5.3 * 365 * 0.75).toLocaleString()} kWh/yr of clean energy.
              </p>
            </div>
          </div>
        `;

      case 7:
        // Ensure waste parameters are calculated with latest empirical benchmarks
        if (auto && window.CorrelationEngine) {
          window.CorrelationEngine.autoCalculateWaste(p);
        }
        const bType = (p.building_type || "institutional").toLowerCase();
        const rateNorm = window.ECO_CONFIG?.C_AND_D_WASTE_FACTORS?.[bType]?.rate_kg_m2 || 60;
        const totalTonnes = p.waste?.construction_waste_tonnes || 0;
        const recyclingPct = p.waste?.recycling_pct || 65;
        const divertedTonnes = Math.round(totalTonnes * (recyclingPct / 100) * 10) / 10;
        const dailyMsw = p.waste?.daily_solid_waste_kg || 50;
        const dailyOrganic = p.waste?.daily_organic_waste_kg || 25;

        return `
          <div class="space-y-6">
            <!-- Header Banner -->
            <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                  <span>🏗️</span> Official Empirical Dataset: TIFAC (DST) & CPCB C&D Rules 2016
                </span>
                <h4 class="text-sm font-bold text-slate-800 mt-1">Automated Construction & Municipal Solid Waste Estimator</h4>
                <p class="text-xs text-slate-600">Calculated from Gross Floor Area (${((p.site.built_up_area || 0) * (p.site.floors || 1)).toLocaleString()} m² @ ${rateNorm} kg/m²) and NBC Occupancy (${p.water.occupants} persons).</p>
              </div>
              <button type="button" onclick="window.ProjectWizard.recalculateWasteNorms()" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50 shadow-sm transition flex items-center gap-1.5 shrink-0">
                <span>🔄</span> Recalculate via Official Datasets
              </button>
            </div>

            <!-- Input Fields Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Construction Waste -->
              <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="text-[11px] font-bold text-slate-700 uppercase">C&D Waste</label>
                  <span class="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Auto-Filled</span>
                </div>
                <div class="relative">
                  <input type="number" min="0" step="5" value="${totalTonnes}" onchange="window.ProjectWizard.updateWasteField('construction_waste_tonnes', parseFloat(this.value))" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-800">
                  <span class="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">Tonnes</span>
                </div>
                <p class="text-[10px] text-slate-500">TIFAC norm: ${rateNorm} kg/m² GFA</p>
              </div>

              <!-- Diversion Target -->
              <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="text-[11px] font-bold text-slate-700 uppercase">Recycling Target</label>
                  <span class="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">CPCB 65% Target</span>
                </div>
                <div class="relative">
                  <input type="number" min="0" max="100" value="${recyclingPct}" onchange="window.ProjectWizard.updateWasteField('recycling_pct', parseFloat(this.value))" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-800">
                  <span class="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">%</span>
                </div>
                <p class="text-[10px] text-emerald-600 font-semibold">~${divertedTonnes} tonnes diverted</p>
              </div>

              <!-- Daily MSW -->
              <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="text-[11px] font-bold text-slate-700 uppercase">Daily Solid Waste</label>
                  <span class="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">CPHEEO Norm</span>
                </div>
                <div class="relative">
                  <input type="number" min="0" step="5" value="${dailyMsw}" onchange="window.ProjectWizard.updateWasteField('daily_solid_waste_kg', parseFloat(this.value))" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-800">
                  <span class="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">kg/day</span>
                </div>
                <p class="text-[10px] text-slate-500">Per capita: ${(dailyMsw / Math.max(1, p.water.occupants)).toFixed(2)} kg/day</p>
              </div>

              <!-- Organic Fraction -->
              <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="text-[11px] font-bold text-slate-700 uppercase">Organic / Compostable</label>
                  <span class="text-[9px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">On-Site Loop</span>
                </div>
                <div class="relative">
                  <input type="number" min="0" step="5" value="${dailyOrganic}" onchange="window.ProjectWizard.updateWasteField('daily_organic_waste_kg', parseFloat(this.value))" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-800">
                  <span class="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">kg/day</span>
                </div>
                <p class="text-[10px] text-amber-700 font-semibold">Yield: ~${Math.round(dailyOrganic * 365 * 0.25 / 1000 * 10) / 10} t/yr bio-compost</p>
              </div>
            </div>

            <!-- Material Composition Breakdown Card -->
            <div class="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">C&D Material Composition Breakdown (CPCB 2016 Scientific Norms)</h4>
                  <p class="text-[11px] text-slate-500">Empirical distribution of debris streams and circular on-site recovery potential</p>
                </div>
                <span class="text-xs font-bold text-slate-700">Total: ${totalTonnes} Tonnes</span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center text-xs">
                <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <span class="text-[9px] font-bold text-amber-800 block uppercase">Soil & Sand</span>
                  <div class="text-sm font-extrabold text-amber-900">${Math.round(totalTonnes * 0.36 * 10) / 10} t</div>
                  <span class="text-[10px] text-amber-700">36% (Filling)</span>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-100 border border-slate-300">
                  <span class="text-[9px] font-bold text-slate-700 block uppercase">Concrete Rubble</span>
                  <div class="text-sm font-extrabold text-slate-800">${Math.round(totalTonnes * 0.31 * 10) / 10} t</div>
                  <span class="text-[10px] text-slate-600">31% (RCA Aggregates)</span>
                </div>
                <div class="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                  <span class="text-[9px] font-bold text-rose-800 block uppercase">Bricks/Masonry</span>
                  <div class="text-sm font-extrabold text-rose-900">${Math.round(totalTonnes * 0.10 * 10) / 10} t</div>
                  <span class="text-[10px] text-rose-700">10% (Pervious Bed)</span>
                </div>
                <div class="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                  <span class="text-[9px] font-bold text-blue-800 block uppercase">Metals / Rebar</span>
                  <div class="text-sm font-extrabold text-blue-900">${Math.round(totalTonnes * 0.05 * 10) / 10} t</div>
                  <span class="text-[10px] text-blue-700">5% (100% Scrap)</span>
                </div>
                <div class="p-2.5 rounded-xl bg-yellow-50 border border-yellow-200">
                  <span class="text-[9px] font-bold text-yellow-800 block uppercase">Timber / Wood</span>
                  <div class="text-sm font-extrabold text-yellow-900">${Math.round(totalTonnes * 0.05 * 10) / 10} t</div>
                  <span class="text-[10px] text-yellow-700">5% (Biomass/Reuse)</span>
                </div>
                <div class="p-2.5 rounded-xl bg-stone-100 border border-stone-300">
                  <span class="text-[9px] font-bold text-stone-700 block uppercase">Bitumen</span>
                  <div class="text-sm font-extrabold text-stone-800">${Math.round(totalTonnes * 0.02 * 10) / 10} t</div>
                  <span class="text-[10px] text-stone-600">2% (RAP Recycling)</span>
                </div>
                <div class="p-2.5 rounded-xl bg-purple-50 border border-purple-200">
                  <span class="text-[9px] font-bold text-purple-800 block uppercase">Other / Packaging</span>
                  <div class="text-sm font-extrabold text-purple-900">${Math.round(totalTonnes * 0.11 * 10) / 10} t</div>
                  <span class="text-[10px] text-purple-700">11% (Co-processing)</span>
                </div>
              </div>
            </div>
          </div>
        `;

      case 8:
        return `
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Environmental API Data Verification</h4>
                <p class="text-xs text-slate-500">Live feeds fetched for coordinates (${p.location.latitude.toFixed(4)}, ${p.location.longitude.toFixed(4)})</p>
              </div>
              <button type="button" onclick="window.ProjectWizard.fetchEnvironmentalReview(true)" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 flex items-center gap-1.5 transition">
                <span>🔄</span> Refresh Live APIs
              </button>
            </div>

            <div id="wizard-env-review-grid" class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="p-4 rounded-xl border bg-slate-50 animate-pulse text-xs">Querying weather...</div>
              <div class="p-4 rounded-xl border bg-slate-50 animate-pulse text-xs">Querying rainfall...</div>
              <div class="p-4 rounded-xl border bg-slate-50 animate-pulse text-xs">Querying AQI...</div>
              <div class="p-4 rounded-xl border bg-slate-50 animate-pulse text-xs">Querying solar...</div>
            </div>

            <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
              <div class="font-bold flex items-center gap-1.5">
                <span>✓</span> Model Ready for Dynamic Impact Assessment
              </div>
              <p>
                Clicking <strong>Run Environmental Assessment</strong> will execute the mathematical calculation engine, generate the tri-state Before vs After simulation, and update the Plan History.
              </p>
            </div>
          </div>
        `;
    }
  },

  // Handlers for Smart Inter-Parameter Correlations
  handlePlotAreaChange(val) {
    if (isNaN(val) || val <= 0) return;
    this.projectData = window.CorrelationEngine.onPlotAreaChange(val, this.projectData, this.autoCorrelate);
    this.clearErrors();
    this.render();
  },

  handleBuiltUpChange(val) {
    if (isNaN(val) || val <= 0) return;
    this.projectData.site.built_up_area = val;
    this.projectData = window.CorrelationEngine.onBuiltUpOrFloorsChange(this.projectData, this.autoCorrelate);
    this.clearErrors();
    this.render();
  },

  handleFloorsChange(val) {
    if (isNaN(val) || val < 1) return;
    this.projectData.site.floors = val;
    this.projectData = window.CorrelationEngine.onBuiltUpOrFloorsChange(this.projectData, this.autoCorrelate);
    this.clearErrors();
    this.render();
  },

  handleTypologyChange(val) {
    this.projectData = window.CorrelationEngine.onBuildingTypeChange(val, this.projectData, this.autoCorrelate);
    this.clearErrors();
    this.render();
  },

  handleGreenAreaChange(val) {
    if (isNaN(val) || val < 0) return;
    this.projectData.vegetation.existing_green_area = val;
    if (this.autoCorrelate) {
      const estTrees = Math.max(5, Math.round(val / 30));
      this.projectData.vegetation.existing_tree_count = estTrees;
      this.projectData.vegetation.trees_removed = Math.min(estTrees, Math.round(estTrees * 0.35));
    }
    this.clearErrors();
    this.render();
  },

  autoBalanceSurfacesClick() {
    this.projectData = window.CorrelationEngine.autoBalanceSurfaces(this.projectData);
    this.clearErrors();
    this.render();
  },

  updateField(key, val) { this.projectData[key] = val; this.clearErrors(); },
  updateSiteField(key, val) { this.projectData.site[key] = val; this.clearErrors(); },
  updateVegField(key, val) { this.projectData.vegetation[key] = val; this.clearErrors(); },
  updateSurfField(key, val) { this.projectData.surfaces[key] = val; this.clearErrors(); },
  updateWaterField(key, val) { this.projectData.water[key] = val; this.clearErrors(); },
  updateEnergyField(key, val) { this.projectData.energy[key] = val; this.clearErrors(); },
  updateWasteField(key, val) { this.projectData.waste[key] = val; this.clearErrors(); },
  recalculateWasteNorms() {
    if (window.CorrelationEngine) {
      window.CorrelationEngine.autoCalculateWaste(this.projectData);
      this.render();
    }
  },

  async quickSetCity(cityKey) {
    const fallback = window.ECO_FALLBACK_DATA[cityKey];
    if (!fallback) return;
    this.projectData.location.city = fallback.city;
    this.projectData.location.state = fallback.state;
    this.projectData.location.country = fallback.country;
    this.projectData.location.latitude = fallback.latitude;
    this.projectData.location.longitude = fallback.longitude;
    this.projectData.location.address = `${fallback.city}, ${fallback.state}, ${fallback.country}`;

    if (window.MapModule) {
      window.MapModule.updateLocation(fallback.latitude, fallback.longitude, this.projectData.site.plot_area);
    }
    this.render();
  },

  async updateCoordinate(type, val) {
    if (isNaN(val)) return;
    if (type === 'lat') this.projectData.location.latitude = val;
    if (type === 'lon') this.projectData.location.longitude = val;

    if (window.MapModule) {
      window.MapModule.updateLocation(this.projectData.location.latitude, this.projectData.location.longitude, this.projectData.site.plot_area);
    }
    const rev = await window.EnvironmentalDataService.reverseGeocode(this.projectData.location.latitude, this.projectData.location.longitude);
    this.projectData.location.city = rev.city;
    this.projectData.location.address = rev.display_name;
  },

  async searchLocation() {
    const input = document.getElementById("wizard-city-search");
    if (!input || !input.value.trim()) return;

    const results = await window.EnvironmentalDataService.getLocationData(input.value.trim());
    const resBox = document.getElementById("wizard-geocode-results");
    if (!resBox) return;

    if (results.length === 0) {
      resBox.innerHTML = `<div class="p-2 text-slate-500">No matching locations found.</div>`;
      resBox.classList.remove("hidden");
      return;
    }

    resBox.innerHTML = results.map((r, idx) => `
      <div onclick="window.ProjectWizard.selectSearchResult(${idx})" class="p-2.5 hover:bg-slate-100 cursor-pointer border-b border-slate-100">
        <div class="font-semibold text-slate-800">${r.display_name}</div>
        <div class="text-[10px] text-slate-500">Lat: ${r.latitude.toFixed(4)}, Lon: ${r.longitude.toFixed(4)}</div>
      </div>
    `).join("");
    resBox.classList.remove("hidden");
    this._lastSearchResults = results;
  },

  selectSearchResult(idx) {
    const item = this._lastSearchResults?.[idx];
    if (!item) return;

    this.projectData.location.city = item.city || "Selected Location";
    this.projectData.location.state = item.state || "";
    this.projectData.location.country = item.country || "";
    this.projectData.location.latitude = item.latitude;
    this.projectData.location.longitude = item.longitude;
    this.projectData.location.address = item.display_name;

    const resBox = document.getElementById("wizard-geocode-results");
    if (resBox) resBox.classList.add("hidden");

    if (window.MapModule) {
      window.MapModule.updateLocation(item.latitude, item.longitude, this.projectData.site.plot_area);
    }
    this.render();
  },

  async fetchEnvironmentalReview(forceRefresh = false) {
    const grid = document.getElementById("wizard-env-review-grid");
    if (!grid) return;

    const lat = this.projectData.location.latitude;
    const lon = this.projectData.location.longitude;

    try {
      const data = await window.EnvironmentalDataService.getCompleteEnvironmentalProfile(lat, lon);
      this.projectData._envData = data;

      const wx = data.weather;
      const rain = data.rainfall;
      const aq = data.airQuality;
      const sol = data.solar;

      grid.innerHTML = `
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase">Climate</span>
          <div class="text-xl font-bold text-slate-800">${wx.temperature.current_c}°C</div>
          <div class="text-[11px] text-slate-500">High: ${wx.temperature.max_c}° | Low: ${wx.temperature.min_c}°</div>
          <div class="text-[9px] text-emerald-700 truncate">🟢 ${wx.source}</div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase">Annual Rainfall</span>
          <div class="text-xl font-bold text-blue-700">${rain.annual_rainfall_mm} mm</div>
          <div class="text-[11px] text-slate-500">Intensity: ${rain.peak_intensity_mm_hr} mm/hr</div>
          <div class="text-[9px] text-emerald-700 truncate">🟢 ERA5 Reanalysis</div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase">Air Quality (AQI)</span>
          <div class="text-xl font-bold text-${aq.category_color}-600">${aq.aqi}</div>
          <div class="text-[11px] text-slate-500">PM2.5: ${aq.pm25} µg/m³</div>
          <div class="text-[9px] text-emerald-700 truncate">🟢 Copernicus CAMS</div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase">Solar Radiation</span>
          <div class="text-xl font-bold text-amber-600">${sol.daily_peak_sun_hours} hrs/d</div>
          <div class="text-[11px] text-slate-500">${sol.annual_solar_radiation_kwh_m2} kWh/m²/yr</div>
          <div class="text-[9px] text-emerald-700 truncate">🟢 NASA POWER</div>
        </div>
      `;
    } catch (err) {
      grid.innerHTML = `<div class="p-4 bg-rose-50 text-rose-800 text-xs rounded-xl">Error loading environmental data: ${err.message}</div>`;
    }
  },

  async submitProject() {
    for (let s = 1; s <= 7; s++) {
      const val = window.ValidationEngine.validateStep(s, this.projectData);
      if (!val.isValid) {
        this.goToStep(s);
        this.displayValidationErrors(val.errors);
        return;
      }
    }

    if (window.App && window.App.onProjectSubmitted) {
      await window.App.onProjectSubmitted(this.projectData);
    }
  }
};
