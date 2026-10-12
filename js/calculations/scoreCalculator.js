/**
 * EcoBuild Smart - Composite Environmental Performance Score (0 - 100)
 * Evaluates site environmental sustainability across 7 scientific dimensions
 * with transparent indicator formulas, no unearned points for zero/missing inputs,
 * and strict separation from statutory regulatory approvals.
 */

(function(root) {
  'use strict';

  root.ScoreCalculator = {
    // Standard academic multi-criteria weights (Total = 1.00)
    DEFAULT_WEIGHTS: {
      green_cover: 0.18,          // 18% - Green cover percentage against baseline 25% target
      tree_retention: 0.16,       // 16% - Retention rate and compensatory planting compliance
      stormwater_mgmt: 0.18,      // 18% - Runoff mitigation & infiltration preservation
      water_conservation: 0.16,   // 16% - Rainwater harvesting capture & demand offset
      renewable_energy: 0.14,     // 14% - Solar generation offset vs demand
      surface_permeability: 0.10, // 10% - Permeable vs impervious ground fraction
      waste_management: 0.08      // 8%  - Construction waste recycling & diversion
    },

    /**
     * Calculate individual sub-indicators (each 0 - 100) and composite index
     */
    calculateScore(project, calcResults, customWeights = {}) {
      const weights = { ...this.DEFAULT_WEIGHTS, ...customWeights };
      const site = project.site || {};
      const veg = project.vegetation || {};
      const iv = project.interventions || {};
      const surf = project.surfaces || {};
      const waste = project.waste || {};

      // 1. Green Cover Indicator (Target: 25% plot area green)
      const greenPct = calcResults.green_cover?.existing_green_pct ?? 0;
      // 0% -> 0, 25% -> 100, >25% capped at 100
      const greenScore = Math.min(100, Math.max(0, Math.round((greenPct / 25) * 100)));

      // 2. Tree Retention & Replacement Indicator
      const treesRemoved = Math.max(0, Number(veg.trees_removed) || 0);
      const treesExisting = Math.max(0, Number(veg.existing_tree_count) || 0);
      const treesPlanted = Math.max(0, Number(iv.trees_planted) || 0);

      let treeScore = 50; // Neutral default if site has no trees
      if (treesExisting > 0) {
        const retentionRate = Math.max(0, (treesExisting - treesRemoved) / treesExisting); // 0.0 to 1.0
        const targetCompensatory = treesRemoved * 3;
        const compensatoryRate = targetCompensatory > 0 ? Math.min(1.0, treesPlanted / targetCompensatory) : 1.0;
        treeScore = Math.min(100, Math.max(0, Math.round(((retentionRate * 0.40) + (compensatoryRate * 0.60)) * 100)));
      } else if (treesRemoved === 0 && treesPlanted > 0) {
        treeScore = Math.min(100, 50 + (treesPlanted * 2));
      }

      // 3. Stormwater Management Indicator
      const runoffMitigationPct = calcResults.runoff?.impact_summary?.runoff_reduction_pct ?? 0;
      const compositeC = calcResults.runoff?.with_green_infrastructure?.composite_c ?? 0.85;
      // Low C is better: C=0.20 -> 100, C=0.90 -> 10
      const cScore = Math.max(0, Math.min(100, Math.round((1.0 - compositeC) * 125)));
      const stormScore = Math.min(100, Math.max(0, Math.round((cScore * 0.40) + (runoffMitigationPct * 0.60))));

      // 4. Water Conservation Indicator (RWH Demand Offset)
      // No free points for zero offset! 0% offset = 0 points; 50%+ offset = 100 points
      const rwhOffsetPct = calcResults.water?.demand_offset_percentage ?? 0;
      const waterScore = Math.min(100, Math.max(0, Math.round(rwhOffsetPct * 2.0)));

      // 5. Renewable Energy Indicator (Solar offset %)
      // 0% solar offset = 0 points; 50%+ offset = 100 points
      const solarOffsetPct = calcResults.energy?.demand_offset_percentage ?? 0;
      const energyScore = Math.min(100, Math.max(0, Math.round(solarOffsetPct * 2.0)));

      // 6. Surface Permeability Indicator
      const permPct = calcResults.green_cover?.permeable_pct ?? 0;
      const permPavingArea = Math.max(0, Number(iv.permeable_pavement_m2) || 0);
      const totalPaved = (Number(surf.concrete_area) || 0) + (Number(surf.asphalt_area) || 0);
      const pavingConversionPct = totalPaved > 0 ? (permPavingArea / totalPaved) * 100 : 0;
      const permScore = Math.min(100, Math.max(0, Math.round((permPct * 1.2) + (pavingConversionPct * 0.4))));

      // 7. Waste Management Indicator
      // Zero recycling = 0 points!
      const recyclingPct = (waste.recycling_pct !== undefined && waste.recycling_pct !== null) ? Number(waste.recycling_pct) : 0;
      const wasteScore = Math.min(100, Math.max(0, Math.round(recyclingPct)));

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

      // Performance Tiers (Explicitly separated from statutory approvals)
      let tier = "Moderate Performance";
      let tierBadge = "bg-amber-100 text-amber-800 border-amber-300";
      if (compositeScore >= 80) {
        tier = "High Performance (Sustainable Benchmark)";
        tierBadge = "bg-emerald-100 text-emerald-800 border-emerald-300";
      } else if (compositeScore >= 65) {
        tier = "Substantial Performance (Mitigation Active)";
        tierBadge = "bg-teal-100 text-teal-800 border-teal-300";
      } else if (compositeScore >= 45) {
        tier = "Moderate Performance (Deficits Present)";
        tierBadge = "bg-amber-100 text-amber-800 border-amber-300";
      } else {
        tier = "Severe Deficit (Significant Unmitigated Impacts)";
        tierBadge = "bg-rose-100 text-rose-800 border-rose-300";
      }

      return {
        composite_score: compositeScore,
        score_name: "EcoBuild Environmental Performance Score",
        tier: tier,
        tier_badge: tierBadge,
        is_legal_certification: false,
        statutory_disclaimer: "This composite score is an indicative multi-criteria planning metric. It does NOT constitute statutory clearance under MoEFCC EIA Notification 2006.",
        sub_indicators: {
          green_cover: { name: "Green Cover Indicator", score: greenScore, weight_pct: Math.round(weights.green_cover * 100), formula: "min(100, (Actual Green % / Target 25%) × 100)" },
          tree_retention: { name: "Tree Retention & Replacement", score: treeScore, weight_pct: Math.round(weights.tree_retention * 100), formula: "40% × Retention Rate + 60% × Compensatory 3:1 Rate" },
          stormwater_mgmt: { name: "Stormwater Infiltration & Runoff", score: stormScore, weight_pct: Math.round(weights.stormwater_mgmt * 100), formula: "40% × Runoff Coeff Index + 60% × Runoff Reduction %" },
          water_conservation: { name: "Water Conservation & RWH", score: waterScore, weight_pct: Math.round(weights.water_conservation * 100), formula: "min(100, 2.0 × RWH Demand Offset %)" },
          renewable_energy: { name: "Renewable Energy & Solar Offset", score: energyScore, weight_pct: Math.round(weights.renewable_energy * 100), formula: "min(100, 2.0 × Solar Demand Offset %)" },
          surface_permeability: { name: "Surface Permeability Index", score: permScore, weight_pct: Math.round(weights.surface_permeability * 100), formula: "1.2 × Permeable % + 0.4 × Paving Conversion %" },
          waste_management: { name: "Waste Diversion & Circularity", score: wasteScore, weight_pct: Math.round(weights.waste_management * 100), formula: "min(100, Construction Waste Recycling %)" }
        },
        formula_explanation: "Score = Σ (Sub-Indicator_i × Weight_i). Missing or zero inputs receive zero unearned points."
      };
    }
  };

})(typeof window !== 'undefined' ? window : globalThis);
