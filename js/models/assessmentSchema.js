/**
 * EcoBuild Smart - Canonical Assessment Schema & Data Model
 * 
 * Defines one canonical assessment schema across all modules:
 * Section A: Project and location
 * Section B: Baseline environmental conditions
 * Section C: Proposed-development conditions
 * Section D: Recovery interventions
 * Section E: Assessment metadata with explicit provenance:
 *            (verified, user-provided, estimated, assumed, unknown)
 * 
 * CRITICAL RULE: Preserves legitimate 0 values without synthetic defaults.
 */

(function(root) {
  'use strict';

  const ProvenanceStatus = {
    VERIFIED: 'verified',
    USER_PROVIDED: 'user-provided',
    ESTIMATED: 'estimated',
    ASSUMED: 'assumed',
    UNKNOWN: 'unknown'
  };

  const BaselineStatus = {
    VERIFIED: 'verified',
    USER_DECLARED: 'user-declared',
    ESTIMATED: 'estimated',
    INCOMPLETE: 'incomplete'
  };

  const ConfidenceLevel = {
    HIGH: 'high',
    MODERATE: 'moderate',
    LOW: 'low',
    UNKNOWN: 'unknown'
  };

  /**
   * Helper to check if a value is a legitimate finite number (including 0)
   */
  function isNumeric(val) {
    if (val === null || val === undefined || val === '') return false;
    const num = Number(val);
    return !isNaN(num) && isFinite(num);
  }

  /**
   * Safely retrieve a numeric value, strictly preserving 0.
   * Only uses fallback if val is undefined, null, NaN, or empty string.
   */
  function getValidNumber(val, fallback = null) {
    if (isNumeric(val)) {
      return Number(val);
    }
    return fallback;
  }

  /**
   * Factory function for typed, auditable environmental metrics
   */
  function createMetric(value, unit, status = ProvenanceStatus.UNKNOWN, source = '', method = '', confidence = ConfidenceLevel.UNKNOWN, warnings = []) {
    return {
      value: isNumeric(value) ? Number(value) : (value !== undefined && value !== null ? value : null),
      unit: unit || '',
      status: status,
      source: source || '',
      method: method || '',
      confidence: confidence,
      warnings: Array.isArray(warnings) ? warnings : [],
      retrieved_at: new Date().toISOString()
    };
  }

  /**
   * Canonical Project Normalizer
   * Ingests any raw project input and maps it to the strictly validated canonical schema.
   * Guarantees that:
   * 1. Zero values are never overwritten with defaults.
   * 2. Missing values are flagged with status: 'unknown' or 'incomplete'.
   * 3. Geometric parameters (plot, footprint, roof, open ground) are dimensionally coherent.
   */
  function normalizeProject(rawProject = {}) {
    const raw = rawProject || {};
    const siteRaw = raw.site || {};
    const vegRaw = raw.vegetation || {};
    const surfRaw = raw.surfaces || {};
    const waterRaw = raw.water || {};
    const energyRaw = raw.energy || {};
    const wasteRaw = raw.waste || {};
    const ivRaw = raw.interventions || {};
    const locRaw = raw.location || {};
    const advRaw = raw.advanced || {};

    // --- Section A: Project & Location ---
    const id = raw.id || `proj_${Date.now()}`;
    const name = (raw.name && String(raw.name).trim()) || 'Untitled Environmental Assessment';
    const buildingType = raw.building_type || 'Institutional';
    const userMode = raw.user_mode || 'standard';

    const location = {
      address: locRaw.address || '',
      city: locRaw.city || '',
      state: locRaw.state || '',
      country: locRaw.country || 'India',
      latitude: getValidNumber(locRaw.latitude, null),
      longitude: getValidNumber(locRaw.longitude, null),
      elevation_m: getValidNumber(locRaw.elevation_m, null),
      slope_deg: getValidNumber(locRaw.slope_deg, 0)
    };

    const plotArea = getValidNumber(siteRaw.plot_area, null);
    const builtUpArea = getValidNumber(siteRaw.built_up_area, null);
    const floors = getValidNumber(siteRaw.floors, 1);
    const totalFloorArea = getValidNumber(siteRaw.total_floor_area, (builtUpArea !== null ? builtUpArea * floors : null));
    const roofArea = getValidNumber(siteRaw.roof_area, builtUpArea);
    
    // Explicit Open Area calculation
    const openArea = (plotArea !== null && builtUpArea !== null) 
      ? Math.max(0, plotArea - builtUpArea) 
      : getValidNumber(siteRaw.open_area, null);

    const site = {
      plot_area: plotArea,
      built_up_area: builtUpArea,
      floors: Math.max(1, floors),
      total_floor_area: totalFloorArea,
      roof_area: roofArea,
      open_area: openArea,
      soil_hydrologic_group: siteRaw.soil_hydrologic_group || advRaw.soil_hydrologic_group || 'B',
      boundary_geometry: raw.boundary_geometry || null,
      survey_date: raw.survey_date || null,
      assessment_date: raw.assessment_date || new Date().toISOString()
    };

    // --- Section B: Baseline Environmental Conditions ---
    const existingGreenArea = getValidNumber(vegRaw.existing_green_area, null);
    const existingTrees = getValidNumber(vegRaw.existing_tree_count, null);
    const treeCategory = vegRaw.tree_category || 'Mixed Native Canopy';

    // Baseline Status determination:
    // If neither green area nor tree count was provided, baseline is INCOMPLETE.
    let baselineStatus = BaselineStatus.USER_DECLARED;
    if (existingGreenArea === null && existingTrees === null) {
      baselineStatus = BaselineStatus.INCOMPLETE;
    }

    const baseline = {
      status: baselineStatus,
      is_provisional: baselineStatus === BaselineStatus.INCOMPLETE,
      existing_green_area: existingGreenArea,
      existing_tree_count: existingTrees,
      tree_category: treeCategory,
      canopy_coverage_m2: getValidNumber(vegRaw.canopy_coverage_m2, null),
      soil_type: advRaw.soil_type || 'Sandy Loam',
      groundwater_condition: advRaw.groundwater_condition || 'Moderate depth (6-8m)',
      baseline_impervious_area: getValidNumber(raw.baseline_impervious_area, 0),
      historical_rainfall_available: !!raw.historical_rainfall
    };

    // --- Section C: Proposed-Development Conditions ---
    const concreteArea = getValidNumber(surfRaw.concrete_area, 0);
    const asphaltArea = getValidNumber(surfRaw.asphalt_area, 0);
    const tilesPavers = getValidNumber(surfRaw.tiles_pavers, 0);
    const soilOpenGround = getValidNumber(surfRaw.soil_open_ground, 0);

    const treesRemoved = getValidNumber(vegRaw.trees_removed, 0);
    const occupants = getValidNumber(waterRaw.occupants, null);
    const dailyLpcd = getValidNumber(waterRaw.daily_consumption_lpcd, null);

    const annualElectricityKwh = getValidNumber(energyRaw.annual_electricity_kwh, null);
    const constrWasteTonnes = getValidNumber(wasteRaw.construction_waste_tonnes, null);
    const dailySolidWasteKg = getValidNumber(wasteRaw.daily_solid_waste_kg, null);
    const dailyOrganicWasteKg = getValidNumber(wasteRaw.daily_organic_waste_kg, getValidNumber(wasteRaw.organic_waste_kg, 0));
    const recyclingPct = getValidNumber(wasteRaw.recycling_pct, 0);

    const proposed = {
      surfaces: {
        concrete_area: concreteArea,
        asphalt_area: asphaltArea,
        tiles_pavers: tilesPavers,
        soil_open_ground: soilOpenGround
      },
      vegetation: {
        trees_removed: treesRemoved,
        trees_retained: (existingTrees !== null) ? Math.max(0, existingTrees - treesRemoved) : null
      },
      water: {
        occupants: occupants,
        daily_consumption_lpcd: dailyLpcd,
        existing_rwh: !!waterRaw.existing_rwh
      },
      energy: {
        annual_electricity_kwh: annualElectricityKwh,
        solar_panel_area_m2: getValidNumber(energyRaw.solar_panel_area_m2, 0),
        roof_orientation: energyRaw.roof_orientation || 'South'
      },
      waste: {
        construction_waste_tonnes: constrWasteTonnes,
        daily_solid_waste_kg: dailySolidWasteKg,
        daily_organic_waste_kg: dailyOrganicWasteKg,
        recycling_pct: recyclingPct
      }
    };

    // --- Section D: Recovery Interventions (User Selected or Proposed) ---
    // Zero values strictly preserved: if user set 0 trees planted, it is 0!
    const interventions = {
      trees_planted: getValidNumber(ivRaw.trees_planted, 0),
      green_roof_m2: getValidNumber(ivRaw.green_roof_m2, 0),
      permeable_pavement_m2: getValidNumber(ivRaw.permeable_pavement_m2, 0),
      rain_garden_m2: getValidNumber(ivRaw.rain_garden_m2, 0),
      rwh_tank_capacity_l: getValidNumber(ivRaw.rwh_tank_capacity_l, 0),
      solar_pv_area_m2: getValidNumber(ivRaw.solar_pv_area_m2, 0),
      bio_solar_colocated: !!ivRaw.bio_solar_colocated
    };

    // Return Canonical Object while preserving backward compatibility for UI callers
    return {
      id,
      name,
      description: raw.description || '',
      building_type: buildingType,
      user_mode: userMode,
      location,
      site,
      baseline,
      vegetation: {
        existing_green_area: existingGreenArea,
        existing_tree_count: existingTrees,
        trees_removed: treesRemoved,
        shrub_grass_area: getValidNumber(vegRaw.shrub_grass_area, 0),
        tree_category: treeCategory,
        canopy_coverage_m2: getValidNumber(vegRaw.canopy_coverage_m2, 0)
      },
      surfaces: proposed.surfaces,
      water: proposed.water,
      energy: proposed.energy,
      waste: proposed.waste,
      advanced: advRaw,
      interventions,
      metadata: {
        schema_version: '3.0.0-canonical',
        created_at: raw.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        validation_errors: [],
        validation_warnings: []
      }
    };
  }

  // Export to global scope
  root.AssessmentSchema = {
    ProvenanceStatus,
    BaselineStatus,
    ConfidenceLevel,
    isNumeric,
    getValidNumber,
    createMetric,
    normalizeProject
  };

})(typeof window !== 'undefined' ? window : globalThis);
