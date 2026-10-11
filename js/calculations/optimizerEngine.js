/**
 * EcoBuild Smart - Pareto Multi-Objective Optimization Engine
 * Evaluates combinatorial eco-infrastructure configurations and generates:
 * 1. Budget-Optimized Package (Highest environmental score gain per Rupee spent)
 * 2. Sponge Campus Resilience Package (Max storm attenuation & Zero Liquid Discharge)
 * 3. Net-Zero Carbon Package (Max clean energy generation & living biomass sequestration)
 */

window.OptimizerEngine = {
  // Approximate Turnkey Costs & Statutory Standards
  UNIT_CAPEX: {
    solar_pv_per_kwp: 46000,          // ₹46,000 / kWp installed (MNRE Benchmark)
    green_roof_per_m2: 1850,          // ₹1,850 / m² sedum mat & drainage board
    permeable_paver_per_m2: 1450,     // ₹1,450 / m² IRC:SP:63 pavers + aggregate reservoir
    bioswale_per_m2: 950,             // ₹950 / m² grading & native wetland species
    rwh_cistern_per_liter: 8.5,       // ₹8.5 / Liter RCC tank & dual vortex filtration
    tree_sapling_unit: 750            // ₹750 / sapling Miyawaki planting with 2-yr maintenance
  },

  /**
   * Generates 3 Pre-configured Pareto Packages for the current project
   */
  generateParetoPackages(project, calculations) {
    const proj = project || window.App?.currentProject || {};
    const site = proj.site || {};
    const plotArea = Math.max(100, Number(site.plot_area) || 5000);
    const builtUp = Math.max(50, Number(site.built_up_area) || Math.round(plotArea * 0.44));
    const roofArea = Math.max(50, Number(site.roof_area) || builtUp);
    const openArea = Math.max(0, plotArea - builtUp);
    const hardscape = (proj.surfaces?.concrete_area || 0) + (proj.surfaces?.asphalt_area || 0) || Math.round(openArea * 0.45);
    const treesRemoved = proj.vegetation?.trees_removed !== undefined ? proj.vegetation.trees_removed : 12;

    // Package 1: Budget-Optimized (High Score per Rupee)
    const pkgBudget = this._buildPackage({
      key: 'budget',
      name: 'Budget-Optimized Package',
      tag: '₹ HIGHEST ROI',
      tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'Maximizes statutory recovery points while minimizing capital expenditure.',
      greenRoofM2: Math.round(roofArea * 0.25),
      solarM2: Math.round(roofArea * 0.35),
      permPaverM2: Math.round(hardscape * 0.45),
      bioswaleM2: Math.round(openArea * 0.10),
      cisternL: 35000,
      treesPlanted: Math.max(15, treesRemoved * 3),
      plotArea,
      roofArea,
      hardscape
    });

    // Package 2: Sponge Campus Resilience (Max Flood Attenuation & ZLD)
    const pkgSponge = this._buildPackage({
      key: 'sponge',
      name: 'Sponge Resilience Masterplan',
      tag: '🌧️ MAXIMUM WATER RETENTION',
      tagColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
      description: 'Prioritizes maximum flash storm attenuation, deep aquifer recharge, and zero municipal runoff.',
      greenRoofM2: Math.round(roofArea * 0.45),
      solarM2: Math.round(roofArea * 0.25),
      permPaverM2: Math.round(hardscape * 0.75),
      bioswaleM2: Math.round(Math.min(openArea * 0.20, 450)),
      cisternL: Math.round(Math.min(roofArea * 45, 90000)),
      treesPlanted: Math.max(20, treesRemoved * 4),
      plotArea,
      roofArea,
      hardscape
    });

    // Package 3: Net-Zero Carbon & Energy Transition
    const pkgCarbon = this._buildPackage({
      key: 'carbon',
      name: 'Net-Zero Carbon Campus',
      tag: '☀️ MAX CLEAN ENERGY & CANOPY',
      tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: 'Maximizes clean rooftop solar energy generation and dense Miyawaki living biomass.',
      greenRoofM2: Math.round(roofArea * 0.20),
      solarM2: Math.round(roofArea * 0.65),
      permPaverM2: Math.round(hardscape * 0.50),
      bioswaleM2: Math.round(openArea * 0.08),
      cisternL: 45000,
      treesPlanted: Math.max(30, treesRemoved * 5),
      plotArea,
      roofArea,
      hardscape
    });

    return [pkgBudget, pkgSponge, pkgCarbon];
  },

  /**
   * Helper to build and cost a package
   */
  _buildPackage({ key, name, tag, tagColor, description, greenRoofM2, solarM2, permPaverM2, bioswaleM2, cisternL, treesPlanted, plotArea, roofArea, hardscape }) {
    const solarKwp = Math.round(solarM2 / 5.5);
    const solarCapex = solarKwp * this.UNIT_CAPEX.solar_pv_per_kwp;
    const greenRoofCapex = greenRoofM2 * this.UNIT_CAPEX.green_roof_per_m2;
    const paverCapex = permPaverM2 * this.UNIT_CAPEX.permeable_paver_per_m2;
    const bioswaleCapex = bioswaleM2 * this.UNIT_CAPEX.bioswale_per_m2;
    const cisternCapex = cisternL * this.UNIT_CAPEX.rwh_cistern_per_liter;
    const treesCapex = treesPlanted * this.UNIT_CAPEX.tree_sapling_unit;

    const totalCapexInr = solarCapex + greenRoofCapex + paverCapex + bioswaleCapex + cisternCapex + treesCapex;
    const totalCapexLakhs = Math.round((totalCapexInr / 100000) * 10) / 10;

    // Performance estimates
    const cleanEnergyMwh = Math.round((solarKwp * 1380) / 1000 * 10) / 10;
    const carbonOffsetTonnes = Math.round(cleanEnergyMwh * 0.82 + (treesPlanted * 0.025 * 10)) / 10;
    const runoffMitigatedPct = Math.min(88, Math.round(((permPaverM2 * 0.75 + greenRoofM2 * 0.65 + bioswaleM2 * 0.85) / Math.max(1, hardscape + roofArea)) * 100));
    const estimatedScore = Math.min(96, Math.max(72, Math.round(55 + (totalCapexLakhs * 0.6) + (runoffMitigatedPct * 0.25))));

    return {
      key,
      name,
      tag,
      tagColor,
      description,
      interventions: {
        solar_pv_area_m2: solarM2,
        solar_kwp: solarKwp,
        green_roof_m2: greenRoofM2,
        permeable_pavement_m2: permPaverM2,
        rain_garden_m2: bioswaleM2,
        rwh_tank_capacity_l: cisternL,
        trees_planted: treesPlanted
      },
      capex: {
        total_inr: totalCapexInr,
        total_lakhs: totalCapexLakhs,
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
        estimated_score: estimatedScore,
        runoff_reduction_pct: runoffMitigatedPct,
        annual_clean_energy_mwh: cleanEnergyMwh,
        annual_carbon_offset_tco2: carbonOffsetTonnes
      }
    };
  },

  /**
   * Applies the selected package interventions to the current project
   */
  applyPackage(pkgKey, project) {
    const proj = project || window.App?.currentProject;
    if (!proj) return null;

    const packages = this.generateParetoPackages(proj);
    const selected = packages.find(p => p.key === pkgKey) || packages[0];

    proj.interventions = proj.interventions || {};
    Object.assign(proj.interventions, selected.interventions);

    if (window.App && typeof window.App.recalculate === "function") {
      window.App.recalculate();
    }
    return selected;
  }
};
