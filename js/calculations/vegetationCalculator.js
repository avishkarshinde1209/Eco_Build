/**
 * EcoBuild Smart - Vegetation, Tree Impact & Green Infrastructure Calculator
 * Evaluates green cover deficit, tree loss replacement ratios, canopy loss,
 * green roof potential, and permeable pavement retrofitting.
 */

window.VegetationCalculator = {
  /**
   * Calculate Green Cover and Impervious Surface Balances
   */
  calculateGreenCover(plotArea, builtUpArea, concreteArea, asphaltArea, existingGreenArea, tilesArea = 0) {
    const imperviousArea = builtUpArea + concreteArea + asphaltArea + (tilesArea * 0.7);
    const existingGreenPct = Math.round((existingGreenArea / plotArea) * 1000) / 10;
    const imperviousPct = Math.round((imperviousArea / plotArea) * 1000) / 10;
    const remainingOpenArea = Math.max(0, plotArea - builtUpArea - concreteArea - asphaltArea);
    const permeablePct = Math.max(0, Math.round((remainingOpenArea / plotArea) * 1000) / 10);

    // Minimum green cover guidelines (e.g., MoEFCC / NBC recommends min 15-20% green cover)
    const targetGreenPct = 25.0;
    const targetGreenAreaM2 = Math.round(plotArea * (targetGreenPct / 100));
    const greenDeficitM2 = Math.max(0, targetGreenAreaM2 - existingGreenArea);

    return {
      plot_area_m2: plotArea,
      existing_green_area_m2: existingGreenArea,
      existing_green_pct: existingGreenPct,
      impervious_area_m2: Math.round(imperviousArea),
      impervious_pct: Math.min(100, imperviousPct),
      permeable_open_area_m2: Math.round(remainingOpenArea),
      permeable_pct: permeablePct,
      target_green_pct: targetGreenPct,
      target_green_area_m2: targetGreenAreaM2,
      green_deficit_m2: greenDeficitM2
    };
  },

  /**
   * Tree Impact Model:
   * Evaluates tree loss, replacement obligations, and canopy recovery
   */
  calculateTreeImpact(treesExisting, treesRemoved, treeCategory = "Mixed Canopy") {
    const treesRetained = Math.max(0, treesExisting - treesRemoved);
    const treeLossPct = treesExisting > 0 ? Math.round((treesRemoved / treesExisting) * 1000) / 10 : 0;

    // Ecological Replacement Ratio:
    // Statutory requirement in many Indian municipal acts is 3:1 to 5:1 (Maharashtra Urban Areas Protection and Preservation of Trees Act)
    // We apply a scientific tiered ratio:
    // 3:1 baseline + 1 extra per tree if >30% of site trees are wiped out
    let replacementRatio = 3;
    if (treeLossPct > 40) {
      replacementRatio = 4;
    } else if (treeLossPct > 60) {
      replacementRatio = 5;
    }

    const recommendedPlantingQuantity = treesRemoved * replacementRatio;

    // Canopy loss estimate: average mature tropical tree has 25 - 45 m² canopy spread
    const avgMatureCanopyM2 = 35; // m²
    const estimatedCanopyLostM2 = treesRemoved * avgMatureCanopyM2;

    // Canopy recovery over time with new saplings:
    // Year 1-3: 15% canopy maturity
    // Year 5: 45% canopy maturity
    // Year 10: 85% canopy maturity
    // Year 15: 100%+ canopy maturity (due to 3x saplings)
    const futureCanopy10YearsM2 = Math.round(recommendedPlantingQuantity * avgMatureCanopyM2 * 0.85);

    return {
      trees_existing: treesExisting,
      trees_removed: treesRemoved,
      trees_retained: treesRetained,
      tree_loss_pct: treeLossPct,
      replacement_ratio: replacementRatio,
      recommended_planting_quantity: recommendedPlantingQuantity,
      estimated_canopy_lost_m2: estimatedCanopyLostM2,
      projected_canopy_10yr_m2: futureCanopy10YearsM2,
      net_canopy_gain_m2: futureCanopy10YearsM2 - estimatedCanopyLostM2,
      regulatory_reference: "Maharashtra Urban Areas Tree Preservation Act & NBC 2016 (3:1 to 5:1 compensatory planting)",
      uncertainty_disclaimer: "Tree growth and carbon sequestration models are biological projections. Actual canopy expansion varies depending on soil depth, water table, species selection, and post-planting maintenance."
    };
  },

  /**
   * Green Roof & Permeable Pavement Recommendations
   */
  calculateGreenInfrastructureRequirements(roofAreaM2, concreteAreaM2, existingSolarAreaM2 = 0) {
    // Green Roof: Recommend 30% to 50% of available roof (excluding solar array area)
    const availableRoofForGreen = Math.max(0, roofAreaM2 - existingSolarAreaM2);
    const recommendedGreenRoofM2 = Math.round(availableRoofForGreen * 0.35); // 35% recommendation
    const greenRoofPctOfTotalRoof = roofAreaM2 > 0 ? Math.round((recommendedGreenRoofM2 / roofAreaM2) * 100) : 0;

    // Permeable Pavement: Recommend converting 40% to 60% of hard concrete parking/walkways
    const recommendedPermeablePavementM2 = Math.round(concreteAreaM2 * 0.45); // 45% recommendation
    const permeableConversionPct = concreteAreaM2 > 0 ? Math.round((recommendedPermeablePavementM2 / concreteAreaM2) * 100) : 0;

    return {
      available_roof_m2: availableRoofForGreen,
      recommended_green_roof_m2: recommendedGreenRoofM2,
      green_roof_pct: greenRoofPctOfTotalRoof,
      green_roof_stormwater_retention_pct: 65, // Retains 60-70% of incident rain
      recommended_permeable_pavement_m2: recommendedPermeablePavementM2,
      permeable_pavement_conversion_pct: permeableConversionPct,
      permeable_runoff_reduction_pct: 72 // Reduces runoff by ~70-75% vs concrete
    };
  }
};
