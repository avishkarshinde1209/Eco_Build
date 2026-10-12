/**
 * EcoBuild Smart - Solar Photovoltaic (PV) Potential Engine
 * Formulations based on:
 * - MNRE (Ministry of New and Renewable Energy, India) Rooftop Solar Guidelines
 * - National Renewable Energy Laboratory (NREL) PVWatts Model
 * - Central Electricity Authority (CEA India) CO₂ Baseline Database Version 20
 * 
 * Formula:
 *   E_annual (kWh) = Capacity (kWp) × Daily Peak Sun Hours × 365 × Performance Ratio (PR)
 *   Capacity (kWp) = Area (m²) × Specific Power (0.18 kWp/m²)
 *   CO₂ Avoided (kg CO₂e) = E_annual (kWh) × Grid Emission Factor (0.82 kg CO₂e/kWh)
 */

(function(root) {
  'use strict';

  root.EnergyCalculator = {
    calculateSolarPotential(roofAreaM2, solarData, annualElectricityDemandKwh, userSolarAreaM2 = null, greenRoofAreaM2 = 0) {
      const roof = Math.max(0, Number(roofAreaM2) || 0);
      const greenRoof = Math.max(0, Number(greenRoofAreaM2) || 0);
      const dailySunHours = Number(solarData?.daily_peak_sun_hours) || 5.3;
      const annualGHI = Number(solarData?.annual_solar_radiation_kwh_m2) || 1850;
      const gridFactor = (typeof window !== 'undefined' && window.ECO_CONFIG?.CARBON_FACTORS?.grid_emission_factor_kg_per_kwh) || 0.82;

      // Usable roof area
      const maxUsableRoof = Math.max(0, roof - greenRoof);

      // Explicit zero handling: userSolarAreaM2 can legitimately be 0
      let solarAreaM2 = 0;
      if (userSolarAreaM2 !== null && userSolarAreaM2 !== undefined && !isNaN(Number(userSolarAreaM2))) {
        solarAreaM2 = Math.min(roof, Math.max(0, Number(userSolarAreaM2)));
      } else {
        // Default screening assumption: 35% of max usable roof
        solarAreaM2 = Math.round(maxUsableRoof * 0.35);
      }

      // Installed capacity: ~180 Wp / m² (0.18 kWp/m²) for standard monocrystalline modules
      const specificKwp = (typeof window !== 'undefined' && window.ECO_CONFIG?.SOLAR_CONSTANTS?.kwp_per_m2) || 0.18;
      const installedCapacityKWp = Math.round((solarAreaM2 * specificKwp) * 10) / 10;

      // Performance Ratio (PR): Accounts for inverter losses, DC/AC cabling, dust accumulation, thermal derating (~0.75)
      const performanceRatio = (typeof window !== 'undefined' && window.ECO_CONFIG?.SOLAR_CONSTANTS?.performance_ratio) || 0.75;

      // Annual generation:
      // E (kWh) = Capacity (kWp) * Daily Peak Sun Hours * 365 * PR
      const annualGenerationKwh = Math.round(installedCapacityKWp * dailySunHours * 365 * performanceRatio);

      // Annual electricity demand comparison
      let annualDemand = 0;
      if (annualElectricityDemandKwh !== null && annualElectricityDemandKwh !== undefined && !isNaN(Number(annualElectricityDemandKwh))) {
        annualDemand = Math.max(0, Number(annualElectricityDemandKwh));
      } else {
        annualDemand = Math.round(roof * 25); // screening assumption: 25 kWh/m2
      }

      const demandOffsetPct = annualDemand > 0
        ? Math.min(100, Math.round((annualGenerationKwh / annualDemand) * 1000) / 10)
        : (annualGenerationKwh > 0 ? 100 : 0);

      // Carbon emissions avoided via displaced grid electricity:
      const annualCarbonOffsetKg = Math.round(annualGenerationKwh * gridFactor);
      const annualCarbonOffsetTonnes = Math.round((annualCarbonOffsetKg / 1000) * 10) / 10;

      return {
        roof_total_m2: roof,
        solar_allocated_area_m2: solarAreaM2,
        solar_coverage_of_roof_pct: roof > 0 ? Math.round((solarAreaM2 / roof) * 100) : 0,
        daily_peak_sun_hours: dailySunHours,
        annual_ghi_kwh_m2: annualGHI,
        panel_efficiency_pct: 20.5,
        system_performance_ratio: performanceRatio,
        installed_capacity_kwp: installedCapacityKWp,
        
        // Canonical shared fields:
        annual_generation_kwh: annualGenerationKwh,
        annual_solar_generation_kwh: annualGenerationKwh, // Canonical alias for carbon calculator
        annual_demand_kwh: annualDemand,
        demand_offset_percentage: demandOffsetPct,
        annual_co2_offset_kg: annualCarbonOffsetKg,
        annual_co2_offset_tonnes: annualCarbonOffsetTonnes,
        annual_co2_saved_tonnes: annualCarbonOffsetTonnes, // Canonical alias for recovery calculator
        grid_emission_factor_kg_per_kwh: gridFactor,

        formula: "E_annual (kWh) = Capacity (kWp) × Peak Sun Hours × 365 × Performance Ratio (0.75)",
        source_reference: "MNRE India Grid-Connected Rooftop Solar Benchmarks & CEA Baseline Database v20",
        disclaimer: "Solar yield figures are engineering estimates based on global horizontal irradiance, latitude, and 75% performance ratio. Output varies with shading, tilt, azimuth, and maintenance."
      };
    }
  };

})(typeof window !== 'undefined' ? window : globalThis);
