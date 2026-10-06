/**
 * EcoBuild Smart - Post-Occupancy Environmental Monitoring Dashboard
 * 
 * Tracks real-world post-construction performance against modeled EIA targets.
 * Features:
 * - Actual vs. Predicted Performance Gauges
 * - Recovery Progress Index & Prediction Accuracy Metric
 * - Section 34 Corrective Action System (CAS) & Diagnostic Root-Cause Analysis
 * - Step-by-Step Remediation Protocols (48h Immediate, 30-Day Engineering, 90-Day Verification)
 * - Work Order Issuance Engine with Telemetry Verification
 * - Dynamic Alert Engine (Water, Trees, Green Area, Solar, Waste)
 * - Condition-responsive calibration based on user telemetry
 */

window.MonitoringView = {
  selectedDiagnostic: null,

  diagnosticProtocols: {
    arboriculture: {
      title: "Root-Cause Diagnosis: Compensatory Tree Survival Lag",
      domain: "Arboriculture & Biodiversity",
      icon: "🌳",
      rootCauses: [
        { cause: "Soil Compaction & Subgrade Suffocation", probability: "65%", detail: "Heavy vehicular traffic over unpaved open ground compacted soil bulk density above 1.65 g/cm³, choking sapling root aeration." },
        { cause: "Tertiary Drip Irrigation Emitter Clogging", probability: "25%", detail: "Mineral silt deposits in lateral micro-emitters caused localized moisture deficits during peak dry months." },
        { cause: "Mycorrhizal Inoculant Deficiency in Pit Fill", probability: "10%", detail: "Non-salvaged subgrade earth was utilized in sapling pits without mycorrhizal fungi bio-fertilizer inoculation." }
      ],
      checklist: [
        "Perform penetrometer resistance testing across root protection zones (target < 1.5 MPa).",
        "Inspect secondary drip lines for silt blockage and verify 8–12 L/day discharge per tree pit.",
        "Verify sapling collar depth is precisely level with finished grade; adjust soil collars buried > 5cm."
      ],
      phases: {
        immediate: "48-Hour Response: Deep pneumatic soil aeration and root-drenching with organic humic acid and mycorrhizal liquid culture.",
        shortTerm: "30-Day Engineering Action: Plant mandatory replacement nursery specimens (min 2.5m height) to restore ≥90% survival quota under Tree Authority Act.",
        longTerm: "90-Day Verification: Bi-monthly sapling health logging and high-resolution multispectral vegetative canopy audit."
      }
    },
    hydrology: {
      title: "Root-Cause Diagnosis: Rainwater Harvesting Cistern Under-Yield",
      domain: "Hydrology & Stormwater",
      icon: "💧",
      rootCauses: [
        { cause: "First-Flush Vortex Diverter Mesh Siltation", probability: "70%", detail: "Accumulation of decomposed leaf litter and fine road dust in the 1.5mm stainless steel vortex screen restricted inflow." },
        { cause: "Rooftop Gutter Downspout Grate Obstruction", probability: "20%", detail: "Terrace perimeter leaf guards were partially obstructed by airborne debris, causing storm runoff to overtop into exterior drains." },
        { cause: "Inflow Ultrasonic Flow Meter Scaling", probability: "10%", detail: "Mineral residue on pulse meter sensor electrodes introduced a -8% calibration drift in metered volume." }
      ],
      checklist: [
        "Unscrew vortex filter cleanout cap and inspect stainless steel screen mesh for silt cake accumulation.",
        "Inspect all rooftop downspout collection headers and verify 1:80 minimum gradient gravity fall.",
        "Run 5-minute pressurized backwash through multimedia sand filter prior to tank storage inlet."
      ],
      phases: {
        immediate: "48-Hour Response: Open first-flush chamber cleanout valve, flush de-silting sump, and pressure-wash stainless steel filter basket.",
        shortTerm: "30-Day Engineering Action: Install dual coarse leaf screens at roof drain sumps and recalibrate ultrasonic water depth transducer.",
        longTerm: "90-Day Verification: Audit metered storage inflow against meteorological rain gauge to verify capture efficiency exceeds 85%."
      }
    },
    solar: {
      title: "Root-Cause Diagnosis: Photovoltaic Generation Lag",
      domain: "Renewable Energy",
      icon: "☀️",
      rootCauses: [
        { cause: "Atmospheric Soiling & Particulate Deposition", probability: "75%", detail: "Dry seasonal airborne particulate deposition formed an opaque dust layer over panels, reducing irradiance transmittance by 8–12%." },
        { cause: "String Inverter Thermal Throttling / Derating", probability: "18%", detail: "Terrace ambient temperature exceeded 42°C during noon peak sun hours, triggering automatic inverter safety power derating." },
        { cause: "Growing Perimeter Tree Shading", probability: "7%", detail: "Western boundary tree canopy branches extended into afternoon solar trajectory, casting shadow across String 3." }
      ],
      checklist: [
        "Measure open-circuit voltage (Voc) and operating current (Isc) across each string using PV clamp meter.",
        "Inspect panel glass surfaces for particulate baking or localized bird-dropping hotspot cells.",
        "Check inverter heat-sink ventilation clearance and cooling fan exhaust channels."
      ],
      phases: {
        immediate: "48-Hour Response: Execute de-mineralized water panel cleaning with soft microfiber rotary brushes before 08:00 AM.",
        shortTerm: "30-Day Engineering Action: Trim overhanging western branches outside root protection zone and inspect string combiner boxes.",
        longTerm: "90-Day Verification: Audit daily generation profiles against NASA POWER satellite irradiance model to verify <2% loss."
      }
    },
    vegetation: {
      title: "Root-Cause Diagnosis: Active Green Cover Area Deficit",
      domain: "Vegetation & Microclimate",
      icon: "🌱",
      rootCauses: [
        { cause: "Sedum Substrate Desiccation on Roof", probability: "60%", detail: "High wind exposure on open terrace dried out 75mm engineered soil substrate during prolonged dry spell." },
        { cause: "Shrub Buffer Trampling along Walkway Edges", probability: "25%", detail: "Pedestrian spillover caused localized soil compaction and damage to groundcover shrubs." },
        { cause: "Nutrient Depletion in Planter Soils", probability: "15%", detail: "Lack of regular organic composting replenishment reduced nitrogen and phosphorus availability." }
      ],
      checklist: [
        "Measure soil moisture content across green roof zones using TDR probe (target > 22%).",
        "Inspect low-voltage drip controller valves and pressure regulators for terrace planters.",
        "Check perimeter curb edging along pedestrian paths to prevent footpath shortcutting."
      ],
      phases: {
        immediate: "48-Hour Response: Adjust smart irrigation schedule to deliver early morning misting and install temporary bio-fabric shading.",
        shortTerm: "30-Day Engineering Action: Re-spread 2 tonnes of on-site cafeteria organic compost and re-seed drought-hardy Sedum plugs.",
        longTerm: "90-Day Verification: Monitor canopy coverage via drone photogrammetry to ensure 100% plan area restoration."
      }
    },
    circularity: {
      title: "Root-Cause Diagnosis: C&D Rubble Recycling Lag",
      domain: "Circular Economy & Waste",
      icon: "♻️",
      rootCauses: [
        { cause: "Co-Mingling of Masonry Rubble with Packaging Plastics", probability: "68%", detail: "Civil demolition contractor mixed mortar and concrete rubble with non-inert plastics, preventing on-site crushing." },
        { cause: "Crusher Mechanical Downtime", probability: "22%", detail: "Portable jaw crusher unit was non-operational for 12 days awaiting replacement screen mesh." },
        { cause: "Sub-Base Grading Non-Compliance", probability: "10%", detail: "Aggregate grain size exceeded MoRTH 40mm limits for road sub-base use." }
      ],
      checklist: [
        "Audit waste segregation staging bays for clear inert vs. non-inert labeling.",
        "Inspect portable jaw crusher output grain distribution (target 20-40mm crushed aggregate).",
        "Review C&D waste transfer manifests against CPWD recycling quotas."
      ],
      phases: {
        immediate: "48-Hour Response: Establish strict 3-stream segregation bins at building perimeter and halt mixed debris hauling.",
        shortTerm: "30-Day Engineering Action: Mobilize mobile impact crusher to process backlogged rubble into certified IRC sub-base material.",
        longTerm: "90-Day Verification: Verify monthly CPCB Form I manifest logs confirming ≥65% material reuse."
      }
    }
  },

  // Monitored actual values (defaults initialized to realistic post-occupancy metrics)
  actuals: {
    trees_surviving: 84, // out of 90 planted (93.3% survival)
    green_area_m2: 1950, // out of ~2,120 target
    rwh_collected_kl: 1540, // out of 1,624 kL predicted
    water_reused_kl: 1420,
    solar_kwh: 178500, // out of 183,000 predicted
    waste_recycled_tonnes: 195, // out of 214 tonnes
    compost_produced_kg: 2150, // out of 2,300 kg
    runoff_observed_surge: 'Low' // 'Zero' | 'Low' | 'Moderate' | 'High'
  },

  openDiagnostic(key) {
    this.selectedDiagnostic = key;
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  },

  closeDiagnostic() {
    this.selectedDiagnostic = null;
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  },

  issueWorkOrder(key) {
    const proto = this.diagnosticProtocols[key];
    const title = proto ? proto.title : "Corrective Action";
    if (window.App?.showNotification) {
      window.App.showNotification(
        "Statutory Work Order Issued",
        `Work Order #WO-2026-${Math.floor(1000 + Math.random() * 9000)} generated for "${title}". Assigned to Environmental Facilities Team with 48h SLA.`,
        "success"
      );
    }
    this.closeDiagnostic();
  },

  render(project, calculations, environmentalData) {
    const container = document.getElementById("monitoring-view");
    if (!container) return;

    const proj = project || window.App?.currentProject || {};
    const calc = calculations || window.App?.calculations || {};
    const site = proj.site || {};
    const surfaces = proj.surfaces || {};
    const plot = site.plot_area || 5000;
    const roof = site.roof_area || 2200;
    const openGround = site.open_area || Math.max(0, plot - (site.built_up_area || 2200));
    const hardscape = (surfaces.concrete_area || 0) + (surfaces.asphalt_area || 0) + (surfaces.paved_surfaces_area || 0) || Math.max(0, plot - roof - openGround) || 1200;
    const treesRemoved = proj.vegetation?.trees_removed || 0;
    const occupants = proj.occupancy?.total_occupants || proj.water?.occupants || 250;

    const dynTrees = Math.min(Math.max(15, treesRemoved * 3), Math.floor((openGround * 0.6) / 16));
    const dynGreenRoof = Math.round(roof * 0.27);
    const dynPermPavers = Math.round(Math.min(hardscape * 0.45, hardscape));
    const dynRwhL = Math.round(Math.min(roof * 40, Math.max(15000, occupants * 45 * 18)));
    const dynSolarArea = Math.round(Math.min(roof * 0.35, Math.max(0, roof - dynGreenRoof)));

    const iv = {
      trees_planted: proj.interventions?.trees_planted ?? dynTrees,
      green_roof_m2: proj.interventions?.green_roof_m2 ?? dynGreenRoof,
      permeable_pavement_m2: proj.interventions?.permeable_pavement_m2 ?? dynPermPavers,
      rwh_tank_capacity_l: proj.interventions?.rwh_tank_capacity_l ?? dynRwhL,
      solar_pv_area_m2: proj.interventions?.solar_pv_area_m2 ?? dynSolarArea
    };

    // Targets from models
    const targetTrees = iv.trees_planted;
    const targetGreenArea = (proj.vegetation?.existing_green_area || Math.round(plot * 0.25)) + iv.green_roof_m2 + (targetTrees * 8);
    const targetRwhKl = Math.round((calc.rwh?.annual_potential_litres || (iv.rwh_tank_capacity_l * 18)) / 1000);
    const targetSolarKwh = calc.energy?.annual_generation_kwh || Math.round((iv.solar_pv_area_m2 / 5.5) * 1450);
    const targetWasteRecycled = Math.round((proj.waste?.construction_waste_tonnes || ((site.total_floor_area || 4000) * 0.055)) * 0.65);
    const targetCompostKg = Math.round((proj.waste?.daily_organic_waste_kg || (occupants * 0.25)) * 365 * 0.25);

    // Initialize or adapt actuals dynamically so they correspond to this project's scale
    if (!this.currentProjectId || this.currentProjectId !== proj.id) {
      this.currentProjectId = proj.id;
      this.actuals = {
        trees_surviving: Math.round(targetTrees * 0.88), // default to slightly below target to test CAS
        green_area_m2: Math.round(targetGreenArea * 0.94),
        rwh_collected_kl: Math.round(targetRwhKl * 0.82), // trigger hydrology alert
        solar_kwh: Math.round(targetSolarKwh * 0.89), // trigger solar alert
        waste_recycled_tonnes: Math.round(targetWasteRecycled * 0.76), // trigger waste alert
        compost_produced_kg: Math.round(targetCompostKg * 0.93),
        runoff_observed_surge: 'Low'
      };
    }

    // Compute Performance Ratios
    const treeSurvivalPct = Math.min(100, Math.round((this.actuals.trees_surviving / Math.max(1, targetTrees)) * 100));
    const greenAreaRatio = Math.min(100, Math.round((this.actuals.green_area_m2 / Math.max(1, targetGreenArea)) * 100));
    const rwhRatio = Math.min(100, Math.round((this.actuals.rwh_collected_kl / Math.max(1, targetRwhKl)) * 100));
    const solarRatio = Math.min(100, Math.round((this.actuals.solar_kwh / Math.max(1, targetSolarKwh)) * 100));
    const wasteRatio = Math.min(100, Math.round((this.actuals.waste_recycled_tonnes / Math.max(1, targetWasteRecycled)) * 100));

    // Overall Recovery Progress % & Prediction Accuracy %
    const recoveryProgress = Math.round((treeSurvivalPct + greenAreaRatio + rwhRatio + solarRatio + wasteRatio) / 5);
    const accuracyErrors = [
      Math.abs(100 - treeSurvivalPct),
      Math.abs(100 - greenAreaRatio),
      Math.abs(100 - rwhRatio),
      Math.abs(100 - solarRatio),
      Math.abs(100 - wasteRatio)
    ];
    const avgError = accuracyErrors.reduce((a, b) => a + b, 0) / accuracyErrors.length;
    const predictionAccuracy = Math.max(70, Math.round(100 - avgError));

    // Generate Dynamic Statutory Alerts
    const alerts = [];
    if (this.actuals.trees_surviving < targetTrees * 0.90) {
      alerts.push({
        key: 'arboriculture',
        type: 'warning',
        domain: 'Arboriculture',
        icon: '🌳',
        title: 'Tree Survival Rate Below Statutory Target',
        desc: `Current survival is ${treeSurvivalPct}% (${this.actuals.trees_surviving}/${targetTrees} trees). NBC 2016 and Tree Authority require ≥90% survival for compensatory compliance. Replacement saplings must be planted before onset of next monsoon.`,
        action: 'Diagnose Root Cause & Action Plan'
      });
    }

    if (this.actuals.rwh_collected_kl < targetRwhKl * 0.85) {
      alerts.push({
        key: 'hydrology',
        type: 'caution',
        domain: 'Hydrology',
        icon: '💧',
        title: 'Rainwater Storage Yield Below Modeled Demand',
        desc: `Collected harvest (${this.actuals.rwh_collected_kl} kL) is ${(100 - rwhRatio)}% below modeled annual potential (${targetRwhKl} kL). Inspect rooftop conveyance gutters, first-flush vortex diverters, and filter mesh for silt clogging.`,
        action: 'Diagnose Root Cause & Action Plan'
      });
    }

    if (this.actuals.solar_kwh < targetSolarKwh * 0.92) {
      alerts.push({
        key: 'solar',
        type: 'info',
        domain: 'Renewable Energy',
        icon: '☀️',
        title: 'Photovoltaic Yield Below Predicted Generation',
        desc: `Monitored yield (${this.actuals.solar_kwh.toLocaleString()} kWh) is lagging predicted model (${targetSolarKwh.toLocaleString()} kWh). Check for airborne dust soiling or inverter clipping. Bi-weekly panel cleaning recommended.`,
        action: 'Diagnose Root Cause & Action Plan'
      });
    }

    if (this.actuals.green_area_m2 < targetGreenArea * 0.90) {
      alerts.push({
        key: 'vegetation',
        type: 'warning',
        domain: 'Vegetation',
        icon: '🌱',
        title: 'Actual Green Cover Lower Than Approved Recovery Plan',
        desc: `Active vegetative cover (${this.actuals.green_area_m2} m²) has fallen below designated ${targetGreenArea} m² plan. Verify sedum green roof hydration and boundary shrub buffer continuity.`,
        action: 'Diagnose Root Cause & Action Plan'
      });
    }

    if (this.actuals.waste_recycled_tonnes < targetWasteRecycled * 0.80) {
      alerts.push({
        key: 'circularity',
        type: 'caution',
        domain: 'Circular Economy',
        icon: '♻️',
        title: 'Construction Debris Recycling Rate Below CPCB Target',
        desc: `Current aggregate diversion is at ${wasteRatio}%. CPCB 2016 mandates ≥50% diversion of masonry waste for road sub-base preparation.`,
        action: 'Diagnose Root Cause & Action Plan'
      });
    }

    const diag = this.selectedDiagnostic ? this.diagnosticProtocols[this.selectedDiagnostic] : null;

    container.innerHTML = `
      <div class="space-y-8 max-w-7xl mx-auto pb-16 font-sans text-stone-800 animate-fade-in">
        
        <!-- HEADER HERO -->
        <div class="bg-[#0D1912] text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SECTION 34: POST-OCCUPANCY MONITORING & CAS</span>
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-800 text-stone-300 border border-stone-700">
                Predicted vs. Actual Calibration
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                Telemetry Synchronized
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Recovery Implementation & Monitoring Dashboard
            </h1>
            <p class="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed">
              Track actual site performance post-construction, benchmark field outcomes against the statutory recovery model, and execute the <strong>Corrective Action System (CAS)</strong> to ensure permanent ecological compliance.
            </p>
          </div>

          <!-- Dual Gauges: Progress & Accuracy -->
          <div class="flex items-center gap-4 shrink-0">
            <div class="bg-stone-900/90 border border-emerald-600/40 rounded-2xl p-4 text-center min-w-[130px]">
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Recovery Progress</span>
              <div class="text-3xl font-black font-serif text-emerald-300 my-0.5">${recoveryProgress}%</div>
              <span class="text-[10px] text-emerald-400/80 font-semibold block">Of Modeled Goals</span>
            </div>

            <div class="bg-stone-900/90 border border-stone-700 rounded-2xl p-4 text-center min-w-[130px]">
              <span class="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Model Accuracy</span>
              <div class="text-3xl font-black font-serif text-blue-300 my-0.5">${predictionAccuracy}%</div>
              <span class="text-[10px] text-stone-400 font-semibold block">EIA Correlation</span>
            </div>
          </div>
        </div>

        <!-- STATUTORY ALERT FEED (CONDITION-RESPONSIVE NOTIFICATIONS) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between border-b border-stone-200 pb-2">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Autonomous Diagnostics</span>
              <h2 class="text-lg font-black text-stone-900 font-serif mt-1">Real-Time Performance Alerts & Drift Monitoring</h2>
            </div>
            <span class="text-xs font-bold text-stone-500">${alerts.length} Active System Alerts</span>
          </div>

          ${alerts.length === 0 ? `
            <div class="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
              <span class="text-2xl">✅</span>
              <div class="text-sm font-bold text-emerald-900">All Environmental Parameters On Target</div>
              <div class="text-xs text-emerald-700">Field telemetry matches or exceeds all statutory EIA benchmarks within ±5% tolerance.</div>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              ${alerts.map(a => `
                <div class="p-4 rounded-2xl border ${a.type === 'warning' ? 'bg-rose-50/70 border-rose-200 text-rose-950' : a.type === 'caution' ? 'bg-amber-50/70 border-amber-200 text-amber-950' : 'bg-blue-50/70 border-blue-200 text-blue-950'} space-y-2.5">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="text-lg">${a.icon}</span>
                      <strong class="text-xs font-black tracking-tight">${a.title}</strong>
                    </div>
                    <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded ${a.type === 'warning' ? 'bg-rose-200 text-rose-900' : a.type === 'caution' ? 'bg-amber-200 text-amber-900' : 'bg-blue-200 text-blue-900'}">${a.domain}</span>
                  </div>
                  <p class="text-[11px] leading-relaxed text-stone-700">${a.desc}</p>
                  <div class="pt-1.5 flex items-center justify-between text-[11px] border-t border-stone-200/60">
                    <span class="font-bold text-stone-600">Corrective Action System:</span>
                    <button onclick="window.MonitoringView.openDiagnostic('${a.key}')" class="font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1">
                      <span>🔬 Diagnose Root Cause & Plan</span> &rarr;
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- DIAGNOSTIC ROOT-CAUSE MODAL (SECTION 34 CORRECTIVE ACTION SYSTEM) -->
        ${diag ? `
          <div class="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
              <div class="bg-[#0D1912] text-white p-5 flex items-center justify-between border-b border-stone-800">
                <div class="flex items-center gap-2.5">
                  <span class="text-xl">${diag.icon}</span>
                  <div>
                    <span class="text-[10px] uppercase font-bold text-emerald-400 font-mono">Section 34 Corrective Action System (CAS)</span>
                    <h3 class="text-base font-bold font-serif text-white">${diag.title}</h3>
                  </div>
                </div>
                <button onclick="window.MonitoringView.closeDiagnostic()" class="text-stone-400 hover:text-white text-xl font-bold leading-none p-1">&times;</button>
              </div>

              <div class="p-6 space-y-5 overflow-y-auto text-xs text-stone-700">
                <!-- 1. Probable Root Causes -->
                <div class="space-y-2">
                  <span class="font-bold text-stone-900 uppercase text-[10px] tracking-wider block">1. Diagnostic Root-Cause Probability Ranking</span>
                  <div class="space-y-2">
                    ${diag.rootCauses.map(rc => `
                      <div class="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                        <div class="flex items-center justify-between">
                          <strong class="text-stone-900 font-bold">${rc.cause}</strong>
                          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900">${rc.probability}</span>
                        </div>
                        <p class="text-[11px] text-stone-600 leading-relaxed">${rc.detail}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- 2. Technical Inspection Checklist -->
                <div class="space-y-2">
                  <span class="font-bold text-stone-900 uppercase text-[10px] tracking-wider block">2. Engineering Field Inspection Checklist</span>
                  <div class="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1.5">
                    ${diag.checklist.map((item, idx) => `
                      <div class="flex items-start gap-2 text-[11px] text-blue-950">
                        <span class="font-bold text-blue-700 shrink-0">[Step ${idx + 1}]</span>
                        <span>${item}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- 3. Three-Phase Corrective Remediation Protocol -->
                <div class="space-y-2">
                  <span class="font-bold text-stone-900 uppercase text-[10px] tracking-wider block">3. Statutory Remediation Protocol</span>
                  <div class="space-y-2 text-[11px]">
                    <div class="p-3 bg-rose-50/60 rounded-xl border border-rose-200">
                      <strong class="text-rose-900 block font-bold">Immediate 48h SLA:</strong>
                      <span class="text-stone-700">${diag.phases.immediate}</span>
                    </div>
                    <div class="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                      <strong class="text-amber-900 block font-bold">30-Day Engineering Repair:</strong>
                      <span class="text-stone-700">${diag.phases.shortTerm}</span>
                    </div>
                    <div class="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                      <strong class="text-emerald-900 block font-bold">90-Day Verification Audit:</strong>
                      <span class="text-stone-700">${diag.phases.longTerm}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between">
                <button onclick="window.MonitoringView.closeDiagnostic()" class="text-xs font-semibold text-stone-500 hover:text-stone-800">
                  Cancel
                </button>
                <button onclick="window.MonitoringView.issueWorkOrder('${this.selectedDiagnostic}')" class="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5">
                  <span>📋</span> <span>Issue Priority Work Order</span>
                </button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- PREDICTED VS. ACTUAL BENCHMARK COMPARISON MATRIX -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-stone-400">Statutory Indicators</span>
              <h2 class="text-xl font-black text-stone-900 font-serif">Predicted vs. Actual Telemetry Calibration</h2>
            </div>
            <div class="text-xs text-stone-500">
              Interactive calibration: update actual field values below to re-evaluate performance
            </div>
          </div>

          <!-- COMPARISON TABLE -->
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left">
              <thead class="bg-stone-50 text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th class="p-3">Indicator Metric</th>
                  <th class="p-3">Unit</th>
                  <th class="p-3">EIA Predicted Target</th>
                  <th class="p-3">Field Actual Telemetry</th>
                  <th class="p-3">Variance (Δ)</th>
                  <th class="p-3">Statutory Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100 font-medium text-stone-700">
                <!-- 1. Trees -->
                <tr class="hover:bg-stone-50/60 transition">
                  <td class="p-3 font-bold text-stone-900 flex items-center gap-2">
                    <span>🌳</span> <span>Surviving Compensatory Trees</span>
                  </td>
                  <td class="p-3 text-stone-500 font-mono">Trees</td>
                  <td class="p-3 font-mono font-bold text-stone-800">${targetTrees}</td>
                  <td class="p-3">
                    <input type="number" min="0" max="${targetTrees * 1.5}" value="${this.actuals.trees_surviving}" onchange="window.MonitoringView.updateField('trees_surviving', this.value)" class="w-20 px-2 py-1 bg-stone-50 border border-stone-300 rounded-lg font-mono font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  </td>
                  <td class="p-3 font-mono font-bold ${treeSurvivalPct >= 90 ? 'text-emerald-700' : 'text-rose-700'}">
                    ${this.actuals.trees_surviving - targetTrees >= 0 ? '+' : ''}${this.actuals.trees_surviving - targetTrees} (${treeSurvivalPct}%)
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${treeSurvivalPct >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                      ${treeSurvivalPct >= 90 ? 'Compliant (≥90%)' : 'Deficit (<90%)'}
                    </span>
                  </td>
                </tr>

                <!-- 2. Green Area -->
                <tr class="hover:bg-stone-50/60 transition">
                  <td class="p-3 font-bold text-stone-900 flex items-center gap-2">
                    <span>🌱</span> <span>Vegetative Green Area</span>
                  </td>
                  <td class="p-3 text-stone-500 font-mono">m²</td>
                  <td class="p-3 font-mono font-bold text-stone-800">${targetGreenArea.toLocaleString()}</td>
                  <td class="p-3">
                    <input type="number" min="0" value="${this.actuals.green_area_m2}" onchange="window.MonitoringView.updateField('green_area_m2', this.value)" class="w-24 px-2 py-1 bg-stone-50 border border-stone-300 rounded-lg font-mono font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  </td>
                  <td class="p-3 font-mono font-bold ${greenAreaRatio >= 90 ? 'text-emerald-700' : 'text-amber-700'}">
                    ${this.actuals.green_area_m2 - targetGreenArea >= 0 ? '+' : ''}${this.actuals.green_area_m2 - targetGreenArea} (${greenAreaRatio}%)
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${greenAreaRatio >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                      ${greenAreaRatio >= 90 ? 'On Track' : 'Sub-Plan Area'}
                    </span>
                  </td>
                </tr>

                <!-- 3. RWH -->
                <tr class="hover:bg-stone-50/60 transition">
                  <td class="p-3 font-bold text-stone-900 flex items-center gap-2">
                    <span>💧</span> <span>Rainwater Harvested & Metered</span>
                  </td>
                  <td class="p-3 text-stone-500 font-mono">kL/yr</td>
                  <td class="p-3 font-mono font-bold text-stone-800">${targetRwhKl.toLocaleString()}</td>
                  <td class="p-3">
                    <input type="number" min="0" value="${this.actuals.rwh_collected_kl}" onchange="window.MonitoringView.updateField('rwh_collected_kl', this.value)" class="w-24 px-2 py-1 bg-stone-50 border border-stone-300 rounded-lg font-mono font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  </td>
                  <td class="p-3 font-mono font-bold ${rwhRatio >= 85 ? 'text-emerald-700' : 'text-rose-700'}">
                    ${this.actuals.rwh_collected_kl - targetRwhKl >= 0 ? '+' : ''}${this.actuals.rwh_collected_kl - targetRwhKl} (${rwhRatio}%)
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${rwhRatio >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                      ${rwhRatio >= 85 ? 'Normal Inflow' : 'Low Yield Alert'}
                    </span>
                  </td>
                </tr>

                <!-- 4. Solar PV -->
                <tr class="hover:bg-stone-50/60 transition">
                  <td class="p-3 font-bold text-stone-900 flex items-center gap-2">
                    <span>☀️</span> <span>Rooftop Solar Generation</span>
                  </td>
                  <td class="p-3 text-stone-500 font-mono">kWh/yr</td>
                  <td class="p-3 font-mono font-bold text-stone-800">${targetSolarKwh.toLocaleString()}</td>
                  <td class="p-3">
                    <input type="number" min="0" value="${this.actuals.solar_kwh}" onchange="window.MonitoringView.updateField('solar_kwh', this.value)" class="w-28 px-2 py-1 bg-stone-50 border border-stone-300 rounded-lg font-mono font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  </td>
                  <td class="p-3 font-mono font-bold ${solarRatio >= 90 ? 'text-emerald-700' : 'text-amber-700'}">
                    ${this.actuals.solar_kwh - targetSolarKwh >= 0 ? '+' : ''}${(this.actuals.solar_kwh - targetSolarKwh).toLocaleString()} (${solarRatio}%)
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${solarRatio >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                      ${solarRatio >= 90 ? 'Optimal Generation' : 'Soiling Lag'}
                    </span>
                  </td>
                </tr>

                <!-- 5. Construction Waste -->
                <tr class="hover:bg-stone-50/60 transition">
                  <td class="p-3 font-bold text-stone-900 flex items-center gap-2">
                    <span>♻️</span> <span>C&D Waste Circular Diversion</span>
                  </td>
                  <td class="p-3 text-stone-500 font-mono">Tonnes</td>
                  <td class="p-3 font-mono font-bold text-stone-800">${targetWasteRecycled}</td>
                  <td class="p-3">
                    <input type="number" min="0" value="${this.actuals.waste_recycled_tonnes}" onchange="window.MonitoringView.updateField('waste_recycled_tonnes', this.value)" class="w-20 px-2 py-1 bg-stone-50 border border-stone-300 rounded-lg font-mono font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  </td>
                  <td class="p-3 font-mono font-bold ${wasteRatio >= 80 ? 'text-emerald-700' : 'text-rose-700'}">
                    ${this.actuals.waste_recycled_tonnes - targetWasteRecycled >= 0 ? '+' : ''}${this.actuals.waste_recycled_tonnes - targetWasteRecycled} (${wasteRatio}%)
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${wasteRatio >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                      ${wasteRatio >= 80 ? 'CPCB Compliant' : 'Audit Required'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- IMPLEMENTATION LIFECYCLE ROADMAP (PHASES 1 TO 4) -->
        <div class="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200/80 space-y-5">
          <div class="border-b border-stone-200 pb-3">
            <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-900">Execution Framework</span>
            <h2 class="text-xl font-black text-stone-900 font-serif">4-Phase Implementation & Verification Roadmap</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <!-- Phase 1 -->
            <div class="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
              <div class="flex items-center justify-between">
                <span class="w-6 h-6 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center">1</span>
                <span class="text-[10px] font-bold uppercase text-stone-400">Pre-Construction</span>
              </div>
              <h3 class="font-bold text-stone-900 text-sm">Avoidance & Preservation</h3>
              <ul class="space-y-1.5 text-stone-600 text-[11px]">
                <li>• Barricade preserved mature trees with 2m root buffer zone</li>
                <li>• Strip and stockpile ${Math.round(site.built_up_area * 0.20 || 440)} m³ fertile topsoil</li>
                <li>• Install boundary dust netting and erosion silt fences</li>
              </ul>
            </div>

            <!-- Phase 2 -->
            <div class="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
              <div class="flex items-center justify-between">
                <span class="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                <span class="text-[10px] font-bold uppercase text-amber-700">During Civil Works</span>
              </div>
              <h3 class="font-bold text-stone-900 text-sm">Low-Carbon Execution</h3>
              <ul class="space-y-1.5 text-stone-600 text-[11px]">
                <li>• Enforce 35% GGBS/Fly ash cement substitution</li>
                <li>• Segregate ${targetWasteRecycled} tonnes masonry rubble for sub-base</li>
                <li>• Maintain atomized misting cannons during dry earthwork</li>
              </ul>
            </div>

            <!-- Phase 3 -->
            <div class="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
              <div class="flex items-center justify-between">
                <span class="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                <span class="text-[10px] font-bold uppercase text-emerald-700">Commissioning</span>
              </div>
              <h3 class="font-bold text-stone-900 text-sm">Green Infrastructure Install</h3>
              <ul class="space-y-1.5 text-stone-600 text-[11px]">
                <li>• Plant ${targetTrees} compensatory native trees + Miyawaki micro-forest</li>
                <li>• Lay ${iv.permeable_pavement_m2.toLocaleString()} m² IRC:SP:63 permeable interlocking pavers</li>
                <li>• Install ${(iv.rwh_tank_capacity_l / 1000).toFixed(0)} kL dual-chamber cistern & ${Math.round(iv.solar_pv_area_m2 / 5.5)} kWp solar PV</li>
              </ul>
            </div>

            <!-- Phase 4 -->
            <div class="p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-900 space-y-2">
              <div class="flex items-center justify-between">
                <span class="w-6 h-6 rounded-full bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center justify-center">4</span>
                <span class="text-[10px] font-bold uppercase text-emerald-300">Active Phase</span>
              </div>
              <h3 class="font-bold text-white text-sm">Lifecycle Monitoring</h3>
              <ul class="space-y-1.5 text-emerald-100/80 text-[11px]">
                <li>• Bi-annual tree survival audits and health diagnostics</li>
                <li>• Monthly RWH silt chamber de-silting and meter logging</li>
                <li>• Annual GRIHA recertification & solar inverter audits</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  updateField(key, val) {
    this.actuals[key] = parseFloat(val) || 0;
    this.render(window.App.currentProject, window.App.calculations, window.App.environmentalData);
  }
};
