/**
 * EcoBuild Smart - Data Validation Engine
 * Validates site geometric constraints, physical sanity rules,
 * and user inputs across both Basic and Advanced entry modes.
 */

window.ValidationEngine = {
  validateStep(stepNumber, formData) {
    const errors = {};
    const warnings = [];

    switch (stepNumber) {
      case 1: // Project info
        if (!formData.name || formData.name.trim().length < 3) {
          errors.name = "Project name is required and must be at least 3 characters.";
        }
        if (!formData.building_type) {
          errors.building_type = "Please select a valid building type.";
        }
        break;

      case 2: // Site info
        const plot = parseFloat(formData.site?.plot_area);
        const builtUp = parseFloat(formData.site?.built_up_area);
        const floors = parseInt(formData.site?.floors, 10);
        const roof = parseFloat(formData.site?.roof_area);

        if (isNaN(plot) || plot <= 0) {
          errors.plot_area = "Plot area must be a positive number greater than 0 m².";
        }
        if (isNaN(builtUp) || builtUp <= 0) {
          errors.built_up_area = "Built-up footprint must be greater than 0 m².";
        } else if (builtUp > plot) {
          errors.built_up_area = `Building footprint (${builtUp} m²) cannot exceed total plot area (${plot} m²).`;
        }
        if (isNaN(floors) || floors < 1) {
          errors.floors = "Number of floors must be at least 1.";
        }
        if (isNaN(roof) || roof <= 0) {
          errors.roof_area = "Roof area must be greater than 0 m².";
        } else if (roof > builtUp * 1.2) {
          warnings.push("Roof area is larger than building footprint (check overhangs or terrace geometry).");
        }
        break;

      case 3: // Vegetation
        const plotAreaVeg = parseFloat(formData.site?.plot_area || 0);
        const green = parseFloat(formData.vegetation?.existing_green_area);
        const trees = parseInt(formData.vegetation?.existing_tree_count, 10);
        const removed = parseInt(formData.vegetation?.trees_removed, 10);

        if (isNaN(green) || green < 0) {
          errors.existing_green_area = "Existing green area cannot be negative.";
        } else if (plotAreaVeg > 0 && green > plotAreaVeg) {
          errors.existing_green_area = `Existing green area (${green} m²) cannot exceed total plot area (${plotAreaVeg} m²).`;
        }

        if (isNaN(trees) || trees < 0) {
          errors.existing_tree_count = "Existing tree count cannot be negative.";
        }
        if (isNaN(removed) || removed < 0) {
          errors.trees_removed = "Number of trees removed cannot be negative.";
        } else if (removed > trees) {
          errors.trees_removed = `Trees removed (${removed}) cannot exceed existing trees on site (${trees}).`;
        }
        break;

      case 4: // Surfaces
        const plotAreaSurf = parseFloat(formData.site?.plot_area || 0);
        const builtSurf = parseFloat(formData.site?.built_up_area || 0);
        const concrete = parseFloat(formData.surfaces?.concrete_area || 0);
        const asphalt = parseFloat(formData.surfaces?.asphalt_area || 0);
        const pavers = parseFloat(formData.surfaces?.tiles_pavers || 0);
        const soil = parseFloat(formData.surfaces?.soil_open_ground || 0);

        if (concrete < 0) errors.concrete_area = "Concrete area cannot be negative.";
        if (asphalt < 0) errors.asphalt_area = "Asphalt area cannot be negative.";
        if (pavers < 0) errors.tiles_pavers = "Tiles/pavers area cannot be negative.";
        if (soil < 0) errors.soil_open_ground = "Soil/open ground area cannot be negative.";

        const totalSurfaceSum = builtSurf + concrete + asphalt + pavers + soil;
        if (plotAreaSurf > 0 && totalSurfaceSum > plotAreaSurf * 1.05) { // allow 5% leeway for 3D elevation
          errors.surface_overflow = `Sum of surfaces (${totalSurfaceSum.toFixed(0)} m²) exceeds available plot area (${plotAreaSurf.toFixed(0)} m²). Please adjust concrete, asphalt, or ground areas.`;
        }
        break;

      case 5: // Water
        const occupants = parseInt(formData.water?.occupants, 10);
        const lpcd = parseFloat(formData.water?.daily_consumption_lpcd || 0);

        if (isNaN(occupants) || occupants <= 0) {
          errors.occupants = "Number of occupants must be a positive integer greater than 0.";
        }
        if (lpcd < 0) {
          errors.daily_consumption_lpcd = "Water consumption per capita cannot be negative.";
        }
        break;

      case 6: // Energy
        const electricity = parseFloat(formData.energy?.annual_electricity_kwh || 0);
        const solar = parseFloat(formData.energy?.solar_panel_area_m2 || 0);
        const roofAreaEnergy = parseFloat(formData.site?.roof_area || 0);

        if (electricity < 0) errors.annual_electricity_kwh = "Electricity consumption cannot be negative.";
        if (solar < 0) errors.solar_panel_area_m2 = "Solar panel area cannot be negative.";
        if (roofAreaEnergy > 0 && solar > roofAreaEnergy) {
          errors.solar_panel_area_m2 = `Solar panel area (${solar} m²) cannot exceed available roof area (${roofAreaEnergy} m²).`;
        }
        break;

      case 7: // Waste
        const constrWaste = parseFloat(formData.waste?.construction_waste_tonnes || 0);
        const recycling = parseFloat(formData.waste?.recycling_pct || 0);

        if (constrWaste < 0) errors.construction_waste_tonnes = "Construction waste cannot be negative.";
        if (recycling < 0 || recycling > 100) {
          errors.recycling_pct = "Recycling percentage must be between 0% and 100%.";
        }
        break;

      case 8: // Environmental conditions & Interventions
        if (!formData.location?.latitude || !formData.location?.longitude) {
          errors.location = "Valid location coordinates (latitude and longitude) are required.";
        }

        // Smart Intervention Physical Constraint Checks
        if (formData.interventions) {
          const usableRoof = parseFloat(formData.site?.roof_area || 0);
          const greenRoof = parseFloat(formData.interventions?.green_roof_m2 || 0);
          const solarArea = parseFloat(formData.interventions?.solar_pv_area_m2 || 0);
          const openGround = parseFloat(formData.site?.open_area || (formData.site?.plot_area - formData.site?.built_up_area) || 0);
          const treesProposed = parseInt(formData.interventions?.trees_planted || 0, 10);
          const concretePaved = parseFloat(formData.surfaces?.concrete_area || 0) + parseFloat(formData.surfaces?.asphalt_area || 0);
          const permProposed = parseFloat(formData.interventions?.permeable_pavement_m2 || 0);

          if (usableRoof > 0 && greenRoof > usableRoof) {
            errors.green_roof_exceeded = `Roof area exceeded: Green roof area (${greenRoof} m²) cannot exceed usable roof area (${usableRoof} m²).`;
          }
          if (usableRoof > 0 && (greenRoof + solarArea) > usableRoof * 1.5) { // allow 50% overlap for bio-solar
            errors.roof_capacity_exceeded = `Roof capacity exceeded: Total green roof (${greenRoof} m²) and solar PV (${solarArea} m²) exceed allowable roof envelope (${usableRoof} m²).`;
          }
          const maxFeasibleTrees = Math.floor(openGround / 16); // 16 m² minimum per tree (4x4m grid)
          if (maxFeasibleTrees > 0 && treesProposed > maxFeasibleTrees * 1.5) {
            errors.tree_capacity_exceeded = `Site capacity exceeded: Proposed ${treesProposed} trees exceeds physical planting capacity (${maxFeasibleTrees} trees based on 16 m² root spacing).`;
          }
          if (concretePaved > 0 && permProposed > concretePaved) {
            errors.pavement_exceeded = `Paved area exceeded: Proposed permeable paver replacement (${permProposed} m²) exceeds existing concrete/asphalt hardscape (${concretePaved} m²).`;
          }
        }
        break;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors,
      warnings: warnings
    };
  }
};
