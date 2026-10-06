/**
 * EcoBuild Smart - Unified Environmental Calculator
 * Orchestrates all domain calculators into a cohesive dynamic assessment.
 */

window.EnvironmentalCalculator = {
  calculateGreenCoverLoss(project) {
    return window.VegetationCalculator.calculateGreenCover(
      project.site.plot_area,
      project.site.built_up_area,
      project.surfaces.concrete_area,
      project.surfaces.asphalt_area,
      project.vegetation.existing_green_area,
      project.surfaces.tiles_pavers
    );
  },

  calculateTreeLoss(project) {
    return window.VegetationCalculator.calculateTreeImpact(
      project.vegetation.existing_tree_count,
      project.vegetation.trees_removed,
      project.vegetation.tree_category
    );
  },

  calculateImperviousSurfaceImpact(project, greenRoofM2 = 0, permPavingM2 = 0) {
    const plot = project.site.plot_area;
    const baseImpervious = (project.site.built_up_area || 0) + (project.surfaces.concrete_area || 0) + (project.surfaces.asphalt_area || 0);
    const mitigatedImpervious = Math.max(0, baseImpervious - permPavingM2 - (greenRoofM2 * 0.6));
    return {
      baseline_impervious_m2: baseImpervious,
      baseline_impervious_pct: Math.round((baseImpervious / plot) * 100),
      mitigated_impervious_m2: Math.round(mitigatedImpervious),
      mitigated_impervious_pct: Math.round((mitigatedImpervious / plot) * 100),
      impervious_reduction_m2: Math.round(baseImpervious - mitigatedImpervious)
    };
  },

  calculateStormwaterRunoff(project, environmentalData) {
    return window.RunoffCalculator.calculateScenarios(project, environmentalData);
  },

  calculateRainwaterHarvestingPotential(project, environmentalData, dailyWaterDemandLitres) {
    return window.WaterCalculator.calculateRWH(
      project.site.roof_area,
      environmentalData?.rainfall,
      project.water.occupants,
      dailyWaterDemandLitres
    );
  },

  calculateCarbonImpact(project, treesRecommended = 90) {
    return window.CarbonCalculator.calculateCarbonBalance(project, treesRecommended);
  },

  calculateHeatIslandIndicator(project) {
    return window.HeatIslandCalculator.calculateUHI(
      project.site.plot_area,
      {
        concrete_area: project.surfaces.concrete_area,
        asphalt_area: project.surfaces.asphalt_area,
        standard_roof: project.site.roof_area,
        lawn_grass: project.vegetation.existing_green_area
      },
      project.interventions
    );
  },

  calculateWaterRequirement(project) {
    return window.WaterCalculator.calculateWaterDemand(
      project.building_type,
      project.water.occupants,
      project.water.daily_consumption_lpcd
    );
  },

  calculateRecommendedTrees(project) {
    const treeLoss = this.calculateTreeLoss(project);
    return treeLoss.recommended_planting_quantity;
  },

  calculateGreenRoofRequirement(project) {
    const infra = window.VegetationCalculator.calculateGreenInfrastructureRequirements(
      project.site.roof_area,
      project.surfaces.concrete_area,
      project.energy?.solar_panel_area_m2 || 0
    );
    return infra.recommended_green_roof_m2;
  },

  calculatePermeablePavementRequirement(project) {
    const infra = window.VegetationCalculator.calculateGreenInfrastructureRequirements(
      project.site.roof_area,
      project.surfaces.concrete_area
    );
    return infra.recommended_permeable_pavement_m2;
  },

  calculateSolarPV(project, environmentalData) {
    return window.EnergyCalculator.calculateSolarPotential(
      project.site.roof_area,
      environmentalData?.solar,
      project.energy?.annual_electricity_kwh,
      project.interventions?.solar_pv_area_m2,
      project.interventions?.green_roof_m2 || 0
    );
  },

  /**
   * Run full comprehensive calculation pipeline
   */
  calculateOverallEnvironmentalIndicators(project, environmentalData) {
    const greenCover = this.calculateGreenCoverLoss(project);
    const treeLoss = this.calculateTreeLoss(project);
    const waterDemand = this.calculateWaterRequirement(project);
    const rwh = this.calculateRainwaterHarvestingPotential(project, environmentalData, waterDemand.daily_demand_litres);
    const runoff = this.calculateStormwaterRunoff(project, environmentalData);
    const energy = this.calculateSolarPV(project, environmentalData);
    
    // Attach calculated energy for carbon model
    project.calculated_energy = energy;

    const carbon = this.calculateCarbonImpact(project, treeLoss.recommended_planting_quantity);
    const uhi = this.calculateHeatIslandIndicator(project);
    const infra = window.VegetationCalculator.calculateGreenInfrastructureRequirements(
      project.site.roof_area,
      project.surfaces.concrete_area,
      project.interventions?.solar_pv_area_m2 || 0
    );
    const imperviousImpact = this.calculateImperviousSurfaceImpact(
      project,
      project.interventions?.green_roof_m2 || 0,
      project.interventions?.permeable_pavement_m2 || 0
    );

    // Compute composite score
    const intermediateResults = {
      green_cover: greenCover,
      tree_loss: treeLoss,
      water: rwh,
      runoff: runoff,
      energy: energy,
      carbon: carbon,
      uhi: uhi
    };

    const score = window.ScoreCalculator.calculateScore(project, intermediateResults);

    // Compute comprehensive two-phase Nature Recovery & Mitigation Portfolio
    const recovery = window.NatureRecoveryCalculator
      ? window.NatureRecoveryCalculator.calculateRecoveryPlan(project, { ...intermediateResults, score }, environmentalData)
      : null;

    return {
      timestamp: new Date().toISOString(),
      green_cover: greenCover,
      tree_impact: treeLoss,
      water_demand: waterDemand,
      rwh: rwh,
      runoff: runoff,
      energy: energy,
      carbon: carbon,
      uhi: uhi,
      green_infra_potential: infra,
      impervious_balance: imperviousImpact,
      score: score,
      recovery: recovery
    };
  }
};
