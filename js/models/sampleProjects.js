/**
 * EcoBuild Smart - Sample Demonstration Projects
 * Includes official Kolhapur academic demonstration dataset.
 */

window.ECO_SAMPLE_PROJECTS = {
  kolhapur_academic: {
    id: "proj_kolhapur_demo",
    name: "Kolhapur Engineering Campus Expansion",
    description: "Proposed institutional campus building block with laboratory and auditorium in Kolhapur, Maharashtra.",
    building_type: "Institutional",
    user_mode: "advanced",
    location: {
      address: "Kolhapur, Maharashtra, India",
      city: "Kolhapur",
      state: "Maharashtra",
      country: "India",
      latitude: 16.7050,
      longitude: 74.2433,
      elevation_m: 569
    },
    site: {
      plot_area: 5000,          // m²
      built_up_area: 2200,      // m² (Footprint)
      total_floor_area: 4400,   // m² (2 floors)
      floors: 2,
      roof_area: 2200,          // m²
      open_area: 2800           // m² (5000 - 2200)
    },
    vegetation: {
      existing_green_area: 2400, // m²
      existing_tree_count: 80,
      trees_removed: 30,
      shrub_grass_area: 1600,    // m²
      tree_category: "Mixed Tropical Canopy (Neem, Karanj, Mango, Gulmohar)",
      canopy_coverage_m2: 2100   // m²
    },
    surfaces: {
      concrete_area: 2600,       // m²
      asphalt_area: 0,
      tiles_pavers: 200,
      soil_open_ground: 200,     // m²
      permeable_pavement: 0,     // m² (before intervention)
      green_roof: 0              // m² (before intervention)
    },
    water: {
      occupants: 120,
      daily_consumption_lpcd: 70, // Institutional standard (NBC)
      existing_rwh: false,
      storage_capacity_litres: 0,
      roof_runoff_connected: true
    },
    energy: {
      annual_electricity_kwh: 48000,
      solar_panel_area_m2: 0,
      existing_renewable_pct: 0,
      roof_orientation: "South-West (Optimal for Solar)"
    },
    waste: {
      construction_waste_tonnes: 320,
      daily_solid_waste_kg: 85,
      recycling_pct: 25,
      organic_waste_kg: 50
    },
    advanced: {
      soil_type: "Clayey / Black Cotton Loam",
      roof_type: "Flat Reinforced Concrete (RCC)",
      pavement_type: "Standard Dense Concrete Slab",
      groundwater_condition: "Moderate (6-8m depth)",
      construction_material: "Concrete + TMT Steel + Burnt Red Clay Brick"
    },
    // Interventions (for What-If and Recommended Plan)
    interventions: {
      trees_planted: 90,             // 3:1 replacement ratio for 30 removed
      green_roof_m2: 600,            // ~27% of roof area
      permeable_pavement_m2: 1200,   // ~46% of concrete area converted
      rwh_tank_capacity_l: 85000,    // 85,000 Litres storage capacity
      solar_pv_area_m2: 700          // ~32% of roof area
    }
  },

  pune_tech_park: {
    id: "proj_pune_commercial",
    name: "Pune IT Innovation Park",
    description: "Multi-tenant commercial tech park development in Hinjawadi, Pune.",
    building_type: "Commercial",
    user_mode: "basic",
    location: {
      address: "Hinjawadi, Pune, Maharashtra, India",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      latitude: 18.5912,
      longitude: 73.7389,
      elevation_m: 560
    },
    site: {
      plot_area: 8000,
      built_up_area: 3200,
      total_floor_area: 12800,
      floors: 4,
      roof_area: 3200,
      open_area: 4800
    },
    vegetation: {
      existing_green_area: 3500,
      existing_tree_count: 110,
      trees_removed: 45,
      shrub_grass_area: 2500,
      tree_category: "Native Dry Deciduous",
      canopy_coverage_m2: 2800
    },
    surfaces: {
      concrete_area: 3800,
      asphalt_area: 800,
      tiles_pavers: 200,
      soil_open_ground: 0,
      permeable_pavement: 0,
      green_roof: 0
    },
    water: {
      occupants: 450,
      daily_consumption_lpcd: 45,
      existing_rwh: false,
      storage_capacity_litres: 0,
      roof_runoff_connected: true
    },
    energy: {
      annual_electricity_kwh: 180000,
      solar_panel_area_m2: 0,
      existing_renewable_pct: 0,
      roof_orientation: "Flat / Multi-directional"
    },
    waste: {
      construction_waste_tonnes: 850,
      daily_solid_waste_kg: 220,
      recycling_pct: 40,
      organic_waste_kg: 90
    },
    interventions: {
      trees_planted: 150,
      green_roof_m2: 1200,
      permeable_pavement_m2: 1800,
      rwh_tank_capacity_l: 120000,
      solar_pv_area_m2: 1400
    }
  }
};
