/**
 * EcoBuild Smart - Water Demand & Rainwater Harvesting (RWH) Calculation Engine
 * Formulations based on:
 * - Central Ground Water Board (CGWB) Guide on Rainwater Harvesting
 * - CPHEEO Manual on Water Supply and Treatment (2019)
 * - Bureau of Indian Standards IS 1172 & IS 15797 (Roof Top RWH)
 */

(function(root) {
  'use strict';

  root.WaterCalculator = {
    /**
     * Calculate occupant water demand based on building type and population
     */
    calculateWaterDemand(buildingType, occupants, userLpcdOverride = null) {
      const bType = (buildingType || "residential").toLowerCase();
      const cfgStandards = (typeof window !== 'undefined' && window.ECO_CONFIG?.WATER_STANDARDS_LPCD) ? window.ECO_CONFIG.WATER_STANDARDS_LPCD : {};
      const standardLpcd = cfgStandards[bType] || 135;
      
      const occ = (occupants !== null && occupants !== undefined && !isNaN(Number(occupants))) ? Math.max(0, Number(occupants)) : 0;
      const lpcd = (userLpcdOverride !== null && userLpcdOverride !== undefined && Number(userLpcdOverride) > 0) 
        ? Number(userLpcdOverride) 
        : standardLpcd;

      const dailyDemandLitres = occ * lpcd;
      const annualDemandLitres = dailyDemandLitres * 365;

      // Non-potable fraction (toilet flushing, landscape irrigation, HVAC cooling)
      const nonPotableRatio = (typeof window !== 'undefined' && window.ECO_CONFIG?.RWH_CONSTANTS?.daily_non_potable_ratio) || 0.40;
      const dailyNonPotableLitres = Math.round(dailyDemandLitres * nonPotableRatio);
      const annualNonPotableLitres = Math.round(annualDemandLitres * nonPotableRatio);

      return {
        occupants: occ,
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
      const roof = Math.max(0, Number(roofAreaM2) || 0);
      const annualRainfallMm = Number(rainfallData?.annual_rainfall_mm) || 1042.8;
      const monthlyRainfall = rainfallData?.monthly_rainfall_mm || [
        1.2, 0.8, 4.5, 18.2, 38.6, 215.4, 382.1, 241.6, 118.3, 36.4, 15.2, 2.5
      ];

      const runoffCoeff = 0.85; // Standard RCC/pitched roof
      const filterEff = 0.85;   // First-flush and dual filtration efficiency
      const effectiveFactor = runoffCoeff * filterEff; // ~0.7225

      // Annual Harvestable Water (Litres) = Area (m²) * Rainfall (mm) * Effective Factor
      const annualPotentialLitres = Math.round(roof * annualRainfallMm * effectiveFactor);
      const annualPotentialM3 = Math.round(annualPotentialLitres / 1000);

      // Monthly harvest distribution
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyHarvestLitres = monthlyRainfall.map((rainMm, idx) => {
        const harvestL = Math.round(roof * rainMm * effectiveFactor);
        return {
          month: monthNames[idx],
          rainfall_mm: rainMm,
          harvest_litres: harvestL,
          harvest_m3: Math.round(harvestL / 1000)
        };
      });

      // Storage Tank Sizing:
      const dailyNonPotableL = Math.max(0, (Number(dailyDemandLitres) || 0) * 0.40);
      const drySpellDays = 45;
      const demandBasedSizeL = Math.round(dailyNonPotableL * drySpellDays);

      const peakMonthlyHarvest = monthlyHarvestLitres.length > 0 ? Math.max(...monthlyHarvestLitres.map(m => m.harvest_litres)) : 0;
      const captureBasedSizeL = Math.round(peakMonthlyHarvest * 0.25);

      const recommendedMinStorageL = Math.round(Math.min(demandBasedSizeL, captureBasedSizeL) * 0.8 / 1000) * 1000;
      const recommendedMaxStorageL = Math.round(Math.max(demandBasedSizeL, captureBasedSizeL) * 1.2 / 1000) * 1000;
      const recommendedOptimumStorageL = Math.round((recommendedMinStorageL + recommendedMaxStorageL) / 2 / 1000) * 1000;

      const annualDemand = (Number(dailyDemandLitres) || 0) * 365;
      const demandOffsetPct = annualDemand > 0
        ? Math.min(100, Math.round((annualPotentialLitres / annualDemand) * 1000) / 10)
        : 0;

      const simulation = this.simulateDailyMassBalance(roof, rainfallData, occupants, dailyDemandLitres, recommendedOptimumStorageL);

      return {
        formula: "V = P × A × C × η",
        parameters: {
          catchment_roof_area_m2: roof,
          annual_rainfall_mm: annualRainfallMm,
          runoff_coefficient_C: runoffCoeff,
          filter_efficiency_eta: filterEff
        },
        annual_potential_litres: annualPotentialLitres,
        annual_harvest_litres: annualPotentialLitres,
        annual_demand_litres: annualDemand,
        annual_potential_m3: annualPotentialM3,
        monthly_harvest: monthlyHarvestLitres,
        recommended_storage_range_litres: {
          min: recommendedMinStorageL,
          max: recommendedMaxStorageL,
          optimum: recommendedOptimumStorageL
        },
        demand_offset_percentage: demandOffsetPct,
        daily_simulation: simulation,
        explanation: `Roof area: ${roof.toLocaleString()} m², Annual rainfall: ${annualRainfallMm.toFixed(1)} mm. At C=${runoffCoeff} and filter efficiency=${filterEff}, estimated annual harvestable water is ${annualPotentialLitres.toLocaleString()} Litres (~${annualPotentialM3} m³).`
      };
    },

    /**
     * 365-Day Daily Mass-Balance Simulation for Rainwater Harvesting
     */
    simulateDailyMassBalance(roofAreaM2, rainfallData, occupants, dailyDemandLitres, tankCapacityL = 45000) {
      const roof = Math.max(0, Number(roofAreaM2) || 0);
      const monthlyRainfall = rainfallData?.monthly_rainfall_mm || [
        1.2, 0.8, 4.5, 18.2, 38.6, 215.4, 382.1, 241.6, 118.3, 36.4, 15.2, 2.5
      ];
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const rainDaysPerMonth = [1, 1, 1, 2, 4, 14, 23, 20, 12, 4, 2, 1];

      const effFactor = 0.85 * 0.85; // 0.7225
      const dailyNonPotableL = Math.max(0, Math.round((Number(dailyDemandLitres) || 0) * 0.45));
      const capacityL = Math.max(1000, Number(tankCapacityL) || 45000);

      let currentStorageL = Math.round(capacityL * 0.15);
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
          const dayInflowL = Math.round(roof * dayRainMm * effFactor);

          totalInflowL += dayInflowL;
          monthInflow += dayInflowL;

          let potentialStorage = currentStorageL + dayInflowL;
          if (potentialStorage > capacityL) {
            const overflow = potentialStorage - capacityL;
            totalOverflowL += overflow;
            monthOverflow += overflow;
            potentialStorage = capacityL;
          }

          if (dailyNonPotableL > 0) {
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
          } else {
            currentStorageL = potentialStorage;
          }
        }

        monthlySummary.push({
          month_idx: m,
          inflow_m3: Math.round(monthInflow / 1000),
          supplied_m3: Math.round(monthSupplied / 1000),
          overflow_m3: Math.round(monthOverflow / 1000)
        });
      }

      const reliabilityPct = dailyNonPotableL > 0 ? Math.round((fullyMetDays / 365) * 1000) / 10 : 100;

      return {
        annual_harvest_reliability_pct: reliabilityPct,
        days_demand_fully_met: fullyMetDays,
        max_continuous_dry_buffer_days: maxDryBufferDays,
        annual_inflow_m3: Math.round(totalInflowL / 1000),
        annual_supplied_m3: Math.round(totalSuppliedL / 1000),
        annual_overflow_m3: Math.round(totalOverflowL / 1000),
        annual_deficit_m3: Math.round(totalDeficitL / 1000),
        monthly_summary: monthlySummary
      };
    },

    /**
     * Alias for simulateDailyMassBalance for cross-module compatibility
     */
    simulate365DayRWH(roofAreaM2, rainfallData, occupants, dailyDemandLitres, tankCapacityL = 45000) {
      return this.simulateDailyMassBalance(roofAreaM2, rainfallData, occupants, dailyDemandLitres, tankCapacityL);
    },

    /**
     * Statutory Water Balance & Sewage Treatment Plant (STP) Sizing
     * Conforming to CPHEEO 2019, NBC 2016 Part 11, and MoEFCC Form 1A Guidelines
     */
    calculateSTPAndWaterBalance(project, waterDemand, openGreenAreaM2 = 0) {
      const occRaw = project?.water?.occupants;
      const occupants = (occRaw !== null && occRaw !== undefined && !isNaN(Number(occRaw))) ? Math.max(0, Number(occRaw)) : 0;
      const lpcd = waterDemand?.lpcd || 135;

      const totalFreshDomesticL = occupants * lpcd;
      const flushingL = Math.round(occupants * (lpcd <= 45 ? 15 : 45));
      const greenArea = Math.max(0, Number(openGreenAreaM2) || 0);
      const landscapeL = Math.round(greenArea * 3.5); // 3.5 L/m2/day irrigation norm
      const totalNonPotableL = flushingL + landscapeL;

      // Sewage generation = 80% of domestic fresh intake (CPHEEO norm)
      const sewageDailyL = Math.round(totalFreshDomesticL * 0.80);
      const sewageDailyKLD = Math.round((sewageDailyL / 1000) * 10) / 10;

      // STP design capacity with 20% surge reserve (minimum 5 KLD if project has occupants)
      const stpDesignCapacityKLD = occupants > 0 ? Math.max(5, Math.ceil(sewageDailyKLD * 1.20)) : 0;

      // Tertiary recovery rate: 90% via SBR / MBBR + ultrafiltration
      const treatedEffluentDailyL = Math.round(sewageDailyL * 0.90);
      const treatedEffluentKLD = Math.round((treatedEffluentDailyL / 1000) * 10) / 10;

      // Recycled utilization hierarchy: Flushing first, then landscaping
      const recycledForFlushingL = Math.min(flushingL, treatedEffluentDailyL);
      const remainingTreatedL = Math.max(0, treatedEffluentDailyL - recycledForFlushingL);
      const recycledForLandscapeL = Math.min(landscapeL, remainingTreatedL);
      const totalRecycledDailyL = recycledForFlushingL + recycledForLandscapeL;
      const totalRecycledKLD = Math.round((totalRecycledDailyL / 1000) * 10) / 10;

      // Net fresh water demand after recycling
      const netFreshDemandDailyL = Math.max(0, totalFreshDomesticL - recycledForFlushingL);
      const totalWaterDemandL = totalFreshDomesticL + landscapeL;
      const freshWaterSavingsPct = totalWaterDemandL > 0 
        ? Math.round((totalRecycledDailyL / totalWaterDemandL) * 100) 
        : 0;

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

})(typeof window !== 'undefined' ? window : globalThis);
