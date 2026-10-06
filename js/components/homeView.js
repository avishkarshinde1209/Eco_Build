/**
 * EcoBuild Smart - World-Class Human-Designed Homepage Component
 * Handcrafted editorial design, realistic architectural visualization,
 * genuine scientific transparency, and condition-responsive interactive demonstration.
 *
 * Created by Avishkar Shinde
 */

window.HomeView = {
  activeProjectComparison: "A",
  activeGiFeature: "green_roof",
  activeLocationCity: "kolhapur",
  activeStoryPhase: 1,

  render() {
    const container = document.getElementById("home-view");
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-0 text-slate-800 bg-[#FBFBF9] font-sans antialiased selection:bg-emerald-800 selection:text-white">

        <!-- ========================================================= -->
        <!-- 1. EDITORIAL HOMEPAGE NAVBAR                             -->
        <!-- ========================================================= -->
        <nav id="home-navbar" class="sticky top-0 z-50 transition-all duration-300 bg-[#FBFBF9]/90 backdrop-blur-md border-b border-stone-200/70 py-3.5 px-4 sm:px-8">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <!-- Brand Logo -->
            <div class="flex items-center gap-3 cursor-pointer group" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
              <div class="w-9 h-9 rounded-lg bg-stone-900 flex items-center justify-center text-emerald-400 shadow-sm transition-transform group-hover:scale-105">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Clean geometric architectural + leaf + cycle mark -->
                  <path d="M4 20V10L12 4L20 10V20H4Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 4C12 4 16 7.5 16 12C16 14.5 14.2 16.5 12 16.5C9.8 16.5 8 14.5 8 12C8 7.5 12 4 12 4Z" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.6"/>
                  <path d="M12 9V15M10 12L14 12" stroke="#10b981" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-extrabold text-base tracking-tight text-stone-900 font-serif">EcoBuild</span>
                  <span class="text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded border border-emerald-300/50">Smart Planner</span>
                </div>
                <p class="text-[10px] text-stone-500 hidden sm:block tracking-tight font-medium">Smart Environmental Planner</p>
              </div>
            </div>

            <!-- Center Navigation Links -->
            <div class="hidden md:flex items-center gap-7 text-xs font-semibold text-stone-600">
              <a href="#hero" class="hover:text-emerald-800 transition-colors">Home</a>
              <a href="#what-is-ecobuild" class="hover:text-emerald-800 transition-colors">What is EcoBuild</a>
              <a href="#why-this-matters" class="hover:text-emerald-800 transition-colors">Why It Matters</a>
              <a href="#how-it-works" class="hover:text-emerald-800 transition-colors">How It Works</a>
              <a href="#condition-intelligence" class="hover:text-emerald-800 transition-colors">Condition Engine</a>
              <a href="#green-infrastructure" class="hover:text-emerald-800 transition-colors">Green Infrastructure</a>
              <a href="#get-the-app" class="hover:text-emerald-800 transition-colors text-emerald-700 flex items-center gap-1">📲 Get App</a>
            </div>

            <!-- Primary Actions -->
            <div class="flex items-center gap-3">
              <button onclick="window.InstallModal && window.InstallModal.show()" class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 hover:text-emerald-900 border border-emerald-300 hover:bg-emerald-50/80 bg-emerald-50/50 transition group">
                <span class="text-sm">📲</span>
                <span>Install App</span>
              </button>
              <button onclick="window.App.switchView('dashboard')" class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:text-stone-900 border border-stone-300 hover:bg-stone-100/60 transition">
                <span>📊 Live Workspace</span>
              </button>
              <button onclick="window.App.switchView('wizard')" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#14281D] hover:bg-[#1E3A2B] text-white shadow-sm transition hover:shadow group">
                <span>Start Assessment</span>
                <span class="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>
          </div>
        </nav>

        <!-- ========================================================= -->
        <!-- 2. HERO SECTION WITH 3D ARCHITECTURAL MODEL              -->
        <!-- ========================================================= -->
        <section id="hero" class="relative pt-12 pb-20 px-4 sm:px-8 border-b border-stone-200/80 overflow-hidden bg-gradient-to-b from-[#FBFBF9] via-[#F6F7F3] to-[#F1F3ED]">
          <!-- Ambient Architectural Coordinate Decals -->
          <div class="absolute top-6 left-8 font-mono text-[10px] text-stone-400 tracking-wider hidden lg:block select-none pointer-events-none">
            LAT 16.7050° N / LON 74.2433° E • REVISED URBAN HYDROLOGY STANDARD
          </div>
          <div class="absolute top-6 right-8 font-mono text-[10px] text-stone-400 tracking-wider hidden lg:block select-none pointer-events-none">
            EVALUATION MODEL v2.5.0 • NBC PART 11 SUSTAINABILITY FRAMEWORK
          </div>

          <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <!-- Left Column: Typography & Intentional Storytelling -->
              <div class="lg:col-span-5 space-y-6">
                <!-- Eyebrow Tag -->
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200/80">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span class="font-semibold">Architectural & Environmental Intelligence</span>
                </div>

                <!-- Main Editorial Headline -->
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.08] font-serif">
                  Plan Better Buildings.<br>
                  <span class="text-emerald-800 font-sans font-extrabold italic">Recover the Environment.</span>
                </h1>

                <!-- Main Tagline Badge -->
                <div>
                  <span class="inline-block text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300 font-mono">
                    Measure. Recover. Optimize. Build Better.
                  </span>
                </div>

                <!-- Supporting Description -->
                <p class="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-xl">
                  Analyze your site's environmental impact, discover practical recovery opportunities, simulate sustainable alternatives and build a recovery plan that fits your land, climate and budget.
                </p>

                <!-- Core Call to Action Buttons -->
                <div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button onclick="window.App.switchView('wizard')" class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-black bg-[#14281D] hover:bg-[#1E3A2B] text-white shadow-md hover:shadow-lg transition-all group tracking-wide">
                    <span>ASSESS MY SITE</span>
                    <span class="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                  <button onclick="window.App.switchView('scenariostudio')" class="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-stone-800 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-300/80 shadow-sm transition">
                    <span>⚖️ OPEN WHAT-IF ECO STUDIO</span>
                  </button>
                </div>

                <!-- Install App Row -->
                <div class="pt-1 flex items-center gap-3 flex-wrap">
                  <button onclick="window.InstallModal && window.InstallModal.show()" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm transition group">
                    <span class="text-sm">📲</span>
                    <div class="text-left">
                      <div class="font-bold text-xs leading-none mb-0.5">Install App</div>
                      <div class="text-[10px] text-emerald-700 font-medium leading-none">PC • Android • iPhone</div>
                    </div>
                  </button>
                  <div class="text-[11px] text-stone-500 font-medium">Works offline · No account needed</div>
                </div>

                <!-- Small Trust Indicator Line -->
                <div class="pt-2 flex items-center gap-3 text-xs text-stone-500 font-medium">
                  <span class="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Data-driven
                  </span>
                  <span>•</span>
                  <span class="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Condition-responsive
                  </span>
                  <span>•</span>
                  <span class="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Sustainability-focused
                  </span>
                </div>
              </div>

              <!-- Right Column: Interactive 3D Architectural Scene -->
              <div class="lg:col-span-7 relative">
                <!-- Outer Architectural Frame -->
                <div class="relative bg-gradient-to-tr from-stone-200/50 via-stone-100/40 to-emerald-50/30 rounded-3xl p-2 sm:p-4 border border-stone-200/90 shadow-xl shadow-stone-300/30">
                  
                  <!-- Top Canvas Telemetry Header -->
                  <div class="flex items-center justify-between px-3 py-2 text-xs text-stone-500 border-b border-stone-200/70 mb-2">
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span class="font-mono text-[11px] font-semibold text-stone-700">3D SITE MODEL • PROPORTIONAL SCALE</span>
                    </div>
                    <span class="text-[10px] text-stone-400 font-medium">Click hotspots or drag to inspect</span>
                  </div>

                  <!-- 3D Canvas Viewport -->
                  <div id="hero-3d-canvas-container" class="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#f8fafc]/30 to-[#e2e8f0]/40 cursor-grab active:cursor-grabbing">
                    <!-- Three.js mounts here -->
                  </div>

                  <!-- Floating Real-World Telemetry Overlays -->
                  <div class="absolute top-16 left-6 bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-stone-200/90 shadow-sm space-y-0.5 pointer-events-none hidden sm:block">
                    <span class="text-[9px] font-bold uppercase tracking-wider text-stone-400 block">Green Cover</span>
                    <span class="text-base font-extrabold text-emerald-800">42%</span>
                    <span class="text-[9px] text-stone-500 block">Post-Development Ratio</span>
                  </div>

                  <div class="absolute top-16 right-6 bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-stone-200/90 shadow-sm space-y-0.5 pointer-events-none hidden sm:block">
                    <span class="text-[9px] font-bold uppercase tracking-wider text-stone-400 block">Solar Generation</span>
                    <span class="text-base font-extrabold text-amber-700">8.4 kW</span>
                    <span class="text-[9px] text-stone-500 block">Rooftop Photovoltaic</span>
                  </div>

                  <div class="absolute bottom-16 left-6 bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-stone-200/90 shadow-sm space-y-0.5 pointer-events-none hidden sm:block">
                    <span class="text-[9px] font-bold uppercase tracking-wider text-stone-400 block">Rainwater Harvest</span>
                    <span class="text-base font-extrabold text-blue-700">24,500 L/yr</span>
                    <span class="text-[9px] text-stone-500 block">Monsoon Catchment</span>
                  </div>

                  <div class="absolute bottom-16 right-6 bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-stone-200/90 shadow-sm space-y-0.5 pointer-events-none hidden sm:block">
                    <span class="text-[9px] font-bold uppercase tracking-wider text-stone-400 block">Compensatory Trees</span>
                    <span class="text-base font-extrabold text-emerald-800">+18 Net</span>
                    <span class="text-[9px] text-stone-500 block">3:1 Replacement Norm</span>
                  </div>

                  <!-- Explicit Simulation Disclaimer (Rule: Do not fake scientific data) -->
                  <div class="mt-3 px-3 py-1.5 rounded-xl bg-stone-100/90 border border-stone-200 text-center">
                    <p class="text-[11px] text-stone-600 font-medium">
                      <strong class="text-stone-800">Example simulation:</strong> Results change according to user-specified site geometry, location, rainfall, and building characteristics.
                    </p>
                  </div>
                </div>

                <!-- Interactive Hotspot Explanation Modal / Drawer -->
                <div id="hotspot-info-card" class="mt-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-start justify-between gap-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span id="hotspot-badge" class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        🌿 Green Roof Feature
                      </span>
                      <h4 id="hotspot-title" class="text-xs font-bold text-stone-900">Extensive Sedum Vegetative Terrace</h4>
                    </div>
                    <p id="hotspot-desc" class="text-xs text-stone-600 leading-relaxed">
                      Captures 65% of incident rainfall and reduces rooftop ambient temperatures by 2.8°C, lowering air conditioning load and enhancing rooftop solar PV efficiency.
                    </p>
                  </div>
                  <button onclick="window.HomeView.cycleHotspot()" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition shrink-0">
                    Next System ⟳
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 3. FIRST IMPRESSION TRIAD (WHAT • WHY • HOW)              -->
        <!-- ========================================================= -->
        <section class="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div class="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 font-black text-sm flex items-center justify-center font-mono">
                01
              </div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">WHAT</span>
              <h3 class="text-lg font-bold text-stone-900">An Intelligent Environmental Planning System</h3>
              <p class="text-xs text-stone-600 leading-relaxed">
                EcoBuild calculates how building dimensions, impermeable surfaces, and vegetation changes alter local hydrology, carbon balance, and thermal microclimate.
              </p>
            </div>

            <div class="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-3">
              <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 font-black text-sm flex items-center justify-center font-mono">
                02
              </div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">WHY</span>
              <h3 class="text-lg font-bold text-stone-900">Construction Fundamentally Changes Sites</h3>
              <p class="text-xs text-stone-600 leading-relaxed">
                Hardscapes block stormwater infiltration, removed trees reduce natural carbon sequestration, and concrete surfaces trap heat—creating compounding environmental deficits.
              </p>
            </div>

            <div class="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-3">
              <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 font-black text-sm flex items-center justify-center font-mono">
                03
              </div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-blue-800 block">HOW</span>
              <h3 class="text-lg font-bold text-stone-900">Condition-Responsive Green Strategies</h3>
              <p class="text-xs text-stone-600 leading-relaxed">
                By combining user site data with live meteorological feeds, the engine sizes rainwater harvesting, permeable paving, Miyawaki forests, and solar infrastructure.
              </p>
            </div>

          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 3.5 SEVEN CORE ECO-MANAGEMENT DOMAINS                     -->
        <!-- ========================================================= -->
        <section id="core-pillars" class="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-stone-200/80">
          <div class="space-y-8">
            <div class="space-y-2">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">Holistic Platform Modules</span>
              <h2 class="text-2xl sm:text-3xl font-black text-stone-900 font-serif">
                Seven Core Environmental Engineering Domains
              </h2>
              <p class="text-xs sm:text-sm text-stone-600 max-w-2xl">
                EcoBuild Smart bridges environmental science and computer science across seven integrated modules designed for real-world planning.
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 text-xs">
              <!-- Pillar 1 -->
              <div onclick="window.App.switchView('dashboard')" class="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-600 shadow-sm transition cursor-pointer space-y-2">
                <span class="text-xl">📊</span>
                <h4 class="font-bold text-stone-900">Environmental Assessment</h4>
                <p class="text-[11px] text-stone-500">Understand the current site condition, soil sealing, and deficit indices.</p>
              </div>

              <!-- Pillar 2 -->
              <div onclick="window.App.switchView('recovery')" class="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-600 shadow-sm transition cursor-pointer space-y-2">
                <span class="text-xl">🌱</span>
                <h4 class="font-bold text-stone-900">Nature Recovery</h4>
                <p class="text-[11px] text-stone-500">Restore native vegetation, canopy layers, water systems and biodiversity.</p>
              </div>

              <!-- Pillar 3 -->
              <div onclick="window.App.switchView('materials')" class="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-600 shadow-sm transition cursor-pointer space-y-2">
                <span class="text-xl">🧱</span>
                <h4 class="font-bold text-stone-900">Sustainable Construction</h4>
                <p class="text-[11px] text-stone-500">Replace unnecessary harmful hardscapes with circular and porous alternatives.</p>
              </div>

              <!-- Pillar 4 -->
              <div onclick="window.App.switchView('technical')" class="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-600 shadow-sm transition cursor-pointer space-y-2">
                <span class="text-xl">🌦️</span>
                <h4 class="font-bold text-stone-900">Climate Intelligence</h4>
                <p class="text-[11px] text-stone-500">Integrate real IMD rainfall normals, NASA solar models, and CPCB AQI feeds.</p>
              </div>

              <!-- Pillar 5 -->
              <div onclick="window.App.switchView('scenariostudio')" class="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-600 shadow-sm transition cursor-pointer space-y-2">
                <span class="text-xl">⚖️</span>
                <h4 class="font-bold text-stone-900">What-If Eco Studio</h4>
                <p class="text-[11px] text-stone-500">Stress-test design changes and see instantaneous environmental consequences.</p>
              </div>

              <!-- Pillar 6 -->
              <div onclick="window.App.switchView('recovery')" class="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-600 shadow-sm transition cursor-pointer space-y-2">
                <span class="text-xl">💰</span>
                <h4 class="font-bold text-stone-900">Smart Cost Optimization</h4>
                <p class="text-[11px] text-stone-500">Find the optimal multi-objective balance within available site budget.</p>
              </div>

              <!-- Pillar 7 -->
              <div onclick="window.App.switchView('monitoring')" class="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-600 shadow-sm transition cursor-pointer space-y-2">
                <span class="text-xl">📈</span>
                <h4 class="font-bold text-stone-900">Recovery Monitoring</h4>
                <p class="text-[11px] text-stone-500">Track actual post-construction metrics and compare with modeled predictions.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 4. EDITORIAL "WHAT IS ECOBUILD?"                          -->
        <!-- ========================================================= -->
        <section id="what-is-ecobuild" class="py-20 px-4 sm:px-8 border-y border-stone-200/80 bg-white">
          <div class="max-w-7xl mx-auto space-y-16">
            
            <div class="max-w-3xl space-y-4">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">Conceptual Architecture</span>
              <h2 class="text-3xl sm:text-4xl font-black text-stone-900 font-serif tracking-tight">
                A smarter way to plan environmentally responsible buildings.
              </h2>
              <p class="text-sm sm:text-base text-stone-600 leading-relaxed">
                EcoBuild helps users understand how construction and development decisions affect environmental conditions and generates a customized sustainability strategy based on project-specific inputs.
              </p>
            </div>

            <!-- Central Visual with Surrounding 4 Core Stages -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <!-- Stage 1: Analyze -->
              <div class="p-6 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-3 relative group hover:border-emerald-600 transition-colors">
                <span class="text-2xl font-mono text-stone-300 font-bold block group-hover:text-emerald-700 transition-colors">01</span>
                <h4 class="text-base font-bold text-stone-900">Analyze</h4>
                <div class="text-xs text-emerald-800 font-semibold">Understand the project & site</div>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Evaluates plot boundaries, building footprints, soil permeabilities, floor area ratios, and pre-existing canopy cover.
                </p>
              </div>

              <!-- Stage 2: Measure -->
              <div class="p-6 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-3 relative group hover:border-emerald-600 transition-colors">
                <span class="text-2xl font-mono text-stone-300 font-bold block group-hover:text-emerald-700 transition-colors">02</span>
                <h4 class="text-base font-bold text-stone-900">Measure</h4>
                <div class="text-xs text-emerald-800 font-semibold">Evaluate environmental parameters</div>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Computes peak runoff ($Q = CIA$), embodied carbon intensity, rooftop solar yield, and NBC water demand metrics.
                </p>
              </div>

              <!-- Stage 3: Optimize -->
              <div class="p-6 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-3 relative group hover:border-emerald-600 transition-colors">
                <span class="text-2xl font-mono text-stone-300 font-bold block group-hover:text-emerald-700 transition-colors">03</span>
                <h4 class="text-base font-bold text-stone-900">Optimize</h4>
                <div class="text-xs text-emerald-800 font-semibold">Identify areas requiring improvement</div>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Detects excess impermeable surface ratios, stormwater surges, tree loss deficits, and rooftop thermal exposure.
                </p>
              </div>

              <!-- Stage 4: Recommend -->
              <div class="p-6 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-3 relative group hover:border-emerald-600 transition-colors">
                <span class="text-2xl font-mono text-stone-300 font-bold block group-hover:text-emerald-700 transition-colors">04</span>
                <h4 class="text-base font-bold text-stone-900">Recommend</h4>
                <div class="text-xs text-emerald-800 font-semibold">Generate project-specific strategies</div>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Generates quantified interventions: exact RWH storage volumes, Miyawaki sapling counts, bioswales, and permeable paving.
                </p>
              </div>

            </div>

          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 5. WHY THIS MATTERS — VISUAL TRANSITION STORYLINE         -->
        <!-- ========================================================= -->
        <section id="why-this-matters" class="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
          
          <div class="text-center max-w-2xl mx-auto space-y-3">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">The Ecological Reality</span>
            <h2 class="text-3xl sm:text-4xl font-black text-stone-900 font-serif">
              Every building changes its environment.
            </h2>
            <p class="text-xs sm:text-sm text-stone-600">
              Understanding the ecological progression from untouched natural ground to development—and the restorative response.
            </p>
          </div>

          <!-- 3-Phase Interactive Visual Story Card -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            <!-- Phase 1: Natural Site -->
            <div class="bg-white p-6 rounded-2xl border-2 border-emerald-500/40 shadow-sm space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Pre-Development</span>
                <span class="text-xs font-mono font-bold text-stone-400">01</span>
              </div>
              <h3 class="text-lg font-bold text-stone-900">Natural Site</h3>
              <p class="text-xs text-stone-600 leading-relaxed">
                Untouched site with mature indigenous trees, porous topsoil, natural rain infiltration, and baseline carbon balance.
              </p>
              <ul class="text-xs text-stone-700 space-y-2 border-t pt-3">
                <li class="flex items-center gap-2"><span>🌳</span> <strong>Canopy Cover:</strong> High canopy shade</li>
                <li class="flex items-center gap-2"><span>💧</span> <strong>Runoff Coeff (C):</strong> 0.20 (80% absorbed)</li>
                <li class="flex items-center gap-2"><span>🌡️</span> <strong>Surface Heat:</strong> Natural vegetation cooling</li>
              </ul>
            </div>

            <!-- Phase 2: Construction Impact -->
            <div class="bg-white p-6 rounded-2xl border-2 border-amber-500/40 shadow-sm space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">Development Deficit</span>
                <span class="text-xs font-mono font-bold text-stone-400">02</span>
              </div>
              <h3 class="text-lg font-bold text-stone-900">Construction Impact</h3>
              <p class="text-xs text-stone-600 leading-relaxed">
                Footprint excavation, tree removal, dense concrete paving, and topsoil loss produce severe hydrological and carbon deficits.
              </p>
              <ul class="text-xs text-stone-700 space-y-2 border-t pt-3">
                <li class="flex items-center gap-2 text-rose-700"><span>⚠️</span> <strong>Tree Loss:</strong> Canopy stripped</li>
                <li class="flex items-center gap-2 text-rose-700"><span>🌊</span> <strong>Runoff Coeff (C):</strong> 0.85 (+75% surge)</li>
                <li class="flex items-center gap-2 text-rose-700"><span>🏗️</span> <strong>Embodied Carbon:</strong> High cement footprint</li>
              </ul>
            </div>

            <!-- Phase 3: EcoBuild Response -->
            <div class="bg-white p-6 rounded-2xl border-2 border-[#14281D] shadow-md space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase tracking-wider text-white bg-[#14281D] px-2 py-0.5 rounded">Restorative Planning</span>
                <span class="text-xs font-mono font-bold text-emerald-600">03</span>
              </div>
              <h3 class="text-lg font-bold text-stone-900">EcoBuild Response</h3>
              <p class="text-xs text-stone-600 leading-relaxed">
                Engineered green infrastructure, Miyawaki afforestation, permeable parking, rainwater retention, and solar synergy restore ecological equilibrium.
              </p>
              <ul class="text-xs text-stone-700 space-y-2 border-t pt-3">
                <li class="flex items-center gap-2 text-emerald-800"><span>🌱</span> <strong>Compensatory Trees:</strong> 3:1 Replacement</li>
                <li class="flex items-center gap-2 text-emerald-800"><span>💧</span> <strong>Runoff Mitigated:</strong> -45% Peak flow</li>
                <li class="flex items-center gap-2 text-emerald-800"><span>☀️</span> <strong>Solar PV:</strong> Net-zero offset horizon</li>
              </ul>
            </div>

          </div>

          <!-- Transition Pathway Ribbon -->
          <div class="p-4 rounded-xl bg-stone-100 border border-stone-200/80 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-stone-700 text-center">
            <span>Natural Site</span>
            <span class="text-stone-400">→</span>
            <span class="text-amber-800 font-bold">Development Impact</span>
            <span class="text-stone-400">→</span>
            <span class="text-emerald-800 font-bold">Environmental Analysis</span>
            <span class="text-stone-400">→</span>
            <span class="text-emerald-900 font-extrabold">Green Recovery</span>
            <span class="text-stone-400">→</span>
            <span class="bg-[#14281D] text-white px-2.5 py-1 rounded-md">Better Planning</span>
          </div>

        </section>

        <!-- ========================================================= -->
        <!-- 6. HOW ECOBUILD WORKS (CUSTOM WORKFLOW TIMELINE)          -->
        <!-- ========================================================= -->
        <section id="how-it-works" class="py-20 px-4 sm:px-8 border-t border-stone-200/80 bg-white">
          <div class="max-w-7xl mx-auto space-y-16">
            
            <div class="space-y-3">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">Workflow Methodology</span>
              <h2 class="text-3xl sm:text-4xl font-black text-stone-900 font-serif">
                From project data to environmental strategy.
              </h2>
              <p class="text-xs sm:text-sm text-stone-600 max-w-xl">
                A connected six-stage pipeline translating architectural dimensions into verified ecological interventions.
              </p>
            </div>

            <!-- Custom 6-Step Workflow Strip -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
              
              <div class="p-5 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-2">
                <span class="font-mono text-xs font-extrabold text-emerald-800">01</span>
                <h4 class="text-sm font-bold text-stone-900">Project Data Collection</h4>
                <p class="text-[11px] text-stone-600">Site plot area, built-up footprint, floors, location coordinates, tree counts, and surface materials.</p>
              </div>

              <div class="p-5 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-2">
                <span class="font-mono text-xs font-extrabold text-emerald-800">02</span>
                <h4 class="text-sm font-bold text-stone-900">Validation & Processing</h4>
                <p class="text-[11px] text-stone-600">Geometric boundary validation, NBC coverage check, and automated inter-parameter balance verification.</p>
              </div>

              <div class="p-5 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-2">
                <span class="font-mono text-xs font-extrabold text-emerald-800">03</span>
                <h4 class="text-sm font-bold text-stone-900">Parameter Evaluation</h4>
                <p class="text-[11px] text-stone-600">Live API ingestion: Open-Meteo precipitation, solar radiation, AQI, and local climate normals.</p>
              </div>

              <div class="p-5 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-2">
                <span class="font-mono text-xs font-extrabold text-emerald-800">04</span>
                <h4 class="text-sm font-bold text-stone-900">Impact Analysis</h4>
                <p class="text-[11px] text-stone-600">Dynamic calculation of runoff coefficient shifts, carbon deficit, water demand, and UHI index.</p>
              </div>

              <div class="p-5 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-2">
                <span class="font-mono text-xs font-extrabold text-emerald-800">05</span>
                <h4 class="text-sm font-bold text-stone-900">Personalized Green Plan</h4>
                <p class="text-[11px] text-stone-600">Calculated RWH tank capacity, permeable paving area, green roof sizing, and Miyawaki sapling density.</p>
              </div>

              <div class="p-5 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-2">
                <span class="font-mono text-xs font-extrabold text-emerald-800">06</span>
                <h4 class="text-sm font-bold text-stone-900">Planning EIA Report</h4>
                <p class="text-[11px] text-stone-600">Printable academic EIA report with mathematical formulas, before/after comparisons, and sign-off blocks.</p>
              </div>

            </div>

          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 7. CONDITION-RESPONSIVE DEMONSTRATION (MOST CRITICAL)     -->
        <!-- ========================================================= -->
        <section id="condition-intelligence" class="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
          
          <div class="space-y-3">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">Dynamic Calculation Engine</span>
            <h2 class="text-3xl sm:text-4xl font-black text-stone-900 font-serif">
              Your site determines your solution.
            </h2>
            <p class="text-sm sm:text-base text-stone-600 max-w-2xl">
              Change the project conditions. Change the environmental strategy. EcoBuild is not a static formula—it responds directly to architectural constraints and local climate.
            </p>
          </div>

          <!-- Interactive Switcher -->
          <div class="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-8">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
              <div>
                <span class="text-xs text-stone-500 uppercase font-bold tracking-wider">Select Project Scenario to Test Dynamic Adaptation:</span>
              </div>
              <div class="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200">
                <button onclick="window.HomeView.switchComparison('A')" id="btn-scenario-a" class="px-4 py-2 rounded-lg text-xs font-bold transition-all bg-[#14281D] text-white shadow-sm">
                  Project A: Low-Density Educational Campus
                </button>
                <button onclick="window.HomeView.switchComparison('B')" id="btn-scenario-b" class="px-4 py-2 rounded-lg text-xs font-bold transition-all text-stone-600 hover:text-stone-900">
                  Project B: High-Density Commercial Complex
                </button>
              </div>
            </div>

            <!-- Dynamic Comparison Grid -->
            <div id="scenario-details-grid" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <!-- Left: Inputs -->
              <div class="lg:col-span-5 space-y-4">
                <span id="scenario-badge" class="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Scenario A Conditions
                </span>
                <h3 id="scenario-name" class="text-xl font-bold text-stone-900">Kolhapur Engineering Campus</h3>
                <p id="scenario-desc" class="text-xs text-stone-600 leading-relaxed">
                  Large 5,000 m² plot with 2,200 m² built footprint, high existing green area (2,400 m²), and 80 existing trees.
                </p>

                <div class="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <div>
                    <span class="text-stone-400 text-[10px] font-bold block uppercase">Plot Area</span>
                    <span id="sc-plot" class="font-extrabold text-stone-800 text-sm">5,000 m²</span>
                  </div>
                  <div>
                    <span class="text-stone-400 text-[10px] font-bold block uppercase">Built Footprint</span>
                    <span id="sc-built" class="font-extrabold text-stone-800 text-sm">2,200 m²</span>
                  </div>
                  <div>
                    <span class="text-stone-400 text-[10px] font-bold block uppercase">Pre-Dev Green</span>
                    <span id="sc-green" class="font-extrabold text-emerald-700 text-sm">48% (2,400 m²)</span>
                  </div>
                  <div>
                    <span class="text-stone-400 text-[10px] font-bold block uppercase">Annual Rainfall</span>
                    <span id="sc-rain" class="font-extrabold text-blue-700 text-sm">1,043 mm</span>
                  </div>
                </div>
              </div>

              <!-- Right: Adaptively Sized Recommendations -->
              <div class="lg:col-span-7 bg-[#FBFBF9] p-6 rounded-2xl border border-stone-200 space-y-5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-stone-700 uppercase tracking-wider">EcoBuild Dynamically Generated Strategy</span>
                  <span id="sc-score" class="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">Score: 86 / 100</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div class="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                    <span class="text-[10px] font-bold uppercase text-stone-400">Compensatory Planting</span>
                    <div id="sc-trees-rec" class="text-base font-extrabold text-emerald-800">90 Native Trees (3:1)</div>
                    <p id="sc-trees-why" class="text-[11px] text-stone-600">Sufficient open space allows deep-canopy native planting to recover 2,100 m² of canopy within 5 years.</p>
                  </div>

                  <div class="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                    <span class="text-[10px] font-bold uppercase text-stone-400">Rainwater Harvesting Sump</span>
                    <div id="sc-rwh-rec" class="text-base font-extrabold text-blue-800">70,000 L Cistern</div>
                    <p id="sc-rwh-why" class="text-[11px] text-stone-600">Sizes tank for 45-day dry spell based on 1,043 mm monsoon precipitation and 120 occupants.</p>
                  </div>

                  <div class="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                    <span class="text-[10px] font-bold uppercase text-stone-400">Permeable Pavement</span>
                    <div id="sc-perm-rec" class="text-base font-extrabold text-stone-800">1,170 m² Porous Pavers</div>
                    <p id="sc-perm-why" class="text-[11px] text-stone-600">Replaces 45% of proposed concrete parking with porous pavers to restore infiltration.</p>
                  </div>

                  <div class="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                    <span class="text-[10px] font-bold uppercase text-stone-400">Green Roof vs. Solar</span>
                    <div id="sc-roof-rec" class="text-base font-extrabold text-amber-800">770 m² Green / 770 m² Solar</div>
                    <p id="sc-roof-why" class="text-[11px] text-stone-600">Balanced 35/35 roof split provides thermal insulation while generating 128,400 kWh/yr clean solar energy.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 8. GREEN INFRASTRUCTURE INTERACTIVE EXPLORER              -->
        <!-- ========================================================= -->
        <section id="green-infrastructure" class="py-20 px-4 sm:px-8 border-t border-stone-200/80 bg-white">
          <div class="max-w-7xl mx-auto space-y-12">
            
            <div class="max-w-2xl space-y-3">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">Targeted Interventions</span>
              <h2 class="text-3xl sm:text-4xl font-black text-stone-900 font-serif">
                Green Infrastructure System
              </h2>
              <p class="text-xs sm:text-sm text-stone-600">
                Explore the primary physical interventions EcoBuild calculates, why each is recommended, and the exact project conditions that drive their sizing.
              </p>
            </div>

            <!-- Interactive 8-Feature Selector Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              <button onclick="window.HomeView.selectGiFeature('tree')" id="gi-btn-tree" class="p-3 rounded-xl border text-center transition-all bg-[#14281D] text-white border-transparent">
                <span class="text-lg block mb-1">🌳</span>
                <span class="text-[11px] font-bold block leading-tight">Trees</span>
              </button>
              <button onclick="window.HomeView.selectGiFeature('green_roof')" id="gi-btn-green_roof" class="p-3 rounded-xl border text-center transition-all bg-white text-stone-700 border-stone-200 hover:border-emerald-600">
                <span class="text-lg block mb-1">🌿</span>
                <span class="text-[11px] font-bold block leading-tight">Green Roof</span>
              </button>
              <button onclick="window.HomeView.selectGiFeature('rwh')" id="gi-btn-rwh" class="p-3 rounded-xl border text-center transition-all bg-white text-stone-700 border-stone-200 hover:border-emerald-600">
                <span class="text-lg block mb-1">💧</span>
                <span class="text-[11px] font-bold block leading-tight">Rainwater</span>
              </button>
              <button onclick="window.HomeView.selectGiFeature('bioswale')" id="gi-btn-bioswale" class="p-3 rounded-xl border text-center transition-all bg-white text-stone-700 border-stone-200 hover:border-emerald-600">
                <span class="text-lg block mb-1">🌱</span>
                <span class="text-[11px] font-bold block leading-tight">Bioswale</span>
              </button>
              <button onclick="window.HomeView.selectGiFeature('permeable')" id="gi-btn-permeable" class="p-3 rounded-xl border text-center transition-all bg-white text-stone-700 border-stone-200 hover:border-emerald-600">
                <span class="text-lg block mb-1">🟩</span>
                <span class="text-[11px] font-bold block leading-tight">Permeable</span>
              </button>
              <button onclick="window.HomeView.selectGiFeature('solar')" id="gi-btn-solar" class="p-3 rounded-xl border text-center transition-all bg-white text-stone-700 border-stone-200 hover:border-emerald-600">
                <span class="text-lg block mb-1">☀️</span>
                <span class="text-[11px] font-bold block leading-tight">Solar PV</span>
              </button>
              <button onclick="window.HomeView.selectGiFeature('waste')" id="gi-btn-waste" class="p-3 rounded-xl border text-center transition-all bg-white text-stone-700 border-stone-200 hover:border-emerald-600">
                <span class="text-lg block mb-1">♻️</span>
                <span class="text-[11px] font-bold block leading-tight">C&D Waste</span>
              </button>
              <button onclick="window.HomeView.selectGiFeature('water')" id="gi-btn-water" class="p-3 rounded-xl border text-center transition-all bg-white text-stone-700 border-stone-200 hover:border-emerald-600">
                <span class="text-lg block mb-1">🚰</span>
                <span class="text-[11px] font-bold block leading-tight">Water Reuse</span>
              </button>
            </div>

            <!-- Detailed Explanation Display Box -->
            <div id="gi-detail-panel" class="bg-[#FBFBF9] p-6 sm:p-8 rounded-2xl border border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div class="space-y-2">
                <span class="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">What It Does</span>
                <h4 id="gi-title" class="text-base font-bold text-stone-900">Compensatory Native Tree Afforestation</h4>
                <p id="gi-what" class="text-stone-600 leading-relaxed">
                  Plants indigenous multi-tiered canopy species (Neem, Karanj, Arjun) at calibrated replacement ratios to restore lost biomass and evapotranspirative cooling.
                </p>
              </div>

              <div class="space-y-2 border-t md:border-t-0 md:border-l border-stone-200 md:pl-6">
                <span class="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">Why EcoBuild Recommends It</span>
                <p id="gi-why" class="text-stone-600 leading-relaxed">
                  Removing mature trees creates a biological sequestration deficit. Planting 3 to 5 young trees per removed mature tree compensates for lost annual carbon intake (21.8 kg CO₂/tree/yr).
                </p>
              </div>

              <div class="space-y-2 border-t md:border-t-0 md:border-l border-stone-200 md:pl-6">
                <span class="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">Project Condition Driver</span>
                <div id="gi-driver" class="p-3 bg-white rounded-xl border border-stone-200 font-semibold text-stone-800">
                  Driven by: Trees Removed (30) ÷ Total Site Trees (80) = 37.5% Loss Ratio.
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 9. APPLICATION DASHBOARD PREVIEW                         -->
        <!-- ========================================================= -->
        <section class="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
          
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div class="space-y-3">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">Software Interface</span>
              <h2 class="text-3xl sm:text-4xl font-black text-stone-900 font-serif">
                Built as a real, operable workspace.
              </h2>
              <p class="text-xs sm:text-sm text-stone-600 max-w-xl">
                A functional, clean interface designed for engineering precision without gratuitous visual noise.
              </p>
            </div>
            <button onclick="window.App.switchView('dashboard')" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#14281D] hover:bg-[#1E3A2B] text-white shadow transition self-start md:self-auto flex items-center gap-2">
              <span>Launch Live Dashboard</span>
              <span>→</span>
            </button>
          </div>

          <!-- Realistic Software Mockup Card -->
          <div class="bg-white rounded-3xl border border-stone-300 shadow-xl overflow-hidden">
            <!-- Mockup Titlebar -->
            <div class="bg-stone-900 text-stone-300 px-6 py-3 border-b border-stone-800 flex items-center justify-between text-xs font-mono">
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-rose-500/80"></span>
                  <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                </div>
                <span class="text-white font-bold">EcoBuild Assessment Suite • Project: Kolhapur Academic Campus</span>
              </div>
              <span class="hidden sm:inline text-stone-400">STATUS: CALIBRATED (200 OK)</span>
            </div>

            <!-- Workspace Mockup Body -->
            <div class="p-6 sm:p-8 space-y-6 bg-stone-50/50">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div class="bg-white p-4 rounded-xl border border-stone-200 space-y-1">
                  <span class="text-stone-400 text-[10px] font-bold block uppercase">Composite Score</span>
                  <span class="text-2xl font-black text-emerald-800">86 / 100</span>
                  <span class="text-[10px] text-emerald-700 block font-semibold">Tier: Good Performance</span>
                </div>
                <div class="bg-white p-4 rounded-xl border border-stone-200 space-y-1">
                  <span class="text-stone-400 text-[10px] font-bold block uppercase">Runoff Mitigation</span>
                  <span class="text-2xl font-black text-blue-700">-28.7%</span>
                  <span class="text-[10px] text-stone-500 block">Peak Discharge Mitigated</span>
                </div>
                <div class="bg-white p-4 rounded-xl border border-stone-200 space-y-1">
                  <span class="text-stone-400 text-[10px] font-bold block uppercase">Clean Energy</span>
                  <span class="text-2xl font-black text-amber-700">88 kWp</span>
                  <span class="text-[10px] text-stone-500 block">128,400 kWh/yr Offset</span>
                </div>
                <div class="bg-white p-4 rounded-xl border border-stone-200 space-y-1">
                  <span class="text-stone-400 text-[10px] font-bold block uppercase">Biodiversity Gain</span>
                  <span class="text-2xl font-black text-emerald-700">+42%</span>
                  <span class="text-[10px] text-stone-500 block">Above Baseline Units</span>
                </div>
              </div>

              <!-- Action Roadmap Strip -->
              <div class="bg-white p-5 rounded-xl border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Priority Action 1</span>
                    <span class="font-bold text-stone-900">Install 70,000 L Rainwater Harvesting Cistern</span>
                  </div>
                  <p class="text-stone-500 text-[11px]">Offsets 38% of non-potable flushing and grounds maintenance demand.</p>
                </div>
                <button onclick="window.App.switchView('report')" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition">
                  View Full EIA Report →
                </button>
              </div>
            </div>
          </div>

        </section>

        <!-- ========================================================= -->
        <!-- 10. TRUST & TRANSPARENCY                                  -->
        <!-- ========================================================= -->
        <section id="transparency" class="py-20 px-4 sm:px-8 border-t border-stone-200/80 bg-white">
          <div class="max-w-7xl mx-auto space-y-12">
            
            <div class="max-w-2xl space-y-3">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">Integrity & Scientific Rigor</span>
              <h2 class="text-3xl sm:text-4xl font-black text-stone-900 font-serif">
                Transparent by design.
              </h2>
              <p class="text-xs sm:text-sm text-stone-600">
                EcoBuild explains how it reaches every recommendation. No proprietary black boxes, no manufactured statistics.
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              
              <div class="p-6 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-2">
                <span class="font-bold text-stone-900 block text-sm">Data Provenance</span>
                <p class="text-stone-600 leading-relaxed">
                  Meteorological and atmospheric data are queried in real time from Open-Meteo APIs (WMO standards) and OpenStreetMap Nominatim geocoders.
                </p>
              </div>

              <div class="p-6 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-2">
                <span class="font-bold text-stone-900 block text-sm">Hydrological Equations</span>
                <p class="text-stone-600 leading-relaxed">
                  Stormwater runoff is calculated via the Rational Method ($Q = CIA$) adhering to US EPA, IRC:SP:13, and CPHEEO drainage manuals.
                </p>
              </div>

              <div class="p-6 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-2">
                <span class="font-bold text-stone-900 block text-sm">Regulatory Standards</span>
                <p class="text-stone-600 leading-relaxed">
                  Topsoil preservation follows NBC 2016 Part 11; C&D waste factors adhere to TIFAC & CPCB 2016 empirical norms.
                </p>
              </div>

              <div class="p-6 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-2">
                <span class="font-bold text-stone-900 block text-sm">Grid Emissions Factors</span>
                <p class="text-stone-600 leading-relaxed">
                  Clean energy carbon offsets utilize Central Electricity Authority (CEA) India baseline factor of 0.82 kg CO₂e / kWh.
                </p>
              </div>

              <div class="p-6 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-2">
                <span class="font-bold text-stone-900 block text-sm">Confidence Labeling</span>
                <p class="text-stone-600 leading-relaxed">
                  Every indicator is labeled by confidence level: Live Measured API, Calibrated Regional Normal, Empirical Estimate, or User Supplied.
                </p>
              </div>

              <div class="p-6 rounded-2xl bg-[#FBFBF9] border border-stone-200 space-y-2">
                <span class="font-bold text-stone-900 block text-sm">Scope Limitations</span>
                <p class="text-stone-600 leading-relaxed">
                  Designed as an academic decision-support tool. Does not substitute for formal statutory environmental clearances where certified audits are mandated.
                </p>
              </div>

            </div>

          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 11. WHO IS ECOBUILD FOR?                                  -->
        <!-- ========================================================= -->
        <section class="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
          
          <div class="space-y-3">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">User Communities</span>
            <h2 class="text-3xl sm:text-4xl font-black text-stone-900 font-serif">
              Who is EcoBuild for?
            </h2>
            <p class="text-xs sm:text-sm text-stone-600 max-w-xl">
              Equipping practitioners, researchers, and students across disciplines with data-backed environmental planning tools.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div class="p-6 bg-white rounded-2xl border border-stone-200 space-y-2">
              <span class="text-base">🎓</span>
              <h4 class="font-bold text-stone-900 text-sm">Students & Educators</h4>
              <p class="text-stone-600">Environmental science and computer engineering academic projects, capstones, and coursework simulations.</p>
            </div>
            <div class="p-6 bg-white rounded-2xl border border-stone-200 space-y-2">
              <span class="text-base">📐</span>
              <h4 class="font-bold text-stone-900 text-sm">Architects & Planners</h4>
              <p class="text-stone-600">Early-stage massing evaluation, green roof allocations, and sustainable site masterplanning.</p>
            </div>
            <div class="p-6 bg-white rounded-2xl border border-stone-200 space-y-2">
              <span class="text-base">🏡</span>
              <h4 class="font-bold text-stone-900 text-sm">Homeowners & Builders</h4>
              <p class="text-stone-600">Sizing rainwater harvesting storage tanks, permeable paving driveways, and rooftop solar arrays.</p>
            </div>
            <div class="p-6 bg-white rounded-2xl border border-stone-200 space-y-2">
              <span class="text-base">🏗️</span>
              <h4 class="font-bold text-stone-900 text-sm">Developers & Contractors</h4>
              <p class="text-stone-600">C&D waste diversion forecasting, topsoil preservation plans, and CPCB dust compliance protocols.</p>
            </div>
            <div class="p-6 bg-white rounded-2xl border border-stone-200 space-y-2">
              <span class="text-base">🏛️</span>
              <h4 class="font-bold text-stone-900 text-sm">Institutions & Campuses</h4>
              <p class="text-stone-600">University and hospital campus sustainability benchmarks and Sponge City bioretention planning.</p>
            </div>
            <div class="p-6 bg-white rounded-2xl border border-stone-200 space-y-2">
              <span class="text-base">🔬</span>
              <h4 class="font-bold text-stone-900 text-sm">Researchers & Analysts</h4>
              <p class="text-stone-600">Comparative scenario analysis exploring climate resilience under varying precipitation patterns.</p>
            </div>
          </div>

        </section>

        <!-- ========================================================= -->
        <!-- 12. GET THE APP SECTION                                   -->
        <!-- ========================================================= -->
        <section id="get-the-app" class="py-20 px-4 sm:px-8 bg-gradient-to-br from-[#0D1912] via-[#0f2419] to-[#1a3d27] text-white overflow-hidden">
          <div class="max-w-6xl mx-auto">

            <!-- Section header -->
            <div class="text-center mb-14">
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 inline-block mb-4">
                Install EcoBuild Anywhere
              </span>
              <h2 class="text-3xl sm:text-4xl font-black tracking-tight font-serif text-white">
                Take it with you. On any device.
              </h2>
              <p class="mt-4 text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
                EcoBuild installs as a native-feeling app on Windows, Android, and iPhone. No app store. No internet required after first load.
              </p>
            </div>

            <!-- Three-column install grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

              <!-- PC Install -->
              <div class="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-4 hover:bg-white/8 transition">
                <div class="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/40 flex items-center justify-center text-xl">💻</div>
                <div>
                  <h3 class="font-bold text-white text-base mb-1">Windows PC</h3>
                  <p class="text-xs text-stone-400 leading-relaxed">Open in Chrome or Edge. Click the install icon in the address bar. Or launch via the <code class="bg-white/10 px-1 rounded text-emerald-300">EcoBuildSmart.bat</code> shortcut on your Desktop.</p>
                </div>
                <div class="pt-2 border-t border-white/10">
                  <div class="text-[10px] text-stone-500 font-semibold uppercase tracking-wider mb-2">PC URL</div>
                  <code id="homepage-pc-url" class="text-xs text-emerald-300 bg-black/30 px-3 py-2 rounded-lg block font-mono">http://localhost:8000</code>
                </div>
              </div>

              <!-- Android QR -->
              <div class="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-4 hover:bg-white/8 transition">
                <div class="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/40 flex items-center justify-center text-xl">🤖</div>
                <div>
                  <h3 class="font-bold text-white text-base mb-1">Android Phone</h3>
                  <p class="text-xs text-stone-400 leading-relaxed">Scan the QR below with your camera app. Opens directly in Chrome. Tap "Add to Home Screen" when prompted.</p>
                </div>
                <div class="flex items-center gap-3">
                  <div id="homepage-qr-container" class="bg-white rounded-xl p-1.5 flex-shrink-0">
                    <img id="homepage-qr-img" src="" alt="QR" width="80" height="80" style="display:block;border-radius:6px"
                         onerror="if(this&&this.parentElement){this.removeAttribute('onerror');this.parentElement.innerHTML='<div style=\\'width:80px;height:80px;display:flex;align-items:center;justify-content:center;background:#f8fafc;border-radius:8px;font-size:24px\\'>📡</div>';}">
                  </div>
                  <div class="text-xs text-stone-400 leading-relaxed">Same WiFi as this PC required.<br>Works offline once installed.</div>
                </div>
              </div>

              <!-- iPhone -->
              <div class="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-4 hover:bg-white/8 transition">
                <div class="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/40 flex items-center justify-center text-xl">🍎</div>
                <div>
                  <h3 class="font-bold text-white text-base mb-1">iPhone / iPad</h3>
                  <p class="text-xs text-stone-400 leading-relaxed">Open the LAN URL in Safari. Tap the Share button (📤) → "Add to Home Screen". The app opens full-screen like a native app.</p>
                </div>
                <div class="pt-2 border-t border-white/10 space-y-2">
                  <div class="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">Network URL</div>
                  <div id="homepage-lan-url" class="text-xs text-emerald-300 bg-black/30 px-3 py-2 rounded-lg font-mono truncate">Loading…</div>
                </div>
              </div>

            </div>

            <!-- Bottom CTA row -->
            <div class="text-center">
              <button onclick="window.InstallModal && window.InstallModal.show()" class="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-[#0D1912] shadow-lg shadow-emerald-900/40 transition group">
                <span class="text-xl">📲</span>
                <div class="text-left">
                  <div class="leading-none">Open Full Install Guide</div>
                  <div class="text-[10px] font-medium text-emerald-900 mt-0.5 leading-none">QR code · URL · Step-by-step instructions</div>
                </div>
                <span class="transition-transform group-hover:translate-x-1">→</span>
              </button>
              <p class="mt-4 text-xs text-stone-600">No registration. No account. Works 100% offline after first load.</p>
            </div>

          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 13. CALL TO ACTION (CTA)                                  -->
        <!-- ========================================================= -->
        <section class="py-24 px-4 sm:px-8 bg-[#14281D] text-white relative overflow-hidden">
          <div class="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 inline-block">
              Start Planning Today
            </span>
            <h2 class="text-3xl sm:text-5xl font-black tracking-tight font-serif">
              Build with environmental intelligence.
            </h2>
            <p class="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Start with your project conditions and explore the sustainability strategies that fit your site. No complex software installation required.
            </p>
            <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onclick="window.App.switchView('wizard')" class="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-white text-[#14281D] hover:bg-stone-100 shadow-lg transition">
                Start Environmental Assessment →
              </button>
              <button onclick="window.InstallModal && window.InstallModal.show()" class="w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-semibold bg-emerald-700/60 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/60 transition flex items-center justify-center gap-2">
                <span>📲</span> Install as App
              </button>
              <button onclick="window.App.switchView('methodology')" class="w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-semibold bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 border border-emerald-700/60 transition">
                Explore Full Methodology
              </button>
            </div>
          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 13. REFINED FOOTER WITH CREATOR ATTRIBUTION               -->
        <!-- ========================================================= -->
        <footer class="bg-[#0D1912] text-stone-400 py-16 px-4 sm:px-8 border-t border-stone-800 text-xs">
          <div class="max-w-7xl mx-auto space-y-12">
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
              <!-- Col 1: Brand -->
              <div class="space-y-3 md:col-span-1">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded bg-emerald-900 text-emerald-400 flex items-center justify-center font-bold">
                    🌱
                  </div>
                  <span class="font-extrabold text-white text-base font-serif">EcoBuild</span>
                </div>
                <p class="text-[11px] text-stone-400 leading-relaxed">
                  Dynamic Environmental Impact Assessment & Green Infrastructure Planner.
                </p>
                <div class="text-[11px] text-emerald-400 font-medium">
                  "Plan Buildings. Measure Impact. Build Greener."
                </div>
              </div>

              <!-- Col 2: Navigation -->
              <div class="space-y-2">
                <span class="font-bold text-white uppercase text-[10px] tracking-wider block">Application</span>
                <ul class="space-y-1.5 text-stone-400">
                  <li><a href="#hero" class="hover:text-emerald-400">Home Overview</a></li>
                  <li><a href="javascript:void(0)" onclick="window.App.switchView('wizard')" class="hover:text-emerald-400">Project Assessment Wizard</a></li>
                  <li><a href="javascript:void(0)" onclick="window.App.switchView('dashboard')" class="hover:text-emerald-400">Dynamic Dashboard</a></li>
                  <li><a href="javascript:void(0)" onclick="window.App.switchView('scenariostudio')" class="hover:text-emerald-400">Scenario Studio</a></li>
                  <li><a href="javascript:void(0)" onclick="window.App.switchView('recovery')" class="hover:text-emerald-400">Nature Recovery Roadmap</a></li>
                  <li><a href="javascript:void(0)" onclick="window.App.switchView('history')" class="hover:text-emerald-400">Plan History & Archive</a></li>
                </ul>
              </div>

              <!-- Col 3: Standards -->
              <div class="space-y-2">
                <span class="font-bold text-white uppercase text-[10px] tracking-wider block">Standards & Sources</span>
                <ul class="space-y-1.5 text-stone-400">
                  <li><span class="text-stone-300">Rational Method:</span> US EPA / IRC:SP:13</li>
                  <li><span class="text-stone-300">Water Demand:</span> CPHEEO Manual</li>
                  <li><span class="text-stone-300">Sustainability:</span> NBC 2016 Part 11</li>
                  <li><span class="text-stone-300">C&D Waste:</span> TIFAC & CPCB 2016</li>
                  <li><span class="text-stone-300">Live Weather:</span> Open-Meteo APIs</li>
                  <li><span class="text-stone-300">Afforestation:</span> Akira Miyawaki Method</li>
                </ul>
              </div>

              <!-- Col 4: Academic Context -->
              <div class="space-y-2">
                <span class="font-bold text-white uppercase text-[10px] tracking-wider block">Academic Context</span>
                <p class="text-[11px] leading-relaxed text-stone-400">
                  Interdisciplinary Computer Engineering & Environmental Science graduation capstone project. Designed as a condition-responsive decision support tool.
                </p>
                <div class="pt-1">
                  <a href="javascript:void(0)" onclick="window.App.switchView('report')" class="text-emerald-400 hover:underline">
                    📄 View Official EIA Report Format →
                  </a>
                </div>
              </div>
            </div>

            <!-- Bottom Line with Explicit Creator Attribution -->
            <div class="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
              <div>
                © 2026 EcoBuild Smart Environmental Planner. Built for smarter, more sustainable development.
              </div>
              <div class="font-semibold text-stone-300 flex items-center gap-1.5 bg-stone-900/80 px-3 py-1.5 rounded-lg border border-stone-800">
                <span>Designed & Created by</span>
                <strong class="text-emerald-400 font-bold">Avishkar Shinde</strong>
              </div>
            </div>

          </div>
        </footer>

      </div>
    `;

    // Initialize the Three.js 3D Hero Scene
    setTimeout(() => {
      if (window.Hero3D) {
        window.Hero3D.init("hero-3d-canvas-container");
      }

      // Populate "Get the App" section with live network info
      fetch('/api/network-info')
        .then(r => r.ok ? r.json() : null)
        .catch(() => null)
        .then(info => {
          if (!info) {
            info = {
              lan_url: window.location.origin,
              localhost_url: 'http://localhost:8000'
            };
          }
          // QR code image
          const qrImg = document.getElementById('homepage-qr-img');
          if (qrImg) {
            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(info.lan_url)}&color=000000&bgcolor=ffffff&margin=6`;
          }
          // LAN URL text
          const lanEl = document.getElementById('homepage-lan-url');
          if (lanEl) lanEl.textContent = info.lan_url;
          const pcEl = document.getElementById('homepage-pc-url');
          if (pcEl && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            pcEl.textContent = window.location.origin;
          }
        });
    }, 150);
  },

  // Interactive Scenario Comparison Switcher
  switchComparison(scenario) {
    this.activeProjectComparison = scenario;
    const btnA = document.getElementById("btn-scenario-a");
    const btnB = document.getElementById("btn-scenario-b");
    const badge = document.getElementById("scenario-badge");
    const name = document.getElementById("scenario-name");
    const desc = document.getElementById("scenario-desc");
    const plot = document.getElementById("sc-plot");
    const built = document.getElementById("sc-built");
    const green = document.getElementById("sc-green");
    const rain = document.getElementById("sc-rain");
    const score = document.getElementById("sc-score");
    const treesRec = document.getElementById("sc-trees-rec");
    const treesWhy = document.getElementById("sc-trees-why");
    const rwhRec = document.getElementById("sc-rwh-rec");
    const rwhWhy = document.getElementById("sc-rwh-why");
    const permRec = document.getElementById("sc-perm-rec");
    const permWhy = document.getElementById("sc-perm-why");
    const roofRec = document.getElementById("sc-roof-rec");
    const roofWhy = document.getElementById("sc-roof-why");

    if (scenario === "A") {
      btnA.className = "px-4 py-2 rounded-lg text-xs font-bold transition-all bg-[#14281D] text-white shadow-sm";
      btnB.className = "px-4 py-2 rounded-lg text-xs font-bold transition-all text-stone-600 hover:text-stone-900";
      badge.innerText = "Scenario A Conditions";
      badge.className = "text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300";
      name.innerText = "Kolhapur Engineering Campus (Low Density)";
      desc.innerText = "Large 5,000 m² plot with 2,200 m² built footprint, high existing green area (2,400 m²), and 80 existing trees.";
      plot.innerText = "5,000 m²";
      built.innerText = "2,200 m²";
      green.innerText = "48% (2,400 m²)";
      rain.innerText = "1,043 mm";
      score.innerText = "Score: 86 / 100";
      treesRec.innerText = "90 Native Trees (3:1)";
      treesWhy.innerText = "Sufficient open space allows deep-canopy native planting to recover 2,100 m² of canopy within 5 years.";
      rwhRec.innerText = "70,000 L Cistern";
      rwhWhy.innerText = "Sizes tank for 45-day dry spell based on 1,043 mm monsoon precipitation and 120 occupants.";
      permRec.innerText = "1,170 m² Porous Pavers";
      permWhy.innerText = "Replaces 45% of proposed concrete parking with porous pavers to restore natural infiltration.";
      roofRec.innerText = "770 m² Green / 770 m² Solar";
      roofWhy.innerText = "Balanced 35/35 roof split provides thermal insulation while generating 128,400 kWh/yr clean solar energy.";
    } else {
      btnB.className = "px-4 py-2 rounded-lg text-xs font-bold transition-all bg-[#14281D] text-white shadow-sm";
      btnA.className = "px-4 py-2 rounded-lg text-xs font-bold transition-all text-stone-600 hover:text-stone-900";
      badge.innerText = "Scenario B Conditions";
      badge.className = "text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300";
      name.innerText = "Mumbai Urban Commercial Hub (High Density)";
      desc.innerText = "Compact 2,800 m² plot with 2,100 m² footprint (75% coverage), low baseline green (15%), and 450 office occupants.";
      plot.innerText = "2,800 m²";
      built.innerText = "2,100 m² (4 Floors)";
      green.innerText = "15% (420 m²)";
      rain.innerText = "2,213 mm";
      score.innerText = "Score: 78 / 100";
      treesRec.innerText = "45 Miyawaki Saplings + Living Wall";
      treesWhy.innerText = "Limited open ground triggers Akira Miyawaki ultra-dense afforestation (3.5/m²) plus vertical facade living walls.";
      rwhRec.innerText = "180,000 L High-Capacity Sump";
      rwhWhy.innerText = "Exploits high Mumbai monsoon volume (2,213 mm) to meet 450 occupants daily non-potable flushing requirements.";
      permRec.innerText = "520 m² Permeable Pavement";
      permWhy.innerText = "100% of non-built driveway and service bay is converted to porous pavers to eliminate flash flood risk.";
      roofRec.innerText = "1,260 m² Extensive Bio-Solar Roof";
      roofWhy.innerText = "60% green roof combined with elevated solar panels: vegetation cools panels by 3.2°C, adding +5.4% solar yield.";
    }
  },

  // Interactive Green Infrastructure System Inspector
  selectGiFeature(featureKey) {
    this.activeGiFeature = featureKey;
    const buttons = ["tree", "green_roof", "rwh", "bioswale", "permeable", "solar", "waste", "water"];
    buttons.forEach(k => {
      const b = document.getElementById(`gi-btn-${k}`);
      if (!b) return;
      if (k === featureKey) {
        b.className = "p-3 rounded-xl border text-center transition-all bg-[#14281D] text-white border-transparent shadow-sm";
      } else {
        b.className = "p-3 rounded-xl border text-center transition-all bg-white text-stone-700 border-stone-200 hover:border-emerald-600";
      }
    });

    const title = document.getElementById("gi-title");
    const what = document.getElementById("gi-what");
    const why = document.getElementById("gi-why");
    const driver = document.getElementById("gi-driver");

    const data = {
      tree: {
        title: "Compensatory Native Tree Afforestation",
        what: "Plants indigenous multi-tiered canopy species (Neem, Karanj, Arjun) at calibrated replacement ratios to restore lost biomass.",
        why: "Compensates for lost annual carbon intake (21.8 kg CO₂/tree/yr) and restores canopy microclimate shade.",
        driver: "Driven by: Trees Removed (30) ÷ Total Site Trees (80) = 37.5% Loss Ratio (3:1 statutory ratio)."
      },
      green_roof: {
        title: "Extensive Sedum Vegetative Terrace",
        what: "100-150mm lightweight substrate with drought-tolerant sedums and indigenous groundcover grasses.",
        why: "Retains 65% of peak storm precipitation, cools terrace by 2.8°C, and buffers building HVAC energy demand.",
        driver: "Driven by: RCC Flat Roof Area (2,200 m²) with structural load capacity ≥ 150 kg/m²."
      },
      rwh: {
        title: "Harvested Rainwater Filtration & Storage",
        what: "Rooftop first-flush diversion, dual-media sand filtration, and dedicated underground storage cistern.",
        why: "Harvests monsoon runoff to offset non-potable flushing and landscape irrigation, easing municipal water strain.",
        driver: "Driven by: Local Annual Rainfall (1,043 mm) × Roof Catchment (2,200 m²) × Occupancy Demand."
      },
      bioswale: {
        title: "Engineered Sponge City Bioretention Swale",
        what: "Gently sloped vegetated depression with engineered soil filter media (450mm) and aggregate retention sump.",
        why: "Filters 85% of total suspended solids (TSS) and heavy metals from driveway runoff before natural infiltration.",
        driver: "Driven by: Impervious Parking Area (2,600 m²) requiring first 25mm storm event retention."
      },
      permeable: {
        title: "Porous Interlocking Concrete Pavement",
        what: "Interlocking concrete pavers with permeable aggregate void joints laid over an open-graded stone sub-base.",
        why: "Eliminates surface ponding, restores natural groundwater recharge, and reduces site runoff coefficient from 0.90 to 0.25.",
        driver: "Driven by: Total Hardscape Concrete Paved Area (2,600 m²) needing infiltration relief."
      },
      solar: {
        title: "Rooftop Monocrystalline Solar PV Array",
        what: "High-efficiency 180 Wp/m² photovoltaic panels angled 25° South on anodized aluminum racking.",
        why: "Displaces coal-dominated grid electricity, avoiding 0.82 kg CO₂e per kWh under CEA India emission baselines.",
        driver: "Driven by: Rooftop Area (2,200 m²), South solar orientation, and annual solar irradiance (5.3 kWh/m²/day)."
      },
      waste: {
        title: "Circular C&D Debris Recycling Protocol",
        what: "On-site segregation and mobile crushing of concrete and brick rubble into graded aggregate.",
        why: "Diverts 65% of construction debris from landfills, utilizing crushed aggregate for pervious parking sub-base.",
        driver: "Driven by: Gross Floor Area (4,400 m²) × TIFAC Benchmark (60 kg/m²) = 264 Tonnes C&D waste."
      },
      water: {
        title: "Dual Plumbing & Water Conservation Loop",
        what: "Low-flow fixtures (dual flush, aerators) combined with treated greywater reuse for toilet flushing.",
        why: "Reduces net municipal freshwater consumption from 135 LPCD down to sustainable 70 LPCD operational levels.",
        driver: "Driven by: NBC Occupancy Load (120 occupants) and local aquifer depth indicator."
      }
    };

    const sel = data[featureKey] || data.tree;
    title.innerText = sel.title;
    what.innerText = sel.what;
    why.innerText = sel.why;
    driver.innerText = sel.driver;
  },

  // Hotspot Carousel in 3D Hero
  hotspotIndex: 0,
  cycleHotspot() {
    const list = [
      { badge: "🌿 Green Roof", title: "Extensive Sedum Vegetative Terrace", desc: "Captures 65% of incident rainfall and reduces rooftop ambient temperatures by 2.8°C, lowering air conditioning load and enhancing rooftop solar PV efficiency." },
      { badge: "☀️ Solar PV", title: "88 kWp Angled Photovoltaic Array", desc: "Generates ~128,400 kWh/yr of clean energy, offsetting 105 tonnes of CO₂e annually under Central Electricity Authority grid baselines." },
      { badge: "💧 Rainwater Sump", title: "70,000 L Subsurface Rain Cistern", desc: "Engineered for a 45-day monsoon dry spell, supplying 100% of campus toilet flushing and landscape irrigation needs." },
      { badge: "🌱 Bioswale", title: "Engineered Sponge City Infiltration Swale", desc: "Removes 85% of suspended sediment and petroleum hydrocarbons from parking runoff while naturally recharging the shallow water table." },
      { badge: "🟩 Permeable Paving", title: "1,170 m² Porous Interlocking Pavers", desc: "Transforms impermeable concrete parking bays into drainage zones with a runoff coefficient of C=0.25 (72% flow reduction)." }
    ];
    this.hotspotIndex = (this.hotspotIndex + 1) % list.length;
    const cur = list[this.hotspotIndex];
    document.getElementById("hotspot-badge").innerText = cur.badge;
    document.getElementById("hotspot-title").innerText = cur.title;
    document.getElementById("hotspot-desc").innerText = cur.desc;
  }
};
