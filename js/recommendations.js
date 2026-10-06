/**
 * EcoBuild Smart - Rule-Based Recommendation Engine & Recovery Planner
 * Synthesizes calculated deficits, site geometry, and climate indicators
 * into an actionable, tailored site recovery strategy.
 */

window.RecommendationEngine = {
  generateRecoveryPlan(project, calculations, environmentalData) {
    const rulesTriggered = [];
    const recommendations = [];

    const greenCover = calculations.green_cover;
    const treeImpact = calculations.tree_impact;
    const runoff = calculations.runoff;
    const rwh = calculations.rwh;
    const energy = calculations.energy;
    const airQuality = environmentalData?.airQuality;
    const rainfall = environmentalData?.rainfall;
    const uhi = calculations.uhi;

    // RULE 1: Impervious Surface Deficit
    if (greenCover.impervious_pct >= 50) {
      rulesTriggered.push("RULE_HIGH_IMPERVIOUS_SURFACE");
      const permM2 = calculations.green_infra_potential.recommended_permeable_pavement_m2;
      recommendations.push({
        id: "rec_permeable_pavement",
        category: "Stormwater & Surface",
        title: "Permeable Pavement & Bioswales",
        action: `Convert approximately ${permM2.toLocaleString()} m² (${calculations.green_infra_potential.permeable_pavement_conversion_pct}%) of concrete/paved areas to permeable interlocking pavers or gravel turf.`,
        quantified_benefit: `Reduces peak runoff by up to ${runoff.impact_summary.runoff_reduction_pct}% and restores local groundwater infiltration.`,
        priority: "High",
        badge_color: "emerald",
        trigger_reason: `Impervious surface currently occupies ${greenCover.impervious_pct}% of the site (recommended threshold is < 50%).`,
        intervention_key: "permeable_pavement_m2",
        recommended_value: permM2
      });
    }

    // RULE 2: Tree Removal Compensatory Planting
    if (treeImpact.trees_removed > 0) {
      rulesTriggered.push("RULE_TREE_REMOVAL");
      recommendations.push({
        id: "rec_tree_planting",
        category: "Biodiversity & Carbon",
        title: "Compensatory Native Tree Planting",
        action: `Plant at least ${treeImpact.recommended_planting_quantity} native trees (Ratio ${treeImpact.replacement_ratio}:1 compensatory planting for ${treeImpact.trees_removed} removed trees).`,
        quantified_benefit: `Restores ${treeImpact.projected_canopy_10yr_m2.toLocaleString()} m² of leafy canopy over 10 years, sequestering ~${Math.round(treeImpact.recommended_planting_quantity * 21.8)} kg CO₂e annually.`,
        priority: "Critical",
        badge_color: "rose",
        trigger_reason: `Felling of ${treeImpact.trees_removed} mature trees destroys an estimated ${treeImpact.estimated_canopy_lost_m2} m² of shade and active carbon absorption.`,
        intervention_key: "trees_planted",
        recommended_value: treeImpact.recommended_planting_quantity,
        suggested_species: ["Neem (Azadirachta indica)", "Indian Beech / Karanj (Pongamia pinnata)", "Jamun (Syzygium cumini)", "Peepal (Ficus religiosa)"]
      });
    }

    // RULE 3: Rainwater Harvesting
    const annualRainMm = rainfall?.annual_rainfall_mm || 1000;
    if (project.site.roof_area >= 200 && annualRainMm >= 400) {
      rulesTriggered.push("RULE_RWH_VIABLE");
      const tankSize = rwh.recommended_storage_range_litres.optimum;
      recommendations.push({
        id: "rec_rwh_storage",
        category: "Water Conservation",
        title: "Rooftop Rainwater Harvesting & Dual-Chamber Storage",
        action: `Install a rainwater harvesting catchment system with an optimum storage capacity of approximately ${tankSize.toLocaleString()} Litres.`,
        quantified_benefit: `Harvests an estimated ${rwh.annual_potential_litres.toLocaleString()} Litres annually, meeting ~${rwh.demand_offset_percentage}% of site non-potable water requirements.`,
        priority: "High",
        badge_color: "blue",
        trigger_reason: `Roof area of ${project.site.roof_area.toLocaleString()} m² in a ${annualRainMm.toFixed(0)} mm rainfall zone offers massive stormwater capture potential.`,
        intervention_key: "rwh_tank_capacity_l",
        recommended_value: tankSize
      });
    }

    // RULE 4: Green Roof Retrofit
    if (project.site.roof_area >= 300) {
      rulesTriggered.push("RULE_GREEN_ROOF");
      const greenRoofM2 = calculations.green_infra_potential.recommended_green_roof_m2;
      recommendations.push({
        id: "rec_green_roof",
        category: "Microclimate & Green Cover",
        title: "Extensive Sedum & Native Shrub Green Roof",
        action: `Construct approximately ${greenRoofM2.toLocaleString()} m² of extensive lightweight green roof (75-120mm substrate) on flat RCC terraces.`,
        quantified_benefit: `Retains 60-70% of incident roof rainwater, lowers top-floor summer radiant heat by 15-20°C, and expands ecological habitat.`,
        priority: "Medium",
        badge_color: "emerald",
        trigger_reason: `Unshaded RCC roof acts as a solar radiator contributing to urban heat island stress (albedo ~0.25).`,
        intervention_key: "green_roof_m2",
        recommended_value: greenRoofM2
      });
    }

    // RULE 5: Rooftop Solar PV Installation
    if (environmentalData?.solar?.daily_peak_sun_hours >= 4.0 && project.site.roof_area >= 200) {
      rulesTriggered.push("RULE_SOLAR_PV");
      const solarM2 = energy.solar_allocated_area_m2;
      recommendations.push({
        id: "rec_solar_pv",
        category: "Renewable Energy",
        title: "Rooftop Solar Photovoltaic (PV) Array",
        action: `Install a ${energy.installed_capacity_kwp} kWp solar PV array across approximately ${solarM2.toLocaleString()} m² of south/south-west oriented roof space.`,
        quantified_benefit: `Generates ~${energy.annual_generation_kwh.toLocaleString()} kWh clean electricity per year, offsetting ${energy.demand_offset_percentage}% of electricity consumption and avoiding ${energy.annual_co2_offset_tonnes} tonnes CO₂e/year.`,
        priority: "High",
        badge_color: "amber",
        trigger_reason: `Location receives abundant solar irradiance (${environmentalData.solar.daily_peak_sun_hours} peak sun hours/day).`,
        intervention_key: "solar_pv_area_m2",
        recommended_value: solarM2
      });
    }

    // RULE 6: Air Quality & Phytoremediation Buffer
    if (airQuality && (airQuality.aqi > 100 || airQuality.pm25 > 35)) {
      rulesTriggered.push("RULE_AIR_QUALITY_STRESS");
      recommendations.push({
        id: "rec_phytoremediation",
        category: "Air Quality & Health",
        title: "Phytoremediation Green Wall & Particulate Buffer",
        action: "Plant multi-tiered dense foliage barriers (Karanj, Bougainvillea, Neem) along site boundaries facing arterial roadways.",
        quantified_benefit: "Intersects up to 25% of ambient PM2.5 and PM10 suspended dust particulates before entering building ventilation intakes.",
        priority: "Medium",
        badge_color: "purple",
        trigger_reason: `Ambient AQI (${airQuality.aqi}) and PM2.5 (${airQuality.pm25} µg/m³) are elevated, necessitating natural bio-filtration.`,
        suggested_species: ["Bougainvillea", "Neem", "Ficus", "Bamboo"]
      });
    }

    // Summary of quantified recovery
    const recoverySummary = {
      trees_to_plant: treeImpact.recommended_planting_quantity,
      green_roof_area_m2: calculations.green_infra_potential.recommended_green_roof_m2,
      permeable_pavement_m2: calculations.green_infra_potential.recommended_permeable_pavement_m2,
      rwh_capacity_litres: rwh.recommended_storage_range_litres.optimum,
      solar_pv_capacity_kwp: energy.installed_capacity_kwp,
      solar_pv_area_m2: energy.solar_allocated_area_m2,
      green_cover_target_increase_pct: Math.round(greenCover.target_green_pct - greenCover.existing_green_pct)
    };

    return {
      rules_evaluated_count: 6,
      rules_triggered: rulesTriggered,
      recommendations: recommendations,
      recovery_summary: recoverySummary,
      disclaimer: "Recommendations are engineering decision-support indicators synthesized from scientific models. Structural load checks and municipal sanctioning are required prior to implementation."
    };
  }
};
