/**
 * EcoBuild Smart - Inter-Parameter Correlation & Auto-Calculation Engine
 * Dynamically correlates dependent architectural and environmental parameters:
 * - Plot Area -> Permissible Footprint, Open Area
 * - Footprint & Floors -> Gross Floor Area, Roof Area
 * - Building Typology & GFA -> NBC Occupancy & LPCD Water Demand
 * - Open Area -> Surface Allocations & Tree Density
 * - Roof Area -> Solar PV Array & Green Roof Capacities
 */

window.CorrelationEngine = {
  // Typical ground coverage ratios by typology (National Building Code NBC 2016)
  GROUND_COVERAGE_RATIOS: {
    institutional: 0.44, // ~44% ground coverage for university/college campus
    residential: 0.35,   // ~35% ground coverage
    commercial: 0.40,    // ~40% ground coverage
    educational: 0.40,   // ~40% ground coverage
    industrial: 0.50,    // ~50% ground coverage
    mixed: 0.42,         // ~42% ground coverage
    other: 0.40
  },

  // Gross floor area occupant density (m² per person under NBC 2016 Part 4)
  OCCUPANT_DENSITY_M2_PER_PERSON: {
    residential: 30,     // ~1 person per 30 m² gross residential area
    commercial: 12,      // ~1 person per 12 m² office area
    educational: 8,      // ~1 person per 8 m² classroom/campus area
    institutional: 25,   // ~1 person per 25 m² institutional area (mixed labs/halls)
    industrial: 40,      // ~1 person per 40 m² factory floor
    mixed: 20,
    other: 25
  },

  /**
   * Correlates and updates dependent parameters when Plot Area changes
   */
  onPlotAreaChange(plotArea, project, autoCorrelate = true) {
    if (!plotArea || plotArea <= 0) return project;
    project.site.plot_area = plotArea;

    if (autoCorrelate) {
      const bType = (project.building_type || "institutional").toLowerCase();
      const coverageRatio = this.GROUND_COVERAGE_RATIOS[bType] || 0.40;

      // Suggest built-up footprint if not locked or if default
      project.site.built_up_area = Math.round(plotArea * coverageRatio);
      project.site.roof_area = project.site.built_up_area; // Standard flat roof
      project.site.open_area = Math.max(0, plotArea - project.site.built_up_area);

      // Re-correlate gross floor area and occupancy
      this.onBuiltUpOrFloorsChange(project, autoCorrelate);

      // Re-correlate surfaces
      this.autoBalanceSurfaces(project);
    }
    return project;
  },

  /**
   * Correlates Gross Floor Area, Roof Area, Occupancy, and Water when Built-up or Floors change
   */
  onBuiltUpOrFloorsChange(project, autoCorrelate = true) {
    const builtUp = project.site.built_up_area || 0;
    const floors = project.site.floors || 1;
    const grossFloorArea = builtUp * floors;

    project.site.total_floor_area = grossFloorArea;
    project.site.open_area = Math.max(0, (project.site.plot_area || 0) - builtUp);

    // Flat roof defaults to footprint area
    if (autoCorrelate) {
      project.site.roof_area = builtUp;

      // Auto-compute occupants based on NBC density
      const bType = (project.building_type || "institutional").toLowerCase();
      const density = this.OCCUPANT_DENSITY_M2_PER_PERSON[bType] || 25;
      project.water.occupants = Math.max(1, Math.round(grossFloorArea / density));

      // Auto-compute water demand
      const lpcd = window.ECO_CONFIG.WATER_STANDARDS_LPCD[bType] || 70;
      project.water.daily_consumption_lpcd = lpcd;

      // Auto-estimate rooftop solar and green roof allocations (35% each)
      this.autoEstimateSolarAndGreenRoof(project);

      // Auto-estimate construction waste & solid waste using TIFAC / CPCB / CPHEEO datasets
      this.autoCalculateWaste(project);
    }
    return project;
  },

  /**
   * Correlates parameters when Building Type changes
   */
  onBuildingTypeChange(newType, project, autoCorrelate = true) {
    project.building_type = newType;
    if (autoCorrelate) {
      const bType = newType.toLowerCase();
      // Update LPCD standard
      const standardLpcd = window.ECO_CONFIG.WATER_STANDARDS_LPCD[bType] || 70;
      project.water.daily_consumption_lpcd = standardLpcd;

      // Re-evaluate ground coverage and occupancy
      const plot = project.site.plot_area || 5000;
      const coverageRatio = this.GROUND_COVERAGE_RATIOS[bType] || 0.40;
      project.site.built_up_area = Math.round(plot * coverageRatio);
      project.site.roof_area = project.site.built_up_area;

      this.onBuiltUpOrFloorsChange(project, autoCorrelate);
    }
    return project;
  },

  /**
   * Automatically balances external surface allocations so they exactly equal open site area
   */
  autoBalanceSurfaces(project) {
    const plot = project.site.plot_area || 5000;
    const builtUp = project.site.built_up_area || 2000;
    const availableOpen = Math.max(0, plot - builtUp);

    // Balanced realistic allocation:
    // 50% Existing Green / Lawn
    // 40% Concrete / Paved access & parking
    // 5% Tiles / Pavers
    // 5% Open natural soil
    const greenArea = Math.round(availableOpen * 0.50);
    const concreteArea = Math.round(availableOpen * 0.40);
    const tilesArea = Math.round(availableOpen * 0.05);
    const soilArea = Math.max(0, availableOpen - greenArea - concreteArea - tilesArea);

    project.vegetation.existing_green_area = greenArea;
    project.surfaces.concrete_area = concreteArea;
    project.surfaces.asphalt_area = 0;
    project.surfaces.tiles_pavers = tilesArea;
    project.surfaces.soil_open_ground = soilArea;

    // Auto-estimate tree count from green area: 1 mature tree per ~30 m² green cover
    const estimatedTrees = Math.max(5, Math.round(greenArea / 30));
    project.vegetation.existing_tree_count = estimatedTrees;
    // Suggest trees removed: ~35% if footprint overlaps trees
    project.vegetation.trees_removed = Math.min(estimatedTrees, Math.round(estimatedTrees * 0.35));

    return project;
  },

  /**
   * Auto-allocates rooftop area between solar PV and green roof
   */
  autoEstimateSolarAndGreenRoof(project) {
    const roof = project.site.roof_area || 0;
    if (roof <= 0) return;

    // Recommend 35% Solar PV, 35% Green Roof, leaving 30% for HVAC / structural access
    const solarM2 = Math.round(roof * 0.35);
    const greenRoofM2 = Math.round(roof * 0.35);

    if (!project.interventions) project.interventions = {};
    project.interventions.solar_pv_area_m2 = solarM2;
    project.interventions.green_roof_m2 = greenRoofM2;

    // Recommend permeable pavement: ~45% of concrete paved area
    const concrete = project.surfaces.concrete_area || 0;
    project.interventions.permeable_pavement_m2 = Math.round(concrete * 0.45);

    // Recommend compensatory trees (3:1)
    const removed = project.vegetation.trees_removed || 0;
    project.interventions.trees_planted = Math.max(10, removed * 3);
  },

  /**
   * Auto-calculates C&D construction waste, composition breakdown, and daily municipal solid waste
   * using official empirical benchmarks from:
   * - TIFAC (Technology Information, Forecasting and Assessment Council, DST India)
   * - CPCB Guidelines on Environmental Management of C&D Wastes 2016
   * - CPHEEO Manual on Municipal Solid Waste Management
   */
  autoCalculateWaste(project) {
    if (!project) return;
    if (!project.waste) project.waste = {};

    const bType = (project.building_type || "institutional").toLowerCase();
    const gfa = (project.site.built_up_area || 0) * (project.site.floors || 1);
    const occupants = project.water?.occupants || 100;

    // 1. TIFAC / CPCB C&D generation rate in kg/m²
    const cndConfig = window.ECO_CONFIG?.C_AND_D_WASTE_FACTORS || {};
    const typeFactor = cndConfig[bType] || cndConfig.institutional || { rate_kg_m2: 55 };
    const rateKgM2 = typeFactor.rate_kg_m2;

    const totalWasteKg = gfa * rateKgM2;
    const totalWasteTonnes = Math.round((totalWasteKg / 1000) * 10) / 10; // Round to 1 decimal place

    // 2. Empirical material composition breakdown (CPCB / TIFAC 2016)
    const compConfig = window.ECO_CONFIG?.WASTE_MATERIAL_COMPOSITION || {
      soil_sand: { pct: 36, label: "Soil, Sand & Gravel" },
      concrete: { pct: 31, label: "Concrete Rubble" },
      masonry_bricks: { pct: 10, label: "Bricks & Masonry" },
      metals: { pct: 5, label: "Metals (Rebar & Steel)" },
      timber: { pct: 5, label: "Timber / Wood" },
      bitumen: { pct: 2, label: "Bitumen / Asphalt" },
      others: { pct: 11, label: "Packaging & Tiles" }
    };

    const breakdown = {};
    let recyclableTonnes = 0;
    for (const [key, item] of Object.entries(compConfig)) {
      const tonnes = Math.round((totalWasteTonnes * (item.pct / 100)) * 10) / 10;
      breakdown[key] = {
        label: item.label,
        pct: item.pct,
        tonnes: tonnes,
        recyclable: item.recyclable !== false,
        reuse: item.reuse || ""
      };
      if (item.recyclable !== false) {
        recyclableTonnes += tonnes;
      }
    }

    // 3. Recommended diversion target: 65% under CPCB C&D Rules 2016
    const recyclingPct = project.waste.recycling_pct !== undefined ? project.waste.recycling_pct : 65;

    // 4. Daily Municipal Solid Waste (CPHEEO Norms)
    const mswConfig = window.ECO_CONFIG?.SOLID_WASTE_FACTORS || {};
    const mswFactor = mswConfig[bType] || { kg_per_capita_day: 0.30, organic_fraction: 0.45 };
    const dailyMswKg = Math.round(occupants * mswFactor.kg_per_capita_day * 10) / 10;
    const dailyOrganicKg = Math.round(dailyMswKg * mswFactor.organic_fraction * 10) / 10;

    // Set updated values into project.waste
    project.waste.construction_waste_tonnes = totalWasteTonnes;
    project.waste.recycling_pct = recyclingPct;
    project.waste.daily_solid_waste_kg = dailyMswKg;
    project.waste.daily_organic_waste_kg = dailyOrganicKg;
    project.waste.rate_kg_m2 = rateKgM2;
    project.waste.material_breakdown = breakdown;
    project.waste.recyclable_tonnes = Math.round(recyclableTonnes * 10) / 10;
    project.waste.dataset_citation = "TIFAC / CPCB (2016) & CPHEEO Empirical Datasets";
    project.waste.auto_calculated = true;

    return project.waste;
  }
};

