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
        <!-- 1. 3D CRYSTALLINE HOMEPAGE NAVBAR                         -->
        <!-- ========================================================= -->
        <nav id="home-navbar" class="sticky top-0 z-50 transition-all duration-300 crystal-3d-emerald rounded-none border-x-0 border-t-0 text-white backdrop-blur-xl py-3 px-4 sm:px-8 shadow-2xl">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <!-- Brand Logo with 3D Crystalline Jewel Mark -->
            <div class="flex items-center gap-3 cursor-pointer group" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B241E] to-[#04100D] border border-emerald-500/50 flex items-center justify-center shadow-lg shadow-emerald-950/40 transition-transform group-hover:scale-105 relative overflow-hidden">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  <defs>
                    <linearGradient id="navFacetTop" x1="24" y1="4" x2="38" y2="16" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stop-color="#A7F3D0"/>
                      <stop offset="100%" stop-color="#34D399"/>
                    </linearGradient>
                    <linearGradient id="navFacetLeft" x1="10" y1="16" x2="24" y2="34" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stop-color="#10B981"/>
                      <stop offset="100%" stop-color="#047857"/>
                    </linearGradient>
                    <linearGradient id="navFacetRight" x1="38" y1="16" x2="24" y2="34" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stop-color="#059669"/>
                      <stop offset="100%" stop-color="#064E3B"/>
                    </linearGradient>
                    <linearGradient id="navFacetBottom" x1="24" y1="34" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stop-color="#047857"/>
                      <stop offset="100%" stop-color="#022C22"/>
                    </linearGradient>
                    <linearGradient id="navFacetCore" x1="24" y1="14" x2="24" y2="30" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
                      <stop offset="100%" stop-color="#6EE7B7" stop-opacity="0.3"/>
                    </linearGradient>
                  </defs>
                  <polygon points="24,4 38,15 24,20 10,15" fill="url(#navFacetTop)" stroke="#ECFDF5" stroke-width="0.8" stroke-linejoin="round"/>
                  <polygon points="10,15 24,20 24,36 10,31" fill="url(#navFacetLeft)" stroke="#34D399" stroke-width="0.6" stroke-linejoin="round"/>
                  <polygon points="38,15 24,20 24,36 38,31" fill="url(#navFacetRight)" stroke="#10B981" stroke-width="0.6" stroke-linejoin="round"/>
                  <polygon points="10,31 24,36 38,31 24,44" fill="url(#navFacetBottom)" stroke="#064E3B" stroke-width="0.6" stroke-linejoin="round"/>
                  <path d="M24 10 L30 18 L24 23 L18 18 Z" fill="url(#navFacetCore)" opacity="0.9"/>
                  <path d="M24 12 V38 M18 24 L24 18 L30 24 M19 30 L24 25 L29 30" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="24" cy="5" r="1.5" fill="#FFFFFF"/>
                  <circle cx="38" cy="15" r="1.2" fill="#E0F2FE"/>
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-black text-lg tracking-tight text-white font-serif">EcoBuild</span>
                  <span class="text-[9px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/50 font-mono shadow-xs">3D SMART TWIN</span>
                </div>
                <p class="text-[10px] text-emerald-200/80 hidden sm:block tracking-tight font-medium">Environmental Decision Platform</p>
              </div>
            </div>

            <!-- Center Navigation Links -->
            <div class="hidden md:flex items-center gap-6 text-xs font-semibold text-emerald-100">
              <a href="#hero" class="hover:text-white transition-colors">Home</a>
              <a href="#how-to-use-ecobuild" class="hover:text-white transition-colors text-emerald-200 font-bold flex items-center gap-1"><span>📖</span> How to Use</a>
              <a href="#what-is-ecobuild" class="hover:text-white transition-colors">What is EcoBuild</a>
              <a href="#why-this-matters" class="hover:text-white transition-colors">Why It Matters</a>
              <a href="#how-it-works" class="hover:text-white transition-colors">How It Works</a>
              <a href="#condition-intelligence" class="hover:text-white transition-colors">Condition Engine</a>
              <a href="#green-infrastructure" class="hover:text-white transition-colors">Green Infrastructure</a>
              <a href="#get-the-app" class="hover:text-white transition-colors text-emerald-300 flex items-center gap-1 font-bold">📲 Get App</a>
            </div>

            <!-- Primary Actions -->
            <div class="flex items-center gap-2.5">
              <button onclick="window.InstallModal && window.InstallModal.show()" class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-200 hover:text-white bg-[#0B241E] hover:bg-[#123C32] border border-emerald-700/60 transition group shadow-xs">
                <span class="text-sm">📲</span>
                <span>Install App</span>
              </button>
              <button onclick="window.App.switchView('dashboard')" class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-600/70 shadow-sm transition">
                <span>📊 Live Workspace</span>
              </button>
              <button onclick="window.App.switchView('wizard')" class="crystal-3d-button inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black shadow-md transition group">
                <span>Start Assessment</span>
                <span class="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </nav>

        <!-- ========================================================= -->
        <!-- 2. HERO SECTION WITH 3D ARCHITECTURAL MODEL              -->
        <!-- ========================================================= -->
        <section id="hero" class="relative pt-12 pb-20 px-4 sm:px-8 border-b border-stone-200/80 overflow-hidden bg-gradient-to-b from-[#FBFBF9] via-[#F6F7F3] to-[#F1F3ED]">
          <!-- Ambient 3D Emerald Radial Glow Background Decal -->
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-emerald-500/12 via-teal-500/6 to-transparent blur-3xl pointer-events-none select-none"></div>

          <!-- Ambient Architectural Coordinate Decals -->
          <div class="absolute top-6 left-8 font-mono text-[10px] text-stone-400 tracking-wider hidden lg:block select-none pointer-events-none">
            LAT 16.7050° N / LON 74.2433° E • REVISED URBAN HYDROLOGY STANDARD
          </div>
          <div class="absolute top-6 right-8 font-mono text-[10px] text-stone-400 tracking-wider hidden lg:block select-none pointer-events-none">
            EVALUATION MODEL v2.5.0 • NBC PART 11 SUSTAINABILITY FRAMEWORK
          </div>

          <div class="max-w-7xl mx-auto relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <!-- Left Column: Typography & Intentional Storytelling -->
              <div class="lg:col-span-5 space-y-6">
                <!-- Eyebrow Tag -->
                <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold crystal-3d-pill text-[#123C32]">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Architectural & Environmental Intelligence</span>
                </div>

                <!-- Main Editorial Headline with Dimensional Gradient -->
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.08] font-serif">
                  Plan Better Buildings.<br>
                  <span class="bg-gradient-to-r from-emerald-800 via-[#185E42] to-teal-700 bg-clip-text text-transparent font-sans font-extrabold italic">Recover the Environment.</span>
                </h1>

                <!-- Main Tagline Badge -->
                <div>
                  <span class="inline-block text-xs font-bold uppercase tracking-wider text-emerald-950 bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-300 font-mono shadow-xs">
                    💎 Measure. Recover. Optimize. Build Better.
                  </span>
                </div>

                <!-- Supporting Description -->
                <p class="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-xl">
                  Analyze your site's environmental impact, discover practical recovery opportunities, simulate sustainable alternatives and build a recovery plan that fits your land, climate and budget.
                </p>

                <!-- Core Call to Action Buttons -->
                <div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button onclick="window.App.switchView('wizard')" class="crystal-3d-button inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-black shadow-lg hover:shadow-xl transition-all group tracking-wide">
                    <span>ASSESS MY SITE</span>
                    <span class="transition-transform group-hover:translate-x-1.5">→</span>
                  </button>
                  <button onclick="window.App.switchView('site3d')" class="crystal-3d-pill inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-stone-800 hover:text-stone-900 border border-stone-300/80 shadow-md transition">
                    <span>🌐 3D ENVIRONMENTAL DIGITAL TWIN</span>
                  </button>
                </div>

                <!-- Install App Row -->
                <div class="pt-1 flex items-center gap-3 flex-wrap">
                  <button onclick="window.InstallModal && window.InstallModal.show()" class="crystal-3d-pill inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-900 border border-emerald-300 shadow-sm transition group">
                    <span class="text-base">📲</span>
                    <div class="text-left">
                      <div class="font-black text-xs leading-none mb-0.5">Install App</div>
                      <div class="text-[10px] text-emerald-700 font-semibold leading-none">PC • Android • iPhone</div>
                    </div>
                  </button>
                  <div class="text-[11px] text-stone-500 font-medium">Works offline · No account needed</div>
                </div>

                <!-- Small Trust Indicator Line -->
                <div class="pt-2 flex items-center gap-3 text-xs text-stone-500 font-medium">
                  <span class="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Data-driven
                  </span>
                  <span>•</span>
                  <span class="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Condition-responsive
                  </span>
                  <span>•</span>
                  <span class="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Sustainability-focused
                  </span>
                </div>
              </div>

              <!-- Right Column: Interactive 3D Architectural Scene with Crystalline Bevel -->
              <div class="lg:col-span-7 relative">
                <!-- Outer 3D Architectural Crystalline Frame -->
                <div class="relative crystal-3d-card p-3 sm:p-5 border border-stone-200/90 shadow-2xl">
                  
                  <!-- Top Canvas Telemetry Header -->
                  <div class="flex items-center justify-between px-3 py-2 text-xs text-stone-500 border-b border-stone-200/70 mb-2">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span class="font-mono text-[11px] font-black text-stone-700">3D SITE MODEL • PROPORTIONAL SCALE</span>
                    </div>
                    <span class="text-[10px] text-stone-400 font-medium">Left-drag to orbit • Scroll to zoom</span>
                  </div>

                  <!-- 3D Canvas Viewport -->
                  <div id="hero-3d-canvas-container" class="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#f8fafc]/30 to-[#e2e8f0]/40 cursor-grab active:cursor-grabbing">
                    <!-- Three.js mounts here -->
                  </div>

                  <!-- Floating 3D Crystalline Real-World Telemetry Overlays -->
                  <div class="absolute top-16 left-6 crystal-3d-card px-4 py-3 border border-white shadow-xl space-y-0.5 pointer-events-none hidden sm:block animate-float-3d" style="animation-delay: 0s;">
                    <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span><span class="text-[9px] font-bold uppercase tracking-wider text-stone-500 block">Green Cover</span></div>
                    <span class="text-lg font-black text-emerald-800 font-mono">42%</span>
                    <span class="text-[9px] text-stone-500 block">Post-Development Ratio</span>
                  </div>

                  <div class="absolute top-16 right-6 crystal-3d-card px-4 py-3 border border-white shadow-xl space-y-0.5 pointer-events-none hidden sm:block animate-float-3d" style="animation-delay: 1.2s;">
                    <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span><span class="text-[9px] font-bold uppercase tracking-wider text-stone-500 block">Solar Generation</span></div>
                    <span class="text-lg font-black text-amber-700 font-mono">8.4 kWp</span>
                    <span class="text-[9px] text-stone-500 block">Rooftop Photovoltaic</span>
                  </div>

                  <div class="absolute bottom-16 left-6 crystal-3d-card px-4 py-3 border border-white shadow-xl space-y-0.5 pointer-events-none hidden sm:block animate-float-3d" style="animation-delay: 2.4s;">
                    <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span><span class="text-[9px] font-bold uppercase tracking-wider text-stone-500 block">Rainwater Harvest</span></div>
                    <span class="text-lg font-black text-blue-700 font-mono">24,500 L/yr</span>
                    <span class="text-[9px] text-stone-500 block">Monsoon Catchment</span>
                  </div>

                  <div class="absolute bottom-16 right-6 crystal-3d-card px-4 py-3 border border-white shadow-xl space-y-0.5 pointer-events-none hidden sm:block animate-float-3d" style="animation-delay: 3.6s;">
                    <div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span><span class="text-[9px] font-bold uppercase tracking-wider text-stone-500 block">Compensatory Trees</span></div>
                    <span class="text-lg font-black text-emerald-800 font-mono">+18 Net</span>
                    <span class="text-[9px] text-stone-500 block">3:1 Replacement Norm</span>
                  </div>

                  <!-- Explicit Simulation Disclaimer -->
                  <div class="mt-3 px-3.5 py-1.5 rounded-xl bg-stone-100/90 border border-stone-200 text-center">
                    <p class="text-[11px] text-stone-600 font-medium">
                      <strong class="text-stone-800">Live 3D Simulation:</strong> Results adapt in real time to your site's physical cadastre, rainfall, and building parameters.
                    </p>
                  </div>
                </div>

                <!-- Interactive Hotspot Explanation 3D Card -->
                <div id="hotspot-info-card" class="mt-3.5 crystal-3d-card p-4 flex items-start justify-between gap-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span id="hotspot-badge" class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        🌿 Green Roof Feature
                      </span>
                      <h4 id="hotspot-title" class="text-xs font-bold text-stone-900">Extensive Sedum Vegetative Terrace</h4>
                    </div>
                    <p id="hotspot-desc" class="text-xs text-stone-600 leading-relaxed">
                      Captures 65% of incident rainfall and reduces rooftop ambient temperatures by 2.8°C, lowering air conditioning load and enhancing rooftop solar PV efficiency.
                    </p>
                  </div>
                  <button onclick="window.HomeView.cycleHotspot()" class="px-3 py-1.5 rounded-xl text-xs font-bold crystal-3d-pill text-stone-700 transition shrink-0 hover:text-stone-900">
                    Next System ⟳
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 2.5 HOW TO USE ECOBUILD — QUICK START & WORKFLOW GUIDE    -->
        <!-- ========================================================= -->
        <section id="how-to-use-ecobuild" class="py-14 px-4 sm:px-8 max-w-7xl mx-auto border-b border-stone-200/80">
          <div class="space-y-8">
            <!-- Section Header -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div class="space-y-2 max-w-2xl">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold crystal-3d-pill text-[#123C32]">
                  <span>📖</span>
                  <span>ESSENTIAL ONBOARDING & ENGINEERING WORKFLOW</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-black text-stone-900 font-serif tracking-tight">
                  How to Use EcoBuild Smart
                </h2>
                <p class="text-sm sm:text-base text-stone-600 font-medium leading-relaxed">
                  Assess your site. Understand its environmental impacts. Compare realistic ways to improve it.
                </p>
              </div>

              <!-- Quick Launch Buttons -->
              <div class="flex items-center gap-2.5 flex-wrap">
                <button onclick="window.App.switchView('wizard')" class="crystal-3d-button px-4 py-2.5 rounded-xl text-xs font-black shadow-md transition flex items-center gap-1.5" title="Start a fresh site assessment">
                  <span>+</span> <span>Start New Assessment</span>
                </button>
                <button onclick="window.App.toggleProjectSwitcher(true)" class="crystal-3d-pill px-3.5 py-2.5 rounded-xl text-xs font-bold text-stone-800 hover:text-stone-950 transition flex items-center gap-1.5" title="Load saved or active projects">
                  <span>📁</span> <span>Open Project</span>
                </button>
                <button onclick="window.HomeView.openWalkthroughModal(1)" class="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#123C32] hover:bg-[#185E42] text-white shadow transition flex items-center gap-1.5" title="Explore full 13-step guide">
                  <span>🎓</span> <span>Step-by-Step Guide</span>
                </button>
              </div>
            </div>

            <!-- Compact 8-Step Progress Flow Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <!-- Step 1 -->
              <div onclick="window.HomeView.openWalkthroughModal(1)" class="crystal-3d-card p-5 space-y-2.5 cursor-pointer hover:border-emerald-600 group transition">
                <div class="flex items-center justify-between">
                  <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center font-mono">01</span>
                  <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">PROJECT</span>
                </div>
                <h4 class="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition">Start a Project</h4>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Name your project, select typology (Residential, Commercial, Institutional), and set user mode.
                </p>
                <div class="pt-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span>Launch Wizard Step 1</span> <span>&rarr;</span>
                </div>
              </div>

              <!-- Step 2 -->
              <div onclick="window.HomeView.openWalkthroughModal(2)" class="crystal-3d-card p-5 space-y-2.5 cursor-pointer hover:border-emerald-600 group transition">
                <div class="flex items-center justify-between">
                  <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center font-mono">02</span>
                  <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">LOCATION</span>
                </div>
                <h4 class="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition">Set Location & Cadastre</h4>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Enter geographic coordinates or choose city presets to link regional rainfall and solar irradiance.
                </p>
                <div class="pt-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span>Geospatial Locator</span> <span>&rarr;</span>
                </div>
              </div>

              <!-- Step 3 -->
              <div onclick="window.HomeView.openWalkthroughModal(4)" class="crystal-3d-card p-5 space-y-2.5 cursor-pointer hover:border-emerald-600 group transition">
                <div class="flex items-center justify-between">
                  <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center font-mono">03</span>
                  <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">BASELINE</span>
                </div>
                <h4 class="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition">Describe Site Baseline</h4>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Record existing trees, green cover, and soil group (A–D). Missing data is cleanly marked provisional.
                </p>
                <div class="pt-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span>Evidence Standard</span> <span>&rarr;</span>
                </div>
              </div>

              <!-- Step 4 -->
              <div onclick="window.HomeView.openWalkthroughModal(5)" class="crystal-3d-card p-5 space-y-2.5 cursor-pointer hover:border-emerald-600 group transition">
                <div class="flex items-center justify-between">
                  <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center font-mono">04</span>
                  <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">PROPOSAL</span>
                </div>
                <h4 class="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition">Enter Proposed Works</h4>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Specify built-up footprint, floors, roof area, external hardscape, water demand, and C&D waste.
                </p>
                <div class="pt-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span>Geometric Balance</span> <span>&rarr;</span>
                </div>
              </div>

              <!-- Step 5 -->
              <div onclick="window.HomeView.openWalkthroughModal(6)" class="crystal-3d-card p-5 space-y-2.5 cursor-pointer hover:border-emerald-600 group transition">
                <div class="flex items-center justify-between">
                  <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center font-mono">05</span>
                  <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">CLIMATE</span>
                </div>
                <h4 class="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition">Check Data & Physics</h4>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Review external Open-Meteo climate feeds, design storm intensity (35 mm/hr), and CEA grid factors.
                </p>
                <div class="pt-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span>Traceable Sources</span> <span>&rarr;</span>
                </div>
              </div>

              <!-- Step 6 -->
              <div onclick="window.HomeView.openWalkthroughModal(8)" class="crystal-3d-card p-5 space-y-2.5 cursor-pointer hover:border-emerald-600 group transition">
                <div class="flex items-center justify-between">
                  <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center font-mono">06</span>
                  <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">ASSESSMENT</span>
                </div>
                <h4 class="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition">Review Tri-Scenario Metrics</h4>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Compare Baseline vs Proposed vs Mitigated states across runoff, carbon, energy, and biodiversity.
                </p>
                <div class="pt-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span>Dynamic Dashboard</span> <span>&rarr;</span>
                </div>
              </div>

              <!-- Step 7 -->
              <div onclick="window.HomeView.openWalkthroughModal(10)" class="crystal-3d-card p-5 space-y-2.5 cursor-pointer hover:border-emerald-600 group transition">
                <div class="flex items-center justify-between">
                  <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center font-mono">07</span>
                  <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">RECOVERY</span>
                </div>
                <h4 class="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition">Compare Recovery Plans</h4>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Evaluate Essential, Balanced, and Max Feasible Pareto packages strictly constrained to site area.
                </p>
                <div class="pt-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span>Pareto Optimizer</span> <span>&rarr;</span>
                </div>
              </div>

              <!-- Step 8 -->
              <div onclick="window.HomeView.openWalkthroughModal(11)" class="crystal-3d-card p-5 space-y-2.5 cursor-pointer hover:border-emerald-600 group transition">
                <div class="flex items-center justify-between">
                  <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center font-mono">08</span>
                  <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">REPORTS</span>
                </div>
                <h4 class="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition">Generate & Export EIA</h4>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Export formal academic EIA dossier, CAD blueprints (DXF), and itemized capital/maintenance budgets.
                </p>
                <div class="pt-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span>Printable Dossier</span> <span>&rarr;</span>
                </div>
              </div>

            </div>

            <!-- Preparation Checklist Banner -->
            <div class="crystal-3d-card p-5 sm:p-6 bg-gradient-to-r from-emerald-50/70 via-stone-50/60 to-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-stone-900 text-xs sm:text-sm">📋 What Information to Prepare Before You Begin:</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200/70 text-emerald-900">RECOMMENDED</span>
                </div>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Total plot area (m²), proposed building footprint, floor count, mature tree count to retain/remove, and utility demands. Approximate values are permitted and flagged provisional.
                </p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button onclick="window.App.switchProject('kolhapur_academic'); window.App.switchView('dashboard');" class="px-3.5 py-2 rounded-xl text-xs font-bold crystal-3d-pill text-stone-800 hover:text-stone-950 transition">
                  Explore Pre-filled Demo ➜
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 3. FIRST IMPRESSION TRIAD (WHAT • WHY • HOW)              -->
        <!-- ========================================================= -->
        <section class="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div class="crystal-3d-card p-7 space-y-4 relative overflow-hidden group">
              <div class="flex items-center justify-between">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 border border-emerald-300 text-emerald-900 font-black text-sm flex items-center justify-center font-mono shadow-xs">
                  01
                </div>
                <span class="crystal-gem-badge emerald">WHAT</span>
              </div>
              <h3 class="text-lg font-black text-stone-900 font-serif leading-snug">An Intelligent Environmental Planning System</h3>
              <p class="text-xs text-stone-600 leading-relaxed">
                EcoBuild calculates how building dimensions, impermeable surfaces, and vegetation alterations impact local hydrology, carbon balance, and thermal microclimates.
              </p>
              <div class="pt-2 border-t border-stone-200/60 flex items-center text-[11px] font-bold text-emerald-800">
                <span>Site-specific digital twin intelligence</span>
              </div>
            </div>

            <div class="crystal-3d-card p-7 space-y-4 relative overflow-hidden group">
              <div class="flex items-center justify-between">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 text-amber-900 font-black text-sm flex items-center justify-center font-mono shadow-xs">
                  02
                </div>
                <span class="crystal-gem-badge amber">WHY</span>
              </div>
              <h3 class="text-lg font-black text-stone-900 font-serif leading-snug">Construction Fundamentally Changes Sites</h3>
              <p class="text-xs text-stone-600 leading-relaxed">
                Hardscapes block stormwater infiltration, removed trees reduce natural carbon sequestration, and concrete surfaces trap heat—creating compounding deficits.
              </p>
              <div class="pt-2 border-t border-stone-200/60 flex items-center text-[11px] font-bold text-amber-800">
                <span>Quantified deficit before construction starts</span>
              </div>
            </div>

            <div class="crystal-3d-card p-7 space-y-4 relative overflow-hidden group">
              <div class="flex items-center justify-between">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-300 text-blue-900 font-black text-sm flex items-center justify-center font-mono shadow-xs">
                  03
                </div>
                <span class="crystal-gem-badge blue">HOW</span>
              </div>
              <h3 class="text-lg font-black text-stone-900 font-serif leading-snug">Condition-Responsive Green Strategies</h3>
              <p class="text-xs text-stone-600 leading-relaxed">
                By fusing user cadastre data with live meteorological feeds, the engine sizes rainwater cisterns, permeable paving, Miyawaki forests, and solar infrastructure.
              </p>
              <div class="pt-2 border-t border-stone-200/60 flex items-center text-[11px] font-bold text-blue-800">
                <span>Engineering-grade recovery blueprints</span>
              </div>
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
              <div onclick="window.App.switchView('dashboard')" class="crystal-3d-card p-4 space-y-2.5 cursor-pointer hover:border-emerald-600 group">
                <div class="w-10 h-10 rounded-xl crystal-stat-box flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform">📊</div>
                <h4 class="font-black text-stone-900">Environmental Assessment</h4>
                <p class="text-[11px] text-stone-500 leading-snug">Understand the current site condition, soil sealing, and deficit indices.</p>
              </div>

              <!-- Pillar 2 -->
              <div onclick="window.App.switchView('recovery')" class="crystal-3d-card p-4 space-y-2.5 cursor-pointer hover:border-emerald-600 group">
                <div class="w-10 h-10 rounded-xl crystal-stat-box flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform">🌱</div>
                <h4 class="font-black text-stone-900">Nature Recovery</h4>
                <p class="text-[11px] text-stone-500 leading-snug">Restore native vegetation, canopy layers, water systems and biodiversity.</p>
              </div>

              <!-- Pillar 3 -->
              <div onclick="window.App.switchView('materials')" class="crystal-3d-card p-4 space-y-2.5 cursor-pointer hover:border-emerald-600 group">
                <div class="w-10 h-10 rounded-xl crystal-stat-box flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform">🧱</div>
                <h4 class="font-black text-stone-900">Sustainable Construction</h4>
                <p class="text-[11px] text-stone-500 leading-snug">Replace unnecessary harmful hardscapes with circular and porous alternatives.</p>
              </div>

              <!-- Pillar 4 -->
              <div onclick="window.App.switchView('technical')" class="crystal-3d-card p-4 space-y-2.5 cursor-pointer hover:border-emerald-600 group">
                <div class="w-10 h-10 rounded-xl crystal-stat-box flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform">🌦️</div>
                <h4 class="font-black text-stone-900">Climate Intelligence</h4>
                <p class="text-[11px] text-stone-500 leading-snug">Integrate real IMD rainfall normals, NASA solar models, and CPCB AQI feeds.</p>
              </div>

              <!-- Pillar 5 -->
              <div onclick="window.App.switchView('site3d')" class="crystal-3d-card p-4 space-y-2.5 cursor-pointer hover:border-emerald-600 group">
                <div class="w-10 h-10 rounded-xl crystal-stat-box flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform">🌐</div>
                <h4 class="font-black text-stone-900">3D Environmental Twin</h4>
                <p class="text-[11px] text-stone-500 leading-snug">Explore interactive 3D site cadastre and photorealistic architectural twin.</p>
              </div>

              <!-- Pillar 6 -->
              <div onclick="window.App.switchView('recovery')" class="crystal-3d-card p-4 space-y-2.5 cursor-pointer hover:border-emerald-600 group">
                <div class="w-10 h-10 rounded-xl crystal-stat-box flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform">💰</div>
                <h4 class="font-black text-stone-900">Cost Optimization</h4>
                <p class="text-[11px] text-stone-500 leading-snug">Find the optimal multi-objective balance within available site budget.</p>
              </div>

              <!-- Pillar 7 -->
              <div onclick="window.App.switchView('monitoring')" class="crystal-3d-card p-4 space-y-2.5 cursor-pointer hover:border-emerald-600 group">
                <div class="w-10 h-10 rounded-xl crystal-stat-box flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform">📈</div>
                <h4 class="font-black text-stone-900">Recovery Monitoring</h4>
                <p class="text-[11px] text-stone-500 leading-snug">Track actual post-construction metrics and compare with modeled predictions.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 4. EDITORIAL "WHAT IS ECOBUILD?"                          -->
        <!-- ========================================================= -->
        <section id="what-is-ecobuild" class="py-20 px-4 sm:px-8 border-y border-stone-200/80 bg-white/70 backdrop-blur-md">
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
              <div class="crystal-3d-card p-6 space-y-3 relative group hover:border-emerald-600 transition-all">
                <span class="text-2xl font-mono text-emerald-800/40 font-black block group-hover:text-emerald-700 transition-colors">01</span>
                <h4 class="text-base font-bold text-stone-900">Analyze</h4>
                <div class="text-xs text-emerald-800 font-bold">Understand the project & site</div>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Evaluates plot boundaries, building footprints, soil permeabilities, floor area ratios, and pre-existing canopy cover.
                </p>
              </div>

              <!-- Stage 2: Measure -->
              <div class="crystal-3d-card p-6 space-y-3 relative group hover:border-emerald-600 transition-all">
                <span class="text-2xl font-mono text-emerald-800/40 font-black block group-hover:text-emerald-700 transition-colors">02</span>
                <h4 class="text-base font-bold text-stone-900">Measure</h4>
                <div class="text-xs text-emerald-800 font-bold">Evaluate environmental parameters</div>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Computes peak runoff ($Q = CIA$), embodied carbon intensity, rooftop solar yield, and NBC water demand metrics.
                </p>
              </div>

              <!-- Stage 3: Optimize -->
              <div class="crystal-3d-card p-6 space-y-3 relative group hover:border-emerald-600 transition-all">
                <span class="text-2xl font-mono text-emerald-800/40 font-black block group-hover:text-emerald-700 transition-colors">03</span>
                <h4 class="text-base font-bold text-stone-900">Optimize</h4>
                <div class="text-xs text-emerald-800 font-bold">Identify areas requiring improvement</div>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Detects excess impermeable surface ratios, stormwater surges, tree loss deficits, and rooftop thermal exposure.
                </p>
              </div>

              <!-- Stage 4: Recommend -->
              <div class="crystal-3d-card p-6 space-y-3 relative group hover:border-emerald-600 transition-all">
                <span class="text-2xl font-mono text-emerald-800/40 font-black block group-hover:text-emerald-700 transition-colors">04</span>
                <h4 class="text-base font-bold text-stone-900">Recommend</h4>
                <div class="text-xs text-emerald-800 font-bold">Generate project-specific strategies</div>
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
            <div class="crystal-3d-card overflow-hidden space-y-0 group border-2 border-emerald-500/40">
              <div class="h-44 w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80" alt="Natural Pristine Forest Site" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent"></div>
                <span class="absolute top-3 left-3 crystal-gem-badge emerald">Pre-Development</span>
                <span class="absolute bottom-3 right-3 text-xs font-mono font-bold text-white bg-black/40 px-2 py-0.5 rounded backdrop-blur">Phase 01</span>
              </div>
              <div class="p-6 space-y-3">
                <h3 class="text-lg font-black text-stone-900 font-serif">Natural Site Baseline</h3>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Untouched site with mature indigenous trees, porous topsoil, natural rain infiltration, and baseline carbon balance.
                </p>
                <ul class="text-xs text-stone-700 space-y-2 border-t border-stone-200/80 pt-3">
                  <li class="flex items-center gap-2"><span>🌳</span> <strong>Canopy Cover:</strong> High shade & natural cooling</li>
                  <li class="flex items-center gap-2"><span>💧</span> <strong>Runoff Coeff (C):</strong> 0.20 (80% naturally absorbed)</li>
                  <li class="flex items-center gap-2"><span>🌡️</span> <strong>Surface Heat:</strong> Natural vegetation evapo-cooling</li>
                </ul>
              </div>
            </div>

            <!-- Phase 2: Construction Impact -->
            <div class="crystal-3d-card overflow-hidden space-y-0 group border-2 border-amber-500/40">
              <div class="h-44 w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80" alt="Construction Excavation Impact" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent"></div>
                <span class="absolute top-3 left-3 crystal-gem-badge amber">Development Deficit</span>
                <span class="absolute bottom-3 right-3 text-xs font-mono font-bold text-white bg-black/40 px-2 py-0.5 rounded backdrop-blur">Phase 02</span>
              </div>
              <div class="p-6 space-y-3">
                <h3 class="text-lg font-black text-stone-900 font-serif">Construction Impact</h3>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Footprint excavation, tree removal, dense concrete paving, and topsoil loss produce severe hydrological and carbon deficits.
                </p>
                <ul class="text-xs text-stone-700 space-y-2 border-t border-stone-200/80 pt-3">
                  <li class="flex items-center gap-2 text-rose-700"><span>⚠️</span> <strong>Tree Loss:</strong> Canopy stripped & carbon sink cut</li>
                  <li class="flex items-center gap-2 text-rose-700"><span>🌊</span> <strong>Runoff Coeff (C):</strong> 0.85 (+75% surge into storm drains)</li>
                  <li class="flex items-center gap-2 text-rose-700"><span>🏗️</span> <strong>Embodied Carbon:</strong> High cement footprint & thermal mass</li>
                </ul>
              </div>
            </div>

            <!-- Phase 3: EcoBuild Response -->
            <div class="crystal-3d-card overflow-hidden space-y-0 group border-2 border-emerald-600 shadow-xl">
              <div class="h-44 w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80" alt="Biophilic Architecture & Nature Recovery" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent"></div>
                <span class="absolute top-3 left-3 crystal-gem-badge emerald">Restorative Recovery</span>
                <span class="absolute bottom-3 right-3 text-xs font-mono font-bold text-white bg-emerald-950/80 px-2 py-0.5 rounded backdrop-blur">Phase 03</span>
              </div>
              <div class="p-6 space-y-3">
                <h3 class="text-lg font-black text-stone-900 font-serif">EcoBuild Recovery</h3>
                <p class="text-xs text-stone-600 leading-relaxed">
                  Engineered green infrastructure, Miyawaki afforestation, permeable parking, rainwater retention, and solar synergy restore equilibrium.
                </p>
                <ul class="text-xs text-stone-700 space-y-2 border-t border-stone-200/80 pt-3">
                  <li class="flex items-center gap-2 text-emerald-800"><span>🌱</span> <strong>Compensatory Trees:</strong> 3:1 Replacement Norm</li>
                  <li class="flex items-center gap-2 text-emerald-800"><span>💧</span> <strong>Runoff Mitigated:</strong> -45% Peak flow via SUDs</li>
                  <li class="flex items-center gap-2 text-emerald-800"><span>☀️</span> <strong>Solar PV:</strong> Net-zero offset horizon</li>
                </ul>
              </div>
            </div>

          </div>

          <!-- Transition Pathway Ribbon -->
          <div class="crystal-3d-card p-4.5 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-stone-700 text-center">
            <span>Natural Site</span>
            <span class="text-stone-400">→</span>
            <span class="text-amber-800 font-bold">Development Impact</span>
            <span class="text-stone-400">→</span>
            <span class="text-emerald-800 font-bold">Environmental Analysis</span>
            <span class="text-stone-400">→</span>
            <span class="text-emerald-900 font-extrabold">Green Recovery</span>
            <span class="text-stone-400">→</span>
            <span class="crystal-3d-button px-3.5 py-1 text-white rounded-lg text-xs">Better Planning</span>
          </div>

        </section>

        <!-- ========================================================= -->
        <!-- 6. HOW ECOBUILD WORKS (CUSTOM WORKFLOW TIMELINE)          -->
        <!-- ========================================================= -->
        <section id="how-it-works" class="py-20 px-4 sm:px-8 border-t border-stone-200/80 bg-white/70 backdrop-blur-md">
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
              
              <div class="crystal-3d-card p-5 space-y-2 group hover:border-emerald-600 transition-all">
                <span class="font-mono text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">01</span>
                <h4 class="text-sm font-bold text-stone-900">Project Data Collection</h4>
                <p class="text-[11px] text-stone-600 leading-relaxed">Site plot area, built-up footprint, floors, location coordinates, tree counts, and surface materials.</p>
              </div>

              <div class="crystal-3d-card p-5 space-y-2 group hover:border-emerald-600 transition-all">
                <span class="font-mono text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">02</span>
                <h4 class="text-sm font-bold text-stone-900">Validation & Processing</h4>
                <p class="text-[11px] text-stone-600 leading-relaxed">Geometric boundary validation, NBC coverage check, and automated inter-parameter balance verification.</p>
              </div>

              <div class="crystal-3d-card p-5 space-y-2 group hover:border-emerald-600 transition-all">
                <span class="font-mono text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">03</span>
                <h4 class="text-sm font-bold text-stone-900">Parameter Evaluation</h4>
                <p class="text-[11px] text-stone-600 leading-relaxed">Live API ingestion: Open-Meteo precipitation, solar radiation, AQI, and local climate normals.</p>
              </div>

              <div class="crystal-3d-card p-5 space-y-2 group hover:border-emerald-600 transition-all">
                <span class="font-mono text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">04</span>
                <h4 class="text-sm font-bold text-stone-900">Impact Analysis</h4>
                <p class="text-[11px] text-stone-600 leading-relaxed">Dynamic calculation of runoff coefficient shifts, carbon deficit, water demand, and UHI index.</p>
              </div>

              <div class="crystal-3d-card p-5 space-y-2 group hover:border-emerald-600 transition-all">
                <span class="font-mono text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">05</span>
                <h4 class="text-sm font-bold text-stone-900">Personalized Green Plan</h4>
                <p class="text-[11px] text-stone-600 leading-relaxed">Calculated RWH tank capacity, permeable paving area, green roof sizing, and Miyawaki sapling density.</p>
              </div>

              <div class="crystal-3d-card p-5 space-y-2 group hover:border-emerald-600 transition-all">
                <span class="font-mono text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">06</span>
                <h4 class="text-sm font-bold text-stone-900">Planning EIA Report</h4>
                <p class="text-[11px] text-stone-600 leading-relaxed">Printable academic EIA report with mathematical formulas, before/after comparisons, and sign-off blocks.</p>
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
          <div class="crystal-3d-card p-6 sm:p-8 space-y-8 shadow-xl">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
              <div>
                <span class="text-xs text-stone-500 uppercase font-bold tracking-wider">Select Project Scenario to Test Dynamic Adaptation:</span>
              </div>
              <div class="inline-flex p-1 bg-stone-100/80 rounded-2xl border border-stone-200/80 gap-1.5">
                <button onclick="window.HomeView.switchComparison('A')" id="btn-scenario-a" class="px-4 py-2 rounded-xl text-xs font-bold transition-all crystal-3d-button text-white shadow-sm">
                  Project A: Low-Density Educational Campus
                </button>
                <button onclick="window.HomeView.switchComparison('B')" id="btn-scenario-b" class="px-4 py-2 rounded-xl text-xs font-bold transition-all crystal-3d-pill text-stone-700 hover:text-stone-900">
                  Project B: High-Density Commercial Complex
                </button>
              </div>
            </div>

            <!-- Dynamic Comparison Grid -->
            <div id="scenario-details-grid" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <!-- Left: Inputs -->
              <div class="lg:col-span-5 space-y-4">
                <span id="scenario-badge" class="crystal-gem-badge emerald">
                  Scenario A Conditions
                </span>
                <h3 id="scenario-name" class="text-xl font-black text-stone-900 font-serif">Kolhapur Engineering Campus</h3>
                <p id="scenario-desc" class="text-xs text-stone-600 leading-relaxed">
                  Large 5,000 m² plot with 2,200 m² built footprint, high existing green area (2,400 m²), and 80 existing trees.
                </p>

                <div class="grid grid-cols-2 gap-3 text-xs p-4 rounded-2xl crystal-stat-box">
                  <div>
                    <span class="text-stone-400 text-[10px] font-bold block uppercase tracking-wider">Plot Area</span>
                    <span id="sc-plot" class="font-black text-stone-900 font-mono text-sm">5,000 m²</span>
                  </div>
                  <div>
                    <span class="text-stone-400 text-[10px] font-bold block uppercase tracking-wider">Built Footprint</span>
                    <span id="sc-built" class="font-black text-stone-900 font-mono text-sm">2,200 m²</span>
                  </div>
                  <div>
                    <span class="text-stone-400 text-[10px] font-bold block uppercase tracking-wider">Pre-Dev Green</span>
                    <span id="sc-green" class="font-black text-emerald-700 font-mono text-sm">48% (2,400 m²)</span>
                  </div>
                  <div>
                    <span class="text-stone-400 text-[10px] font-bold block uppercase tracking-wider">Annual Rainfall</span>
                    <span id="sc-rain" class="font-black text-blue-700 font-mono text-sm">1,043 mm</span>
                  </div>
                </div>
              </div>

              <!-- Right: Adaptively Sized Recommendations -->
              <div class="lg:col-span-7 crystal-3d-card p-6 space-y-5 border-emerald-500/30">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-stone-700 uppercase tracking-wider">EcoBuild Dynamically Generated Strategy</span>
                  <span id="sc-score" class="crystal-gem-badge emerald">Score: 86 / 100</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div class="p-4 rounded-xl crystal-stat-box space-y-1">
                    <span class="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Compensatory Planting</span>
                    <div id="sc-trees-rec" class="text-base font-black text-emerald-800">90 Native Trees (3:1)</div>
                    <p id="sc-trees-why" class="text-[11px] text-stone-600 leading-snug">Sufficient open space allows deep-canopy native planting to recover 2,100 m² of canopy within 5 years.</p>
                  </div>

                  <div class="p-4 rounded-xl crystal-stat-box space-y-1">
                    <span class="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Rainwater Harvesting Sump</span>
                    <div id="sc-rwh-rec" class="text-base font-black text-blue-800">70,000 L Cistern</div>
                    <p id="sc-rwh-why" class="text-[11px] text-stone-600 leading-snug">Sizes tank for 45-day dry spell based on 1,043 mm monsoon precipitation and 120 occupants.</p>
                  </div>

                  <div class="p-4 rounded-xl crystal-stat-box space-y-1">
                    <span class="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Permeable Pavement</span>
                    <div id="sc-perm-rec" class="text-base font-black text-stone-800">1,170 m² Porous Pavers</div>
                    <p id="sc-perm-why" class="text-[11px] text-stone-600 leading-snug">Replaces 45% of proposed concrete parking with porous pavers to restore infiltration.</p>
                  </div>

                  <div class="p-4 rounded-xl crystal-stat-box space-y-1">
                    <span class="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Green Roof vs. Solar</span>
                    <div id="sc-roof-rec" class="text-base font-black text-amber-800">770 m² Green / 770 m² Solar</div>
                    <p id="sc-roof-why" class="text-[11px] text-stone-600 leading-snug">Balanced 35/35 roof split provides thermal insulation while generating 128,400 kWh/yr clean solar energy.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 8. GREEN INFRASTRUCTURE INTERACTIVE EXPLORER              -->
        <!-- ========================================================= -->
        <section id="green-infrastructure" class="py-20 px-4 sm:px-8 border-t border-stone-200/80 bg-white/70 backdrop-blur-md">
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
            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              <button onclick="window.HomeView.selectGiFeature('tree')" id="gi-btn-tree" class="p-3 rounded-2xl border text-center transition-all crystal-3d-button text-white border-transparent">
                <span class="text-xl block mb-1">🌳</span>
                <span class="text-[11px] font-bold block leading-tight">Trees</span>
              </button>
              <button onclick="window.HomeView.selectGiFeature('green_roof')" id="gi-btn-green_roof" class="p-3 rounded-2xl border text-center transition-all crystal-3d-pill text-stone-700 hover:text-stone-900">
                <span class="text-xl block mb-1">🌿</span>
                <span class="text-[11px] font-bold block leading-tight">Green Roof</span>
              </button>
              <button onclick="window.HomeView.selectGiFeature('rwh')" id="gi-btn-rwh" class="p-3 rounded-2xl border text-center transition-all crystal-3d-pill text-stone-700 hover:text-stone-900">
                <span class="text-xl block mb-1">💧</span>
                <span class="text-[11px] font-bold block leading-tight">Rainwater</span>
              </button>
              <button onclick="window.HomeView.selectGiFeature('bioswale')" id="gi-btn-bioswale" class="p-3 rounded-2xl border text-center transition-all crystal-3d-pill text-stone-700 hover:text-stone-900">
                <span class="text-xl block mb-1">🌱</span>
                <span class="text-[11px] font-bold block leading-tight">Bioswale</span>
              </button>
              <button onclick="window.HomeView.selectGiFeature('permeable')" id="gi-btn-permeable" class="p-3 rounded-2xl border text-center transition-all crystal-3d-pill text-stone-700 hover:text-stone-900">
                <span class="text-xl block mb-1">🟩</span>
                <span class="text-[11px] font-bold block leading-tight">Permeable</span>
              </button>
              <button onclick="window.HomeView.selectGiFeature('solar')" id="gi-btn-solar" class="p-3 rounded-2xl border text-center transition-all crystal-3d-pill text-stone-700 hover:text-stone-900">
                <span class="text-xl block mb-1">☀️</span>
                <span class="text-[11px] font-bold block leading-tight">Solar PV</span>
              </button>
              <button onclick="window.HomeView.selectGiFeature('waste')" id="gi-btn-waste" class="p-3 rounded-2xl border text-center transition-all crystal-3d-pill text-stone-700 hover:text-stone-900">
                <span class="text-xl block mb-1">♻️</span>
                <span class="text-[11px] font-bold block leading-tight">C&D Waste</span>
              </button>
              <button onclick="window.HomeView.selectGiFeature('water')" id="gi-btn-water" class="p-3 rounded-2xl border text-center transition-all crystal-3d-pill text-stone-700 hover:text-stone-900">
                <span class="text-xl block mb-1">🚰</span>
                <span class="text-[11px] font-bold block leading-tight">Water Reuse</span>
              </button>
            </div>

            <!-- Detailed Explanation Display Box with Dynamic Visual Architecture -->
            <div id="gi-detail-panel" class="crystal-3d-card p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs items-center shadow-lg">
              
              <!-- Image Preview Column -->
              <div class="md:col-span-4 rounded-2xl overflow-hidden relative border border-white/80 shadow-md h-48 md:h-full min-h-[160px] group">
                <img id="gi-image" src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80" alt="GI Intervention" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <span id="gi-tag" class="absolute bottom-3 left-3 text-[10px] font-extrabold text-white bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-md">Field Tested</span>
              </div>

              <!-- Information Columns -->
              <div class="md:col-span-8 space-y-4">
                <div class="space-y-1.5">
                  <span class="crystal-gem-badge emerald">What It Does</span>
                  <h4 id="gi-title" class="text-lg font-black text-stone-900 font-serif">Compensatory Native Tree Afforestation</h4>
                  <p id="gi-what" class="text-stone-600 leading-relaxed text-xs">
                    Plants indigenous multi-tiered canopy species (Neem, Karanj, Arjun) at calibrated replacement ratios to restore lost biomass and evapotranspirative cooling.
                  </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-200/80">
                  <div class="space-y-1">
                    <span class="text-[10px] font-bold uppercase text-emerald-800 tracking-wider block">Why EcoBuild Recommends It</span>
                    <p id="gi-why" class="text-stone-600 leading-relaxed text-[11px]">
                      Removing mature trees creates a biological sequestration deficit. Planting 3 to 5 young trees per removed mature tree compensates for lost annual carbon intake (21.8 kg CO₂/tree/yr).
                    </p>
                  </div>
                  <div class="space-y-1">
                    <span class="text-[10px] font-bold uppercase text-emerald-800 tracking-wider block">Project Condition Driver</span>
                    <div id="gi-driver" class="p-3 crystal-stat-box font-semibold text-stone-800 text-[11px]">
                      Driven by: Trees Removed (30) ÷ Total Site Trees (80) = 37.5% Loss Ratio.
                    </div>
                  </div>
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
            <button onclick="window.App.switchView('dashboard')" class="px-5 py-2.5 rounded-xl text-xs font-bold crystal-3d-button text-white shadow-lg transition self-start md:self-auto flex items-center gap-2">
              <span>Launch Live Dashboard</span>
              <span>→</span>
            </button>
          </div>

          <!-- Realistic Software Mockup Card -->
          <div class="crystal-3d-card border border-stone-300 shadow-2xl overflow-hidden">
            <!-- Mockup Titlebar -->
            <div class="crystal-3d-emerald text-stone-200 px-6 py-3.5 flex items-center justify-between text-xs font-mono">
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-rose-500 shadow-xs"></span>
                  <span class="w-3 h-3 rounded-full bg-amber-500 shadow-xs"></span>
                  <span class="w-3 h-3 rounded-full bg-emerald-400 shadow-xs"></span>
                </div>
                <span class="text-white font-bold">EcoBuild Assessment Suite • Project: Kolhapur Academic Campus</span>
              </div>
              <span class="hidden sm:inline text-emerald-300 font-bold bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-600/60">STATUS: CALIBRATED (200 OK)</span>
            </div>

            <!-- Workspace Mockup Body -->
            <div class="p-6 sm:p-8 space-y-6 bg-stone-50/50">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div class="p-4 rounded-2xl crystal-stat-box space-y-1">
                  <span class="text-stone-400 text-[10px] font-bold block uppercase tracking-wider">Composite Score</span>
                  <span class="text-2xl font-black text-emerald-800 font-mono">86 / 100</span>
                  <span class="text-[10px] text-emerald-700 block font-bold">Tier: Good Performance</span>
                </div>
                <div class="p-4 rounded-2xl crystal-stat-box space-y-1">
                  <span class="text-stone-400 text-[10px] font-bold block uppercase tracking-wider">Runoff Mitigation</span>
                  <span class="text-2xl font-black text-blue-700 font-mono">-28.7%</span>
                  <span class="text-[10px] text-stone-500 block font-medium">Peak Discharge Mitigated</span>
                </div>
                <div class="p-4 rounded-2xl crystal-stat-box space-y-1">
                  <span class="text-stone-400 text-[10px] font-bold block uppercase tracking-wider">Clean Energy</span>
                  <span class="text-2xl font-black text-amber-700 font-mono">88 kWp</span>
                  <span class="text-[10px] text-stone-500 block font-medium">128,400 kWh/yr Offset</span>
                </div>
                <div class="p-4 rounded-2xl crystal-stat-box space-y-1">
                  <span class="text-stone-400 text-[10px] font-bold block uppercase tracking-wider">Biodiversity Gain</span>
                  <span class="text-2xl font-black text-emerald-700 font-mono">+42%</span>
                  <span class="text-[10px] text-stone-500 block font-medium">Above Baseline Units</span>
                </div>
              </div>

              <!-- Action Roadmap Strip -->
              <div class="crystal-3d-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="crystal-gem-badge emerald">Priority Action 1</span>
                    <span class="font-bold text-stone-900">Install 70,000 L Rainwater Harvesting Cistern</span>
                  </div>
                  <p class="text-stone-500 text-[11px]">Offsets 38% of non-potable flushing and grounds maintenance demand.</p>
                </div>
                <button onclick="window.App.switchView('report')" class="px-4 py-2 rounded-xl text-xs font-bold crystal-3d-pill text-stone-800 hover:text-stone-950 transition">
                  View Full EIA Report →
                </button>
              </div>
            </div>
          </div>

        </section>

        <!-- ========================================================= -->
        <!-- 10. TRUST & TRANSPARENCY                                  -->
        <!-- ========================================================= -->
        <section id="transparency" class="py-20 px-4 sm:px-8 border-t border-stone-200/80 bg-white/70 backdrop-blur-md">
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
              
              <div class="crystal-3d-card p-6 space-y-2.5 hover:border-emerald-600 transition-all">
                <div class="flex items-center gap-2">
                  <span class="text-lg">📡</span>
                  <span class="font-black text-stone-900 text-sm">Data Provenance</span>
                </div>
                <p class="text-stone-600 leading-relaxed text-[11px]">
                  Meteorological and atmospheric data are queried in real time from Open-Meteo APIs (WMO standards) and OpenStreetMap Nominatim geocoders.
                </p>
              </div>

              <div class="crystal-3d-card p-6 space-y-2.5 hover:border-emerald-600 transition-all">
                <div class="flex items-center gap-2">
                  <span class="text-lg">📐</span>
                  <span class="font-black text-stone-900 text-sm">Hydrological Equations</span>
                </div>
                <p class="text-stone-600 leading-relaxed text-[11px]">
                  Stormwater runoff is calculated via the Rational Method ($Q = CIA$) adhering to US EPA, IRC:SP:13, and CPHEEO drainage manuals.
                </p>
              </div>

              <div class="crystal-3d-card p-6 space-y-2.5 hover:border-emerald-600 transition-all">
                <div class="flex items-center gap-2">
                  <span class="text-lg">🏛️</span>
                  <span class="font-black text-stone-900 text-sm">Regulatory Standards</span>
                </div>
                <p class="text-stone-600 leading-relaxed text-[11px]">
                  Topsoil preservation follows NBC 2016 Part 11; C&D waste factors adhere to TIFAC & CPCB 2016 empirical norms.
                </p>
              </div>

              <div class="crystal-3d-card p-6 space-y-2.5 hover:border-emerald-600 transition-all">
                <div class="flex items-center gap-2">
                  <span class="text-lg">⚡</span>
                  <span class="font-black text-stone-900 text-sm">Grid Emissions Factors</span>
                </div>
                <p class="text-stone-600 leading-relaxed text-[11px]">
                  Clean energy carbon offsets utilize Central Electricity Authority (CEA) India baseline factor of 0.82 kg CO₂e / kWh.
                </p>
              </div>

              <div class="crystal-3d-card p-6 space-y-2.5 hover:border-emerald-600 transition-all">
                <div class="flex items-center gap-2">
                  <span class="text-lg">🏷️</span>
                  <span class="font-black text-stone-900 text-sm">Confidence Labeling</span>
                </div>
                <p class="text-stone-600 leading-relaxed text-[11px]">
                  Every indicator is labeled by confidence level: Live Measured API, Calibrated Regional Normal, Empirical Estimate, or User Supplied.
                </p>
              </div>

              <div class="crystal-3d-card p-6 space-y-2.5 hover:border-emerald-600 transition-all">
                <div class="flex items-center gap-2">
                  <span class="text-lg">🔬</span>
                  <span class="font-black text-stone-900 text-sm">Scope Limitations</span>
                </div>
                <p class="text-stone-600 leading-relaxed text-[11px]">
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
            <div class="crystal-3d-card p-6 space-y-2.5 hover:border-emerald-600 transition-all">
              <span class="text-2xl block">🎓</span>
              <h4 class="font-black text-stone-900 text-sm">Students & Educators</h4>
              <p class="text-stone-600 leading-relaxed text-[11px]">Environmental science and computer engineering academic projects, capstones, and coursework simulations.</p>
            </div>
            <div class="crystal-3d-card p-6 space-y-2.5 hover:border-emerald-600 transition-all">
              <span class="text-2xl block">📐</span>
              <h4 class="font-black text-stone-900 text-sm">Architects & Planners</h4>
              <p class="text-stone-600 leading-relaxed text-[11px]">Early-stage massing evaluation, green roof allocations, and sustainable site masterplanning.</p>
            </div>
            <div class="crystal-3d-card p-6 space-y-2.5 hover:border-emerald-600 transition-all">
              <span class="text-2xl block">🏡</span>
              <h4 class="font-black text-stone-900 text-sm">Homeowners & Builders</h4>
              <p class="text-stone-600 leading-relaxed text-[11px]">Sizing rainwater harvesting storage tanks, permeable paving driveways, and rooftop solar arrays.</p>
            </div>
            <div class="crystal-3d-card p-6 space-y-2.5 hover:border-emerald-600 transition-all">
              <span class="text-2xl block">🏗️</span>
              <h4 class="font-black text-stone-900 text-sm">Developers & Contractors</h4>
              <p class="text-stone-600 leading-relaxed text-[11px]">C&D waste diversion forecasting, topsoil preservation plans, and CPCB dust compliance protocols.</p>
            </div>
            <div class="crystal-3d-card p-6 space-y-2.5 hover:border-emerald-600 transition-all">
              <span class="text-2xl block">🏛️</span>
              <h4 class="font-black text-stone-900 text-sm">Institutions & Campuses</h4>
              <p class="text-stone-600 leading-relaxed text-[11px]">University and hospital campus sustainability benchmarks and Sponge City bioretention planning.</p>
            </div>
            <div class="crystal-3d-card p-6 space-y-2.5 hover:border-emerald-600 transition-all">
              <span class="text-2xl block">🔬</span>
              <h4 class="font-black text-stone-900 text-sm">Researchers & Analysts</h4>
              <p class="text-stone-600 leading-relaxed text-[11px]">Comparative scenario analysis exploring climate resilience under varying precipitation patterns.</p>
            </div>
          </div>

        </section>

        <!-- ========================================================= -->
        <!-- 12. GET THE APP SECTION                                   -->
        <!-- ========================================================= -->
        <section id="get-the-app" class="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
          <div class="crystal-3d-emerald rounded-3xl p-8 sm:p-14 text-white overflow-hidden shadow-2xl relative">
            
            <div class="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <!-- Section header -->
            <div class="text-center mb-14 relative z-10">
              <span class="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-900/80 text-emerald-300 border border-emerald-500/50 inline-block mb-4 shadow-sm">
                Install EcoBuild Anywhere
              </span>
              <h2 class="text-3xl sm:text-4xl font-black tracking-tight font-serif text-white">
                Take it with you. On any device.
              </h2>
              <p class="mt-4 text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
                EcoBuild installs as a native-feeling app on Windows, Android, and iPhone. No app store. No internet required after first load.
              </p>
            </div>

            <!-- Three-column install grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">

              <!-- PC Install -->
              <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 space-y-4 hover:bg-white/15 transition shadow-lg">
                <div class="w-12 h-12 rounded-xl bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-sm">💻</div>
                <div>
                  <h3 class="font-black text-white text-base mb-1">Windows PC</h3>
                  <p class="text-xs text-stone-300 leading-relaxed">Open in Chrome or Edge. Click the install icon in the address bar. Or launch via the <code class="bg-black/30 px-1.5 py-0.5 rounded text-emerald-300 font-mono">EcoBuildSmart.bat</code> shortcut on your Desktop.</p>
                </div>
                <div class="pt-2 border-t border-white/10">
                  <div class="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-2">PC URL</div>
                  <code id="homepage-pc-url" class="text-xs text-emerald-300 bg-black/40 px-3 py-2 rounded-xl block font-mono border border-white/10">http://localhost:8000</code>
                </div>
              </div>

              <!-- Android QR -->
              <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 space-y-4 hover:bg-white/15 transition shadow-lg">
                <div class="w-12 h-12 rounded-xl bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-sm">🤖</div>
                <div>
                  <h3 class="font-black text-white text-base mb-1">Android Phone</h3>
                  <p class="text-xs text-stone-300 leading-relaxed">Scan the QR below with your camera app. Opens directly in Chrome. Tap "Add to Home Screen" when prompted.</p>
                </div>
                <div class="flex items-center gap-3">
                  <div id="homepage-qr-container" class="bg-white rounded-xl p-1.5 flex-shrink-0 shadow-md">
                    <img id="homepage-qr-img" src="" alt="QR" width="80" height="80" style="display:block;border-radius:6px"
                         onerror="if(this&&this.parentElement){this.removeAttribute('onerror');this.parentElement.innerHTML='<div style=\\'width:80px;height:80px;display:flex;align-items:center;justify-content:center;background:#f8fafc;border-radius:8px;font-size:24px\\'>📡</div>';}">
                  </div>
                  <div class="text-xs text-stone-300 leading-relaxed font-medium">Same WiFi as this PC required.<br><span class="text-emerald-300 font-bold">Works 100% offline</span> once installed.</div>
                </div>
              </div>

              <!-- iPhone -->
              <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 space-y-4 hover:bg-white/15 transition shadow-lg">
                <div class="w-12 h-12 rounded-xl bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-sm">🍎</div>
                <div>
                  <h3 class="font-black text-white text-base mb-1">iPhone / iPad</h3>
                  <p class="text-xs text-stone-300 leading-relaxed">Open the LAN URL in Safari. Tap the Share button (📤) → "Add to Home Screen". The app opens full-screen like a native app.</p>
                </div>
                <div class="pt-2 border-t border-white/10 space-y-2">
                  <div class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Network URL</div>
                  <div id="homepage-lan-url" class="text-xs text-emerald-300 bg-black/40 px-3 py-2 rounded-xl font-mono truncate border border-white/10">Loading…</div>
                </div>
              </div>

            </div>

            <!-- Bottom CTA row -->
            <div class="text-center relative z-10">
              <button onclick="window.InstallModal && window.InstallModal.show()" class="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-[#071814] shadow-xl shadow-black/40 transition group cursor-pointer">
                <span class="text-xl">📲</span>
                <div class="text-left">
                  <div class="leading-none font-extrabold">Open Full Install Guide</div>
                  <div class="text-[10px] font-semibold text-emerald-950 mt-1 leading-none">QR code · Network URL · Step-by-step instructions</div>
                </div>
                <span class="transition-transform group-hover:translate-x-1 font-bold">→</span>
              </button>
              <p class="mt-4 text-xs text-stone-300">Zero registration. No account required. Works 100% offline after first load.</p>
            </div>

          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 13. CALL TO ACTION (CTA)                                  -->
        <!-- ========================================================= -->
        <section class="py-24 px-4 sm:px-8 crystal-3d-emerald text-white relative overflow-hidden">
          <div class="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            <span class="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-900/90 text-emerald-300 border border-emerald-500/50 inline-block shadow-sm">
              Start Planning Today
            </span>
            <h2 class="text-3xl sm:text-5xl font-black tracking-tight font-serif">
              Build with environmental intelligence.
            </h2>
            <p class="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Start with your project conditions and explore the sustainability strategies that fit your site. No complex software installation required.
            </p>
            <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onclick="window.App.switchView('wizard')" class="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-black bg-white text-[#123C32] hover:bg-stone-100 shadow-xl transition cursor-pointer">
                Start Environmental Assessment →
              </button>
              <button onclick="window.InstallModal && window.InstallModal.show()" class="w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-bold bg-emerald-700/60 hover:bg-emerald-700 text-emerald-100 border border-emerald-500/60 transition flex items-center justify-center gap-2 cursor-pointer">
                <span>📲</span> Install as App
              </button>
              <button onclick="window.App.switchView('methodology')" class="w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-bold bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 border border-emerald-700/60 transition cursor-pointer">
                Explore Full Methodology
              </button>
            </div>
          </div>
        </section>

        <!-- ========================================================= -->
        <!-- 14. REFINED FOOTER WITH CREATOR ATTRIBUTION               -->
        <!-- ========================================================= -->
        <footer class="bg-[#071814] text-stone-400 py-16 px-4 sm:px-8 border-t border-stone-800 text-xs">
          <div class="max-w-7xl mx-auto space-y-12">
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
              <!-- Col 1: Brand -->
              <div class="space-y-3 md:col-span-1">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B241E] to-[#04100D] border border-emerald-500/50 flex items-center justify-center shadow-lg shadow-emerald-950/40 relative overflow-hidden">
                    <svg width="22" height="22" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="24,4 38,15 24,20 10,15" fill="#34D399" stroke="#ECFDF5" stroke-width="0.8" stroke-linejoin="round"/>
                      <polygon points="10,15 24,20 24,36 10,31" fill="#047857" stroke="#34D399" stroke-width="0.6" stroke-linejoin="round"/>
                      <polygon points="38,15 24,20 24,36 38,31" fill="#064E3B" stroke="#10B981" stroke-width="0.6" stroke-linejoin="round"/>
                      <polygon points="10,31 24,36 38,31 24,44" fill="#022C22" stroke="#064E3B" stroke-width="0.6" stroke-linejoin="round"/>
                      <path d="M24 12 V38 M18 24 L24 18 L30 24" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <span class="font-black text-white text-base font-serif">EcoBuild</span>
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
                  <li><a href="javascript:void(0)" onclick="window.App.switchView('site3d')" class="hover:text-emerald-400">3D Environmental Twin</a></li>
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
              <div class="font-semibold text-stone-300 flex items-center gap-1.5 bg-stone-900/80 px-3 py-1.5 rounded-xl border border-stone-800">
                <span>Designed & Created by</span>
                <strong class="text-emerald-400 font-bold">Avishkar Shinde</strong>
              </div>
            </div>

          </div>
        </footer>

        <!-- ========================================================= -->
        <!-- 2.6 COMPREHENSIVE 13-STEP FIRST-TIME WALKTHROUGH MODAL   -->
        <!-- ========================================================= -->
        <div id="ecobuild-walkthrough-modal" class="hidden fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-stone-200 overflow-hidden flex flex-col font-sans">
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-[#071A13] via-[#0D261C] to-[#071A13] text-white p-5 sm:px-8 flex items-center justify-between border-b border-emerald-900/80">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-300 font-bold text-sm shadow">
                  📖
                </div>
                <div>
                  <span class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">EcoBuild Master Engineering Guide</span>
                  <h3 class="text-base sm:text-lg font-bold font-serif text-white">How to Use EcoBuild — 13-Step Interactive Walkthrough</h3>
                </div>
              </div>
              <button onclick="window.HomeView.closeWalkthroughModal()" class="text-stone-400 hover:text-white text-2xl font-bold leading-none p-1.5 rounded-lg hover:bg-stone-800 transition">
                &times;
              </button>
            </div>

            <!-- Modal Body: Two-Column Step Browser -->
            <div class="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[380px]">
              
              <!-- Left: Step Index Sidebar (Scrollable) -->
              <div class="md:col-span-4 bg-stone-50 border-r border-stone-200 overflow-y-auto p-3 space-y-1">
                <div class="px-2 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Walkthrough Steps</div>
                <div id="walkthrough-nav-list" class="space-y-1">
                  <!-- Dynamically rendered by HomeView.updateWalkthroughUI -->
                </div>
              </div>

              <!-- Right: Active Step Deep Dive (Scrollable) -->
              <div class="md:col-span-8 p-6 sm:p-8 overflow-y-auto space-y-5 bg-white text-stone-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span id="wt-step-badge" class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
                      STEP 1 OF 13
                    </span>
                    <span id="wt-step-category" class="text-xs font-semibold text-stone-500">Project Setup</span>
                  </div>
                  <span id="wt-step-context" class="text-[11px] font-bold text-emerald-700 font-mono">Screen: Wizard & Dashboard</span>
                </div>

                <h3 id="wt-step-title" class="text-xl font-black text-stone-900 font-serif leading-snug">
                  Create an Assessment Project
                </h3>

                <div id="wt-step-content" class="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-3">
                  <!-- Injected by HomeView.updateWalkthroughUI -->
                </div>

                <div id="wt-step-box" class="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5 text-xs text-emerald-950">
                  <!-- Injected callout/tips -->
                </div>
              </div>

            </div>

            <!-- Modal Footer: Navigation Controls -->
            <div class="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between gap-3">
              <button onclick="window.HomeView.prevWalkthroughStep()" id="wt-prev-btn" class="px-4 py-2 rounded-xl text-xs font-bold bg-stone-200 hover:bg-stone-300 text-stone-800 transition disabled:opacity-40">
                &larr; Previous Step
              </button>

              <div class="flex items-center gap-2">
                <button onclick="window.HomeView.closeWalkthroughModal(); window.App.switchView('wizard')" class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 shadow-sm">
                  <span>🚀 Open Assessment Wizard</span>
                </button>
                <button onclick="window.HomeView.nextWalkthroughStep()" id="wt-next-btn" class="px-4 py-2 rounded-xl text-xs font-bold bg-[#123C32] hover:bg-[#185E42] text-white transition">
                  Next Step &rarr;
                </button>
              </div>
            </div>

          </div>
        </div>

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
      if (btnA) btnA.className = "px-4 py-2 rounded-xl text-xs font-bold transition-all crystal-3d-button text-white shadow-sm";
      if (btnB) btnB.className = "px-4 py-2 rounded-xl text-xs font-bold transition-all crystal-3d-pill text-stone-700 hover:text-stone-900";
      if (badge) {
        badge.innerText = "Scenario A Conditions";
        badge.className = "crystal-gem-badge emerald";
      }
      if (name) name.innerText = "Kolhapur Engineering Campus (Low Density)";
      if (desc) desc.innerText = "Large 5,000 m² plot with 2,200 m² built footprint, high existing green area (2,400 m²), and 80 existing trees.";
      if (plot) plot.innerText = "5,000 m²";
      if (built) built.innerText = "2,200 m²";
      if (green) green.innerText = "48% (2,400 m²)";
      if (rain) rain.innerText = "1,043 mm";
      if (score) score.innerText = "Score: 86 / 100";
      if (treesRec) treesRec.innerText = "90 Native Trees (3:1)";
      if (treesWhy) treesWhy.innerText = "Sufficient open space allows deep-canopy native planting to recover 2,100 m² of canopy within 5 years.";
      if (rwhRec) rwhRec.innerText = "70,000 L Cistern";
      if (rwhWhy) rwhWhy.innerText = "Sizes tank for 45-day dry spell based on 1,043 mm monsoon precipitation and 120 occupants.";
      if (permRec) permRec.innerText = "1,170 m² Porous Pavers";
      if (permWhy) permWhy.innerText = "Replaces 45% of proposed concrete parking with porous pavers to restore natural infiltration.";
      if (roofRec) roofRec.innerText = "770 m² Green / 770 m² Solar";
      if (roofWhy) roofWhy.innerText = "Balanced 35/35 roof split provides thermal insulation while generating 128,400 kWh/yr clean solar energy.";
    } else {
      if (btnB) btnB.className = "px-4 py-2 rounded-xl text-xs font-bold transition-all crystal-3d-button text-white shadow-sm";
      if (btnA) btnA.className = "px-4 py-2 rounded-xl text-xs font-bold transition-all crystal-3d-pill text-stone-700 hover:text-stone-900";
      if (badge) {
        badge.innerText = "Scenario B Conditions";
        badge.className = "crystal-gem-badge amber";
      }
      if (name) name.innerText = "Mumbai Urban Commercial Hub (High Density)";
      if (desc) desc.innerText = "Compact 2,800 m² plot with 2,100 m² footprint (75% coverage), low baseline green (15%), and 450 office occupants.";
      if (plot) plot.innerText = "2,800 m²";
      if (built) built.innerText = "2,100 m² (4 Floors)";
      if (green) green.innerText = "15% (420 m²)";
      if (rain) rain.innerText = "2,213 mm";
      if (score) score.innerText = "Score: 78 / 100";
      if (treesRec) treesRec.innerText = "45 Miyawaki Saplings + Living Wall";
      if (treesWhy) treesWhy.innerText = "Limited open ground triggers Akira Miyawaki ultra-dense afforestation (3.5/m²) plus vertical facade living walls.";
      if (rwhRec) rwhRec.innerText = "180,000 L High-Capacity Sump";
      if (rwhWhy) rwhWhy.innerText = "Exploits high Mumbai monsoon volume (2,213 mm) to meet 450 occupants daily non-potable flushing requirements.";
      if (permRec) permRec.innerText = "520 m² Permeable Pavement";
      if (permWhy) permWhy.innerText = "100% of non-built driveway and service bay is converted to porous pavers to eliminate flash flood risk.";
      if (roofRec) roofRec.innerText = "1,260 m² Extensive Bio-Solar Roof";
      if (roofWhy) roofWhy.innerText = "60% green roof combined with elevated solar panels: vegetation cools panels by 3.2°C, adding +5.4% solar yield.";
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
        b.className = "p-3 rounded-2xl border text-center transition-all crystal-3d-button text-white border-transparent shadow-sm";
      } else {
        b.className = "p-3 rounded-2xl border text-center transition-all crystal-3d-pill text-stone-700 hover:text-stone-900";
      }
    });

    const title = document.getElementById("gi-title");
    const what = document.getElementById("gi-what");
    const why = document.getElementById("gi-why");
    const driver = document.getElementById("gi-driver");
    const imageEl = document.getElementById("gi-image");
    const tagEl = document.getElementById("gi-tag");

    const data = {
      tree: {
        title: "Compensatory Native Tree Afforestation",
        what: "Plants indigenous multi-tiered canopy species (Neem, Karanj, Arjun) at calibrated replacement ratios to restore lost biomass.",
        why: "Compensates for lost annual carbon intake (21.8 kg CO₂/tree/yr) and restores canopy microclimate shade.",
        driver: "Driven by: Trees Removed (30) ÷ Total Site Trees (80) = 37.5% Loss Ratio (3:1 statutory ratio).",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
        tag: "3:1 Statutory Norm"
      },
      green_roof: {
        title: "Extensive Sedum Vegetative Terrace",
        what: "100-150mm lightweight substrate with drought-tolerant sedums and indigenous groundcover grasses.",
        why: "Retains 65% of peak storm precipitation, cools terrace by 2.8°C, and buffers building HVAC energy demand.",
        driver: "Driven by: RCC Flat Roof Area (2,200 m²) with structural load capacity ≥ 150 kg/m².",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        tag: "Sedum Vegetative"
      },
      rwh: {
        title: "Harvested Rainwater Filtration & Storage",
        what: "Rooftop first-flush diversion, dual-media sand filtration, and dedicated underground storage cistern.",
        why: "Harvests monsoon runoff to offset non-potable flushing and landscape irrigation, easing municipal water strain.",
        driver: "Driven by: Local Annual Rainfall (1,043 mm) × Roof Catchment (2,200 m²) × Occupancy Demand.",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80",
        tag: "Cistern Filtration"
      },
      bioswale: {
        title: "Engineered Sponge City Bioretention Swale",
        what: "Gently sloped vegetated depression with engineered soil filter media (450mm) and aggregate retention sump.",
        why: "Filters 85% of total suspended solids (TSS) and heavy metals from driveway runoff before natural infiltration.",
        driver: "Driven by: Impervious Parking Area (2,600 m²) requiring first 25mm storm event retention.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
        tag: "Sponge City Swale"
      },
      permeable: {
        title: "Porous Interlocking Concrete Pavement",
        what: "Interlocking concrete pavers with permeable aggregate void joints laid over an open-graded stone sub-base.",
        why: "Eliminates surface ponding, restores natural groundwater recharge, and reduces site runoff coefficient from 0.90 to 0.25.",
        driver: "Driven by: Total Hardscape Concrete Paved Area (2,600 m²) needing infiltration relief.",
        image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80",
        tag: "Porous Interlocking"
      },
      solar: {
        title: "Rooftop Monocrystalline Solar PV Array",
        what: "High-efficiency 180 Wp/m² photovoltaic panels angled 25° South on anodized aluminum racking.",
        why: "Displaces coal-dominated grid electricity, avoiding 0.82 kg CO₂e per kWh under CEA India emission baselines.",
        driver: "Driven by: Rooftop Area (2,200 m²), South solar orientation, and annual solar irradiance (5.3 kWh/m²/day).",
        image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80",
        tag: "CEA Grid Offset"
      },
      waste: {
        title: "Circular C&D Debris Recycling Protocol",
        what: "On-site segregation and mobile crushing of concrete and brick rubble into graded aggregate.",
        why: "Diverts 65% of construction debris from landfills, utilizing crushed aggregate for pervious parking sub-base.",
        driver: "Driven by: Gross Floor Area (4,400 m²) × TIFAC Benchmark (60 kg/m²) = 264 Tonnes C&D waste.",
        image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
        tag: "68% C&D Recycled"
      },
      water: {
        title: "Dual Plumbing & Water Conservation Loop",
        what: "Low-flow fixtures (dual flush, aerators) combined with treated greywater reuse for toilet flushing.",
        why: "Reduces net municipal freshwater consumption from 135 LPCD down to sustainable 70 LPCD operational levels.",
        driver: "Driven by: NBC Occupancy Load (120 occupants) and local aquifer depth indicator.",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
        tag: "Dual-Loop Plumbing"
      }
    };

    const sel = data[featureKey] || data.tree;
    if (title) title.innerText = sel.title;
    if (what) what.innerText = sel.what;
    if (why) why.innerText = sel.why;
    if (driver) driver.innerText = sel.driver;
    if (imageEl && sel.image) imageEl.src = sel.image;
    if (tagEl && sel.tag) tagEl.innerText = sel.tag;
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
    const b = document.getElementById("hotspot-badge");
    const t = document.getElementById("hotspot-title");
    const d = document.getElementById("hotspot-desc");
    if (b) b.innerText = cur.badge;
    if (t) t.innerText = cur.title;
    if (d) d.innerText = cur.desc;
  },

  // =========================================================================
  // 13-STEP FIRST-TIME DETAILED WALKTHROUGH CONTROLLER
  // =========================================================================
  walkthroughStep: 1,

  walkthroughStepsData: [
    {
      step: 1,
      category: "Project Setup",
      context: "Screen: Wizard Step 1 & Switcher",
      title: "Create an Assessment Project",
      content: `<p>To start, click <strong>"Start New Assessment"</strong> in the top navigation bar or the homepage action bar. A project represents a specific spatial site with an intended development program.</p>
      <p>Select your project name, intended building typology (<em>Residential, Commercial, Institutional, Industrial, or Mixed</em>), and user mode (<em>Standard</em> for guided estimation or <em>Advanced</em> for engineering override parameters).</p>
      <p>Draft assessments can be saved at any point into local browser memory and the integrated SQLite database (<code>ecobuild.db</code>). When exploring features without real site data, switch to the pre-filled <strong>Kolhapur Campus Demo</strong>.</p>`,
      tip: `<strong>💡 Pro Tip:</strong> Typology determines default occupancy density and water benchmark standards (e.g., 135 LPCD for Residential vs. 45 LPCD for Commercial offices under CPHEEO).`
    },
    {
      step: 2,
      category: "Geospatial Locator",
      context: "Screen: Wizard Step 2",
      title: "Set Location & Coordinates",
      content: `<p>Enter a city or address in the geocoding search box or click anywhere on the interactive OpenStreetMap locator. You can also manually input precise latitude and longitude coordinates.</p>
      <p>Setting coordinates links your site to regional climate baselines: long-term rainfall precipitation (mm), solar global horizontal irradiance (kWh/m²/day), and ambient temperature curves.</p>
      <p>If network services are temporarily unavailable or operating offline, EcoBuild automatically falls back to verified regional meteorological tables (e.g., IMD / NASA POWER climatological normals) without manufacturing fake numbers.</p>`,
      tip: `<strong>⚠️ Environmental Integrity:</strong> Climatological averages are regional estimates. EcoBuild clearly distinguishes live station feeds from regional reanalysis.`
    },
    {
      step: 3,
      category: "Spatial Cadastre",
      context: "Screen: Wizard Step 3 & 3D Twin",
      title: "Define the Site Dimensions & Geometry",
      content: `<p>Carefully input your site's physical dimensions. The application strictly distinguishes between independent spatial categories that must never be added together indiscriminately:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li><strong>Total Plot Area (m²):</strong> Total cadastral land boundary.</li>
        <li><strong>Building Footprint (m²):</strong> Ground-level area occupied by building foundations.</li>
        <li><strong>Gross Floor Area (m²):</strong> Total built floor area across all vertical storeys.</li>
        <li><strong>Usable Roof Area (m²):</strong> Usable structural rooftop envelope available for PV or sedum green roofs.</li>
        <li><strong>Open Ground Area (m²):</strong> Remaining land calculated as <code>Plot Area - Building Footprint</code>.</li>
      </ul>
      <p>The system enforces geometric feasibility: building footprint cannot exceed plot area, and external hardscapes cannot exceed available open ground.</p>`,
      tip: `<strong>📐 Area Conservation:</strong> In irregular or non-rectangular plots without CAD geometry, dimensions are verified by area totals before calculation.`
    },
    {
      step: 4,
      category: "Baseline Evidence",
      context: "Screen: Wizard Step 4",
      title: "Record Existing Environmental Baseline",
      content: `<p>Describe the site's condition prior to new construction: existing mature trees, shrub area, natural pervious soil, and USDA NRCS Soil Hydrologic Group (A, B, C, or D).</p>
      <p><strong>Crucial Distinction between Zero and Unknown:</strong></p>
      <ul class="list-disc pl-5 space-y-1">
        <li><code>0 trees removed</code>: The user explicitly declares that zero trees will be felled (statutory planting obligation = 0).</li>
        <li><code>Unknown tree loss</code>: Left blank or unmeasured. The baseline is labeled <em>incomplete/provisional</em>, and no false benefits are claimed.</li>
      </ul>
      <p>Never invent baseline surfaces. If historical green cover is unrecorded, EcoBuild transparently labels the pre-development comparison as provisional.</p>`,
      tip: `<strong>🌱 Soil Physics:</strong> Soil Group A (sand/gravel) infiltrates rapidly (>30 mm/hr). Soil Group D (black cotton clay) percolates very slowly (<5 mm/hr) and requires underdrainage.`
    },
    {
      step: 5,
      category: "Development Proposal",
      context: "Screen: Wizard Steps 5 & 7",
      title: "Enter the Development Proposal & Materials",
      content: `<p>Input proposed construction parameters: concrete paving, asphalt driveway area, interlocking tiles, construction materials (concrete volume m³, structural steel tonnes), and anticipated utility demands.</p>
      <p>For construction & demolition (C&D) waste, EcoBuild calculates benchmark waste generation ($50-65\\text{ kg/m}^2$ GFA) based on official <strong>TIFAC & CPCB 2016</strong> research, breaking waste into 7 circular material streams.</p>
      <p>Entering real material quantities significantly improves embodied carbon accuracy compared to rough floor-area rule-of-thumb approximations.</p>`,
      tip: `<strong>🧱 Low-Carbon Strategy:</strong> Specifying 40% GGBS / fly ash blended concrete in your proposal saves up to 140 kg CO₂e per cubic meter.`
    },
    {
      step: 6,
      category: "Climate Integration",
      context: "Screen: Wizard Step 8 & Technical",
      title: "Retrieve & Review Environmental Data",
      content: `<p>In Step 8 of the wizard, EcoBuild queries Open-Meteo meteorological reanalysis APIs using site coordinates to fetch:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Annual Rainfall Precipitation Depth (mm)</li>
        <li>Peak Storm Design Intensity ($I = 35\\text{ mm/hr}$ default return storm)</li>
        <li>Annual Solar Irradiance (GHI $\\sim 5.3\\text{ kWh/m}^2/\\text{day}$)</li>
        <li>Regional Air Quality (PM2.5, PM10, AQI index)</li>
      </ul>
      <p>Every external dataset includes source attribution, retrieval date, and units. If an external API is down, cached or offline fallback data are clearly tagged as estimates.</p>`,
      tip: `<strong>🔍 Traceability:</strong> Weather-grid reanalysis reflects regional climate, not an on-site physical meteorological mast.`
    },
    {
      step: 7,
      category: "Validation Layer",
      context: "Screen: Wizard Pre-Check",
      title: "Validate the Project Inputs",
      content: `<p>Before calculation begins, the <code>ValidationEngine</code> validates all inputs to prevent physical impossibilities or numerical corruption:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Rejects negative numbers, non-finite values, and malformed strings.</li>
        <li>Ensures building footprint $\\le$ plot area.</li>
        <li>Checks that rooftop green roof + solar PV does not exceed roof envelope (unless bio-solar co-location is enabled).</li>
        <li>Checks that tree removal count does not exceed recorded existing trees.</li>
        <li>Prevents overlapping ground interventions from exceeding open ground.</li>
      </ul>
      <p>Actionable error messages appear directly adjacent to invalid fields, explaining exactly what is wrong and how to correct it.</p>`,
      tip: `<strong>🛡️ Zero Protection:</strong> Genuine zero values (0 trees, 0 recycling, 0 solar) are strictly preserved and never mutated into defaults.`
    },
    {
      step: 8,
      category: "Calculation Engine",
      context: "Screen: Dynamic Dashboard",
      title: "Generate the Environmental Assessment",
      content: `<p>Click <strong>"Run Assessment"</strong> to execute the full scientific calculation pipeline. EcoBuild computes three comparable, dimensionally verified scenarios:</p>
      <ol class="list-decimal pl-5 space-y-1">
        <li><strong>Existing Baseline:</strong> Pre-development site condition based on user declarations.</li>
        <li><strong>Proposed Development:</strong> The unmitigated impact of the new building and hardscape.</li>
        <li><strong>Mitigated Condition:</strong> The post-intervention state after implementing green infrastructure.</li>
      </ol>
      <p>Calculations adhere to verified dimensional formulas: Rational Method $Q = \\frac{C \\cdot I \\cdot A}{1000}$ for stormwater runoff, 365-day mass-balance for RWH, and CEA v19 grid emission factors for solar carbon offsets.</p>`,
      tip: `<strong>⚡ Instant Recalculation:</strong> Changing any design parameter instantly updates all dependent carbon, energy, water, and runoff indicators.`
    },
    {
      step: 9,
      category: "Interpreting Results",
      context: "Screen: Dashboard & Domains",
      title: "Understand the Environmental Results",
      content: `<p>EcoBuild separates results into three distinct, transparent dimensions:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li><strong>Performance Score (0–100):</strong> Design quality rating across 7 weighted environmental domains.</li>
        <li><strong>Data Confidence Rating:</strong> Quality and provenance of inputs (verified survey vs. regional screening). High confidence does not imply good environmental performance.</li>
        <li><strong>Statutory Clearance Status:</strong> Derived strictly from statutory bylaws, independent of internal scores.</li>
      </ul>
      <p>Review the 8 core indicators with clear sign conventions: higher green cover and solar kWh are positive gains; higher peak runoff surge and embodied carbon are deficits requiring mitigation.</p>`,
      tip: `<strong>ℹ️ Explainability Inspector:</strong> Click the "ℹ️ Explain" button on any KPI card to inspect the underlying formula, variable inputs, and scientific assumptions.`
    },
    {
      step: 10,
      category: "Recovery Optimizer",
      context: "Screen: Recovery Studio",
      title: "Compare and Choose a Recovery Plan",
      content: `<p>The <code>OptimizerEngine</code> generates three site-constrained Pareto recovery packages:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li><strong>Scenario 1: Essential Recovery:</strong> Low-cost baseline compliance (compensatory planting, basic stormwater delay, first-flush RWH filter).</li>
        <li><strong>Scenario 2: Balanced Recovery:</strong> Optimal trade-off between stormwater reduction, solar generation, Miyawaki micro-forest, and capital investment.</li>
        <li><strong>Scenario 3: Maximum Feasible Benefit:</strong> Bio-solar roof integration, maximum permeable paving, and advanced tertiary wastewater reuse.</li>
      </ul>
      <p>Intervention allocations are strictly clamped to physical site geometry. If open ground is zero, the optimizer allocates zero ground trees and redirects greening to the rooftop.</p>`,
      tip: `<strong>💰 Sourced Rates:</strong> Capital costs and annual maintenance budgets are based on official <strong>CPWD Delhi Schedule of Rates (DSR) 2023–24</strong>.`
    },
    {
      step: 11,
      category: "EIA Reporting",
      context: "Screen: Official EIA Report",
      title: "Review the EIA and Statutory Screening",
      content: `<p>Inspect the comprehensive 13-section academic Environmental Impact Assessment (EIA) dossier.</p>
      <p>The report includes statutory screening against the <strong>MoEFCC EIA Notification 2006 Schedule 8</strong> based on Gross Floor Area (GFA):</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>$\\text{GFA} < 20,000\\text{ m}^2$: Exempt from formal SEIAA Prior EC (appraised via Local Authority / SPCB).</li>
        <li>$20,000 \\le \\text{GFA} < 1,50,000\\text{ m}^2$: Category B2 appraisal via State SEIAA / SEAC.</li>
        <li>$\\text{GFA} \\ge 1,50,000\\text{ m}^2$: Category A appraisal via Central MoEFCC EAC.</li>
      </ul>
      <p>EcoBuild reports are academic screening tools and do not substitute for formal statutory environmental clearance submissions via the government PARIVESH portal.</p>`,
      tip: `<strong>📄 Transparent Standards:</strong> Fabricated file IDs or fictional auditor accreditations are strictly prohibited in EcoBuild reports.`
    },
    {
      step: 12,
      category: "Persistence & Export",
      context: "Screen: Plan History & Report",
      title: "Save, Compare, and Export Assessments",
      content: `<p>Save named project snapshots (e.g., <em>"Design Option B - 60% Solar + Miyawaki"</em>) into persistent storage. Saved projects survive browser restarts and offline usage.</p>
      <p>Use the <strong>Scenario Comparison Studio</strong> to select any two saved assessments and evaluate indicator variance side-by-side with color-coded differential ($\Delta$) metrics.</p>
      <p>Export options include:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li><strong>Printable EIA Dossier:</strong> Formatted for A4 portrait with proper page-breaks.</li>
        <li><strong>CAD Blueprint (DXF):</strong> 5-layer engineering vector export of site geometry.</li>
        <li><strong>JSON Data Package:</strong> Raw canonical project and assessment schema export.</li>
      </ul>`,
      tip: `<strong>💾 Automatic Sync:</strong> Edits to site parameters flag dependent reports as stale until recalculated, preventing contradictory numbers.`
    },
    {
      step: 13,
      category: "Interactive Demo",
      context: "Screen: Demo Walkthrough",
      title: "Learn from an Example: Kolhapur Campus",
      content: `<p>Explore the pre-configured <strong>Kolhapur Engineering Campus Expansion</strong> case study to see how a real site assessment operates:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li><strong>Site:</strong> 5,000 m² plot with 2,200 m² built-up footprint (2 storeys, GFA = 4,400 m²).</li>
        <li><strong>Baseline:</strong> 80 mature trees; 30 trees removed for foundation footprint.</li>
        <li><strong>Compensatory Action:</strong> Statutory 3:1 ratio enforces 90 native saplings.</li>
        <li><strong>Stormwater:</strong> Unmitigated peak flow surges to 147 m³/hr; mitigated plan reduces peak discharge by 60% to 58.8 m³/hr using bioswales and permeable paving.</li>
        <li><strong>Clean Energy:</strong> 126 kWp solar array generates 182,810 kWh/yr, offsetting 149.9 tonnes CO₂e.</li>
      </ul>
      <p>This project is tagged as <strong>DEMONSTRATION DATA</strong> to illustrate how all 8 environmental modules interact without mixing into your own custom projects.</p>`,
      tip: `<strong>🚀 Immediate Exploration:</strong> Click "Load Demo Project" below to inspect this live assessment on the dashboard right now!`
    }
  ],

  openWalkthroughModal(step = 1) {
    this.walkthroughStep = Math.max(1, Math.min(13, step));
    const modal = document.getElementById("ecobuild-walkthrough-modal");
    if (modal) modal.classList.remove("hidden");
    this.updateWalkthroughUI();
  },

  closeWalkthroughModal() {
    const modal = document.getElementById("ecobuild-walkthrough-modal");
    if (modal) modal.classList.add("hidden");
  },

  setWalkthroughStep(step) {
    this.walkthroughStep = Math.max(1, Math.min(13, step));
    this.updateWalkthroughUI();
  },

  nextWalkthroughStep() {
    if (this.walkthroughStep < 13) {
      this.walkthroughStep++;
      this.updateWalkthroughUI();
    }
  },

  prevWalkthroughStep() {
    if (this.walkthroughStep > 1) {
      this.walkthroughStep--;
      this.updateWalkthroughUI();
    }
  },

  updateWalkthroughUI() {
    const curStepNum = this.walkthroughStep;
    const data = this.walkthroughStepsData[curStepNum - 1];
    if (!data) return;

    // Update Sidebar Navigation
    const navList = document.getElementById("walkthrough-nav-list");
    if (navList) {
      navList.innerHTML = this.walkthroughStepsData.map(d => {
        const isActive = d.step === curStepNum;
        return `
          <button onclick="window.HomeView.setWalkthroughStep(${d.step})" class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${isActive ? 'bg-emerald-800 text-white shadow-sm font-bold' : 'text-stone-700 hover:bg-stone-200/70'}">
            <span class="truncate">Step ${d.step}: ${d.title}</span>
            ${isActive ? '<span class="text-emerald-300 font-bold ml-1">●</span>' : ''}
          </button>
        `;
      }).join("");
    }

    // Update Header Badges & Titles
    const badge = document.getElementById("wt-step-badge");
    const category = document.getElementById("wt-step-category");
    const context = document.getElementById("wt-step-context");
    const title = document.getElementById("wt-step-title");
    const content = document.getElementById("wt-step-content");
    const tipBox = document.getElementById("wt-step-box");

    if (badge) badge.innerText = `STEP ${data.step} OF 13`;
    if (category) category.innerText = data.category;
    if (context) context.innerText = data.context;
    if (title) title.innerText = data.title;
    if (content) content.innerHTML = data.content;
    if (tipBox) tipBox.innerHTML = data.tip;

    // Update Previous / Next Buttons
    const prevBtn = document.getElementById("wt-prev-btn");
    const nextBtn = document.getElementById("wt-next-btn");
    if (prevBtn) prevBtn.disabled = curStepNum <= 1;
    if (nextBtn) {
      if (curStepNum >= 13) {
        nextBtn.innerText = "Finish Walkthrough ✓";
        nextBtn.onclick = () => window.HomeView.closeWalkthroughModal();
      } else {
        nextBtn.innerText = "Next Step →";
        nextBtn.onclick = () => window.HomeView.nextWalkthroughStep();
      }
    }
  }
};


