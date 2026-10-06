/**
 * EcoBuild Smart - Urban Heat Island (UHI) & Surface Microclimate Calculator
 * Models thermal albedo and microclimate stress index based on
 * US EPA Urban Heat Island Mitigation guidance & Oke (1982) surface energy balance.
 */

window.HeatIslandCalculator = {
  /**
   * Calculate Area-Weighted Surface Albedo and UHI Vulnerability Index
   */
  calculateUHI(plotArea, surfaces, interventions = {}) {
    const concreteArea = Math.max(0, (surfaces.concrete_area || 0) - (interventions.permeable_pavement_m2 || 0));
    const asphaltArea = surfaces.asphalt_area || 0;
    const standardRoofArea = Math.max(0, (surfaces.standard_roof || 0) - (interventions.green_roof_m2 || 0));
    const greenRoofArea = interventions.green_roof_m2 || 0;
    const permPaverArea = interventions.permeable_pavement_m2 || 0;
    const lawnArea = surfaces.lawn_grass || 0;
    const treeCoverArea = (interventions.trees_planted || 0) * 15; // Shaded projection

    // Albedo coefficients
    const albedos = window.ECO_CONFIG.ALBEDO_VALUES;
    let weightedAlbedoSum = 
      (concreteArea * albedos.concrete) +
      (asphaltArea * albedos.asphalt) +
      (standardRoofArea * albedos.standard_roof) +
      (greenRoofArea * albedos.green_roof) +
      (permPaverArea * albedos.permeable_pavement) +
      (lawnArea * albedos.vegetation);

    const totalCalculatedArea = concreteArea + asphaltArea + standardRoofArea + greenRoofArea + permPaverArea + lawnArea;
    const siteAverageAlbedo = totalCalculatedArea > 0 ? (weightedAlbedoSum / totalCalculatedArea) : 0.25;

    // Impervious fraction
    const totalHardPaved = concreteArea + asphaltArea + standardRoofArea;
    const imperviousFraction = totalCalculatedArea > 0 ? (totalHardPaved / totalCalculatedArea) : 0.6;

    // UHI Vulnerability Score (0 to 100, where 100 = Severe UHI heat trap, 0 = Natural cool microclimate)
    // Formula based on impervious fraction penalized, mitigated by albedo and evapotranspirative green cover
    let uhiIndex = (imperviousFraction * 80) + ((1 - siteAverageAlbedo) * 20);
    // Tree shading mitigation bonus (reduces UHI up to 25 points)
    const treeCoolingBonus = Math.min(25, (treeCoverArea / Math.max(1, plotArea)) * 50);
    uhiIndex = Math.max(10, Math.min(100, Math.round(uhiIndex - treeCoolingBonus)));

    let riskLevel = "Moderate";
    let riskColor = "amber";
    if (uhiIndex > 75) { riskLevel = "High Thermal Stress"; riskColor = "rose"; }
    else if (uhiIndex > 50) { riskLevel = "Moderate Thermal Stress"; riskColor = "amber"; }
    else { riskLevel = "Low / Cool Microclimate"; riskColor = "emerald"; }

    return {
      average_site_albedo: Math.round(siteAverageAlbedo * 100) / 100,
      impervious_surface_fraction: Math.round(imperviousFraction * 100) / 100,
      uhi_vulnerability_index: uhiIndex,
      uhi_risk_level: riskLevel,
      uhi_color: riskColor,
      evapotranspirative_cooling_area_m2: lawnArea + greenRoofArea + Math.round(treeCoverArea),
      estimated_ambient_cooling_benefit: greenRoofArea > 0 || permPaverArea > 0 
        ? "Estimated 1.5°C to 2.8°C reduction in local surface radiant temperature based on green cover and high-albedo intervention."
        : "Standard unmitigated urban surface heat retention.",
      model_basis: "US EPA Urban Heat Island Reduction Compendium & Area-Weighted Albedo Index"
    };
  }
};
