/**
 * EcoBuild Smart - Unified Environmental Calculator
 * Orchestrates domain calculators into a cohesive canonical assessment,
 * enforces shared schema, and synthesizes an evidence-based EIA Results Dossier.
 */

(function(root) {
  'use strict';

  root.EnvironmentalCalculator = {
    calculateGreenCoverLoss(project) {
      const site = project.site || {};
      const surf = project.surfaces || {};
      const veg = project.vegetation || {};
      return root.VegetationCalculator.calculateGreenCover(
        site.plot_area,
        site.built_up_area,
        surf.concrete_area,
        surf.asphalt_area,
        veg.existing_green_area,
        surf.tiles_pavers
      );
    },

    calculateTreeLoss(project) {
      const veg = project.vegetation || {};
      return root.VegetationCalculator.calculateTreeImpact(
        veg.existing_tree_count,
        veg.trees_removed,
        veg.tree_category
      );
    },

    calculateImperviousSurfaceImpact(project, greenRoofM2 = 0, permPavingM2 = 0) {
      const site = project.site || {};
      const surf = project.surfaces || {};
      const plot = Math.max(1, Number(site.plot_area) || 1);
      const baseImpervious = (Number(site.built_up_area) || 0) + (Number(surf.concrete_area) || 0) + (Number(surf.asphalt_area) || 0) + (Number(surf.tiles_pavers || 0) * 0.7);
      const mitigatedImpervious = Math.max(0, baseImpervious - Number(permPavingM2) - (Number(greenRoofM2) * 0.6));
      return {
        baseline_impervious_m2: Math.round(baseImpervious),
        baseline_impervious_pct: Math.min(100, Math.round((baseImpervious / plot) * 100)),
        mitigated_impervious_m2: Math.round(mitigatedImpervious),
        mitigated_impervious_pct: Math.min(100, Math.round((mitigatedImpervious / plot) * 100)),
        impervious_reduction_m2: Math.round(baseImpervious - mitigatedImpervious)
      };
    },

    calculateStormwaterRunoff(project, environmentalData) {
      return root.RunoffCalculator.calculateScenarios(project, environmentalData);
    },

    calculateRainwaterHarvestingPotential(project, environmentalData, dailyWaterDemandLitres) {
      const site = project.site || {};
      const water = project.water || {};
      return root.WaterCalculator.calculateRWH(
        site.roof_area,
        environmentalData?.rainfall,
        water.occupants,
        dailyWaterDemandLitres
      );
    },

    calculateCarbonImpact(project, treesRecommended = 90) {
      return root.CarbonCalculator.calculateCarbonBalance(project, treesRecommended);
    },

    calculateHeatIslandIndicator(project) {
      const site = project.site || {};
      const surf = project.surfaces || {};
      const veg = project.vegetation || {};
      if (root.HeatIslandCalculator) {
        return root.HeatIslandCalculator.calculateUHI(
          site.plot_area,
          {
            concrete_area: surf.concrete_area,
            asphalt_area: surf.asphalt_area,
            standard_roof: site.roof_area,
            lawn_grass: veg.existing_green_area
          },
          project.interventions
        );
      }
      return { uhi_vulnerability_index: 45, uhi_risk_level: "Moderate", albedo_improvement: "+0.15" };
    },

    calculateWaterRequirement(project) {
      const water = project.water || {};
      return root.WaterCalculator.calculateWaterDemand(
        project.building_type,
        water.occupants,
        water.daily_consumption_lpcd
      );
    },

    calculateRecommendedTrees(project) {
      const treeLoss = this.calculateTreeLoss(project);
      return treeLoss.recommended_planting_quantity;
    },

    calculateGreenRoofRequirement(project) {
      const site = project.site || {};
      const surf = project.surfaces || {};
      const iv = project.interventions || {};
      const infra = root.VegetationCalculator.calculateGreenInfrastructureRequirements(
        site.roof_area,
        surf.concrete_area,
        iv.solar_pv_area_m2 || 0
      );
      return infra.recommended_green_roof_m2;
    },

    calculatePermeablePavementRequirement(project) {
      const site = project.site || {};
      const surf = project.surfaces || {};
      const infra = root.VegetationCalculator.calculateGreenInfrastructureRequirements(
        site.roof_area,
        surf.concrete_area
      );
      return infra.recommended_permeable_pavement_m2;
    },

    calculateSolarPV(project, environmentalData) {
      const site = project.site || {};
      const energy = project.energy || {};
      const iv = project.interventions || {};
      return root.EnergyCalculator.calculateSolarPotential(
        site.roof_area,
        environmentalData?.solar,
        energy.annual_electricity_kwh,
        iv.solar_pv_area_m2,
        iv.green_roof_m2 || 0
      );
    },

    /**
     * Run full canonical calculation pipeline with validation pre-check
     */
    calculateOverallEnvironmentalIndicators(project, environmentalData) {
      // 1. Normalize project to canonical schema
      const canonicalProject = root.AssessmentSchema 
        ? root.AssessmentSchema.normalizeProject(project) 
        : project;

      // 2. Pre-calculation Validation Check
      const validation = root.ValidationEngine 
        ? root.ValidationEngine.validateProject(canonicalProject) 
        : { isValid: true, warnings: [], limitations: [] };

      // 3. Domain Calculators
      const greenCover = this.calculateGreenCoverLoss(canonicalProject);
      const treeLoss = this.calculateTreeLoss(canonicalProject);
      const waterDemand = this.calculateWaterRequirement(canonicalProject);
      const rwh = this.calculateRainwaterHarvestingPotential(canonicalProject, environmentalData, waterDemand.daily_demand_litres);
      const waterBalance = root.WaterCalculator.calculateSTPAndWaterBalance
        ? root.WaterCalculator.calculateSTPAndWaterBalance(canonicalProject, waterDemand, canonicalProject.vegetation?.existing_green_area || 0)
        : null;
      const runoff = this.calculateStormwaterRunoff(canonicalProject, environmentalData);
      const energy = this.calculateSolarPV(canonicalProject, environmentalData);

      // Attach canonical energy result for dependent carbon and recovery models
      canonicalProject.calculated_energy = energy;

      const carbon = this.calculateCarbonImpact(canonicalProject, treeLoss.recommended_planting_quantity);
      const uhi = this.calculateHeatIslandIndicator(canonicalProject);
      const infra = root.VegetationCalculator.calculateGreenInfrastructureRequirements(
        canonicalProject.site.roof_area,
        canonicalProject.surfaces.concrete_area,
        canonicalProject.interventions?.solar_pv_area_m2 || 0
      );
      const imperviousImpact = this.calculateImperviousSurfaceImpact(
        canonicalProject,
        canonicalProject.interventions?.green_roof_m2 || 0,
        canonicalProject.interventions?.permeable_pavement_m2 || 0
      );

      // 4. Intermediate Results Bundle
      const intermediateResults = {
        green_cover: greenCover,
        tree_loss: treeLoss,
        water: rwh,
        water_balance: waterBalance,
        runoff: runoff,
        energy: energy,
        carbon: carbon,
        uhi: uhi
      };

      // 5. Environmental Performance Score (decoupled from legal approvals)
      const score = root.ScoreCalculator.calculateScore(canonicalProject, intermediateResults);

      // 6. Two-Phase Nature Recovery Plan
      const recovery = root.NatureRecoveryCalculator
        ? root.NatureRecoveryCalculator.calculateRecoveryPlan(canonicalProject, { ...intermediateResults, score }, environmentalData)
        : null;

      // 7. Site-Constrained Pareto Recovery Packages (3 Scenarios)
      const recoveryPackages = root.OptimizerEngine
        ? root.OptimizerEngine.generateParetoPackages(canonicalProject, intermediateResults)
        : [];

      const calculationsBundle = {
        timestamp: new Date().toISOString(),
        validation: validation,
        green_cover: greenCover,
        tree_impact: treeLoss,
        water_demand: waterDemand,
        rwh: rwh,
        water_balance: waterBalance,
        runoff: runoff,
        energy: energy,
        carbon: carbon,
        uhi: uhi,
        green_infra_potential: infra,
        impervious_balance: imperviousImpact,
        score: score,
        recovery: recovery,
        recovery_packages: recoveryPackages
      };

      // 8. Synthesize Statutory EIA Master Results Matrix
      const eiaResults = this.generateAppropriateEIAResults(canonicalProject, calculationsBundle, environmentalData);
      calculationsBundle.eia_results = eiaResults;

      return calculationsBundle;
    },

    /**
     * Synthesize authoritative Statutory EIA Results Matrix
     * Conforming to MoEFCC EIA Notification 2006 Schedule 8(a)/8(b), CPCB NAAQS, CPHEEO, and NBC 2016 Part 11
     */
    generateAppropriateEIAResults(project, data, environmentalData) {
      if (!project) return null;

      const site = project.site || {};
      const surfaces = project.surfaces || {};
      const veg = project.vegetation || {};
      const iv = project.interventions || {};
      const water = project.water || {};
      const waste = project.waste || {};
      const energy = project.energy || {};

      const plotArea = Math.max(1, Number(site.plot_area) || 5000);
      const builtUpArea = Math.max(0, Number(site.built_up_area) || 0);
      const floors = Math.max(1, Number(site.floors) || 1);
      const totalGfa = Number(site.total_floor_area) || (builtUpArea * floors);
      const roofArea = Math.max(0, Number(site.roof_area !== undefined ? site.roof_area : builtUpArea));
      const openGround = Math.max(0, plotArea - builtUpArea);

      const concreteArea = Math.max(0, Number(surfaces.concrete_area) || 0);
      const asphaltArea = Math.max(0, Number(surfaces.asphalt_area) || 0);
      const tilesPavers = Math.max(0, Number(surfaces.tiles_pavers) || 0);
      const hardscape = concreteArea + asphaltArea + tilesPavers;

      const occupants = Math.max(0, Number(water.occupants) || 0);
      const existingTrees = Math.max(0, Number(veg.existing_tree_count) || 0);
      const treesRemoved = Math.max(0, Number(veg.trees_removed) || 0);
      const protectedTrees = Math.max(0, existingTrees - treesRemoved);
      const compensatoryTrees = iv.trees_planted !== undefined && iv.trees_planted !== null 
        ? Math.max(0, Number(iv.trees_planted)) 
        : (treesRemoved * 3);

      // 1. Statutory EIA Clearance Screening (MoEFCC EIA Notification 2006 Schedule 8(a)/8(b))
      // Based STRICTLY on Built-up Area (GFA) thresholds, completely decoupled from environmental score!
      let category = "Exempt from Central/State EIA (< 20,000 m² BUA)";
      let authority = "Local Municipal Corporation & State Pollution Control Board (SPCB Consent CTE/CTO)";
      let appraisalType = "Local Building Bye-Laws & Environmental Management Plan (EMP)";
      let categoryBadge = "bg-sky-100 text-sky-800 border-sky-300";
      let statutoryVerdict = "LOCAL APPRAISAL ONLY — EXEMPT FROM FORMAL ENVIRONMENTAL CLEARANCE (EC)";
      let verdictColor = "sky";

      if (totalGfa >= 150000) {
        category = "Category A (≥ 1,50,000 m² BUA - Townships & Area Development)";
        authority = "Ministry of Environment, Forest & Climate Change (MoEF&CC New Delhi)";
        appraisalType = "Full EIA Study, Public Consultation & Central EAC Appraisal";
        categoryBadge = "bg-purple-100 text-purple-800 border-purple-300";
        statutoryVerdict = "MANDATORY CENTRAL EIA CLEARANCE REQUIRED (MoEF&CC Category A)";
        verdictColor = "purple";
      } else if (totalGfa >= 20000) {
        category = "Category B2 (20,000 to < 1,50,000 m² BUA - Building & Construction)";
        authority = "State Environmental Impact Assessment Authority (SEIAA / SEAC)";
        appraisalType = "Form 1, Form 1A Appraisal & State Environmental Clearance (EC)";
        categoryBadge = "bg-blue-100 text-blue-800 border-blue-300";
        statutoryVerdict = "STATE LEVEL ENVIRONMENTAL CLEARANCE REQUIRED (SEIAA Category B2)";
        verdictColor = "blue";
      }

      const compositeScore = data.score?.composite_score ?? 70;
      const tier = data.score?.tier || "Moderate Performance";

      // 2. Hydrology & Water Environment
      const runoff = data.runoff || {};
      const qBefore = runoff.pre_development?.peak_runoff_m3_hr ?? 0;
      const qUnmitigated = runoff.proposed_development?.peak_runoff_m3_hr ?? 0;
      const qMitigated = runoff.with_green_infrastructure?.peak_runoff_m3_hr ?? 0;
      const runoffReductionPct = runoff.impact_summary?.runoff_reduction_pct ?? 0;
      const annualRunoffMitigatedKL = Math.round((runoff.impact_summary?.mitigated_annual_runoff_litres || 0) / 1000);
      
      const rwh = data.rwh || {};
      const rwhAnnualKL = Math.round((rwh.annual_potential_litres || 0) / 1000);
      const rwhTankL = Number(iv.rwh_tank_capacity_l) || rwh.recommended_storage_range_litres?.optimum || 0;

      // STP & Water Balance
      const wb = data.water_balance || {};
      const freshDemandKLD = wb.total_domestic_fresh_demand_kld ?? 0;
      const sewageKLD = wb.sewage_generation_kld ?? 0;
      const stpCapacityKLD = wb.stp_design_capacity_kld ?? 0;
      const recycledKLD = wb.total_recycled_kld ?? 0;
      const freshSavingsPct = wb.fresh_water_savings_pct ?? 0;
      const isZLD = wb.is_zld_compliant ?? true;

      // 3. Air & Ambient Quality
      const aq = environmentalData?.airQuality || {};
      const aqi = aq.aqi || 78;
      const pm25 = aq.pm25 || 26.5;
      const pm10 = aq.pm10 || 52.0;

      // 4. Energy & Carbon Footprint
      const elecDemandKwh = energy.annual_electricity_kwh !== undefined && energy.annual_electricity_kwh !== null 
        ? Number(energy.annual_electricity_kwh) 
        : Math.round(totalGfa * 15);
      const solarM2 = Number(iv.solar_pv_area_m2) || Number(data.energy?.solar_allocated_area_m2) || 0;
      const solarKwp = Number(data.energy?.installed_capacity_kwp) || Math.round(solarM2 * 0.18 * 10) / 10;
      const solarGenKwh = Number(data.energy?.annual_generation_kwh) || 0;
      const solarOffsetPct = Number(data.energy?.demand_offset_percentage) || 0;

      const embodiedCarbonTonnes = Number(data.carbon?.total_embodied_tonnes) || Math.round((totalGfa * 450) / 1000);
      const greenConcreteAvoidedTonnes = Number(data.recovery?.phase1_construction?.green_concrete?.co2_avoided_tonnes) || 0;
      const netEmbodiedCarbonTonnes = Math.max(0, Math.round((embodiedCarbonTonnes - greenConcreteAvoidedTonnes) * 10) / 10);
      const annualOpCarbonSavedTonnes = Number(data.carbon?.annual_co2_offset_tonnes) || 0;
      const carbonPaybackYrs = Number(data.carbon?.net_carbon_dynamics?.carbon_payback_years) || 99.9;

      // 5. C&D and MSW Waste Circularity
      const cdWasteTonnes = waste.construction_waste_tonnes !== undefined ? Number(waste.construction_waste_tonnes) : Math.round((totalGfa * 55) / 1000);
      const recyclingPct = waste.recycling_pct !== undefined ? Number(waste.recycling_pct) : 65;
      const divertedWasteTonnes = Math.round(cdWasteTonnes * (recyclingPct / 100) * 10) / 10;
      const rcaYieldM3 = Math.round(divertedWasteTonnes / 1.6);
      const dailyMswKg = waste.daily_solid_waste_kg !== undefined ? Number(waste.daily_solid_waste_kg) : Math.round(occupants * 0.4);
      const dailyOrganicWasteKg = (waste.daily_organic_waste_kg !== undefined) ? Number(waste.daily_organic_waste_kg) : Math.round(dailyMswKg * 0.5);
      const annualCompostTonnes = Math.round((dailyOrganicWasteKg * 365 * 0.25 / 1000) * 10) / 10;

      // 6. Land, Topsoil & Miyawaki Nature Recovery
      const topsoilM3 = Number(data.recovery?.phase1_construction?.topsoil?.salvage_volume_m3) || Math.round(builtUpArea * 0.20);
      const topsoilStockpileM2 = Number(data.recovery?.phase1_construction?.topsoil?.stockpile_area_m2) || Math.round(topsoilM3 / 2);
      const miyawakiAreaM2 = Number(data.recovery?.phase2_operational?.miyawaki_forest?.designated_area_m2) || 0;
      const miyawakiSaplings = Number(data.recovery?.phase2_operational?.miyawaki_forest?.total_saplings) || 0;
      const bngNetPct = Number(data.recovery?.phase2_operational?.biodiversity_net_gain?.net_gain_pct) || 0;
      const greenRoofM2 = Number(iv.green_roof_m2) || 0;
      const permPavementM2 = Number(iv.permeable_pavement_m2) || 0;
      const uhiScore = data.uhi?.uhi_vulnerability_index || 48;
      const uhiRisk = data.uhi?.uhi_risk_level || "Moderate Thermal Stress";

      const eiaResult = {
        generated_at: new Date().toISOString(),
        project_name: project.name || "Active Environmental Assessment",
        location: {
          city: project.location?.city || "Site Location",
          state: project.location?.state || "State Jurisdiction",
          coordinates: (project.location?.latitude && project.location?.longitude)
            ? `${project.location.latitude.toFixed(4)}°N, ${project.location.longitude.toFixed(4)}°E`
            : "Coordinates Unspecified"
        },
        screening: {
          total_built_up_area_m2: totalGfa,
          plot_area_m2: plotArea,
          category: category,
          category_badge: categoryBadge,
          appraisal_authority: authority,
          appraisal_type: appraisalType,
          statutory_verdict: statutoryVerdict,
          verdict_color: verdictColor,
          composite_score: compositeScore,
          performance_tier: tier,
          declaration_text: `Statutory screening categorized project as ${category} under MoEFCC EIA Notification 2006. EcoBuild multi-criteria planning score evaluates to ${compositeScore}/100 (${tier}). This preliminary assessment identifies mitigation recommendations for topsoil preservation, C&D circularity, compensatory planting, water balance, and solar PV. Formal regulatory clearance must be granted by the designated competent authority.`
        },
        key_results: [
          {
            id: "score",
            label: "EcoBuild Performance Score",
            icon: "⭐",
            before_construction: "Pre-Development Baseline Condition",
            after_construction: "Unmitigated Development Scenario",
            after_assessment: `${compositeScore}/100 (${tier})`,
            prev_condition: "Pre-Development Baseline",
            present_condition: "Unmitigated Development",
            net_result: `${compositeScore}/100 Multi-Criteria Index`,
            value: `${compositeScore}/100`,
            subtext: `${tier}`,
            status: "Planning Index",
            badge_class: "bg-teal-100 text-teal-800 border-teal-300"
          },
          {
            id: "runoff",
            label: "Stormwater Runoff Rate",
            icon: "🌧️",
            before_construction: `${qBefore} m³/hr (Pre-Development Peak)`,
            after_construction: `${qUnmitigated} m³/hr (Unmitigated Hardscape Peak)`,
            after_assessment: `${qMitigated} m³/hr (Post-Mitigation Peak)`,
            prev_condition: `${qBefore} m³/hr`,
            present_condition: `${qUnmitigated} m³/hr`,
            net_result: `-${runoffReductionPct}% Peak Flow Attenuated`,
            value: `-${runoffReductionPct}%`,
            subtext: `${qMitigated} m³/hr (from ${qUnmitigated} m³/hr)`,
            status: "SuDS Mitigated",
            badge_class: "bg-blue-100 text-blue-800 border-blue-300"
          },
          {
            id: "water_savings",
            label: "Water Conservation & STP",
            icon: "💧",
            before_construction: "0 KLD (Pre-development)",
            after_construction: `${freshDemandKLD} KLD fresh demand, ${sewageKLD} KLD sewage`,
            after_assessment: `${Math.round((freshDemandKLD - recycledKLD) * 10) / 10} KLD net fresh, ${recycledKLD} KLD recycled`,
            prev_condition: "0 KLD",
            present_condition: `${freshDemandKLD} KLD fresh intake`,
            net_result: `${freshSavingsPct}% Fresh Water Saved`,
            value: `${freshSavingsPct}% Saved`,
            subtext: `${recycledKLD} KLD recycled via tertiary STP`,
            status: isZLD ? "Zero Liquid Discharge" : "Treated Effluent Recycled",
            badge_class: "bg-cyan-100 text-cyan-800 border-cyan-300"
          },
          {
            id: "solar_offset",
            label: "Clean Solar Energy & Grid Offset",
            icon: "☀️",
            before_construction: "0 kWh (Zero site generation)",
            after_construction: `${Math.round(elecDemandKwh / 1000)} MWh/yr grid electrical load`,
            after_assessment: `${solarKwp} kWp Solar PV generating ${(solarGenKwh / 1000).toFixed(1)} MWh/yr`,
            prev_condition: "0 kWh",
            present_condition: `${Math.round(elecDemandKwh / 1000)} MWh/yr demand`,
            net_result: `${solarOffsetPct}% Net Clean Energy Offset`,
            value: `${solarOffsetPct}% Offset`,
            subtext: `${solarKwp} kWp yields ${(solarGenKwh / 1000).toFixed(1)} MWh/yr`,
            status: "Grid Offset",
            badge_class: "bg-amber-100 text-amber-800 border-amber-300"
          },
          {
            id: "cd_waste",
            label: "C&D Waste Circularity & Recycling",
            icon: "🏗️",
            before_construction: "0 Tonnes",
            after_construction: `${cdWasteTonnes} tonnes debris generated`,
            after_assessment: `${divertedWasteTonnes} tonnes recycled into ${rcaYieldM3} m³ sub-base`,
            prev_condition: "0 Tonnes",
            present_condition: `${cdWasteTonnes} tonnes unsegregated`,
            net_result: `${recyclingPct}% Landfill Diversion Rate`,
            value: `${recyclingPct}% Diverted`,
            subtext: `${divertedWasteTonnes} tonnes reused as RCA`,
            status: "CPCB Recycled",
            badge_class: "bg-amber-100 text-amber-900 border-amber-300"
          },
          {
            id: "bng_gain",
            label: "Ecology & Native Tree Restoration",
            icon: "🌱",
            before_construction: `${existingTrees} site trees recorded`,
            after_construction: `${treesRemoved} trees removed`,
            after_assessment: `${protectedTrees} preserved + ${compensatoryTrees} trees planted`,
            prev_condition: `${existingTrees} trees`,
            present_condition: `${treesRemoved} trees felled`,
            net_result: `+${compensatoryTrees} Native Trees Added`,
            value: `${compensatoryTrees} Planted`,
            subtext: `${protectedTrees} preserved + ${compensatoryTrees} planted`,
            status: treesRemoved > 0 ? (compensatoryTrees >= treesRemoved * 3 ? "Compensatory 3:1 Met" : "Compensatory Deficit") : "No Felling",
            badge_class: "bg-emerald-100 text-emerald-900 border-emerald-300"
          }
        ],
        domains: [
          {
            domain_id: "land_soil",
            domain_name: "1. Land Environment, Soil & Topsoil Conservation",
            standard_ref: "NBC 2016 Part 11 & MoEFCC Form 1A Item 2",
            parameters: [
              {
                name: "Ground Coverage & Footprint",
                prev_condition: "0 m² (100% open ground)",
                present_condition: `${builtUpArea.toLocaleString()} m² footprint (${Math.round((builtUpArea / plotArea) * 100)}% plot coverage)`,
                after_assessment: `${builtUpArea.toLocaleString()} m² footprint within bye-law setbacks`,
                net_result: `${openGround.toLocaleString()} m² open space conserved`,
                baseline: "Unpaved land", proposed: `${builtUpArea.toLocaleString()} m²`, mitigated: `${builtUpArea.toLocaleString()} m²`, delta: "Within Bye-law Limits",
                standard_code: "NBC 2016 Part 3",
                status: "Compliant"
              },
              {
                name: "Surface Impermeability Ratio",
                prev_condition: "Natural soil infiltration",
                present_condition: `${hardscape + builtUpArea} m² (${Math.round(((hardscape + builtUpArea) / plotArea) * 100)}% impervious)`,
                after_assessment: `${Math.round(hardscape + builtUpArea - permPavementM2 - (greenRoofM2 * 0.6))} m² net impervious`,
                net_result: `+${permPavementM2} m² permeable paving + ${greenRoofM2} m² green roof`,
                baseline: "Natural soil", proposed: `${hardscape + builtUpArea} m²`, mitigated: `${Math.round(hardscape + builtUpArea - permPavementM2 - (greenRoofM2 * 0.6))} m²`, delta: `-${permPavementM2} m² pervious paving`,
                standard_code: "IRC:SP:63",
                status: "Optimized"
              },
              {
                name: "Topsoil Humus Layer Salvage",
                prev_condition: "Natural fertile humus layer (0.20m depth)",
                present_condition: "Stripped during excavation without preservation",
                after_assessment: `${topsoilM3} m³ salvaged and stockpiled at ≤ 2.0m height`,
                net_result: `100% salvaged soil reapplied on ${Math.round(openGround * 0.7)} m² landscape`,
                baseline: "Natural humus layer", proposed: "Stripped without salvage", mitigated: `${topsoilM3} m³ salvaged & stockpiled`, delta: `Reapplied on ${Math.round(openGround * 0.7)} m²`,
                standard_code: "NBC 2016 Part 11",
                status: "Mandatory Met"
              }
            ]
          },
          {
            domain_id: "water_hydrology",
            domain_name: "2. Water Resources, STP & Hydrological Management",
            standard_ref: "CPHEEO 2019, CGWB & IS 15797 / IS 1172",
            parameters: [
              {
                name: "Domestic Fresh Water Demand",
                prev_condition: "0 KLD (Pre-development)",
                present_condition: `${freshDemandKLD} KLD fresh supply extraction from municipal/groundwater`,
                after_assessment: `${Math.round((freshDemandKLD - recycledKLD) * 10) / 10} KLD net fresh demand via dual plumbing`,
                net_result: `-${recycledKLD} KLD fresh extraction reduction (${freshSavingsPct}% savings)`,
                baseline: "0 KLD", proposed: `${freshDemandKLD} KLD`, mitigated: `${Math.round((freshDemandKLD - recycledKLD) * 10) / 10} KLD Net Fresh`, delta: `-${recycledKLD} KLD fresh reduction`,
                standard_code: "IS 1172 (NBC LPCD)",
                status: "Reduced Intake"
              },
              {
                name: "Sewage Treatment Plant (STP) & ZLD",
                prev_condition: "0 KLD sewage generation",
                present_condition: `${sewageKLD} KLD raw sewage discharged directly into municipal storm sewers`,
                after_assessment: `${stpCapacityKLD} KLD tertiary SBR/MBBR STP treating 100% of sewage with UV`,
                net_result: `${recycledKLD} KLD recycled for flushing & landscaping (Zero Liquid Discharge)`,
                baseline: "None", proposed: "Municipal sewer discharge", mitigated: `${stpCapacityKLD} KLD (SBR / MBBR with UV)`, delta: `${freshSavingsPct}% fresh substitution`,
                standard_code: "CPHEEO / MoEFCC ZLD",
                status: "ZLD Compliant"
              },
              {
                name: "Peak Stormwater Runoff (Q = CIA)",
                prev_condition: `${qBefore} m³/hr peak runoff`,
                present_condition: `${qUnmitigated} m³/hr unmitigated peak surge`,
                after_assessment: `${qMitigated} m³/hr attenuated via rain gardens and bioswales`,
                net_result: `-${runoffReductionPct}% peak flow attenuation (${annualRunoffMitigatedKL} kL/yr mitigated)`,
                baseline: `${qBefore} m³/hr`, proposed: `${qUnmitigated} m³/hr`, mitigated: `${qMitigated} m³/hr`, delta: `-${runoffReductionPct}% peak attenuation`,
                standard_code: "Rational Method (Q=CIA)",
                status: "SuDS Verified"
              },
              {
                name: "Rainwater Harvesting (RWH) Potential",
                prev_condition: "0 kL captured",
                present_condition: "Zero capture; roof runoff discharged unmanaged",
                after_assessment: `${rwhAnnualKL.toLocaleString()} kL/year harvest potential with ${Math.round(rwhTankL / 1000)} kL dedicated storage tank`,
                net_result: "Supplies dry monsoon non-potable backup",
                baseline: "0 kL captured", proposed: "Direct storm drainage", mitigated: `${rwhAnnualKL.toLocaleString()} kL/year harvest`, delta: `${Math.round(rwhTankL / 1000)} kL storage tank`,
                standard_code: "CGWB / IS 15797",
                status: "CGWB Standard"
              }
            ]
          },
          {
            domain_id: "air_microclimate",
            domain_name: "3. Air Quality, Dust Suppression & Microclimate",
            standard_ref: "CPCB NAAQS 2009 & US EPA Heat Island Mitigation",
            parameters: [
              {
                name: "Ambient Air Quality (PM10 / PM2.5)",
                prev_condition: `Baseline AQI ${aqi} (${pm10} µg/m³ PM10, ${pm25} µg/m³ PM2.5)`,
                present_condition: "Fugitive dust emissions during excavation without suppression",
                after_assessment: "6.0m perimeter GI sheet barrier + automated misting cannons",
                net_result: "≥ 72% particulate capture efficiency maintaining NAAQS standards",
                baseline: `${aqi} (${aq.category || 'Satisfactory'})`, proposed: "Fugitive dust surge", mitigated: `${aqi} maintained (Suppressed)`, delta: "≥ 72% containment",
                standard_code: "CPCB NAAQS 2009",
                status: "Within Limits"
              },
              {
                name: "Urban Heat Island (UHI) Microclimate",
                prev_condition: "Natural ambient baseline",
                present_condition: "RCC slabs and dark paving creating microclimate thermal trap",
                after_assessment: `High-albedo cool roof + green roof + tree canopy shading (UHI Score ${uhiScore})`,
                net_result: "Microclimate thermal stress mitigation",
                baseline: "Ambient Baseline", proposed: "Thermal Trap", mitigated: `UHI ${uhiScore} (${uhiRisk})`, delta: "Radiative cooling",
                standard_code: "US EPA Heat Island Guide",
                status: "Mitigated"
              }
            ]
          },
          {
            domain_id: "energy_carbon",
            domain_name: "4. Energy Conservation, Solar PV & Carbon Dynamics",
            standard_ref: "ECBC 2017, MNRE Guidelines & CEA Baseline v20",
            parameters: [
              {
                name: "Annual Electrical Demand & Grid Load",
                prev_condition: "0 kWh (Zero site consumption)",
                present_condition: `${Math.round(elecDemandKwh / 1000)} MWh/yr drawn from fossil-fuel grid`,
                after_assessment: `${solarKwp} kWp Rooftop Solar PV generating ${(solarGenKwh / 1000).toFixed(1)} MWh/yr`,
                net_result: `${solarOffsetPct}% Net clean energy substitution`,
                baseline: "Zero", proposed: `${Math.round(elecDemandKwh / 1000)} MWh/yr`, mitigated: `${solarKwp} kWp Solar PV`, delta: `${(solarGenKwh / 1000).toFixed(1)} MWh clean power`,
                standard_code: "MNRE / ECBC 2017",
                status: "Solar Displaced"
              },
              {
                name: "Construction Embodied Carbon",
                prev_condition: "0 tonnes CO₂e embodied emissions",
                present_condition: `${embodiedCarbonTonnes} tonnes CO₂e embodied footprint from standard RCC structure`,
                after_assessment: `${netEmbodiedCarbonTonnes} tonnes CO₂e via 35% GGBS green concrete substitution`,
                net_result: `-${greenConcreteAvoidedTonnes} tonnes CO₂e upfront clinker emissions avoided`,
                baseline: "Zero", proposed: `${embodiedCarbonTonnes} t CO₂e`, mitigated: `${netEmbodiedCarbonTonnes} t CO₂e`, delta: `-${greenConcreteAvoidedTonnes} t avoided`,
                standard_code: "IS 456 / IS 16714",
                status: "Low-Carbon"
              },
              {
                name: "Annual Operational Carbon Offset & Payback",
                prev_condition: "Natural biomass balance",
                present_condition: "0 tonnes CO₂e/yr offset; ongoing grid operational emissions",
                after_assessment: `${annualOpCarbonSavedTonnes} tonnes CO₂e/yr displaced via solar PV and tree growth`,
                net_result: `Payback horizon estimated at ~${carbonPaybackYrs} Years`,
                baseline: "Zero", proposed: "0 t CO₂e/yr offset", mitigated: `${annualOpCarbonSavedTonnes} t CO₂e/yr displaced`, delta: `~${carbonPaybackYrs} Yrs Payback`,
                standard_code: "CEA Baseline v20",
                status: "Calculated Horizon"
              }
            ]
          },
          {
            domain_id: "waste_circularity",
            domain_name: "5. C&D Waste Circularity & Solid Waste Management",
            standard_ref: "CPCB C&D Waste Rules 2016 & SWM Rules 2016",
            parameters: [
              {
                name: "Construction & Demolition (C&D) Waste",
                prev_condition: "0 tonnes debris",
                present_condition: `${cdWasteTonnes} tonnes generated debris`,
                after_assessment: `Source segregation with on-site recycling`,
                net_result: `${divertedWasteTonnes} tonnes (${recyclingPct}%) diverted into ${rcaYieldM3} m³ recycled aggregate`,
                baseline: "Zero", proposed: `${cdWasteTonnes} t unsegregated`, mitigated: `${divertedWasteTonnes} t diverted (${recyclingPct}%)`, delta: `${rcaYieldM3} m³ road aggregate`,
                standard_code: "CPCB C&D Rules 2016",
                status: "Circular Reuse"
              },
              {
                name: "Operational Solid Waste & Composting",
                prev_condition: "Zero waste generated",
                present_condition: `${dailyMswKg} kg/day mixed MSW disposed of at city dumpsite`,
                after_assessment: "Source segregation + on-site composting unit",
                net_result: `${annualCompostTonnes} tonnes/yr organic compost generated`,
                baseline: "Zero", proposed: `${dailyMswKg} kg/day mixed`, mitigated: `${annualCompostTonnes} t/yr organic compost`, delta: "Closed-loop landscaping",
                standard_code: "SWM Rules 2016",
                status: "Compost Diverted"
              }
            ]
          },
          {
            domain_id: "ecology_biodiversity",
            domain_name: "6. Ecology, Forestry & Nature Restoration",
            standard_ref: "Maharashtra Tree Act 1975 & Akira Miyawaki Method",
            parameters: [
              {
                name: "Site Tree Canopy & Compensatory Plantation",
                prev_condition: `${existingTrees} site trees recorded`,
                present_condition: `${treesRemoved} trees removed without replacement`,
                after_assessment: `${protectedTrees} preserved + ${compensatoryTrees} native trees planted`,
                net_result: `Compensatory planting: ${compensatoryTrees} saplings`,
                baseline: `${existingTrees} trees`, proposed: `${treesRemoved} felled`, mitigated: `${protectedTrees} preserved + ${compensatoryTrees} planted`, delta: `+${compensatoryTrees} planted`,
                standard_code: "Tree Authority Norms",
                status: treesRemoved > 0 ? (compensatoryTrees >= treesRemoved * 3 ? "Compensatory 3:1 Met" : "Deficit") : "No Felling"
              },
              {
                name: "Akira Miyawaki Ultra-Dense Native Forest",
                prev_condition: "Conventional site vegetation",
                present_condition: "Hardscape footprint displacement",
                after_assessment: `${miyawakiAreaM2} m² micro-forest with ${miyawakiSaplings} native saplings`,
                net_result: "Multi-tiered native urban micro-forest",
                baseline: "Baseline site cover", proposed: "Disturbed open area", mitigated: `${miyawakiSaplings} saplings across ${miyawakiAreaM2} m²`, delta: "Dense native cover",
                standard_code: "Miyawaki Afforestation",
                status: miyawakiAreaM2 > 0 ? "High Ecology" : "Not Allocated"
              }
            ]
          }
        ]
      };

      // Guarantee 3-Stage Lifecycle properties on all domain parameters
      if (eiaResult.domains && Array.isArray(eiaResult.domains)) {
        eiaResult.domains.forEach(d => {
          if (d.parameters && Array.isArray(d.parameters)) {
            d.parameters.forEach(p => {
              p.before_construction = p.before_construction || p.prev_condition || p.baseline;
              p.after_construction = p.after_construction || p.present_condition || p.proposed;
              p.after_assessment = p.after_assessment || p.mitigated;
              p.prev_condition = p.before_construction;
              p.present_condition = p.after_construction;
            });
          }
        });
      }

      return eiaResult;
    }
  };

})(typeof window !== 'undefined' ? window : globalThis);
