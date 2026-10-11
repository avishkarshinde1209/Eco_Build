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
      daily_simulation: this.simulateDailyMassBalance(roofAreaM2, rainfallData, occupants, dailyDemandLitres, recommendedOptimumStorageL),
      explanation: `Your roof area is ${roofAreaM2.toLocaleString()} m² and the selected site receives ${annualRainfallMm.toFixed(1)} mm annual rainfall. Using a runoff coefficient of ${runoffCoeff} and filter efficiency of ${filterEff}, the estimated annual collection potential is approximately ${annualPotentialLitres.toLocaleString()} litres.`
    };
  },

  /**
   * 365-Day Daily Mass-Balance Simulation for Rainwater Harvesting
   * Tracks daily inflow, storage volume, overflow, and demand deficits over a full annual cycle
   */
  simulateDailyMassBalance(roofAreaM2, rainfallData, occupants, dailyDemandLitres, tankCapacityL = 45000) {
    const monthlyRainfall = rainfallData?.monthly_rainfall_mm || [
      1.2, 0.8, 4.5, 18.2, 38.6, 215.4, 382.1, 241.6, 118.3, 36.4, 15.2, 2.5
    ];
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const rainDaysPerMonth = [1, 1, 1, 2, 4, 14, 23, 20, 12, 4, 2, 1];
    
    const effFactor = 0.85 * 0.85; // C (0.85) * eta (0.85) = 0.7225
    const dailyNonPotableL = Math.max(500, Math.round(dailyDemandLitres * 0.45)); // Non-potable flushing & irrigation
    const capacityL = Math.max(5000, tankCapacityL || 45000);

    let currentStorageL = Math.round(capacityL * 0.15); // Start with 15% initial monsoon priming
    let totalInflowL = 0;
    let totalSuppliedL = 0;
    let totalOverflowL = 0;
    let totalDeficitL = 0;
    let fullyMetDays = 0;
    let maxDryBufferDays = 0;
    let currentDryBuffer = 0;

    const monthlySummary = [];

    for (let m = 0; m < 12; m++) {
      const monthRain = monthlyRainfall[m] || 0;
      const numDays = daysInMonth[m];
      const rDays = Math.min(numDays, rainDaysPerMonth[m]);
      const rainPerRainyDay = rDays > 0 ? monthRain / rDays : 0;
      const rainyInterval = Math.max(1, Math.floor(numDays / Math.max(1, rDays)));

      let monthInflow = 0;
      let monthSupplied = 0;
      let monthOverflow = 0;

      for (let d = 1; d <= numDays; d++) {
        const isRainy = (d % rainyInterval === 0 && d <= rDays * rainyInterval);
        const dayRainMm = isRainy ? rainPerRainyDay : 0;
        const dayInflowL = Math.round(roofAreaM2 * dayRainMm * effFactor);

        totalInflowL += dayInflowL;
        monthInflow += dayInflowL;

        // Inflow into tank
        let potentialStorage = currentStorageL + dayInflowL;
        if (potentialStorage > capacityL) {
          const overflow = potentialStorage - capacityL;
          totalOverflowL += overflow;
          monthOverflow += overflow;
          potentialStorage = capacityL;
        }

        // Supply demand
        if (potentialStorage >= dailyNonPotableL) {
          currentStorageL = potentialStorage - dailyNonPotableL;
          totalSuppliedL += dailyNonPotableL;
          monthSupplied += dailyNonPotableL;
          fullyMetDays++;
          currentDryBuffer++;
          if (currentDryBuffer > maxDryBufferDays) maxDryBufferDays = currentDryBuffer;
        } else {
          totalSuppliedL += potentialStorage;
          monthSupplied += potentialStorage;
          totalDeficitL += (dailyNonPotableL - potentialStorage);
          currentStorageL = 0;
          currentDryBuffer = 0;
        }
      }

      monthlySummary.push({
        month_idx: m,
        inflow_m3: Math.round(monthInflow / 1000),
        supplied_m3: Math.round(monthSupplied / 1000),
        overflow_m3: Math.round(monthOverflow / 1000)
      });
    }

    const reliabilityPct = Math.round((fullyMetDays / 365) * 1000) / 10;

    // Evaluate Tank Capacity Sizing Optimization Curve
    const testCapacities = [10000, 25000, 45000, 65000, 90000, 120000];
    const sizingCurve = testCapacities.map(capL => {
      let tempStorage = Math.round(capL * 0.15);
      let met = 0;
      let oflow = 0;

      for (let m = 0; m < 12; m++) {
        const mRain = monthlyRainfall[m] || 0;
        const nDays = daysInMonth[m];
        const rDays = rainDaysPerMonth[m];
        const rPerDay = rDays > 0 ? mRain / rDays : 0;
        const rInterval = Math.max(1, Math.floor(nDays / Math.max(1, rDays)));

        for (let d = 1; d <= nDays; d++) {
          const isR = (d % rInterval === 0 && d <= rDays * rInterval);
          const inL = Math.round(roofAreaM2 * (isR ? rPerDay : 0) * effFactor);
          let pStorage = tempStorage + inL;
          if (pStorage > capL) {
            oflow += (pStorage - capL);
            pStorage = capL;
          }
          if (pStorage >= dailyNonPotableL) {
            tempStorage = pStorage - dailyNonPotableL;
            met++;
          } else {
            tempStorage = 0;
          }
        }
      }

      return {
        capacity_kL: Math.round(capL / 1000),
        reliability_pct: Math.round((met / 365) * 1000) / 10,
        overflow_m3: Math.round(oflow / 1000)
      };
    });

    return {
      simulation_period_days: 365,
      tank_capacity_litres: capacityL,
      tank_capacity_kL: Math.round(capacityL / 1000),
      daily_non_potable_demand_litres: dailyNonPotableL,
      days_fully_supplied: fullyMetDays,
      days_deficit: 365 - fullyMetDays,
      reliability_percentage: reliabilityPct,
      max_continuous_dry_buffer_days: maxDryBufferDays,
      annual_inflow_m3: Math.round(totalInflowL / 1000),
      annual_supplied_m3: Math.round(totalSuppliedL / 1000),
      annual_overflow_m3: Math.round(totalOverflowL / 1000),
      annual_deficit_m3: Math.round(totalDeficitL / 1000),
      monthly_summary: monthlySummary,
      sizing_optimization_curve: sizingCurve
    };
  },

  /**
   * Statutory Water Balance & Sewage Treatment Plant (STP) Sizing
   * Conforming to CPHEEO 2019, NBC 2016 Part 11, and MoEFCC Form 1A Guidelines
   */
  calculateSTPAndWaterBalance(project, waterDemand, openGreenAreaM2 = 0) {
    const occupants = project?.water?.occupants || 100;
    const lpcd = waterDemand?.lpcd || 135;
    const totalFreshDomesticL = occupants * lpcd;
    const flushingL = Math.round(occupants * (lpcd <= 45 ? 15 : 45));
    const greenArea = openGreenAreaM2 > 0 ? openGreenAreaM2 : Math.max(100, (project?.site?.plot_area || 5000) * 0.15);
    const landscapeL = Math.round(greenArea * 3.5); // 3.5 L/m2/day CPWD norm
    const totalNonPotableL = flushingL + landscapeL;

    // Sewage generation = 80% of domestic fresh intake (CPHEEO norm)
    const sewageDailyL = Math.round(totalFreshDomesticL * 0.80);
    const sewageDailyKLD = Math.round((sewageDailyL / 1000) * 10) / 10;
    
    // SBR / MBBR STP Design Capacity with 20% hydraulic surge reserve
    const stpDesignCapacityKLD = Math.max(5, Math.ceil(sewageDailyKLD * 1.20));
    
    // Tertiary recovery rate (90% through ultrafiltration + UV/chlorination)
    const treatedEffluentDailyL = Math.round(sewageDailyL * 0.90);
    const treatedEffluentKLD = Math.round((treatedEffluentDailyL / 1000) * 10) / 10;

    // Recycled utilization hierarchy: Flushing first, then landscaping
    const recycledForFlushingL = Math.min(flushingL, treatedEffluentDailyL);
    const remainingTreatedL = Math.max(0, treatedEffluentDailyL - recycledForFlushingL);
    const recycledForLandscapeL = Math.min(landscapeL, remainingTreatedL);
    const totalRecycledDailyL = recycledForFlushingL + recycledForLandscapeL;
    const totalRecycledKLD = Math.round((totalRecycledDailyL / 1000) * 10) / 10;

    // Net fresh water demand after recycling
    const netFreshDemandDailyL = totalFreshDomesticL - recycledForFlushingL;
    const freshWaterSavingsPct = Math.round((totalRecycledDailyL / (totalFreshDomesticL + landscapeL)) * 100);

    // ZLD (Zero Liquid Discharge) Status
    const surplusDischargeL = Math.max(0, treatedEffluentDailyL - totalRecycledDailyL);
    const isZLD = surplusDischargeL <= 500;

    return {
      occupants,
      lpcd,
      total_domestic_fresh_demand_kld: Math.round((totalFreshDomesticL / 1000) * 10) / 10,
      total_domestic_fresh_demand_l: totalFreshDomesticL,
      flushing_demand_kld: Math.round((flushingL / 1000) * 10) / 10,
      landscape_demand_kld: Math.round((landscapeL / 1000) * 10) / 10,
      total_non_potable_demand_kld: Math.round((totalNonPotableL / 1000) * 10) / 10,
      sewage_generation_kld: sewageDailyKLD,
      sewage_generation_l: sewageDailyL,
      stp_technology: "Sequential Batch Reactor (SBR) / Moving Bed Biofilm Reactor (MBBR)",
      stp_design_capacity_kld: stpDesignCapacityKLD,
      treated_effluent_kld: treatedEffluentKLD,
      recycled_flushing_kld: Math.round((recycledForFlushingL / 1000) * 10) / 10,
      recycled_landscape_kld: Math.round((recycledForLandscapeL / 1000) * 10) / 10,
      total_recycled_kld: totalRecycledKLD,
      surplus_discharge_kld: Math.round((surplusDischargeL / 1000) * 10) / 10,
      is_zld_compliant: isZLD,
      fresh_water_savings_pct: freshWaterSavingsPct,
      net_fresh_demand_kld: Math.round((netFreshDemandDailyL / 1000) * 10) / 10,
      treated_water_standards: {
        pH: "6.5 - 8.5",
        BOD_mg_l: "< 10 (NGT / CPCB Norm)",
        COD_mg_l: "< 50",
        TSS_mg_l: "< 10",
        oil_grease_mg_l: "< 2"
      }
    };
  }
};
