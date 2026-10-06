/**
 * EcoBuild Smart - Water & Stormwater Management Workspace
 * 
 * Provides:
 * - End-to-end water balance: Rainfall, Catchment, Runoff, Infiltration, RWH, Storage, Reuse, Recharge
 * - Visual Flow Diagram 1: Rainfall → Roof → First Flush → Filter → Storage → Reuse
 * - Visual Flow Diagram 2: Rainfall → Surface → Runoff → Bioswale → Infiltration
 * - Rational Method Q = C * I * A peak runoff diagnostics
 * - Surface runoff coefficient (C) specification table
 */

window.StormwaterView = {
  render(project, calculations, environmentalData) {
    const container = document.getElementById("stormwater-view");
    if (!container) return;

    const r = calculations.runoff;
    const water = calculations.water_demand || {};
    const rwh = calculations.rwh || {};
    const envRain = environmentalData?.rainfall || { annual_rainfall_mm: 1042.8, peak_intensity_mm_hr: 35.0 };
    const coeffs = window.ECO_CONFIG.RUNOFF_COEFFICIENTS;

    const plotArea = project.site.plot_area || 5000;
    const roofArea = project.site.roof_area || 2200;
    const openArea = project.site.open_area || (plotArea - (project.site.built_up_area || 2200));
    const annualRainMm = envRain.annual_rainfall_mm || 1042.8;

    // Roof Water Stream Calculations:
    const roofIncidentM3 = Math.round((roofArea * annualRainMm) / 1000);
    const roofHarvestedGrossM3 = Math.round(roofIncidentM3 * 0.85); // 0.85 runoff coeff
    const firstFlushDivertedM3 = Math.round(roofArea * 0.0015 * 18); // 1.5mm first flush over ~18 rain events
    const filterTransmittedM3 = Math.round((roofHarvestedGrossM3 - firstFlushDivertedM3) * 0.92); // 92% filtration efficiency
    const occupants = project.occupancy?.total_occupants || 250;
    const tankCapacityLitres = project.interventions?.rwh_tank_capacity_l || Math.round(Math.min(roofArea * 40, Math.max(15000, occupants * 45 * 18)));
    const reuseLitres = rwh.potential_harvested_litres ? Math.min(rwh.potential_harvested_litres, (water.annual_demand_litres || (occupants * 135 * 365)) * 0.45) : Math.round(filterTransmittedM3 * 1000 * 0.65);
    const rechargeLitres = Math.max(0, (filterTransmittedM3 * 1000) - reuseLitres);

    // Surface Water Stream Calculations:
    const surfaceIncidentM3 = Math.round((openArea * annualRainMm) / 1000);
    const surfacePreDevRunoffM3 = Math.round((r.pre_development?.annual_runoff_litres || (plotArea * annualRainMm * 0.20)) / 1000);
    const surfacePostDevRunoffM3 = Math.round((r.proposed_development?.annual_runoff_litres || (plotArea * annualRainMm * 0.65)) / 1000);
    const surfaceMitigatedRunoffM3 = Math.round((r.with_green_infrastructure?.annual_runoff_litres || (plotArea * annualRainMm * 0.32)) / 1000);
    const infiltratedM3 = Math.max(0, surfaceIncidentM3 - surfaceMitigatedRunoffM3);

    container.innerHTML = `
      <div class="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-stone-800">
        
        <!-- HEADER -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                <span>🌧️</span> Hydrological & Water Management Workspace
              </span>
              <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                NBC 2016 & CGWB Norms
              </span>
            </div>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Stormwater, Catchment & Aquifer Recharge</h1>
            <p class="text-xs text-slate-500">
              Integrated hydrological balance analyzing peak Rational runoff (Q=CIA), rooftop rainwater harvesting, and bioretention swale infiltration.
            </p>
          </div>
          <div class="flex items-center gap-2 self-start md:self-center">
            <button onclick="window.ExplainModal && window.ExplainModal.open('runoff_deficit')" class="px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition flex items-center gap-1.5">
              <span>ℹ️</span> Inspect Rational Formula
            </button>
            <button onclick="window.App.switchView('scenariostudio')" class="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition flex items-center gap-1.5">
              <span>⚖️</span> Simulate Storm Events &rarr;
            </button>
          </div>
        </div>

        <!-- 8-METRIC WATER BALANCE STRIP -->
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1. Rainfall</span>
            <div class="text-lg font-bold text-slate-800 font-mono">${annualRainMm} <span class="text-[10px] font-normal text-slate-500">mm</span></div>
            <span class="text-[10px] text-slate-500">Local climate normal</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">2. Catchment</span>
            <div class="text-lg font-bold text-slate-800 font-mono">${plotArea.toLocaleString()} <span class="text-[10px] font-normal text-slate-500">m²</span></div>
            <span class="text-[10px] text-slate-500">Total plot envelope</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">3. Peak Runoff</span>
            <div class="text-lg font-bold text-rose-700 font-mono">${r.proposed_development?.peak_runoff_m3_hr || 74.2} <span class="text-[10px] font-normal text-rose-400">m³/h</span></div>
            <span class="text-[10px] text-rose-600 font-bold">+${r.impact_summary?.peak_runoff_increase_pct || 178}% Surge</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">4. Infiltration</span>
            <div class="text-lg font-bold text-emerald-700 font-mono">${infiltratedM3.toLocaleString()} <span class="text-[10px] font-normal text-emerald-500">m³/y</span></div>
            <span class="text-[10px] text-emerald-600 font-bold">Via SUDs & Soil</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">5. RWH Yield</span>
            <div class="text-lg font-bold text-blue-700 font-mono">${(filterTransmittedM3).toLocaleString()} <span class="text-[10px] font-normal text-blue-500">m³/y</span></div>
            <span class="text-[10px] text-blue-600 font-bold">Filtered roof yield</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">6. Storage Tank</span>
            <div class="text-lg font-bold text-blue-900 font-mono">${(tankCapacityLitres / 1000)} <span class="text-[10px] font-normal text-slate-500">kL</span></div>
            <span class="text-[10px] text-slate-500">${tankCapacityLitres.toLocaleString()} L Cistern</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">7. Non-Potable</span>
            <div class="text-lg font-bold text-emerald-800 font-mono">${Math.round(reuseLitres / 1000).toLocaleString()} <span class="text-[10px] font-normal text-slate-500">kL/y</span></div>
            <span class="text-[10px] text-emerald-700 font-bold">Flushing & Landscape</span>
          </div>

          <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">8. Deep Recharge</span>
            <div class="text-lg font-bold text-indigo-700 font-mono">${Math.round(rechargeLitres / 1000).toLocaleString()} <span class="text-[10px] font-normal text-slate-500">kL/y</span></div>
            <span class="text-[10px] text-indigo-600 font-bold">2× Recharge Wells</span>
          </div>
        </div>

        <!-- WATER FLOW DIAGRAM 1: ROOFTOP RWH STREAM -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span class="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Water-Flow Architecture (Stream 1)</span>
              <h2 class="text-base font-bold text-slate-800">Rooftop Rainwater Harvesting & Dual Recovery Circuit</h2>
            </div>
            <span class="text-xs px-2.5 py-1 rounded-full font-bold bg-blue-50 text-blue-800 border border-blue-200">
              Roof: ${roofArea.toLocaleString()} m² RCC
            </span>
          </div>

          <!-- Circuit Step Boxes -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2.5 text-xs">
            
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span class="text-[10px] font-bold text-slate-400 uppercase">Stage 1</span>
              <div class="font-bold text-slate-800">Rainfall Incident</div>
              <div class="text-blue-700 font-mono font-bold">${roofIncidentM3.toLocaleString()} m³/yr</div>
              <p class="text-[10px] text-slate-500">${annualRainMm} mm over ${roofArea} m² roof</p>
            </div>

            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span class="text-[10px] font-bold text-slate-400 uppercase">Stage 2</span>
              <div class="font-bold text-slate-800">Roof Catchment</div>
              <div class="text-blue-700 font-mono font-bold">${roofHarvestedGrossM3.toLocaleString()} m³/yr</div>
              <p class="text-[10px] text-slate-500">Runoff coeff C = 0.85</p>
            </div>

            <div class="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
              <span class="text-[10px] font-bold text-amber-700 uppercase">Stage 3</span>
              <div class="font-bold text-amber-900">First Flush Separator</div>
              <div class="text-amber-800 font-mono font-bold">−${firstFlushDivertedM3} m³/yr</div>
              <p class="text-[10px] text-amber-700">1.5mm initial dirt flush</p>
            </div>

            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span class="text-[10px] font-bold text-slate-400 uppercase">Stage 4</span>
              <div class="font-bold text-slate-800">Dual Sand Filter</div>
              <div class="text-emerald-700 font-mono font-bold">${filterTransmittedM3.toLocaleString()} m³/yr</div>
              <p class="text-[10px] text-slate-500">92% media efficiency</p>
            </div>

            <div class="p-4 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1">
              <span class="text-[10px] font-bold text-blue-700 uppercase">Stage 5</span>
              <div class="font-bold text-blue-900">Cistern Storage</div>
              <div class="text-blue-800 font-mono font-bold">${tankCapacityLitres.toLocaleString()} Litres</div>
              <p class="text-[10px] text-blue-700">Sized for 15 dry days</p>
            </div>

            <div class="p-4 bg-emerald-900 text-white rounded-xl space-y-1">
              <span class="text-[10px] font-bold text-emerald-300 uppercase">Stage 6</span>
              <div class="font-bold text-white">Reuse & Deep Recharge</div>
              <div class="text-emerald-200 font-mono font-bold">${Math.round(reuseLitres/1000)} kL Reuse</div>
              <p class="text-[10px] text-emerald-300">${Math.round(rechargeLitres/1000)} kL Aquifer Well</p>
            </div>

          </div>
        </div>

        <!-- WATER FLOW DIAGRAM 2: HARDSCAPE & SURFACE BIORETENTION STREAM -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Water-Flow Architecture (Stream 2)</span>
              <h2 class="text-base font-bold text-slate-800">Surface Hardscape Runoff & Bioretention Infiltration</h2>
            </div>
            <span class="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Open/Paved Area: ${openArea.toLocaleString()} m²
            </span>
          </div>

          <!-- Circuit Step Boxes -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span class="text-[10px] font-bold text-slate-400 uppercase">Step 1</span>
              <div class="font-bold text-slate-800">Precipitation on Hardscape</div>
              <div class="text-slate-800 font-mono font-bold">${surfaceIncidentM3.toLocaleString()} m³/yr</div>
              <p class="text-[10px] text-slate-500">Incident volume on concrete and paving</p>
            </div>

            <div class="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
              <span class="text-[10px] font-bold text-rose-700 uppercase">Step 2</span>
              <div class="font-bold text-rose-900">Surface Runoff Surge</div>
              <div class="text-rose-800 font-mono font-bold">${surfacePostDevRunoffM3.toLocaleString()} m³/yr</div>
              <p class="text-[10px] text-rose-700">Impermeable concrete C=0.90</p>
            </div>

            <div class="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
              <span class="text-[10px] font-bold text-emerald-700 uppercase">Step 3</span>
              <div class="font-bold text-emerald-900">Vegetated Bioswale Catchment</div>
              <div class="text-emerald-800 font-mono font-bold">65 m Length / 120 m² Area</div>
              <p class="text-[10px] text-emerald-700">Native reeds & engineered bioretention soil</p>
            </div>

            <div class="p-4 bg-emerald-100/70 border border-emerald-300 rounded-xl space-y-1">
              <span class="text-[10px] font-bold text-emerald-800 uppercase">Step 4</span>
              <div class="font-bold text-emerald-950">Groundwater Infiltration</div>
              <div class="text-emerald-900 font-mono font-bold">${infiltratedM3.toLocaleString()} m³/yr Infiltrated</div>
              <p class="text-[10px] text-emerald-800">Via porous pavers & bioswale sub-base</p>
            </div>

            <div class="p-4 bg-slate-900 text-white rounded-xl space-y-1">
              <span class="text-[10px] font-bold text-emerald-400 uppercase">Step 5</span>
              <div class="font-bold text-white">Attenuated Municipal Drain</div>
              <div class="text-emerald-300 font-mono font-bold">${surfaceMitigatedRunoffM3.toLocaleString()} m³/yr (${r.impact_summary?.runoff_reduction_pct || 68}% cut)</div>
              <p class="text-[10px] text-slate-300">Peak flow reduced to pre-development levels</p>
            </div>

          </div>
        </div>

        <!-- RATIONAL FORMULA MATRIX & SURFACE SPECIFICATION TABLE -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div class="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-sm space-y-4">
            <span class="text-xs font-bold text-blue-400 uppercase tracking-wider block">Governing Rational Hydrological Method</span>
            <div class="text-3xl font-mono font-bold tracking-wider text-amber-300">Q = C × I × A</div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Where <strong>Q</strong> is the peak stormwater discharge (m³/hr), <strong>C</strong> is the weighted runoff coefficient, <strong>I</strong> is the design rainfall intensity (${envRain.peak_intensity_mm_hr} mm/hr), and <strong>A</strong> is the catchment (${plotArea} m²).
            </p>
            
            <div class="bg-white/10 rounded-xl p-4 space-y-2 text-xs border border-white/10">
              <div class="flex justify-between">
                <span class="text-slate-300">Pre-Development Runoff:</span>
                <span class="font-mono font-bold text-white">${r.pre_development?.peak_runoff_m3_hr} m³/hr (C=${r.pre_development?.composite_c})</span>
              </div>
              <div class="flex justify-between">
                <span class="text-rose-300">Unmitigated Hardscape Runoff:</span>
                <span class="font-mono font-bold text-rose-300">${r.proposed_development?.peak_runoff_m3_hr} m³/hr (C=${r.proposed_development?.composite_c})</span>
              </div>
              <div class="flex justify-between">
                <span class="text-emerald-300">Mitigated Post-SUDs Runoff:</span>
                <span class="font-mono font-bold text-emerald-300">${r.with_green_infrastructure?.peak_runoff_m3_hr} m³/hr (C=${r.with_green_infrastructure?.composite_c})</span>
              </div>
            </div>
          </div>

          <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h3 class="text-sm font-bold text-slate-800">Surface Runoff Coefficient (C) Benchmark Standard</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-50 text-slate-600 font-bold border-b text-[11px] uppercase">
                  <tr>
                    <th class="p-2.5">Surface Material</th>
                    <th class="p-2.5">Coeff (C)</th>
                    <th class="p-2.5">Hydrological Property</th>
                    <th class="p-2.5 text-right">Standard Reference</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-600">
                  ${Object.keys(coeffs).map(key => {
                    const item = coeffs[key];
                    return `
                      <tr class="hover:bg-slate-50 transition">
                        <td class="p-2.5 font-semibold text-slate-800">${item.label}</td>
                        <td class="p-2.5 font-mono font-bold ${item.value > 0.6 ? 'text-rose-600' : 'text-emerald-700'}">${item.value}</td>
                        <td class="p-2.5">${item.value >= 0.8 ? 'Impervious (Flash Runoff)' : item.value >= 0.4 ? 'Semi-permeable (Retentive)' : 'High Infiltration (Bioretention)'}</td>
                        <td class="p-2.5 text-right text-slate-400 font-mono text-[11px]">${item.source}</td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    `;
  }
};
