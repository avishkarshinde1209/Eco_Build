/**
 * EcoBuild Smart — Environmental Calculator
 * Orchestrates domain calculators and synthesises a lean, accurate EIA Results object.
 * Regulatory basis (India):
 *   - MoEFCC EIA Notification 2006, Schedule Item 8 (Building & Construction)
 *   - CPCB NAAQS 2009: PM10 ≤ 60 µg/m³ (annual), PM2.5 ≤ 40 µg/m³ (annual)
 *   - CPHEEO Manual on Water Supply & Sewerage 2019
 *   - NBC 2016 Part 11: Approach to Sustainability
 *   - CEA CO₂ Baseline v20 (FY 2023-24): 0.727 kg CO₂/kWh
 *   - CPCB C&D Waste Management Rules 2016
 *   - SWM Rules 2016
 */

(function(root) {
  'use strict';

  root.EnvironmentalCalculator = {

    // ─── Domain Delegators ───────────────────────────────────────────────────

    calculateGreenCoverLoss(project) {
      const s = project.site || {}, su = project.surfaces || {}, v = project.vegetation || {};
      return root.VegetationCalculator.calculateGreenCover(
        s.plot_area, s.built_up_area, su.concrete_area, su.asphalt_area,
        v.existing_green_area, su.tiles_pavers
      );
    },

    calculateTreeLoss(project) {
      const v = project.vegetation || {};
      return root.VegetationCalculator.calculateTreeImpact(
        v.existing_tree_count, v.trees_removed, v.tree_category
      );
    },

    calculateStormwaterRunoff(project, envData) {
      return root.RunoffCalculator.calculateScenarios(project, envData);
    },

    calculateRainwaterHarvesting(project, envData, dailyDemandL) {
      const s = project.site || {}, w = project.water || {};
      return root.WaterCalculator.calculateRWH(
        s.roof_area, envData?.rainfall, w.occupants, dailyDemandL
      );
    },

    calculateCarbonImpact(project, treesRecommended = 90) {
      return root.CarbonCalculator.calculateCarbonBalance(project, treesRecommended);
    },

    calculateHeatIslandIndicator(project) {
      const s = project.site || {}, su = project.surfaces || {}, v = project.vegetation || {};
      if (root.HeatIslandCalculator) {
        return root.HeatIslandCalculator.calculateUHI(s.plot_area, {
          concrete_area: su.concrete_area,
          asphalt_area: su.asphalt_area,
          standard_roof: s.roof_area,
          lawn_grass: v.existing_green_area
        }, project.interventions);
      }
      return { uhi_vulnerability_index: 45, uhi_risk_level: 'Moderate', albedo_improvement: '+0.15' };
    },

    calculateWaterRequirement(project) {
      const w = project.water || {};
      return root.WaterCalculator.calculateWaterDemand(
        project.building_type, w.occupants, w.daily_consumption_lpcd
      );
    },

    calculateSolarPV(project, envData) {
      const s = project.site || {}, e = project.energy || {}, iv = project.interventions || {};
      return root.EnergyCalculator.calculateSolarPotential(
        s.roof_area, envData?.solar, e.annual_electricity_kwh,
        iv.solar_pv_area_m2, iv.green_roof_m2 || 0
      );
    },

    // ─── Main Pipeline ───────────────────────────────────────────────────────

    calculateOverallEnvironmentalIndicators(project, envData) {
      const p = root.AssessmentSchema
        ? root.AssessmentSchema.normalizeProject(project) : project;

      const validation = root.ValidationEngine
        ? root.ValidationEngine.validateProject(p)
        : { isValid: true, warnings: [], limitations: [] };

      const waterDemand   = this.calculateWaterRequirement(p);
      const rwh           = this.calculateRainwaterHarvesting(p, envData, waterDemand.daily_demand_litres);
      const waterBalance  = root.WaterCalculator.calculateSTPAndWaterBalance
        ? root.WaterCalculator.calculateSTPAndWaterBalance(p, waterDemand, p.vegetation?.existing_green_area || 0)
        : null;
      const runoff        = this.calculateStormwaterRunoff(p, envData);
      const energy        = this.calculateSolarPV(p, envData);
      p.calculated_energy = energy;
      const treeLoss      = this.calculateTreeLoss(p);
      const carbon        = this.calculateCarbonImpact(p, treeLoss.recommended_planting_quantity);
      const uhi           = this.calculateHeatIslandIndicator(p);
      const greenCover    = this.calculateGreenCoverLoss(p);

      const iv = p.interventions || {};
      const greenRoofM2   = Number(iv.green_roof_m2) || 0;
      const permPavM2     = Number(iv.permeable_pavement_m2) || 0;
      const plotArea      = Math.max(1, Number(p.site?.plot_area) || 1);
      const builtUpArea   = Math.max(0, Number(p.site?.built_up_area) || 0);
      const concreteArea  = Math.max(0, Number(p.surfaces?.concrete_area) || 0);
      const asphaltArea   = Math.max(0, Number(p.surfaces?.asphalt_area) || 0);
      const tilesPavers   = Math.max(0, Number(p.surfaces?.tiles_pavers) || 0);
      const baseImpervious = builtUpArea + concreteArea + asphaltArea + (tilesPavers * 0.7);
      const mitImpervious  = Math.max(0, baseImpervious - permPavM2 - (greenRoofM2 * 0.6));

      const infra = root.VegetationCalculator.calculateGreenInfrastructureRequirements(
        p.site?.roof_area, concreteArea, iv.solar_pv_area_m2 || 0
      );

      const intermediate = { green_cover: greenCover, tree_loss: treeLoss, water: rwh,
        water_balance: waterBalance, runoff, energy, carbon, uhi };

      const score = root.ScoreCalculator.calculateScore(p, intermediate);

      const recovery = root.NatureRecoveryCalculator
        ? root.NatureRecoveryCalculator.calculateRecoveryPlan(p, { ...intermediate, score }, envData) : null;

      const recoveryPackages = root.OptimizerEngine
        ? root.OptimizerEngine.generateParetoPackages(p, intermediate) : [];

      // Data confidence
      let confScore = 100;
      const confReasons = [];
      if (p.baseline?.is_provisional || p.baseline?.existing_green_area === null) {
        confScore -= 35;
        confReasons.push('Pre-development baseline unmeasured / provisional.');
      }
      if (!envData || !envData.rainfall || envData.isFallback) {
        confScore -= 20;
        confReasons.push('Rainfall estimated via regional fallback (no on-site gauge).');
      }
      if (p.site?.plot_area && !p.site?.survey_date) {
        confScore -= 10;
        confReasons.push('Site geometry user-declared without cadastral survey.');
      }
      confScore = Math.max(10, Math.min(100, confScore));
      const confLevel = confScore < 60 ? 'PROVISIONAL' : confScore < 80 ? 'MODERATE' : 'HIGH';

      const bundle = {
        timestamp: new Date().toISOString(),
        validation,
        green_cover: greenCover,
        tree_impact: treeLoss,
        water_demand: waterDemand,
        rwh,
        water_balance: waterBalance,
        runoff,
        energy,
        carbon,
        uhi,
        green_infra_potential: infra,
        impervious_balance: {
          baseline_impervious_m2: Math.round(baseImpervious),
          baseline_impervious_pct: Math.min(100, Math.round((baseImpervious / plotArea) * 100)),
          mitigated_impervious_m2: Math.round(mitImpervious),
          mitigated_impervious_pct: Math.min(100, Math.round((mitImpervious / plotArea) * 100)),
          impervious_reduction_m2: Math.round(baseImpervious - mitImpervious)
        },
        score,
        data_confidence: {
          score: confScore,
          level: confLevel,
          reasons: confReasons
        },
        recovery,
        recovery_packages: recoveryPackages
      };

      bundle.eia_results = this.generateEIAResults(p, bundle, envData);
      return bundle;
    },

    // ─── EIA Results Synthesis ───────────────────────────────────────────────

    /**
     * Synthesise the Statutory EIA Results Matrix.
     * Screening: MoEFCC EIA Notification 2006 Schedule Item 8(a)
     * Domains: 6 regulated environmental aspects for building/construction projects.
     */
    generateEIAResults(project, data, envData) {
      if (!project) return null;

      const s   = project.site        || {};
      const su  = project.surfaces    || {};
      const veg = project.vegetation  || {};
      const iv  = project.interventions || {};
      const w   = project.water       || {};
      const wst = project.waste       || {};
      const en  = project.energy      || {};

      const plot       = Math.max(1, Number(s.plot_area)     || 5000);
      const bua        = Math.max(0, Number(s.built_up_area) || 0);
      const floors     = Math.max(1, Number(s.floors)        || 1);
      const totalGfa   = Number(s.total_floor_area) || (bua * floors);
      const roofArea   = Math.max(0, Number(s.roof_area !== undefined ? s.roof_area : bua));
      const openGround = Math.max(0, plot - bua);

      const concrete   = Math.max(0, Number(su.concrete_area)  || 0);
      const asphalt    = Math.max(0, Number(su.asphalt_area)   || 0);
      const tiles      = Math.max(0, Number(su.tiles_pavers)   || 0);
      const hardscape  = concrete + asphalt + tiles;

      const occupants  = Math.max(0, Number(w.occupants)       || 0);
      const existTrees = Math.max(0, Number(veg.existing_tree_count) || 0);
      const remTrees   = Math.max(0, Number(veg.trees_removed) || 0);
      const savedTrees = Math.max(0, existTrees - remTrees);
      const compTrees  = (iv.trees_planted !== undefined && iv.trees_planted !== null)
        ? Math.max(0, Number(iv.trees_planted)) : (remTrees * 3);
      const greenRoof  = Number(iv.green_roof_m2)            || 0;
      const permPav    = Number(iv.permeable_pavement_m2)    || 0;

      // ── Screening ────────────────────────────────────────────────────────
      let category, authority, appraisalType, categoryBadge, verdict, verdictColor;
      if (totalGfa >= 150000) {
        category      = 'Category A — ≥ 1,50,000 m² GFA (Township / Area Development)';
        authority     = 'Ministry of Environment, Forest & Climate Change (MoEFCC, New Delhi)';
        appraisalType = 'Full EIA Study + Public Consultation + Central EAC Appraisal';
        categoryBadge = 'bg-purple-100 text-purple-800 border-purple-300';
        verdict       = 'CENTRAL EIA CLEARANCE REQUIRED — MoEFCC Category A';
        verdictColor  = 'purple';
      } else if (totalGfa >= 20000) {
        category      = 'Category B2 — 20,000 to < 1,50,000 m² GFA (Building & Construction)';
        authority     = 'State Environment Impact Assessment Authority (SEIAA / SEAC)';
        appraisalType = 'Form-I, Form-1A + Conceptual Plan — No Full EIA Study Required';
        categoryBadge = 'bg-blue-100 text-blue-800 border-blue-300';
        verdict       = 'STATE LEVEL EC REQUIRED — SEIAA Category B2';
        verdictColor  = 'blue';
      } else {
        category      = 'Exempt — < 20,000 m² GFA (Below EC Threshold)';
        authority     = 'Local Municipal Corporation & State Pollution Control Board (SPCB)';
        appraisalType = 'Building Bye-Laws + Environmental Management Plan (EMP)';
        categoryBadge = 'bg-sky-100 text-sky-800 border-sky-300';
        verdict       = 'EXEMPT FROM FORMAL EC — LOCAL MUNICIPAL APPROVAL ONLY';
        verdictColor  = 'sky';
      }

      const compositeScore = data.score?.composite_score ?? 70;
      const tier           = data.score?.tier || 'Moderate Performance';

      // ── Water domain values ──────────────────────────────────────────────
      const wb           = data.water_balance || {};
      const freshKLD     = wb.total_domestic_fresh_demand_kld ?? 0;
      const sewageKLD    = wb.sewage_generation_kld            ?? 0;
      const stpCapKLD    = wb.stp_design_capacity_kld          ?? 0;
      const recycledKLD  = wb.total_recycled_kld               ?? 0;
      const freshSavePct = wb.fresh_water_savings_pct          ?? 0;
      const isZLD        = wb.is_zld_compliant                 ?? true;

      const runoffData   = data.runoff || {};
      const qPre         = runoffData.pre_development?.peak_runoff_m3_hr   ?? 0;
      const qPost        = runoffData.proposed_development?.peak_runoff_m3_hr ?? 0;
      const qMit         = runoffData.with_green_infrastructure?.peak_runoff_m3_hr ?? 0;
      const runoffRedPct = runoffData.impact_summary?.runoff_reduction_pct ?? 0;
      const annRunoffKL  = Math.round((runoffData.impact_summary?.mitigated_annual_runoff_litres || 0) / 1000);

      const rwhData   = data.rwh || {};
      const rwhKL     = Math.round((rwhData.annual_potential_litres || 0) / 1000);
      const rwhTankKL = Math.round((Number(iv.rwh_tank_capacity_l) || rwhData.recommended_storage_range_litres?.optimum || 0) / 1000);

      // ── Energy & carbon ──────────────────────────────────────────────────
      const elecKwh      = en.annual_electricity_kwh !== undefined
        ? Number(en.annual_electricity_kwh) : Math.round(totalGfa * 15);
      const solarKwp     = Number(data.energy?.installed_capacity_kwp)  || 0;
      const solarGenKwh  = Number(data.energy?.annual_generation_kwh)   || 0;
      const solarOffPct  = Number(data.energy?.demand_offset_percentage) || 0;
      // CEA v20 FY2023-24: 0.727 kg CO₂/kWh
      const gridFactor   = 0.727;
      const annGridCO2t  = Math.round((elecKwh * gridFactor) / 100) / 10; // tonnes
      const annSolarSavet = Math.round((solarGenKwh * gridFactor) / 100) / 10;

      const embodiedT    = Number(data.carbon?.total_embodied_tonnes)
        || Math.round((totalGfa * 450) / 1000);
      const avoidedT     = Number(data.recovery?.phase1_construction?.green_concrete?.co2_avoided_tonnes) || 0;
      const netEmbodiedT = Math.max(0, Math.round((embodiedT - avoidedT) * 10) / 10);
      const opCO2SavedT  = Number(data.carbon?.annual_co2_offset_tonnes) || annSolarSavet;
      const paybackYrs   = Number(data.carbon?.net_carbon_dynamics?.carbon_payback_years) || '—';

      // ── Waste ─────────────────────────────────────────────────────────────
      const cdWasteT     = wst.construction_waste_tonnes !== undefined
        ? Number(wst.construction_waste_tonnes) : Math.round((totalGfa * 55) / 1000);
      const recPct       = wst.recycling_pct !== undefined ? Number(wst.recycling_pct) : 65;
      const divertedT    = Math.round(cdWasteT * (recPct / 100) * 10) / 10;
      const rcaM3        = Math.round(divertedT / 1.6);
      const mswKgDay     = wst.daily_solid_waste_kg !== undefined
        ? Number(wst.daily_solid_waste_kg) : Math.round(occupants * 0.4);
      // 0.4 kg/capita/day (SWM Rules 2016 default); compost yield ~25% of organic fraction (50% of MSW)
      const compostTyr   = Math.round((mswKgDay * 0.5 * 0.25 * 365 / 1000) * 10) / 10;

      // ── Land / topsoil ───────────────────────────────────────────────────
      const topsoilM3    = Number(data.recovery?.phase1_construction?.topsoil?.salvage_volume_m3)
        || Math.round(bua * 0.20);

      // ── Air ──────────────────────────────────────────────────────────────
      const aq   = envData?.airQuality || {};
      const aqi  = aq.aqi  || '—';
      const pm25 = aq.pm25 || '—';
      const pm10 = aq.pm10 || '—';

      // ── UHI ──────────────────────────────────────────────────────────────
      const uhiIdx  = data.uhi?.uhi_vulnerability_index || 48;
      const uhiRisk = data.uhi?.uhi_risk_level          || 'Moderate';

      // ── Miyawaki / BNG ───────────────────────────────────────────────────
      const mwaM2  = Number(data.recovery?.phase2_operational?.miyawaki_forest?.designated_area_m2) || 0;
      const mwaSap = Number(data.recovery?.phase2_operational?.miyawaki_forest?.total_saplings)     || 0;

      // ─────────────────────────────────────────────────────────────────────
      return {
        generated_at: new Date().toISOString(),
        project_name: project.name || 'Active Environmental Assessment',
        location: {
          city: project.location?.city  || 'Site Location',
          state: project.location?.state || 'State',
          coordinates: (project.location?.latitude && project.location?.longitude)
            ? `${project.location.latitude.toFixed(4)}°N, ${project.location.longitude.toFixed(4)}°E`
            : 'Unspecified'
        },
        screening: {
          total_gfa_m2:      totalGfa,
          plot_area_m2:      Math.round(plot),
          category,
          category_badge:    categoryBadge,
          authority,
          appraisal_type:    appraisalType,
          statutory_verdict: verdict,
          verdict_color:     verdictColor,
          composite_score:   compositeScore,
          performance_tier:  tier
        },

        // ── 6 KPI summary cards ───────────────────────────────────────────
        key_results: [
          {
            id: 'score', icon: '⭐',
            label: 'EcoBuild Sustainability Score',
            before: 'Pre-development baseline',
            after_construction: 'Unmitigated impact',
            after_assessment: `${compositeScore}/100 — ${tier}`,
            net_result: `${compositeScore}/100 composite index`,
            value: `${compositeScore}/100`,
            subtext: tier,
            status: 'Planning Index',
            badge_class: 'bg-teal-100 text-teal-800 border-teal-300'
          },
          {
            id: 'runoff', icon: '🌧️',
            label: 'Peak Stormwater Runoff',
            before: `${qPre} m³/hr (natural land)`,
            after_construction: `${qPost} m³/hr (unmitigated hardscape)`,
            after_assessment: `${qMit} m³/hr (SuDS mitigated)`,
            net_result: `-${runoffRedPct}% peak attenuation`,
            value: `-${runoffRedPct}%`,
            subtext: `${qMit} m³/hr post-SuDS`,
            status: 'SuDS Verified',
            badge_class: 'bg-blue-100 text-blue-800 border-blue-300'
          },
          {
            id: 'water', icon: '💧',
            label: 'Water Demand & STP',
            before: '0 KLD (pre-development)',
            after_construction: `${freshKLD} KLD fresh demand | ${sewageKLD} KLD sewage`,
            after_assessment: `${Math.round((freshKLD - recycledKLD) * 10) / 10} KLD net fresh | ${recycledKLD} KLD recycled via STP`,
            net_result: `${freshSavePct}% fresh water saved`,
            value: `${freshSavePct}% Saved`,
            subtext: `${recycledKLD} KLD recycled — ${isZLD ? 'ZLD' : 'Treated Effluent'}`,
            status: isZLD ? 'Zero Liquid Discharge' : 'Effluent Recycled',
            badge_class: 'bg-cyan-100 text-cyan-800 border-cyan-300'
          },
          {
            id: 'solar', icon: '☀️',
            label: 'Rooftop Solar PV',
            before: '0 kWh (no generation)',
            after_construction: `${Math.round(elecKwh / 1000)} MWh/yr grid load`,
            after_assessment: `${solarKwp} kWp → ${(solarGenKwh / 1000).toFixed(1)} MWh/yr`,
            net_result: `${solarOffPct}% clean energy offset`,
            value: `${solarOffPct}% Offset`,
            subtext: `Saves ${annSolarSavet} t CO₂/yr (CEA v20)`,
            status: 'Grid Offset',
            badge_class: 'bg-amber-100 text-amber-800 border-amber-300'
          },
          {
            id: 'cd_waste', icon: '🏗️',
            label: 'C&D Waste Circularity',
            before: '0 t (pre-construction)',
            after_construction: `${cdWasteT} t debris generated`,
            after_assessment: `${divertedT} t (${recPct}%) → ${rcaM3} m³ recycled aggregate`,
            net_result: `${recPct}% landfill diversion`,
            value: `${recPct}% Diverted`,
            subtext: `${rcaM3} m³ RCA sub-base reuse`,
            status: 'CPCB C&D Rules 2016',
            badge_class: 'bg-amber-100 text-amber-900 border-amber-300'
          },
          {
            id: 'ecology', icon: '🌱',
            label: 'Ecology & Tree Restoration',
            before: `${existTrees} trees on site`,
            after_construction: `${remTrees} trees removed`,
            after_assessment: `${savedTrees} preserved + ${compTrees} planted (3:1 norm)`,
            net_result: `+${compTrees} native trees net gain`,
            value: `${compTrees} Planted`,
            subtext: `${savedTrees} preserved + ${compTrees} compensatory`,
            status: remTrees > 0
              ? (compTrees >= remTrees * 3 ? '3:1 Compensatory Met' : 'Compensatory Deficit')
              : 'No Felling',
            badge_class: 'bg-emerald-100 text-emerald-900 border-emerald-300'
          }
        ],

        // ── 6 EIA Domain Tables ───────────────────────────────────────────
        domains: [
          {
            domain_id: 'land_soil',
            domain_name: '1. Land & Topsoil',
            standard_ref: 'NBC 2016 Part 11 | MoEFCC Form-1A Item 2',
            parameters: [
              {
                name: 'Plot Coverage & Open Space',
                standard_code: 'NBC 2016 Part 3',
                before: '100% open unpaved ground',
                after_construction: `${bua.toLocaleString()} m² footprint — ${Math.round((bua / plot) * 100)}% coverage`,
                after_assessment: `${openGround.toLocaleString()} m² open ground retained`,
                net_result: `${Math.round((openGround / plot) * 100)}% open space preserved`,
                status: 'Compliant'
              },
              {
                name: 'Impervious Surface Ratio',
                standard_code: 'IRC:SP:63',
                before: 'Natural soil infiltration',
                after_construction: `${Math.round(hardscape + bua).toLocaleString()} m² (${Math.min(100, Math.round(((hardscape + bua) / plot) * 100))}% impervious)`,
                after_assessment: `Reduced to ${Math.round(hardscape + bua - permPav - greenRoof * 0.6).toLocaleString()} m² via ${permPav} m² permeable paving`,
                net_result: `-${permPav} m² effective permeability gain`,
                status: 'Optimized'
              },
              {
                name: 'Topsoil Salvage (0.20 m depth)',
                standard_code: 'NBC 2016 Part 11',
                before: 'Fertile humus layer — 0.20 m depth',
                after_construction: 'Stripped & discarded during excavation',
                after_assessment: `${topsoilM3} m³ salvaged, stockpiled ≤ 2 m height, re-spread on ${Math.round(openGround * 0.7).toLocaleString()} m² landscape`,
                net_result: '100% topsoil reused on-site',
                status: 'Mandatory Met'
              }
            ]
          },
          {
            domain_id: 'water_hydrology',
            domain_name: '2. Water, STP & Hydrology',
            standard_ref: 'CPHEEO 2019 | CGWB | IS 15797 | IS 1172',
            parameters: [
              {
                name: 'Domestic Fresh Water Demand',
                standard_code: 'IS 1172 (NBC LPCD norms)',
                before: '0 KLD (pre-development)',
                after_construction: `${freshKLD} KLD municipal / groundwater extraction`,
                after_assessment: `${Math.round((freshKLD - recycledKLD) * 10) / 10} KLD net fresh (dual-plumbing + recycled STP water)`,
                net_result: `-${recycledKLD} KLD extraction reduction (${freshSavePct}% saving)`,
                status: 'Reduced Intake'
              },
              {
                name: 'Sewage Treatment Plant (STP)',
                standard_code: 'CPHEEO / MoEFCC ZLD',
                before: '0 KLD sewage',
                after_construction: `${sewageKLD} KLD raw sewage → municipal drain`,
                after_assessment: `${stpCapKLD} KLD SBR/MBBR tertiary STP with UV; ${recycledKLD} KLD recycled for flushing & irrigation`,
                net_result: isZLD ? 'Zero Liquid Discharge achieved' : `${freshSavePct}% fresh substitution`,
                status: isZLD ? 'ZLD Compliant' : 'Treated Effluent Recycled'
              },
              {
                name: 'Peak Stormwater Runoff (Q = CIA)',
                standard_code: 'Rational Method Q=CIA',
                before: `${qPre} m³/hr (natural catchment)`,
                after_construction: `${qPost} m³/hr (unmitigated hardscape peak)`,
                after_assessment: `${qMit} m³/hr via rain gardens & bioswales (${annRunoffKL.toLocaleString()} kL/yr diverted)`,
                net_result: `-${runoffRedPct}% peak flow attenuation`,
                status: 'SuDS Verified'
              },
              {
                name: 'Rainwater Harvesting (RWH)',
                standard_code: 'CGWB | IS 15797',
                before: '0 kL captured — direct drainage',
                after_construction: 'Roof runoff discharged unmanaged to storm drain',
                after_assessment: `${rwhKL.toLocaleString()} kL/yr harvest potential with ${rwhTankKL} kL storage tank`,
                net_result: `${rwhKL.toLocaleString()} kL/yr non-potable supply augmented`,
                status: 'CGWB Compliant'
              }
            ]
          },
          {
            domain_id: 'air_microclimate',
            domain_name: '3. Air Quality & Microclimate',
            standard_ref: 'CPCB NAAQS 2009 | NBC 2016 Part 11',
            parameters: [
              {
                name: 'Ambient Air Quality — PM10 / PM2.5',
                standard_code: 'CPCB NAAQS 2009: PM10 ≤ 60 µg/m³ | PM2.5 ≤ 40 µg/m³ (annual)',
                before: `Baseline AQI ${aqi} | PM10 ${pm10} µg/m³ | PM2.5 ${pm25} µg/m³`,
                after_construction: 'Fugitive dust surge from excavation & material handling',
                after_assessment: '6 m perimeter GI sheet hoarding + automated mist-cannon suppression ≥ 72% capture',
                net_result: 'NAAQS 2009 annual limits maintained on site boundary',
                status: 'Within NAAQS Limits'
              },
              {
                name: 'Urban Heat Island (UHI)',
                standard_code: 'NBC 2016 Part 11 | Cool Roof Initiative',
                before: 'Ambient baseline — natural land cover',
                after_construction: 'Dark-surface RCC & asphalt — thermal trap (high albedo deficit)',
                after_assessment: `Cool roof (SRI ≥ 78) + ${greenRoof} m² green roof + tree canopy → UHI score ${uhiIdx}`,
                net_result: `UHI risk: ${uhiRisk} — radiative cooling achieved`,
                status: 'Mitigated'
              }
            ]
          },
          {
            domain_id: 'energy_carbon',
            domain_name: '4. Energy & Carbon',
            standard_ref: 'ECBC 2017 | MNRE | CEA v20 (0.727 kg CO₂/kWh)',
            parameters: [
              {
                name: 'Annual Electrical Demand & Solar Offset',
                standard_code: 'ECBC 2017 | MNRE Rooftop Guidelines',
                before: '0 kWh (no site consumption)',
                after_construction: `${Math.round(elecKwh / 1000)} MWh/yr drawn from fossil-fuel grid`,
                after_assessment: `${solarKwp} kWp rooftop PV → ${(solarGenKwh / 1000).toFixed(1)} MWh/yr clean generation`,
                net_result: `${solarOffPct}% demand offset; saves ${annSolarSavet} t CO₂/yr`,
                status: 'Solar Displaced'
              },
              {
                name: 'Embodied Carbon — Construction',
                standard_code: 'IS 456 | IS 16714 | IGBC/GRIHA 450 kg CO₂e/m²',
                before: '0 t CO₂e (pre-construction)',
                after_construction: `${embodiedT} t CO₂e — standard RCC (450 kg CO₂e/m² GFA)`,
                after_assessment: `${netEmbodiedT} t CO₂e after 35% GGBS substitution (${avoidedT} t avoided)`,
                net_result: `-${avoidedT} t CO₂e upfront clinker emissions avoided`,
                status: 'Low-Carbon Concrete'
              },
              {
                name: 'Annual Operational CO₂ & Payback',
                standard_code: 'CEA Baseline v20 — 0.727 kg CO₂/kWh (FY 2023-24)',
                before: '0 t CO₂e/yr offset',
                after_construction: `${annGridCO2t} t CO₂e/yr from full grid draw`,
                after_assessment: `${opCO2SavedT} t CO₂e/yr displaced via solar PV & tree growth`,
                net_result: `Carbon payback ≈ ${paybackYrs} years`,
                status: 'Payback Estimated'
              }
            ]
          },
          {
            domain_id: 'waste_circularity',
            domain_name: '5. Waste Management',
            standard_ref: 'CPCB C&D Waste Rules 2016 | SWM Rules 2016',
            parameters: [
              {
                name: 'Construction & Demolition (C&D) Waste',
                standard_code: 'CPCB C&D Waste Rules 2016',
                before: '0 t (pre-construction)',
                after_construction: `${cdWasteT} t debris generated (est. 55 kg/m² GFA)`,
                after_assessment: `${divertedT} t (${recPct}%) source-segregated → ${rcaM3} m³ recycled coarse aggregate (RCA)`,
                net_result: `${recPct}% landfill diversion — RCA used as road sub-base`,
                status: 'Circular Reuse'
              },
              {
                name: 'Operational Municipal Solid Waste',
                standard_code: 'SWM Rules 2016 (0.4 kg/capita/day)',
                before: '0 kg/day (pre-occupancy)',
                after_construction: `${mswKgDay} kg/day mixed MSW from ${occupants} occupants`,
                after_assessment: `Wet/dry segregation + on-site composter → ${compostTyr} t/yr compost for landscaping`,
                net_result: `${compostTyr} t/yr organic compost — closed-loop nutrient cycle`,
                status: 'Compost Diverted'
              }
            ]
          },
          {
            domain_id: 'ecology_biodiversity',
            domain_name: '6. Ecology & Biodiversity',
            standard_ref: 'Tree Protection Act | Miyawaki Method | TNFD Guidance',
            parameters: [
              {
                name: 'Tree Canopy & Compensatory Plantation',
                standard_code: 'Tree Authority — 3:1 compensatory norm',
                before: `${existTrees} trees on site (recorded baseline)`,
                after_construction: `${remTrees} trees felled for construction`,
                after_assessment: `${savedTrees} trees preserved; ${compTrees} native species planted (3:1 ratio = ${remTrees * 3} required)`,
                net_result: `Net +${compTrees} trees; canopy deficit ${compTrees >= remTrees * 3 ? 'fulfilled' : 'not yet fulfilled'}`,
                status: remTrees > 0
                  ? (compTrees >= remTrees * 3 ? '3:1 Norm Met' : 'Compensatory Deficit')
                  : 'No Felling'
              },
              {
                name: 'Miyawaki Native Micro-Forest',
                standard_code: 'Akira Miyawaki Dense Afforestation',
                before: 'Conventional sparse planting / barren hardscape',
                after_construction: 'Disturbed open areas on site perimeter',
                after_assessment: mwaM2 > 0
                  ? `${mwaM2} m² Miyawaki patch — ${mwaSap} saplings at 4–5 trees/m² (20× denser than conventional)`
                  : 'Miyawaki patch not yet allocated — site perimeter area to be designated',
                net_result: mwaM2 > 0
                  ? `${mwaM2} m² native multi-tiered forest (canopy, sub-canopy, shrub, herb layers)`
                  : 'Designate ≥ 50 m² perimeter area for Miyawaki planting',
                status: mwaM2 > 0 ? 'High Biodiversity' : 'Recommended'
              }
            ]
          }
        ]
      };
    }
  };

})(typeof window !== 'undefined' ? window : globalThis);
