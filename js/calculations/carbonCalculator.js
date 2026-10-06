/**
 * EcoBuild Smart - Carbon Footprint & Sequestration Calculation Engine
 * Estimates embodied emissions from construction materials alongside
 * vegetative sequestration deficit and recovery trajectory.
 * 
 * Sources:
 * - IPCC Guidelines for National Greenhouse Gas Inventories
 * - Indian Green Building Council (IGBC) / TERI GRIHA Carbon Baselines
 * - Central Electricity Authority (CEA) CO2 Baseline Database for Indian Power Sector
 */

window.CarbonCalculator = {
  /**
   * Calculate Construction Embodied Emissions & Vegetative Carbon Dynamics
   */
  calculateCarbonBalance(project, treesRecommended = 90) {
    const builtUpAreaM2 = project.site.total_floor_area || (project.site.built_up_area * project.site.floors);
    const concreteAreaM2 = project.surfaces.concrete_area || 0;
    const treesRemoved = project.vegetation.trees_removed || 0;
    const treesPlanted = project.interventions?.trees_planted || treesRecommended;
    const solarPvkWh = project.calculated_energy?.annual_solar_generation_kwh || 0;

    // --- 1. Construction Embodied Carbon ---
    // Standard baseline for institutional/commercial RCC building:
    // ~450 kg CO2e / m² built area (concrete structural frame + steel + masonry + finishes)
    // Concrete pavement: ~75 kg CO2e / m² of 150mm slab
    const buildingEmbodiedKg = Math.round(builtUpAreaM2 * window.ECO_CONFIG.CARBON_FACTORS.construction_avg_per_m2);
    const pavementEmbodiedKg = Math.round(concreteAreaM2 * 75);
    const totalEmbodiedCarbonKg = buildingEmbodiedKg + pavementEmbodiedKg;
    const totalEmbodiedCarbonTonnes = Math.round((totalEmbodiedCarbonKg / 1000) * 10) / 10;

    // --- 2. Vegetative Carbon Loss from Tree Felling ---
    // A mature tropical tree stores ~400 - 800 kg CO2 in woody biomass
    // Removing a tree releases/forgoes ~21.8 kg CO2e of active annual sequestration (IPCC baseline)
    const annualSequestrationLostKg = Math.round(treesRemoved * window.ECO_CONFIG.CARBON_FACTORS.mature_tree_annual_seq_kg * 10) / 10;
    const biomassCarbonLossKg = Math.round(treesRemoved * 500); // 500 kg stored biomass per mature tree

    // --- 3. Future Sequestration from Compensatory Planting ---
    // Young saplings start at ~8.5 kg CO2/yr and reach ~21.8 kg CO2/yr at maturity (~10 years)
    const initialPlantedSeqKg = Math.round(treesPlanted * window.ECO_CONFIG.CARBON_FACTORS.young_tree_annual_seq_kg * 10) / 10;
    const maturePlantedSeqKg = Math.round(treesPlanted * window.ECO_CONFIG.CARBON_FACTORS.mature_tree_annual_seq_kg * 10) / 10;

    // Net annual carbon balance of vegetation:
    const netAnnualVegetationBalanceKg = Math.round((maturePlantedSeqKg - annualSequestrationLostKg) * 10) / 10;

    // --- 4. Solar Renewable Carbon Offset ---
    // CEA grid factor: 0.82 kg CO2e per kWh
    const solarAnnualOffsetKg = Math.round(solarPvkWh * window.ECO_CONFIG.CARBON_FACTORS.grid_emission_factor_kg_per_kwh);
    const solarAnnualOffsetTonnes = Math.round((solarAnnualOffsetKg / 1000) * 10) / 10;

    // Net Annual Operational Emissions Benefit (Trees + Solar offset)
    const totalAnnualOffsetKg = Math.max(0, netAnnualVegetationBalanceKg) + solarAnnualOffsetKg;
    const totalAnnualOffsetTonnes = Math.round((totalAnnualOffsetKg / 1000) * 10) / 10;

    // Carbon Payback Period (Years to offset embodied carbon through green interventions)
    const carbonPaybackYears = totalAnnualOffsetKg > 0 
      ? Math.round((totalEmbodiedCarbonKg / totalAnnualOffsetKg) * 10) / 10 
      : 99.9;

    return {
      disclaimer: "This is an estimate based on selected academic models and standard emission factors. It should not be treated as a certified greenhouse gas accounting result.",
      embodied_emissions: {
        building_materials_kg: buildingEmbodiedKg,
        pavement_concrete_kg: pavementEmbodiedKg,
        total_embodied_kg: totalEmbodiedCarbonKg,
        total_embodied_tonnes: totalEmbodiedCarbonTonnes,
        factor_applied: "450 kg CO₂e/m² built-up area (IGBC baseline)"
      },
      vegetation_carbon: {
        trees_removed: treesRemoved,
        trees_planted: treesPlanted,
        biomass_carbon_loss_kg: biomassCarbonLossKg,
        annual_sequestration_lost_kg: annualSequestrationLostKg,
        initial_annual_sequestration_gained_kg: initialPlantedSeqKg,
        mature_annual_sequestration_gained_kg: maturePlantedSeqKg,
        net_annual_sequestration_diff_kg: netAnnualVegetationBalanceKg,
        net_gain: netAnnualVegetationBalanceKg > 0
      },
      solar_emissions_offset: {
        annual_generation_kwh: solarPvkWh,
        annual_offset_kg: solarAnnualOffsetKg,
        annual_offset_tonnes: solarAnnualOffsetTonnes,
        grid_emission_factor: "0.82 kg CO₂e/kWh (CEA India Baseline v19)"
      },
      net_carbon_dynamics: {
        total_annual_offset_kg: totalAnnualOffsetKg,
        total_annual_offset_tonnes: totalAnnualOffsetTonnes,
        carbon_payback_years: carbonPaybackYears
      },
      assumptions_list: [
        "Mature tree sequestration rate: 21.8 kg CO₂e/tree/year (Arbor Day / IPCC)",
        "Young sapling initial sequestration rate: 8.5 kg CO₂e/tree/year",
        "Biomass carbon stock per mature felled tree: 500 kg CO₂e equivalent",
        "Embodied carbon intensity of RCC structure: 450 kg CO₂e/m² of gross floor area",
        "Indian Central Electricity Authority (CEA) grid emission factor: 0.82 kg CO₂e/kWh"
      ]
    };
  }
};
