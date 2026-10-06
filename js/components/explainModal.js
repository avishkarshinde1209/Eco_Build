/**
 * EcoBuild Smart - Explainability Drawer & Modal
 * Provides scientific transparency: "What caused this result?"
 * Displays mathematical formulas, data provenance, input variables, and confidence rating.
 */

window.ExplainModal = {
  activeMetric: null,

  METRIC_DETAILS: {
    runoff_deficit: {
      title: "Stormwater Runoff & Peak Infiltration Deficit",
      category: "Hydrology & Stormwater",
      formula: "Q = C × I × A",
      formula_explanation: "The Rational Method calculates peak surface runoff rate (Q) as the product of the dimensionless composite runoff coefficient (C), rainfall intensity (I in mm/hr), and catchment area (A in m²).",
      variables: [
        { name: "C (Composite Runoff Coeff)", source: "Surface-weighted calculation based on concrete (0.90), roof (0.85), bare soil (0.45), lawn (0.20)" },
        { name: "I (Design Rainfall Intensity)", source: "Historical meteorological baseline (35.0 - 38.0 mm/hr)" },
        { name: "A (Catchment Area)", source: "User site plot area (m²)" }
      ],
      data_source: "Open-Meteo Historical Climate API & US EPA Rational Method Compendium",
      confidence: "HIGH",
      confidence_desc: "Physical conservation of volume based on land-use coefficients calibrated for Indian urban watersheds.",
      uncertainty: "Rational Method assumes uniform rainfall intensity across the catchment and does not model transient soil saturation lag."
    },
    rwh_potential: {
      title: "Rainwater Harvesting Potential & Storage Sizing",
      category: "Water Engineering",
      formula: "V = P × A_roof × C_roof × η_filter",
      formula_explanation: "Harvestable volume equals annual precipitation (P) multiplied by roof catchment area (A_roof), roof runoff coefficient (C_roof = 0.85), and first-flush/filter collection efficiency (η_filter = 0.85).",
      variables: [
        { name: "P (Annual Rainfall)", source: "Open-Meteo ERA5 Reanalysis / IMD 30-year station climatology (mm/year)" },
        { name: "A_roof (Catchment Area)", source: "User-entered building roof area (m²)" },
        { name: "C_roof (Runoff Coeff)", source: "RCC concrete flat roof runoff factor: 0.85" },
        { name: "η_filter (Efficiency)", source: "Dual-chamber mesh & sand filter factor: 0.85 (15% first-flush discard)" }
      ],
      data_source: "Open-Meteo API / Central Ground Water Board (CGWB) Technical Guidelines",
      confidence: "HIGH",
      confidence_desc: "Standard hydrologic yield formulation adopted by Bureau of Indian Standards (IS 15797:2008).",
      uncertainty: "Actual yield depends on regular maintenance of leaf screens and gutter slope alignment."
    },
    tree_replacement: {
      title: "Compensatory Native Tree Planting Model",
      category: "Urban Ecology & Biodiversity",
      formula: "R_trees = N_removed × Ratio_comp + f(Canopy_deficit)",
      formula_explanation: "Calculates sapling planting obligations based on statutory 3:1 replacement ratio, escalating to 4:1 or 5:1 when felling exceeds 40% of site tree inventory to offset mature canopy volume loss.",
      variables: [
        { name: "N_removed", source: "User entered: trees felled for building footprint" },
        { name: "Ratio_comp", source: "Maharashtra Urban Areas Protection & Preservation of Trees Act (min 3:1 ratio)" },
        { name: "Canopy Deficit", source: "Average mature canopy spread (~35 m² per tree)" }
      ],
      data_source: "Tree Authority Regulations & National Building Code (NBC) 2016",
      confidence: "HIGH",
      confidence_desc: "Statutory environmental regulation and urban forestry canopy standards.",
      uncertainty: "Assumes sapling survival rate of at least 80% with adequate post-planting irrigation."
    },
    carbon_deficit: {
      title: "Embodied Construction Carbon vs. Vegetative Sequestration",
      category: "Carbon Accounting",
      formula: "Net CO₂e = E_materials + (N_felled × C_biomass) - Σ(N_planted × S_annual × t)",
      formula_explanation: "Embodied emissions in RCC structural frame (450 kg CO₂e/m²) plus lost biomass carbon (500 kg CO₂e/tree) weighed against annual photosynthetic sequestration of compensatory trees (~21.8 kg CO₂e/mature tree/year) and solar offset.",
      variables: [
        { name: "E_materials", source: "450 kg CO₂e per m² built-up gross floor area (IGBC baseline)" },
        { name: "S_annual", source: "21.8 kg CO₂e/year active sequestration per mature tree (Arbor Day / IPCC)" },
        { name: "Solar Offset", source: "0.82 kg CO₂e/kWh displaced Indian grid electricity (CEA Baseline v19)" }
      ],
      data_source: "IPCC Guidelines for GHG Inventories & Indian Green Building Council (IGBC)",
      confidence: "ESTIMATED",
      confidence_desc: "Model-calculated projection based on documented academic benchmarks. Not a certified GHG audit.",
      uncertainty: "Does not account for specific cement clinker ratios, recycled steel fractions, or varying soil microbial respiration."
    },
    solar_pv: {
      title: "Rooftop Solar Photovoltaic (PV) Potential",
      category: "Renewable Energy",
      formula: "E_annual = Capacity (kWp) × Peak Sun Hours × 365 × PR",
      formula_explanation: "Calculates annual electrical energy yield from installed monocrystalline PV capacity under local global tilted irradiance, derated by a 75% system performance ratio (PR).",
      variables: [
        { name: "Installed Capacity", source: "Allocated roof area (m²) × 0.18 kWp/m² (20.5% module efficiency)" },
        { name: "Peak Sun Hours", source: "NASA POWER / Open-Meteo satellite solar database (kWh/m²/day)" },
        { name: "Performance Ratio", source: "0.75 (inverter losses, thermal derating, wiring resistance, dust)" }
      ],
      data_source: "NASA POWER / Open-Meteo Solar Irradiance API / MNRE Guidelines",
      confidence: "HIGH",
      confidence_desc: "Standard PVWatts electrical engineering model.",
      uncertainty: "Assumes unshaded roof plane facing South/South-West at latitude tilt (~15-18°)."
    },
    uhi_index: {
      title: "Urban Heat Island (UHI) Vulnerability Indicator",
      category: "Urban Microclimate",
      formula: "UHI_index = (f_impervious × 80) + ((1 - Albedo_avg) × 20) - Bonus_cooling",
      formula_explanation: "Indexes surface heat vulnerability based on the fraction of impervious hardscape, area-weighted solar reflectance (albedo), and evapotranspirative tree canopy shading.",
      variables: [
        { name: "f_impervious", source: "Impervious surface fraction (concrete + asphalt + roof) / plot area" },
        { name: "Albedo_avg", source: "Area-weighted albedo (concrete 0.35, asphalt 0.12, roof 0.25, grass 0.65)" },
        { name: "Bonus_cooling", source: "Canopy shade coverage bonus (up to 25 index points)" }
      ],
      data_source: "US EPA Heat Island Reduction Compendium & Oke (1982) Energy Balance",
      confidence: "ESTIMATED",
      confidence_desc: "Comparative academic vulnerability index. Represents relative thermal stress.",
      uncertainty: "Microclimate wind channelling, urban canyon aspect ratios (H/W), and atmospheric humidity will modulate real ambient temperatures."
    },
    green_cover: {
      title: "Green Cover & Permeable Open Space Ratio",
      category: "Statutory Urban Planning",
      formula: "OSR = (A_open_permeable + A_green_roof + A_porous_pavers) / A_plot ≥ 25%",
      formula_explanation: "National Building Code (NBC) 2016 Part 3 requires plots over 1,000 m² to maintain an unsealed or ecologically restored open space ratio of at least 25% of gross plot area.",
      variables: [
        { name: "A_open_permeable", source: "Unpaved bare ground & soft landscape (m²)" },
        { name: "A_green_roof", source: "Terrace Sedum bio-roof coverage (m²)" },
        { name: "A_porous_pavers", source: "Porous interlocking concrete paving area (m²)" }
      ],
      data_source: "National Building Code (NBC) of India 2016 Part 3 & Ministry of Housing and Urban Affairs (MoHUA)",
      confidence: "HIGH",
      confidence_desc: "Direct geometric calculation against Indian statutory development control regulations.",
      uncertainty: "Local municipal development control regulations (DCR) may impose higher front/side setback margins."
    },
    biodiversity_gain: {
      title: "Urban Biodiversity Net Gain (BNG) Indicator",
      category: "Ecological Restoration",
      formula: "BNG = [(Σ Tiers × S_native × Density) / Baseline_score - 1] × 100%",
      formula_explanation: "Indexes structural vegetative stratification across 4 forest layers (Canopy, Sub-canopy, Sub-tree, Shrub) weighted by native species richness compared against monoculture/cleared baseline.",
      variables: [
        { name: "Tiers", source: "4-tier Akira Miyawaki vertical stratification factor" },
        { name: "S_native", source: "Count of indigenous flora species (min 15 species)" },
        { name: "Density", source: "3 to 4 saplings per m² dense micro-forest planting" }
      ],
      data_source: "Biological Diversity Act 2002 & MoEFCC Ecological Planning Guidelines",
      confidence: "HIGH",
      confidence_desc: "Proven Akira Miyawaki multi-stratum micro-forestry framework.",
      uncertainty: "Faunal recruitment depends on regional wildlife corridor connectivity and pesticide avoidance."
    },
    circular_waste: {
      title: "Construction & Demolition Waste Circularity",
      category: "Resource Conservation",
      formula: "Diversion_pct = (W_topsoil_salvage + W_rubble_recycled + W_compost) / W_total ≥ 65%",
      formula_explanation: "Measures on-site circular resource retention including topsoil scraping (20 cm), mechanical concrete crushing for road sub-base, and decentralized organic composting.",
      variables: [
        { name: "W_topsoil_salvage", source: "20 cm fertile A-horizon topsoil volume (m³)" },
        { name: "W_rubble_recycled", source: "Crushed demolition concrete diverted to subgrade (tonnes)" },
        { name: "W_compost", source: "Decentralized bio-fertilizer humus yield from cafeteria organics (t/yr)" }
      ],
      data_source: "Central Pollution Control Board (CPCB) C&D Waste Management Rules 2016",
      confidence: "HIGH",
      confidence_desc: "Material mass-balance and CPWD circular construction standards.",
      uncertainty: "Requires on-site mobile impact crusher and dedicated topsoil geotextile stabilization."
    }
  },

  open(metricKey) {
    const data = this.METRIC_DETAILS[metricKey];
    if (!data) return;

    this.activeMetric = data;
    const modalEl = document.getElementById("explain-modal-backdrop");
    if (!modalEl) return;

    document.getElementById("explain-title").innerText = data.title;
    document.getElementById("explain-category").innerText = data.category;
    document.getElementById("explain-formula").innerHTML = `<code>${data.formula}</code>`;
    document.getElementById("explain-formula-desc").innerText = data.formula_explanation;

    // Variables list
    const varList = document.getElementById("explain-variables");
    varList.innerHTML = data.variables.map(v => `
      <div class="bg-slate-50 border border-slate-200 rounded p-2 text-xs">
        <span class="font-semibold text-slate-800">${v.name}:</span>
        <span class="text-slate-600 ml-1">${v.source}</span>
      </div>
    `).join("");

    // Data Source & Confidence
    document.getElementById("explain-source").innerText = data.data_source;
    const badgeEl = document.getElementById("explain-confidence-badge");
    const conf = window.ECO_CONFIG.CONFIDENCE_LEVELS[data.confidence] || window.ECO_CONFIG.CONFIDENCE_LEVELS.ESTIMATED;
    badgeEl.className = `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${conf.color}`;
    badgeEl.innerHTML = `<span>${conf.icon}</span> <span>${conf.label}</span>`;
    document.getElementById("explain-confidence-desc").innerText = data.confidence_desc;
    document.getElementById("explain-uncertainty").innerText = data.uncertainty;

    modalEl.classList.remove("hidden");
  },

  close() {
    const modalEl = document.getElementById("explain-modal-backdrop");
    if (modalEl) modalEl.classList.add("hidden");
  }
};
