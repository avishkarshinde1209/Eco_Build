/**
 * EcoBuild Smart - Waste Management & Circular Economy Module
 * 
 * Implements:
 * - CPCB Construction & Demolition (C&D) Waste Management Rules (2016)
 * - MoHUA Circular Economy & Resource Recovery Framework
 * - Recycled Concrete Aggregate (RCA) sub-base allocation
 * - On-site dual-chamber aerobic composting for landscape biomatter & food waste
 */

window.WasteView = {
  render(project, calculations, environmentalData) {
    const container = document.getElementById("waste-view");
    if (!container) return;

    const gfa = project.site.total_floor_area || (project.site.built_up_area * (project.site.floors || 1));
    const occupants = project.occupancy?.total_occupants || project.water?.occupants || 120;
    
    // Engineering benchmarks:
    // CPCB C&D waste benchmark: 50-60 kg/m² for new institutional construction
    const cdWasteRateKgM2 = project.building_type === 'Commercial' ? 65 : 55;
    const totalCdWasteTonnes = Math.round((gfa * cdWasteRateKgM2) / 1000);
    const targetDiversionPct = 68; // Best practice green building standard
    const divertedCdTonnes = Math.round((totalCdWasteTonnes * (targetDiversionPct / 100)) * 10) / 10;
    const rcaYieldM3 = Math.round(divertedCdTonnes / 1.6); // 1.6 t/m³ bulk density for crushed aggregate
    
    // Operational solid waste (CPHEEO):
    // Institutional: 0.25 - 0.35 kg/capita/day; Commercial: 0.40 - 0.50 kg/capita/day
    const dailyPerCapitaKg = project.building_type === 'Commercial' ? 0.45 : 0.35;
    const dailyTotalWasteKg = Math.round(occupants * dailyPerCapitaKg);
    const organicFractionPct = 55;
    const dailyOrganicKg = Math.round(dailyTotalWasteKg * (organicFractionPct / 100));
    const annualOrganicTonnes = Math.round((dailyOrganicKg * 365) / 1000 * 10) / 10;
    const annualCompostYieldTonnes = Math.round((annualOrganicTonnes * 0.25) * 10) / 10; // 25% conversion yield
    const topsoilCoverageM2 = Math.round(annualCompostYieldTonnes * 1000 / 3.5); // 3.5 kg/m² application rate

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-stone-800">
        
        <!-- MODULE HEADER -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <span>♻️</span> Circular Operations & CPCB 2016 Standards
              </span>
              <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                NBC Part 11 Aligned
              </span>
            </div>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Waste Management & Material Circularity</h1>
            <p class="text-xs text-slate-500">
              Quantification of Construction & Demolition (C&D) diversion and decentralized organic waste valorization for site restoration.
            </p>
          </div>
          <div class="flex items-center gap-2 self-start md:self-center">
            <button onclick="window.ExplainModal && window.ExplainModal.open('cd_waste')" class="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition flex items-center gap-1.5">
              <span>ℹ️</span> CPCB Norms
            </button>
            <button onclick="window.App.switchView('recovery')" class="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition flex items-center gap-1.5">
              <span>🌱</span> View in Recovery Plan &rarr;
            </button>
          </div>
        </div>

        <!-- 4-METRIC KEY INDICATOR STRIP -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">C&D Waste Generated</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold font-mono">${cdWasteRateKgM2} kg/m²</span>
            </div>
            <div class="text-2xl font-black text-slate-800 font-mono">${totalCdWasteTonnes.toLocaleString()} <span class="text-sm font-normal text-slate-500">Tonnes</span></div>
            <p class="text-[11px] text-slate-500">Estimated across ${gfa.toLocaleString()} m² Gross Floor Area (GFA).</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Landfill Diversion Target</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono">${targetDiversionPct}% Target</span>
            </div>
            <div class="text-2xl font-black text-emerald-700 font-mono">${divertedCdTonnes} <span class="text-sm font-normal text-slate-500">Tonnes</span></div>
            <p class="text-[11px] text-slate-500">Crushed for site sub-base and backfill, avoiding off-site disposal hauling.</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RCA Sub-Base Yield</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold font-mono">1.6 t/m³</span>
            </div>
            <div class="text-2xl font-black text-blue-800 font-mono">${rcaYieldM3.toLocaleString()} <span class="text-sm font-normal text-slate-500">m³</span></div>
            <p class="text-[11px] text-slate-500">Enough aggregate to pave ${(rcaYieldM3 * 5).toLocaleString()} m² of permeable pavement subgrade (200mm depth).</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Annual Organic Humus</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold font-mono">25% Yield</span>
            </div>
            <div class="text-2xl font-black text-emerald-800 font-mono">${annualCompostYieldTonnes} <span class="text-sm font-normal text-slate-500">Tonnes/yr</span></div>
            <p class="text-[11px] text-slate-500">Restores ${topsoilCoverageM2.toLocaleString()} m² of degraded soil around newly planted trees.</p>
          </div>

        </div>

        <!-- CIRCULAR MATERIAL FLOW VISUALIZATION -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-slate-800">Closed-Loop Material Flow Architecture</h2>
              <p class="text-xs text-slate-500">End-to-end traceability of demolition debris and biological waste streams on site.</p>
            </div>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Zero Landfill Strategy
            </span>
          </div>

          <!-- STREAM A: C&D WASTE -->
          <div class="space-y-2">
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Stream A: Construction & Demolition Mineral Stream</span>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-2.5 text-xs">
              <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span class="text-[10px] font-bold text-slate-400 uppercase">1. Generation</span>
                <div class="font-bold text-slate-800">RCC & Brick Debris</div>
                <div class="text-stone-500 text-[11px] font-mono">${totalCdWasteTonnes} tonnes</div>
              </div>
              <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span class="text-[10px] font-bold text-slate-400 uppercase">2. Segregation</span>
                <div class="font-bold text-slate-800">On-Site Yard Sorting</div>
                <div class="text-stone-500 text-[11px]">Rebar, timber & inert masonry</div>
              </div>
              <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span class="text-[10px] font-bold text-slate-400 uppercase">3. Processing</span>
                <div class="font-bold text-slate-800">Mobile Jaw Crusher</div>
                <div class="text-stone-500 text-[11px]">Crushing to 40mm / 20mm spec</div>
              </div>
              <div class="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <span class="text-[10px] font-bold text-emerald-700 uppercase">4. Product</span>
                <div class="font-bold text-emerald-900">Recycled Concrete Aggregate</div>
                <div class="text-emerald-700 font-mono text-[11px] font-bold">${rcaYieldM3} m³ (${divertedCdTonnes} t)</div>
              </div>
              <div class="p-3.5 bg-emerald-900 text-white rounded-xl space-y-1">
                <span class="text-[10px] font-bold text-emerald-300 uppercase">5. Re-Use Target</span>
                <div class="font-bold text-white">Subbase for Permeable Pavers</div>
                <div class="text-emerald-200 text-[11px]">100% replaces virgin quarry stone</div>
              </div>
            </div>
          </div>

          <!-- STREAM B: ORGANIC WASTE -->
          <div class="space-y-2 pt-2 border-t border-slate-100">
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Stream B: Campus Organic & Landscape Biomass Stream</span>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-2.5 text-xs">
              <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span class="text-[10px] font-bold text-slate-400 uppercase">1. Raw Stream</span>
                <div class="font-bold text-slate-800">Canteen & Garden Waste</div>
                <div class="text-stone-500 text-[11px] font-mono">${dailyOrganicKg} kg/day (${annualOrganicTonnes} t/yr)</div>
              </div>
              <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span class="text-[10px] font-bold text-slate-400 uppercase">2. Shredding</span>
                <div class="font-bold text-slate-800">Pruning Mulcher</div>
                <div class="text-stone-500 text-[11px]">Carbon-to-Nitrogen ratio balanced</div>
              </div>
              <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span class="text-[10px] font-bold text-slate-400 uppercase">3. Bioconversion</span>
                <div class="font-bold text-slate-800">Dual-Chamber Composter</div>
                <div class="text-stone-500 text-[11px]">21-day thermophilic maturation</div>
              </div>
              <div class="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <span class="text-[10px] font-bold text-emerald-700 uppercase">4. Bio-Humus</span>
                <div class="font-bold text-emerald-900">Enriched Organic Compost</div>
                <div class="text-emerald-700 font-mono text-[11px] font-bold">${annualCompostYieldTonnes} tonnes/yr</div>
              </div>
              <div class="p-3.5 bg-emerald-900 text-white rounded-xl space-y-1">
                <span class="text-[10px] font-bold text-emerald-300 uppercase">5. Site Application</span>
                <div class="font-bold text-white">Native Tree Root Restorer</div>
                <div class="text-emerald-200 text-[11px]">Covers ${topsoilCoverageM2.toLocaleString()} m² green area</div>
              </div>
            </div>
          </div>

        </div>

        <!-- WASTE INTERVENTIONS & STATUTORY COMPLIANCE TABLE -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 class="text-base font-bold text-slate-800">Circular Waste Interventions Matrix</h2>
            <span class="text-xs text-slate-500">Compliance with CPCB Schedule I & II</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50/80 text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                  <th class="p-3">Intervention</th>
                  <th class="p-3">Target Waste Stream</th>
                  <th class="p-3">Diverted Quantity</th>
                  <th class="p-3">Estimated Capex</th>
                  <th class="p-3">Carbon Avoided</th>
                  <th class="p-3">Regulatory Basis</th>
                  <th class="p-3 text-right">Feasibility</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr class="hover:bg-slate-50 transition">
                  <td class="p-3 font-bold text-slate-800">Mobile On-Site Aggregate Crusher</td>
                  <td class="p-3 text-slate-600">Demolition concrete & masonry rubble</td>
                  <td class="p-3 font-mono font-bold text-emerald-700">${divertedCdTonnes} Tonnes</td>
                  <td class="p-3 font-mono text-slate-700">₹ 85,000 (Lease)</td>
                  <td class="p-3 font-mono text-emerald-700">${(divertedCdTonnes * 0.08).toFixed(1)} t CO₂e</td>
                  <td class="p-3 text-slate-500">CPCB Rule 4(3)</td>
                  <td class="p-3 text-right"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">HIGH</span></td>
                </tr>
                <tr class="hover:bg-slate-50 transition">
                  <td class="p-3 font-bold text-slate-800">RCA Permeable Paver Base Course</td>
                  <td class="p-3 text-slate-600">Crushed concrete aggregate (40mm-20mm)</td>
                  <td class="p-3 font-mono font-bold text-emerald-700">${rcaYieldM3} m³ sub-base</td>
                  <td class="p-3 font-mono text-slate-700">Net saving ₹ ${(rcaYieldM3 * 850).toLocaleString()}</td>
                  <td class="p-3 font-mono text-emerald-700">${(rcaYieldM3 * 0.045).toFixed(1)} t CO₂e</td>
                  <td class="p-3 text-slate-500">IRC:SP:63:2018</td>
                  <td class="p-3 text-right"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">HIGH</span></td>
                </tr>
                <tr class="hover:bg-slate-50 transition">
                  <td class="p-3 font-bold text-slate-800">Solar-Assisted Aerobic Composter</td>
                  <td class="p-3 text-slate-600">Landscape trimmings & food residue</td>
                  <td class="p-3 font-mono font-bold text-emerald-700">${annualOrganicTonnes} Tonnes/yr</td>
                  <td class="p-3 font-mono text-slate-700">₹ ${(Math.max(50000, Math.round(dailyTotalWasteKg * 650))).toLocaleString()}</td>
                  <td class="p-3 font-mono text-emerald-700">${(annualOrganicTonnes * 0.95).toFixed(1)} t CO₂e/yr (CH₄ avoided)</td>
                  <td class="p-3 text-slate-500">SWM Rules 2016</td>
                  <td class="p-3 text-right"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">HIGH</span></td>
                </tr>
                <tr class="hover:bg-slate-50 transition">
                  <td class="p-3 font-bold text-slate-800">Precast Modular Slab Formwork</td>
                  <td class="p-3 text-slate-600">Timber and consumable shuttering waste</td>
                  <td class="p-3 font-mono font-bold text-emerald-700">${(gfa * 0.0035).toFixed(1)} Tonnes timber</td>
                  <td class="p-3 font-mono text-slate-700">₹ ${(Math.round(gfa * 15)).toLocaleString()}</td>
                  <td class="p-3 font-mono text-emerald-700">${(gfa * 0.0035 * 0.65).toFixed(1)} t CO₂e</td>
                  <td class="p-3 text-slate-500">NBC 2016 Part 7</td>
                  <td class="p-3 text-right"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">MEDIUM</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }
};
