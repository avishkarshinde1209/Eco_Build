/**
 * EcoBuild Smart - Water Demand & Rainwater Harvesting (RWH) Calculation Engine
 * Formulations based on:
 * - Central Ground Water Board (CGWB) Guide on Rainwater Harvesting
 * - CPHEEO Manual on Water Supply and Treatment
 * - Bureau of Indian Standards IS 1172 & IS 15797 (Roof Top RWH)
 */

window.WaterCalculator = {
  /**
   * Calculate occupant water demand based on building type and population
   */
  calculateWaterDemand(buildingType, occupants, userLpcdOverride = null) {
    const bType = (buildingType || "residential").toLowerCase();
    const standardLpcd = window.ECO_CONFIG.WATER_STANDARDS_LPCD[bType] || 135;
    const lpcd = userLpcdOverride > 0 ? userLpcdOverride : standardLpcd;

    const dailyDemandLitres = occupants * lpcd;
    const annualDemandLitres = dailyDemandLitres * 365;

    // Non-potable fraction (toilet flushing, landscape irrigation, cooling)
    const nonPotableRatio = window.ECO_CONFIG.RWH_CONSTANTS.daily_non_potable_ratio;
    const dailyNonPotableLitres = Math.round(dailyDemandLitres * nonPotableRatio);
    const annualNonPotableLitres = Math.round(annualDemandLitres * nonPotableRatio);

    return {
      occupants: occupants,
      lpcd: lpcd,
      daily_demand_litres: dailyDemandLitres,
      annual_demand_litres: annualDemandLitres,
      annual_demand_m3: Math.round(annualDemandLitres / 1000),
      daily_non_potable_litres: dailyNonPotableLitres,
      annual_non_potable_litres: annualNonPotableLitres,
      standard_reference: `NBC 2016 / IS 1172 (${standardLpcd} LPCD for ${bType})`
    };
  },

  /**
   * Calculate Rainwater Harvesting Potential and Storage Tank Sizing
   * V = P * A * C * eta
   */
  calculateRWH(roofAreaM2, rainfallData, occupants, dailyDemandLitres) {
    const annualRainfallMm = rainfallData?.annual_rainfall_mm || 1042.8;
    const monthlyRainfall = rainfallData?.monthly_rainfall_mm || [
      1.2, 0.8, 4.5, 18.2, 38.6, 215.4, 382.1, 241.6, 118.3, 36.4, 15.2, 2.5
    ];

    const runoffCoeff = window.ECO_CONFIG.RUNOFF_COEFFICIENTS.standard_roof.value; // 0.85
    const filterEff = window.ECO_CONFIG.RWH_CONSTANTS.filter_efficiency;           // 0.85
    const effectiveFactor = runoffCoeff * filterEff; // ~0.7225

    // Annual Harvestable Water (Litres) = Area (m²) * Rainfall (mm) * Effective Factor
    // Note: 1 mm over 1 m² = 1 Litre
    const annualPotentialLitres = Math.round(roofAreaM2 * annualRainfallMm * effectiveFactor);
    const annualPotentialM3 = Math.round(annualPotentialLitres / 1000);

    // Monthly harvest distribution
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyHarvestLitres = monthlyRainfall.map((rainMm, idx) => {
      const harvestL = Math.round(roofAreaM2 * rainMm * effectiveFactor);
      return {
        month: monthNames[idx],
        rainfall_mm: rainMm,
        harvest_litres: harvestL,
        harvest_m3: Math.round(harvestL / 1000)
      };
    });

    // Storage Tank Sizing:
    // Method 1: Demand-based dry spell sizing (CGWB dry period method)
    // Size to meet non-potable demand during typical 30-45 day dry monsoon gap
    const drySpellDays = window.ECO_CONFIG.RWH_CONSTANTS.dry_spell_days_monsoon;
    const dailyNonPotableL = dailyDemandLitres * window.ECO_CONFIG.RWH_CONSTANTS.daily_non_potable_ratio;
    const demandBasedSizeL = Math.round(dailyNonPotableL * drySpellDays);

    // Method 2: Peak monsoon month capture capacity (~20% of peak monthly rainfall)
    const peakMonthlyHarvest = Math.max(...monthlyHarvestLitres.map(m => m.harvest_litres));
    const captureBasedSizeL = Math.round(peakMonthlyHarvest * 0.25);

    // Recommended storage range
    const recommendedMinStorageL = Math.round(Math.min(demandBasedSizeL, captureBasedSizeL) * 0.8 / 1000) * 1000;
    const recommendedMaxStorageL = Math.round(Math.max(demandBasedSizeL, captureBasedSizeL) * 1.2 / 1000) * 1000;
    const recommendedOptimumStorageL = Math.round((recommendedMinStorageL + recommendedMaxStorageL) / 2 / 1000) * 1000;

    // Offset of total water demand
    const annualDemand = dailyDemandLitres * 365;
    const demandOffsetPct = annualDemand > 0 
      ? Math.min(100, Math.round((annualPotentialLitres / annualDemand) * 1000) / 10)
      : 0;

    return {
      formula: "V = P × A × C × η",
      parameters: {
        catchment_roof_area_m2: roofAreaM2,
        annual_rainfall_mm: annualRainfallMm,
        runoff_coefficient_C: runoffCoeff,
        filter_efficiency_eta: filterEff
      },
      annual_potential_litres: annualPotentialLitres,
      annual_potential_m3: annualPotentialM3,
      monthly_harvest: monthlyHarvestLitres,
      recommended_storage_range_litres: {
        min: recommendedMinStorageL,
        max: recommendedMaxStorageL,
        optimum: recommendedOptimumStorageL
      },
      demand_offset_percentage: demandOffsetPct,
      explanation: `Your roof area is ${roofAreaM2.toLocaleString()} m² and the selected site receives ${annualRainfallMm.toFixed(1)} mm annual rainfall. Using a runoff coefficient of ${runoffCoeff} and filter efficiency of ${filterEff}, the estimated annual collection potential is approximately ${annualPotentialLitres.toLocaleString()} litres.`
    };
  }
};
