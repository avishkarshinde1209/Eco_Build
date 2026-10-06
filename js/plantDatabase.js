/**
 * EcoBuild Smart - Ecological & Native Plant Species Database
 * Focused on Western Ghats, Deccan Plateau, and Pan-Indian subtropical ecozones (Kolhapur/Maharashtra focus).
 * All species verified as non-invasive, ecologically beneficial, and native/naturalized.
 */

window.ECO_PLANTS = [
  {
    id: "neem",
    name: "Neem",
    botanical: "Azadirachta indica",
    marathi: "कडुनिंब (Kadu Neem)",
    category: "Shade trees",
    subcategories: ["Native trees", "Pollinator-friendly plants"],
    canopy_spread_m: 12,
    mature_height_m: 18,
    annual_co2_kg: 28,
    water_requirement: "Low (Drought-resistant)",
    growth_rate: "Medium-Fast",
    root_type: "Deep Taproot (does not crack foundation)",
    air_quality_benefit: "High PM2.5 and SO2 absorption capacity; natural pest deterrent",
    recommended_for: "Perimeter avenue, windbreaks, parking lot shading, poor soil remediation",
    native_zone: "Western Ghats, Deccan Peninsula, Indo-Gangetic Plains"
  },
  {
    id: "peepal",
    name: "Sacred Fig (Peepal)",
    botanical: "Ficus religiosa",
    marathi: "पिंपळ (Pimpal)",
    category: "Native trees",
    subcategories: ["Shade trees", "Pollinator-friendly plants"],
    canopy_spread_m: 18,
    mature_height_m: 25,
    annual_co2_kg: 38,
    water_requirement: "Low-Medium",
    growth_rate: "Fast",
    root_type: "Extensive (Plant >= 10m away from building foundations)",
    air_quality_benefit: "Exceptional oxygen release, high ozone and dust particulate capture",
    recommended_for: "Open parks, boundary buffers, sacred groves, high biodiversity zones",
    native_zone: "Indian Subcontinent"
  },
  {
    id: "banyan",
    name: "Indian Banyan (Vad)",
    botanical: "Ficus benghalensis",
    marathi: "वड (Vad)",
    category: "Native trees",
    subcategories: ["Shade trees"],
    canopy_spread_m: 25,
    mature_height_m: 22,
    annual_co2_kg: 45,
    water_requirement: "Low-Medium",
    growth_rate: "Moderate",
    root_type: "Massive aerial and lateral roots (requires large open space)",
    air_quality_benefit: "Keystone species; superior thermal cooling and microclimate stabilization",
    recommended_for: "Large campus open areas, botanical gardens, public green commons",
    native_zone: "India (National Tree of India)"
  },
  {
    id: "jamun",
    name: "Indian Blackberry (Jamun)",
    botanical: "Syzygium cumini",
    marathi: "जांभूळ (Jambhul)",
    category: "Fruit trees",
    subcategories: ["Native trees", "Pollinator-friendly plants", "Shade trees"],
    canopy_spread_m: 10,
    mature_height_m: 15,
    annual_co2_kg: 24,
    water_requirement: "Medium (tolerates waterlogging, excellent for bioswales)",
    growth_rate: "Fast",
    root_type: "Deep root system",
    air_quality_benefit: "High canopy density captures airborne dust, birds and bats nesting",
    recommended_for: "Rain gardens, stormwater bioswale margins, campus orchards",
    native_zone: "Western Ghats, Riverine floodplains of Maharashtra"
  },
  {
    id: "mango",
    name: "Mango (Haapus / Desi)",
    botanical: "Mangifera indica",
    marathi: "आंबा (Amba)",
    category: "Fruit trees",
    subcategories: ["Shade trees"],
    canopy_spread_m: 14,
    mature_height_m: 16,
    annual_co2_kg: 26,
    water_requirement: "Medium",
    growth_rate: "Medium",
    root_type: "Deep taproot",
    air_quality_benefit: "Dense evergreen canopy provides dense cooling shade and noise attenuation",
    recommended_for: "Residential setbacks, institutional gardens, productive landscapes",
    native_zone: "Western Ghats & Tropical India"
  },
  {
    id: "gulmohar",
    name: "Gulmohar / Flame Tree",
    botanical: "Delonix regia",
    marathi: "गुलमोहर (Gulmohar)",
    category: "Shade trees",
    subcategories: ["Pollinator-friendly plants"],
    canopy_spread_m: 14,
    mature_height_m: 12,
    annual_co2_kg: 20,
    water_requirement: "Low-Medium",
    growth_rate: "Fast",
    root_type: "Surface lateral roots",
    air_quality_benefit: "Umbrella canopy delivers intense summer shade and vibrant pollinator attractant",
    recommended_for: "Roadside boulevards, public plazas, decorative perimeter",
    native_zone: "Naturalized tropical ornamental"
  },
  {
    id: "karanj",
    name: "Indian Beech (Karanj)",
    botanical: "Pongamia pinnata (Millettia pinnata)",
    marathi: "करंज (Karanj)",
    category: "Native trees",
    subcategories: ["Shade trees", "Pollinator-friendly plants"],
    canopy_spread_m: 11,
    mature_height_m: 14,
    annual_co2_kg: 25,
    water_requirement: "Low (Drought-tolerant, nitrogen-fixing)",
    growth_rate: "Medium-Fast",
    root_type: "Nitrogen-fixing nodulated taproot",
    air_quality_benefit: "Bio-diesel seed potential, fixes soil nitrogen, thrives in urban heat",
    recommended_for: "Parking bays, permeable pavement perimeters, soil regeneration zones",
    native_zone: "Western Ghats and Coastal Deccan"
  },
  {
    id: "kadamba",
    name: "Burflower Tree (Kadamba)",
    botanical: "Neolamarckia cadamba",
    marathi: "कदंब (Kadamba)",
    category: "Native trees",
    subcategories: ["Pollinator-friendly plants", "Shade trees"],
    canopy_spread_m: 12,
    mature_height_m: 20,
    annual_co2_kg: 30,
    water_requirement: "Medium-High",
    growth_rate: "Very Fast",
    root_type: "Deep roots",
    air_quality_benefit: "Remarkably rapid canopy growth, fragrant spherical blooms attract bees & butterflies",
    recommended_for: "Drainage swales, stormwater retention basin borders",
    native_zone: "Moist Western Ghats and Deccan"
  },
  {
    id: "vetiver",
    name: "Khus Grass (Vetiver)",
    botanical: "Chrysopogon zizanioides",
    marathi: "वाळा / खस (Vala / Khas)",
    category: "Ground cover",
    subcategories: ["Shrubs", "Pollinator-friendly plants"],
    canopy_spread_m: 0.8,
    mature_height_m: 1.5,
    annual_co2_kg: 4.5,
    water_requirement: "Low-Medium",
    growth_rate: "Fast",
    root_type: "Extremely deep spongy root system (down to 3-4 meters vertical)",
    air_quality_benefit: "Prevents soil erosion, bio-filters stormwater runoff, absorbs heavy metals",
    recommended_for: "Slopes, swales, retention edges, soil bio-engineering",
    native_zone: "Native to Indian wetlands and Deccan plateau"
  },
  {
    id: "tulsi_shrub",
    name: "Holy Basil & Indian Sage",
    botanical: "Ocimum tenuiflorum / Salvia",
    marathi: "तुळस (Tulsi)",
    category: "Shrubs",
    subcategories: ["Pollinator-friendly plants", "Ground cover"],
    canopy_spread_m: 0.6,
    mature_height_m: 0.9,
    annual_co2_kg: 2.1,
    water_requirement: "Low-Medium",
    growth_rate: "Fast",
    root_type: "Fibrous shallow roots",
    air_quality_benefit: "High phytoncide emissions, anti-bacterial air purification, constant bee visits",
    recommended_for: "Green roof planters, courtyards, residential borders, pathway margins",
    native_zone: "Native across India"
  },
  {
    id: "bougainvillea",
    name: "Bougainvillea / Paper Flower",
    botanical: "Bougainvillea spectabilis",
    marathi: "बोगनवेल (Boganvel)",
    category: "Shrubs",
    subcategories: ["Ground cover", "Pollinator-friendly plants"],
    canopy_spread_m: 3,
    mature_height_m: 4,
    annual_co2_kg: 8.0,
    water_requirement: "Very Low (Extremely drought-hardy)",
    growth_rate: "Very Fast",
    root_type: "Fibrous lateral",
    air_quality_benefit: "Excellent acoustic barrier, particulate dust interception along boundary walls",
    recommended_for: "Compound walls, green screens, solar panel buffer borders",
    native_zone: "Naturalized pan-tropical"
  },
  {
    id: "sedum_green_roof",
    name: "Sedum & Stonecrop Mat",
    botanical: "Sedum album & Portulaca grandiflora",
    marathi: "दगडी वेल (Dagdivel)",
    category: "Ground cover",
    subcategories: ["Shrubs"],
    canopy_spread_m: 0.4,
    mature_height_m: 0.15,
    annual_co2_kg: 1.8,
    water_requirement: "Minimal (Drought succulent)",
    growth_rate: "Medium carpet",
    root_type: "Shallow matting roots (ideal for 75-100mm extensive green roofs)",
    air_quality_benefit: "Extreme thermal insulative roof cooling (reduces roof surface temp by 15-20°C)",
    recommended_for: "Extensive green roofs, terrace gardens, lightweight planter beds",
    native_zone: "Hardy succulents for green roof systems"
  }
];

/**
 * Filter species based on category, soil, and climate
 */
window.filterRecommendedPlants = function(category, rainfall_mm, soil_type) {
  let list = window.ECO_PLANTS;
  if (category && category !== "All") {
    list = list.filter(p => p.category === category || p.subcategories.includes(category));
  }
  // If rainfall is low (<600mm), prioritize low water species
  if (rainfall_mm && rainfall_mm < 700) {
    list = [...list].sort((a, b) => {
      const aLow = a.water_requirement.toLowerCase().includes("low");
      const bLow = b.water_requirement.toLowerCase().includes("low");
      return (bLow ? 1 : 0) - (aLow ? 1 : 0);
    });
  }
  return list;
};
