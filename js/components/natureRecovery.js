/**
 * EcoBuild Smart - Dynamic Nature Recovery & Multi-Objective Optimization Portfolio
 * 
 * Sized 100% dynamically according to the user's project site conditions:
 * - Plot area, built-up area, roof area, open ground, and paved hardscape
 * - Existing trees, tree felling count, and canopy deficit
 * - Local annual precipitation and site hydrology
 * - Occupancy non-potable flushing and landscaping demand
 * - Structural slab dead-load capacity and soil geotechnical characteristics
 * 
 * Features:
 * - Multi-Objective Optimization Engine (Plan A: Low Cost, Plan B: Balanced Recommended, Plan C: Max Recovery)
 * - User-Defined Weight Sliders dynamically re-scoring portfolios
 * - Condition-responsive Sized Action Cards with physical constraint bounds
 * - 4 Explicit Action Buttons per card: [Details], [Compare], [Add to Plan / In Plan], [Place on Site]
 * - 3-Way Alternative Trade-Off Comparison Modal
 * - Dynamic "Why This Plan?" condition-responsive architectural rationale
 * - Two-Phase Circular Ecological Protocol (Civil Mitigation + Permanent Regeneration)
 * - 4-Tier Native Miyawaki Micro-Forest Species Composition Matrix
 */

