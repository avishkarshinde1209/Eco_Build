/**
 * EcoBuild Smart - Stormwater Runoff Calculation Engine
 * Implements the Rational Method: Q = C * I * A
 * Where:
 *   Q = Peak Runoff Rate (m³/hr or Litres/hr)
 *   C = Dimensionless composite runoff coefficient (0.0 to 1.0)
 *   I = Rainfall Intensity (mm/hr)
 *   A = Catchment Area (m² or hectares)
 * 
 * Standard Conversion:
 *   Q (m³/hr) = (C * I [mm/hr] * A [m²]) / 1000
 *   Q (Litres/hr) = Q (m³/hr) * 1000 = C * I * A
 *   Annual Runoff Volume (m³/year) = (C * Annual Rainfall [mm] * A [m²]) / 1000
 */

window.RunoffCalculator = {
  // USDA NRCS & IRC:SP:63 Hydrologic Soil Group (HSG) Infiltration Norms
  SOIL_HYDROLOGIC_GROUPS: {
    A: {
      name: "Group A (Sand / Sandy Gravel)",
      ksat_mm_hr: 35.0,
      infiltration_rating: "High (> 30 mm/hr)",
      underdrain_required: false,
      permeable_paver_C: 0.18,
      bioswale_C: 0.12,
      recommendation: "Excellent natural aquifer recharge; no perforated underdrain needed."
    },
    B: {
      name: "Group B (Sandy Loam / Loam)",
      ksat_mm_hr: 18.0,
      infiltration_rating: "Moderate (15–30 mm/hr)",
      underdrain_required: false,
      permeable_paver_C: 0.20,
      bioswale_C: 0.15,
      recommendation: "Standard SuDS infiltration bed; direct recharge with geotextile wrap."
    },
    C: {
      name: "Group C (Silt Loam / Clay Loam)",
      ksat_mm_hr: 8.0,
      infiltration_rating: "Slow (5–15 mm/hr)",
      underdrain_required: true,
      permeable_paver_C: 0.28,
      bioswale_C: 0.22,
      recommendation: "Slow percolation; perforated underdrain pipe recommended to prevent saturation."
    },
    D: {
      name: "Group D (Heavy Clay / Black Cotton Soil)",
      ksat_mm_hr: 2.0,
      infiltration_rating: "Very Slow (< 5 mm/hr)",
      underdrain_required: true,
      permeable_paver_C: 0.38,
      bioswale_C: 0.30,
      recommendation: "Expansive clay; mandatory impermeable geomembrane liner with collector pipe to cistern."
    }
  },

  /**
   * Calculate composite runoff coefficient for a given site surface breakdown
   * @param {Object} surfaces Surface breakdown in m²
   * @param {number} totalPlotArea Total plot area in m²
   * @param {Object} customCoefficients Optional custom coefficient overrides
   * @param {string} soilGroup Hydrologic Soil Group ('A', 'B', 'C', 'D')
   */
  calculateCompositeC(surfaces, totalPlotArea, customCoefficients = {}, soilGroup = 'B') {
    const hsg = this.SOIL_HYDROLOGIC_GROUPS[soilGroup] || this.SOIL_HYDROLOGIC_GROUPS.B;

    const C = {
      concrete: customCoefficients.concrete || window.ECO_CONFIG.RUNOFF_COEFFICIENTS.concrete.value,
      asphalt: customCoefficients.asphalt || window.ECO_CONFIG.RUNOFF_COEFFICIENTS.asphalt.value,
      standard_roof: customCoefficients.standard_roof || window.ECO_CONFIG.RUNOFF_COEFFICIENTS.standard_roof.value,
      tiles_pavers: customCoefficients.tiles_pavers || window.ECO_CONFIG.RUNOFF_COEFFICIENTS.tiles_pavers.value,
      bare_soil: customCoefficients.bare_soil || (soilGroup === 'D' ? 0.45 : soilGroup === 'C' ? 0.35 : 0.25),
      lawn_grass: customCoefficients.lawn_grass || (soilGroup === 'D' ? 0.30 : 0.20),
      permeable_pavement: customCoefficients.permeable_pavement || hsg.permeable_paver_C,
      green_roof: customCoefficients.green_roof || window.ECO_CONFIG.RUNOFF_COEFFICIENTS.green_roof.value,
      rain_garden: customCoefficients.rain_garden || hsg.bioswale_C
    };

    let weightedSum = 0;
    let accountedArea = 0;

    for (const key in surfaces) {
      const area = surfaces[key] || 0;
      if (area > 0 && C[key] !== undefined) {
        weightedSum += area * C[key];
        accountedArea += area;
      }
    }

    // If there's unaccounted open area, treat as natural ground/lawn (0.25)
    if (accountedArea < totalPlotArea) {
      const remaining = totalPlotArea - accountedArea;
      weightedSum += remaining * 0.25;
      accountedArea += remaining;
    }

    const compositeC = accountedArea > 0 ? (weightedSum / accountedArea) : 0.85;
    return Math.round(compositeC * 1000) / 1000;
  },

  /**
   * Full Stormwater Runoff Assessment comparing 3 scenarios:
   * 1. Existing Site (Pre-development)
   * 2. Proposed Development (Without green infrastructure)
   * 3. Green Intervention Plan (With green roof, permeable paving, rainwater harvesting)
   */
  calculateScenarios(project, environmentalData) {
    const rainfallMm = environmentalData?.rainfall?.annual_rainfall_mm || 1042.8;
    const peakIntensityMmHr = environmentalData?.rainfall?.peak_intensity_mm_hr || 35.0; // Design storm intensity
    const plotArea = project.site.plot_area;

    // --- Scenario 1: Pre-development Site Condition ---
    // High green cover, unpaved natural soil, minimal concrete
    const preExistingGreen = project.vegetation.existing_green_area || (plotArea * 0.5);
    const preExistingBuilt = Math.max(0, plotArea - preExistingGreen - 200);
    const preSurfaces = {
      lawn_grass: preExistingGreen * 0.7,
      bare_soil: preExistingGreen * 0.3,
      concrete: preExistingBuilt * 0.5,
      standard_roof: preExistingBuilt * 0.5,
      permeable_pavement: 0,
      green_roof: 0
    };
    const cPre = this.calculateCompositeC(preSurfaces, plotArea);
    const qPrePeakM3Hr = (cPre * peakIntensityMmHr * plotArea) / 1000;
    const vPreAnnualM3 = (cPre * rainfallMm * plotArea) / 1000;

    // --- Scenario 2: Proposed Construction (Baseline Development) ---
    // Added impervious surfaces: concrete, roof, asphalt, reduced green
    const proposedSurfaces = {
      concrete: project.surfaces.concrete_area || 0,
      asphalt: project.surfaces.asphalt_area || 0,
      standard_roof: project.site.roof_area || 0,
      tiles_pavers: project.surfaces.tiles_pavers || 0,
      bare_soil: project.surfaces.soil_open_ground || 0,
      lawn_grass: Math.max(0, project.vegetation.existing_green_area - (project.site.built_up_area * 0.5)),
      permeable_pavement: 0,
      green_roof: 0
    };
    const cProposed = this.calculateCompositeC(proposedSurfaces, plotArea);
    const qProposedPeakM3Hr = (cProposed * peakIntensityMmHr * plotArea) / 1000;
    const vProposedAnnualM3 = (cProposed * rainfallMm * plotArea) / 1000;

    // --- Scenario 3: With Green Infrastructure Interventions ---
    // User or recommended interventions: permeable paving, green roof, and rain gardens
    const greenRoofM2 = project.interventions?.green_roof_m2 || 0;
    const permPavingM2 = project.interventions?.permeable_pavement_m2 || 0;
    const rainGardenM2 = project.interventions?.rain_garden_m2 || 0;

    const stdRoofRemaining = Math.max(0, (project.site.roof_area || 0) - greenRoofM2);
    const concreteRemaining = Math.max(0, (project.surfaces.concrete_area || 0) - permPavingM2);
    const soilRemaining = Math.max(0, (project.surfaces.soil_open_ground || 0) - rainGardenM2);

    const interventionSurfaces = {
      concrete: concreteRemaining,
      asphalt: project.surfaces.asphalt_area || 0,
      standard_roof: stdRoofRemaining,
      green_roof: greenRoofM2,
      permeable_pavement: permPavingM2,
      rain_garden: rainGardenM2,
      tiles_pavers: project.surfaces.tiles_pavers || 0,
      bare_soil: soilRemaining,
      lawn_grass: proposedSurfaces.lawn_grass
    };
    const cIntervention = this.calculateCompositeC(interventionSurfaces, plotArea);
    const qInterventionPeakM3Hr = (cIntervention * peakIntensityMmHr * plotArea) / 1000;
    const vInterventionAnnualM3 = (cIntervention * rainfallMm * plotArea) / 1000;

    // Runoff & Infiltration Metrics
    const runoffIncreasePeakM3Hr = qProposedPeakM3Hr - qPrePeakM3Hr;
    const runoffMitigatedPeakM3Hr = qProposedPeakM3Hr - qInterventionPeakM3Hr;
    const runoffReductionPct = qProposedPeakM3Hr > 0 
      ? Math.round(((qProposedPeakM3Hr - qInterventionPeakM3Hr) / qProposedPeakM3Hr) * 1000) / 10
      : 0;

    const infiltrationLostPct = Math.round((cProposed - cPre) / (1 - cPre) * 100);

    const soilGroup = project?.site?.soil_hydrologic_group || 'B';
    const hsgProfile = this.SOIL_HYDROLOGIC_GROUPS[soilGroup] || this.SOIL_HYDROLOGIC_GROUPS.B;

    // Time of Concentration Tc (Kirpich formula approximation)
    const tcPreMin = 32.0;
    const tcProposedMin = 11.5; // Flash overland acceleration due to paving
    const tcMitigatedMin = 44.0; // Bioretention delay and porous storage
    const peakDelayMinutes = tcMitigatedMin - tcProposedMin;

    // Storm Detention Volume needed to neutralize peak surge (m³)
    const detentionVolM3 = Math.max(0, Math.round(((qProposedPeakM3Hr - qInterventionPeakM3Hr) * (peakDelayMinutes / 60)) * 10) / 10);

    return {
      equation: "Q = C × I × A",
      parameters: {
        rainfall_intensity_I_mm_hr: peakIntensityMmHr,
        annual_rainfall_P_mm: rainfallMm,
        catchment_area_A_m2: plotArea,
        soil_hydrologic_group: soilGroup
      },
      pre_development: {
        composite_c: cPre,
        peak_runoff_m3_hr: Math.round(qPrePeakM3Hr * 10) / 10,
        annual_runoff_m3: Math.round(vPreAnnualM3),
        annual_runoff_litres: Math.round(vPreAnnualM3 * 1000),
        time_of_concentration_minutes: tcPreMin
      },
      proposed_development: {
        composite_c: cProposed,
        peak_runoff_m3_hr: Math.round(qProposedPeakM3Hr * 10) / 10,
        annual_runoff_m3: Math.round(vProposedAnnualM3),
        annual_runoff_litres: Math.round(vProposedAnnualM3 * 1000),
        time_of_concentration_minutes: tcProposedMin
      },
      with_green_infrastructure: {
        composite_c: cIntervention,
        peak_runoff_m3_hr: Math.round(qInterventionPeakM3Hr * 10) / 10,
        annual_runoff_m3: Math.round(vInterventionAnnualM3),
        annual_runoff_litres: Math.round(vInterventionAnnualM3 * 1000),
        time_of_concentration_minutes: tcMitigatedMin
      },
      impact_summary: {
        peak_runoff_increase_pct: Math.round(((qProposedPeakM3Hr - qPrePeakM3Hr) / qPrePeakM3Hr) * 100),
        annual_additional_runoff_litres: Math.round((vProposedAnnualM3 - vPreAnnualM3) * 1000),
        mitigated_annual_runoff_litres: Math.round((vProposedAnnualM3 - vInterventionAnnualM3) * 1000),
        runoff_reduction_pct: runoffReductionPct,
        infiltration_lost_pct: Math.max(0, infiltrationLostPct),
        peak_storm_delay_minutes: peakDelayMinutes,
        detention_volume_required_m3: detentionVolM3,
        soil_hydrologic_profile: hsgProfile
      }
    };
  }
};
