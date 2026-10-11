/**
 * EcoBuild Smart - Engineering Project File Manager & Export Suite
 * Features:
 * 1. One-Click CAD DXF Exporter (AutoCAD / Revit compatible architectural layers)
 * 2. Master Bill of Quantities (BoQ) CSV Exporter (CPWD Standard Schedule of Rates)
 * 3. GeoJSON & KML Cadastral Land Parcel Boundary Parser
 * 4. Standalone Portable Project Package (.ecobuild JSON file) Importer & Exporter
 * 5. Milestone Revision Snapshots (Undo / Redo / Design Iteration Manager)
 */

window.ProjectFileManager = {
  
  /**
   * 1. Generates Standard ASCII DXF (AutoCAD Release 12 / 2000 compatible)
   */
  exportDxf(project = null) {
    const proj = project || window.App?.currentProject || {};
    const site = proj.site || {};
    const plotArea = Math.max(100, Number(site.plot_area) || 5000);
    const builtUp = Math.max(50, Number(site.built_up_area) || Math.round(plotArea * 0.44));
    const floors = Math.max(1, parseInt(site.floors, 10) || 2);

    const siteScale = Math.sqrt(plotArea / 5000);
    const groundW = Math.max(24, Math.min(68, 32 * siteScale));
    const groundD = Math.max(18, Math.min(50, 24 * siteScale));

    const bldgScale = Math.sqrt(builtUp / 2200);
    const bldgW = Math.max(8, Math.min(groundW * 0.68, 14 * bldgScale));
    const bldgD = Math.max(6, Math.min(groundD * 0.56, 8 * bldgScale));
    const bldgZ = -groundD * 0.15;

    let dxf = "0\nSECTION\n2\nHEADER\n0\nENDSEC\n";
    dxf += "0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n";
    
    // Layers definition
    const layers = [
      { name: "0_BOUNDARY", color: 3 },       // Green
      { name: "1_BUILDING", color: 7 },       // White/Black
      { name: "2_PERMEABLE_PAVERS", color: 2 },// Yellow
      { name: "3_GREEN_ROOF", color: 3 },     // Green
      { name: "4_SOLAR_PV", color: 5 },       // Blue
      { name: "5_BIOSWALE", color: 4 },       // Cyan
      { name: "6_RWH_CISTERN", color: 5 },    // Blue
      { name: "7_TREES", color: 3 }           // Green
    ];

    layers.forEach(l => {
      dxf += `0\nLAYER\n2\n${l.name}\n70\n0\n62\n${l.color}\n6\nCONTINUOUS\n`;
    });
    dxf += "0\nENDTAB\n0\nENDSEC\n";

    // Entities Section
    dxf += "0\nSECTION\n2\nENTITIES\n";

    // Helper to add closed polyline
    const addPolyline = (layer, pts) => {
      let ent = `0\nPOLYLINE\n8\n${layer}\n66\n1\n70\n1\n`;
      pts.forEach(p => {
        ent += `0\nVERTEX\n8\n${layer}\n10\n${p[0].toFixed(2)}\n20\n${p[1].toFixed(2)}\n30\n0.0\n`;
      });
      ent += `0\nSEQEND\n`;
      return ent;
    };

    // Helper to add text
    const addText = (layer, x, y, str, h = 1.0) => {
      return `0\nTEXT\n8\n${layer}\n10\n${x.toFixed(2)}\n20\n${y.toFixed(2)}\n30\n0.0\n40\n${h.toFixed(2)}\n1\n${str}\n`;
    };

    // 1. Boundary Polyline
    const bHalfW = groundW / 2;
    const bHalfD = groundD / 2;
    dxf += addPolyline("0_BOUNDARY", [
      [-bHalfW, -bHalfD],
      [bHalfW, -bHalfD],
      [bHalfW, bHalfD],
      [-bHalfW, bHalfD]
    ]);
    dxf += addText("0_BOUNDARY", -bHalfW + 1, -bHalfD + 1, `CADASTRAL PROPERTY BOUNDARY: ${plotArea} SQ.M`, 0.8);

    // 2. Building Footprint
    const bldgLeft = -bldgW / 2;
    const bldgRight = bldgW / 2;
    const bldgTop = bldgZ - (bldgD / 2);
    const bldgBottom = bldgZ + (bldgD / 2);
    dxf += addPolyline("1_BUILDING", [
      [bldgLeft, bldgTop],
      [bldgRight, bldgTop],
      [bldgRight, bldgBottom],
      [bldgLeft, bldgBottom]
    ]);
    dxf += addText("1_BUILDING", bldgLeft + 0.5, bldgTop + 1, `MAIN FACILITY FOOTPRINT: ${builtUp} SQ.M (${floors} FLOORS)`, 0.7);

    // 3. Permeable Paver Area
    const paverW = Math.min(groundW * 0.85, Math.max(bldgW + 4, bldgW * 1.3));
    const paverD = groundD * 0.35;
    const paverTop = bldgBottom + 0.8;
    const paverBottom = paverTop + paverD;
    dxf += addPolyline("2_PERMEABLE_PAVERS", [
      [-paverW / 2, paverTop],
      [paverW / 2, paverTop],
      [paverW / 2, paverBottom],
      [-paverW / 2, paverBottom]
    ]);
    dxf += addText("2_PERMEABLE_PAVERS", -paverW / 2 + 1, paverTop + 1, "IRC:SP:63 PERMEABLE INTERLOCKING PAVERS (C=0.20)", 0.6);

    // 4. Bioswale
    const bioTop = paverBottom + 0.5;
    const bioBottom = bioTop + 2.0;
    dxf += addPolyline("5_BIOSWALE", [
      [-paverW / 2, bioTop],
      [paverW / 2, bioTop],
      [paverW / 2, bioBottom],
      [-paverW / 2, bioBottom]
    ]);
    dxf += addText("5_BIOSWALE", -paverW / 2 + 1, bioTop + 0.8, "ENGINEERED BIORETENTION BIOSWALE BASIN (C=0.15)", 0.5);

    // End Entities & File
    dxf += "0\nENDSEC\n0\nEOF\n";

    // Download trigger
    this._downloadFile(dxf, `EcoBuild_${(proj.name || 'Masterplan').replace(/\s+/g, '_')}_Cadastre.dxf`, "application/dxf");
  },

  /**
   * 2. Exports Master Bill of Quantities (BoQ) with CPWD Schedules as CSV
   */
  exportBoqCsv(project = null, calculations = null) {
    const proj = project || window.App?.currentProject || {};
    const calc = calculations || window.App?.calculations || {};
    const iv = proj.interventions || {};
    const site = proj.site || {};
    const builtUp = site.built_up_area || 2200;
    const roof = site.roof_area || builtUp;

    const solarM2 = iv.solar_pv_area_m2 || Math.round(roof * 0.38);
    const solarKwp = Math.round(solarM2 / 5.5);
    const greenRoofM2 = iv.green_roof_m2 || Math.round(roof * 0.32);
    const permM2 = iv.permeable_pavement_m2 || 1200;
    const bioM2 = iv.rain_garden_m2 || 280;
    const cisternL = iv.rwh_tank_capacity_l || 45000;
    const trees = iv.trees_planted || 36;

    const rows = [
      ["ECOBUILD SMART - STATUTORY ENVIRONMENTAL BILL OF QUANTITIES (BoQ)"],
      [`Project Name: ${proj.name || 'Campus Masterplan'}`, `Location: ${proj.location?.city || 'Kolhapur, India'}`],
      [`Date Generated: ${new Date().toLocaleDateString('en-IN')}`, "Statutory Framework: NBC 2016 Part 11 / CPWD DSR 2023"],
      [],
      ["Item No", "Description of Green Infrastructure Work", "CPWD / Statutory Code", "Quantity", "Unit", "Unit Rate (INR)", "Total Capex (INR)", "Capex (Lakhs)", "Annual Opex (INR)"]
    ];

    const items = [
      ["1.0", "Rooftop Monocrystalline Solar PV Array with On-Grid Inverter", "CEA 2021 / MNRE Grid Directives", solarKwp, "kWp", 46000, solarKwp * 46000, 450 * solarKwp],
      ["2.0", "Extensive Sedum Vegetative Green Roof (120mm Engineered Substrate)", "NBC 2016 Part 11 Cl 5.2", greenRoofM2, "m²", 1850, greenRoofM2 * 1850, 65 * greenRoofM2],
      ["3.0", "Porous Interlocking Concrete Block Pavement on 250mm Stone Reservoir", "IRC:SP:63-2018 Cl 6.4", permM2, "m²", 1450, permM2 * 1450, 25 * permM2],
      ["4.0", "Engineered Bioretention Bioswale with Native Wetland Reeds & Filter Media", "MoHUA Urban Drainage Manual 2019", bioM2, "m²", 950, bioM2 * 950, 45 * bioM2],
      ["5.0", "Subsurface Reinforced Modular Rainwater Cistern with Dual Vortex Filter", "NBC 2016 Part 9 Sec 1 Cl 4.4", cisternL, "Litres", 8.5, cisternL * 8.5, cisternL * 0.15],
      ["6.0", "Akira Miyawaki Ultra-Dense Afforestation & Compensatory Living Canopy", "Maharashtra Tree Act 1975", trees, "Saplings", 750, trees * 750, trees * 120]
    ];

    let grandCapex = 0;
    let grandOpex = 0;

    items.forEach(it => {
      const capexInr = it[6];
      const opexInr = it[7];
      grandCapex += capexInr;
      grandOpex += opexInr;
      rows.push([
        it[0],
        `"${it[1]}"`,
        `"${it[2]}"`,
        it[3],
        it[4],
        it[5],
        capexInr,
        (capexInr / 100000).toFixed(2),
        opexInr
      ]);
    });

    rows.push([]);
    rows.push(["TOTAL STATUTORY OUTLAY", "", "", "", "", "", grandCapex, (grandCapex / 100000).toFixed(2), grandOpex]);

    const csvContent = rows.map(r => r.join(",")).join("\n");
    this._downloadFile(csvContent, `EcoBuild_${(proj.name || 'BoQ').replace(/\s+/g, '_')}_MasterBoQ.csv`, "text/csv;charset=utf-8;");
  },

  /**
   * 3. Parses GeoJSON or KML land parcel boundary file
   */
  parseCadastralFile(file, callback) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        let coords = [];
        let plotAreaM2 = 0;

        if (file.name.endsWith(".geojson") || file.name.endsWith(".json")) {
          const geojson = JSON.parse(text);
          const feature = geojson.features ? geojson.features[0] : geojson;
          if (feature.geometry && feature.geometry.coordinates) {
            const rawCoords = feature.geometry.type === "Polygon" 
              ? feature.geometry.coordinates[0] 
              : feature.geometry.coordinates[0][0];
            coords = rawCoords;
            plotAreaM2 = this._calcPolygonArea(rawCoords);
          }
        } else if (file.name.endsWith(".kml")) {
          // Simple KML coordinate parser
          const coordMatch = text.match(/<coordinates>([\s\S]*?)<\/coordinates>/i);
          if (coordMatch) {
            const rawLines = coordMatch[1].trim().split(/\s+/);
            coords = rawLines.map(line => {
              const parts = line.split(",").map(Number);
              return [parts[0], parts[1]];
            });
            plotAreaM2 = this._calcPolygonArea(coords);
          }
        }

        if (plotAreaM2 <= 0) {
          plotAreaM2 = 5000; // Fallback
        }

        callback(null, {
          fileName: file.name,
          plotAreaM2: Math.round(plotAreaM2),
          coordinates: coords,
          centerLat: coords.length > 0 ? coords[0][1] : 16.7050,
          centerLng: coords.length > 0 ? coords[0][0] : 74.2433
        });
      } catch (err) {
        callback(err, null);
      }
    };
    reader.readAsText(file);
  },

  // Planar approximation for parcel polygon area
  _calcPolygonArea(coords) {
    if (!coords || coords.length < 3) return 0;
    let area = 0;
    const n = coords.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += coords[i][0] * coords[j][1];
      area -= coords[j][0] * coords[i][1];
    }
    area = Math.abs(area) / 2;
    // Rough conversion from degrees squared to m² near latitude 16°
    const metersPerDegree = 111320;
    return area * metersPerDegree * metersPerDegree * Math.cos((coords[0][1] * Math.PI) / 180);
  },

  /**
   * 4. Standalone Portable Project Package (.ecobuild file)
   */
  exportEcoBuildFile() {
    const proj = window.App?.currentProject || {};
    const pkg = {
      app: "EcoBuild Smart",
      version: "2.5.0",
      fileType: "ecobuild_project_bundle",
      timestamp: new Date().toISOString(),
      project: proj,
      calculations: window.App?.calculations || {},
      environmentalData: window.App?.environmentalData || {}
    };

    const json = JSON.stringify(pkg, null, 2);
    this._downloadFile(json, `${(proj.name || 'EcoBuild_Project').replace(/\s+/g, '_')}.ecobuild`, "application/json");
  },

  importEcoBuildFile(file, callback) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const pkg = JSON.parse(e.target.result);
        if (!pkg.project) throw new Error("Invalid .ecobuild file format");

        window.App.currentProject = pkg.project;
        if (typeof window.App.recalculate === "function") {
          window.App.recalculate();
        }
        if (typeof window.App.saveToLocalStorage === "function") {
          window.App.saveToLocalStorage();
        }
        callback(null, pkg);
      } catch (err) {
        callback(err, null);
      }
    };
    reader.readAsText(file);
  },

  /**
   * 5. Milestone Revisions & Snapshots
   */
  saveMilestoneSnapshot(label = "Design Revision") {
    const proj = window.App?.currentProject;
    if (!proj) return;

    const list = this.getMilestones();
    const item = {
      id: "rev_" + Date.now(),
      label: label || `Revision ${list.length + 1}`,
      timestamp: new Date().toLocaleTimeString('en-IN') + " (" + new Date().toLocaleDateString('en-IN') + ")",
      project: JSON.parse(JSON.stringify(proj))
    };
    list.unshift(item);
    if (list.length > 10) list.pop(); // Keep top 10

    try {
      localStorage.setItem("ecobuild_milestone_snapshots", JSON.stringify(list));
    } catch(e) {}
    return item;
  },

  getMilestones() {
    try {
      return JSON.parse(localStorage.getItem("ecobuild_milestone_snapshots") || "[]");
    } catch (e) {
      return [];
    }
  },

  loadMilestone(id) {
    const list = this.getMilestones();
    const found = list.find(m => m.id === id);
    if (found && found.project) {
      window.App.currentProject = JSON.parse(JSON.stringify(found.project));
      if (typeof window.App.recalculate === "function") {
        window.App.recalculate();
      }
      return true;
    }
    return false;
  },

  _downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 150);
  }
};
