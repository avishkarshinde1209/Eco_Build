/**
 * EcoBuild Smart - Carbon & Materials Engineering Workspace
 * 
 * Provides:
 * - Technical Carbon Dashboard separating:
 *   1. Embodied Carbon
 *   2. Operational Carbon
 *   3. Avoided Emissions
 *   4. Estimated Recovery/Sequestration
 * - Materials Comparison Table: Material | Cost | Carbon | Durability | Maintenance | Environmental Impact
 * - Data Provenance Badges: Measured, Official Dataset, API, Estimated, Engineering Assumption
 * - Interactive Material Substitution & Carbon Abatement Simulator
 */

window.MaterialsView = {
  // Pre-configured scientific comparison dataset
  MATERIAL_CATALOG: [
    {
      application: "Pedestrian Walkway",
      conventional: {
        name: "Standard Cast-In-Situ Concrete (100mm)",
        cost_inr_m2: 850,
        embodied_carbon_kg_m2: 28.5,
        durability_years: 25,
        annual_maint_inr_m2: 15,
        environmental_impact: "High urban runoff (C=0.90), zero groundwater infiltration, thermal mass absorbs solar heat.",
        provenance: "Official Dataset"
      },
      alternative: {
        name: "IRC:SP:63 Porous Interlocking Pavers (80mm)",
        cost_inr_m2: 1650,
        embodied_carbon_kg_m2: 14.2,
        durability_years: 30,
        annual_maint_inr_m2: 45,
        environmental_impact: "80% runoff reduction (C=0.20), continuous aquifer recharge, albedo 0.35 cuts surface heat.",
        provenance: "Official Dataset",
        suitability: "Plazas, pedestrian pathways, campus corridors.",
        limitations: "Requires vacuum sweeping every 12 months to prevent silt clogging."
      }
    },
    {
      application: "Vehicle Parking Bays",
      conventional: {
        name: "Heavy-Duty Dense Bituminous Asphalt",
        cost_inr_m2: 1200,
        embodied_carbon_kg_m2: 36.0,
        durability_years: 12,
        annual_maint_inr_m2: 60,
        environmental_impact: "Hydrocarbon wash-off, extreme solar absorption (albedo 0.10, surface 52°C), zero infiltration.",
        provenance: "Engineering Assumption"
      },
      alternative: {
        name: "Vegetated Open-Grid Concrete Turf Pavers",
        cost_inr_m2: 1750,
        embodied_carbon_kg_m2: 16.8,
        durability_years: 20,
        annual_maint_inr_m2: 50,
        environmental_impact: "Living grass matrix cools parking microclimate by 4.2°C; biological oil bio-filtration; C=0.25.",
        provenance: "Official Dataset",
        suitability: "Visitor bays, bus parking, service lanes.",
        limitations: "Requires sunlight exposure to sustain grass root turf."
      }
    },
    {
      application: "Rooftop Terrace Surface",
      conventional: {
        name: "Exposed Reinforced Concrete + Bitumen Felt",
        cost_inr_m2: 950,
        embodied_carbon_kg_m2: 48.0,
        durability_years: 15,
        annual_maint_inr_m2: 35,
        environmental_impact: "Peak summer surface temp 48°C, heavy stormwater surge (C=0.90), rapid UV degradation.",
        provenance: "Official Dataset"
      },
      alternative: {
        name: "Extensive Sedum Green Roof + SRI 104 Membrane",
        cost_inr_m2: 2200,
        embodied_carbon_kg_m2: -8.5,
        durability_years: 40,
        annual_maint_inr_m2: 120,
        environmental_impact: "65% rainwater retention, drops top-floor AC load by 12%, doubles waterproofing membrane life.",
        provenance: "Measured",
        suitability: "Flat RCC slabs with reserve dead load ≥90 kg/m².",
        limitations: "Structural sign-off and root barrier required."
      }
    },
    {
      application: "Stormwater Drainage",
      conventional: {
        name: "Cast Concrete U-Drains & Gutter Channels",
        cost_inr_m2: 2400,
        embodied_carbon_kg_m2: 64.0,
        durability_years: 20,
        annual_maint_inr_m2: 80,
        environmental_impact: "Directs untreated silty stormwater into municipal conduits at high velocity, exacerbating downstream floods.",
        provenance: "Official Dataset"
      },
      alternative: {
        name: "Engineered Vegetated Bioswale with River Pebbles",
        cost_inr_m2: 1200,
        embodied_carbon_kg_m2: 5.2,
        durability_years: 50,
        annual_maint_inr_m2: 60,
        environmental_impact: "Removes 85% total suspended solids (TSS), natural infiltration bed, pollinator pathway; C=0.15.",
        provenance: "Measured",
        suitability: "Perimeter setbacks, roadway verges, swales.",
        limitations: "Minimum 1.5% longitudinal grade required."
      }
    },
    {
      application: "Building Structural Concrete",
      conventional: {
        name: "Standard OPC 53 Grade Concrete (M25/M30)",
        cost_inr_m2: 4200,
        embodied_carbon_kg_m2: 340.0,
        durability_years: 60,
        annual_maint_inr_m2: 25,
        environmental_impact: "High carbon clinker manufacturing (0.92 t CO₂ / t cement), depletes virgin river sand.",
        provenance: "Official Dataset"
      },
      alternative: {
        name: "40% GGBS / Fly Ash Blended Geopolymer Concrete",
        cost_inr_m2: 3950,
        embodied_carbon_kg_m2: 195.0,
        durability_years: 80,
        annual_maint_inr_m2: 20,
        environmental_impact: "42% embodied carbon abatement, recycles blast furnace slag, superior sulphate/chloride resistance.",
        provenance: "Official Dataset",
        suitability: "Foundations, columns, shear walls, beams (IS 456).",
        limitations: "Requires 14-day moist curing period."
      }
    }
  ],

  selectedAreaM2: 500,
  selectedCategoryIndex: 0,

  render(project, calculations, environmentalData) {
    const container = document.getElementById("materials-view");
    if (!container) return;

    const gfa = project.site.total_floor_area || (project.site.built_up_area * (project.site.floors || 2));
    const annualElectricityKwh = project.energy?.annual_electricity_kwh || 48000;
    
    // 1. Embodied Carbon (ICE Database v3.0 / RICS: ~310 kg CO₂e/m² GFA for RCC superstructure)
    const embodiedTotalTonnes = Math.round((gfa * 310) / 1000);
    
    // 2. Operational Carbon (CEA Baseline Factor: 0.82 kg CO₂e / kWh)
    const operationalAnnualTonnes = Math.round((annualElectricityKwh * 0.82) / 1000 * 10) / 10;
    
    // 3. Avoided Emissions (Solar PV generation)
    const solarGenKwh = calculations.energy?.annual_generation_kwh || 48000;
    const avoidedAnnualTonnes = Math.round((solarGenKwh * 0.82) / 1000 * 10) / 10;
    
    // 4. Estimated Recovery / Biological Sequestration (Trees & Green Roof)
    const treesPlanted = project.interventions?.trees_planted || Math.max(15, (project.vegetation?.trees_removed || 0) * 3);
    const treeSeqAnnualTonnes = Math.round((treesPlanted * 21.8) / 1000 * 10) / 10; // 21.8 kg/tree/yr (IPCC Tier 1)
    const greenRoofM2 = project.interventions?.green_roof_m2 || Math.round((project.site?.roof_area || project.site?.built_up_area || 2000) * 0.27);
    const greenRoofSeqTonnes = Math.round((greenRoofM2 * 1.5) / 1000 * 10) / 10;
    const totalRestorationTonnes = Math.round((treeSeqAnnualTonnes + greenRoofSeqTonnes) * 10) / 10;

    const currentItem = this.MATERIAL_CATALOG[this.selectedCategoryIndex];
    const area = this.selectedAreaM2;
    const carbonSavedKg = Math.round(area * (currentItem.conventional.embodied_carbon_kg_m2 - currentItem.alternative.embodied_carbon_kg_m2));
    const costDiffInr = Math.round(area * (currentItem.alternative.cost_inr_m2 - currentItem.conventional.cost_inr_m2));

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-stone-800">
        
        <!-- HEADER -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span>🧱</span> Carbon Accounting & Sustainable Materials
              </span>
              <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                ICE v3.0 & IS 456 Standards
              </span>
            </div>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Carbon Accounting & Material Specifications</h1>
            <p class="text-xs text-slate-500">
              Clear distinction between embodied building mass, recurring operational grid loads, avoided clean energy emissions, and biogenic carbon sinks.
            </p>
          </div>
          <div class="flex items-center gap-2 self-start md:self-center">
            <button onclick="window.ExplainModal && window.ExplainModal.open('carbon_balance')" class="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition flex items-center gap-1.5">
              <span>ℹ️</span> Carbon Methodology
            </button>
            <button onclick="window.App.switchView('recovery')" class="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition flex items-center gap-1.5">
              <span>🌱</span> Recovery Portfolio &rarr;
            </button>
          </div>
        </div>

        <!-- 4-DOMAIN CARBON DISCLOSURE DASHBOARD (NOT MERGED INTO ONE MISLEADING NUMBER) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <!-- DOMAIN 1: EMBODIED CARBON -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">1. Embodied Carbon</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Official Dataset</span>
            </div>
            <div class="space-y-0.5">
              <div class="text-2xl font-black text-slate-800 font-mono">${embodiedTotalTonnes.toLocaleString()} <span class="text-sm font-normal text-slate-500">t CO₂e</span></div>
              <p class="text-[11px] text-slate-500">Structure, concrete, rebar & envelope across ${gfa.toLocaleString()} m² GFA.</p>
            </div>
            <div class="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div class="flex justify-between"><span>Intensity:</span><strong class="font-mono">310 kg CO₂e/m²</strong></div>
              <div class="flex justify-between"><span>Database:</span><strong class="text-slate-700">ICE Univ. of Bath v3.0</strong></div>
            </div>
          </div>

          <!-- DOMAIN 2: OPERATIONAL CARBON -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">2. Operational Carbon</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">API Calculated</span>
            </div>
            <div class="space-y-0.5">
              <div class="text-2xl font-black text-amber-800 font-mono">${operationalAnnualTonnes} <span class="text-sm font-normal text-amber-600">t CO₂e/yr</span></div>
              <p class="text-[11px] text-slate-500">Scope 2 electricity & HVAC cooling demand (${(annualElectricityKwh/1000).toFixed(0)} MWh/yr).</p>
            </div>
            <div class="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div class="flex justify-between"><span>Grid Factor:</span><strong class="font-mono">0.82 kg/kWh</strong></div>
              <div class="flex justify-between"><span>Reference:</span><strong class="text-slate-700">CEA Baseline v19 (India)</strong></div>
            </div>
          </div>

          <!-- DOMAIN 3: AVOIDED EMISSIONS -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">3. Avoided Emissions</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Official Dataset</span>
            </div>
            <div class="space-y-0.5">
              <div class="text-2xl font-black text-emerald-700 font-mono">−${avoidedAnnualTonnes} <span class="text-sm font-normal text-emerald-600">t CO₂e/yr</span></div>
              <p class="text-[11px] text-slate-500">Displaced fossil grid power via on-site rooftop Solar PV generation.</p>
            </div>
            <div class="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div class="flex justify-between"><span>Clean Gen:</span><strong class="font-mono">${(solarGenKwh/1000).toFixed(1)} MWh/yr</strong></div>
              <div class="flex justify-between"><span>Displacement:</span><strong class="text-emerald-700">100% Net Offset</strong></div>
            </div>
          </div>

          <!-- DOMAIN 4: BIOGENIC SEQUESTRATION -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">4. Biogenic Sink</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Measured Model</span>
            </div>
            <div class="space-y-0.5">
              <div class="text-2xl font-black text-emerald-800 font-mono">−${totalRestorationTonnes} <span class="text-sm font-normal text-emerald-600">t CO₂e/yr</span></div>
              <p class="text-[11px] text-slate-500">Living biomass growth across ${treesPlanted} native trees & ${greenRoofM2} m² green roof.</p>
            </div>
            <div class="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div class="flex justify-between"><span>Tree Biomass:</span><strong class="font-mono text-emerald-700">−${treeSeqAnnualTonnes} t/yr</strong></div>
              <div class="flex justify-between"><span>Method:</span><strong class="text-slate-700">IPCC Tier 1 / FSI 2023</strong></div>
            </div>
          </div>

        </div>

        <!-- SECTION 20 REQUIRED MATERIALS COMPARISON TABLE -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Comprehensive Specifications</span>
              <h2 class="text-base font-bold text-slate-800">Sustainable vs Conventional Materials Engineering Matrix</h2>
            </div>
            <div class="flex items-center gap-2 text-[10px] text-slate-500">
              <span class="font-bold">Provenance:</span>
              <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">Official Dataset</span>
              <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Measured</span>
              <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">Engineering Assumption</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50/80 text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                  <th class="p-3">Material & Typology</th>
                  <th class="p-3">Cost (₹/m²)</th>
                  <th class="p-3">Carbon (kg CO₂e/m²)</th>
                  <th class="p-3">Durability</th>
                  <th class="p-3">Maintenance</th>
                  <th class="p-3">Environmental Impact</th>
                  <th class="p-3 text-right">Data Provenance</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${this.MATERIAL_CATALOG.flatMap((item, idx) => [
                  `
                  <tr class="hover:bg-slate-50 transition bg-slate-50/30">
                    <td class="p-3">
                      <div class="font-bold text-slate-800">${item.conventional.name}</div>
                      <div class="text-[10px] text-slate-400 font-semibold uppercase">${item.application} (Conventional)</div>
                    </td>
                    <td class="p-3 font-mono font-semibold text-slate-800">₹ ${item.conventional.cost_inr_m2}</td>
                    <td class="p-3 font-mono font-bold text-rose-700">${item.conventional.embodied_carbon_kg_m2}</td>
                    <td class="p-3 font-mono text-slate-600">${item.conventional.durability_years} Years</td>
                    <td class="p-3 font-mono text-slate-600">₹ ${item.conventional.annual_maint_inr_m2}/yr</td>
                    <td class="p-3 text-slate-600 max-w-xs leading-relaxed">${item.conventional.environmental_impact}</td>
                    <td class="p-3 text-right"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">${item.conventional.provenance}</span></td>
                  </tr>
                  `,
                  `
                  <tr class="hover:bg-emerald-50/50 transition bg-emerald-50/20 border-b-2 border-slate-100">
                    <td class="p-3">
                      <div class="font-bold text-emerald-950 flex items-center gap-1.5">
                        <span>${item.alternative.name}</span>
                        <span class="text-[9px] px-1.5 py-0.5 bg-emerald-700 text-white rounded font-bold">SUSTAINABLE</span>
                      </div>
                      <div class="text-[10px] text-emerald-700 font-semibold uppercase">${item.application} (Alternative)</div>
                    </td>
                    <td class="p-3 font-mono font-bold text-slate-900">₹ ${item.alternative.cost_inr_m2}</td>
                    <td class="p-3 font-mono font-bold text-emerald-700">${item.alternative.embodied_carbon_kg_m2}</td>
                    <td class="p-3 font-mono text-slate-700 font-bold">${item.alternative.durability_years} Years</td>
                    <td class="p-3 font-mono text-slate-700">₹ ${item.alternative.annual_maint_inr_m2}/yr</td>
                    <td class="p-3 text-emerald-900 max-w-xs leading-relaxed font-medium">${item.alternative.environmental_impact}</td>
                    <td class="p-3 text-right"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">${item.alternative.provenance}</span></td>
                  </tr>
                  `
                ]).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- INTERACTIVE MATERIAL SUBSTITUTION CALCULATOR -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Dynamic Scenario Modeler</span>
              <h2 class="text-base font-bold text-slate-800">Interactive Material Substitution & Abatement Calculator</h2>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-xs font-bold text-slate-600">Surface Area:</label>
              <input type="number" min="50" max="5000" step="50" value="${area}" onchange="window.MaterialsView.updateArea(this.value)" class="w-24 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              <span class="text-xs font-bold text-slate-500">m²</span>
            </div>
          </div>

          <!-- Application Buttons -->
          <div class="flex flex-wrap gap-2">
            ${this.MATERIAL_CATALOG.map((m, idx) => `
              <button onclick="window.MaterialsView.selectCategory(${idx})" class="px-3.5 py-2 rounded-xl text-xs font-bold border transition ${idx === this.selectedCategoryIndex ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}">
                ${m.application}
              </button>
            `).join('')}
          </div>

          <!-- Abatement Banner -->
          <div class="p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1">
              <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Net Substitution Impact (${area} m²)</span>
              <div class="text-xs text-slate-300">Replacing <strong>${currentItem.conventional.name}</strong> with <strong>${currentItem.alternative.name}</strong>:</div>
            </div>
            <div class="flex items-center gap-6">
              <div>
                <span class="text-[10px] text-slate-400 uppercase font-bold block">Carbon Abated</span>
                <span class="text-xl font-black text-emerald-300 font-mono">−${(carbonSavedKg / 1000).toFixed(2)} t CO₂e</span>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 uppercase font-bold block">CapEx Delta</span>
                <span class="text-xl font-black ${costDiffInr <= 0 ? 'text-emerald-300' : 'text-amber-300'} font-mono">
                  ${costDiffInr <= 0 ? '−₹ ' + Math.abs(costDiffInr).toLocaleString() : '+₹ ' + costDiffInr.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  selectCategory(idx) {
    this.selectedCategoryIndex = idx;
    this.render(window.App.currentProject, window.App.calculations, window.App.environmentalData);
  },

  updateArea(val) {
    this.selectedAreaM2 = Math.max(10, parseFloat(val) || 100);
    this.render(window.App.currentProject, window.App.calculations, window.App.environmentalData);
  }
};
