/**
 * EcoBuild Smart - Hyper-Realistic Architectural 3D Environmental Visualization
 * Features:
 * - Full 360-degree free orbit rotation with smooth inertia & damping
 * - Pinch & wheel zoom (clamped detail to masterplan)
 * - ACESFilmic photographic tone-mapping & soft contact shadows
 * - Procedural PBR textures (monocrystalline solar cells with busbars, permeable paver joints, concrete grain)
 * - Interior architectural illumination, teak soffits, and dark anodized mullions
 * - Multi-tiered sedum green roof, realistic bioswale with river cobbles & reeds
 * - Dynamic 3D screen-space tracking hotspots that follow the building in 360°
 * - Interactive camera presets (Perspective, Rooftop Solar, Bioswale Landscape)
 *
 * Created by Avishkar Shinde
 */

window.Hero3D = {
  scene: null,
  camera: null,
  renderer: null,
  container: null,
  modelGroup: null,
  controls: null,
  animationFrameId: null,
  isInitialized: false,
  autoRotate: true,
  autoRotateSpeed: 0.75, // Slow, elegant turntable spin

  // Procedural Textures Cache
  textures: {},

  // 3D Hotspot Anchors (World coordinates that project to 2D UI)
  hotspots: [
    { id: "solar", title: "88 kWp Solar Array", pos: new THREE.Vector3(-1.6, 5.4, -1.2), color: "amber" },
    { id: "green_roof", title: "650 m² Green Roof", pos: new THREE.Vector3(1.8, 5.1, -0.6), color: "emerald" },
    { id: "rwh", title: "70,000 L Rain Cistern", pos: new THREE.Vector3(-4.0, 0.4, 2.3), color: "blue" },
    { id: "bioswale", title: "Bioswale Basin", pos: new THREE.Vector3(-2.8, 0.2, 4.8), color: "teal" },
    { id: "permeable", title: "Permeable Pavers", pos: new THREE.Vector3(4.8, 0.2, 3.4), color: "stone" }
  ],

  init(containerId = "hero-3d-canvas-container") {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    if (typeof THREE === "undefined") {
      this.renderFallback();
      return;
    }

    // Clean previous instance
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.renderer && this.renderer.domElement && this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }

    const width = this.container.clientWidth || 720;
    const height = this.container.clientHeight || 520;

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent to blend seamlessly

    // 2. Camera setup (Initial isometric architectural angle)
    this.camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 120);
    this.camera.position.set(16, 12, 19);

    // 3. Renderer with ACES Filmic Tone Mapping (Photorealistic contrast & lighting)
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.18;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.container.appendChild(this.renderer.domElement);
    } catch (e) {
      console.warn("WebGL renderer error:", e);
      this.renderFallback();
      return;
    }

    // 4. Photorealistic Architectural Daylighting
    this.setupLighting();

    // 5. Generate Procedural Textures (Solar cells, pavers, concrete)
    this.generateProceduralTextures();

    // 6. Build the Architectural Site Model
    this.modelGroup = new THREE.Group();
    this.buildArchitecturalModel(this.modelGroup);
    this.scene.add(this.modelGroup);

    // 7. Setup 360-Degree Orbit Controls
    this.setup360OrbitControls();

    // 8. Mount On-Screen Controls HUD
    this.mountControlsHud();

    // 9. Start Render Loop
    this.isInitialized = true;
    this.animate();

    // 10. Resize listener
    window.addEventListener("resize", () => this.onWindowResize());
  },

  setupLighting() {
    // Soft Sky Dome Fill (Ambient skylight bounce)
    const hemiLight = new THREE.HemisphereLight(0xf1f5f9, 0x334155, 0.85);
    hemiLight.position.set(0, 30, 0);
    this.scene.add(hemiLight);

    // Primary Directional Sunlight (Warm architectural sun casting soft shadows)
    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.45);
    sunLight.position.set(22, 26, 16);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 65;
    sunLight.shadow.camera.left = -14;
    sunLight.shadow.camera.right = 14;
    sunLight.shadow.camera.top = 14;
    sunLight.shadow.camera.bottom = -14;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.normalBias = 0.02;
    this.scene.add(sunLight);

    // Secondary Cool Blue Fill Light (Sky radiation on shadow side)
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.45);
    fillLight.position.set(-18, 14, -14);
    this.scene.add(fillLight);

    // Warm Interior Building Glow Light
    const interiorGlow = new THREE.PointLight(0xfef08a, 1.2, 10);
    interiorGlow.position.set(-0.6, 2.0, -0.4);
    this.scene.add(interiorGlow);
  },

  generateProceduralTextures() {
    // 1. Photovoltaic Silicon Cell Texture with Silver Busbars
    const solarCanvas = document.createElement("canvas");
    solarCanvas.width = 512;
    solarCanvas.height = 512;
    const sCtx = solarCanvas.getContext("2d");
    sCtx.fillStyle = "#0c1726";
    sCtx.fillRect(0, 0, 512, 512);

    // Silicon wafer grid lines (thin silver contact lines)
    sCtx.strokeStyle = "#253b59";
    sCtx.lineWidth = 1;
    for (let x = 0; x <= 512; x += 16) {
      sCtx.beginPath();
      sCtx.moveTo(x, 0);
      sCtx.lineTo(x, 512);
      sCtx.stroke();
    }
    // Main busbar conductors
    sCtx.strokeStyle = "#94a3b8";
    sCtx.lineWidth = 2.5;
    [128, 256, 384].forEach(x => {
      sCtx.beginPath();
      sCtx.moveTo(x, 0);
      sCtx.lineTo(x, 512);
      sCtx.stroke();
    });
    // Border bevel
    sCtx.strokeStyle = "#1e293b";
    sCtx.lineWidth = 6;
    sCtx.strokeRect(0, 0, 512, 512);

    const solarTex = new THREE.CanvasTexture(solarCanvas);
    solarTex.wrapS = THREE.RepeatWrapping;
    solarTex.wrapT = THREE.RepeatWrapping;
    this.textures.solar = solarTex;

    // 2. Permeable Porous Paver Texture with Aggregate Joints
    const paverCanvas = document.createElement("canvas");
    paverCanvas.width = 512;
    paverCanvas.height = 512;
    const pCtx = paverCanvas.getContext("2d");
    pCtx.fillStyle = "#a8a29e";
    pCtx.fillRect(0, 0, 512, 512);

    // Stretcher bond interlocking paver grid
    pCtx.strokeStyle = "#44403c";
    pCtx.lineWidth = 4;
    const blockW = 64;
    const blockH = 32;
    for (let y = 0; y < 512; y += blockH) {
      pCtx.beginPath();
      pCtx.moveTo(0, y);
      pCtx.lineTo(512, y);
      pCtx.stroke();
      const offset = (y / blockH) % 2 === 0 ? 0 : blockW / 2;
      for (let x = offset; x < 512; x += blockW) {
        pCtx.beginPath();
        pCtx.moveTo(x, y);
        pCtx.lineTo(x, y + blockH);
        pCtx.stroke();
      }
    }
    const paverTex = new THREE.CanvasTexture(paverCanvas);
    paverTex.wrapS = THREE.RepeatWrapping;
    paverTex.wrapT = THREE.RepeatWrapping;
    paverTex.repeat.set(4, 3);
    this.textures.paver = paverTex;

    // 3. Smooth Architectural Concrete Formwork Texture
    const concCanvas = document.createElement("canvas");
    concCanvas.width = 256;
    concCanvas.height = 256;
    const cCtx = concCanvas.getContext("2d");
    cCtx.fillStyle = "#e7e5e4";
    cCtx.fillRect(0, 0, 256, 256);
    // Subtle tie holes
    cCtx.fillStyle = "#a8a29e";
    [[32, 32], [224, 32], [32, 224], [224, 224]].forEach(([x, y]) => {
      cCtx.beginPath();
      cCtx.arc(x, y, 3, 0, Math.PI * 2);
      cCtx.fill();
    });
    const concTex = new THREE.CanvasTexture(concCanvas);
    this.textures.concrete = concTex;
  },

  buildArchitecturalModel(group) {
    // --- MATERIALS PALETTE ---
    const whitePlaster = new THREE.MeshStandardMaterial({ color: 0xfbfbf9, roughness: 0.55, metalness: 0.05 });
    const concreteMat = new THREE.MeshStandardMaterial({ map: this.textures.concrete, roughness: 0.75, metalness: 0.1 });
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x543c2c, roughness: 0.65, metalness: 0.1 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.85 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      roughness: 0.08,
      metalness: 0.85,
      transparent: true,
      opacity: 0.45
    });
    const lawnMat = new THREE.MeshStandardMaterial({ color: 0x3f6e47, roughness: 0.9, metalness: 0.0 });
    const sedumMat = new THREE.MeshStandardMaterial({ color: 0x365e3b, roughness: 0.9, metalness: 0.05 });
    const paverMat = new THREE.MeshStandardMaterial({ map: this.textures.paver, roughness: 0.85, metalness: 0.1 });
    const solarMat = new THREE.MeshStandardMaterial({ map: this.textures.solar, roughness: 0.25, metalness: 0.75 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.95 });
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.15, metalness: 0.2, transparent: true, opacity: 0.75 });

    // --- 1. SITE TERRAIN BASE (Layered Landscape) ---
    // Soft Ambient Contact Shadow Disc beneath base
    const shadowGeo = new THREE.PlaneGeometry(24, 22);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.15 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.42;
    group.add(shadowMesh);

    // Manicured Grass Site Plate
    const baseGeo = new THREE.BoxGeometry(17.5, 0.4, 15);
    const baseMesh = new THREE.Mesh(baseGeo, lawnMat);
    baseMesh.position.y = -0.2;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // Beveled Granite Curb Retaining Border
    const curbGeo = new THREE.BoxGeometry(17.8, 0.28, 15.3);
    const curbMesh = new THREE.Mesh(curbGeo, stoneMat);
    curbMesh.position.y = -0.32;
    curbMesh.receiveShadow = true;
    group.add(curbMesh);

    // --- 2. MAIN BUILDING: MODERN CONTEMPORARY MASSING ---
    // Ground Floor Plinth & Slab
    const groundSlabGeo = new THREE.BoxGeometry(8.2, 0.25, 6.6);
    const groundSlab = new THREE.Mesh(groundSlabGeo, concreteMat);
    groundSlab.position.set(-0.6, 0.12, -0.4);
    groundSlab.castShadow = true;
    groundSlab.receiveShadow = true;
    group.add(groundSlab);

    // Ground Floor Concrete Core
    const coreGeo = new THREE.BoxGeometry(7.2, 2.1, 5.8);
    const coreMesh = new THREE.Mesh(coreGeo, whitePlaster);
    coreMesh.position.set(-0.6, 1.25, -0.4);
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    group.add(coreMesh);

    // Ground Floor Floor-to-Ceiling Glass Walls with Dark Anodized Mullions
    const glassFront = new THREE.Mesh(new THREE.BoxGeometry(5.4, 1.8, 0.08), glassMat);
    glassFront.position.set(-0.6, 1.15, 2.52);
    group.add(glassFront);

    // Mullion vertical divider fins
    for (let m = -2; m <= 2; m++) {
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.85, 0.12), darkMetalMat);
      mullion.position.set(-0.6 + m * 1.1, 1.15, 2.53);
      group.add(mullion);
    }

    // First Floor Intermediate Slab (Cantilevered with Teak Underside Soffit)
    const midSlab = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.28, 7.2), concreteMat);
    midSlab.position.set(-0.4, 2.44, -0.2);
    midSlab.castShadow = true;
    midSlab.receiveShadow = true;
    group.add(midSlab);

    // Teak soffit paneling under the cantilever
    const soffit = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.04, 7.1), darkWoodMat);
    soffit.position.set(-0.4, 2.28, -0.2);
    group.add(soffit);

    // Upper Floor Volume (Offset Modernist Box)
    const upperFloor = new THREE.Mesh(new THREE.BoxGeometry(6.8, 2.0, 5.2), whitePlaster);
    upperFloor.position.set(-0.2, 3.58, -0.5);
    upperFloor.castShadow = true;
    upperFloor.receiveShadow = true;
    group.add(upperFloor);

    // Upper Floor Balcony Glass
    const upperGlass = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.6, 0.08), glassMat);
    upperGlass.position.set(-0.2, 3.5, 2.12);
    group.add(upperGlass);

    // Vertical Timber Solar Louvers (Brise-soleil shading)
    for (let l = 0; l < 7; l++) {
      const louver = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.8, 0.38), darkWoodMat);
      louver.position.set(-2.2 + l * 0.72, 3.5, 2.3);
      louver.castShadow = true;
      group.add(louver);
    }

    // Rooftop Slab & Parapet
    const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.22, 5.6), concreteMat);
    roofSlab.position.set(-0.2, 4.69, -0.5);
    roofSlab.castShadow = true;
    group.add(roofSlab);

    const parapet = new THREE.Mesh(new THREE.BoxGeometry(7.3, 0.26, 5.7), concreteMat);
    parapet.position.set(-0.2, 4.9, -0.5);
    group.add(parapet);

    // Glass Balustrade on Terrace
    const railing = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.6, 0.05), glassMat);
    railing.position.set(1.4, 5.2, 2.3);
    group.add(railing);

    // --- 3. EXTENSIVE SEDUM GREEN ROOF (Integrated Substrate & Plants) ---
    const greenRoofBed = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 4.8), sedumMat);
    greenRoofBed.position.set(1.3, 4.92, -0.5);
    greenRoofBed.receiveShadow = true;
    group.add(greenRoofBed);

    // Micro-succulent bumps (Sedum plants in 3 natural hues)
    for (let i = 0; i < 28; i++) {
      const rx = (Math.random() - 0.5) * 3.3;
      const rz = (Math.random() - 0.5) * 4.3;
      const rSize = 0.12 + Math.random() * 0.14;
      const pColor = Math.random() > 0.6 ? 0x2e663a : (Math.random() > 0.3 ? 0x487a4d : 0x5c8a58);
      const sMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(rSize, 1), new THREE.MeshStandardMaterial({ color: pColor, roughness: 0.9 }));
      sMesh.scale.set(1.3, 0.45, 1.3);
      sMesh.position.set(1.3 + rx, 5.0, -0.5 + rz);
      group.add(sMesh);
    }

    // --- 4. ROOFTOP SOLAR PV ARRAYS (Realistic Structural Unistrut Racks) ---
    for (let r = 0; r < 2; r++) {
      const zOffset = -1.9 + r * 1.7;
      for (let c = 0; c < 3; c++) {
        const xOffset = -2.7 + c * 1.15;

        // Structural Aluminum Racking Legs
        const legFront = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.25, 4), darkMetalMat);
        legFront.position.set(xOffset, 5.02, zOffset + 0.35);
        group.add(legFront);

        const legRear = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 4), darkMetalMat);
        legRear.position.set(xOffset, 5.2, zOffset - 0.35);
        group.add(legRear);

        // Angled Photovoltaic Panel
        const panel = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.035, 1.25), solarMat);
        panel.rotation.x = -0.42; // ~24° solar tilt angle
        panel.position.set(xOffset, 5.25, zOffset);
        panel.castShadow = true;
        group.add(panel);
      }
    }

    // --- 5. RAINWATER HARVESTING DOWNSPOUT & ILLUMINATED CISTERN ---
    // Galvanized downspout pipe running down the facade
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.9, 8), darkMetalMat);
    pipe.position.set(-3.7, 2.45, 2.3);
    group.add(pipe);

    // Subsurface Rainwater Sump / Cistern Cutaway
    const cisternBox = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.35, 1.8), concreteMat);
    cisternBox.position.set(-4.0, 0.1, 2.3);
    group.add(cisternBox);

    // Glowing Blue Water Level Indicator Inside Hatch
    const waterGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.08, 16), waterMat);
    waterGlow.position.set(-4.0, 0.25, 2.3);
    group.add(waterGlow);

    const hatchRing = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 8, 24), darkMetalMat);
    hatchRing.rotation.x = Math.PI / 2;
    hatchRing.position.set(-4.0, 0.28, 2.3);
    group.add(hatchRing);

    // --- 6. PERMEABLE POROUS PAVEMENT PARKING BAYS ---
    const permPaving = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.04, 4.2), paverMat);
    permPaving.position.set(5.0, 0.02, 3.4);
    permPaving.receiveShadow = true;
    group.add(permPaving);

    // Striped white parking dividers
    for (let p = 0; p < 4; p++) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 3.8), new THREE.MeshBasicMaterial({ color: 0xf8fafc }));
      line.position.set(3.4 + p * 1.05, 0.03, 3.4);
      group.add(line);
    }

    // Smooth Walking Path
    const walkway = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.03, 1.1), concreteMat);
    walkway.position.set(1.4, 0.02, 2.5);
    walkway.receiveShadow = true;
    group.add(walkway);

    // --- 7. ENGINEERED SPONGE CITY BIORETENTION BIOSWALE ---
    const bioswaleBed = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.12, 1.5), new THREE.MeshStandardMaterial({ color: 0x3d3023, roughness: 0.95 }));
    bioswaleBed.position.set(-2.8, -0.05, 4.8);
    group.add(bioswaleBed);

    // Water filtration pool
    const swaleWater = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.04, 0.9), waterMat);
    swaleWater.position.set(-2.8, 0.01, 4.8);
    group.add(swaleWater);

    // River Cobbles along swale margins
    for (let s = 0; s < 22; s++) {
      const rStone = 0.12 + Math.random() * 0.1;
      const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(rStone, 0), stoneMat);
      stone.position.set(-5.8 + s * 0.28 + (Math.random() - 0.5) * 0.15, 0.05, 4.2 + (Math.random() - 0.5) * 0.25);
      stone.rotation.set(Math.random(), Math.random(), Math.random());
      stone.castShadow = true;
      group.add(stone);
    }

    // Wetland Reeds & Marsh Plants
    for (let r = 0; r < 30; r++) {
      const reed = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.7 + Math.random() * 0.4, 4), new THREE.MeshStandardMaterial({ color: 0x2b5433, roughness: 0.85 }));
      reed.position.set(-5.6 + Math.random() * 5.6, 0.3, 4.8 + (Math.random() - 0.5) * 0.7);
      reed.rotation.z = (Math.random() - 0.5) * 0.25;
      group.add(reed);
    }

    // --- 8. INDIGENOUS TREES (Varied Realistic Species) ---
    // Tree 1: Large Mature Canopy Shade Tree (Neem Style)
    this.createOrganicTree(group, -6.0, -3.6, 1.35, 0x255931, 0x423122);
    // Tree 2: Flowering Sub-Canopy Tree (Amaltas / Gulmohar)
    this.createOrganicTree(group, -6.2, 0.6, 1.1, 0x2e6b3b, 0x4c392c);
    // Tree 3: Dense Evergreen Tree
    this.createOrganicTree(group, 6.0, -3.8, 1.25, 0x285931, 0x3d2d20);
    // Tree 4: Slender Shade Tree near parking
    this.createOrganicTree(group, 6.4, 0.4, 0.95, 0x387d46, 0x483626);
    // Tree 5: Entryway Ornamental Tree
    this.createOrganicTree(group, 2.6, 4.6, 0.85, 0x3d854d, 0x503e2e);

    // --- 9. SITE SCALE ENTOURAGE (Modernist landscape details) ---
    // Landscape LED Light Bollards
    [[-1.0, 3.2], [1.0, 3.2], [3.0, 3.2], [5.0, 1.2]].forEach(([bx, bz]) => {
      const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8), darkMetalMat);
      bollard.position.set(bx, 0.3, bz);
      group.add(bollard);
      const glowCap = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.08, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      glowCap.position.set(bx, 0.56, bz);
      group.add(glowCap);
    });

    // Teak Timber Site Bench
    const benchSeat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.35), darkWoodMat);
    benchSeat.position.set(0.2, 0.38, 3.4);
    benchSeat.castShadow = true;
    group.add(benchSeat);
    const benchLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.32), darkMetalMat);
    benchLeg1.position.set(-0.35, 0.18, 3.4);
    group.add(benchLeg1);
    const benchLeg2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.32), darkMetalMat);
    benchLeg2.position.set(0.35, 0.18, 3.4);
    group.add(benchLeg2);
  },

  createOrganicTree(group, x, z, scale = 1.0, foliageColor = 0x2e6b3b, trunkColor = 0x483626) {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);

    // Trunk
    const trunkMat = new THREE.MeshStandardMaterial({ color: trunkColor, roughness: 0.95 });
    const trunkGeo = new THREE.CylinderGeometry(0.12 * scale, 0.22 * scale, 1.7 * scale, 8);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.85 * scale;
    trunk.castShadow = true;
    tree.add(trunk);

    // Multi-Layer Layered Foliage (Prevents spherical cartoon appearance)
    const foliageMat = new THREE.MeshStandardMaterial({ color: foliageColor, roughness: 0.9, flatShading: true });
    
    // Bottom canopy dome
    const f1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.15 * scale, 1), foliageMat);
    f1.position.set(0, 2.0 * scale, 0);
    f1.scale.set(1.25, 0.85, 1.15);
    f1.castShadow = true;
    f1.receiveShadow = true;
    tree.add(f1);

    // Offset middle crown
    const f2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85 * scale, 1), foliageMat);
    f2.position.set(0.15 * scale, 2.65 * scale, 0.1 * scale);
    f2.castShadow = true;
    tree.add(f2);

    // Top crown
    const f3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6 * scale, 1), foliageMat);
    f3.position.set(-0.1 * scale, 3.15 * scale, -0.08 * scale);
    f3.castShadow = true;
    tree.add(f3);

    group.add(tree);
  },

  // -------------------------------------------------------------
  // 360-DEGREE ORBIT CONTROLLER (Full Mouse / Touch 360° Drag & Zoom)
  // -------------------------------------------------------------
  setup360OrbitControls() {
    // If THREE.OrbitControls is available via CDN
    if (typeof THREE.OrbitControls !== "undefined") {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.enableZoom = true;
      this.controls.minDistance = 9;
      this.controls.maxDistance = 42;
      this.controls.minPolarAngle = Math.PI * 0.08; // Allow ground-level perspective (~14°)
      this.controls.maxPolarAngle = Math.PI * 0.46; // Clamped just above ground so won't go upside down
      this.controls.target.set(0, 1.6, 0);
      this.controls.autoRotate = this.autoRotate;
      this.controls.autoRotateSpeed = this.autoRotateSpeed;

      // Pause auto-spin on user touch/drag
      this.controls.addEventListener("start", () => {
        this.controls.autoRotate = false;
      });
      return;
    }

    // BUILT-IN 360° SPHERICAL CONTROLLER FALLBACK (Zero Dependencies)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let theta = 0.85; // Horizontal azimuth angle (unlimited 360°)
    let phi = 0.58;   // Vertical elevation angle
    let radius = 28;  // Distance
    const target = new THREE.Vector3(0, 1.6, 0);

    const updateCameraPos = () => {
      this.camera.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
      this.camera.position.y = target.y + radius * Math.cos(phi);
      this.camera.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
      this.camera.lookAt(target);
    };
    updateCameraPos();

    const dom = this.renderer.domElement;
    dom.addEventListener("mousedown", (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      this.autoRotate = false;
    });

    window.addEventListener("mouseup", () => { isDragging = false; });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      // Full 360 degree horizontal rotation
      theta -= deltaX * 0.007;
      // Vertical tilt clamped
      phi = Math.max(0.18, Math.min(Math.PI * 0.46, phi - deltaY * 0.006));
      updateCameraPos();
    });

    // Touch Support for Mobile
    dom.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
        this.autoRotate = false;
      }
    }, { passive: true });

    window.addEventListener("touchend", () => { isDragging = false; });

    dom.addEventListener("touchmove", (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;

      theta -= deltaX * 0.008;
      phi = Math.max(0.18, Math.min(Math.PI * 0.46, phi - deltaY * 0.007));
      updateCameraPos();
    }, { passive: true });

    // Wheel Zoom
    dom.addEventListener("wheel", (e) => {
      e.preventDefault();
      radius = Math.max(9, Math.min(42, radius + e.deltaY * 0.03));
      updateCameraPos();
    }, { passive: false });

    // Expose fallback updater to animation loop
    this.fallbackController = {
      update: () => {
        if (this.autoRotate && !isDragging) {
          theta += 0.0035;
          updateCameraPos();
        }
      },
      setAngles: (newTheta, newPhi, newRadius) => {
        theta = newTheta;
        phi = newPhi;
        if (newRadius) radius = newRadius;
        updateCameraPos();
      }
    };
  },

  // Camera Presets
  setCameraPreset(presetName) {
    if (this.controls) {
      this.controls.autoRotate = false;
      if (presetName === "rooftop") {
        this.camera.position.set(2, 22, 9);
        this.controls.target.set(0, 4.5, 0);
      } else if (presetName === "bioswale") {
        this.camera.position.set(-6, 3, 14);
        this.controls.target.set(-2, 0.5, 4.5);
      } else if (presetName === "facade") {
        this.camera.position.set(0, 4, 18);
        this.controls.target.set(0, 2, 0);
      } else { // default isometric
        this.camera.position.set(16, 12, 19);
        this.controls.target.set(0, 1.6, 0);
      }
      this.controls.update();
      return;
    }

    if (this.fallbackController) {
      if (presetName === "rooftop") {
        this.fallbackController.setAngles(0.3, 0.25, 20);
      } else if (presetName === "bioswale") {
        this.fallbackController.setAngles(0.05, 0.85, 16);
      } else if (presetName === "facade") {
        this.fallbackController.setAngles(0.0, 0.65, 18);
      } else {
        this.fallbackController.setAngles(0.85, 0.58, 28);
      }
    }
  },

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
    if (this.controls) {
      this.controls.autoRotate = this.autoRotate;
    }
    const btn = document.getElementById("hud-btn-autorotate");
    if (btn) {
      btn.innerText = this.autoRotate ? "Auto-Spin: ON" : "Auto-Spin: OFF";
      btn.className = this.autoRotate
        ? "px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-800 text-white shadow-sm transition"
        : "px-2.5 py-1 rounded-md text-[10px] font-bold bg-stone-800/80 text-stone-300 hover:text-white transition";
    }
  },

  // On-Screen Control HUD (View presets, 360° indicator, and spin toggle)
  mountControlsHud() {
    let hud = document.getElementById("hero-3d-hud");
    if (!hud && this.container) {
      hud = document.createElement("div");
      hud.id = "hero-3d-hud";
      hud.className = "absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-auto z-20";
      hud.innerHTML = `
        <div class="flex items-center gap-1.5 bg-stone-900/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-stone-700/80 text-[10px] font-mono text-stone-200 shadow-sm">
          <span class="text-emerald-400 font-bold">🔄 360° Free Orbit:</span>
          <span class="hidden sm:inline text-stone-400">Drag to spin • Scroll to zoom</span>
        </div>

        <div class="flex items-center gap-1 bg-stone-900/85 backdrop-blur-md p-1 rounded-lg border border-stone-700/80 shadow-sm text-xs">
          <button onclick="window.Hero3D.setCameraPreset('iso')" class="px-2 py-0.8 rounded text-[10px] font-semibold text-stone-200 hover:bg-stone-800 transition">
            Perspective
          </button>
          <button onclick="window.Hero3D.setCameraPreset('rooftop')" class="px-2 py-0.8 rounded text-[10px] font-semibold text-stone-200 hover:bg-stone-800 transition">
            ☀️ Rooftop
          </button>
          <button onclick="window.Hero3D.setCameraPreset('bioswale')" class="px-2 py-0.8 rounded text-[10px] font-semibold text-stone-200 hover:bg-stone-800 transition">
            🌱 Bioswale
          </button>
          <button id="hud-btn-autorotate" onclick="window.Hero3D.toggleAutoRotate()" class="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-800 text-white shadow-sm transition">
            Auto-Spin: ON
          </button>
        </div>
      `;
      this.container.appendChild(hud);
    }
  },

  // Project 3D Hotspots into 2D Screen Space
  update3DHotspots() {
    if (!this.container || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.hotspots.forEach(h => {
      let pin = document.getElementById(`hotspot-pin-${h.id}`);
      if (!pin) {
        pin = document.createElement("div");
        pin.id = `hotspot-pin-${h.id}`;
        pin.className = "absolute z-10 pointer-events-auto cursor-pointer transition-transform duration-75 hover:scale-110";
        pin.innerHTML = `
          <div class="flex items-center gap-1 bg-stone-950/85 backdrop-blur-md px-2 py-1 rounded-full border border-emerald-500/50 shadow-md text-[9px] font-bold text-white">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>${h.title}</span>
          </div>
        `;
        pin.onclick = () => {
          if (window.HomeView && window.HomeView.selectGiFeature) {
            window.HomeView.selectGiFeature(h.id);
            const detailSec = document.getElementById("green-infrastructure");
            if (detailSec) detailSec.scrollIntoView({ behavior: "smooth" });
          }
        };
        this.container.appendChild(pin);
      }

      // Project world coordinate to NDC (-1 to +1)
      const v = h.pos.clone().project(this.camera);
      // Behind camera check
      if (v.z > 1) {
        pin.style.display = "none";
        return;
      }
      pin.style.display = "block";
      const x = (v.x * 0.5 + 0.5) * width;
      const y = (-(v.y * 0.5) + 0.5) * height;
      pin.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    });
  },

  animate() {
    if (!this.renderer || !this.scene || !this.camera) return;
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Update orbit controls
    if (this.controls) {
      this.controls.update();
    } else if (this.fallbackController) {
      this.fallbackController.update();
    }

    // Render scene
    this.renderer.render(this.scene, this.camera);

    // Update 3D tracking pins
    this.update3DHotspots();
  },

  onWindowResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  },

  renderFallback() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-900/90 rounded-2xl text-slate-200 border border-slate-800 text-center">
        <div class="text-4xl mb-3">🏛️🌿</div>
        <h4 class="font-bold text-sm text-white">3D Architectural Site Visualization</h4>
        <p class="text-xs text-slate-400 max-w-sm mt-1">
          Interactive WebGL preview. Full 360° orbit rotation available on supported hardware.
        </p>
      </div>
    `;
  },

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.controls) this.controls.dispose();
    this.isInitialized = false;
  }
};
