/**
 * EcoBuild Smart - Data Validation & Physical Constraint Engine
 * Validates site geometric constraints, physical sanity rules,
 * zero-value legitimacy, and user inputs across both Basic and Advanced entry modes.
 */

(function(root) {
  'use strict';

  root.ValidationEngine = {
    /**
     * Comprehensive Project Validation before calculation pipeline begins.
     * Checks geometric sanity, physical bounds, tree balances, and surface consistency.
     */
    validateProject(project) {
      const errors = {};
      const warnings = [];
      const limitations = [];

      if (!project) {
        return {
          isValid: false,
          isPreliminary: true,
          errors: { project: "No project object supplied for validation." },
          warnings: [],
          limitations: ["Project data missing entirely."],
          areaAccounting: null
        };
      }

      const site = project.site || {};
      const veg = project.vegetation || {};
      const surf = project.surfaces || {};
      const water = project.water || {};
      const energy = project.energy || {};
      const waste = project.waste || {};
      const iv = project.interventions || {};
      const loc = project.location || {};

      // 1. Site Geometric Constraints
      const plot = Number(site.plot_area);
      const builtUp = Number(site.built_up_area);
      const floors = Number(site.floors !== undefined ? site.floors : 1);
      const roof = Number(site.roof_area !== undefined ? site.roof_area : builtUp);

      if (isNaN(plot) || plot <= 0) {
        errors.plot_area = "Plot area must be a strictly positive number greater than 0 m².";
      }
      if (isNaN(builtUp) || builtUp < 0) {
        errors.built_up_area = "Building footprint area cannot be negative.";
      } else if (plot > 0 && builtUp > plot) {
        errors.built_up_area = `Building footprint (${builtUp} m²) cannot exceed total plot area (${plot} m²).`;
      }
      if (isNaN(floors) || floors < 1) {
        errors.floors = "Number of floors must be an integer >= 1.";
      }
      if (isNaN(roof) || roof < 0) {
        errors.roof_area = "Roof area cannot be negative.";
      } else if (builtUp > 0 && roof > builtUp * 1.5) {
        warnings.push(`Roof area (${roof} m²) is substantially larger than building footprint (${builtUp} m²); check cantilever geometry.`);
      }

      const openGround = (plot > 0 && builtUp >= 0) ? Math.max(0, plot - builtUp) : 0;

      // 2. Surface Breakdown Checks
      const concrete = Math.max(0, Number(surf.concrete_area) || 0);
      const asphalt = Math.max(0, Number(surf.asphalt_area) || 0);
      const pavers = Math.max(0, Number(surf.tiles_pavers) || 0);
      const soil = Math.max(0, Number(surf.soil_open_ground) || 0);

      if (surf.concrete_area !== undefined && Number(surf.concrete_area) < 0) errors.concrete_area = "Concrete area cannot be negative.";
      if (surf.asphalt_area !== undefined && Number(surf.asphalt_area) < 0) errors.asphalt_area = "Asphalt area cannot be negative.";
      if (surf.tiles_pavers !== undefined && Number(surf.tiles_pavers) < 0) errors.tiles_pavers = "Tiles/pavers area cannot be negative.";
      if (surf.soil_open_ground !== undefined && Number(surf.soil_open_ground) < 0) errors.soil_open_ground = "Soil/open ground area cannot be negative.";

      // Surface area sum check: Hardscape + soil + built-up should not exceed plot area
      const totalPaved = concrete + asphalt + pavers;
      if (plot > 0 && (builtUp + totalPaved + soil) > plot * 1.05) {
        errors.surface_overflow = `Sum of building footprint (${builtUp} m²), paving (${totalPaved} m²), and soil (${soil} m²) exceeds plot area (${plot} m²).`;
      }

      // 3. Tree & Vegetation Validation
      const existingTrees = veg.existing_tree_count !== undefined && veg.existing_tree_count !== null ? Number(veg.existing_tree_count) : null;
      const treesRemoved = veg.trees_removed !== undefined && veg.trees_removed !== null ? Number(veg.trees_removed) : 0;
      const existingGreen = veg.existing_green_area !== undefined && veg.existing_green_area !== null ? Number(veg.existing_green_area) : null;

      if (existingTrees !== null) {
        if (existingTrees < 0) errors.existing_tree_count = "Existing tree count cannot be negative.";
        if (treesRemoved < 0) errors.trees_removed = "Trees removed count cannot be negative.";
        if (treesRemoved > existingTrees) {
          errors.trees_removed = `Trees removed (${treesRemoved}) exceeds existing trees on site (${existingTrees}).`;
        }
      } else {
        limitations.push("Existing site tree count is unrecorded (baseline provisional).");
      }

      if (existingGreen !== null) {
        if (existingGreen < 0) errors.existing_green_area = "Existing green area cannot be negative.";
        if (plot > 0 && existingGreen > plot) {
          errors.existing_green_area = `Existing green area (${existingGreen} m²) cannot exceed total plot area (${plot} m²).`;
        }
      } else {
        limitations.push("Pre-development green cover is unrecorded (baseline provisional).");
      }

      // 4. Physical Area Accounting for Recovery Interventions
      const greenRoof = Math.max(0, Number(iv.green_roof_m2) || 0);
      const solarArea = Math.max(0, Number(iv.solar_pv_area_m2) || 0);
      const permPaver = Math.max(0, Number(iv.permeable_pavement_m2) || 0);
      const rainGarden = Math.max(0, Number(iv.rain_garden_m2) || 0);
      const treesPlanted = Math.max(0, Number(iv.trees_planted) || 0);
      const isBioSolar = !!iv.bio_solar_colocated;

      if (roof <= 0 && greenRoof > 0) {
        errors.green_roof_m2 = `Cannot allocate green roof (${greenRoof} m²) on site with 0 m² usable roof area.`;
      }
      if (roof <= 0 && solarArea > 0) {
        errors.solar_pv_area_m2 = `Cannot allocate solar PV (${solarArea} m²) on site with 0 m² usable roof area.`;
      }
      if (roof > 0) {
        if (greenRoof > roof) {
          errors.green_roof_m2 = `Green roof area (${greenRoof} m²) exceeds available roof area (${roof} m²).`;
        }
        if (solarArea > roof) {
          errors.solar_pv_area_m2 = `Solar PV area (${solarArea} m²) exceeds available roof area (${roof} m²).`;
        }
        if (!isBioSolar && (greenRoof + solarArea) > roof * 1.02) {
          errors.roof_allocation_conflict = `Combined green roof (${greenRoof} m²) and solar PV (${solarArea} m²) exceed total roof area (${roof} m²). Enable bio-solar co-location if panels are elevated above extensive sedum.`;
        } else if (isBioSolar && (greenRoof + solarArea) > roof * 1.8) {
          errors.roof_allocation_conflict = `Bio-solar co-located systems cannot exceed 1.8x single roof footprint envelope (${roof} m²).`;
        }
      }

      if (permPaver > 0 && totalPaved > 0 && permPaver > totalPaved * 1.05) {
        errors.permeable_pavement_m2 = `Permeable paving replacement (${permPaver} m²) exceeds available hardscape pavement (${totalPaved} m²).`;
      }

      // Ground allocation accounting:
      // Mutually exclusive ground interventions: permeable paving + rain gardens/bioswales cannot exceed open ground
      const groundInterventionsSum = rainGarden;
      if (openGround > 0 && groundInterventionsSum > openGround) {
        errors.ground_allocation_conflict = `Rain garden / bioretention allocation (${rainGarden} m²) exceeds total open ground area (${openGround} m²).`;
      }

      // Tree planting physical constraint: Standard trees require min 16 m² root zone (4x4m grid)
      // Dedicated Miyawaki micro-forest can support 3-4 saplings/m²
      const maxStandardGroundTrees = openGround > 0 ? Math.floor(openGround / 16) : 0;
      if (openGround === 0 && treesPlanted > 0) {
        errors.trees_planted = `Cannot plant ground trees on a zero lot-line site (open ground area is 0 m²).`;
      } else if (openGround > 0 && treesPlanted > maxStandardGroundTrees * 4) {
        // Warning if dense afforestation assumption is required
        warnings.push(`Proposed planting of ${treesPlanted} trees on ${openGround} m² open ground requires dense Miyawaki micro-forest afforestation (standard canopy tree capacity is ~${maxStandardGroundTrees} trees).`);
      }

      // 5. Water & Energy Checks
      if (water.occupants !== undefined && water.occupants !== null) {
        const occ = Number(water.occupants);
        if (occ < 0) errors.occupants = "Occupant count cannot be negative.";
      }
      if (water.daily_consumption_lpcd !== undefined && water.daily_consumption_lpcd !== null) {
        const lpcd = Number(water.daily_consumption_lpcd);
        if (lpcd < 0) errors.daily_consumption_lpcd = "Water consumption (LPCD) cannot be negative.";
      }
      if (energy.annual_electricity_kwh !== undefined && energy.annual_electricity_kwh !== null) {
        const kwh = Number(energy.annual_electricity_kwh);
        if (kwh < 0) errors.annual_electricity_kwh = "Electricity demand cannot be negative.";
      }
      if (waste.recycling_pct !== undefined && waste.recycling_pct !== null) {
        const rec = Number(waste.recycling_pct);
        if (rec < 0 || rec > 100) errors.recycling_pct = "Recycling percentage must be between 0% and 100%.";
      }

      const isValid = Object.keys(errors).length === 0;
      const isPreliminary = limitations.length > 0;

      return {
        isValid,
        isPreliminary,
        errors,
        warnings,
        limitations,
        areaAccounting: {
          plot_area: plot,
          built_up_area: builtUp,
          open_ground_area: openGround,
          roof_area: roof,
          roof_allocated_area: greenRoof + (isBioSolar ? 0 : solarArea),
          roof_unallocated_area: Math.max(0, roof - (greenRoof + (isBioSolar ? 0 : solarArea))),
          ground_allocated_area: groundInterventionsSum,
          ground_unallocated_area: Math.max(0, openGround - groundInterventionsSum)
        }
      };
    },

    /**
     * Wizard Step Validation for Step-by-Step UI
     */
    validateStep(stepNumber, formData) {
      const errors = {};
      const warnings = [];

      switch (stepNumber) {
        case 1: // Project info
          if (!formData.name || String(formData.name).trim().length < 3) {
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
          if (isNaN(builtUp) || builtUp < 0) {
            errors.built_up_area = "Built-up footprint cannot be negative.";
          } else if (builtUp > plot) {
            errors.built_up_area = `Building footprint (${builtUp} m²) cannot exceed total plot area (${plot} m²).`;
          }
          if (isNaN(floors) || floors < 1) {
            errors.floors = "Number of floors must be at least 1.";
          }
          if (isNaN(roof) || roof < 0) {
            errors.roof_area = "Roof area cannot be negative.";
          } else if (roof > builtUp * 1.5) {
            warnings.push("Roof area is larger than building footprint (check overhangs or terrace geometry).");
          }
          break;

        case 3: // Vegetation
          const plotAreaVeg = parseFloat(formData.site?.plot_area || 0);
          const green = parseFloat(formData.vegetation?.existing_green_area);
          const trees = parseInt(formData.vegetation?.existing_tree_count, 10);
          const removed = parseInt(formData.vegetation?.trees_removed, 10);

          if (!isNaN(green)) {
            if (green < 0) {
              errors.existing_green_area = "Existing green area cannot be negative.";
            } else if (plotAreaVeg > 0 && green > plotAreaVeg) {
              errors.existing_green_area = `Existing green area (${green} m²) cannot exceed total plot area (${plotAreaVeg} m²).`;
            }
          }

          if (!isNaN(trees) && trees < 0) {
            errors.existing_tree_count = "Existing tree count cannot be negative.";
          }
          if (!isNaN(removed)) {
            if (removed < 0) {
              errors.trees_removed = "Number of trees removed cannot be negative.";
            } else if (!isNaN(trees) && removed > trees) {
              errors.trees_removed = `Trees removed (${removed}) cannot exceed existing trees on site (${trees}).`;
            }
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
          if (plotAreaSurf > 0 && totalSurfaceSum > plotAreaSurf * 1.05) {
            errors.surface_overflow = `Sum of surfaces (${totalSurfaceSum.toFixed(0)} m²) exceeds available plot area (${plotAreaSurf.toFixed(0)} m²).`;
          }
          break;

        case 5: // Water
          const occupants = parseInt(formData.water?.occupants, 10);
          const lpcd = parseFloat(formData.water?.daily_consumption_lpcd || 0);

          if (!isNaN(occupants) && occupants < 0) {
            errors.occupants = "Number of occupants cannot be negative.";
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
            warnings.push("Precise location coordinates not specified; using regional climate reference.");
          }

          if (formData.interventions) {
            const usableRoof = parseFloat(formData.site?.roof_area || 0);
            const greenRoof = parseFloat(formData.interventions?.green_roof_m2 || 0);
            const solarArea = parseFloat(formData.interventions?.solar_pv_area_m2 || 0);
            const openGround = parseFloat(formData.site?.open_area || Math.max(0, (formData.site?.plot_area || 0) - (formData.site?.built_up_area || 0)));
            const treesProposed = parseInt(formData.interventions?.trees_planted || 0, 10);
            const concretePaved = parseFloat(formData.surfaces?.concrete_area || 0) + parseFloat(formData.surfaces?.asphalt_area || 0);
            const permProposed = parseFloat(formData.interventions?.permeable_pavement_m2 || 0);

            if (usableRoof > 0 && greenRoof > usableRoof) {
              errors.green_roof_exceeded = `Roof area exceeded: Green roof (${greenRoof} m²) exceeds usable roof area (${usableRoof} m²).`;
            }
            if (usableRoof > 0 && !formData.interventions?.bio_solar_colocated && (greenRoof + solarArea) > usableRoof * 1.02) {
              errors.roof_capacity_exceeded = `Roof capacity exceeded: Total green roof (${greenRoof} m²) and solar PV (${solarArea} m²) exceed allowable roof envelope (${usableRoof} m²).`;
            }
            if (openGround === 0 && treesProposed > 0) {
              errors.tree_capacity_exceeded = `Cannot plant ground trees on a zero open ground site.`;
            }
            if (concretePaved > 0 && permProposed > concretePaved * 1.05) {
              errors.pavement_exceeded = `Proposed permeable paver replacement (${permProposed} m²) exceeds existing hardscape (${concretePaved} m²).`;
            }
          }
          break;
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors,
        warnings
      };
    }
  };

})(typeof window !== 'undefined' ? window : globalThis);
