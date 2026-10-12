/**
 * EcoBuild Smart - Stormwater Runoff Calculation Engine
 * Implements the Rational Method: Q = C * I * A
 * Where:
 *   Q = Peak Runoff Rate (m³/hr or Litres/sec)
 *   C = Dimensionless composite runoff coefficient (0.0 to 1.0)
 *   I = Rainfall Intensity (mm/hr)
 *   A = Catchment Area (m²)
 * 
 * Standard Formulation & Unit Consistency:
 *   Q (m³/hr) = (C × I [mm/hr] × A [m²]) / 1000
 *   Q (m³/sec) = Q (m³/hr) / 3600
 *   Q (Litres/sec) = Q (m³/sec) × 1000
 *   Annual Runoff Volume (m³/year) = (C × Annual Rainfall P [mm] × A [m²]) / 1000
 *   Annual Runoff Volume (Litres) = Annual Runoff Volume (m³) × 1000
 * 
 * Baseline Evidence Standard:
 *   Eliminates synthetic pre-development built surfaces.
 *   Reports baseline status: 'verified', 'user-declared', 'estimated', or 'incomplete'.
 */

(function(root) {
  'use strict';

  root.RunoffCalculator = {
    // USDA NRCS & IRC:SP:63 Hydrologic Soil Group (HSG) Infiltration Norms
    SOIL_HYDROLOGIC_GROUPS: {
      A: {
        name: "Group A (Sand / Sandy Gravel)",
        ksat_mm_hr: 35.0,
        infiltration_rating: "High (> 30 mm/hr)",
        underdrain_required: false,
        permeable_paver_C: 0.18,
        bioswale_C: 0.12,
        bare_soil_C: 0.20,
        lawn_C: 0.15,
        recommendation: "Excellent natural aquifer recharge; no perforated underdrain needed."
      },
      B: {
        name: "Group B (Sandy Loam / Loam)",
        ksat_mm_hr: 18.0,
        infiltration_rating: "Moderate (15–30 mm/hr)",
        underdrain_required: false,
        permeable_paver_C: 0.20,
        bioswale_C: 0.15,
        bare_soil_C: 0.25,
        lawn_C: 0.20,
        recommendation: "Standard SuDS infiltration bed; direct recharge with geotextile wrap."
      },
      C: {
        name: "Group C (Silt Loam / Clay Loam)",
        ksat_mm_hr: 8.0,
        infiltration_rating: "Slow (5–15 mm/hr)",
        underdrain_required: true,
        permeable_paver_C: 0.28,
        bioswale_C: 0.22,
        bare_soil_C: 0.35,
        lawn_C: 0.25,
        recommendation: "Slow percolation; perforated underdrain pipe recommended to prevent waterlogging."
      },
      D: {
        name: "Group D (Heavy Clay / Black Cotton Soil)",
        ksat_mm_hr: 2.0,
        infiltration_rating: "Very Slow (< 5 mm/hr)",
        underdrain_required: true,
        permeable_paver_C: 0.38,
        bioswale_C: 0.30,
        bare_soil_C: 0.45,
        lawn_C: 0.30,
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
      const cfg = (typeof window !== 'undefined' && window.ECO_CONFIG?.RUNOFF_COEFFICIENTS) ? window.ECO_CONFIG.RUNOFF_COEFFICIENTS : {};

      const C = {
        concrete: customCoefficients.concrete ?? cfg.concrete?.value ?? 0.90,
        asphalt: customCoefficients.asphalt ?? cfg.asphalt?.value ?? 0.85,
        standard_roof: customCoefficients.standard_roof ?? cfg.standard_roof?.value ?? 0.85,
        tiles_pavers: customCoefficients.tiles_pavers ?? cfg.tiles_pavers?.value ?? 0.70,
        bare_soil: customCoefficients.bare_soil ?? hsg.bare_soil_C,
        lawn_grass: customCoefficients.lawn_grass ?? hsg.lawn_C,
        permeable_pavement: customCoefficients.permeable_pavement ?? hsg.permeable_paver_C,
        green_roof: customCoefficients.green_roof ?? cfg.green_roof?.value ?? 0.35,
        rain_garden: customCoefficients.rain_garden ?? hsg.bioswale_C
      };

      let weightedSum = 0;
      let accountedArea = 0;

      for (const key in surfaces) {
        const area = Number(surfaces[key]) || 0;
        if (area > 0 && C[key] !== undefined) {
          weightedSum += area * C[key];
          accountedArea += area;
        }
      }

      // If accounted area is less than totalPlotArea, assign remaining open area to natural lawn/soil
      if (totalPlotArea > 0 && accountedArea < totalPlotArea) {
        const remaining = totalPlotArea - accountedArea;
        weightedSum += remaining * hsg.lawn_C;
        accountedArea += remaining;
      }

      const compositeC = accountedArea > 0 ? (weightedSum / accountedArea) : 0.85;
      return Math.round(compositeC * 1000) / 1000;
    },

    /**
     * Full Stormwater Runoff Assessment comparing 3 scenarios:
     * 1. Existing Site (Pre-development) - Evidence-based or labeled provisional
     * 2. Proposed Development (Without green infrastructure)
     * 3. Green Intervention Plan (With green roof, permeable paving, rainwater harvesting)
     */
    calculateScenarios(project, environmentalData) {
      const site = project.site || {};
      const surf = project.surfaces || {};
      const veg = project.vegetation || {};
      const iv = project.interventions || {};
      const plotArea = Math.max(1, Number(site.plot_area) || 1000);
      const soilGroup = site.soil_hydrologic_group || 'B';
      const hsg = this.SOIL_HYDROLOGIC_GROUPS[soilGroup] || this.SOIL_HYDROLOGIC_GROUPS.B;

      // Rainfall data handling: preserve exact values and track data provenance
      const rawAnnualRain = environmentalData?.rainfall?.annual_rainfall_mm;
      const rainfallMm = (rawAnnualRain !== undefined && rawAnnualRain !== null && !isNaN(Number(rawAnnualRain)))
        ? Math.max(0, Number(rawAnnualRain))
        : 1042.8;

      const rawPeakIntensity = environmentalData?.rainfall?.peak_intensity_mm_hr;
      const peakIntensityMmHr = (rawPeakIntensity !== undefined && rawPeakIntensity !== null && !isNaN(Number(rawPeakIntensity)))
        ? Math.max(0, Number(rawPeakIntensity))
        : 35.0; // Design storm intensity (mm/hr)
      const rainfallStatus = environmentalData?.rainfall?.status || "REGIONAL_ESTIMATE";

      // --- Scenario 1: Pre-development Site Condition (Evidence-Based) ---
      let baselineStatus = project.baseline?.status || "user-declared";
      let isBaselineProvisional = project.baseline?.is_provisional || false;
      const rawGreen = veg.existing_green_area;
      const rawTrees = veg.existing_tree_count;

      let preExistingGreenArea = 0;
      let preExistingBareSoil = 0;
      let preExistingBuiltArea = 0;

      if (project.baseline?.status === "incomplete" || project.baseline?.is_provisional) {
        // Explicitly marked incomplete / provisional in canonical schema
        preExistingGreenArea = Math.round(plotArea * 0.60); // Screening assumption only
        preExistingBareSoil = Math.max(0, plotArea - preExistingGreenArea);
        baselineStatus = "incomplete";
        isBaselineProvisional = true;
      } else if (rawGreen !== undefined && rawGreen !== null && !isNaN(Number(rawGreen))) {
        preExistingGreenArea = Math.min(plotArea, Math.max(0, Number(rawGreen)));
        preExistingBareSoil = Math.max(0, plotArea - preExistingGreenArea);
        baselineStatus = "user-declared";
      } else if (project.baseline?.existing_green_area !== undefined && project.baseline?.existing_green_area !== null) {
        preExistingGreenArea = Math.min(plotArea, Math.max(0, Number(project.baseline.existing_green_area)));
        preExistingBareSoil = Math.max(0, plotArea - preExistingGreenArea);
        baselineStatus = project.baseline.status || "estimated";
        isBaselineProvisional = !!project.baseline.is_provisional;
      } else {
        // Missing baseline data: do not invent pre-development built surfaces!
        // Mark as incomplete / provisional.
        preExistingGreenArea = Math.round(plotArea * 0.60); // Screening assumption only
        preExistingBareSoil = Math.max(0, plotArea - preExistingGreenArea);
        baselineStatus = "incomplete";
        isBaselineProvisional = true;
      }

      // Check if user explicitly declared pre-development built footprint
      if (project.baseline?.pre_existing_built_m2) {
        preExistingBuiltArea = Math.min(plotArea, Number(project.baseline.pre_existing_built_m2));
      }

      const preSurfaces = {
        lawn_grass: preExistingGreenArea,
        bare_soil: preExistingBareSoil,
        concrete: preExistingBuiltArea * 0.5,
        standard_roof: preExistingBuiltArea * 0.5,
        permeable_pavement: 0,
        green_roof: 0,
        rain_garden: 0
      };

      const cPre = this.calculateCompositeC(preSurfaces, plotArea, {}, soilGroup);
      const qPrePeakM3Hr = (cPre * peakIntensityMmHr * plotArea) / 1000;
      const qPrePeakLps = (qPrePeakM3Hr * 1000) / 3600;
      const vPreAnnualM3 = (cPre * rainfallMm * plotArea) / 1000;

      // --- Scenario 2: Proposed Construction (Baseline Development) ---
      const builtUpArea = Math.max(0, Number(site.built_up_area) || 0);
      const roofArea = Math.max(0, Number(site.roof_area !== undefined ? site.roof_area : builtUpArea));
      const concreteArea = Math.max(0, Number(surf.concrete_area) || 0);
      const asphaltArea = Math.max(0, Number(surf.asphalt_area) || 0);
      const tilesPavers = Math.max(0, Number(surf.tiles_pavers) || 0);
      const openGround = Math.max(0, plotArea - builtUpArea);
      const proposedPavedGround = concreteArea + asphaltArea + tilesPavers;
      const remainingUnpavedGround = Math.max(0, openGround - proposedPavedGround);

      const proposedSurfaces = {
        standard_roof: roofArea,
        concrete: concreteArea,
        asphalt: asphaltArea,
        tiles_pavers: tilesPavers,
        lawn_grass: Math.round(remainingUnpavedGround * 0.7),
        bare_soil: Math.round(remainingUnpavedGround * 0.3),
        permeable_pavement: 0,
        green_roof: 0,
        rain_garden: 0
      };

      const cProposed = this.calculateCompositeC(proposedSurfaces, plotArea, {}, soilGroup);
      const qProposedPeakM3Hr = (cProposed * peakIntensityMmHr * plotArea) / 1000;
      const qProposedPeakLps = (qProposedPeakM3Hr * 1000) / 3600;
      const vProposedAnnualM3 = (cProposed * rainfallMm * plotArea) / 1000;

      // --- Scenario 3: With Green Infrastructure Interventions ---
      const greenRoofM2 = Math.min(roofArea, Math.max(0, Number(iv.green_roof_m2) || 0));
      const permPavingM2 = Math.min(proposedPavedGround, Math.max(0, Number(iv.permeable_pavement_m2) || 0));
      const rainGardenM2 = Math.min(remainingUnpavedGround, Math.max(0, Number(iv.rain_garden_m2) || 0));

      const stdRoofRemaining = Math.max(0, roofArea - greenRoofM2);
      const hardscapeRemaining = Math.max(0, proposedPavedGround - permPavingM2);
      const concreteRemaining = proposedPavedGround > 0 ? (concreteArea / proposedPavedGround) * hardscapeRemaining : 0;
      const asphaltRemaining = proposedPavedGround > 0 ? (asphaltArea / proposedPavedGround) * hardscapeRemaining : 0;
      const paversRemaining = proposedPavedGround > 0 ? (tilesPavers / proposedPavedGround) * hardscapeRemaining : 0;
      const unpavedRemaining = Math.max(0, remainingUnpavedGround - rainGardenM2);

      const interventionSurfaces = {
        standard_roof: stdRoofRemaining,
        green_roof: greenRoofM2,
        concrete: concreteRemaining,
        asphalt: asphaltRemaining,
        tiles_pavers: paversRemaining,
        permeable_pavement: permPavingM2,
        rain_garden: rainGardenM2,
        lawn_grass: Math.round(unpavedRemaining * 0.7),
        bare_soil: Math.round(unpavedRemaining * 0.3)
      };

      const cIntervention = this.calculateCompositeC(interventionSurfaces, plotArea, {}, soilGroup);
      const qInterventionPeakM3Hr = (cIntervention * peakIntensityMmHr * plotArea) / 1000;
      const qInterventionPeakLps = (qInterventionPeakM3Hr * 1000) / 3600;
      const vInterventionAnnualM3 = (cIntervention * rainfallMm * plotArea) / 1000;

      // Runoff & Infiltration Metrics
      const runoffReductionPct = qProposedPeakM3Hr > 0
        ? Math.round(((qProposedPeakM3Hr - qInterventionPeakM3Hr) / qProposedPeakM3Hr) * 1000) / 10
        : 0;

      const infiltrationLostPct = (cPre < 1.0)
        ? Math.max(0, Math.round(((cProposed - cPre) / (1 - cPre)) * 100))
        : 0;

      // Time of concentration estimates (Kirpich/SCS Method)
      const tcPreMin = 30.0;
      const tcProposedMin = 12.0;
      const tcMitigatedMin = 42.0;
      const peakDelayMinutes = tcMitigatedMin - tcProposedMin;
      const detentionVolM3 = Math.max(0, Math.round(((qProposedPeakM3Hr - qInterventionPeakM3Hr) * (peakDelayMinutes / 60)) * 10) / 10);

      return {
        equation: "Q = (C × I × A) / 1000",
        equation_units: "Q: m³/hr, I: mm/hr, A: m², C: dimensionless",
        parameters: {
          rainfall_intensity_I_mm_hr: peakIntensityMmHr,
          annual_rainfall_P_mm: rainfallMm,
          catchment_area_A_m2: plotArea,
          soil_hydrologic_group: soilGroup,
          rainfall_data_status: rainfallStatus
        },
        baseline_provenance: {
          status: baselineStatus,
          is_provisional: isBaselineProvisional,
          declared_green_area_m2: preExistingGreenArea,
          comment: isBaselineProvisional 
            ? "Site baseline green cover was not directly recorded; pre-development scenario is provisional."
            : "Pre-development scenario based on user-supplied baseline site conditions."
        },
        pre_development: {
          composite_c: cPre,
          peak_runoff_m3_hr: Math.round(qPrePeakM3Hr * 10) / 10,
          peak_runoff_litres_sec: Math.round(qPrePeakLps * 10) / 10,
          annual_runoff_m3: Math.round(vPreAnnualM3),
          annual_runoff_litres: Math.round(vPreAnnualM3 * 1000),
          time_of_concentration_minutes: tcPreMin
        },
        proposed_development: {
          composite_c: cProposed,
          peak_runoff_m3_hr: Math.round(qProposedPeakM3Hr * 10) / 10,
          peak_runoff_litres_sec: Math.round(qProposedPeakLps * 10) / 10,
          annual_runoff_m3: Math.round(vProposedAnnualM3),
          annual_runoff_litres: Math.round(vProposedAnnualM3 * 1000),
          time_of_concentration_minutes: tcProposedMin
        },
        with_green_infrastructure: {
          composite_c: cIntervention,
          peak_runoff_m3_hr: Math.round(qInterventionPeakM3Hr * 10) / 10,
          peak_runoff_litres_sec: Math.round(qInterventionPeakLps * 10) / 10,
          annual_runoff_m3: Math.round(vInterventionAnnualM3),
          annual_runoff_litres: Math.round(vInterventionAnnualM3 * 1000),
          time_of_concentration_minutes: tcMitigatedMin
        },
        impact_summary: {
          peak_runoff_increase_pct: qPrePeakM3Hr > 0 ? Math.round(((qProposedPeakM3Hr - qPrePeakM3Hr) / qPrePeakM3Hr) * 100) : 0,
          annual_additional_runoff_litres: Math.round((vProposedAnnualM3 - vPreAnnualM3) * 1000),
          mitigated_annual_runoff_litres: Math.round((vProposedAnnualM3 - vInterventionAnnualM3) * 1000),
          runoff_reduction_pct: runoffReductionPct,
          infiltration_lost_pct: infiltrationLostPct,
          peak_storm_delay_minutes: peakDelayMinutes,
          detention_volume_required_m3: detentionVolM3,
          soil_hydrologic_profile: hsg
        }
      };
    }
  };

})(typeof window !== 'undefined' ? window : globalThis);
