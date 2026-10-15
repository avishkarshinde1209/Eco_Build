/**
 * EcoBuild Smart - Statutory Demonstration Benchmarks & Pre-Configured Plans
 * 
 * Provides calibrated empirical datasets covering 4 diverse environmental conditions:
 * 1. kolhapur_academic: Sub-tropical Institutional Campus (MoEF&CC Category 8(a), 24,000 m² BUA)
 * 2. pune_tech_park: High-Density Commercial Cyberpark (MoEF&CC Category 8(a), 48,000 m² BUA)
 * 3. mumbai_residential: Coastal High-Monsoon Sponge City Enclave (36,000 m² BUA, 2,400 mm rain)
 * 4. jodhpur_arid: Arid Desert High-Solar Resilience Campus (22,000 m² BUA, 380 mm rain, 630 kWp PV)
 */

window.ECO_SAMPLE_PROJECTS = {
  kolhapur_academic: {
    id: "proj_kolhapur_demo",
    name: "Kolhapur Green Engineering Campus Expansion",
    description: "Statutory MoEF&CC Category 8(a) institutional campus expansion featuring academic complexes, research wings, SBR 100% ZLD STP, and a native Miyawaki micro-forest.",
    building_type: "Institutional",
    user_mode: "advanced",
    location: {
      address: "Shivaji University Road, Kolhapur, Maharashtra, India",
      city: "Kolhapur",
      state: "Maharashtra",
      country: "India",
      latitude: 16.6913,
      longitude: 74.2448,
      elevation_m: 569
    },
    site: {
      plot_area: 24000,         // m² (2.4 Hectares)
      built_up_area: 6000,      // m² Footprint (25% ground coverage — NBC Part 3 compliant)
      total_floor_area: 24000,  // m² GFA (4 storeys, FAR 1.0 — Category 8(a) statutory threshold)
      floors: 4,
      roof_area: 6000,          // m²
      open_area: 18000          // m² (75% unbuilt open space buffer)
    },
    vegetation: {
      existing_green_area: 12000, // m²
      existing_tree_count: 160,
      trees_removed: 36,
      shrub_grass_area: 8000,    // m²
      tree_category: "Mixed Tropical Canopy (Neem, Karanj, Banyan, Jamun, Gulmohar)",
      canopy_coverage_m2: 5200   // m²
    },
    surfaces: {
      concrete_area: 4800,       // m²
      asphalt_area: 2400,        // m² (internal perimeter driveway)
      tiles_pavers: 1200,        // m² (pedestrian walkways)
      soil_open_ground: 9600,    // m² (permeable lawn & botanical buffer)
      permeable_pavement: 0,     // before intervention
      green_roof: 0              // before intervention
    },
    water: {
      occupants: 1200,           // students, faculty, researchers
      daily_consumption_lpcd: 85,// Institutional standard (NBC 2016 / IS 1172) -> 102 KLD
      existing_rwh: false,
      storage_capacity_litres: 0,
      roof_runoff_connected: true
    },
    energy: {
      annual_electricity_kwh: 1440000, // 60 kWh/m²/yr connected grid load
      solar_panel_area_m2: 0,
      existing_renewable_pct: 0,
      roof_orientation: "South-West (Optimal Solar Tilt 18°)"
    },
    waste: {
      construction_waste_tonnes: 1320, // 55 kg/m² GFA (CPCB C&D Waste Rules 2016)
      daily_solid_waste_kg: 480,       // 0.4 kg/capita/day (SWM Rules 2016)
      recycling_pct: 68,
      organic_waste_kg: 240
    },
    advanced: {
      soil_type: "Clayey / Black Cotton Loam (Hydrologic Group D)",
      roof_type: "Flat Reinforced Concrete (RCC)",
      pavement_type: "Standard Dense Concrete Slab",
      groundwater_condition: "Moderate (6-8m depth)",
      construction_material: "Low-Carbon GGBS Concrete + Recycled Coarse Aggregate (RCA)"
    },
    // Optimal Nature Recovery Interventions
    interventions: {
      trees_planted: 144,            // 4:1 statutory compensatory ratio (for 36 felled)
      green_roof_m2: 1800,           // 30% of roof area
      permeable_pavement_m2: 3600,   // 50% hardscape converted to high-infiltration paving
      rwh_tank_capacity_l: 180000,   // 180,000 Litres dual-chamber RWH tank
      solar_pv_area_m2: 2500,        // 450 kWp Mono-PERC solar array (652.5 MWh/yr)
      rain_garden_m2: 850            // Bioretention bioswales
    }
  },

  pune_tech_park: {
    id: "proj_pune_commercial",
    name: "Pune Hinjawadi Cyberpark Phase 2",
    description: "Statutory MoEF&CC Category 8(a) commercial IT campus development with intensive high-density power demand, 820 kWp solar PV, and 180 KLD SBR wastewater recovery.",
    building_type: "Commercial",
    user_mode: "advanced",
    location: {
      address: "Hinjawadi Phase 1, Pune, Maharashtra, India",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      latitude: 18.5912,
      longitude: 73.7389,
      elevation_m: 560
    },
    site: {
      plot_area: 28000,         // m² (2.8 Hectares)
      built_up_area: 8000,      // m² Footprint (28.6% ground coverage)
      total_floor_area: 48000,  // m² GFA (6 storeys, FAR 1.71 — Major Category 8(a))
      floors: 6,
      roof_area: 8000,          // m²
      open_area: 20000          // m² (71.4% open space)
    },
    vegetation: {
      existing_green_area: 9000,
      existing_tree_count: 180,
      trees_removed: 42,
      shrub_grass_area: 6000,
      tree_category: "Native Western Ghats Sub-tropical Deciduous",
      canopy_coverage_m2: 5600
    },
    surfaces: {
      concrete_area: 6800,
      asphalt_area: 4200,
      tiles_pavers: 2400,
      soil_open_ground: 6600,
      permeable_pavement: 0,
      green_roof: 0
    },
    water: {
      occupants: 2400,
      daily_consumption_lpcd: 45, // Commercial office IT norm -> 108 KLD
      existing_rwh: false,
      storage_capacity_litres: 0,
      roof_runoff_connected: true
    },
    energy: {
      annual_electricity_kwh: 3840000, // 80 kWh/m²/yr commercial load
      solar_panel_area_m2: 0,
      existing_renewable_pct: 0,
      roof_orientation: "Flat / Multi-directional"
    },
    waste: {
      construction_waste_tonnes: 2640,
      daily_solid_waste_kg: 600,
      recycling_pct: 75,
      organic_waste_kg: 280
    },
    advanced: {
      soil_type: "Basaltic Weathered Murrum",
      roof_type: "Flat RCC with Waterproofing",
      pavement_type: "Paver Blocks + Heavy-Duty Asphalt",
      groundwater_condition: "Deep (12m depth)",
      construction_material: "High-Strength Structural Steel + Pre-Cast Concrete"
    },
    interventions: {
      trees_planted: 180,            // > 4:1 compensatory replacement
      green_roof_m2: 2500,
      permeable_pavement_m2: 4800,
      rwh_tank_capacity_l: 250000,   // 250 kL
      solar_pv_area_m2: 4200,        // 760 kWp solar PV
      rain_garden_m2: 1200
    }
  },

  mumbai_residential: {
    id: "proj_mumbai_sponge",
    name: "Mumbai Coastal Eco-Enclave & Sponge Housing",
    description: "Coastal high-rise residential township engineered for extreme monsoon flood attenuation (2,400 mm/yr rainfall), 350 kL dual-chamber RWH, and 100% Zero Liquid Discharge.",
    building_type: "Residential",
    user_mode: "advanced",
    location: {
      address: "Ghodbunder Road, Thane, Mumbai Metropolitan Region, Maharashtra",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      latitude: 19.2183,
      longitude: 72.9781,
      elevation_m: 22
    },
    site: {
      plot_area: 16000,         // m² (1.6 Hectares)
      built_up_area: 4500,      // m² Footprint (28.1% coverage)
      total_floor_area: 36000,  // m² GFA (8 storeys, FAR 2.25 — Category 8(a))
      floors: 8,
      roof_area: 4500,          // m²
      open_area: 11500          // m²
    },
    vegetation: {
      existing_green_area: 7000,
      existing_tree_count: 120,
      trees_removed: 28,
      shrub_grass_area: 4500,
      tree_category: "Coastal Moist Evergreen (Casuarina, Coconut, Badam, Mango)",
      canopy_coverage_m2: 3800
    },
    surfaces: {
      concrete_area: 3200,
      asphalt_area: 1800,
      tiles_pavers: 1200,
      soil_open_ground: 5300,
      permeable_pavement: 0,
      green_roof: 0
    },
    water: {
      occupants: 1500,          // 300 residential units x 5
      daily_consumption_lpcd: 135,// Domestic NBC standard -> 202.5 KLD
      existing_rwh: false,
      storage_capacity_litres: 0,
      roof_runoff_connected: true
    },
    energy: {
      annual_electricity_kwh: 2160000, // 60 kWh/m²/yr residential baseline
      solar_panel_area_m2: 0,
      existing_renewable_pct: 0,
      roof_orientation: "South-Facing Optimal"
    },
    waste: {
      construction_waste_tonnes: 1980,
      daily_solid_waste_kg: 600,
      recycling_pct: 65,
      organic_waste_kg: 350
    },
    advanced: {
      soil_type: "Coastal Alluvial Loam (Hydrologic Group B/C)",
      roof_type: "Terraced RCC Cool Roof",
      pavement_type: "Interlocking Pervious Concrete",
      groundwater_condition: "Shallow (3-4m depth)",
      construction_material: "Fly-Ash Brick Masonry + Green Concrete"
    },
    interventions: {
      trees_planted: 120,
      green_roof_m2: 1800,
      permeable_pavement_m2: 3500,
      rwh_tank_capacity_l: 350000,   // 350 kL high-capacity flood buffer
      solar_pv_area_m2: 2000,        // 360 kWp
      rain_garden_m2: 950
    }
  },

  jodhpur_arid: {
    id: "proj_jodhpur_arid",
    name: "Jodhpur Sun City Arid Resilience Campus",
    description: "Thar desert institutional campus designed for extreme heat mitigation (46°C peak, UHI offset), drought-hardy xeriscaping, and high-yield 630 kWp solar PV grid generation.",
    building_type: "Institutional",
    user_mode: "advanced",
    location: {
      address: "Mandore Road, Jodhpur, Rajasthan, India",
      city: "Jodhpur",
      state: "Rajasthan",
      country: "India",
      latitude: 26.2389,
      longitude: 73.0243,
      elevation_m: 231
    },
    site: {
      plot_area: 22000,         // m² (2.2 Hectares)
      built_up_area: 5500,      // m² Footprint (25% ground coverage)
      total_floor_area: 22000,  // m² GFA (4 storeys, FAR 1.0 — Category 8(a))
      floors: 4,
      roof_area: 5500,          // m²
      open_area: 16500          // m²
    },
    vegetation: {
      existing_green_area: 4500,
      existing_tree_count: 65,
      trees_removed: 14,
      shrub_grass_area: 3000,
      tree_category: "Desert Xerophytic (Khejri, Rohida, Babool, Neem)",
      canopy_coverage_m2: 2200
    },
    surfaces: {
      concrete_area: 3800,
      asphalt_area: 2200,
      tiles_pavers: 1500,
      soil_open_ground: 9000,
      permeable_pavement: 0,
      green_roof: 0
    },
    water: {
      occupants: 1000,
      daily_consumption_lpcd: 70, // Water-conserving institutional norm -> 70 KLD
      existing_rwh: false,
      storage_capacity_litres: 0,
      roof_runoff_connected: true
    },
    energy: {
      annual_electricity_kwh: 1540000, // 70 kWh/m²/yr cooling-heavy load
      solar_panel_area_m2: 0,
      existing_renewable_pct: 0,
      roof_orientation: "South-Facing 26° Arid Tilt"
    },
    waste: {
      construction_waste_tonnes: 1210,
      daily_solid_waste_kg: 350,
      recycling_pct: 60,
      organic_waste_kg: 180
    },
    advanced: {
      soil_type: "Sandy Aridisol / Caliche (Hydrologic Group A)",
      roof_type: "High-Albedo Cool Roof RCC",
      pavement_type: "Stabilized Sand & Porous Blocks",
      groundwater_condition: "Very Deep (30m+ depth)",
      construction_material: "Sandstone Masonry + AAC Blocks"
    },
    interventions: {
      trees_planted: 84,             // 6:1 ratio for drought-tolerant native species
      green_roof_m2: 1200,           // Sedum & succulent thermal buffer
      permeable_pavement_m2: 3000,
      rwh_tank_capacity_l: 120000,
      solar_pv_area_m2: 3500,        // 630 kWp Solar Array (over 1,050 MWh/yr yield!)
      rain_garden_m2: 600
    }
  }
};
