/**
 * EcoBuild Smart - Composite Environmental Sustainability Score (0 - 100)
 * Evaluates performance across 7 distinct scientific dimensions with
 * configurable weights and inspectable component formulas.
 */

window.ScoreCalculator = {
  // Default academic weights (Total = 100%)
  DEFAULT_WEIGHTS: {
    green_cover: 0.18,          // 18% - Green cover percentage against baseline target
    tree_retention: 0.16,       // 16% - Retention and compensatory planting ratio
    stormwater_mgmt: 0.18,      // 18% - Runoff mitigation & infiltration preservation
    water_conservation: 0.16,   // 16% - Rainwater harvesting capture & demand offset
    renewable_energy: 0.14,     // 14% - Solar generation offset vs demand
    surface_permeability: 0.10, // 10% - Permeable vs impervious ground fraction
    waste_management: 0.08      // 8%  - Construction waste recycling & organic diversion
  },

  /**
   * Calculate individual sub-indicators (each 0 - 100) and composite index
   */
  calculateScore(project, calcResults, customWeights = {}) {
    const weights = { ...this.DEFAULT_WEIGHTS, ...customWeights };

    // 1. Green Cover Indicator (Target: 25% plot area green)
    const greenPct = calcResults.green_cover?.existing_green_pct || 0;
    // Scale: 0% -> 0, 25% -> 100, >25% capped at 100
    const greenScore = Math.min(100, Math.round((greenPct / 25) * 100));

    // 2. Tree Retention & Replacement Indicator
    const treesRemoved = project.vegetation.trees_removed || 0;
    const treesExisting = project.vegetation.existing_tree_count || 1;
    const treesPlanted = project.interventions?.trees_planted || 0;
    const retentionRate = Math.max(0, (treesExisting - treesRemoved) / treesExisting); // 0 to 1
    // Compensatory planting score: need 3x removed
    const targetCompensatory = treesRemoved * 3;
    const compensatoryRate = targetCompensatory > 0 ? Math.min(1.2, treesPlanted / targetCompensatory) : 1.0;
    const treeScore = Math.min(100, Math.round(((retentionRate * 0.4) + (compensatoryRate * 0.6)) * 100));

    // 3. Stormwater Management Indicator
    // Evaluates runoff reduction percentage achieved by green infrastructure
    const runoffMitigationPct = calcResults.runoff?.impact_summary?.runoff_reduction_pct || 0;
    // Base composite C: lower C is better. C = 0.2 -> 100, C = 0.9 -> 10
    const compositeC = calcResults.runoff?.with_green_infrastructure?.composite_c || 0.7;
    const cScore = Math.max(0, Math.min(100, Math.round((1 - compositeC) * 125)));
    const stormScore = Math.min(100, Math.round((cScore * 0.5) + (runoffMitigationPct * 1.5 * 0.5)));

    // 4. Water Conservation Indicator (RWH Demand Offset)
    const rwhOffsetPct = calcResults.water?.demand_offset_percentage || 0;
    // Scale: 0% offset -> 15 (baseline), 40% offset -> 80, >=50% offset -> 100
    const waterScore = Math.min(100, Math.round(20 + (rwhOffsetPct * 1.6)));

    // 5. Renewable Energy Indicator (Solar offset %)
    const solarOffsetPct = calcResults.energy?.demand_offset_percentage || 0;
    const energyScore = Math.min(100, Math.round(solarOffsetPct * 2.0)); // 50% solar offset = 100 score

    // 6. Surface Permeability Indicator
    const permPct = calcResults.green_cover?.permeable_pct || 0;
    const permPavingArea = project.interventions?.permeable_pavement_m2 || 0;
    const totalPaved = (project.surfaces.concrete_area || 0) + (project.surfaces.asphalt_area || 0);
    const pavingConversionPct = totalPaved > 0 ? (permPavingArea / totalPaved) * 100 : 0;
    const permScore = Math.min(100, Math.round((permPct * 1.5) + (pavingConversionPct * 0.6)));

    // 7. Waste Management Indicator
    const recyclingPct = project.waste?.recycling_pct || 25;
    const wasteScore = Math.min(100, Math.round(recyclingPct * 1.5 + 20));

    // Weighted Composite Score
    const compositeScore = Math.round(
      (greenScore * weights.green_cover) +
      (treeScore * weights.tree_retention) +
      (stormScore * weights.stormwater_mgmt) +
      (waterScore * weights.water_conservation) +
      (energyScore * weights.renewable_energy) +
      (permScore * weights.surface_permeability) +
      (wasteScore * weights.waste_management)
    );

    // Performance tier
    let tier = "Moderate";
    let tierBadge = "bg-amber-100 text-amber-800 border-amber-300";
    if (compositeScore >= 80) { tier = "Excellent (Eco-Leader)"; tierBadge = "bg-emerald-100 text-emerald-800 border-emerald-300"; }
    else if (compositeScore >= 65) { tier = "Good (Sustainable)"; tierBadge = "bg-teal-100 text-teal-800 border-teal-300"; }
    else if (compositeScore >= 45) { tier = "Moderate (Deficit Present)"; tierBadge = "bg-amber-100 text-amber-800 border-amber-300"; }
    else { tier = "High Environmental Deficit"; tierBadge = "bg-rose-100 text-rose-800 border-rose-300"; }

    return {
      composite_score: compositeScore,
      tier: tier,
      tier_badge: tierBadge,
      sub_indicators: {
        green_cover: { name: "Green Cover Indicator", score: greenScore, weight_pct: Math.round(weights.green_cover * 100), formula: "min(100, (Actual Green % / Target 25%) × 100)" },
        tree_retention: { name: "Tree Retention & Replacement", score: treeScore, weight_pct: Math.round(weights.tree_retention * 100), formula: "40% × Retention Rate + 60% × Compensatory 3:1 Rate" },
        stormwater_mgmt: { name: "Stormwater Infiltration & Runoff", score: stormScore, weight_pct: Math.round(weights.stormwater_mgmt * 100), formula: "50% × (1 - Composite C) + 50% × Runoff Reduction %" },
        water_conservation: { name: "Water Conservation & RWH", score: waterScore, weight_pct: Math.round(weights.water_conservation * 100), formula: "Base 20 + 1.6 × (RWH Demand Offset %)" },
        renewable_energy: { name: "Renewable Energy & Solar Offset", score: energyScore, weight_pct: Math.round(weights.renewable_energy * 100), formula: "min(100, 2.0 × Solar Demand Offset %)" },
        surface_permeability: { name: "Surface Permeability Index", score: permScore, weight_pct: Math.round(weights.surface_permeability * 100), formula: "1.5 × Permeable % + 0.6 × Paving Conversion %" },
        waste_management: { name: "Waste Diversion & Recycling", score: wasteScore, weight_pct: Math.round(weights.waste_management * 100), formula: "20 + 1.5 × Construction Recycling %" }
      },
      formula_explanation: "Score = Σ (Sub-Indicator_i × Weight_i). Each dimension is normalized between 0-100 against scientific and municipal benchmarks."
    };
  }
};
