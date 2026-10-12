/**
 * EcoBuild Smart - Carbon Footprint & Sequestration Calculation Engine
 * Estimates embodied emissions from construction materials alongside
 * vegetative sequestration deficit, young vs mature allometry, and solar displacement.
 * 
 * Sources:
 * - IPCC Guidelines for National Greenhouse Gas Inventories
 * - Indian Green Building Council (IGBC) / TERI GRIHA Carbon Baselines
 * - Central Electricity Authority (CEA) CO₂ Baseline Database for Indian Power Sector (v20)
 * - Forest Survey of India (FSI) & Arbor Day Biomass Allometric Models
 */

(function(root) {
  'use strict';

  root.CarbonCalculator = {
    /**
     * Calculate Construction Embodied Emissions & Vegetative Carbon Dynamics
     */
    calculateCarbonBalance(project, treesRecommended = 90) {
      const site = project.site || {};
      const surf = project.surfaces || {};
      const veg = project.vegetation || {};
      const iv = project.interventions || {};

      const builtUpAreaM2 = Number(site.total_floor_area) || (Number(site.built_up_area || 0) * Number(site.floors || 1));
      const concreteAreaM2 = Math.max(0, Number(surf.concrete_area) || 0);
      const treesRemoved = Math.max(0, Number(veg.trees_removed) || 0);

      // Explicit zero handling: 0 trees planted is legitimate!
      let treesPlanted = 0;
      if (iv.trees_planted !== undefined && iv.trees_planted !== null && !isNaN(Number(iv.trees_planted))) {
        treesPlanted = Math.max(0, Number(iv.trees_planted));
      }

      // Solar generation from canonical energy calculation:
      const solarCalc = project.calculated_energy || {};
      const solarPvkWh = Number(solarCalc.annual_generation_kwh ?? solarCalc.annual_solar_generation_kwh ?? 0);

      // --- 1. Construction Embodied Carbon ---
      // RCC structure: ~450 kg CO2e / m² built-up gross floor area (IGBC / GRIHA standard)
      // Concrete hardscape: ~75 kg CO2e / m² of 150mm slab
      const buildingEmbodiedKg = Math.round(builtUpAreaM2 * ((typeof window !== 'undefined' && window.ECO_CONFIG?.CARBON_FACTORS?.construction_avg_per_m2) || 450));
      const pavementEmbodiedKg = Math.round(concreteAreaM2 * 75);
      const totalEmbodiedCarbonKg = buildingEmbodiedKg + pavementEmbodiedKg;
      const totalEmbodiedCarbonTonnes = Math.round((totalEmbodiedCarbonKg / 1000) * 10) / 10;

      // --- 2. Vegetative Carbon Loss from Tree Felling ---
      // Mature tree sequestration: ~21.8 kg CO2e / tree / year (IPCC Tier 1)
      // Stored woody biomass released: ~500 kg CO2e per mature tree
      const annualSequestrationLostKg = Math.round(treesRemoved * ((typeof window !== 'undefined' && window.ECO_CONFIG?.CARBON_FACTORS?.mature_tree_annual_seq_kg) || 21.8) * 10) / 10;
      const biomassCarbonLossKg = Math.round(treesRemoved * 500);
      const biomassCarbonLossTonnes = Math.round((biomassCarbonLossKg / 1000) * 10) / 10;

      // --- 3. Future Sequestration from Compensatory Planting ---
      // Distinguish young establishment period (~8.5 kg CO2e/tree/yr) vs mature canopy (~21.8 kg CO2e/tree/yr)
      const youngRate = (typeof window !== 'undefined' && window.ECO_CONFIG?.CARBON_FACTORS?.young_tree_annual_seq_kg) || 8.5;
      const matureRate = (typeof window !== 'undefined' && window.ECO_CONFIG?.CARBON_FACTORS?.mature_tree_annual_seq_kg) || 21.8;

      const initialPlantedSeqKg = Math.round(treesPlanted * youngRate * 10) / 10;
      const maturePlantedSeqKg = Math.round(treesPlanted * matureRate * 10) / 10;

      // Net annual vegetative balance (mature rate minus lost baseline rate):
      const netAnnualVegetationBalanceKg = Math.round((maturePlantedSeqKg - annualSequestrationLostKg) * 10) / 10;
      const netAnnualVegetationBalanceTonnes = Math.round((netAnnualVegetationBalanceKg / 1000) * 100) / 100;

      // --- 4. Solar Renewable Carbon Offset ---
      // CEA India baseline factor: 0.82 kg CO2e per kWh
      const gridFactor = (typeof window !== 'undefined' && window.ECO_CONFIG?.CARBON_FACTORS?.grid_emission_factor_kg_per_kwh) || 0.82;
      const solarAnnualOffsetKg = Math.round(solarPvkWh * gridFactor);
      const solarAnnualOffsetTonnes = Math.round((solarAnnualOffsetKg / 1000) * 10) / 10;

      // --- 5. Net Annual Operational Carbon Reduction ---
      const totalAnnualOffsetKg = Math.max(0, netAnnualVegetationBalanceKg) + solarAnnualOffsetKg;
      const totalAnnualOffsetTonnes = Math.round((totalAnnualOffsetKg / 1000) * 10) / 10;

      // Payback Period (years to offset upfront embodied emissions through operational green measures)
      const carbonPaybackYears = totalAnnualOffsetKg > 0
        ? Math.round((totalEmbodiedCarbonKg / totalAnnualOffsetKg) * 10) / 10
        : 99.9;

      return {
        disclaimer: "Estimated using IPCC Tier 1 guidelines, IGBC embodied baselines, and CEA India v20 grid factors. Not a certified ISO 14064 audit.",
        
        // Canonical aliases for cross-module consumption:
        total_embodied_tonnes: totalEmbodiedCarbonTonnes,
        construction_emissions_tonnes: totalEmbodiedCarbonTonnes,
        annual_co2_offset_tonnes: totalAnnualOffsetTonnes,

        embodied_emissions: {
          building_materials_kg: buildingEmbodiedKg,
          pavement_concrete_kg: pavementEmbodiedKg,
          total_embodied_kg: totalEmbodiedCarbonKg,
          total_embodied_tonnes: totalEmbodiedCarbonTonnes,
          factor_applied: "450 kg CO₂e/m² built-up area (IGBC RCC structural baseline)"
        },
        vegetation_carbon: {
          trees_removed: treesRemoved,
          trees_planted: treesPlanted,
          biomass_carbon_loss_kg: biomassCarbonLossKg,
          biomass_carbon_loss_tonnes: biomassCarbonLossTonnes,
          annual_sequestration_lost_kg: annualSequestrationLostKg,
          initial_annual_sequestration_gained_kg: initialPlantedSeqKg,
          mature_annual_sequestration_gained_kg: maturePlantedSeqKg,
          net_annual_sequestration_diff_kg: netAnnualVegetationBalanceKg,
          net_annual_sequestration_diff_tonnes: netAnnualVegetationBalanceTonnes,
          net_gain: netAnnualVegetationBalanceKg > 0,
          establishment_period_years: "1-5 years (young rate 8.5 kg/yr), 6-10+ years (mature rate 21.8 kg/yr)"
        },
        solar_emissions_offset: {
          annual_generation_kwh: solarPvkWh,
          annual_offset_kg: solarAnnualOffsetKg,
          annual_offset_tonnes: solarAnnualOffsetTonnes,
          grid_emission_factor: `${gridFactor} kg CO₂e/kWh (CEA India Baseline v20)`
        },
        net_carbon_dynamics: {
          total_annual_offset_kg: totalAnnualOffsetKg,
          total_annual_offset_tonnes: totalAnnualOffsetTonnes,
          carbon_payback_years: carbonPaybackYears
        },
        assumptions_list: [
          "Mature tropical tree annual sequestration: 21.8 kg CO₂e/year (IPCC/Arbor Day)",
          "Young sapling initial annual sequestration: 8.5 kg CO₂e/year (years 1-5)",
          "Stored biomass carbon loss per mature tree felled: 500 kg CO₂e",
          "Embodied carbon intensity of RCC structure: 450 kg CO₂e/m² GFA",
          "Central Electricity Authority (CEA) India grid emission factor: 0.82 kg CO₂e/kWh"
        ]
      };
    }
  };

})(typeof window !== 'undefined' ? window : globalThis);
