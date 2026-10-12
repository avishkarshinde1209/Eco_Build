/**
 * EcoBuild Smart - Nature Recovery & Ecological Restoration Calculator
 * Scientifically models two-phase mitigation:
 * Phase 1: Construction-Phase Mitigation (While Creating)
 * Phase 2: Post-Construction Operational Nature Recovery (After Construction)
 *
 * Scientific & Regulatory References:
 * - National Building Code of India (NBC 2016) Part 11: Approach to Sustainability
 * - CPCB Environmental Management Guidelines for C&D Waste (2016)
 * - MoEFCC Construction Dust & Topsoil Preservation Norms
 * - Akira Miyawaki Method for Ultra-Dense Native Afforestation
 * - US EPA / Sponge City Bioretention & Bioswale Sizing Guidelines
 */

(function(root) {
  'use strict';

  root.NatureRecoveryCalculator = {
    /**
     * Main calculation orchestrator for ecological restoration
     */
    calculateRecoveryPlan(project, calculations, environmentalData) {
      if (!project) return null;

      const site = project.site || {};
      const surf = project.surfaces || {};
      const veg = project.vegetation || {};
      const iv = project.interventions || {};
      const waste = project.waste || {};

      const plotArea = Math.max(1, Number(site.plot_area) || 5000);
      const builtUp = Math.max(0, Number(site.built_up_area) || 0);
      const floors = Math.max(1, Number(site.floors) || 1);
      const gfa = Number(site.total_floor_area) || (builtUp * floors);
      const openArea = Math.max(0, plotArea - builtUp);

      const existingTrees = Math.max(0, Number(veg.existing_tree_count) || 0);
      const treesRemoved = Math.max(0, Number(veg.trees_removed) || 0);

      // Preserve explicit 0 trees planted if user set it to 0
      let treesPlanted = 0;
      if (iv.trees_planted !== undefined && iv.trees_planted !== null && !isNaN(Number(iv.trees_planted))) {
        treesPlanted = Math.max(0, Number(iv.trees_planted));
      } else {
        treesPlanted = treesRemoved * 3;
      }

      const concreteArea = Math.max(0, Number(surf.concrete_area) || 0);
      const asphaltArea = Math.max(0, Number(surf.asphalt_area) || 0);
      const hardscape = concreteArea + asphaltArea;
      const roofArea = Math.max(0, Number(site.roof_area !== undefined ? site.roof_area : builtUp));

      // ----------------------------------------------------
      // PHASE 1: CONSTRUCTION-PHASE MITIGATION (While Creating)
      // ----------------------------------------------------

      // 1. Topsoil Salvage & Stockpile Sizing (NBC 2016 Part 11)
      const topsoilDepthM = (typeof window !== 'undefined' && window.ECO_CONFIG?.NATURE_RECOVERY_FACTORS?.topsoil_depth_m) || 0.20;
      const topsoilVolumeM3 = Math.round(builtUp * topsoilDepthM);
      const maxStockpileHeightM = 2.0;
      const stockpileFootprintM2 = topsoilVolumeM3 > 0 ? Math.round(topsoilVolumeM3 / maxStockpileHeightM) : 0;
      const topsoilReapplicationAreaM2 = Math.round(openArea * 0.70);

      // 2. CPCB Dust & Air Quality Barrier Sizing
      const approxPerimeterM = Math.round(4 * Math.sqrt(plotArea));
      const dustBarrierHeightM = 6; // Standard CPCB 6m sheet barrier
      const dustBarrierAreaM2 = approxPerimeterM * dustBarrierHeightM;
      const mistCannonsRequired = Math.max(1, Math.ceil(plotArea / 2500));
      const pm10MitigationPct = 72;

      // 3. Green Concrete & Clinker Substitution (IS 456 / IS 16714)
      const concreteVolumeM3 = Math.round(gfa * 0.40);
      const ggbsOffsetKgPerM3 = 130;
      const embodiedCarbonAvoidedTonnes = Math.round((concreteVolumeM3 * ggbsOffsetKgPerM3) / 1000 * 10) / 10;

      // 4. C&D Rubble Recycling (CPCB C&D Rules 2016)
      const totalWasteTonnes = (waste.construction_waste_tonnes !== undefined && waste.construction_waste_tonnes !== null)
        ? Math.max(0, Number(waste.construction_waste_tonnes))
        : Math.round((gfa * 55) / 1000);
      const recyclingPct = (waste.recycling_pct !== undefined && waste.recycling_pct !== null)
        ? Math.max(0, Math.min(100, Number(waste.recycling_pct)))
        : 65;
      const divertedWasteTonnes = Math.round(totalWasteTonnes * (recyclingPct / 100) * 10) / 10;
      const subbaseAggregateM3 = Math.round(divertedWasteTonnes / 1.6);

      // 5. Soil Erosion & Silt Retention
      const siltFenceLengthM = Math.round(approxPerimeterM * 0.75);
      const sedimentTrapsCount = Math.max(1, Math.ceil(plotArea / 2000));

      const phase1Construction = {
        topsoil: {
          salvage_volume_m3: topsoilVolumeM3,
          excavation_depth_cm: Math.round(topsoilDepthM * 100),
          stockpile_area_m2: stockpileFootprintM2,
          max_height_m: maxStockpileHeightM,
          reapplication_area_m2: topsoilReapplicationAreaM2,
          stabilization_method: "Leguminous cover crop (Crotalaria juncea) + Geotextile bunding",
          standard: "NBC 2016 Part 11 / MoEFCC Environmental Guidelines"
        },
        dust_control: {
          barrier_length_m: approxPerimeterM,
          barrier_height_m: dustBarrierHeightM,
          barrier_surface_m2: dustBarrierAreaM2,
          mist_cannons: mistCannonsRequired,
          wheel_wash_facility: true,
          pm10_capture_efficiency_pct: pm10MitigationPct,
          standard: "CPCB Comprehensive Industry Document on Construction Sites"
        },
        green_concrete: {
          estimated_concrete_m3: concreteVolumeM3,
          clinker_substitution_pct: 35,
          co2_avoided_tonnes: embodiedCarbonAvoidedTonnes,
          standard: "IS 456 / IS 16714 (GGBS in Concrete)"
        },
        rubble_circularity: {
          total_waste_tonnes: totalWasteTonnes,
          diverted_tonnes: divertedWasteTonnes,
          reusable_subbase_m3: subbaseAggregateM3,
          applications: ["Pervious parking bed", "Pathway aggregate sub-base", "Plinth levelling"]
        },
        erosion_control: {
          silt_fencing_m: siltFenceLengthM,
          sediment_traps: sedimentTrapsCount
        }
      };

      // ----------------------------------------------------
      // PHASE 2: POST-CONSTRUCTION OPERATIONAL NATURE RECOVERY
      // ----------------------------------------------------

      // 1. Akira Miyawaki Dense Urban Forest Sizing
      // Allocate up to 25% of available open ground (capped by physical openArea)
      const miyawakiAreaM2 = openArea > 0 ? Math.round(openArea * 0.25) : 0;
      const saplingDensity = 3.5;
      const miyawakiSaplings = Math.round(miyawakiAreaM2 * saplingDensity);
      const miyawakiCarbonMultiplier = 4.5; // ~4.5 kg CO2e / m² / yr
      const miyawakiAnnualCO2Kg = Math.round(miyawakiAreaM2 * miyawakiCarbonMultiplier * 10) / 10;
      const miyawakiAnnualCO2Tonnes = Math.round((miyawakiAnnualCO2Kg / 1000) * 100) / 100;

      // 2. Sponge City Bioretention & Bioswales
      const imperviousCatchmentM2 = hardscape + Math.round(roofArea * 0.30);
      const bioswaleAreaM2 = openArea > 0 ? Math.min(openArea, Math.max(10, Math.round(imperviousCatchmentM2 * 0.08))) : 0;
      const bioswaleRetentionVolumeM3 = Math.round(bioswaleAreaM2 * 0.45 * 0.35);

      // 3. Bio-Solar Synergy (Rooftop Green Roof + Solar PV)
      const solarAreaM2 = Math.max(0, Number(iv.solar_pv_area_m2) || 0);
      const greenRoofM2 = Math.max(0, Number(iv.green_roof_m2) || 0);
      const overlapPotentialM2 = Math.min(solarAreaM2, greenRoofM2);
      const annualSolarKwhBase = calculations?.energy?.annual_generation_kwh || 0;
      const bioSolarEfficiencyGainPct = (overlapPotentialM2 > 0 && iv.bio_solar_colocated) ? 4.5 : 0;
      const bioSolarBonusKwhYr = Math.round(annualSolarKwhBase * (bioSolarEfficiencyGainPct / 100));

      // 4. On-site Organic Waste Composting (CPHEEO)
      const dailyOrganicKg = (waste.daily_organic_waste_kg !== undefined && waste.daily_organic_waste_kg !== null)
        ? Math.max(0, Number(waste.daily_organic_waste_kg))
        : (waste.organic_waste_kg !== undefined ? Math.max(0, Number(waste.organic_waste_kg)) : 0);
      const annualOrganicWasteTonnes = Math.round((dailyOrganicKg * 365) / 1000 * 10) / 10;
      const compostEfficiency = 0.25;
      const annualCompostYieldTonnes = Math.round(annualOrganicWasteTonnes * compostEfficiency * 10) / 10;

      // 5. Total Tree Canopy & Carbon Balance
      const standardTreesPlanted = treesPlanted;
      const standardTreesCO2KgYr = standardTreesPlanted * 21.8;
      const totalAnnualRestorationCO2Kg = standardTreesCO2KgYr + miyawakiAnnualCO2Kg;
      const totalAnnualRestorationCO2Tonnes = Math.round((totalAnnualRestorationCO2Kg / 1000) * 100) / 100;

      // 6. Upfront Embodied Carbon vs. Total Offset Horizon
      // Canonical field alignment:
      const embodiedCarbonTonnes = calculations?.carbon?.total_embodied_tonnes 
        ?? calculations?.carbon?.construction_emissions_tonnes 
        ?? Math.round((gfa * 450) / 1000);
      const annualSolarOffsetTonnes = calculations?.energy?.annual_co2_offset_tonnes 
        ?? calculations?.energy?.annual_co2_saved_tonnes 
        ?? 0;
      const totalAnnualGreenOffsetsTonnes = totalAnnualRestorationCO2Tonnes + annualSolarOffsetTonnes;
      const netEmbodiedCarbonAfterGreenConcrete = Math.max(0, embodiedCarbonTonnes - embodiedCarbonAvoidedTonnes);
      const carbonPaybackYears = totalAnnualGreenOffsetsTonnes > 0
        ? Math.round((netEmbodiedCarbonAfterGreenConcrete / totalAnnualGreenOffsetsTonnes) * 10) / 10
        : 99.9;

      // 7. Biodiversity Net Gain (BNG) Planning Metric (Explicitly identified as EcoBuild model)
      const baselineBngUnits = ((veg.existing_green_area || 0) * 2) + (existingTrees * 5);
      const remainingTrees = Math.max(0, existingTrees - treesRemoved);
      const restoredGreenArea = (veg.existing_green_area || 0) + greenRoofM2;
      const postBngUnits = Math.round(
        (restoredGreenArea * 2) +
        (remainingTrees * 5) +
        (standardTreesPlanted * 6) +
        (miyawakiAreaM2 * 8) +
        (greenRoofM2 * 3) +
        (bioswaleAreaM2 * 6)
      );
      const bngNetDeltaPct = baselineBngUnits > 0
        ? Math.round(((postBngUnits - baselineBngUnits) / baselineBngUnits) * 100)
        : (postBngUnits > 0 ? 100 : 0);

      const phase2Operational = {
        miyawaki_forest: {
          designated_area_m2: miyawakiAreaM2,
          total_saplings: miyawakiSaplings,
          annual_co2_sequestration_kg: miyawakiAnnualCO2Kg,
          annual_co2_sequestration_tonnes: miyawakiAnnualCO2Tonnes,
          method: "Akira Miyawaki Ultra-Dense Afforestation (3.5 saplings/m²)"
        },
        bioretention_bioswales: {
          designated_area_m2: bioswaleAreaM2,
          retention_capacity_m3: bioswaleRetentionVolumeM3,
          filter_depth_mm: 450
        },
        bio_solar_colocation: {
          solar_area_m2: solarAreaM2,
          green_roof_m2: greenRoofM2,
          co_located_overlap_m2: overlapPotentialM2,
          efficiency_boost_kwh_yr: bioSolarBonusKwhYr
        },
        organic_composting: {
          daily_organic_kg: dailyOrganicKg,
          annual_waste_tonnes: annualOrganicWasteTonnes,
          annual_compost_yield_tonnes: annualCompostYieldTonnes
        },
        carbon_dynamics: {
          total_restoration_annual_co2_tonnes: totalAnnualRestorationCO2Tonnes,
          total_annual_green_offsets_tonnes: totalAnnualGreenOffsetsTonnes,
          net_embodied_carbon_tonnes: netEmbodiedCarbonAfterGreenConcrete,
          carbon_payback_years: carbonPaybackYears
        },
        biodiversity_net_gain: {
          baseline_units: baselineBngUnits,
          post_units: postBngUnits,
          net_gain_pct: bngNetDeltaPct,
          disclaimer: "Internal EcoBuild habitat-multiplier indicator; not an official statutory BNG clearance metric."
        }
      };

      return {
        phase1_construction: phase1Construction,
        phase2_operational: phase2Operational
      };
    }
  };

})(typeof window !== 'undefined' ? window : globalThis);