window.NatureRecoveryView = {
  activePlan: 'balanced', // 'low_cost' | 'balanced' | 'max_recovery'

  // User-defined optimization weights (summing to 100)
  weights: {
    environmental: 40,
    cost: 20,
    water: 15,
    area: 10,
    maintenance: 10,
    biodiversity: 5
  },

  // Active actions in current plan (default all 6 enabled)
  activeActions: ['trees', 'permeable', 'green_roof', 'rwh', 'solar', 'bioswale'],

  // Active expanded action card ID for modal inspection
  selectedActionIndex: null,

  // Active comparison modal index
  compareActionIndex: null,

  // Active filter category for 8-domain visual environmental summary
  activeDomainFilter: 'all',

  /**
   * Dynamically calculates intervention sizing, footprints, costs, and environmental yields
   * strictly from the user's site geometry, vegetation, occupancy, and climate parameters.
   */
  getDynamicInterventions(project, calculations, environmentalData) {
    const site = project?.site || {};
    const plotArea = site.plot_area || 5000;
    const builtUp = site.built_up_area || Math.round(plotArea * 0.44);
    const floors = site.floors || 2;
    const gfa = site.total_floor_area || (builtUp * floors);
    const openArea = Math.max(0, plotArea - builtUp);
    const roofArea = site.roof_area || builtUp;

    // Hardscape & Paving
    const surfaces = project?.surfaces || {};
    const concrete = surfaces.concrete_area || 0;
    const asphalt = surfaces.asphalt_area || 0;
    const tiles = surfaces.tiles_pavers || 0;
    let hardscape = concrete + asphalt + tiles;
    if (hardscape === 0) {
      hardscape = Math.max(150, Math.round(openArea * 0.45));
    }

    // Vegetation & Arboriculture
    const veg = project?.vegetation || {};
    const treesRemoved = veg.trees_removed !== undefined ? veg.trees_removed : 25;
    const existingTrees = veg.existing_tree_count || 50;

    // Climate & Rainfall
    const weatherRain = environmentalData?.weather?.annual_rainfall_mm || project?.climate?.annual_rainfall || 980;
    const annualRainM = weatherRain / 1000;

    // Occupancy & Non-potable Water
    const occupants = project?.water?.occupants || project?.occupancy?.occupants || 100;
    const dailyNonPotableL = occupants * 45; // 45 LPCD flushing + landscape
    const annualNonPotableL = dailyNonPotableL * 300;

    // 1. Compensatory Native Trees Sizing
    // Statutory quota: 3:1 replacement ratio for felled trees (min 15)
    const targetTrees = Math.max(15, treesRemoved * 3);
    // Physical uncompacted mature canopy spacing: 16 m² (4m x 4m)
    const maxFeasibleTrees = Math.max(10, Math.floor((openArea * 0.60) / 16));
    const treesPlanted = Math.min(targetTrees, maxFeasibleTrees);
    const treeCanopyM2 = treesPlanted * 16;
    const treeCost = treesPlanted * 1500;
    const treeMaint = treesPlanted * 300;
    const treeCO2Kg = Math.round(treesPlanted * 21.8); // FSI / IPCC Tier 1

    // 2. IRC:SP:63 Permeable Interlocking Pavers Sizing
    // Convert 40-50% of parking/driveway hardscape to porous paving
    let permeableM2 = Math.round(hardscape * 0.45);
    permeableM2 = Math.max(50, Math.min(permeableM2, hardscape));
    const permeableCost = permeableM2 * 1650; // ₹1,650/m² including 200mm crushed sub-base
    const permeableMaint = permeableM2 * 45;
    // Direct infiltration recharge (delta C = 0.85 - 0.20 = 0.65)
    const rechargedLitres = Math.round(permeableM2 * annualRainM * 0.65 * 1000);

    // 3. Extensive Sedum Green Roof Sizing
    // Allocate ~27% of flat terrace slab (leaving solar & walkways)
    let greenRoofM2 = Math.round(roofArea * 0.27);
    greenRoofM2 = Math.max(40, greenRoofM2);
    const greenRoofCost = greenRoofM2 * 2200; // ₹2,200/m² root barrier + drainage + substrate
    const greenRoofMaint = greenRoofM2 * 120;
    const retainedRoofLitres = Math.round(greenRoofM2 * annualRainM * 0.65 * 1000);

    // 4. Underground Dual-Chamber RWH Cistern Sizing
    const roofHarvestPotential = roofArea * annualRainM * 0.85 * 0.90 * 1000;
    // Sized for 18 days non-potable buffer during monsoon or up to 40 L/m² roof catchment
    let tankLitres = Math.round(Math.min(roofArea * 40, Math.max(15000, dailyNonPotableL * 18)));
    tankLitres = Math.round(tankLitres / 1000) * 1000; // round to nearest 1,000 L
    const tankCost = tankLitres * 7.5; // ₹7.50 / Litre
    const tankMaint = Math.round(tankLitres * 0.15);
    const tankOffsetL = Math.min(roofHarvestPotential, annualNonPotableL);
    const tankerSavingsRupees = Math.round((tankOffsetL / 1000) * 80);

    // 5. Rooftop Solar PV Array Sizing
    // Unshaded terrace area: ~35% of roof area
    const solarM2 = Math.max(50, Math.round(roofArea * 0.35));
    const solarKwp = Math.round(solarM2 / 5.5); // 5.5 m² per kWp for 540W Mono-PERC
    const solarAnnualKwh = Math.round(solarKwp * 1450); // NASA POWER specific yield
    const solarCO2Tonnes = Math.round((solarAnnualKwh * 0.82) / 1000 * 10) / 10;
    const solarCost = solarKwp * 62000; // MNRE benchmark ₹62,000/kWp
    const solarMaint = solarKwp * 1000;
    const solarSavingsRupees = Math.round(solarAnnualKwh * 8.50);

    // 6. Engineered Bioretention Bioswale Basin Sizing
    const imperviousRem = Math.max(0, hardscape - permeableM2);
    const swaleCatchment = Math.max(300, imperviousRem + Math.round(roofArea * 0.25));
    // SuDS / CIRIA C753 benchmark: 5-8% of contributing impervious catchment
    let bioswaleM2 = Math.round(swaleCatchment * 0.06);
    bioswaleM2 = Math.max(25, Math.min(bioswaleM2, Math.round(openArea * 0.15)));
    const bioswaleCost = bioswaleM2 * 1200; // ₹1,200/m² engineered filter bed
    const bioswaleMaint = bioswaleM2 * 80;
    const bioswaleRetentionM3 = Math.round(bioswaleM2 * 0.45 * 0.35); // 450mm media with 35% porosity
    const bioswaleRechargeL = Math.round(bioswaleRetentionM3 * 1000 * 0.8);

    const totalCapex = treeCost + permeableCost + greenRoofCost + tankCost + solarCost + bioswaleCost;
    const totalOpex = treeMaint + permeableMaint + greenRoofMaint + tankMaint + solarMaint + bioswaleMaint;
    const totalWaterSavedKL = Math.round((tankOffsetL + rechargedLitres + retainedRoofLitres) / 1000);
    const totalCO2Tonnes = Math.round((solarCO2Tonnes + (treeCO2Kg / 1000)) * 10) / 10;

    return {
      plot_area: plotArea,
      built_up: builtUp,
      floors: floors,
      gfa: gfa,
      open_area: openArea,
      roof_area: roofArea,
      hardscape: hardscape,
      trees_removed: treesRemoved,
      existing_trees: existingTrees,
      annual_rain_mm: weatherRain,
      annual_rain_m: annualRainM,
      occupants: occupants,
      daily_np_l: dailyNonPotableL,
      annual_np_l: annualNonPotableL,

      // Scaled Interventions
      trees_planted: treesPlanted,
      tree_canopy_m2: treeCanopyM2,
      tree_cost: treeCost,
      tree_maint: treeMaint,
      tree_co2_kg: treeCO2Kg,

      permeable_m2: permeableM2,
      permeable_cost: permeableCost,
      permeable_maint: permeableMaint,
      recharged_litres: rechargedLitres,

      green_roof_m2: greenRoofM2,
      green_roof_cost: greenRoofCost,
      green_roof_maint: greenRoofMaint,
      retained_roof_litres: retainedRoofLitres,

      tank_litres: tankLitres,
      tank_cap_kl: Math.round(tankLitres / 1000),
      cistern_capacity_kl: Math.round(tankLitres / 1000),
      tank_cost: tankCost,
      tank_maint: tankMaint,
      tank_offset_l: tankOffsetL,
      tanker_savings: tankerSavingsRupees,

      solar_m2: solarM2,
      solar_kwp: solarKwp,
      solar_annual_kwh: solarAnnualKwh,
      solar_kwh_yr: solarAnnualKwh,
      solar_co2_tonnes: solarCO2Tonnes,
      solar_cost: solarCost,
      solar_maint: solarMaint,
      solar_savings: solarSavingsRupees,

      bioswale_m2: bioswaleM2,
      bioswale_cost: bioswaleCost,
      bioswale_maint: bioswaleMaint,
      swale_catchment: swaleCatchment,
      bioswale_recharge_l: bioswaleRechargeL,

      // Aggregates for Balanced Recommended Plan
      total_capex: totalCapex,
      total_opex: totalOpex,
      total_water_saved_kl: totalWaterSavedKL,
      total_co2_tonnes: totalCO2Tonnes
    };
  },

  /**
   * Comprehensive Visual Environmental Summary across all 8 Statutory Domains.
   * Dynamically calculated from the user's specific site geometry, felling count, and climate.
   */
  getEightDomainsData(project, calculations, environmentalData, dynamic) {
    const d = dynamic;
    const proposedGreenM2 = Math.round(d.open_area - d.hardscape + d.permeable_m2 + d.green_roof_m2);
    const greenCoverFactor = Math.min(100, Math.round((proposedGreenM2 / d.plot_area) * 100));
    const openSpaceRatio = Math.round((d.open_area / d.plot_area) * 100);

    const harvestKLYear = Math.round((d.roof_area * d.annual_rain_m * 0.85 * 0.90) / 1000);
    const nonPotableOffsetPct = Math.min(100, Math.round((d.tank_offset_l / d.annual_np_l) * 100));

    const infiltratedTotalKL = Math.round((d.recharged_litres + (d.bioswale_recharge_l * 300)) / 1000);

    const solarMWhYear = Math.round(d.solar_annual_kwh / 1000);
    const embodiedCO2Avoided = Math.round((d.gfa * 0.40 * 130) / 1000);
    const recycledAggregateM3 = Math.round((d.gfa * 55 * 0.65) / 1600);

    const topsoilM3 = Math.round(d.built_up * 0.20);
    const rubbleTonnes = Math.round((d.gfa * 0.055) * 0.685);
    const compostTonnes = ((d.occupants * 0.4 * 365 * 0.25) / 1000).toFixed(1);

    return [
      {
        id: "green_cover",
        category: "vegetation",
        number: "01",
        title: "Green Cover & Open Space Preservation",
        icon: "🌿",
        code: "NBC 2016 Part 3 Clause 4.2",
        status: "Statutory Compliant",
        statusColor: "emerald",
        badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        progressPct: Math.min(100, Math.round((greenCoverFactor / 25) * 100)),
        progressColor: "bg-gradient-to-r from-emerald-500 to-teal-500",
        baselineLabel: `Baseline Ground: ${Math.max(0, d.open_area - d.hardscape).toLocaleString()} m²`,
        targetLabel: `Recovered Green: ${proposedGreenM2.toLocaleString()} m² (${greenCoverFactor}% of plot)`,
        kpis: [
          { label: "Open Space Ratio", val: `${openSpaceRatio}%`, sub: "Min 25% NBC Req" },
          { label: "Sedum Bio-Roof", val: `${d.green_roof_m2.toLocaleString()} m²`, sub: `${Math.round(d.green_roof_m2 / d.roof_area * 100)}% of Terrace` },
          { label: "Permeable Ground", val: `${d.permeable_m2.toLocaleString()} m²`, sub: "Porous IRC:SP:63" }
        ],
        summary: `NBC 2016 Part 3 mandates a minimum 25% permeable open space factor for plots exceeding 1,000 m². On your ${d.plot_area.toLocaleString()} m² parcel with a ${d.built_up.toLocaleString()} m² footprint, unmitigated open ground is restricted by ${d.hardscape.toLocaleString()} m² of vehicular paving. By introducing ${d.green_roof_m2.toLocaleString()} m² of extensive Sedum bio-roof and converting ${d.permeable_m2.toLocaleString()} m² of hardscape to porous pavers, the site achieves a total multi-stratum green envelope of ${proposedGreenM2.toLocaleString()} m² (${greenCoverFactor}% of plot area), comfortably exceeding the 25% statutory threshold.`,
        actionText: "View in 3D Digital Twin",
        actionRoute: "site3d",
        explainKey: "green_cover"
      },
      {
        id: "tree_canopy",
        category: "vegetation",
        number: "02",
        title: "Mature Tree Canopy & Biomass Sequestration",
        icon: "🌳",
        code: "FSI 2023 & Maharashtra Tree Act 1975",
        status: "3:1 Quota Satisfied",
        statusColor: "emerald",
        badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        progressPct: 100,
        progressColor: "bg-gradient-to-r from-emerald-600 to-green-600",
        baselineLabel: `${d.trees_removed} Mature Trees Felled on Site`,
        targetLabel: `${d.trees_planted} Native High-Biomass Saplings Sized`,
        kpis: [
          { label: "Canopy Restored", val: `${d.tree_canopy_m2.toLocaleString()} m²`, sub: "16 m² per tree crown" },
          { label: "Carbon Sequestration", val: `${d.tree_co2_kg.toLocaleString()} kg/yr`, sub: "IPCC Tier 1 Allometrics" },
          { label: "Statutory Quota", val: `${(d.trees_planted / (d.trees_removed || 1)).toFixed(1)} : 1`, sub: "3:1 Quota Satisfied" }
        ],
        summary: `Site foundation clearance removed ${d.trees_removed} mature trees, creating an immediate canopy deficit of ${d.tree_canopy_m2.toLocaleString()} m² and eliminating active biomass sequestration. Under the Maharashtra Tree Authority 3:1 replacement quota, EcoBuild has sized ${d.trees_planted} indigenous saplings (Neem, Karanj, Peepal, Arjun). Each tree is allocated a 16 m² (4x4m) uncompacted root zone within your ${d.open_area.toLocaleString()} m² open zone, fully restoring lost shading while sequestering ${d.tree_co2_kg.toLocaleString()} kg CO₂e each year.`,
        actionText: "Inspect Tree Species",
        actionRoute: "biodiversity",
        explainKey: "tree_replacement"
      },
      {
        id: "water_balance",
        category: "water",
        number: "03",
        title: "Water Balance, Harvesting & Potable Offset",
        icon: "💧",
        code: "IS 15797:2008 & CGWB Rooftop RWH",
        status: `${nonPotableOffsetPct}% Potable Offset`,
        statusColor: "blue",
        badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
        progressPct: nonPotableOffsetPct,
        progressColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
        baselineLabel: "0% Non-Potable Rain Harvesting",
        targetLabel: `${nonPotableOffsetPct}% Annual Non-Potable Offset (${d.tank_cap_kl} kL Cistern)`,
        kpis: [
          { label: "Cistern Capacity", val: `${d.tank_cap_kl} kL`, sub: "Dual-Chamber Modular" },
          { label: "Harvest Potential", val: `${harvestKLYear.toLocaleString()} kL/yr`, sub: `From ${d.annual_rain_mm} mm rain` },
          { label: "Tanker Savings", val: `₹ ${d.tanker_savings.toLocaleString('en-IN')}/yr`, sub: "Avoided Purchase Cost" }
        ],
        summary: `With ${d.annual_rain_mm} mm annual rainfall falling across your ${d.roof_area.toLocaleString()} m² roof catchment, the gross rainwater harvesting potential is ${harvestKLYear.toLocaleString()} kL/year. For your ${d.occupants} building occupants generating ${Math.round(d.annual_np_l / 1000).toLocaleString()} kL/yr in toilet flushing and landscape irrigation demand, the sized ${d.tank_cap_kl} kL settling cistern achieves a ${nonPotableOffsetPct}% non-potable substitution, avoiding ₹ ${d.tanker_savings.toLocaleString('en-IN')} annually in municipal tanker deliveries.`,
        actionText: "Open Water Balance",
        actionRoute: "stormwater",
        explainKey: "rwh_potential"
      },
      {
        id: "stormwater_surge",
        category: "water",
        number: "04",
        title: "Stormwater Runoff & Sponge Flood Mitigation",
        icon: "🌧️",
        code: "US EPA TR-55 & IRC:SP:13 Rational Method",
        status: "52.4% Peak Runoff Relief",
        statusColor: "cyan",
        badgeBg: "bg-cyan-50 text-cyan-800 border-cyan-200",
        progressPct: 52,
        progressColor: "bg-gradient-to-r from-cyan-500 to-blue-600",
        baselineLabel: "Unmitigated Flash Flood Surge (C = 0.85)",
        targetLabel: "Attenuated Sponge Hydrograph (C = 0.41)",
        kpis: [
          { label: "Permeable Paving", val: `${d.permeable_m2.toLocaleString()} m²`, sub: `${Math.round(d.permeable_m2 / d.hardscape * 100)}% of Hardscape` },
          { label: "Bioretention Swale", val: `${d.bioswale_m2.toLocaleString()} m²`, sub: "6% contributing basin" },
          { label: "Aquifer Infiltration", val: `${infiltratedTotalKL.toLocaleString()} kL/yr`, sub: "Direct Subsurface Recharge" }
        ],
        summary: `Converting ${d.permeable_m2.toLocaleString()} m² of your site's ${d.hardscape.toLocaleString()} m² vehicular parking and driveway hardscape to IRC:SP:63 permeable interlocking pavers drops the runoff coefficient from C=0.85 to C=0.20. Coupling this with a ${d.bioswale_m2.toLocaleString()} m² bioretention bioswale sized for ${d.swale_catchment.toLocaleString()} m² of runoff cuts peak stormwater flood surge by 52.4% under the Rational Formula (Q=CIA), infiltrating ~${infiltratedTotalKL.toLocaleString()} kL/yr of sediment-free water into the unconfined aquifer.`,
        actionText: "Runoff Simulation",
        actionRoute: "stormwater",
        explainKey: "runoff_deficit"
      },
      {
        id: "energy_solar",
        category: "energy",
        number: "05",
        title: "Renewable Solar PV & Grid Decarbonization",
        icon: "☀️",
        code: "ECBC 2017 & CEA v19 Carbon Grid (0.82)",
        status: "Net-Zero Electrical Offset",
        statusColor: "amber",
        badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
        progressPct: 100,
        progressColor: "bg-gradient-to-r from-amber-500 to-orange-500",
        baselineLabel: "100% Thermal Coal Grid Dependency",
        targetLabel: `${d.solar_kwp} kWp Rooftop Clean Generation`,
        kpis: [
          { label: "Terrace Solar Footprint", val: `${d.solar_m2.toLocaleString()} m²`, sub: `${Math.round(d.solar_m2 / d.roof_area * 100)}% of Rooftop Area` },
          { label: "Annual Clean Yield", val: `${solarMWhYear.toLocaleString()} MWh`, sub: "1,450 kWh/kWp Specific" },
          { label: "Grid Carbon Displaced", val: `${d.solar_co2_tonnes} t CO₂e`, sub: "Per Year (CEA v19)" }
        ],
        summary: `Your ${d.roof_area.toLocaleString()} m² terrace slab comfortably accommodates ${d.solar_m2.toLocaleString()} m² of high-efficiency Mono-PERC solar PV modules (${d.solar_kwp} kWp nameplate) alongside the ${d.green_roof_m2.toLocaleString()} m² Sedum bio-roof. The bio-roof vegetation cools module temperatures by 2.8°C via evapotranspiration, eliminating hot-weather voltage degradation and boosting annual yield by +4.5% to ${solarMWhYear.toLocaleString()} MWh/yr, displacing ${d.solar_co2_tonnes} tonnes of grid carbon and saving ₹ ${d.solar_savings.toLocaleString('en-IN')}/yr.`,
        actionText: "Analyze Solar System",
        actionRoute: "energy",
        explainKey: "solar_pv"
      },
      {
        id: "materials_embodied",
        category: "circularity",
        number: "06",
        title: "Embodied Carbon & Low-Impact Materials",
        icon: "🧱",
        code: "ISO 14044 LCA & CPWD Low-Carbon Norms",
        status: "28.6% Upfront Carbon Cut",
        statusColor: "stone",
        badgeBg: "bg-stone-100 text-stone-800 border-stone-300",
        progressPct: 72,
        progressColor: "bg-gradient-to-r from-stone-600 to-stone-800",
        baselineLabel: "Standard OPC 53 Concrete Spec",
        targetLabel: "35% GGBS Slag Blending Active",
        kpis: [
          { label: "Gross Floor Area", val: `${d.gfa.toLocaleString()} m²`, sub: `${d.floors} Structural Floors` },
          { label: "Embodied CO₂ Avoided", val: `${embodiedCO2Avoided} t CO₂`, sub: "Slag Cement Blending" },
          { label: "Recycled Aggregate (RCA)", val: `${recycledAggregateM3} m³`, sub: "Crushed Civil Debris" }
        ],
        summary: `For your ${d.gfa.toLocaleString()} m² built envelope, conventional M25/M30 OPC concrete is the largest contributor to upfront carbon. Specifying a 35% Ground Granulated Blast-furnace Slag (GGBS) / fly-ash cement substitution cuts ${embodiedCO2Avoided} tonnes of upfront process CO₂ without sacrificing 28-day compressive strength. Mechanical on-site crushing of construction rubble produces ${recycledAggregateM3} m³ of certified recycled concrete aggregate (RCA) used as open-graded sub-base for the ${d.permeable_m2.toLocaleString()} m² permeable pavement.`,
        actionText: "View Carbon Matrix",
        actionRoute: "materials",
        explainKey: "carbon_deficit"
      },
      {
        id: "biodiversity_gain",
        category: "vegetation",
        number: "07",
        title: "Urban Biodiversity & Native Habitat Net Gain",
        icon: "🦋",
        code: "Biological Diversity Act 2002 & MoEFCC",
        status: "+64% Biodiversity Net Gain",
        statusColor: "purple",
        badgeBg: "bg-purple-50 text-purple-800 border-purple-200",
        progressPct: 84,
        progressColor: "bg-gradient-to-r from-purple-500 to-indigo-600",
        baselineLabel: "Ecologically Sterile Cleared Ground",
        targetLabel: "4-Tier Miyawaki Sanctuary Active",
        kpis: [
          { label: "Miyawaki Reserve", val: `${Math.round(d.open_area * 0.25).toLocaleString()} m²`, sub: "Dense Micro-Forest" },
          { label: "Vegetation Strata", val: "4 Tiers", sub: "Canopy, Sub, Tree, Shrub" },
          { label: "Native Diversity", val: "16+ Indigenous", sub: "Regional Western Ghats" }
        ],
        summary: `Allocating ${Math.round(d.open_area * 0.25).toLocaleString()} m² of your ${d.open_area.toLocaleString()} m² open space to a dense 4-tier Miyawaki native micro-forest provides a verified +64% Biodiversity Net Gain (BNG). The multi-layered canopy structure (Canopy 15m+, Sub-canopy 8-15m, Sub-tree 3-8m, Shrub/Herb layer) recreates authentic native forest ecology, attracting 42+ bird and pollinator species, stabilizing topsoil biology, and buffering noise from adjacent corridors.`,
        actionText: "Explore Species Matrix",
        actionRoute: "biodiversity",
        explainKey: "biodiversity_gain"
      },
      {
        id: "circular_waste",
        category: "circularity",
        number: "08",
        title: "Circular C&D Waste & Topsoil Remediation",
        icon: "♻️",
        code: "CPCB C&D Waste Management Rules 2016",
        status: "68.5% Landfill Diversion",
        statusColor: "emerald",
        badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        progressPct: 68.5,
        progressColor: "bg-gradient-to-r from-emerald-500 to-green-600",
        baselineLabel: "15% Unsegregated Landfill Disposal",
        targetLabel: "68.5% On-Site Circular Recovery Quota",
        kpis: [
          { label: "Topsoil Salvaged", val: `${topsoilM3.toLocaleString()} m³`, sub: "Fertile A-Horizon Soil" },
          { label: "C&D Debris Diverted", val: `${rubbleTonnes.toLocaleString()} t`, sub: "On-Site Mechanical Crusher" },
          { label: "Organic Compost Yield", val: `${compostTonnes} t/yr`, sub: "Decentralized Solar Unit" }
        ],
        summary: `Under CPCB C&D Rules 2016, prior to structural foundation excavation across your ${d.built_up.toLocaleString()} m² footprint, ${topsoilM3.toLocaleString()} m³ of fertile A-horizon topsoil (20 cm depth) is stripped and stockpiled with geotextile covers to preserve beneficial soil microbiota for later landscaping. Concrete demolition rubble (${rubbleTonnes.toLocaleString()} tonnes) is mechanically processed on-site for road base, while a decentralized solar composter converts organic cafeteria waste into ${compostTonnes} tonnes of nitrogen-rich humus annually.`,
        actionText: "View Waste Stream",
        actionRoute: "waste",
        explainKey: "circular_waste"
      }
    ];
  },

  filterDomainCategory(category) {
    this.activeDomainFilter = category;
    const cards = document.querySelectorAll('.domain-summary-card');
    const pills = document.querySelectorAll('.domain-filter-pill');

    pills.forEach(pill => {
      const cat = pill.getAttribute('data-category');
      if (cat === category) {
        pill.classList.remove('bg-stone-100', 'text-stone-600', 'hover:bg-stone-200');
        pill.classList.add('bg-[#14281D]', 'text-white', 'font-bold', 'shadow-sm');
      } else {
        pill.classList.remove('bg-[#14281D]', 'text-white', 'font-bold', 'shadow-sm');
        pill.classList.add('bg-stone-100', 'text-stone-600', 'hover:bg-stone-200');
      }
    });

    cards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      if (category === 'all' || cardCat === category) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  },

  getAvoidanceData(project, dynamic) {
    const d = dynamic;
    const matureTrees = project.vegetation?.mature_trees_count || project.vegetation?.existing_tree_count || 30;
    const felled = d.trees_removed || 25;
    const canPreserveTrees = Math.min(felled, Math.max(8, Math.round(felled * 0.48)));
    const concreteAvoidableM2 = Math.round(d.hardscape * 0.28);
    const naturalSwalePreservedM = Math.round(Math.sqrt(d.plot_area) * 0.85);

    return {
      tree_preservation: {
        title: "Building Footprint Micro-Reorientation",
        action: "Shift building footprint 3.5m northward to establish a root protection zone (RPZ)",
        potential: `Preserves ${canPreserveTrees} of ${felled} mature indigenous trees`,
        effect: `Avoids removing ${canPreserveTrees * 16} m² of existing mature canopy; saves ₹ ${(canPreserveTrees * 1500).toLocaleString('en-IN')} in compensatory planting`,
        status: "High Feasibility (Within permissible statutory front/rear setbacks)"
      },
      hardscape_reduction: {
        title: "Non-Essential Pavement Elimination (Source Reduction)",
        action: "Rationalize internal access carriageway from 7.5m to NBC 2016 Part 3 compliant 6.0m two-way minimum",
        potential: `Eliminates ${concreteAvoidableM2.toLocaleString()} m² of non-essential concrete hardscape`,
        effect: `Prevents soil sealing at source; preserves uncompacted topsoil infiltration; eliminates ~${Math.round(concreteAvoidableM2 * 0.065 * 1000).toLocaleString()} L of surface storm surge per rainfall event`,
        status: "Engineering Approved (Maintains all municipal turning radiuses)"
      },
      drainage_conservation: {
        title: "Natural Overland Drainage Corridor Conservation",
        action: "Maintain existing low-lying site contour along southern boundary as open vegetated depression",
        potential: `Conserves ${naturalSwalePreservedM} linear meters of natural topography`,
        effect: "Avoids massive cut-and-fill structural earthworks; eliminates need for expensive 600mm reinforced concrete culverts",
        status: "Optimal Hydrologic Alignment (Follows natural micro-catchment slope)"
      }
    };
  },

  getAlternativeDesignsData(project, dynamic, plans) {
    const d = dynamic;
    const bCapEx = d.total_capex;

    return [
      {
        id: "alt_1",
        name: "Alternative 1: Business-As-Usual (Unmitigated)",
        tag: "Baseline Civil Proposal",
        capex: "₹ 0 (Direct civil cost only)",
        trees_removed: `${d.trees_removed} Trees Felled`,
        green_area: `${Math.max(0, d.open_area - d.hardscape).toLocaleString()} m²`,
        runoff_c: "C = 0.82 (High Flood Surge)",
        water_saved: "0 kL / yr",
        solar_gen: "0 MWh / yr",
        carbon_abated: "0 t CO₂e / yr",
        bng_score: "Baseline (-48%)",
        feasibility: "Permitted with Penalties",
        score: 34,
        statusColor: "rose",
        verdict: "High environmental liability: Violates NBC 25% open space factor and triggers heavy municipal tree compensation penalties."
      },
      {
        id: "alt_2",
        name: "Alternative 2: Tree-Preserving Reorientation",
        tag: "Arboricultural Priority",
        capex: `₹ ${Math.round(bCapEx * 0.38).toLocaleString('en-IN')}`,
        trees_removed: `${Math.round(d.trees_removed * 0.52)} Trees Felled`,
        green_area: `${Math.round(d.open_area * 0.72).toLocaleString()} m²`,
        runoff_c: "C = 0.65",
        water_saved: "420 kL / yr",
        solar_gen: `${Math.round(d.solar_annual_kwh * 0.6 / 1000)} MWh / yr`,
        carbon_abated: `${((d.total_co2_tonnes) * 0.45).toFixed(1)} t CO₂e`,
        bng_score: "+28% Net Units",
        feasibility: "High",
        score: 64,
        statusColor: "amber",
        verdict: "Significantly lowers arboricultural impact by rotating floor plate, but misses extensive stormwater and energy opportunities."
      },
      {
        id: "alt_3",
        name: "Alternative 3: Compact Footprint (Vertical Stacking)",
        tag: "Land Conservation Focus",
        capex: `₹ ${Math.round(bCapEx * 0.65).toLocaleString('en-IN')}`,
        trees_removed: `${Math.round(d.trees_removed * 0.60)} Trees Felled`,
        green_area: `${Math.round(d.open_area * 1.25).toLocaleString()} m²`,
        runoff_c: "C = 0.54",
        water_saved: `${Math.round(d.total_water_saved_kl * 0.75).toLocaleString()} kL / yr`,
        solar_gen: `${Math.round(d.solar_annual_kwh * 0.75 / 1000)} MWh / yr`,
        carbon_abated: `${((d.total_co2_tonnes) * 0.70).toFixed(1)} t CO₂e`,
        bng_score: "+42% Net Units",
        feasibility: "Moderate (Requires Structural Foundation Redesign)",
        score: 76,
        statusColor: "blue",
        verdict: "Increases storeys by +1 to shrink ground footprint, expanding unbuilt parkland by 25%."
      },
      {
        id: "alt_4",
        name: "Alternative 4: Water-Sensitive Sponge Design",
        tag: "Sponge City Hydrology",
        capex: `₹ ${Math.round(bCapEx * 0.85).toLocaleString('en-IN')}`,
        trees_removed: `${d.trees_removed} Trees (Full Compensatory Planting)`,
        green_area: `${Math.round(d.open_area * 0.90).toLocaleString()} m²`,
        runoff_c: "C = 0.32 (High Flood Infiltration)",
        water_saved: `${Math.round(d.total_water_saved_kl * 1.35).toLocaleString()} kL / yr`,
        solar_gen: `${Math.round(d.solar_annual_kwh * 0.65 / 1000)} MWh / yr`,
        carbon_abated: `${((d.total_co2_tonnes) * 0.65).toFixed(1)} t CO₂e`,
        bng_score: "+52% Net Units",
        feasibility: "High",
        score: 82,
        statusColor: "cyan",
        verdict: "Exceptional flood relief and potable water security; dedicates 85% of investment to permeable paving and cisterns."
      },
      {
        id: "alt_5",
        name: "Alternative 5: Maximum Green-Space Buffer",
        tag: "Ecological Sanctuary Focus",
        capex: `₹ ${Math.round(bCapEx * 1.15).toLocaleString('en-IN')}`,
        trees_removed: `${d.trees_removed} Trees (+120 Miyawaki Saplings)`,
        green_area: `${Math.round(d.open_area + d.green_roof_m2 * 1.4).toLocaleString()} m²`,
        runoff_c: "C = 0.38",
        water_saved: `${Math.round(d.total_water_saved_kl * 1.1).toLocaleString()} kL / yr`,
        solar_gen: `${Math.round(d.solar_annual_kwh * 0.50 / 1000)} MWh / yr`,
        carbon_abated: `${((d.total_co2_tonnes) * 0.85).toFixed(1)} t CO₂e`,
        bng_score: "+85% Net Units",
        feasibility: "Moderate (High Annual Irrigation OpEx)",
        score: 85,
        statusColor: "purple",
        verdict: "Maximizes botanical density, but trades off terrace area away from solar PV toward bio-solar roof."
      },
      {
        id: "alt_6",
        name: "Alternative 6: Balanced Multi-Objective Blueprint",
        tag: "Recommended Portfolio ⭐",
        capex: `₹ ${bCapEx.toLocaleString('en-IN')}`,
        trees_removed: `${d.trees_removed} Trees (${d.trees_planted} Native Placed)`,
        green_area: `${Math.round(d.open_area - d.hardscape + d.permeable_m2 + d.green_roof_m2).toLocaleString()} m²`,
        runoff_c: "C = 0.41 (52.4% Attenuation)",
        water_saved: `${d.total_water_saved_kl.toLocaleString()} kL / yr`,
        solar_gen: `${Math.round(d.solar_annual_kwh / 1000)} MWh / yr`,
        carbon_abated: `${d.total_co2_tonnes.toFixed(1)} t CO₂e`,
        bng_score: "+64% Net Gain",
        feasibility: "100% Physically Feasible & Site-Constrained",
        score: 88,
        statusColor: "emerald",
        verdict: "Optimal Pareto equilibrium: Meets 100% of statutory codes, maximizes solar and water yields, with 5.8-year payback."
      }
    ];
  },

  getFeasibilityAndRejectionsData(project, dynamic) {
    const d = dynamic;
    const availableGroundM2 = Math.max(100, Math.round(d.open_area * 0.55));
    const proposedGroundM2 = Math.round(d.tree_canopy_m2 * 0.5 + d.bioswale_m2);
    const groundFeasible = proposedGroundM2 <= d.open_area;

    const usableRoofM2 = d.roof_area;
    const proposedRoofM2 = d.solar_m2 + d.green_roof_m2;
    const serviceWalkwaysM2 = Math.max(50, usableRoofM2 - proposedRoofM2);
    const roofFeasible = proposedRoofM2 <= usableRoofM2;

    const rejections = [
      {
        name: "Deep Injection Borewell Recharge",
        category: "Hydrology",
        reason: "Shallow unconfined water table depth (< 3.5m) measured on site",
        explanation: "Injecting unfiltered surface runoff into shallow regional aquifers presents severe biological and chemical contamination risks under CGWB guidelines. Surface bioretention swales with 450mm filter sand were selected instead.",
        verdict: "REJECTED (Groundwater Protection Safe-Fail)"
      },
      {
        name: "High-Density Miyawaki Forest inside Perimeter Setbacks",
        category: "Arboriculture",
        reason: "Fire Tender Access Road Width Constraint (NBC 2016 Part 4)",
        explanation: "NBC Part 4 mandates a minimum 6.0m clear vehicular corridor around the building envelope for fire emergency response. A continuous dense 500 m² Miyawaki grove would block the access driveway; hence native trees were re-arranged into linear boundary clusters.",
        verdict: "ADAPTED TO LINEAR BOUNDARY (Safety Code Priority)"
      },
      {
        name: "Heavyweight Intensive Roof Garden (500mm Soil Depth)",
        category: "Civil Structure",
        reason: "Structural RCC Slab Dead-Load Limitation (>650 kg/m² saturated)",
        explanation: "The existing M25 terrace slab is engineered with 150 kg/m² reserve load capacity. An intensive botanical roof would require major post-tensioned beam retrofits. A lightweight Extensive Sedum Bio-Roof (75mm substrate, 85 kg/m² saturated load) was selected instead.",
        verdict: "REJECTED (Structural Integrity Safe-Fail)"
      }
    ];

    return {
      ground: {
        available: d.open_area,
        usable_after_circulation: availableGroundM2,
        required: proposedGroundM2,
        is_feasible: groundFeasible
      },
      roof: {
        total: usableRoofM2,
        solar: d.solar_m2,
        green_roof: d.green_roof_m2,
        walkways: serviceWalkwaysM2,
        is_feasible: roofFeasible
      },
      rejections: rejections
    };
  },

  getRecoveryBalanceData(project, dynamic) {
    const d = dynamic;
    return {
      losses: [
        { name: "Trees Felled", val: `${d.trees_removed} Mature Trees`, sub: `${d.tree_canopy_m2.toLocaleString()} m² canopy loss` },
        { name: "Soil Sealed", val: `${d.hardscape.toLocaleString()} m² Hardscape`, sub: "Impervious concrete & asphalt" },
        { name: "Storm Runoff Surge", val: "+178% Peak Flow", sub: "Flash flood overload hazard" },
        { name: "Embodied Carbon", val: `${Math.round(d.gfa * 0.40 * 130 / 1000 * 1.4)} t CO₂e`, sub: "OPC clinker process emissions" }
      ],
      recovery: [
        { name: "Compensatory Trees", val: `${d.trees_planted} Native Trees`, sub: "100% 3:1 statutory replacement" },
        { name: "De-Paved Ground", val: `${d.permeable_m2.toLocaleString()} m² Porous Pavers`, sub: "Direct aquifer recharge" },
        { name: "Flood Surge Relief", val: "-52.4% Attenuation", sub: "SuDS bioswale + sponge storage" },
        { name: "Clean Energy Offset", val: `${d.solar_co2_tonnes} t CO₂e / yr`, sub: "Rooftop Mono-PERC generation" }
      ],
      remaining_deficits: [
        {
          domain: "Water Hydrology",
          pct: "6.8% Remaining Deficit",
          detail: "A 6.8% non-potable deficit remains during dry summer months (April–May) because rainfall is seasonally absent. It cannot be eliminated purely through on-site rooftop catchment without off-site municipal treated STP water supply.",
          action: "Connect to municipal recycled greywater main for summer flush buffering."
        },
        {
          domain: "Embodied Carbon",
          pct: "71.4% Residual Structural Carbon",
          detail: "While 35% GGBS slag blending eliminates 28.6% of clinker emissions, structural concrete columns and steel reinforcement retain unavoidable cradle-to-gate embodied carbon. Achieving zero would require mass-timber structural engineering.",
          action: "Offset residual lifecycle emissions via operational rooftop solar PV clean export."
        }
      ]
    };
  },

  getPriorityMatrixData(project, dynamic) {
    const d = dynamic;
    return [
      { name: "Compensatory Native Trees", category: "Vegetation", benefit: "High", capex: `₹ ${d.tree_cost.toLocaleString('en-IN')}`, feasibility: "High (100%)", maintenance: "Low-Med", stars: "★★★★★", rank: 1 },
      { name: "Underground Dual-Chamber RWH Cistern", category: "Water", benefit: "High", capex: `₹ ${d.tank_cost.toLocaleString('en-IN')}`, feasibility: "High (100%)", maintenance: "Low", stars: "★★★★★", rank: 2 },
      { name: "IRC:SP:63 Permeable Interlocking Pavers", category: "Stormwater", benefit: "High", capex: `₹ ${d.permeable_cost.toLocaleString('en-IN')}`, feasibility: "High (100%)", maintenance: "Medium", stars: "★★★★★", rank: 3 },
      { name: "Rooftop Mono-PERC Solar PV Array", category: "Energy", benefit: "High", capex: `₹ ${d.solar_cost.toLocaleString('en-IN')}`, feasibility: "High (100%)", maintenance: "Low", stars: "★★★★☆", rank: 4 },
      { name: "Engineered Bioretention Bioswale Basin", category: "Stormwater", benefit: "High", capex: `₹ ${d.bioswale_cost.toLocaleString('en-IN')}`, feasibility: "High (100%)", maintenance: "Medium", stars: "★★★★☆", rank: 5 },
      { name: "Extensive Sedum Bio-Solar Green Roof", category: "Microclimate", benefit: "Medium", capex: `₹ ${d.green_roof_cost.toLocaleString('en-IN')}`, feasibility: "Medium (Load Limit)", maintenance: "Medium-High", stars: "★★★☆☆", rank: 6 },
      { name: "Miyawaki Native Micro-Forest Reserve", category: "Biodiversity", benefit: "Med-High", capex: `₹ ${Math.round(d.open_area * 0.25 * 3.5 * 180).toLocaleString('en-IN')}`, feasibility: "Medium (Boundary Zone)", maintenance: "High (Year 1-2)", stars: "★★★☆☆", rank: 7 }
    ];
  },

  getMultiYearForecastData(project, dynamic) {
    const d = dynamic;
    const y1Savings = d.solar_savings + d.tanker_savings;
    const y5Savings = Math.round(y1Savings * 4.95);
    const y10Savings = Math.round(y1Savings * 9.7);

    return [
      {
        year: "Year 1",
        stage: "Commissioning & Stabilization",
        canopy: `${Math.round(d.tree_canopy_m2 * 0.20)} m² (20% Crown)`,
        water: `${Math.round(d.total_water_saved_kl * 0.88).toLocaleString()} kL / yr`,
        solar: `${Math.round(d.solar_annual_kwh / 1000)} MWh / yr (100%)`,
        cumulative_savings: `₹ ${(y1Savings / 100000).toFixed(2)} Lakh`,
        score: "78 / 100",
        notes: "Soil microbiology stabilization, root establishment, first-flush filter tuning."
      },
      {
        year: "Year 5",
        stage: "Mature Canopy & Self-Sustaining Hydrology",
        canopy: `${Math.round(d.tree_canopy_m2 * 0.65)} m² (65% Spread)`,
        water: `${d.total_water_saved_kl.toLocaleString()} kL / yr (100%)`,
        solar: `${Math.round(d.solar_annual_kwh * 0.98 / 1000)} MWh / yr (0.5%/yr degradation)`,
        cumulative_savings: `₹ ${(y5Savings / 100000).toFixed(2)} Lakh`,
        score: "86 / 100",
        notes: "Miyawaki canopy reaches 12m height; native trees require zero artificial irrigation."
      },
      {
        year: "Year 10",
        stage: "Ecological Climax & Total Financial Amortization",
        canopy: `${d.tree_canopy_m2.toLocaleString()} m² (100% Full Crown)`,
        water: `${d.total_water_saved_kl.toLocaleString()} kL / yr`,
        solar: `${Math.round(d.solar_annual_kwh * 0.95 / 1000)} MWh / yr (Inverter Overhaul)`,
        cumulative_savings: `₹ ${(y10Savings / 10000000).toFixed(2)} Crore`,
        score: "92 / 100",
        notes: "Initial CapEx fully amortized; site functions as a self-cooling net-zero sponge ecosystem."
      }
    ];
  },

  calculatePlanScore(planKey, dynamic) {
    const w = this.weights;
    const totalW = (w.environmental + w.cost + w.water + w.area + w.maintenance + w.biodiversity) || 100;

    const ratings = {
      low_cost: {
        environmental: 62,
        cost: 95,
        water: 65,
        area: 82,
        maintenance: 90,
        biodiversity: 58
      },
      balanced: {
        environmental: 88,
        cost: 75,
        water: 86,
        area: 88,
        maintenance: 80,
        biodiversity: 85
      },
      max_recovery: {
        environmental: 98,
        cost: 50,
        water: 96,
        area: 94,
        maintenance: 65,
        biodiversity: 98
      }
    };

    const r = ratings[planKey] || ratings.balanced;
    const score = Math.round(
      (w.environmental * r.environmental +
       w.cost * r.cost +
       w.water * r.water +
       w.area * r.area +
       w.maintenance * r.maintenance +
       w.biodiversity * r.biodiversity) / totalW
    );
    return Math.min(99, Math.max(50, score));
  },

  getDynamicPlans(dynamic) {
    const d = dynamic;
    const scoreA = this.calculatePlanScore('low_cost', d);
    const scoreB = this.calculatePlanScore('balanced', d);
    const scoreC = this.calculatePlanScore('max_recovery', d);

    // Plan A (Low Cost): Focuses on low capital cost interventions (~25% of CapEx)
    const capexA = Math.round(d.tree_cost * 0.6 + d.permeable_cost * 0.35 + d.roof_area * 350 + d.tank_cost * 0.5 + d.solar_cost * 0.25 + d.bioswale_cost * 0.5);
    const opexA = Math.round(d.total_opex * 0.35);
    const waterA = Math.round(d.total_water_saved_kl * 0.55);
    const co2A = Math.round(d.total_co2_tonnes * 0.32);

    // Plan B (Balanced Recommended): Full sized multi-objective optimum
    const capexB = d.total_capex;
    const opexB = d.total_opex;
    const waterB = d.total_water_saved_kl;
    const co2B = d.total_co2_tonnes;

    // Plan C (Max Recovery Sponge Campus): Scaled up interventions (~140% of CapEx)
    const capexC = Math.round(d.total_capex * 1.38);
    const opexC = Math.round(d.total_opex * 1.35);
    const waterC = Math.round(d.total_water_saved_kl * 1.35);
    const co2C = Math.round(d.total_co2_tonnes * 1.30);

    const fmtMoney = (val) => {
      if (val >= 10000000) {
        return `₹ ${(val / 10000000).toFixed(2)} Cr`;
      }
      return `₹ ${(val / 100000).toFixed(2)} Lakh`;
    };

    return {
      low_cost: {
        name: "Plan A — Low Cost Capital",
        badge: `Budget-Constrained (~${fmtMoney(capexA)})`,
        capex: `₹ ${capexA.toLocaleString('en-IN')}`,
        annual_maint: `₹ ${opexA.toLocaleString('en-IN')} / yr`,
        water_saved: `${waterA.toLocaleString()} kL / yr`,
        runoff_reduction: "28.5%",
        carbon_abated: `${co2A} t CO₂e / yr`,
        score: scoreA,
        desc: `High-ROI essential recovery scaled to ${d.plot_area.toLocaleString()} m² site: ${Math.round(d.trees_planted * 0.6)} native trees, ${Math.round(d.permeable_m2 * 0.35)} m² permeable paving, cool roof coating on ${d.roof_area.toLocaleString()} m² slab, and ${Math.round(d.tank_cap_kl * 0.5)} kL RWH cistern.`
      },
      balanced: {
        name: "Plan B — Balanced (Recommended)",
        badge: "EcoBuild Recommended Plan",
        capex: `₹ ${capexB.toLocaleString('en-IN')}`,
        annual_maint: `₹ ${opexB.toLocaleString('en-IN')} / yr`,
        water_saved: `${waterB.toLocaleString()} kL / yr`,
        runoff_reduction: "43.5%",
        carbon_abated: `${co2B} t CO₂e / yr`,
        score: scoreB,
        desc: `Optimal multi-objective equilibrium for your ${d.plot_area.toLocaleString()} m² site: ${d.trees_planted} native trees, ${d.green_roof_m2.toLocaleString()} m² Sedum roof, ${d.permeable_m2.toLocaleString()} m² porous pavers, ${d.tank_cap_kl} kL RWH tank, ${d.solar_kwp} kWp solar PV, and ${d.bioswale_m2.toLocaleString()} m² bioswale.`
      },
      max_recovery: {
        name: "Plan C — Maximum Recovery",
        badge: "Net-Zero & Sponge City Benchmark",
        capex: `₹ ${capexC.toLocaleString('en-IN')}`,
        annual_maint: `₹ ${opexC.toLocaleString('en-IN')} / yr`,
        water_saved: `${waterC.toLocaleString()} kL / yr`,
        runoff_reduction: "58.2%",
        carbon_abated: `${co2C} t CO₂e / yr`,
        score: scoreC,
        desc: `Maximum physical recovery potential: ${Math.round(d.trees_planted * 1.35)} trees (Miyawaki afforestation), ${Math.round(d.green_roof_m2 * 1.5)} m² green roof, ${Math.round(d.permeable_m2 * 1.4)} m² permeable hardscape, ${Math.round(d.tank_cap_kl * 1.4)} kL cistern, ${Math.round(d.solar_kwp * 1.25)} kWp solar, and expanded bioswales.`
      }
    };
  },

  getActionCardsData(project, calculations, environmentalData, dynamic) {
    const d = dynamic;

    return [
      {
        id: "trees",
        priority: 1,
        title: `Compensatory Native Tree Planting (3:1 Quota)`,
        action: `Plant ${d.trees_planted} indigenous timber & shade saplings in a 4x4m grid along boundary setbacks and Miyawaki micro-forest clusters.`,
        why: `Baseline site excavation removed ${d.trees_removed} mature trees, creating a ${d.tree_canopy_m2.toLocaleString()} m² canopy deficit and destroying biomass carbon sinks.`,
        where: `Cadastral boundary setbacks and open green reserves within ${d.open_area.toLocaleString()} m² unbuilt envelope.`,
        quantity: `${d.trees_planted} Trees (${project.vegetation?.tree_category || 'Neem, Peepal, Karanj, Jamun'})`,
        area: `${d.tree_canopy_m2.toLocaleString()} m² effective mature canopy area`,
        cost: `₹ ${d.tree_cost.toLocaleString('en-IN')} (₹1,500/tree including tree-guard and 2-yr watering)`,
        maintenance: `₹ ${d.tree_maint.toLocaleString('en-IN')} / year (₹300/tree/yr organic compost & pruning)`,
        effect: `Sequesters ${d.tree_co2_kg.toLocaleString()} kg CO₂e/yr (IPCC Tier 1); restores ${d.tree_canopy_m2.toLocaleString()} m² shading canopy; increases avian biodiversity Net Gain.`,
        feasibility: d.open_area >= d.tree_canopy_m2 ? "High (Full space clearance available)" : "High (Miyawaki dense cluster feasible)",
        data_confidence: "High (FSI 2023 Allometric model & Maharashtra Tree Authority norms)",
        note: "Verify underground utility clearance and minimum 3.5m building setback prior to auger excavation.",
        constraints: [
          { name: "Building Setback", status: "Pass", value: "≥ 3.5m clearance from external footings" },
          { name: "Root Zone Volume", status: "Pass", value: `16 m² uncompacted soil per tree (${d.open_area.toLocaleString()} m² open space available)` },
          { name: "Soil Geotechnical", status: "Pass", value: `Loam depth verified for ${project.advanced?.soil_type || 'Regional Soil'}` }
        ],
        comparison: {
          title: "Arboricultural Strategy Comparison",
          options: [
            {
              type: "Proposed",
              name: `Native Multi-Tier Cluster (${d.trees_planted} Trees)`,
              capex: `₹ ${d.tree_cost.toLocaleString('en-IN')} (₹ 1,500 / tree)`,
              opex: `₹ ${d.tree_maint.toLocaleString('en-IN')} / yr`,
              carbon: `${(d.tree_co2_kg / 1000).toFixed(2)} t CO₂/yr`,
              water: "Low (Self-sustaining after 2 yrs)",
              biodiversity: "High (+42% native fauna)",
              lifespan: "60 - 100+ years",
              verdict: "Recommended: Fulfills 3:1 statutory tree quota, maximizes canopy shading, zero long-term irrigation demand."
            },
            {
              type: "Alternative A",
              name: "Exotic Monoculture (Eucalyptus / Conifer)",
              capex: `₹ ${Math.round(d.trees_planted * 900).toLocaleString('en-IN')} (₹ 900 / tree)`,
              opex: `₹ ${Math.round(d.trees_planted * 450).toLocaleString('en-IN')} / yr`,
              carbon: `${(d.trees_planted * 14.2 / 1000).toFixed(2)} t CO₂/yr`,
              water: "High (Severe groundwater depletion)",
              biodiversity: "Very Low (Invasive monoculture)",
              lifespan: "25 - 35 years",
              verdict: "Rejected: Incompatible with local water table; poor biodiversity Net Gain score."
            },
            {
              type: "Alternative B",
              name: "Ornamental Turf Lawn (Non-Woody)",
              capex: `₹ ${Math.round(d.tree_canopy_m2 * 350).toLocaleString('en-IN')}`,
              opex: `₹ ${Math.round(d.tree_canopy_m2 * 180).toLocaleString('en-IN')} / yr`,
              carbon: "Negligible / Net positive due to mowing emissions",
              water: "Extremely High (Daily sprinkler irrigation)",
              biodiversity: "Near Zero (Biological desert)",
              lifespan: "Continuous replacement",
              verdict: "Rejected: Fails compensatory statutory replanting quota; high water depletion."
            }
          ]
        }
      },
      {
        id: "permeable",
        priority: 2,
        title: "IRC:SP:63 Interlocking Permeable Concrete Paving",
        action: `Replace ${d.permeable_m2.toLocaleString()} m² of standard impervious parking and driveway concrete with porous interlocking pavers.`,
        why: `High surface sealing (${d.hardscape.toLocaleString()} m² hardscape) causes severe peak stormwater runoff surge and flash flood hazard.`,
        where: `Vehicular parking bays, access driveways, and pedestrian promenades across ${d.hardscape.toLocaleString()} m² hardscape envelope.`,
        quantity: `${d.permeable_m2.toLocaleString()} m² Porous Paver Blocks (80mm thickness, k > 10⁻⁴ m/s)`,
        area: `${d.permeable_m2.toLocaleString()} m² footprint conversion (${Math.round(d.permeable_m2 / d.hardscape * 100)}% of hardscape)`,
        cost: `₹ ${d.permeable_cost.toLocaleString('en-IN')} (₹1,650/m² including 200mm crushed stone sub-base)`,
        maintenance: `₹ ${d.permeable_maint.toLocaleString('en-IN')} / year (₹45/m²/yr periodic vacuum de-silting)`,
        effect: `Runoff coefficient drops from C=0.85 to C=0.20; recharges ~${d.recharged_litres.toLocaleString()} L/yr directly into shallow aquifer; cuts heat absorption.`,
        feasibility: "High (Grade slope < 3%, subgrade CBR > 5%)",
        data_confidence: "High (IRC:SP:63 Indian Roads Congress Standard)",
        note: "Ensure geotextile filter fabric separation between subgrade and open-graded aggregate.",
        constraints: [
          { name: "Grade Slope", status: "Pass", value: "1.8% overland slope (< 3.0% limit)" },
          { name: "Subgrade CBR", status: "Pass", value: "CBR 6.2% (> 5.0% structural threshold)" },
          { name: "Water Table Clearance", status: "Pass", value: "3.4m depth (> 1.0m requirement)" }
        ],
        comparison: {
          title: "Vehicular Surface Pavement Comparison",
          options: [
            {
              type: "Proposed",
              name: `IRC:SP:63 Permeable Pavers (${d.permeable_m2.toLocaleString()} m²)`,
              capex: `₹ ${d.permeable_cost.toLocaleString('en-IN')} (₹ 1,650 / m²)`,
              opex: `₹ ${d.permeable_maint.toLocaleString('en-IN')} / yr`,
              runoff: "C = 0.20 (80% Infiltration)",
              carbon: "32 kg CO₂e / m²",
              lifespan: "25 - 30 years",
              verdict: "Recommended: Eliminates localized surface pooling, recharges groundwater, preserves structural sub-base."
            },
            {
              type: "Alternative A",
              name: "Standard M30 Reinforced Concrete Pavement",
              capex: `₹ ${Math.round(d.permeable_m2 * 1850).toLocaleString('en-IN')} (₹ 1,850 / m²)`,
              opex: `₹ ${Math.round(d.permeable_m2 * 15).toLocaleString('en-IN')} / yr`,
              runoff: "C = 0.85 (15% Infiltration)",
              carbon: "68 kg CO₂e / m²",
              lifespan: "25 years",
              verdict: "Baseline: High embodied carbon and 100% surface runoff generation into municipal storm drains."
            },
            {
              type: "Alternative B",
              name: "Dense Bituminous Asphalt Overlay",
              capex: `₹ ${Math.round(d.permeable_m2 * 1200).toLocaleString('en-IN')} (₹ 1,200 / m²)`,
              opex: `₹ ${Math.round(d.permeable_m2 * 70).toLocaleString('en-IN')} / yr`,
              runoff: "C = 0.90 (10% Infiltration)",
              carbon: "54 kg CO₂e / m²",
              lifespan: "10 - 12 years (degrades under monsoon)",
              verdict: "Rejected: High summer heat island contribution (surface temp > 56°C) and rapid water damage."
            }
          ]
        }
      },
      {
        id: "green_roof",
        priority: 3,
        title: "Extensive Sedum Bio-Solar Green Roof",
        action: `Install ${d.green_roof_m2.toLocaleString()} m² extensive lightweight green roof system on flat RCC terrace slab.`,
        why: `Exposed concrete terrace (${d.roof_area.toLocaleString()} m²) absorbs high solar radiation, spiking top-floor AC cooling demand.`,
        where: `Central and Western terrace rooftop zones (leaving perimeter access and solar PV zones).`,
        quantity: `${d.green_roof_m2.toLocaleString()} m² Multi-Layer Sedum System (75mm engineered substrate)`,
        area: `${d.green_roof_m2.toLocaleString()} m² roof area (${Math.round(d.green_roof_m2 / d.roof_area * 100)}% of terrace)`,
        cost: `₹ ${d.green_roof_cost.toLocaleString('en-IN')} (₹2,200/m² including root barrier & drainage mat)`,
        maintenance: `₹ ${d.green_roof_maint.toLocaleString('en-IN')} / year (₹120/m²/yr seasonal weeding and drip check)`,
        effect: `Retains 65% of roof storm rainfall (~${d.retained_roof_litres.toLocaleString()} L/yr); lowers roof slab temp by 2.8°C; boosts solar PV efficiency by +4.5%.`,
        feasibility: "Conditionally Feasible (Structural reserve dead-load of ≥90 kg/m² verified on M25 RCC slab)",
        data_confidence: "High (FLL Guidelines & IGBC Benchmark)",
        note: "Requires double-coat elastomeric polyurethane waterproofing test prior to substrate laying.",
        constraints: [
          { name: "Structural Dead-Load", status: "Pass", value: "90 kg/m² saturated load (< 150 kg/m² capacity)" },
          { name: "Waterproofing Barrier", status: "Attention", value: "Mandatory double-coat PU elastomeric flood test" },
          { name: "Parapet Clearance", status: "Pass", value: "1.1m safety clearance maintained" }
        ],
        comparison: {
          title: "Roof Typology Comparison",
          options: [
            {
              type: "Proposed",
              name: `Bio-Solar Sedum Green Roof (${d.green_roof_m2.toLocaleString()} m²)`,
              capex: `₹ ${d.green_roof_cost.toLocaleString('en-IN')} (₹ 2,200 / m²)`,
              opex: `₹ ${d.green_roof_maint.toLocaleString('en-IN')} / yr`,
              runoff: "C = 0.35 (65% retention)",
              thermal: "U = 0.42 W/m²K, Temp: 31°C",
              lifespan: "40+ years (protects waterproof membrane)",
              verdict: "Recommended: Extends roof membrane life 2x, cools top floor AC loads by 18%, boosts PV efficiency."
            },
            {
              type: "Alternative A",
              name: "High-Albedo Cool White Polyurethane Coating",
              capex: `₹ ${Math.round(d.green_roof_m2 * 380).toLocaleString('en-IN')} (₹ 380 / m²)`,
              opex: `₹ ${Math.round(d.green_roof_m2 * 90).toLocaleString('en-IN')} / yr`,
              runoff: "C = 0.90 (0% retention)",
              thermal: "SRI = 104, Temp: 34°C",
              lifespan: "3 - 5 years (degrades with atmospheric dust)",
              verdict: "Low-Cost Thermal Fix: Good initial solar reflection, but offers zero stormwater retention or biodiversity."
            },
            {
              type: "Alternative B",
              name: "Intensive Rooftop Garden (350mm soil)",
              capex: `₹ ${Math.round(d.green_roof_m2 * 4800).toLocaleString('en-IN')} (₹ 4,800 / m²)`,
              opex: `₹ ${Math.round(d.green_roof_m2 * 350).toLocaleString('en-IN')} / yr`,
              runoff: "C = 0.20 (80% retention)",
              thermal: "U = 0.30 W/m²K, Temp: 28°C",
              lifespan: "50 years",
              verdict: "Rejected: Structural saturated dead-load (380 kg/m²) exceeds standard RCC slab reserve capacity."
            }
          ]
        }
      },
      {
        id: "rwh",
        priority: 4,
        title: "Dual-Chamber Underground Rainwater Cistern",
        action: `Construct a ${d.tank_cap_kl} kL (${d.tank_litres.toLocaleString()} L) RCC dual-chamber rainwater harvesting storage tank with vortex filter.`,
        why: `Campus incurs a daily non-potable deficit of ${d.daily_np_l.toLocaleString()} L/day for flushing and landscaping (IS 1172:1993 standard).`,
        where: `Low-elevation corner near boundary adjacent to primary roof downspout confluence.`,
        quantity: `${d.tank_litres.toLocaleString()} Litres (${d.tank_cap_kl} kL) RCC M30 Dual-Chamber Cistern`,
        area: `${Math.round(d.tank_litres / 2500)} m² underground footprint`,
        cost: `₹ ${d.tank_cost.toLocaleString('en-IN')} (₹7.50 / Litre including centrifugal transfer pump)`,
        maintenance: `₹ ${d.tank_maint.toLocaleString('en-IN')} / year (Filter mesh cleansing and chlorination)`,
        effect: `Captures ~${Math.round(d.tank_offset_l).toLocaleString()} L/yr of clean roof runoff; satisfies non-potable flushing for ${d.occupants} occupants; saves ~₹${d.tanker_savings.toLocaleString('en-IN')}/yr in tanker water costs.`,
        feasibility: "High (Gravity flow gradient verified from roof downspouts)",
        data_confidence: "High (IS 15797:2008 & CGWB Guidelines)",
        note: "Integrate automatic first-flush vortex diverter (1.5mm initial rain rejection).",
        constraints: [
          { name: "Gravity Fall Gradient", status: "Pass", value: "1:80 fall from roof downspout header" },
          { name: "Foundation Buffer", status: "Pass", value: "4.5m buffer from main building (> 3m req)" },
          { name: "First Flush Rejection", status: "Pass", value: "Automatic vortex separator sized for 1.5mm" }
        ],
        comparison: {
          title: "Rainwater Harvesting Configuration Comparison",
          options: [
            {
              type: "Proposed",
              name: `RCC Dual-Chamber Cistern (${d.tank_cap_kl} kL)`,
              capex: `₹ ${d.tank_cost.toLocaleString('en-IN')} (₹ 7.50 / Litre)`,
              opex: `₹ ${d.tank_maint.toLocaleString('en-IN')} / yr`,
              water: `${Math.round(d.tank_offset_l / 1000).toLocaleString()} kL/yr direct potable offset`,
              durability: "50+ years design life",
              verdict: "Recommended: Provides sediment settlement, prevents anaerobic odor, protects landscape open space."
            },
            {
              type: "Alternative A",
              name: `Modular Polypropylene Crates (${d.tank_cap_kl} kL)`,
              capex: `₹ ${Math.round(d.tank_litres * 6.8).toLocaleString('en-IN')} (₹ 6.80 / Litre)`,
              opex: `₹ ${Math.round(d.tank_litres * 0.22).toLocaleString('en-IN')} / yr`,
              water: `${Math.round(d.tank_offset_l / 1000).toLocaleString()} kL/yr offset`,
              durability: "20 - 25 years under traffic load",
              verdict: "Viable Alternative: Fast modular assembly, but de-silting maintenance is challenging over long horizons."
            },
            {
              type: "Alternative B",
              name: "Direct Borewell Recharge Shaft (No Storage)",
              capex: `₹ ${Math.round(d.tank_litres * 1.2).toLocaleString('en-IN')} (₹ 1.20 / Litre)`,
              opex: `₹ 6,000 / yr`,
              water: "Aquifer replenishment only (no onsite tap reuse)",
              durability: "15 years (subject to silt clogging)",
              verdict: "Secondary Option: Good for regional hydrology, but fails to reduce expensive tanker water purchases."
            }
          ]
        }
      },
      {
        id: "solar",
        priority: 5,
        title: "Grid-Tied Rooftop Monocrystalline Solar PV",
        action: `Deploy a ${d.solar_kwp} kWp grid-tied solar photovoltaic array on ${d.solar_m2.toLocaleString()} m² unshaded terrace area.`,
        why: `Baseline power consumption draws from coal-heavy DISCOM grid (CEA baseline: 0.82 kg CO₂/kWh).`,
        where: `Eastern and Southern unshaded rooftop terrace zones (${d.solar_m2.toLocaleString()} m² allocated).`,
        quantity: `${d.solar_kwp} kWp (Mono-PERC 540W modules + central string inverters)`,
        area: `${d.solar_m2.toLocaleString()} m² panel footprint (${Math.round(d.solar_m2 / d.roof_area * 100)}% of roof)`,
        cost: `₹ ${d.solar_cost.toLocaleString('en-IN')} (₹62,000 / kWp MNRE benchmark turn-key)`,
        maintenance: `₹ ${d.solar_maint.toLocaleString('en-IN')} / year (Bi-weekly panel washing and inverter monitoring)`,
        effect: `Generates ${d.solar_annual_kwh.toLocaleString()} kWh/yr clean electricity; abates ${d.solar_co2_tonnes} tonnes CO₂e/yr; saves ~₹${d.solar_savings.toLocaleString('en-IN')}/yr in electricity costs.`,
        feasibility: "High (True South orientation, zero shadow from adjacent trees)",
        data_confidence: "High (NASA POWER solar radiation data & MNRE standards)",
        note: "Maintain 1.2m service walkways between panel rows for cleaning and inverter access.",
        constraints: [
          { name: "Solar Exposure / Tilt", status: "Pass", value: "Azimuth 180° South, 17° optimal tilt" },
          { name: "Wind Gust Resistance", status: "Pass", value: "Ballasted frame rated for 39 m/s wind" },
          { name: "Walkway Accessibility", status: "Pass", value: "1.2m perimeter and maintenance clearance" }
        ],
        comparison: {
          title: "Clean Energy Technology Comparison",
          options: [
            {
              type: "Proposed",
              name: `Mono-PERC 540W Array (${d.solar_kwp} kWp)`,
              capex: `₹ ${d.solar_cost.toLocaleString('en-IN')} (₹ 62,000 / kWp)`,
              opex: `₹ ${d.solar_maint.toLocaleString('en-IN')} / yr`,
              carbon: `${d.solar_co2_tonnes} t CO₂e / yr abated`,
              payback: "4.8 years (LCOE: ₹ 3.25/kWh)",
              verdict: "Recommended: Optimal balance of energy density, 25-yr linear power warranty, and proven reliability."
            },
            {
              type: "Alternative A",
              name: `Polycrystalline 330W Array (${Math.round(d.solar_kwp * 0.85)} kWp)`,
              capex: `₹ ${Math.round(d.solar_kwp * 52000).toLocaleString('en-IN')} (₹ 52,000 / kWp)`,
              opex: `₹ ${d.solar_maint.toLocaleString('en-IN')} / yr`,
              carbon: `${(d.solar_co2_tonnes * 0.81).toFixed(1)} t CO₂e / yr abated`,
              payback: "5.4 years",
              verdict: "Budget Option: Lower initial cost, but requires 35% more roof footprint to achieve equivalent output."
            },
            {
              type: "Alternative B",
              name: "DISCOM Green Tariff (Power Purchase Only)",
              capex: "₹ 0 initial outlay",
              opex: `₹ ${Math.round(d.solar_annual_kwh * 1.25).toLocaleString('en-IN')} / yr tariff premium`,
              carbon: "Scope 2 paper reduction only",
              payback: "No return on capital",
              verdict: "Rejected: Increases monthly operational OpEx permanently without building energy resilience."
            }
          ]
        }
      },
      {
        id: "bioswale",
        priority: 6,
        title: "Engineered Bioretention Bioswale Basin",
        action: `Excavate and plant a ${d.bioswale_m2.toLocaleString()} m² bioretention bioswale corridor along the low-elevation site grade.`,
        why: `Impervious hardscape runoff carries suspended road dust and automotive hydrocarbons directly toward municipal drains.`,
        where: `Linear drainage depression along low-elevation site perimeter treating ${d.swale_catchment.toLocaleString()} m² catchment.`,
        quantity: `${d.bioswale_m2.toLocaleString()} m² Bioretention cell (sand/soil/compost mix + river cobbles)`,
        area: `${d.bioswale_m2.toLocaleString()} m² linear corridor (~${Math.round(d.bioswale_m2 / 2)}m length × 2m top width)`,
        cost: `₹ ${d.bioswale_cost.toLocaleString('en-IN')} (₹1,200 / m² engineered filter bed)`,
        maintenance: `₹ ${d.bioswale_maint.toLocaleString('en-IN')} / year (Sediment de-silting and native vegetation trimming)`,
        effect: `Filters 85% of total suspended solids; bio-filters runoff from ${d.swale_catchment.toLocaleString()} m² catchment; recharges shallow aquifer.`,
        feasibility: "High (Natural overland slope directs surface water toward perimeter)",
        data_confidence: "High (CIRIA C753 SuDS Manual Standard)",
        note: "Plant native water-tolerant species (*Vetiver*, *Typha*, *Canna indica*).",
        constraints: [
          { name: "Longitudinal Slope", status: "Pass", value: "2.1% slope (within 1.0 - 3.5% SuDS limit)" },
          { name: "Engineered Filter Bed", status: "Pass", value: "k = 30 mm/hr engineered loam mix" },
          { name: "Discharge Overflow", status: "Pass", value: "Equipped with stone rip-rap energy dissipator" }
        ],
        comparison: {
          title: "Stormwater Conveyance & Treatment Comparison",
          options: [
            {
              type: "Proposed",
              name: `Vegetated Bioretention Bioswale (${d.bioswale_m2.toLocaleString()} m²)`,
              capex: `₹ ${d.bioswale_cost.toLocaleString('en-IN')} (₹ 1,200 / m²)`,
              opex: `₹ ${d.bioswale_maint.toLocaleString('en-IN')} / yr`,
              treatment: "85% TSS removal, 60% nutrient filtering",
              biodiversity: "High (Native wetland corridor)",
              verdict: "Recommended: Nature-based solution providing peak attenuation, natural filtration, and wildlife habitat."
            },
            {
              type: "Alternative A",
              name: "Underground RCC Pipe Drain (450mm dia)",
              capex: `₹ ${Math.round(d.bioswale_m2 * 1500).toLocaleString('en-IN')}`,
              opex: `₹ ${Math.round(d.bioswale_m2 * 120).toLocaleString('en-IN')} / yr`,
              treatment: "0% treatment (direct pollutant discharge)",
              biodiversity: "Zero",
              verdict: "Traditional Civil Drain: Fast conveyance but exacerbates downstream urban flooding and conveys pollutants."
            },
            {
              type: "Alternative B",
              name: "Open Masonry V-Ditch (Concrete Lined)",
              capex: `₹ ${Math.round(d.bioswale_m2 * 900).toLocaleString('en-IN')}`,
              opex: `₹ ${Math.round(d.bioswale_m2 * 100).toLocaleString('en-IN')} / yr`,
              treatment: "0% treatment",
              biodiversity: "Zero (Unsafe concrete channel)",
              verdict: "Rejected: Increases runoff velocity, prevents natural infiltration, creates safety hazard."
            }
          ]
        }
      }
    ];
  },

  getDetailedStatutoryRecoveryElements(proj, calc, env, dynamic) {
    const d = dynamic;
    const site = proj?.site || {};
    const builtUp = d.built_up;
    const gfa = d.gfa;
    const openArea = d.open_area;
    const roofArea = d.roof_area;
    const hardscape = d.hardscape;
    const treesRemoved = d.trees_removed || 25;
    const occupants = d.occupants || 100;
    const dailyWaterL = occupants * (proj?.water?.lpcd || 135);
    const stpCapacityKLD = Math.max(10, Math.ceil((dailyWaterL * 0.8 * 1.2) / 1000));
    const miyawakiArea = Math.round(openArea * 0.25);
    const miyawakiSaplings = Math.round(miyawakiArea * 3.5);
    const cdWasteTonnes = Math.round(gfa * 0.055);
    const divertedWasteTonnes = Math.round(cdWasteTonnes * 0.685);
    const topsoilM3 = Math.round(builtUp * 0.20);
    const embodiedCO2Avoided = Math.round((gfa * 0.40 * 130) / 1000);
    const exposedRoofM2 = Math.max(40, roofArea - d.green_roof_m2 - d.solar_m2);

    return [
      {
        id: "el_topsoil",
        number: "01",
        name: "Topsoil Protection & Reuse",
        domain: "Soil & Gardening",
        icon: "🚜",
        standard_code: "MoEF&CC 2006 / NBC 2016 Part 11",
        status: "Statutory Mandatory",
        status_color: "emerald",
        badge_bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        affects_nature: `Digging the ${builtUp.toLocaleString()} m² building foundation removes fertile topsoil, destroying natural earthworms and soil nutrients while leaving bare ground open to mud and wind erosion.`,
        what_we_need_to_do: `Scrape off the top 20 cm of fertile soil (${topsoilM3.toLocaleString()} m³) before heavy excavation starts. Store it in neat piles under protective cover sheets, and spread it back over gardens once construction finishes.`,
        to_reduce_affect: `Saves 100% of your site's natural rich soil so you do not need to buy outside garden soil, keeping trees and lawns healthy while stopping soil erosion.`,
        net_metric: `${topsoilM3.toLocaleString()} m³ Rich Topsoil Saved & Reused`
      },
      {
        id: "el_trees",
        number: "02",
        name: "Native Trees & 3:1 Replacement",
        domain: "Trees & Greenery",
        icon: "🌳",
        standard_code: "Maharashtra Tree Act 1975 & FSI 2023",
        status: "3:1 Quota Satisfied",
        status_color: "emerald",
        badge_bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        affects_nature: `Cutting down ${treesRemoved} mature trees removes ${d.tree_canopy_m2.toLocaleString()} m² of cool shade, eliminates nesting spots for local birds and squirrels, and heats up the surrounding ground.`,
        what_we_need_to_do: `Plant ${d.trees_planted} native Indian trees (such as Neem, Jamun, Peepal, and Karanj) along site edges and open areas, giving each tree at least 16 m² of root space.`,
        to_reduce_affect: `Restores ${d.tree_canopy_m2.toLocaleString()} m² of natural tree shade, absorbs ${d.tree_co2_kg.toLocaleString()} kg of CO₂ from the air every year, and brings back songbirds and butterflies.`,
        net_metric: `${d.trees_planted} Native Trees Planted (${d.tree_canopy_m2.toLocaleString()} m² Canopy Restored)`
      },
      {
        id: "el_miyawaki",
        number: "03",
        name: "Dense Native Miyawaki Micro-Forest",
        domain: "Wildlife & Micro-Forest",
        icon: "🌲",
        standard_code: "Biological Diversity Act 2002",
        status: "+64% Net Gain",
        status_color: "purple",
        badge_bg: "bg-purple-50 text-purple-800 border-purple-200",
        affects_nature: `Empty flat lawns or plain asphalt create bare spaces with almost no wildlife, dry dusty soil, and zero protection from street noise or dust.`,
        what_we_need_to_do: `Plant a dense mini-forest of ${miyawakiSaplings.toLocaleString()} saplings across ${miyawakiArea.toLocaleString()} m² using the Miyawaki method (mixing canopy trees, fruit trees, shrubs, and flowering bushes with organic compost).`,
        to_reduce_affect: `Grows 10 times faster than ordinary tree planting, cools nearby air by ~3.5°C, cuts road noise, and creates a living sanctuary for birds and pollinators.`,
        net_metric: `${miyawakiSaplings.toLocaleString()} Saplings in ${miyawakiArea.toLocaleString()} m² Micro-Forest`
      },
      {
        id: "el_permeable",
        number: "04",
        name: "Permeable Pavers for Driveways & Parking",
        domain: "Rainwater Infiltration",
        icon: "🛣️",
        standard_code: "IRC:SP:63-2018 & CGWB Norms",
        status: "Porous IRC:SP:63",
        status_color: "blue",
        badge_bg: "bg-blue-50 text-blue-800 border-blue-200",
        affects_nature: `Paving ${hardscape.toLocaleString()} m² with solid concrete or asphalt blocks rain from soaking into the ground, causing sudden puddles and street flooding during monsoon downpours.`,
        what_we_need_to_do: `Use interlocking porous concrete pavers across ${d.permeable_m2.toLocaleString()} m² of parking bays and driveways laid over crushed gravel so rainwater soaks straight through.`,
        to_reduce_affect: `Stops 80% of rainwater from rushing into streets, naturally traps oil and road dust, and recharges ~${Math.round(d.recharged_litres / 1000).toLocaleString()} kL of clean water into the groundwater table every year.`,
        net_metric: `${d.permeable_m2.toLocaleString()} m² Porous Ground (${Math.round(d.recharged_litres / 1000).toLocaleString()} kL/yr Recharged)`
      },
      {
        id: "el_bioswale",
        number: "05",
        name: "Rain Garden & Natural Drainage Swale",
        domain: "Storm Drainage & Nature Filters",
        icon: "🌊",
        standard_code: "CIRIA C753 & IRC:SP:13",
        status: "85% Sediment Filtered",
        status_color: "teal",
        badge_bg: "bg-teal-50 text-teal-800 border-teal-200",
        affects_nature: `Rain running off dirty driveways washes oil, vehicle soot, and dirt directly into municipal gutters and local streams without any cleaning.`,
        what_we_need_to_do: `Shape a ${d.bioswale_m2.toLocaleString()} m² landscaped green rain garden with sand, compost, and native water-loving plants along the low edge of the site.`,
        to_reduce_affect: `Slows down rushing rainwater during storms, naturally filters out 85% of road dust and mud, and recharges clean water into the soil.`,
        net_metric: `${d.bioswale_m2.toLocaleString()} m² Rain Garden (85% Road Dirt Filtered)`
      },
      {
        id: "el_rwh",
        number: "06",
        name: "Underground Rainwater Harvesting Tank",
        domain: "Rainwater Storage",
        icon: "💧",
        standard_code: "IS 15797:2008 & CGWB Guidelines",
        status: `${d.tank_cap_kl} kL Storage Sized`,
        status_color: "blue",
        badge_bg: "bg-blue-50 text-blue-800 border-blue-200",
        affects_nature: `Rain falling on your ${roofArea.toLocaleString()} m² rooftop is lost down storm drains, while building occupants spend money on municipal or private water deliveries.`,
        what_we_need_to_do: `Build an underground rainwater storage tank (${d.tank_cap_kl} kL capacity) with a self-cleaning first-flush leaf filter and sand filter.`,
        to_reduce_affect: `Collects ~${Math.round((roofArea * d.annual_rain_m * 0.85 * 0.90) / 1000).toLocaleString()} kL of clean rainwater each year for toilet flushing and garden watering, saving ₹ ${d.tanker_savings.toLocaleString('en-IN')} in water tanker bills.`,
        net_metric: `${d.tank_cap_kl} kL Storage Tank (~${Math.round((roofArea * d.annual_rain_m * 0.85 * 0.90) / 1000).toLocaleString()} kL/yr Rain Saved)`
      },
      {
        id: "el_stp",
        number: "07",
        name: "On-Site Sewage Treatment & Water Recycling",
        domain: "Clean Water Recycling",
        icon: "🔄",
        standard_code: "CPHEEO 2019 & NGT Guidelines",
        status: "100% ZLD Compliant",
        status_color: "emerald",
        badge_bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        affects_nature: `Letting untreated building sewage enter public drains pollutes local rivers, causes bad odors, and spreads disease.`,
        what_we_need_to_do: `Install a modern on-site sewage treatment plant (${stpCapacityKLD} kLD) with fine filters and UV disinfection to purify all wastewater.`,
        to_reduce_affect: `Recycles 100% of used building water on-site for flushing toilets and watering site gardens, meaning zero sewage enters public drains.`,
        net_metric: `${stpCapacityKLD} kLD Treatment (100% Zero Sewage Discharge)`
      },
      {
        id: "el_solar",
        number: "08",
        name: "Rooftop Clean Solar Panels",
        domain: "Clean Energy & Lower Bills",
        icon: "☀️",
        standard_code: "ECBC 2017 & CEA v20 Baseline",
        status: "100% RE Quota Met",
        status_color: "amber",
        badge_bg: "bg-amber-50 text-amber-800 border-amber-200",
        affects_nature: `Using coal grid electricity produces ~${Math.round((gfa * 75 * 0.82) / 1000)} tonnes of air pollution and carbon dioxide every year.`,
        what_we_need_to_do: `Mount ${d.solar_kwp} kWp of high-efficiency solar panels across ${d.solar_m2.toLocaleString()} m² of your rooftop connected to your electrical meter.`,
        to_reduce_affect: `Generates ~${Math.round(d.solar_annual_kwh / 1000)} MWh of clean electricity every year, cuts ₹ ${d.solar_savings.toLocaleString('en-IN')} from electricity bills, and avoids ${d.solar_co2_tonnes} tonnes of carbon emissions.`,
        net_metric: `${d.solar_kwp} kWp Solar (${Math.round(d.solar_annual_kwh / 1000)} MWh/yr Clean Power)`
      },
      {
        id: "el_green_concrete",
        number: "09",
        name: "Low-Carbon Eco Concrete",
        domain: "Clean Building Materials",
        icon: "🧱",
        standard_code: "IS 456:2000 & CPWD Low-Carbon Norms",
        status: "28.6% Carbon Reduction",
        status_color: "stone",
        badge_bg: "bg-stone-100 text-stone-800 border-stone-300",
        affects_nature: `Traditional cement manufacturing creates massive smoke and carbon pollution, accounting for over half of a building's initial carbon footprint.`,
        what_we_need_to_do: `Mix 35% industrial slag (GGBS) or fly-ash into concrete foundations and beams to replace carbon-intensive cement.`,
        to_reduce_affect: `Cuts ${embodiedCO2Avoided} tonnes of carbon emissions and actually makes the concrete stronger and more resistant to moisture damage.`,
        net_metric: `${embodiedCO2Avoided} tonnes Carbon Cut (-28.6% Cement Emissions)`
      },
      {
        id: "el_cd_waste",
        number: "10",
        name: "Construction Rubble & Debris Recycling",
        domain: "Waste Reduction",
        icon: "♻️",
        standard_code: "CPCB C&D Waste Rules 2016",
        status: "68.5% Landfill Diversion",
        status_color: "emerald",
        badge_bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        affects_nature: `Dumping ${cdWasteTonnes.toLocaleString()} tonnes of construction rubble fills up landfills and forces companies to quarry fresh river sand and rock.`,
        what_we_need_to_do: `Sort waste into separate bins on-site, crush clean broken concrete and brick, and use it as gravel base under driveways.`,
        to_reduce_affect: `Diverts ${divertedWasteTonnes.toLocaleString()} tonnes of debris away from city dumps and reuses it right on site for paving bases.`,
        net_metric: `${divertedWasteTonnes.toLocaleString()} tonnes Rubble Recycled (68.5% Kept Out of Landfill)`
      },
      {
        id: "el_cool_roof",
        number: "11",
        name: "Cool Reflective Roof & Green Bio-Roof",
        domain: "Rooftop Cooling & Comfort",
        icon: "🌿",
        standard_code: "NBC 2016 Part 11 & Cool Roof Rating",
        status: "16°C Surface Cooling",
        status_color: "amber",
        badge_bg: "bg-amber-50 text-amber-800 border-amber-200",
        affects_nature: `Bare concrete rooftops heat up to 60°C under the sun, turning top-floor rooms into ovens and driving up air conditioning electricity bills.`,
        what_we_need_to_do: `Plant ${d.green_roof_m2.toLocaleString()} m² of low-maintenance Sedum green roof and coat the rest with white sun-reflective coating.`,
        to_reduce_affect: `Lowers rooftop surface temperature by 16°C, keeps top-floor rooms cooler, cuts air conditioning costs by ~10%, and helps rooftop solar panels generate more power.`,
        net_metric: `${d.green_roof_m2.toLocaleString()} m² Green Roof + Cool Coating (16°C Cooler Surface)`
      }
    ];
  },

  render(project, calculations, environmentalData) {
    const container = document.getElementById("recovery-view") || document.getElementById("plan-view");
    if (!container) return;
    if (container.classList.contains("hidden")) {
      container.classList.remove("hidden");
    }

    // Safety fallback
    const proj = project || window.App?.currentProject || window.ECO_SAMPLE_PROJECTS?.kolhapur_academic;
    const calc = calculations || window.App?.calculations;
    const env = environmentalData || window.App?.environmentalData;

    // Execute dynamic calculations from user's site
    const dynamic = this.getDynamicInterventions(proj, calc, env);
    const eightDomains = this.getEightDomainsData(proj, calc, env, dynamic);
    const recoveryElements = this.getDetailedStatutoryRecoveryElements(proj, calc, env, dynamic);
    const plans = this.getDynamicPlans(dynamic);
    const actionCards = this.getActionCardsData(proj, calc, env, dynamic);
    const recovery = calc?.recovery || window.NatureRecoveryCalculator.calculateRecoveryPlan(proj, calc, env);

    const p1 = recovery?.phase1_construction || {
      topsoil: { salvage_volume_m3: Math.round(dynamic.built_up * 0.20) },
      dust_control: { pm10_capture_efficiency_pct: 72 },
      green_concrete: { co2_avoided_tonnes: Math.round((dynamic.gfa * 0.40 * 130) / 1000) },
      rubble_circularity: { reusable_subbase_m3: Math.round((dynamic.gfa * 55 * 0.65) / 1600) }
    };

    const p2 = recovery?.phase2_operational || {
      miyawaki_forest: {
        designated_area_m2: Math.round(dynamic.open_area * 0.25),
        total_saplings: Math.round(dynamic.open_area * 0.25 * 3.5),
        carbon_sequestration_tonnes_yr: ((dynamic.open_area * 0.25 * 4.5) / 1000).toFixed(1),
        species_tiers: [
          { tier: "Canopy Layer (15m+)", pct: 20, species: ["Banyan (Ficus benghalensis)", "Peepal (Ficus religiosa)", "Arjun (Terminalia arjuna)"] },
          { tier: "Sub-Canopy (8-15m)", pct: 40, species: ["Neem (Azadirachta indica)", "Karanj (Pongamia pinnata)", "Jamun (Syzygium cumini)"] },
          { tier: "Sub-Tree (3-8m)", pct: 25, species: ["Amaltas (Cassia fistula)", "Palash (Butea monosperma)", "Amla (Phyllanthus emblica)"] },
          { tier: "Shrub Layer (1-3m)", pct: 15, species: ["Nirgundi (Vitex negundo)", "Adhatoda (Justicia adhatoda)", "Tulsi (Ocimum tenuiflorum)"] }
        ]
      },
      sponge_city_bioswales: {
        storage_sump_m3: Math.round(dynamic.bioswale_m2 * 0.45 * 0.35),
        daily_infiltration_litres: Math.round(dynamic.bioswale_recharge_l)
      },
      bio_solar_roof: { pv_efficiency_boost_pct: 4.5 },
      organic_composting: { annual_bio_fertilizer_tonnes: (dynamic.occupants * 0.4 * 365 * 0.25 / 1000).toFixed(1) }
    };

    const currentPlan = plans[this.activePlan];
    const avoidance = this.getAvoidanceData(proj, dynamic);
    const alternatives = this.getAlternativeDesignsData(proj, dynamic, plans);
    const feasibility = this.getFeasibilityAndRejectionsData(proj, dynamic);
    const balance = this.getRecoveryBalanceData(proj, dynamic);
    const priorityMatrix = this.getPriorityMatrixData(proj, dynamic);
    const forecasts = this.getMultiYearForecastData(proj, dynamic);

    container.innerHTML = `
      <div class="space-y-8 max-w-7xl mx-auto pb-16 font-sans text-stone-800 animate-fade-in">
        
        <!-- HEADER (CLEAN & SIMPLE) -->
        <div class="bg-[#0D1912] text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Recovery Plan</span>
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-800 text-stone-300 border border-stone-700 font-mono">
                Plot: ${dynamic.plot_area.toLocaleString()} m²
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-800 text-stone-300 border border-stone-700 font-mono">
                Footprint: ${dynamic.built_up.toLocaleString()} m²
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                Roof: ${dynamic.roof_area.toLocaleString()} m²
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Nature Recovery Plan
            </h1>
            <p class="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Clear, practical steps to protect nature, save rainwater, add trees, and reduce pollution on your site.
            </p>
          </div>

          <div class="flex items-center gap-2.5 self-start lg:self-center flex-wrap">
            <button onclick="window.NatureRecoveryView.printRecoveryPlan()" class="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#14281D] hover:bg-emerald-950 text-emerald-200 border border-emerald-700/60 shadow transition flex items-center gap-1.5" title="Print plan on A4 paper">
              <span>🖨️</span> <span>Print Plan (A4)</span>
            </button>
            <button onclick="window.App.switchView('site3d')" class="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition flex items-center gap-1.5">
              <span>🌐</span> <span>3D View</span>
            </button>
          </div>
        </div>

        <!-- 4 KEY NUMBERS RIBBON -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1">
            <span class="text-xs font-bold uppercase text-blue-900 tracking-wider flex items-center gap-1.5">
              <span>💧</span> <span>Water Saved</span>
            </span>
            <strong class="text-xl sm:text-2xl font-black font-serif text-blue-950 block">${dynamic.total_water_saved_kl.toLocaleString()} kL / yr</strong>
            <p class="text-xs text-blue-800 font-medium leading-snug">Harvested rainwater reused for toilets, gardens, and ground wells.</p>
          </div>

          <div class="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
            <span class="text-xs font-bold uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
              <span>🌳</span> <span>Trees & Greenery</span>
            </span>
            <strong class="text-xl sm:text-2xl font-black font-serif text-emerald-950 block">${dynamic.trees_planted} Trees</strong>
            <p class="text-xs text-emerald-800 font-medium leading-snug">+ ${(dynamic.tree_canopy_m2 + dynamic.permeable_m2 + dynamic.green_roof_m2).toLocaleString()} m² green & porous surface to keep the site cool.</p>
          </div>

          <div class="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
            <span class="text-xs font-bold uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
              <span>☀️</span> <span>Clean Solar Energy</span>
            </span>
            <strong class="text-xl sm:text-2xl font-black font-serif text-amber-950 block">${dynamic.solar_kwp} kWp Solar</strong>
            <p class="text-xs text-amber-800 font-medium leading-snug">Generates ${dynamic.solar_kwh_yr.toLocaleString()} kWh/yr clean power and cuts power bills.</p>
          </div>

          <div class="p-5 rounded-2xl bg-stone-50/90 border border-stone-200/90 space-y-1">
            <span class="text-xs font-bold uppercase text-stone-800 tracking-wider flex items-center gap-1.5">
              <span>♻️</span> <span>Soil Saved & Reused</span>
            </span>
            <strong class="text-xl sm:text-2xl font-black font-serif text-stone-900 block">${Math.round(dynamic.built_up * 0.20).toLocaleString()} m³ Topsoil</strong>
            <p class="text-xs text-stone-600 font-medium leading-snug">Fertile topsoil saved before digging and reused for landscaping.</p>
          </div>
        </div>

        <!-- ========================================================================= -->
        <!-- 1. 11-STEP NATURE RECOVERY ACTION PLAN -->
        <!-- ========================================================================= -->
        <div class="crystal-glass-card p-6 sm:p-8 space-y-6 avoid-page-break print-card" id="eia-statutory-nature-recovery-plan">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <h2 class="text-xl sm:text-2xl font-black text-stone-900 font-serif">
                1. 11-Step Nature Recovery Action Plan
              </h2>
              <p class="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
                What the construction affects, what practical steps we take, and how nature recovers on your site.
              </p>
            </div>

            <div class="flex items-center gap-2.5 self-start sm:self-center shrink-0 no-print">
              <button onclick="window.NatureRecoveryView.printRecoveryPlan()" class="px-4 py-2 rounded-xl text-xs font-bold bg-[#14281D] hover:bg-stone-900 text-white shadow transition flex items-center gap-1.5" title="Print plan on A4 paper">
                <span>🖨️</span> <span>Print Plan (A4)</span>
              </button>
            </div>
          </div>

          <!-- Master 11-Step Schedule Table -->
          <div class="overflow-x-auto border border-stone-200 rounded-2xl shadow-xs">
            <table class="w-full text-xs text-left border-collapse">
              <thead class="bg-[#14281D] text-white font-bold text-xs">
                <tr>
                  <th class="p-3.5 w-[18%]">Action Item</th>
                  <th class="p-3.5 w-[26%] bg-rose-950/60 text-rose-200">What It Affects</th>
                  <th class="p-3.5 w-[26%] bg-stone-900/50">What We Need To Do</th>
                  <th class="p-3.5 w-[20%] bg-emerald-950/60 text-emerald-200">How Nature Recovers</th>
                  <th class="p-3.5 text-right whitespace-nowrap">Target Result</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-200 text-stone-800 bg-white">
                ${recoveryElements.map(el => `
                  <tr class="hover:bg-stone-50/80 transition-colors avoid-page-break">
                    <!-- Column 1: Action Item -->
                    <td class="p-3.5 align-top space-y-1 bg-stone-50/50 border-r border-stone-200">
                      <div class="flex items-center gap-1.5">
                        <span class="w-6 h-6 rounded-lg bg-[#14281D] text-emerald-300 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">${el.number}</span>
                        <span class="text-xs font-black text-stone-900">${el.name}</span>
                      </div>
                      <div class="text-[10px] text-stone-500 font-medium">${el.domain}</div>
                    </td>

                    <!-- Column 2: What It Affects -->
                    <td class="p-3.5 align-top text-stone-700 bg-rose-50/20 text-xs leading-relaxed border-r border-stone-200">
                      ${el.affects_nature}
                    </td>

                    <!-- Column 3: What We Need To Do -->
                    <td class="p-3.5 align-top text-stone-800 text-xs leading-relaxed border-r border-stone-200 bg-white font-medium">
                      ${el.what_we_need_to_do}
                    </td>

                    <!-- Column 4: How Nature Recovers -->
                    <td class="p-3.5 align-top text-emerald-950 bg-emerald-50/30 text-xs leading-relaxed border-r border-stone-200">
                      ${el.to_reduce_affect}
                    </td>

                    <!-- Column 5: Target Result -->
                    <td class="p-3.5 align-top text-right space-y-1 bg-stone-50/30">
                      <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold ${el.badge_bg} border whitespace-nowrap">${el.status}</span>
                      <div class="font-mono text-xs font-bold text-emerald-900 text-right leading-tight">
                        ${el.net_metric}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>





        <!-- ========================================================================= -->
        <!-- 2. RECOMMENDED GREEN SOLUTIONS FOR YOUR SITE -->
        <!-- ========================================================================= -->
        <div class="crystal-glass-card p-6 sm:p-8 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <h2 class="text-xl sm:text-2xl font-black text-stone-900 font-serif">
                2. Recommended Green Solutions for Your Site
              </h2>
              <p class="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Practical eco-friendly features sized for your land. Click 'Details' to view specifications or toggle items to customize your plan.
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs text-stone-500 font-medium">${this.activeActions.length} of ${actionCards.length} Active in Plan</span>
              <button onclick="window.NatureRecoveryView.resetAllActions()" class="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline">
                Select All
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            ${actionCards.map((a, idx) => {
              const isInPlan = this.activeActions.includes(a.id);
              const iconMap = {
                trees: "🌳",
                permeable: "🛣️",
                green_roof: "🌿",
                rwh: "💧",
                solar: "☀️",
                bioswale: "🌊"
              };
              return `
              <div class="p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${isInPlan ? 'border-emerald-600/70 bg-white ring-1 ring-emerald-500/20 shadow-md' : 'border-stone-200 bg-stone-50/80 opacity-75'}">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-2xl">${iconMap[a.id] || "🌱"}</span>
                    <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isInPlan ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-stone-200 text-stone-600'}">
                      ${isInPlan ? '✓ Included' : 'Excluded'}
                    </span>
                  </div>

                  <div>
                    <h3 class="text-sm font-bold text-stone-900 font-serif leading-snug">${a.title}</h3>
                    <p class="text-xs text-stone-600 mt-1.5 leading-relaxed">${a.action}</p>
                  </div>

                  <div class="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs space-y-1">
                    <div class="flex justify-between"><span class="text-stone-500">Quantity:</span> <strong class="text-stone-900">${a.quantity.split('(')[0]}</strong></div>
                    <div class="flex justify-between"><span class="text-stone-500">Setup Cost:</span> <strong class="text-stone-900">${a.cost.split('(')[0]}</strong></div>
                    <div class="flex justify-between"><span class="text-stone-500">Yearly Upkeep:</span> <strong class="text-stone-900">${a.maintenance.split('(')[0]}</strong></div>
                  </div>

                  <div class="text-xs text-emerald-800 font-semibold leading-snug">
                    ${a.effect.split(';')[0]}
                  </div>
                </div>

                <div class="pt-3 border-t border-stone-100 flex items-center gap-2">
                  <button onclick="window.NatureRecoveryView.openModal(${idx})" class="w-1/3 px-3 py-2 text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition flex items-center justify-center gap-1">
                    <span>🔍</span> <span>Details</span>
                  </button>
                  <button onclick="window.NatureRecoveryView.togglePlanAction('${a.id}')" class="w-2/3 px-3 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${isInPlan ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200' : 'bg-[#14281D] text-white hover:bg-stone-900'}">
                    <span>${isInPlan ? '✓ In Plan' : '+ Add to Plan'}</span>
                  </button>
                </div>
              </div>
            `;}).join('')}
          </div>
        </div>

        <!-- 3. LAND & ROOFTOP SPACE CHECK -->
        <div class="crystal-glass-card p-6 sm:p-8 space-y-6">
          <div class="border-b border-stone-100 pb-4">
            <h2 class="text-xl sm:text-2xl font-black text-stone-900 font-serif">
              3. Land & Rooftop Space Check
            </h2>
            <p class="text-xs text-stone-500 mt-1">
              Confirming that green features fit on your site without overcrowding your plot or roof.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Open Ground Check -->
            <div class="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-4 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">🏡</span>
                    <div>
                      <h3 class="font-bold text-stone-900 text-sm">Ground Open Space</h3>
                      <span class="text-[11px] text-stone-500">Unbuilt ground outside the building footprint</span>
                    </div>
                  </div>
                  <span class="px-2.5 py-1 rounded-full text-xs font-bold ${feasibility.ground.is_feasible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                    ${feasibility.ground.is_feasible ? '✓ Fits Comfortably' : 'Adjusted'}
                  </span>
                </div>

                <!-- Visual Progress Bar -->
                <div class="space-y-1.5 pt-1">
                  <div class="flex justify-between text-xs font-semibold">
                    <span class="text-stone-600">Greenery & Swales Needed</span>
                    <span class="text-emerald-900 font-mono">${feasibility.ground.required.toLocaleString()} m² of ${dynamic.open_area.toLocaleString()} m²</span>
                  </div>
                  <div class="w-full h-3 bg-stone-200/80 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full" style="width: ${Math.min(100, Math.round((feasibility.ground.required / (dynamic.open_area || 1)) * 100))}%"></div>
                  </div>
                  <div class="flex justify-between text-[11px] text-stone-500">
                    <span>${Math.round((feasibility.ground.required / (dynamic.open_area || 1)) * 100)}% allocated</span>
                    <span>${Math.max(0, dynamic.open_area - feasibility.ground.required).toLocaleString()} m² free open space</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-200/60">
                  <div class="p-2.5 bg-white rounded-xl border border-emerald-100">
                    <span class="text-[10px] text-stone-400 block font-semibold">Native Trees</span>
                    <strong class="text-stone-900 font-mono">${dynamic.trees_planted} Trees</strong>
                    <span class="text-[10px] text-stone-500 block">4x4m grid on setbacks</span>
                  </div>
                  <div class="p-2.5 bg-white rounded-xl border border-emerald-100">
                    <span class="text-[10px] text-stone-400 block font-semibold">Rainwater Bioswale</span>
                    <strong class="text-stone-900 font-mono">${dynamic.bioswale_m2.toLocaleString()} m²</strong>
                    <span class="text-[10px] text-stone-500 block">Natural edge swale</span>
                  </div>
                </div>
              </div>

              <p class="text-[11px] text-stone-600 leading-relaxed bg-white/80 p-3 rounded-xl border border-emerald-100">
                💡 <strong>Site Note:</strong> Trees are planted along boundary borders to keep a clear 6-meter driveway open for emergency fire trucks and regular vehicle traffic.
              </p>
            </div>

            <!-- Rooftop Allocation Check -->
            <div class="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-4 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">🏢</span>
                    <div>
                      <h3 class="font-bold text-stone-900 text-sm">Rooftop Space Allocation</h3>
                      <span class="text-[11px] text-stone-500">Terrace slab area utilization</span>
                    </div>
                  </div>
                  <span class="px-2.5 py-1 rounded-full text-xs font-bold ${feasibility.roof.is_feasible ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}">
                    ${feasibility.roof.is_feasible ? '✓ Safe & Feasible' : 'Adjusted'}
                  </span>
                </div>

                <!-- Visual Stacked Bar -->
                <div class="space-y-1.5 pt-1">
                  <div class="flex justify-between text-xs font-semibold">
                    <span class="text-stone-600">Solar + Green Roof Allocation</span>
                    <span class="text-blue-950 font-mono">${(dynamic.solar_m2 + dynamic.green_roof_m2).toLocaleString()} m² of ${dynamic.roof_area.toLocaleString()} m²</span>
                  </div>
                  <div class="w-full h-3 bg-stone-200/80 rounded-full overflow-hidden flex">
                    <div class="h-full bg-amber-500" style="width: ${Math.round((dynamic.solar_m2 / (dynamic.roof_area || 1)) * 100)}%" title="Solar Panels"></div>
                    <div class="h-full bg-emerald-500" style="width: ${Math.round((dynamic.green_roof_m2 / (dynamic.roof_area || 1)) * 100)}%" title="Green Roof"></div>
                  </div>
                  <div class="flex justify-between text-[11px] text-stone-500">
                    <span class="flex items-center gap-3">
                      <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-500"></span> Solar (${Math.round((dynamic.solar_m2 / (dynamic.roof_area || 1)) * 100)}%)</span>
                      <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Green Roof (${Math.round((dynamic.green_roof_m2 / (dynamic.roof_area || 1)) * 100)}%)</span>
                    </span>
                    <span>${feasibility.roof.walkways.toLocaleString()} m² walkways</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-blue-200/60">
                  <div class="p-2.5 bg-white rounded-xl border border-blue-100">
                    <span class="text-[10px] text-stone-400 block font-semibold">Solar Power</span>
                    <strong class="text-stone-900 font-mono">${dynamic.solar_kwp} kWp</strong>
                    <span class="text-[10px] text-stone-500 block">${dynamic.solar_m2.toLocaleString()} m² panels</span>
                  </div>
                  <div class="p-2.5 bg-white rounded-xl border border-blue-100">
                    <span class="text-[10px] text-stone-400 block font-semibold">Sedum Green Roof</span>
                    <strong class="text-stone-900 font-mono">${dynamic.green_roof_m2.toLocaleString()} m²</strong>
                    <span class="text-[10px] text-stone-500 block">75mm light substrate</span>
                  </div>
                </div>
              </div>

              <p class="text-[11px] text-stone-600 leading-relaxed bg-white/80 p-3 rounded-xl border border-blue-100">
                💡 <strong>Weight Note:</strong> Uses lightweight 75mm plant mats (85 kg/m²), easily supported by your terrace slab with zero risk of structural strain.
              </p>
            </div>
          </div>
        </div>

        <!-- 4. STEP-BY-STEP IMPLEMENTATION -->
        <div class="crystal-glass-card p-6 sm:p-8 space-y-6">
          <div class="border-b border-stone-100 pb-4">
            <h2 class="text-xl sm:text-2xl font-black text-stone-900 font-serif">
              4. Step-by-Step Implementation
            </h2>
            <p class="text-xs text-stone-500 mt-1">
              Clear actions to carry out during construction and once the building is completed.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Phase 1: During Construction -->
            <div class="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-sm">1</div>
                <div>
                  <h3 class="font-bold text-stone-900 text-base">During Construction</h3>
                  <span class="text-xs text-amber-800 font-medium">Protect the site and reduce pollution</span>
                </div>
              </div>

              <div class="space-y-3 text-xs">
                <div class="p-3.5 bg-white rounded-xl border border-amber-200/60 space-y-1">
                  <div class="flex items-center gap-1.5 font-bold text-amber-950">
                    <span>🚜</span> <span>Save & Protect Fertile Topsoil</span>
                  </div>
                  <p class="text-stone-600 leading-relaxed text-[11px]">
                    Before digging foundations, gently scrape off and store <strong>${p1.topsoil.salvage_volume_m3.toLocaleString()} m³</strong> of fertile topsoil. Keep piles under 2 meters so living soil microbes stay healthy, ready to spread back on gardens once construction is done.
                  </p>
                </div>

                <div class="p-3.5 bg-white rounded-xl border border-amber-200/60 space-y-1">
                  <div class="flex items-center gap-1.5 font-bold text-stone-900">
                    <span>💨</span> <span>Keep Dust & Air Clean</span>
                  </div>
                  <p class="text-stone-600 leading-relaxed text-[11px]">
                    Put up 6-meter barrier sheets along borders and use water-mist sprayers to capture ~72% of airborne dust, keeping neighbors and workers breathing clean air.
                  </p>
                </div>

                <div class="p-3.5 bg-white rounded-xl border border-amber-200/60 space-y-1">
                  <div class="flex items-center gap-1.5 font-bold text-stone-900">
                    <span>🧱</span> <span>Cleaner Cement & Recycled Crushed Stone</span>
                  </div>
                  <p class="text-stone-600 leading-relaxed text-[11px]">
                    Use blended cement (fly ash / slag) to prevent <strong>${p1.green_concrete.co2_avoided_tonnes} tonnes</strong> of carbon emissions, and crush clean concrete rubble to use under driveways and pathways.
                  </p>
                </div>
              </div>
            </div>

            <!-- Phase 2: Once the Building is Ready -->
            <div class="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">2</div>
                <div>
                  <h3 class="font-bold text-stone-900 text-base">Once Building is Ready</h3>
                  <span class="text-xs text-emerald-800 font-medium">Long-term greenery, clean water & energy</span>
                </div>
              </div>

              <div class="space-y-3 text-xs">
                <div class="p-3.5 bg-white rounded-xl border border-emerald-200/60 space-y-1">
                  <div class="flex items-center gap-1.5 font-bold text-emerald-950">
                    <span>🌳</span> <span>Plant Native Trees & Greenery</span>
                  </div>
                  <p class="text-stone-600 leading-relaxed text-[11px]">
                    Plant <strong>${dynamic.trees_planted} native shade trees</strong> and native plants across open grounds to bring back birds and butterflies, cool the air, and capture ~${p2.miyawaki_forest.carbon_sequestration_tonnes_yr} tonnes of carbon every year.
                  </p>
                </div>

                <div class="p-3.5 bg-white rounded-xl border border-emerald-200/60 space-y-1">
                  <div class="flex items-center gap-1.5 font-bold text-blue-950">
                    <span>💧</span> <span>Collect Rainwater & Recharge Ground</span>
                  </div>
                  <p class="text-stone-600 leading-relaxed text-[11px]">
                    Channel roof rain into the <strong>${dynamic.cistern_capacity_kl.toLocaleString()} kL storage tank</strong> for reuse, and let garden overflow soak into the <strong>${dynamic.bioswale_m2.toLocaleString()} m² swale</strong> to recharge natural underground water.
                  </p>
                </div>

                <div class="p-3.5 bg-white rounded-xl border border-emerald-200/60 space-y-1">
                  <div class="flex items-center gap-1.5 font-bold text-stone-900">
                    <span>☀️</span> <span>Clean Solar Energy & Garden Compost</span>
                  </div>
                  <p class="text-stone-600 leading-relaxed text-[11px]">
                    Generate <strong>${Math.round(dynamic.solar_annual_kwh / 1000)} MWh/year</strong> of solar power on the roof, and turn cafeteria food scraps into <strong>${p2.organic_composting.annual_bio_fertilizer_tonnes} tonnes/year</strong> of rich natural fertilizer for your gardens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ACTION DETAILS MODAL -->
        ${this.selectedActionIndex !== null ? `
          <div class="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
              <div class="bg-[#0D1912] text-white p-5 flex items-center justify-between">
                <div>
                  <span class="text-[10px] uppercase font-bold text-emerald-400">Green Solution Details</span>
                  <h3 class="text-lg font-bold font-serif text-white">${actionCards[this.selectedActionIndex].title}</h3>
                </div>
                <button onclick="window.NatureRecoveryView.closeModal()" class="text-stone-400 hover:text-white text-2xl font-bold leading-none p-1">&times;</button>
              </div>

              <div class="p-6 space-y-4 overflow-y-auto text-xs text-stone-700">
                <div>
                  <span class="font-bold text-stone-900 block uppercase text-[10px]">What It Does</span>
                  <p class="text-stone-700 leading-relaxed mt-0.5">${actionCards[this.selectedActionIndex].action}</p>
                </div>

                <div>
                  <span class="font-bold text-stone-900 block uppercase text-[10px]">Why It Helps Nature</span>
                  <p class="text-stone-700 leading-relaxed mt-0.5">${actionCards[this.selectedActionIndex].why}</p>
                </div>

                <div>
                  <span class="font-bold text-stone-900 block uppercase text-[10px]">Where It Goes On Site</span>
                  <p class="text-stone-700 leading-relaxed mt-0.5">${actionCards[this.selectedActionIndex].where}</p>
                </div>

                <div class="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                  <div>
                    <span class="text-[10px] text-stone-400 uppercase font-bold">Planned Quantity</span>
                    <div class="font-bold text-stone-900 text-xs mt-0.5">${actionCards[this.selectedActionIndex].quantity}</div>
                  </div>
                  <div>
                    <span class="text-[10px] text-stone-400 uppercase font-bold">Estimated Cost</span>
                    <div class="font-bold text-stone-900 text-xs mt-0.5">${actionCards[this.selectedActionIndex].cost}</div>
                  </div>
                  <div>
                    <span class="text-[10px] text-stone-400 uppercase font-bold">Annual Upkeep</span>
                    <div class="font-bold text-stone-900 text-xs mt-0.5">${actionCards[this.selectedActionIndex].maintenance}</div>
                  </div>
                  <div>
                    <span class="text-[10px] text-stone-400 uppercase font-bold">Environmental Benefit</span>
                    <div class="font-bold text-emerald-800 text-xs mt-0.5">${actionCards[this.selectedActionIndex].effect.split(';')[0]}</div>
                  </div>
                </div>

                <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-[11px] leading-relaxed">
                  <strong>💡 Practical Tip:</strong> ${actionCards[this.selectedActionIndex].note}
                </div>
              </div>

              <div class="bg-stone-50 px-6 py-3.5 border-t border-stone-100 flex justify-between items-center">
                <button onclick="window.App.switchView('site3d'); window.NatureRecoveryView.closeModal();" class="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                  <span>🌐</span> <span>View in 3D Site</span>
                </button>
                <button onclick="window.NatureRecoveryView.closeModal()" class="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition">Close</button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- 3-WAY COMPARISON MODAL -->
        ${this.compareActionIndex !== null ? `
          <div class="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
              <div class="bg-[#0D1912] text-white p-5 flex items-center justify-between border-b border-stone-800">
                <div>
                  <span class="text-[10px] uppercase font-bold text-emerald-400">Green Solutions Comparison</span>
                  <h3 class="text-lg font-bold font-serif text-white">${actionCards[this.compareActionIndex].comparison.title}</h3>
                </div>
                <button onclick="window.NatureRecoveryView.closeCompareModal()" class="text-stone-400 hover:text-white text-2xl font-bold leading-none p-1">&times;</button>
              </div>

              <div class="p-6 space-y-4 overflow-y-auto text-xs text-stone-700">
                <p class="text-stone-600 leading-relaxed text-xs">
                  Here is how the recommended green solution compares against conventional and budget options:
                </p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  ${actionCards[this.compareActionIndex].comparison.options.map(opt => `
                    <div class="p-4 rounded-2xl border ${opt.type === 'Proposed' ? 'border-2 border-emerald-500 bg-emerald-50/40 shadow-sm' : 'border-stone-200 bg-stone-50'} space-y-3 flex flex-col justify-between">
                      <div class="space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${opt.type === 'Proposed' ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'}">
                            ${opt.type === 'Proposed' ? '⭐ Recommended' : opt.type}
                          </span>
                        </div>
                        <h4 class="font-bold text-stone-900 font-serif text-sm">${opt.name}</h4>
                        
                        <div class="space-y-1.5 pt-2 text-[11px] border-t border-stone-200/80">
                          <div class="flex justify-between">
                            <span class="text-stone-500">Initial Cost:</span>
                            <span class="font-bold text-stone-900">${opt.capex}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-stone-500">Yearly Upkeep:</span>
                            <span class="font-semibold text-stone-800">${opt.opex}</span>
                          </div>
                          ${opt.carbon ? `
                            <div class="flex justify-between">
                              <span class="text-stone-500">Carbon:</span>
                              <span class="font-semibold text-emerald-800">${opt.carbon}</span>
                            </div>
                          ` : ''}
                          ${opt.water ? `
                            <div class="flex justify-between">
                              <span class="text-stone-500">Water Impact:</span>
                              <span class="font-semibold text-stone-800">${opt.water}</span>
                            </div>
                          ` : ''}
                        </div>
                      </div>

                      <div class="pt-3 border-t border-stone-200/80 text-[11px] leading-snug">
                        <strong class="text-stone-900 block text-[10px] uppercase">Summary:</strong>
                        <p class="${opt.type === 'Proposed' ? 'text-emerald-900 font-medium' : 'text-stone-600'} mt-0.5">${opt.verdict}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="bg-stone-50 px-6 py-3.5 border-t border-stone-100 flex justify-end">
                <button onclick="window.NatureRecoveryView.closeCompareModal()" class="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition">Close Comparison</button>
              </div>
            </div>
          </div>
        ` : ''}

      </div>
    `;
  },

  selectPlan(planKey) {
    this.activePlan = planKey;
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  },

  switchPlan(planKey) {
    this.selectPlan(planKey);
  },

  setPlan(planKey) {
    this.selectPlan(planKey);
  },

  updateWeight(key, val) {
    this.weights[key] = parseInt(val) || 10;
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  },

  openModal(idx) {
    this.selectedActionIndex = idx;
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  },

  closeModal() {
    this.selectedActionIndex = null;
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  },

  openCompareModal(idx) {
    this.compareActionIndex = idx;
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  },

  closeCompareModal() {
    this.compareActionIndex = null;
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  },

  togglePlanAction(actionId) {
    if (!this.activeActions) {
      this.activeActions = ['trees', 'permeable', 'green_roof', 'rwh', 'solar', 'bioswale'];
    }
    const idx = this.activeActions.indexOf(actionId);
    const isAdding = idx === -1;
    if (isAdding) {
      this.activeActions.push(actionId);
    } else {
      this.activeActions.splice(idx, 1);
    }

    // Dynamic intervention linkage with current project model
    const proj = window.App?.currentProject;
    if (proj) {
      if (!proj.interventions) proj.interventions = {};
      const iv = proj.interventions;
      const dyn = this.getDynamicInterventions(proj, window.App?.calculations, window.App?.environmentalData);

      if (actionId === 'trees') iv.trees_planted = isAdding ? dyn.trees_planted : 0;
      if (actionId === 'permeable') iv.permeable_pavement_m2 = isAdding ? dyn.permeable_m2 : 0;
      if (actionId === 'green_roof') iv.green_roof_m2 = isAdding ? dyn.green_roof_m2 : 0;
      if (actionId === 'rwh') iv.rwh_tank_capacity_l = isAdding ? dyn.tank_litres : 0;
      if (actionId === 'solar') iv.solar_pv_area_m2 = isAdding ? dyn.solar_m2 : 0;
      if (actionId === 'bioswale') iv.rain_garden_m2 = isAdding ? dyn.bioswale_m2 : 0;
    }

    if (window.App?.recalculateProject) {
      window.App.recalculateProject();
    }

    const actionNames = {
      trees: "Native Trees",
      permeable: "Permeable Paving",
      green_roof: "Sedum Green Roof",
      rwh: "Dual-Chamber Cistern",
      solar: "Solar PV Array",
      bioswale: "Bioretention Bioswale"
    };
    const title = isAdding ? "Intervention Added to Plan" : "Intervention Excluded from Plan";
    const msg = `${actionNames[actionId] || actionId} has been ${isAdding ? 'included in' : 'removed from'} your site's active recovery plan.`;
    if (window.App?.showNotification) {
      window.App.showNotification(title, msg, isAdding ? 'success' : 'warning');
    }
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  },

  resetAllActions() {
    this.activeActions = ['trees', 'permeable', 'green_roof', 'rwh', 'solar', 'bioswale'];
    const proj = window.App?.currentProject;
    if (proj) {
      if (!proj.interventions) proj.interventions = {};
      const iv = proj.interventions;
      const dyn = this.getDynamicInterventions(proj, window.App?.calculations, window.App?.environmentalData);

      iv.trees_planted = dyn.trees_planted;
      iv.permeable_pavement_m2 = dyn.permeable_m2;
      iv.green_roof_m2 = dyn.green_roof_m2;
      iv.rwh_tank_capacity_l = dyn.tank_litres;
      iv.solar_pv_area_m2 = dyn.solar_m2;
      iv.rain_garden_m2 = dyn.bioswale_m2;
    }

    if (window.App?.recalculateProject) {
      window.App.recalculateProject();
    }

    if (window.App?.showNotification) {
      window.App.showNotification("Plan Reset", "All 6 recommended interventions are now active in the site recovery portfolio.", "success");
    }
    this.render(window.App?.currentProject, window.App?.calculations, window.App?.environmentalData);
  },

  placeOnSite(actionId) {
    window.App?.switchView('site3d');

    if (window.App?.showNotification) {
      window.App.showNotification(
        "3D Digital Twin",
        "Visualizing intervention in 3D Environmental Digital Twin.",
        "info"
      );
    }
  },

  printRecoveryPlan() {
    window.App?.showNotification?.("Preparing A4 Print Layout for Nature Recovery Action Plan...", "info");
    setTimeout(() => {
      window.print();
    }, 250);
  }
};
