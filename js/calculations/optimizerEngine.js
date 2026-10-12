/**
 * EcoBuild Smart - Site-Constrained Recovery Optimizer & Pareto Engine
 * Evaluates site boundary geometry, usable roof envelope, open ground area,
 * hardscape footprint, and budget constraints to synthesize three strictly feasible scenarios:
 * 1. Scenario 1: Essential Recovery (High ROI, statutory minimums, affordable mitigation)
 * 2. Scenario 2: Balanced Recovery (Multi-objective optimization of water, energy, carbon & ecology)
 * 3. Scenario 3: Maximum Feasible Environmental Benefit (Full physical site capacity envelope)
 * 
 * References:
 * - CPWD Delhi Schedule of Rates (DSR 2023-24) Unit Capex & Annual Opex
 * - MNRE India Grid-Connected Solar Benchmarks (₹46,000 / kWp)
 * - IRC:SP:63 Permeable Interlocking Concrete Pavers (₹1,450 / m²)
 * - FLL Extensive Green Roof Guidelines (₹1,850 / m²)
 * - CIRIA C753 SuDS Manual Bioretention / Bioswales (₹950 / m²)
 * - CGWB Dual-Chamber RWH Cisterns (₹8.5 / Liter)
 */

(function(root) {
  'use strict';

  root.OptimizerEngine = {
    // Current CPWD DSR 2023-24 & Market Benchmark Turnkey Unit Costs (INR)
    UNIT_RATES: {
      solar_pv_per_kwp: { capex: 46000, opex_yr_pct: 0.02, unit: "₹/kWp", source: "MNRE Rooftop Benchmark 2024" },
      green_roof_per_m2: { capex: 1850, opex_yr_pct: 0.05, unit: "₹/m²", source: "CPWD / FLL Extensive Sedum Norm" },
      permeable_paver_per_m2: { capex: 1450, opex_yr_pct: 0.03, unit: "₹/m²", source: "IRC:SP:63 / CPWD DSR 2023" },
      bioswale_per_m2: { capex: 950, opex_yr_pct: 0.06, unit: "₹/m²", source: "CIRIA C753 SuDS Standard" },
      rwh_cistern_per_liter: { capex: 8.5, opex_yr_pct: 0.03, unit: "₹/Liter", source: "CGWB / CPHEEO Plumbing Norm" },
      tree_sapling_unit: { capex: 750, opex_yr_pct: 0.10, unit: "₹/tree", source: "Social Forestry / 3-Yr Maintenance" },
      miyawaki_per_m2: { capex: 2600, opex_yr_pct: 0.08, unit: "₹/m²", source: "Miyawaki Dense Urban Forest (3.5 saplings/m²)" }
    },

    /**
     * Synthesizes 3 Site-Constrained Recovery Packages
     */
    generateParetoPackages(project, calculations) {
      const proj = project || (typeof window !== 'undefined' ? window.App?.currentProject : {}) || {};
      const site = proj.site || {};
      const surf = proj.surfaces || {};
      const veg = proj.vegetation || {};
      const iv = proj.interventions || {};

      const plotArea = Math.max(1, Number(site.plot_area) || 5000);
      const builtUp = Math.max(0, Number(site.built_up_area) || 0);
      const roofArea = Math.max(0, Number(site.roof_area !== undefined ? site.roof_area : builtUp));
      const openGround = Math.max(0, plotArea - builtUp);

      const concreteArea = Math.max(0, Number(surf.concrete_area) || 0);
      const asphaltArea = Math.max(0, Number(surf.asphalt_area) || 0);
      const tilesPavers = Math.max(0, Number(surf.tiles_pavers) || 0);
      const hardscape = concreteArea + asphaltArea + tilesPavers;

      const treesRemoved = Math.max(0, Number(veg.trees_removed) || 0);
      const existingTrees = Math.max(0, Number(veg.existing_tree_count) || 0);

      // Physical area caps:
      // Max standard canopy trees at 16 m² root zone:
      const maxStandardGroundTrees = openGround > 0 ? Math.floor(openGround / 16) : 0;

      // --- Scenario 1: Essential Recovery ---
      // Addresses critical mandatory obligations: 3:1 compensatory planting, basic stormwater relief, high ROI
      const s1GreenRoofM2 = Math.min(roofArea, Math.round(roofArea * 0.20));
      const s1SolarM2 = Math.min(Math.max(0, roofArea - s1GreenRoofM2), Math.round(roofArea * 0.30));
      const s1PermPaverM2 = Math.min(hardscape, Math.round(hardscape * 0.35));
      const s1BioswaleM2 = Math.min(openGround, Math.round(openGround * 0.08));
      const s1CisternL = roofArea > 0 ? Math.min(60000, Math.round(roofArea * 20)) : 0;
      
      // Tree planting: statutory 3:1 replacement capped by open ground
      const s1StatutoryTrees = treesRemoved * 3;
      const s1TreesPlanted = Math.min(maxStandardGroundTrees, s1StatutoryTrees);

      const pkgEssential = this._buildScenario({
        key: 'essential',
        aliasKey: 'budget',
        name: 'Scenario 1: Essential Recovery',
        tag: '₹ ESSENTIAL / HIGH ROI',
        tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
        description: 'Prioritizes mandatory tree replacement, stormwater detention, and high-efficiency cost-effective interventions.',
        greenRoofM2: s1GreenRoofM2,
        solarM2: s1SolarM2,
        permPaverM2: s1PermPaverM2,
        bioswaleM2: s1BioswaleM2,
        cisternL: s1CisternL,
        treesPlanted: s1TreesPlanted,
        treesRemoved,
        plotArea,
        roofArea,
        openGround,
        hardscape
      });

      // --- Scenario 2: Balanced Recovery ---
      // Multi-criteria balance across water conservation, solar energy, permeable surfaces, and living canopy
      const s2GreenRoofM2 = Math.min(roofArea, Math.round(roofArea * 0.35));
      const s2SolarM2 = Math.min(Math.max(0, roofArea - s2GreenRoofM2), Math.round(roofArea * 0.40));
      const s2PermPaverM2 = Math.min(hardscape, Math.round(hardscape * 0.55));
      const s2BioswaleM2 = Math.min(Math.max(0, openGround - 50), Math.round(openGround * 0.15));
      const s2CisternL = roofArea > 0 ? Math.min(100000, Math.round(roofArea * 35)) : 0;
      const s2TreesPlanted = Math.min(maxStandardGroundTrees, Math.max(treesRemoved * 3, Math.round(maxStandardGroundTrees * 0.6)));

      const pkgBalanced = this._buildScenario({
        key: 'balanced',
        aliasKey: 'sponge',
        name: 'Scenario 2: Balanced Recovery',
        tag: '⚖️ BALANCED ENVIRONMENTAL OPTIMIZATION',
        tagColor: 'bg-teal-100 text-teal-900 border-teal-300',
        description: 'Optimizes multi-criteria performance across stormwater retention, renewable energy, water circularity, and living vegetation.',
        greenRoofM2: s2GreenRoofM2,
        solarM2: s2SolarM2,
        permPaverM2: s2PermPaverM2,
        bioswaleM2: s2BioswaleM2,
        cisternL: s2CisternL,
        treesPlanted: s2TreesPlanted,
        treesRemoved,
        plotArea,
        roofArea,
        openGround,
        hardscape
      });

      // --- Scenario 3: Maximum Feasible Environmental Benefit ---
      // Pushes physical envelope while respecting structural boundaries (e.g. bio-solar elevated panels above green roof)
      const s3GreenRoofM2 = Math.min(roofArea, Math.round(roofArea * 0.55));
      // Bio-solar synergy: panels elevated above sedum allow up to 60% solar coverage with 30% overlap
      const s3SolarM2 = Math.min(roofArea, Math.round(roofArea * 0.55));
      const s3PermPaverM2 = Math.min(hardscape, Math.round(hardscape * 0.80));
      const s3BioswaleM2 = Math.min(openGround, Math.round(openGround * 0.22));
      const s3CisternL = roofArea > 0 ? Math.min(150000, Math.round(roofArea * 50)) : 0;
      
      // Dense afforestation: standard trees + micro-forest
      const s3TreesPlanted = maxStandardGroundTrees > 0 
        ? Math.min(maxStandardGroundTrees * 3, Math.max(treesRemoved * 5, maxStandardGroundTrees)) 
        : 0;

      const pkgMaxBenefit = this._buildScenario({
        key: 'maximum_benefit',
        aliasKey: 'carbon',
        name: 'Scenario 3: Maximum Feasible Benefit',
        tag: '🌿 MAXIMUM FEASIBLE NATURE RESTORATION',
        tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        description: 'Maximizes clean rooftop solar energy, dense living canopy, and zero-runoff sponge retention within strict physical boundaries.',
        greenRoofM2: s3GreenRoofM2,
        solarM2: s3SolarM2,
        permPaverM2: s3PermPaverM2,
        bioswaleM2: s3BioswaleM2,
        cisternL: s3CisternL,
        treesPlanted: s3TreesPlanted,
        treesRemoved,
        plotArea,
        roofArea,
        openGround,
        hardscape,
        isBioSolar: true
      });

      return [pkgEssential, pkgBalanced, pkgMaxBenefit];
    },

    /**
     * Builds and itemizes a single recovery scenario
     */
    _buildScenario({ key, aliasKey, name, tag, tagColor, description, greenRoofM2, solarM2, permPaverM2, bioswaleM2, cisternL, treesPlanted, treesRemoved, plotArea, roofArea, openGround, hardscape, isBioSolar = false }) {
      const solarKwp = Math.round((solarM2 * 0.18) * 10) / 10;
      const solarCapex = Math.round(solarKwp * this.UNIT_RATES.solar_pv_per_kwp.capex);
      const solarOpex = Math.round(solarCapex * this.UNIT_RATES.solar_pv_per_kwp.opex_yr_pct);

      const greenRoofCapex = Math.round(greenRoofM2 * this.UNIT_RATES.green_roof_per_m2.capex);
      const greenRoofOpex = Math.round(greenRoofCapex * this.UNIT_RATES.green_roof_per_m2.opex_yr_pct);

      const paverCapex = Math.round(permPaverM2 * this.UNIT_RATES.permeable_paver_per_m2.capex);
      const paverOpex = Math.round(paverCapex * this.UNIT_RATES.permeable_paver_per_m2.opex_yr_pct);

      const bioswaleCapex = Math.round(bioswaleM2 * this.UNIT_RATES.bioswale_per_m2.capex);
      const bioswaleOpex = Math.round(bioswaleCapex * this.UNIT_RATES.bioswale_per_m2.opex_yr_pct);

      const cisternCapex = Math.round(cisternL * this.UNIT_RATES.rwh_cistern_per_liter.capex);
      const cisternOpex = Math.round(cisternCapex * this.UNIT_RATES.rwh_cistern_per_liter.opex_yr_pct);

      const treesCapex = Math.round(treesPlanted * this.UNIT_RATES.tree_sapling_unit.capex);
      const treesOpex = Math.round(treesCapex * this.UNIT_RATES.tree_sapling_unit.opex_yr_pct);

      const totalCapexInr = solarCapex + greenRoofCapex + paverCapex + bioswaleCapex + cisternCapex + treesCapex;
      const totalOpexInr = solarOpex + greenRoofOpex + paverOpex + bioswaleOpex + cisternOpex + treesOpex;
      const totalCapexLakhs = Math.round((totalCapexInr / 100000) * 10) / 10;

      // Environmental metrics:
      const cleanEnergyMwh = Math.round((solarKwp * 5.3 * 365 * 0.75) / 1000 * 10) / 10;
      const carbonOffsetTonnes = Math.round((cleanEnergyMwh * 0.82 + (treesPlanted * 0.0218)) * 10) / 10;
      const runoffMitigatedPct = hardscape + roofArea > 0 
        ? Math.min(85, Math.round(((permPaverM2 * 0.65 + greenRoofM2 * 0.60 + bioswaleM2 * 0.75) / (hardscape + roofArea)) * 100))
        : 0;

      // Itemized intervention action objects with full metadata:
      const items = [
        {
          name: "Rooftop Solar PV Installation",
          quantity: solarKwp,
          unit: "kWp",
          area_required_m2: solarM2,
          eligible_area_m2: roofArea,
          reason: "Generates clean zero-carbon electricity and offsets grid consumption.",
          indicators_affected: ["Renewable Energy", "Operational Carbon Avoidance"],
          estimated_benefit: `${cleanEnergyMwh} MWh/yr clean generation, offsetting ~${Math.round(cleanEnergyMwh * 0.82)} t CO₂e/yr.`,
          capex_inr: solarCapex,
          annual_opex_inr: solarOpex,
          stage: "Post-Plinth / Rooftop Commissioning",
          confidence: "High (MNRE / PVWatts solar geometry)",
          status: roofArea > 0 ? "feasible" : "infeasible_no_roof"
        },
        {
          name: "Extensive Sedum Green Roof",
          quantity: greenRoofM2,
          unit: "m²",
          area_required_m2: greenRoofM2,
          eligible_area_m2: roofArea,
          reason: "Attenuates rooftop storm runoff, lowers thermal roof absorption, and expands urban biodiversity.",
          indicators_affected: ["Stormwater Runoff", "Urban Heat Island", "Biodiversity"],
          estimated_benefit: `Retains 60-70% roof storm precipitation; lowers top-slab radiant temperature by 12-18°C.`,
          capex_inr: greenRoofCapex,
          annual_opex_inr: greenRoofOpex,
          stage: "Terrace Waterproofing & Landscaping",
          confidence: "Moderate (FLL Guidelines / Structural load check)",
          status: roofArea > 0 ? "feasible" : "infeasible_no_roof"
        },
        {
          name: "Permeable Interlocking Pavers",
          quantity: permPaverM2,
          unit: "m²",
          area_required_m2: permPaverM2,
          eligible_area_m2: hardscape,
          reason: "Replaces dense impermeable concrete/asphalt to restore natural soil aquifer recharge.",
          indicators_affected: ["Groundwater Infiltration", "Peak Runoff Rate"],
          estimated_benefit: `Reduces surface runoff coefficient from 0.90 to 0.20-0.28, accelerating on-site percolation.`,
          capex_inr: paverCapex,
          annual_opex_inr: paverOpex,
          stage: "Hardscape Paving & Circulation",
          confidence: "High (IRC:SP:63 Porous Pavement)",
          status: hardscape > 0 ? "feasible" : "infeasible_no_paved_area"
        },
        {
          name: "Bioretention Bioswales & Rain Gardens",
          quantity: bioswaleM2,
          unit: "m²",
          area_required_m2: bioswaleM2,
          eligible_area_m2: openGround,
          reason: "Captures and filters overland hardscape runoff before discharge, recharging subsoil aquifers.",
          indicators_affected: ["Stormwater Quality", "Aquifer Infiltration"],
          estimated_benefit: `Provides biofiltration and silt retention for ~${Math.round(bioswaleM2 * 0.45 * 0.35 * 1000)} Litres event detention.`,
          capex_inr: bioswaleCapex,
          annual_opex_inr: bioswaleOpex,
          stage: "Landscape Earthworks",
          confidence: "High (CIRIA C753 SuDS Manual)",
          status: openGround > 0 ? "feasible" : "infeasible_no_open_ground"
        },
        {
          name: "RWH Cistern & Dual Vortex Filtration",
          quantity: cisternL,
          unit: "Litres",
          area_required_m2: Math.round(cisternL / 2500),
          eligible_area_m2: openGround + roofArea,
          reason: "Stores clean rooftop rainwater to offset municipal non-potable flushing and irrigation demand.",
          indicators_affected: ["Freshwater Demand", "Municipal Supply Offset"],
          estimated_benefit: `Provides ${Math.round(cisternL / 1000)} m³ storage buffer, meeting non-potable needs across monsoon lulls.`,
          capex_inr: cisternCapex,
          annual_opex_inr: cisternOpex,
          stage: "Basement / Underground Utility Sizing",
          confidence: "High (CGWB / CPHEEO Codes)",
          status: roofArea > 0 ? "feasible" : "infeasible_no_catchment"
        },
        {
          name: "Compensatory Native Tree Planting",
          quantity: treesPlanted,
          unit: "trees",
          area_required_m2: treesPlanted * 16,
          eligible_area_m2: openGround,
          reason: "Replaces felled tree canopy and restores ecological habitat and carbon sequestration.",
          indicators_affected: ["Ecology & Biodiversity", "Canopy Shading", "Biomass Carbon"],
          estimated_benefit: `Establishes living canopy, sequestering ~${Math.round(treesPlanted * 21.8)} kg CO₂e/yr at maturity.`,
          capex_inr: treesCapex,
          annual_opex_inr: treesOpex,
          stage: "Landscape Planting & Arboriculture",
          confidence: "High (Maharashtra Tree Protection Act)",
          status: (openGround > 0 && treesPlanted > 0) ? "feasible" : (treesPlanted === 0 ? "not_required" : "infeasible_no_ground")
        }
      ];

      return {
        key,
        aliasKey,
        name,
        tag,
        tagColor,
        description,
        is_bio_solar: isBioSolar,
        interventions: {
          solar_pv_area_m2: solarM2,
          solar_kwp: solarKwp,
          green_roof_m2: greenRoofM2,
          permeable_pavement_m2: permPaverM2,
          rain_garden_m2: bioswaleM2,
          rwh_tank_capacity_l: cisternL,
          trees_planted: treesPlanted,
          bio_solar_colocated: isBioSolar
        },
        items,
        area_accounting: {
          roof_total_m2: roofArea,
          roof_allocated_m2: greenRoofM2 + (isBioSolar ? 0 : solarM2),
          roof_utilization_pct: roofArea > 0 ? Math.round(((greenRoofM2 + (isBioSolar ? 0 : solarM2)) / roofArea) * 100) : 0,
          open_ground_total_m2: openGround,
          open_ground_allocated_m2: bioswaleM2,
          hardscape_total_m2: hardscape,
          hardscape_converted_m2: permPaverM2
        },
        capex: {
          total_inr: totalCapexInr,
          total_lakhs: totalCapexLakhs,
          annual_opex_inr: totalOpexInr,
          annual_opex_lakhs: Math.round((totalOpexInr / 100000) * 10) / 10,
          breakdown: {
            solar_pv_lakhs: Math.round((solarCapex / 100000) * 10) / 10,
            green_roof_lakhs: Math.round((greenRoofCapex / 100000) * 10) / 10,
            pavers_lakhs: Math.round((paverCapex / 100000) * 10) / 10,
            bioswales_lakhs: Math.round((bioswaleCapex / 100000) * 10) / 10,
            cistern_lakhs: Math.round((cisternCapex / 100000) * 10) / 10,
            trees_lakhs: Math.round((treesCapex / 100000) * 10) / 10
          }
        },
        performance: {
          annual_clean_energy_mwh: cleanEnergyMwh,
          annual_carbon_offset_tco2: carbonOffsetTonnes,
          runoff_reduction_pct: runoffMitigatedPct
        }
      };
    },

    /**
     * Applies the selected package interventions to the current project
     */
    applyPackage(pkgKey, project) {
      const proj = project || (typeof window !== 'undefined' ? window.App?.currentProject : null);
      if (!proj) return null;

      const packages = this.generateParetoPackages(proj);
      const selected = packages.find(p => p.key === pkgKey || p.aliasKey === pkgKey) || packages[0];

      proj.interventions = proj.interventions || {};
      Object.assign(proj.interventions, selected.interventions);

      if (typeof window !== 'undefined' && window.App && typeof window.App.recalculateProject === "function") {
        window.App.recalculateProject();
      }
      return selected;
    }
  };

})(typeof window !== 'undefined' ? window : globalThis);
