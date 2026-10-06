/**
 * EcoBuild Smart - Configuration & Environmental Constants
 * Scientifically backed coefficients derived from:
 * - CPHEEO Manual on Water Supply and Treatment
 * - National Building Code (NBC) of India 2016
 * - US EPA Stormwater Management Guidelines (Rational Method)
 * - IPCC Guidelines for National Greenhouse Gas Inventories
 */

window.ECO_CONFIG = {
  APP_NAME: "EcoBuild Smart",
  APP_SUBTITLE: "Dynamic Environmental Impact Assessment & Green Infrastructure Planner",
  VERSION: "2.5.0-Academic",

  // Runoff coefficients (C in Q = C * I * A)
  RUNOFF_COEFFICIENTS: {
    concrete: { value: 0.90, label: "Concrete Surface", range: "0.80 - 0.95", source: "US EPA / Rational Method" },
    asphalt: { value: 0.85, label: "Asphalt / Bitumen", range: "0.80 - 0.90", source: "US EPA / Rational Method" },
    standard_roof: { value: 0.85, label: "Standard Flat / Pitched Roof", range: "0.75 - 0.90", source: "CPHEEO Manual" },
    tiles_pavers: { value: 0.70, label: "Interlocking Pavement / Tiles", range: "0.60 - 0.75", source: "IRC:SP:63" },
    bare_soil: { value: 0.45, label: "Bare Ground / Compacted Soil", range: "0.35 - 0.55", source: "USDA SCS TR-55" },
    lawn_grass: { value: 0.20, label: "Lawn / Grass / Vegetated Ground", range: "0.10 - 0.25", source: "USDA SCS TR-55" },
    permeable_pavement: { value: 0.25, label: "Permeable / Porous Pavement", range: "0.15 - 0.35", source: "CIRIA C753" },
    green_roof: { value: 0.35, label: "Extensive Green Roof (75-150mm)", range: "0.30 - 0.45", source: "FLL Green Roof Guidelines" },
    rain_garden: { value: 0.15, label: "Rain Garden / Bioretention Cell", range: "0.10 - 0.20", source: "CIRIA C753 / US EPA" }
  },

  // Carbon Emission & Sequestration Factors
  CARBON_FACTORS: {
    // kg CO2e per unit
    concrete_per_m3: 380, // kg CO2e / m3 concrete (standard 30MPa)
    steel_per_kg: 1.82,   // kg CO2e / kg structural/reinforcing steel
    brick_per_m3: 210,    // kg CO2e / m3 masonry
    // Construction intensity average: kg CO2e per m2 built-up area
    construction_avg_per_m2: 450, // IPCC / Indian Green Building Council (IGBC) baseline
    // Tree sequestration
    mature_tree_annual_seq_kg: 21.8, // kg CO2 sequestered per mature tropical tree per year (IPCC/Arbor Day Foundation)
    young_tree_annual_seq_kg: 8.5,   // kg CO2 sequestered in first 5 years
    // Grid electricity emission factor (Central Electricity Authority CEA India v19)
    grid_emission_factor_kg_per_kwh: 0.82 // kg CO2e / kWh
  },

  // Water standards (IS 1172:1993 / NBC 2016)
  WATER_STANDARDS_LPCD: {
    residential: 135,   // Litres Per Capita per Day (full flushing)
    commercial: 45,     // Office / commercial
    educational: 45,    // Day schools / colleges
    institutional: 70,  // Hostels / dormitories: 135; offices: 45
    industrial: 50,     // General factory worker domestic need
    mixed: 90           // Mixed-use average
  },

  // Solar constants
  SOLAR_CONSTANTS: {
    panel_efficiency: 0.205,      // 20.5% monocrystalline PV efficiency
    performance_ratio: 0.75,      // System losses, temperature derating, dust, inverter (0.75)
    kwp_per_m2: 0.18,             // ~180 Watts peak per m2 panel area
    annual_co2_offset_factor: 0.82 // kg CO2e per kWh generated
  },

  // RWH Constants
  RWH_CONSTANTS: {
    filter_efficiency: 0.85,      // First-flush & filter efficiency factor (0.80 - 0.90)
    dry_spell_days_monsoon: 45,   // Storage sizing dry period baseline (days)
    daily_non_potable_ratio: 0.40 // ~40% of domestic water is for flushing/gardening (RWH usable)
  },

  // Urban Heat Island & Albedo
  ALBEDO_VALUES: {
    concrete: 0.35,
    asphalt: 0.12,
    standard_roof: 0.25,
    green_roof: 0.70, // effective cooling albedo equivalent
    permeable_pavement: 0.40,
    vegetation: 0.65
  },

  // Data confidence levels
  CONFIDENCE_LEVELS: {
    HIGH: { label: "High Confidence", color: "text-emerald-700 bg-emerald-50 border-emerald-300", icon: "🟢", desc: "Live API verified / official measured meteorological data" },
    MODERATE: { label: "Moderate Confidence", color: "text-amber-700 bg-amber-50 border-amber-300", icon: "🟡", desc: "Modelled regional dataset / scientifically calibrated" },
    ESTIMATED: { label: "Estimated", color: "text-orange-700 bg-orange-50 border-orange-300", icon: "🟠", desc: "Calculated via empirical engineering equations & standard coefficients" },
    USER: { label: "User Supplied", color: "text-blue-700 bg-blue-50 border-blue-300", icon: "🔵", desc: "Directly entered by user in project wizard" }
  },

  // External APIs
  API_ENDPOINTS: {
    WEATHER: "https://api.open-meteo.com/v1/forecast",
    AIR_QUALITY: "https://air-quality-api.open-meteo.com/v1/air-quality",
    GEOCODING: "https://nominatim.openstreetmap.org/search",
    REVERSE_GEOCODING: "https://nominatim.openstreetmap.org/reverse"
  },

  // C&D Waste Generation Factors (TIFAC / CPCB C&D Waste Management Rules 2016)
  // Expressed in kg per m² of Gross Floor Area (GFA) for new construction
  C_AND_D_WASTE_FACTORS: {
    residential: { rate_kg_m2: 50, source: "TIFAC / CPCB Guidelines 2016", desc: "Residential apartment / housing units" },
    commercial: { rate_kg_m2: 65, source: "TIFAC / CPCB Guidelines 2016", desc: "Commercial office complexes / IT parks" },
    educational: { rate_kg_m2: 55, source: "TIFAC / CPCB Guidelines 2016", desc: "Schools, universities, research institutes" },
    institutional: { rate_kg_m2: 60, source: "TIFAC / CPCB Guidelines 2016", desc: "Public institutions, multi-facility campuses" },
    industrial: { rate_kg_m2: 45, source: "TIFAC / CPCB Guidelines 2016", desc: "Warehouses and light manufacturing sheds" },
    mixed: { rate_kg_m2: 55, source: "TIFAC / CPCB Guidelines 2016", desc: "Mixed residential-retail complexes" },
    demolition_baseline_kg_m2: 420 // Average demolition waste generation rate
  },

  // Empirical Construction Waste Material Composition Breakdown (CPCB / TIFAC Norms)
  WASTE_MATERIAL_COMPOSITION: {
    soil_sand: { pct: 36, label: "Soil, Sand & Gravel", recyclable: true, reuse: "Site filling, sub-base levelling" },
    concrete: { pct: 31, label: "Concrete Rubble", recyclable: true, reuse: "Recycled concrete aggregate (RCA), paver blocks" },
    masonry_bricks: { pct: 10, label: "Bricks & Masonry Mortar", recyclable: true, reuse: "Lean masonry, pathway sub-grade" },
    metals: { pct: 5, label: "Metals (Rebar & Steel)", recyclable: true, reuse: "Direct scrap foundry recycling (100% circular)" },
    timber: { pct: 5, label: "Timber & Wood Shuttering", recyclable: true, reuse: "Formwork reuse, biomass or chipboard" },
    bitumen: { pct: 2, label: "Bitumen / Asphalt Pavement", recyclable: true, reuse: "Reclaimed Asphalt Pavement (RAP)" },
    others: { pct: 11, label: "Packaging, Plastics & Tiles", recyclable: false, reuse: "Authorized co-processing / RDF" }
  },

  // Municipal Solid Waste Factors (CPHEEO Manual on Municipal Solid Waste Management)
  SOLID_WASTE_FACTORS: {
    residential: { kg_per_capita_day: 0.45, organic_fraction: 0.55 },
    commercial: { kg_per_capita_day: 0.30, organic_fraction: 0.40 },
    educational: { kg_per_capita_day: 0.25, organic_fraction: 0.45 },
    institutional: { kg_per_capita_day: 0.25, organic_fraction: 0.45 },
    industrial: { kg_per_capita_day: 0.20, organic_fraction: 0.35 },
    mixed: { kg_per_capita_day: 0.35, organic_fraction: 0.50 }
  },

  // Nature Recovery & Ecological Restoration Constants
  NATURE_RECOVERY_FACTORS: {
    topsoil_depth_m: 0.20,                  // Topsoil salvage layer thickness (NBC 2016 Part 11)
    topsoil_stockpile_max_height_m: 2.0,     // Max stockpile height to maintain microbial vitality
    miyawaki_saplings_per_m2: 3.5,          // Akira Miyawaki multi-tier density (3 - 5 saplings/m²)
    miyawaki_growth_multiplier: 10,         // 10x faster growth rate compared to standard plantation
    miyawaki_carbon_multiplier: 4.5,        // Annual sequestration density multiplier
    bioswale_filter_depth_m: 0.45,          // Sponge city engineered bioretention soil layer
    bioswale_water_capture_mm: 25,          // First-flush retention event depth
    green_facade_co2_kg_m2_yr: 1.8,         // Vertical living wall annual sequestration
    compost_conversion_efficiency: 0.25,    // 100 kg organic waste -> 25 kg organic bio-compost
    ggbs_clinker_offset_kg_per_m3: 130      // CO2 reduction per m³ concrete with 35% fly-ash/GGBS replacement
  }
};

