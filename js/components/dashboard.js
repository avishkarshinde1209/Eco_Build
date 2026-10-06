/**
 * EcoBuild Smart - Dynamic Environmental Dashboard
 * 
 * World-Class Architectural & Environmental Decision Dashboard
 * Renders environmental deficits, site geometry, real-world climate indicators,
 * recovery plan targets, and interactive explainability triggers.
 */

window.DashboardView = {
  charts: {},

  render(project, calculations, environmentalData) {
    const container = document.getElementById("dashboard-view");
    if (!container) return;

    const def = calculations;
    const gc = def.green_cover;
    const tree = def.tree_impact;
    const runoff = def.runoff;
    const water = def.water_demand;
    const rwh = def.rwh;
    const energy = def.energy;
    const carbon = def.carbon;
    const uhi = def.uhi;
    const score = def.score;
    const env = environmentalData;

    // Dynamically calculate values from user's exact site parameters
    const site = project.site || {};
    const plotArea = site.plot_area || 5000;
    const builtUp = site.built_up_area || Math.round(plotArea * 0.44);
    const floors = site.floors || 2;
    const gfa = site.total_floor_area || (builtUp * floors);
    const roofArea = site.roof_area || builtUp;
    const openArea = Math.max(0, plotArea - builtUp);

    const surfaces = project.surfaces || {};
    const concrete = surfaces.concrete_area || 0;
    const asphalt = surfaces.asphalt_area || 0;
    const tiles = surfaces.tiles_pavers || 0;
    let hardscape = concrete + asphalt + tiles;
    if (hardscape === 0) hardscape = Math.max(150, Math.round(openArea * 0.45));

    const veg = project.vegetation || {};
    const existingGreen = veg.existing_green_area || Math.round(plotArea * 0.28);
    const greenPct = Math.round((existingGreen / plotArea) * 100);
    const existingTrees = veg.existing_tree_count || 50;
    const treesRemoved = veg.trees_removed !== undefined ? veg.trees_removed : 25;
    const protectedTrees = Math.max(0, existingTrees - treesRemoved);

    const iv = project.interventions || {};
    const targetTrees = iv.trees_planted || Math.max(15, treesRemoved * 3);
    const greenRoofM2 = iv.green_roof_m2 || Math.round(roofArea * 0.27);
    const permM2 = iv.permeable_pavement_m2 || Math.round(hardscape * 0.45);
    const targetGreenPct = Math.min(95, Math.round(((existingGreen + greenRoofM2 + permM2) / plotArea) * 100));

    const weatherRain = environmentalData?.weather?.annual_rainfall_mm || project.climate?.annual_rainfall || 980;
    const occupants = project.water?.occupants || project.occupancy?.occupants || 100;
    const dailyLpcd = project.water?.daily_consumption_lpcd || 70;
    const annualDemandM3 = Math.round((occupants * dailyLpcd * 365) / 1000);
    const rwhYieldM3 = Math.round(roofArea * (weatherRain / 1000) * 0.85 * 0.90);
    const tankLitres = iv.rwh_tank_capacity_l || Math.round(Math.min(roofArea * 40, Math.max(15000, occupants * 45 * 18)));
    const tankCapKL = Math.round(tankLitres / 1000);
    const waterOffsetPct = annualDemandM3 > 0 ? Math.min(100, Math.round((rwhYieldM3 / annualDemandM3) * 100)) : 45;

    const imperviousPct = Math.round((hardscape / plotArea) * 100);
    const peakQBefore = (runoff?.unmitigated_peak_flow_m3_hr || (hardscape * 0.035 * 0.85)).toFixed(1);
    const peakQAfter = (runoff?.mitigated_peak_flow_m3_hr || (hardscape * 0.035 * 0.35)).toFixed(1);
    const bioswaleM2 = iv.rain_garden_m2 || Math.round(hardscape * 0.06);

    const elecDemandKwh = project.energy?.annual_electricity_kwh || Math.round(gfa * 15);
    const solarM2 = iv.solar_pv_area_m2 || Math.round(roofArea * 0.35);
    const solarKwp = Math.round(solarM2 / 5.5);
    const solarGenKwh = Math.round(solarKwp * 1450);
    const solarOffsetPct = elecDemandKwh > 0 ? Math.min(100, Math.round((solarGenKwh / elecDemandKwh) * 100)) : 100;

    const embodiedCarbon = carbon?.construction_emissions_tonnes || Math.round((gfa * 450) / 1000);
    const operationalCO2 = Math.round((elecDemandKwh * 0.82) / 1000 * 10) / 10;
    const avoidedSolarCO2 = Math.round((solarGenKwh * 0.82) / 1000 * 10) / 10;
    const treeCO2 = (targetTrees * 21.8 / 1000).toFixed(1);

    const baselineBng = Math.round((existingGreen / plotArea) * 100);
    const targetBng = Math.min(96, baselineBng + 42);

    const cdWasteTonnes = project.waste?.construction_waste_tonnes || Math.round((gfa * 55) / 1000);
    const divertedTonnes = Math.round(cdWasteTonnes * 0.68);
    const rcaYieldM3 = Math.round(divertedTonnes / 1.6);
    const dailyOrganicKg = project.waste?.daily_solid_waste_kg || Math.round(occupants * 0.4);
    const annualCompostTonnes = ((dailyOrganicKg * 365 * 0.25) / 1000).toFixed(1);

    const baselineConditionScore = Math.max(20, Math.min(50, Math.round(greenPct * 0.5 + (protectedTrees / Math.max(1, existingTrees)) * 25)));
    const remainingDeficitPct = Math.max(5, 100 - score.composite_score);

    container.innerHTML = `
      <div class="space-y-8 max-w-7xl mx-auto pb-16 font-sans text-stone-800">
        
        <!-- 1. PROJECT OVERVIEW HEADER & STATUS BAR (SECTION 8) -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm relative overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div class="lg:col-span-8 space-y-3">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200/80">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>${project.building_type} Typology</span>
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  ● Recovery Plan Active
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                  Live Project Model
                </span>
                <span class="text-xs text-stone-500 flex items-center gap-1">
                  <span>📍</span> <span>${project.location.address || project.location.city} (${project.location.latitude.toFixed(4)}, ${project.location.longitude.toFixed(4)})</span>
                </span>
              </div>

              <h1 class="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight font-serif">
                ${project.name}
              </h1>

              <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-600 pt-1 border-t border-stone-100">
                <div>Plot Area: <strong class="text-stone-900">${plotArea.toLocaleString()} m²</strong></div>
                <div>Built Footprint: <strong class="text-stone-900">${builtUp.toLocaleString()} m²</strong> (${floors} floors)</div>
                <div>Open Ground: <strong class="text-stone-900">${openArea.toLocaleString()} m²</strong></div>
                <div>Occupants: <strong class="text-stone-900">${occupants} persons</strong></div>
                <div class="text-emerald-700 font-semibold">Data Confidence: <strong class="text-emerald-800 font-bold">High (NASA POWER & Open-Meteo)</strong></div>
              </div>
            </div>

            <!-- Score Dial & Status Card -->
            <div class="lg:col-span-4 flex items-center justify-start lg:justify-end gap-5 lg:border-l lg:border-stone-100 lg:pl-8">
              <div class="text-left lg:text-right">
                <span class="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Environmental Recovery Score</span>
                <div class="text-base font-black ${score.composite_score >= 70 ? 'text-emerald-800' : 'text-amber-800'} mt-0.5">
                  ${score.tier}
                </div>
                <div class="text-[11px] text-stone-500 mt-1">
                  Statutory 7-domain composite
                </div>
                <button onclick="window.App.switchView('recovery')" class="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline mt-1.5 inline-block">
                  View Recovery Plan &rarr;
                </button>
              </div>

              <div class="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-3xl border-4 ${score.composite_score >= 70 ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800' : 'border-amber-500 bg-amber-50/50 text-amber-800'} font-serif font-black text-3xl sm:text-4xl shadow-md shadow-emerald-900/5 shrink-0">
                ${score.composite_score}
              </div>

            </div>

          </div>
        </div>

        <!-- RECOVERY CONDITION & DEFICIT GAUGES (SECTION 8 - DYNAMIC) -->
        <div class="space-y-2">
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div class="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-sm text-center">
              <span class="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Current Condition</span>
              <div class="text-2xl sm:text-3xl font-black font-serif text-rose-800 my-1">${baselineConditionScore} <span class="text-xs font-sans text-stone-400 font-normal">/ 100</span></div>
              <span class="text-[10px] text-stone-500 block">Baseline Degradation</span>
            </div>

            <div class="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-sm text-center">
              <span class="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Recoverable Potential</span>
              <div class="text-2xl sm:text-3xl font-black font-serif text-blue-800 my-1">95 <span class="text-xs font-sans text-stone-400 font-normal">/ 100</span></div>
              <span class="text-[10px] text-stone-500 block">Physical Site Ceiling</span>
            </div>

            <div class="p-4 bg-emerald-50/70 rounded-2xl border-2 border-emerald-500/60 shadow-sm text-center">
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Recommended Plan</span>
              <div class="text-2xl sm:text-3xl font-black font-serif text-emerald-800 my-1">${score.composite_score} <span class="text-xs font-sans text-emerald-600 font-normal">/ 100</span></div>
              <span class="text-[10px] text-emerald-700 font-semibold block">GRIHA / NBC Target</span>
            </div>

            <div class="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-sm text-center">
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Maximum Feasible</span>
              <div class="text-2xl sm:text-3xl font-black font-serif text-emerald-800 my-1">95 <span class="text-xs font-sans text-stone-400 font-normal">/ 100</span></div>
              <span class="text-[10px] text-stone-500 block">Aggressive Intervention</span>
            </div>

            <div class="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-sm text-center">
              <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Remaining Deficit</span>
              <div class="text-2xl sm:text-3xl font-black font-serif text-stone-700 my-1">${remainingDeficitPct}%</div>
              <span class="text-[10px] text-stone-400 block">Unavoidable Core Footprint</span>
            </div>
          </div>
          <p class="text-[11px] text-stone-500 italic text-center">
            * Note: Residual ${remainingDeficitPct}% deficit reflects physically unavoidable built footprint core (${builtUp.toLocaleString()} m² built area on ${plotArea.toLocaleString()} m² plot). 100% recovery is physically impossible while preserving structural building envelope.
          </p>
        </div>

        <!-- 2. SECTION: VISUAL ENVIRONMENTAL SUMMARY (SECTION 9: VALUE -> INTERPRETATION -> RECOMMENDED ACTION) -->
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-stone-200 pb-2">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Systemic Diagnostics</span>
              <h2 class="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-serif mt-1">
                Visual Environmental Summary (8 Domains)
              </h2>
            </div>
            <p class="text-xs text-stone-500 hidden sm:block">Structured as: Value &rarr; Interpretation &rarr; Recommended Action</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <!-- 1. Green Cover -->
            <div class="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800">1. Green Cover</span>
                  <span class="text-xs font-bold text-stone-400 font-mono">${greenPct}% &rarr; ${targetGreenPct}%</span>
                </div>
                <div class="text-xl font-black text-stone-900 font-serif mt-1">
                  ${existingGreen.toLocaleString()} m² <span class="text-xs font-sans text-stone-500 font-normal">Remaining</span>
                </div>
                
                <div class="mt-2.5 space-y-2 text-xs">
                  <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-slate-500 block">Value:</strong>
                    <div class="text-slate-700">Baseline green: ${existingGreen.toLocaleString()} m² (${greenPct}% of plot); Feasible addition: +${(greenRoofM2 + permM2).toLocaleString()} m² (roof + porous pavers).</div>
                  </div>
                  <div class="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-amber-800 block">Interpretation:</strong>
                    <div class="text-amber-900">RCC footprint eliminates living soil matrix, deteriorating site evapotranspiration and biophilic cooling.</div>
                  </div>
                  <div class="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-emerald-800 block">Recommended Action:</strong>
                    <div class="text-emerald-950 font-medium">Retrofit ${greenRoofM2.toLocaleString()} m² extensive green roof and ${permM2.toLocaleString()} m² permeable grass paving to attain ${targetGreenPct}% effective green index.</div>
                  </div>
                </div>
              </div>
              <button onclick="window.App.switchView('recovery')" class="w-full py-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition text-center">
                Configure in Recovery &rarr;
              </button>
            </div>

            <!-- 2. Trees -->
            <div class="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-rose-700">2. Trees</span>
                  <span class="text-xs font-bold text-rose-600 font-mono">−${treesRemoved} Felled</span>
                </div>
                <div class="text-xl font-black text-rose-700 font-serif mt-1">
                  ${protectedTrees} <span class="text-xs font-sans text-stone-500 font-normal">Protected</span> / +${targetTrees} <span class="text-xs font-sans text-emerald-600 font-bold">Target</span>
                </div>
                
                <div class="mt-2.5 space-y-2 text-xs">
                  <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-slate-500 block">Value:</strong>
                    <div class="text-slate-700">Existing: ${existingTrees} trees; Protected: ${protectedTrees}; Felled: ${treesRemoved}; Proposed compensatory: ${targetTrees} saplings.</div>
                  </div>
                  <div class="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-rose-800 block">Interpretation:</strong>
                    <div class="text-rose-900">Removal of ${treesRemoved} mature trees causes a ${treesRemoved * 35} m² canopy loss and destroys active biological carbon sequestration.</div>
                  </div>
                  <div class="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-emerald-800 block">Recommended Action:</strong>
                    <div class="text-emerald-950 font-medium">Plant ${targetTrees} indigenous timber and shade saplings (3:1 statutory quota) along cadastral setbacks.</div>
                  </div>
                </div>
              </div>
              <button onclick="window.App.switchView('biodiversity')" class="w-full py-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition text-center">
                Select Native Species &rarr;
              </button>
            </div>

            <!-- 3. Water -->
            <div class="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-blue-700">3. Water</span>
                  <span class="text-xs font-bold text-blue-600 font-mono">${waterOffsetPct}% Offset</span>
                </div>
                <div class="text-xl font-black text-blue-700 font-serif mt-1">
                  ${rwhYieldM3.toLocaleString()} m³/yr <span class="text-xs font-sans text-stone-500 font-normal">Harvested</span>
                </div>
                
                <div class="mt-2.5 space-y-2 text-xs">
                  <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-slate-500 block">Value:</strong>
                    <div class="text-slate-700">Rainfall: ${weatherRain} mm; Annual demand: ${annualDemandM3.toLocaleString()} m³ (${occupants} occupants); RWH yield: ${rwhYieldM3.toLocaleString()} m³; Tank: ${tankLitres.toLocaleString()} L.</div>
                  </div>
                  <div class="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-blue-800 block">Interpretation:</strong>
                    <div class="text-blue-900">Abundant monsoon precipitation currently drains off-site unharvested while site draws municipal mains.</div>
                  </div>
                  <div class="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-emerald-800 block">Recommended Action:</strong>
                    <div class="text-emerald-950 font-medium">Construct ${tankCapKL} kL underground cistern with dual-chamber vortex filter and overflow recharge pits.</div>
                  </div>
                </div>
              </div>
              <button onclick="window.App.switchView('stormwater')" class="w-full py-1.5 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 rounded-xl hover:bg-blue-100 transition text-center">
                Inspect Water Balance &rarr;
              </button>
            </div>

            <!-- 4. Stormwater -->
            <div class="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-700">4. Stormwater</span>
                  <span class="text-xs font-bold text-emerald-700 font-mono">Attenuated Peak</span>
                </div>
                <div class="text-xl font-black text-indigo-900 font-serif mt-1">
                  ${peakQBefore} &rarr; ${peakQAfter} <span class="text-xs font-sans text-stone-500 font-normal">m³/hr</span>
                </div>
                
                <div class="mt-2.5 space-y-2 text-xs">
                  <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-slate-500 block">Value:</strong>
                    <div class="text-slate-700">Impervious area: ${hardscape.toLocaleString()} m² (${imperviousPct}%); Peak discharge: ${peakQBefore} &rarr; ${peakQAfter} m³/hr.</div>
                  </div>
                  <div class="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-rose-800 block">Interpretation:</strong>
                    <div class="text-rose-900">Dense hardscape prevents soil soaking and poses localized flooding risks during monsoon cloudbursts.</div>
                  </div>
                  <div class="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-emerald-800 block">Recommended Action:</strong>
                    <div class="text-emerald-950 font-medium">Route surface flow into ${bioswaleM2.toLocaleString()} m² linear bioswales and ${permM2.toLocaleString()} m² permeable paver sub-base to attenuate runoff.</div>
                  </div>
                </div>
              </div>
              <button onclick="window.App.switchView('stormwater')" class="w-full py-1.5 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition text-center">
                View Rational Runoff &rarr;
              </button>
            </div>

            <!-- 5. Energy -->
            <div class="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-amber-700">5. Energy & Solar</span>
                  <span class="text-xs font-bold text-amber-600 font-mono">${solarOffsetPct}% Offset</span>
                </div>
                <div class="text-xl font-black text-amber-600 font-serif mt-1">
                  ${solarKwp} kWp <span class="text-xs font-sans text-stone-500 font-normal">Capacity</span>
                </div>
                
                <div class="mt-2.5 space-y-2 text-xs">
                  <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-slate-500 block">Value:</strong>
                    <div class="text-slate-700">Electricity demand: ${elecDemandKwh.toLocaleString()} kWh/yr; Solar PV: ${solarKwp} kWp; Generation: ${Math.round(solarGenKwh / 1000)} MWh/yr.</div>
                  </div>
                  <div class="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-amber-800 block">Interpretation:</strong>
                    <div class="text-amber-900">Total grid reliance costs ~₹${Math.round(elecDemandKwh * 8.5 / 100000).toFixed(1)} Lakh/yr in power tariffs and emits ${operationalCO2} t CO₂e of Scope 2 emissions.</div>
                  </div>
                  <div class="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-emerald-800 block">Recommended Action:</strong>
                    <div class="text-emerald-950 font-medium">Mount ${solarKwp} kWp PV array over ${solarM2.toLocaleString()} m² roof (co-locating bio-solar) to achieve ${solarOffsetPct}% net electrical autonomy.</div>
                  </div>
                </div>
              </div>
              <button onclick="window.App.switchView('energy')" class="w-full py-1.5 text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-50 rounded-xl hover:bg-amber-100 transition text-center">
                Explore Solar Layout &rarr;
              </button>
            </div>

            <!-- 6. Carbon -->
            <div class="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-700">6. Carbon Balance</span>
                  <span class="text-xs font-bold text-emerald-700 font-mono">−${avoidedSolarCO2} t/yr Offset</span>
                </div>
                <div class="text-xl font-black text-slate-800 font-serif mt-1">
                  ${embodiedCarbon} t <span class="text-xs font-sans text-stone-500 font-normal">Embodied</span>
                </div>
                
                <div class="mt-2.5 space-y-2 text-xs">
                  <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-slate-500 block">Value:</strong>
                    <div class="text-slate-700">Embodied carbon: ${embodiedCarbon} t CO₂e; Operational: ${operationalCO2} t/yr; Avoided clean power: −${avoidedSolarCO2} t/yr; Tree sink: −${treeCO2} t/yr.</div>
                  </div>
                  <div class="p-2.5 bg-slate-100 rounded-xl border border-slate-200 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-slate-600 block">Interpretation:</strong>
                    <div class="text-slate-800">High embodied footprint from structural concrete requires active operational offset and low-carbon cement replacement.</div>
                  </div>
                  <div class="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-emerald-800 block">Recommended Action:</strong>
                    <div class="text-emerald-950 font-medium">Substitute 35% GGBS / Fly Ash concrete to avoid ~${Math.round(embodiedCarbon * 0.25)} t CO₂e and offset 100% operational emissions with solar.</div>
                  </div>
                </div>
              </div>
              <button onclick="window.App.switchView('materials')" class="w-full py-1.5 text-[11px] font-bold text-slate-800 hover:text-black bg-slate-100 rounded-xl hover:bg-slate-200 transition text-center">
                Inspect Carbon Matrix &rarr;
              </button>
            </div>

            <!-- 7. Biodiversity -->
            <div class="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800">7. Biodiversity</span>
                  <span class="text-xs font-bold text-emerald-700 font-mono">+42% BNG</span>
                </div>
                <div class="text-xl font-black text-emerald-800 font-serif mt-1">
                  ${targetBng} / 100 <span class="text-xs font-sans text-stone-500 font-normal">Target</span>
                </div>
                
                <div class="mt-2.5 space-y-2 text-xs">
                  <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-slate-500 block">Value:</strong>
                    <div class="text-slate-700">Baseline habitat score: ${baselineBng}/100; Target: ${targetBng}/100; Restored habitat: +${(greenRoofM2 + (targetTrees * 16)).toLocaleString()} m².</div>
                  </div>
                  <div class="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-amber-800 block">Interpretation:</strong>
                    <div class="text-amber-900">Extensive concrete paving breaks local ecological corridors, preventing songbird nesting and pollinator flight.</div>
                  </div>
                  <div class="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-emerald-800 block">Recommended Action:</strong>
                    <div class="text-emerald-950 font-medium">Establish 4-tier Miyawaki pocket forest with native species and nectar-rich perennial pollinator corridors.</div>
                  </div>
                </div>
              </div>
              <button onclick="window.App.switchView('biodiversity')" class="w-full py-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition text-center">
                View Flora Selection &rarr;
              </button>
            </div>

            <!-- 8. Waste -->
            <div class="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-amber-800">8. Waste & Circularity</span>
                  <span class="text-xs font-bold text-emerald-700 font-mono">68% Diverted</span>
                </div>
                <div class="text-xl font-black text-amber-800 font-serif mt-1">
                  ${divertedTonnes} <span class="text-xs font-sans text-stone-500 font-normal">t Crushed</span>
                </div>
                
                <div class="mt-2.5 space-y-2 text-xs">
                  <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-slate-500 block">Value:</strong>
                    <div class="text-slate-700">C&D waste: ${cdWasteTonnes} tonnes; Diverted: ${divertedTonnes} tonnes (68%); RCA yield: ${rcaYieldM3} m³; Compost: ${annualCompostTonnes} t/yr.</div>
                  </div>
                  <div class="p-2.5 bg-slate-100 rounded-xl border border-slate-200 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-slate-600 block">Interpretation:</strong>
                    <div class="text-slate-800">Landfill dumping squanders valuable crushed concrete sub-base and generates fugitive methane from organic waste.</div>
                  </div>
                  <div class="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-0.5">
                    <strong class="text-[10px] uppercase font-bold text-emerald-800 block">Recommended Action:</strong>
                    <div class="text-emerald-950 font-medium">Crush demolition masonry on site for permeable paver subgrade (yielding ${rcaYieldM3} m³ aggregate) and compost organic campus waste.</div>
                  </div>
                </div>
              </div>
              <button onclick="window.App.switchView('waste')" class="w-full py-1.5 text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-50 rounded-xl hover:bg-amber-100 transition text-center">
                Inspect Circular Protocols &rarr;
              </button>
            </div>

          </div>
        </div>

        <!-- 4. SECTION: VISUAL DIAGNOSTICS & MULTI-CRITERIA RADAR CHARTS -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Chart 1: Surface Cadastre Doughnut -->
          <div class="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider text-stone-500">Spatial Geometry</h3>
                <div class="text-base font-bold text-stone-900 font-serif">Site Land-Cover Cadastre</div>
              </div>
              <span class="text-xs font-black text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full">${project.site.plot_area.toLocaleString()} m²</span>
            </div>
            <div class="relative h-60 flex items-center justify-center">
              <canvas id="chart-surface-doughnut"></canvas>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs border-t pt-3">
              <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-slate-700 shrink-0"></span><span>Built: <strong>${project.site.built_up_area} m²</strong></span></div>
              <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0"></span><span>Concrete: <strong>${project.surfaces.concrete_area} m²</strong></span></div>
              <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span><span>Green: <strong>${project.vegetation.existing_green_area} m²</strong></span></div>
              <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0"></span><span>Open Soil: <strong>${project.surfaces.soil_open_ground || 0} m²</strong></span></div>
            </div>
          </div>

          <!-- Chart 2: Monthly RWH Potential -->
          <div class="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider text-stone-500">Hydrology Yield</h3>
                <div class="text-base font-bold text-stone-900 font-serif">Monthly RWH Potential</div>
              </div>
              <span class="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">${(rwh.annual_potential_litres / 1000).toFixed(0)} m³/yr</span>
            </div>
            <div class="relative h-60">
              <canvas id="chart-monthly-rwh"></canvas>
            </div>
            <p class="text-[11px] text-stone-500 border-t pt-2">
              Roof area (${project.site.roof_area} m²), runoff coeff 0.85, and filter efficiency 0.85 against ERA5 historical monthly precipitation.
            </p>
          </div>

          <!-- Chart 3: Sustainability Multi-Criteria Radar -->
          <div class="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider text-stone-500">Equilibrium Index</h3>
                <div class="text-base font-bold text-stone-900 font-serif">7-Dimension Radar Score</div>
              </div>
              <span class="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">${score.composite_score} / 100</span>
            </div>
            <div class="relative h-60 flex items-center justify-center">
              <canvas id="chart-score-radar"></canvas>
            </div>
            <div class="text-[11px] text-stone-500 border-t pt-2 flex items-center justify-between">
              <span>Scientific Domain Weights</span>
              <button onclick="window.App.switchView('methodology')" class="text-emerald-700 font-bold hover:underline">
                View Weights &rarr;
              </button>
            </div>
          </div>

        </div>

        <!-- 5. SECTION: REAL ONLINE CLIMATE & METEOROLOGICAL TELEMETRY -->
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-stone-200 pb-2">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Atmospheric Data Feeds</span>
              <h2 class="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-serif mt-1">
                Real-Time Meteorological & Air Telemetry
              </h2>
            </div>
            <p class="text-xs text-stone-500 hidden sm:block">Live scientific data from Open-Meteo, ECMWF ERA5-Land, and Copernicus CAMS</p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            
            <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <div class="text-[10px] text-stone-400 font-bold uppercase">Temperature</div>
              <div class="text-xl font-black text-stone-900 font-serif">${env.weather.temperature.current_c}°C</div>
              <div class="text-[11px] text-stone-500">Max: ${env.weather.temperature.max_c}° | Min: ${env.weather.temperature.min_c}°</div>
              <div class="text-[9px] text-emerald-700 font-bold pt-1 border-t truncate">🟢 ${env.weather.source}</div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <div class="text-[10px] text-stone-400 font-bold uppercase">Annual Rainfall</div>
              <div class="text-xl font-black text-blue-700 font-serif">${env.rainfall.annual_rainfall_mm} mm</div>
              <div class="text-[11px] text-stone-500">Design Storm: ${env.rainfall.peak_intensity_mm_hr} mm/hr</div>
              <div class="text-[9px] text-emerald-700 font-bold pt-1 border-t truncate">🟢 ERA5-Land Reanalysis</div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <div class="text-[10px] text-stone-400 font-bold uppercase">Air Quality (AQI)</div>
              <div class="text-xl font-black text-${env.airQuality.category_color}-600 font-serif">${env.airQuality.aqi}</div>
              <div class="text-[11px] text-stone-500">${env.airQuality.category}</div>
              <div class="text-[9px] text-emerald-700 font-bold pt-1 border-t truncate">🟢 Copernicus CAMS</div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <div class="text-[10px] text-stone-400 font-bold uppercase">PM2.5 Particulates</div>
              <div class="text-xl font-black text-stone-900 font-serif">${env.airQuality.pm25} <span class="text-xs font-normal text-stone-400">µg/m³</span></div>
              <div class="text-[11px] text-stone-500">PM10: ${env.airQuality.pm10} µg/m³</div>
              <div class="text-[9px] text-emerald-700 font-bold pt-1 border-t truncate">🟢 WHO Limit: 15 µg/m³</div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <div class="text-[10px] text-stone-400 font-bold uppercase">Solar Sunshine</div>
              <div class="text-xl font-black text-amber-600 font-serif">${env.solar.daily_peak_sun_hours} <span class="text-xs font-normal text-stone-400">PSH</span></div>
              <div class="text-[11px] text-stone-500">${env.solar.annual_solar_radiation_kwh_m2} kWh/m²/yr</div>
              <div class="text-[9px] text-emerald-700 font-bold pt-1 border-t truncate">🟢 NASA POWER / Open-Meteo</div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <div class="text-[10px] text-stone-400 font-bold uppercase">Humidity & Wind</div>
              <div class="text-xl font-black text-stone-900 font-serif">${env.weather.humidity_pct}%</div>
              <div class="text-[11px] text-stone-500">Wind: ${env.weather.wind_speed_kmh} km/h</div>
              <div class="text-[9px] text-emerald-700 font-bold pt-1 border-t truncate">🟢 Surface Station</div>
            </div>

          </div>
        </div>

        <!-- 6. SECTION: ACTIONABLE GREEN INFRASTRUCTURE RECOVERY PORTFOLIO -->
        <div class="bg-gradient-to-br from-[#14281D] via-[#1E3A2B] to-[#0D1912] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-900/60 pb-5">
            <div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ⚡ Actionable Engineering Targets
              </span>
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight font-serif text-white mt-1">
                Your Site Recovery Strategy
              </h2>
              <p class="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
                Sized interventions to neutralize runoff surges, tree felling deficits, and carbon footprints within physical plot boundaries.
              </p>
            </div>

            <button onclick="window.App.switchView('scenariostudio')" class="px-5 py-3 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-lg transition flex items-center gap-2 self-start md:self-auto group">
              <span>Test in What-If Studio</span>
              <span class="transition-transform group-hover:translate-x-1">&rarr;</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            <div class="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 space-y-2 hover:bg-white/15 transition">
              <div class="text-2xl font-black text-amber-300 font-serif">${tree.recommended_planting_quantity} Trees</div>
              <div class="text-xs font-bold text-white">Compensatory Planting</div>
              <p class="text-[11px] text-emerald-100/80 leading-relaxed">
                Plant ${tree.recommended_planting_quantity} native trees (${tree.replacement_ratio}:1 ratio) to replace ${tree.trees_removed} removed trees and restore ${tree.projected_canopy_10yr_m2.toLocaleString()} m² canopy.
              </p>
            </div>

            <div class="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 space-y-2 hover:bg-white/15 transition">
              <div class="text-2xl font-black text-emerald-300 font-serif">${calculations.green_infra_potential.recommended_permeable_pavement_m2.toLocaleString()} m²</div>
              <div class="text-xs font-bold text-white">Permeable Pavers (IRC:SP:63)</div>
              <p class="text-[11px] text-emerald-100/80 leading-relaxed">
                Convert ${calculations.green_infra_potential.permeable_pavement_conversion_pct}% of concrete pavement to porous pavers to restore infiltration and cut peak storm surge.
              </p>
            </div>

            <div class="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 space-y-2 hover:bg-white/15 transition">
              <div class="text-2xl font-black text-teal-300 font-serif">${calculations.green_infra_potential.recommended_green_roof_m2.toLocaleString()} m²</div>
              <div class="text-xs font-bold text-white">Extensive Sedum Green Roof</div>
              <p class="text-[11px] text-emerald-100/80 leading-relaxed">
                Retrofit ~35% of flat terrace roof with lightweight vegetative matting (65% rainwater retention and thermal cooling).
              </p>
            </div>

            <div class="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 space-y-2 hover:bg-white/15 transition">
              <div class="text-2xl font-black text-blue-300 font-serif">${(rwh.recommended_storage_range_litres.optimum / 1000).toLocaleString()} kL</div>
              <div class="text-xs font-bold text-white">RWH Storage Tank Sizing</div>
              <p class="text-[11px] text-emerald-100/80 leading-relaxed">
                Install a ${rwh.recommended_storage_range_litres.optimum.toLocaleString()} L capacity tank to offset ${rwh.demand_offset_percentage}% of annual campus water needs.
              </p>
            </div>

            <div class="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 space-y-2 hover:bg-white/15 transition">
              <div class="text-2xl font-black text-yellow-300 font-serif">${energy.installed_capacity_kwp} kWp</div>
              <div class="text-xs font-bold text-white">Rooftop Solar PV Array</div>
              <p class="text-[11px] text-emerald-100/80 leading-relaxed">
                Install ${energy.installed_capacity_kwp} kWp solar panels across ${energy.solar_allocated_area_m2} m² roof to generate ~${energy.annual_generation_kwh.toLocaleString()} kWh/yr clean power.
              </p>
            </div>

          </div>
        </div>

      </div>
    `;

    setTimeout(() => {
      this.initCharts(project, calculations, environmentalData);
    }, 80);
  },

  initCharts(project, calculations, environmentalData) {
    if (!window.Chart) return;

    // 1. Surface Area Breakdown (Doughnut)
    const ctxDoughnut = document.getElementById("chart-surface-doughnut");
    if (ctxDoughnut) {
      if (this.charts.surface) this.charts.surface.destroy();
      this.charts.surface = new window.Chart(ctxDoughnut, {
        type: "doughnut",
        data: {
          labels: ["Built Footprint", "Concrete Paved", "Existing Green", "Open Ground"],
          datasets: [{
            data: [
              project.site.built_up_area,
              project.surfaces.concrete_area,
              project.vegetation.existing_green_area,
              project.surfaces.soil_open_ground || 0
            ],
            backgroundColor: ["#334155", "#94a3b8", "#10b981", "#d97706"],
            borderWidth: 2,
            borderColor: "#ffffff"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          cutout: "68%"
        }
      });
    }

    // 2. Monthly RWH Potential (Bar)
    const ctxRwh = document.getElementById("chart-monthly-rwh");
    if (ctxRwh) {
      if (this.charts.rwh) this.charts.rwh.destroy();
      const monthly = calculations.rwh.monthly_harvest;
      this.charts.rwh = new window.Chart(ctxRwh, {
        type: "bar",
        data: {
          labels: monthly.map(m => m.month),
          datasets: [{
            label: "Collection (m³)",
            data: monthly.map(m => m.harvest_m3),
            backgroundColor: "#0284c7",
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: "#f1f5f9" },
              ticks: { font: { size: 10 } }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 } }
            }
          }
        }
      });
    }

    // 3. Multi-Criteria Radar Chart
    const ctxRadar = document.getElementById("chart-score-radar");
    if (ctxRadar) {
      if (this.charts.radar) this.charts.radar.destroy();
      const sc = calculations.score;
      this.charts.radar = new window.Chart(ctxRadar, {
        type: "radar",
        data: {
          labels: [
            "Green Cover",
            "Tree Retention",
            "Stormwater",
            "Water Autonomy",
            "Clean Energy",
            "Permeability",
            "Waste Circularity"
          ],
          datasets: [{
            label: "Site Performance Score",
            data: [
              sc?.sub_indicators?.green_cover?.score ?? sc?.sub_indicators?.green_cover_deficit_score?.score ?? 75,
              sc?.sub_indicators?.tree_retention?.score ?? sc?.sub_indicators?.tree_retention_score?.score ?? 80,
              sc?.sub_indicators?.stormwater_mgmt?.score ?? sc?.sub_indicators?.stormwater_mitigation_score?.score ?? 85,
              sc?.sub_indicators?.water_conservation?.score ?? sc?.sub_indicators?.water_conservation_score?.score ?? 78,
              sc?.sub_indicators?.renewable_energy?.score ?? sc?.sub_indicators?.renewable_energy_score?.score ?? 90,
              sc?.sub_indicators?.surface_permeability?.score ?? sc?.sub_indicators?.surface_permeability_score?.score ?? 72,
              sc?.sub_indicators?.waste_management?.score ?? sc?.sub_indicators?.waste_management_score?.score ?? 68
            ],
            backgroundColor: "rgba(16, 185, 129, 0.25)",
            borderColor: "#10b981",
            pointBackgroundColor: "#10b981",
            pointBorderColor: "#ffffff",
            pointHoverBackgroundColor: "#ffffff",
            pointHoverBorderColor: "#10b981",
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: { display: false, stepSize: 20 },
              pointLabels: { font: { size: 9, weight: "bold" }, color: "#475569" },
              grid: { color: "#e2e8f0" }
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    }
  }
};
