/**
 * EcoBuild Smart - Energy & Solar PV Feasibility Workspace
 * 
 * Implements:
 * - MNRE & NREL PVWatts solar capacity and generation curves
 * - Demand, Solar Potential, Roof Availability, Proposed Capacity, Expected Generation, Offset %
 * - Financials: Installation Capex, Annual Maintenance, Utility Savings, Payback Period
 * - 5-way Comparative Roof Typology Matrix:
 *   Conventional RCC vs Cool Roof vs Green Roof vs Solar PV vs Bio-Solar (Green + PV)
 * - Roof Spatial Allocation Visualization
 */

window.EnergyView = {
  render(project, calculations, environmentalData) {
    const container = document.getElementById("energy-view");
    if (!container) return;

    const sol = calculations.energy || {};
    const envSolar = environmentalData?.solar || {};
    const roofArea = project.site.roof_area || project.site.built_up_area || 2000;
    const annualDemandKwh = sol.annual_demand_kwh || project.energy?.annual_electricity_kwh || Math.round((project.site.total_floor_area || roofArea * 2) * 15);
    
    // Solar PV sizing
    const solarAllocatedAreaM2 = project.interventions?.solar_pv_area_m2 || sol.solar_allocated_area_m2 || Math.round(roofArea * 0.35);
    const capacityKwp = sol.installed_capacity_kwp || Math.round((solarAllocatedAreaM2 * 0.18) * 10) / 10;
    const annualGenerationKwh = sol.annual_generation_kwh || Math.round(capacityKwp * (envSolar.daily_peak_sun_hours || 5.2) * 365 * 0.75);
    const offsetPct = Math.min(100, Math.round((annualGenerationKwh / Math.max(1, annualDemandKwh)) * 100));
    
    // Financials (MNRE & CERC tariffs: ₹7.50 / kWh commercial/institutional tariff; ₹48,000 / kWp installed capex)
    const capexInr = Math.round(capacityKwp * 48000);
    const annualOpexInr = Math.round(capexInr * 0.015); // 1.5% annual O&M
    const annualTariffSavingsInr = Math.round(annualGenerationKwh * 7.50);
    const netAnnualSavingsInr = annualTariffSavingsInr - annualOpexInr;
    const paybackYears = (capexInr / Math.max(1, netAnnualSavingsInr)).toFixed(1);
    const avoidedCo2Tonnes = (annualGenerationKwh * 0.82 / 1000).toFixed(1);

    // Roof allocation percentages
    const greenRoofM2 = project.interventions?.green_roof_m2 || Math.round(roofArea * 0.27);
    const solarM2 = solarAllocatedAreaM2;
    const sharedBioSolarM2 = Math.min(greenRoofM2, Math.round(solarAllocatedAreaM2 * 0.5)); // Overlapping bio-solar
    const unallocatedM2 = Math.max(0, roofArea - (greenRoofM2 + solarM2 - sharedBioSolarM2));

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-stone-800">
        
        <!-- HEADER -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <span>☀️</span> Clean Power & Solar Photovoltaic Engineering
              </span>
              <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                MNRE & PVWatts Engine
              </span>
            </div>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Rooftop Solar PV & Energy Transition</h1>
            <p class="text-xs text-slate-500">
              Evaluates rooftop solar generation potential, clean power displacement, lifecycle capital payback, and bio-solar co-location benefits.
            </p>
          </div>
          <div class="flex items-center gap-2 self-start md:self-center">
            <button onclick="window.ExplainModal && window.ExplainModal.open('solar_pv')" class="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition flex items-center gap-1.5">
              <span>ℹ️</span> PVWatts Formula
            </button>
            <button onclick="window.App.switchView('recovery')" class="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition flex items-center gap-1.5">
              <span>🌱</span> Recovery Portfolio &rarr;
            </button>
          </div>
        </div>

        <!-- 8-METRIC KPI GRID -->
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          
          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1. Demand</span>
            <div class="text-base font-bold text-slate-800 font-mono">${(annualDemandKwh/1000).toFixed(1)} <span class="text-[10px] font-normal text-slate-500">MWh/y</span></div>
            <span class="text-[10px] text-slate-500">Site baseline load</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">2. Sun Hours</span>
            <div class="text-base font-bold text-amber-600 font-mono">${envSolar.daily_peak_sun_hours || 5.2} <span class="text-[10px] font-normal text-amber-400">h/day</span></div>
            <span class="text-[10px] text-amber-700 font-semibold">${envSolar.solar_potential_category || 'Very Good'}</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">3. Roof Avail.</span>
            <div class="text-base font-bold text-slate-800 font-mono">${roofArea.toLocaleString()} <span class="text-[10px] font-normal text-slate-500">m²</span></div>
            <span class="text-[10px] text-slate-500">Gross roof slab</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">4. PV Capacity</span>
            <div class="text-base font-bold text-amber-600 font-mono">${capacityKwp} <span class="text-[10px] font-normal text-amber-400">kWp</span></div>
            <span class="text-[10px] text-slate-500">${solarAllocatedAreaM2} m² footprint</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">5. Generation</span>
            <div class="text-base font-bold text-emerald-700 font-mono">${(annualGenerationKwh/1000).toFixed(1)} <span class="text-[10px] font-normal text-emerald-400">MWh/y</span></div>
            <span class="text-[10px] text-emerald-600 font-bold">${offsetPct}% Offset</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">6. Capex</span>
            <div class="text-base font-bold text-slate-900 font-mono">₹ ${(capexInr/100000).toFixed(1)} <span class="text-[10px] font-normal text-slate-500">Lakh</span></div>
            <span class="text-[10px] text-slate-500">₹48k/kWp turnkey</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">7. Net Savings</span>
            <div class="text-base font-bold text-emerald-800 font-mono">₹ ${(netAnnualSavingsInr/1000).toFixed(0)} <span class="text-[10px] font-normal text-slate-500">k/y</span></div>
            <span class="text-[10px] text-emerald-600 font-bold">₹7.50/kWh tariff</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">8. Payback</span>
            <div class="text-base font-bold text-blue-700 font-mono">${paybackYears} <span class="text-[10px] font-normal text-blue-400">Years</span></div>
            <span class="text-[10px] text-blue-600 font-bold">25-yr panel life</span>
          </div>

        </div>

        <!-- ROOF ALLOCATION VISUALIZER -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Spatial Allocation Strategy</span>
              <h2 class="text-base font-bold text-slate-800">Rooftop Surface Area Allocation (${roofArea.toLocaleString()} m²)</h2>
            </div>
            <span class="text-xs text-slate-500 font-mono">
              Avoids roof congestion & structural over-utilization
            </span>
          </div>

          <!-- Horizontal Multi-Segment Progress Bar -->
          <div class="space-y-2">
            <div class="h-8 w-full bg-slate-100 rounded-xl overflow-hidden flex border border-slate-200 text-[11px] font-bold">
              <div style="width: ${Math.round((solarM2 - sharedBioSolarM2) / roofArea * 100)}%" class="bg-amber-400 text-amber-950 flex items-center justify-center overflow-hidden whitespace-nowrap px-2" title="Dedicated Solar PV: ${solarM2 - sharedBioSolarM2} m²">
                ☀️ Solar (${Math.round((solarM2 - sharedBioSolarM2) / roofArea * 100)}%)
              </div>
              <div style="width: ${Math.round(sharedBioSolarM2 / roofArea * 100)}%" class="bg-teal-600 text-white flex items-center justify-center overflow-hidden whitespace-nowrap px-2" title="Bio-Solar Synergy (Solar over Green Roof): ${sharedBioSolarM2} m²">
                🌿+☀️ Bio-Solar (${Math.round(sharedBioSolarM2 / roofArea * 100)}%)
              </div>
              <div style="width: ${Math.round((greenRoofM2 - sharedBioSolarM2) / roofArea * 100)}%" class="bg-emerald-600 text-white flex items-center justify-center overflow-hidden whitespace-nowrap px-2" title="Extensive Green Roof: ${greenRoofM2 - sharedBioSolarM2} m²">
                🌱 Green Roof (${Math.round((greenRoofM2 - sharedBioSolarM2) / roofArea * 100)}%)
              </div>
              <div style="width: ${Math.round(unallocatedM2 / roofArea * 100)}%" class="bg-slate-200 text-slate-700 flex items-center justify-center overflow-hidden whitespace-nowrap px-2" title="HVAC Services & Maintenance Walkways: ${unallocatedM2} m²">
                HVAC & Access (${Math.round(unallocatedM2 / roofArea * 100)}%)
              </div>
            </div>

            <!-- Legend items -->
            <div class="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
              <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-amber-400"></span><span>Dedicated Solar PV: <strong>${solarM2 - sharedBioSolarM2} m²</strong></span></div>
              <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-teal-600"></span><span>Bio-Solar Co-Location: <strong>${sharedBioSolarM2} m²</strong> (+4% efficiency gain)</span></div>
              <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-emerald-600"></span><span>Extensive Green Roof: <strong>${greenRoofM2 - sharedBioSolarM2} m²</strong></span></div>
              <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-slate-300"></span><span>Service Access / MEP Setback: <strong>${unallocatedM2} m²</strong></span></div>
            </div>
          </div>
        </div>

        <!-- 5-WAY COMPARATIVE ROOF TYPOLOGY MATRIX -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Multi-Criteria Decision Matrix</span>
              <h2 class="text-base font-bold text-slate-800">5-Way Roof Typology Technical Comparison</h2>
            </div>
            <span class="text-xs text-slate-500">Evaluated on ${roofArea.toLocaleString()} m² Building Roof</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50/80 text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                  <th class="p-3">Roof Typology</th>
                  <th class="p-3">Capital Cost</th>
                  <th class="p-3">Surface Temp (Peak)</th>
                  <th class="p-3">Runoff Retention</th>
                  <th class="p-3">Annual Energy Effect</th>
                  <th class="p-3">Carbon Balance</th>
                  <th class="p-3 text-right">Recommendation</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr class="hover:bg-slate-50 transition">
                  <td class="p-3">
                    <div class="font-bold text-slate-800">1. Conventional RCC Roof</div>
                    <div class="text-[10px] text-slate-500">Bare concrete with bituminous seal</div>
                  </td>
                  <td class="p-3 font-mono">₹ 950 / m²</td>
                  <td class="p-3 font-mono font-bold text-rose-600">48°C (Extreme UHI)</td>
                  <td class="p-3 font-mono text-rose-600">0% (C = 0.90)</td>
                  <td class="p-3 text-rose-700 font-semibold">+18% Cooling load</td>
                  <td class="p-3 text-slate-600 font-mono">+48 kg CO₂/m² (Embodied)</td>
                  <td class="p-3 text-right"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">BASELINE</span></td>
                </tr>

                <tr class="hover:bg-slate-50 transition">
                  <td class="p-3">
                    <div class="font-bold text-slate-800">2. High-Albedo Cool Roof</div>
                    <div class="text-[10px] text-slate-500">SRI > 104 elastomeric reflective coating</div>
                  </td>
                  <td class="p-3 font-mono">₹ 350 / m²</td>
                  <td class="p-3 font-mono text-blue-700">31°C (−17°C reduction)</td>
                  <td class="p-3 font-mono text-slate-500">0% (C = 0.85)</td>
                  <td class="p-3 text-emerald-700 font-semibold">−8% HVAC cooling demand</td>
                  <td class="p-3 text-emerald-700 font-mono">−6.2 t CO₂/yr (Avoided)</td>
                  <td class="p-3 text-right"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">LOW COST</span></td>
                </tr>

                <tr class="hover:bg-slate-50 transition">
                  <td class="p-3">
                    <div class="font-bold text-slate-800">3. Extensive Green Roof</div>
                    <div class="text-[10px] text-slate-500">100mm substrate with drought-hardy Sedum</div>
                  </td>
                  <td class="p-3 font-mono">₹ 2,200 / m²</td>
                  <td class="p-3 font-mono text-emerald-700">28°C (−20°C reduction)</td>
                  <td class="p-3 font-mono text-emerald-700 font-bold">65% Retained (C = 0.35)</td>
                  <td class="p-3 text-emerald-700 font-semibold">−12% HVAC cooling demand</td>
                  <td class="p-3 text-emerald-700 font-mono">Carbon sink (−8.5 kg CO₂/m²)</td>
                  <td class="p-3 text-right"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">ECOLOGICAL</span></td>
                </tr>

                <tr class="hover:bg-slate-50 transition">
                  <td class="p-3">
                    <div class="font-bold text-slate-800">4. Rooftop Solar PV</div>
                    <div class="text-[10px] text-slate-500">Monocrystalline PERC modules (180 Wp/m²)</div>
                  </td>
                  <td class="p-3 font-mono">₹ 4,800 / m²</td>
                  <td class="p-3 font-mono text-amber-700">Shades roof slab (−12°C)</td>
                  <td class="p-3 font-mono text-slate-500">0% (Runoff routed to RWH)</td>
                  <td class="p-3 text-amber-800 font-bold font-mono">+${(annualGenerationKwh/1000).toFixed(1)} MWh/yr Clean Gen</td>
                  <td class="p-3 text-emerald-700 font-mono">−${avoidedCo2Tonnes} t CO₂/yr</td>
                  <td class="p-3 text-right"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">CLEAN POWER</span></td>
                </tr>

                <tr class="hover:bg-emerald-50/50 bg-emerald-50/30 transition border-l-4 border-l-emerald-600">
                  <td class="p-3">
                    <div class="font-bold text-emerald-950 flex items-center gap-1.5">
                      <span>5. Bio-Solar Hybrid (Green + PV)</span>
                      <span class="text-[9px] px-1.5 py-0.5 bg-emerald-700 text-white rounded font-bold">OPTIMAL</span>
                    </div>
                    <div class="text-[10px] text-emerald-800">Elevated solar panels over extensive vegetation</div>
                  </td>
                  <td class="p-3 font-mono">₹ 6,500 / m²</td>
                  <td class="p-3 font-mono text-emerald-800 font-bold">26°C (−22°C reduction)</td>
                  <td class="p-3 font-mono text-emerald-800 font-bold">70% Retained (C = 0.30)</td>
                  <td class="p-3 text-emerald-900 font-bold font-mono">+4% PV Boost (Vegetation cools panels)</td>
                  <td class="p-3 text-emerald-800 font-bold font-mono">Max Synergistic Sink</td>
                  <td class="p-3 text-right"><span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-xs">RECOMMENDED</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }
};
