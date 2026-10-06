/**
 * EcoBuild Smart - Solar Photovoltaic (PV) Potential Engine
 * Formulations based on:
 * - MNRE (Ministry of New and Renewable Energy, India) Rooftop Solar Guidelines
 * - National Renewable Energy Laboratory (NREL) PVWatts Model
 * 
 * Formula:
 *   E_annual (kWh) = Capacity (kWp) × Daily Peak Sun Hours × 365 × Performance Ratio (PR)
 *   Capacity (kWp) = Area (m²) × Panel Efficiency (20.5%)
 */

window.EnergyCalculator = {
  calculateSolarPotential(roofAreaM2, solarData, annualElectricityDemandKwh, userSolarAreaM2 = null, greenRoofAreaM2 = 0) {
    const dailySunHours = solarData?.daily_peak_sun_hours || 5.3;
    const annualGHI = solarData?.annual_solar_radiation_kwh_m2 || 1850;

    // Available roof area for PV after accounting for setbacks and green roof
    const maxUsableRoofArea = Math.max(0, roofAreaM2 - greenRoofAreaM2);
    // Standard default solar coverage: ~30-40% of available roof
    const solarAreaM2 = userSolarAreaM2 !== null ? userSolarAreaM2 : Math.round(maxUsableRoofArea * 0.35);

    // Installed capacity: ~180-200 Wp / m² for high-efficiency monocrystalline PERC panels (~20.5% efficiency)
    const installedCapacityKWp = Math.round((solarAreaM2 * window.ECO_CONFIG.SOLAR_CONSTANTS.kwp_per_m2) * 10) / 10;

    // Performance Ratio (PR): Accounts for inverter losses, DC/AC cabling, dust accumulation, thermal derating (~0.75)
    const performanceRatio = window.ECO_CONFIG.SOLAR_CONSTANTS.performance_ratio;

    // Annual generation:
    // E (kWh) = Capacity (kWp) * Daily Peak Sun Hours * 365 * PR
    const annualGenerationKwh = Math.round(installedCapacityKWp * dailySunHours * 365 * performanceRatio);

    // Electricity offset percentage
    const annualDemand = annualElectricityDemandKwh || (roofAreaM2 * 25); // ~25 kWh/m2 baseline if unstated
    const demandOffsetPct = annualDemand > 0 
      ? Math.min(100, Math.round((annualGenerationKwh / annualDemand) * 1000) / 10)
      : 0;

    // Carbon emissions offset
    const annualCarbonOffsetKg = Math.round(annualGenerationKwh * window.ECO_CONFIG.CARBON_FACTORS.grid_emission_factor_kg_per_kwh);
    const annualCarbonOffsetTonnes = Math.round((annualCarbonOffsetKg / 1000) * 10) / 10;

    return {
      roof_total_m2: roofAreaM2,
      solar_allocated_area_m2: solarAreaM2,
      solar_coverage_of_roof_pct: roofAreaM2 > 0 ? Math.round((solarAreaM2 / roofAreaM2) * 100) : 0,
      daily_peak_sun_hours: dailySunHours,
      panel_efficiency_pct: Math.round(window.ECO_CONFIG.SOLAR_CONSTANTS.panel_efficiency * 1000) / 10,
      system_performance_ratio: performanceRatio,
      installed_capacity_kwp: installedCapacityKWp,
      annual_generation_kwh: annualGenerationKwh,
      annual_demand_kwh: annualDemand,
      demand_offset_percentage: demandOffsetPct,
      annual_co2_offset_kg: annualCarbonOffsetKg,
      annual_co2_offset_tonnes: annualCarbonOffsetTonnes,
      formula: "E_annual = Capacity (kWp) × Peak Sun Hours × 365 × Performance Ratio (0.75)",
      disclaimer: "Solar yield figures are engineering estimates based on horizontal/tilted global irradiance and 75% system performance ratio. Real output varies with local shading, tilt angle, azimuth, and panel cleaning frequency."
    };
  }
};
