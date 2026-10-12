/**
 * EcoBuild Smart - Vegetation, Tree Impact & Green Infrastructure Calculator
 * Evaluates green cover deficit, tree loss replacement obligations, canopy dynamics,
 * green roof potential, and permeable pavement retrofitting.
 */

(function(root) {
  'use strict';

  root.VegetationCalculator = {
    /**
     * Calculate Green Cover and Impervious Surface Balances
     */
    calculateGreenCover(plotArea, builtUpArea, concreteArea, asphaltArea, existingGreenArea, tilesArea = 0) {
      const plot = Math.max(1, Number(plotArea) || 1);
      const built = Math.max(0, Number(builtUpArea) || 0);
      const conc = Math.max(0, Number(concreteArea) || 0);
      const asph = Math.max(0, Number(asphaltArea) || 0);
      const tiles = Math.max(0, Number(tilesArea) || 0);
      const green = Math.max(0, Number(existingGreenArea) || 0);

      const imperviousArea = built + conc + asph + (tiles * 0.7);
      const existingGreenPct = Math.round((green / plot) * 1000) / 10;
      const imperviousPct = Math.round((imperviousArea / plot) * 1000) / 10;
      const remainingOpenArea = Math.max(0, plot - built - conc - asph);
      const permeablePct = Math.max(0, Math.round((remainingOpenArea / plot) * 1000) / 10);

      // NBC 2016 Part 11 / MoEFCC recommends min 15-25% site green cover
      const targetGreenPct = 25.0;
      const targetGreenAreaM2 = Math.round(plot * (targetGreenPct / 100));
      const greenDeficitM2 = Math.max(0, targetGreenAreaM2 - green);

      return {
        plot_area_m2: plot,
        existing_green_area_m2: green,
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
     * Evaluates tree loss, replacement obligations, survival rates, and canopy recovery
     */
    calculateTreeImpact(treesExisting, treesRemoved, treeCategory = "Mixed Canopy") {
      const existing = (treesExisting !== null && treesExisting !== undefined && !isNaN(Number(treesExisting))) 
        ? Math.max(0, Number(treesExisting)) 
        : 0;
      const removed = (treesRemoved !== null && treesRemoved !== undefined && !isNaN(Number(treesRemoved))) 
        ? Math.max(0, Number(treesRemoved)) 
        : 0;

      const retained = Math.max(0, existing - removed);
      const treeLossPct = existing > 0 ? Math.round((removed / existing) * 1000) / 10 : 0;

      // Compensatory Replacement Ratio:
      // Maharashtra Urban Areas Tree Protection Act & NBC 2016: 3:1 baseline
      // 4:1 if >40% trees felled, 5:1 if >60% felled
      let replacementRatio = 3;
      if (treeLossPct > 60) {
        replacementRatio = 5;
      } else if (treeLossPct > 40) {
        replacementRatio = 4;
      }

      // Zero trees removed = zero mandatory planting obligation!
      const recommendedPlantingQuantity = removed > 0 ? (removed * replacementRatio) : 0;

      // Canopy loss estimate: average mature tropical tree has 35 m² canopy spread
      const avgMatureCanopyM2 = 35;
      const estimatedCanopyLostM2 = removed * avgMatureCanopyM2;

      // Survival assumption: 85% of saplings survive with proper 3-year maintenance (NBC norm)
      const expectedSurvivingSaplings = Math.round(recommendedPlantingQuantity * 0.85);

      // Canopy trajectory (assuming 85% survival and growth to full maturity):
      const futureCanopy10YearsM2 = Math.round(expectedSurvivingSaplings * avgMatureCanopyM2);
      const netCanopyDeltaM2 = futureCanopy10YearsM2 - estimatedCanopyLostM2;

      return {
        trees_existing: existing,
        trees_removed: removed,
        trees_retained: retained,
        tree_loss_pct: treeLossPct,
        replacement_ratio: replacementRatio,
        recommended_planting_quantity: recommendedPlantingQuantity,
        expected_surviving_saplings: expectedSurvivingSaplings,
        survival_rate_assumed_pct: 85,
        estimated_canopy_lost_m2: estimatedCanopyLostM2,
        projected_canopy_10yr_m2: futureCanopy10YearsM2,
        net_canopy_gain_m2: netCanopyDeltaM2,
        regulatory_reference: "Maharashtra Urban Areas Tree Preservation Act & NBC 2016 Part 11",
        ecological_note: "Compensatory planting should prioritize native biodiverse species with 3-year establishment watering and pruning."
      };
    },

    /**
     * Green Roof & Permeable Pavement Recommendations
     */
    calculateGreenInfrastructureRequirements(roofAreaM2, concreteAreaM2, existingSolarAreaM2 = 0) {
      const roof = Math.max(0, Number(roofAreaM2) || 0);
      const concrete = Math.max(0, Number(concreteAreaM2) || 0);
      const solar = Math.max(0, Number(existingSolarAreaM2) || 0);

      const availableRoofForGreen = Math.max(0, roof - solar);
      const recommendedGreenRoofM2 = Math.round(availableRoofForGreen * 0.35);
      const greenRoofPctOfTotalRoof = roof > 0 ? Math.round((recommendedGreenRoofM2 / roof) * 100) : 0;

      const recommendedPermeablePavementM2 = Math.round(concrete * 0.45);
      const permeableConversionPct = concrete > 0 ? Math.round((recommendedPermeablePavementM2 / concrete) * 100) : 0;

      return {
        available_roof_m2: availableRoofForGreen,
        recommended_green_roof_m2: recommendedGreenRoofM2,
        green_roof_pct: greenRoofPctOfTotalRoof,
        recommended_permeable_pavement_m2: recommendedPermeablePavementM2,
        permeable_pavement_conversion_pct: permeableConversionPct
      };
    }
  };

})(typeof window !== 'undefined' ? window : globalThis);
