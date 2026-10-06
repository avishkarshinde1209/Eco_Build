/**
 * EcoBuild Smart - Main Application Controller & State Engine
 * Professional Application Shell with Collapsible Left Navigation,
 * Project Switcher, Live Recovery Score, Dynamic Breadcrumbs & Notifications.
 */

window.App = {
  activeView: "dashboard",
  currentProject: null,
  calculations: null,
  environmentalData: null,
  recommendations: null,
  sidebarCollapsed: false,

  async init() {
    console.log("Initializing EcoBuild Smart Engineering Workspace...");

    // 1. Restore sidebar collapse state
    this.sidebarCollapsed = localStorage.getItem("ecobuild_sidebar_collapsed") === "true";
    this.applySidebarState();

    // 2. Load initial project from storage or default to Kolhapur demonstration test case
    const saved = localStorage.getItem("ecobuild_current_project");
    if (saved) {
      try {
        this.currentProject = JSON.parse(saved);
      } catch (e) {
        this.currentProject = JSON.parse(JSON.stringify(window.ECO_SAMPLE_PROJECTS.kolhapur_academic));
      }
    } else {
      this.currentProject = JSON.parse(JSON.stringify(window.ECO_SAMPLE_PROJECTS.kolhapur_academic));
    }

    // 3. Run initial data fetch and calculation pipeline
    await this.loadProjectAndCalculate(this.currentProject);

    // 4. Default view: check URL hash or query, otherwise default to "home"
    let hash = window.location.hash.replace("#", "").toLowerCase().trim();
    if (["plan", "recoveryplan", "recovery-plan", "naturerecovery"].includes(hash)) {
      hash = "recovery";
    }
    const validViews = [
      "home", "dashboard", "wizard", "scenariostudio", "technical",
      "recovery", "stormwater", "energy", "materials", "biodiversity",
      "waste", "optimization", "cost",
      "monitoring", "history", "methodology", "report", "datasources", "plan"
    ];
    const initialView = validViews.includes(hash) ? hash : "home";
    this.switchView(initialView);
  },

  async loadProjectAndCalculate(project) {
    this.currentProject = project;
    localStorage.setItem("ecobuild_current_project", JSON.stringify(project));

    this.showGlobalLoader(true, "Querying meteorological APIs and computing 8-domain environmental model...");

    try {
      const lat = project.location?.latitude || 16.7050;
      const lon = project.location?.longitude || 74.2433;

      // 1. Fetch real online environmental data
      this.environmentalData = await window.EnvironmentalDataService.getCompleteEnvironmentalProfile(lat, lon);

      // 2. Execute calculation engine
      this.calculations = window.EnvironmentalCalculator.calculateOverallEnvironmentalIndicators(project, this.environmentalData);

      // 3. Synthesize rule-based recommendations
      this.recommendations = window.RecommendationEngine.generateRecoveryPlan(project, this.calculations, this.environmentalData);

      // 4. Save to History Manager
      if (window.HistoryManager) {
        window.HistoryManager.saveCurrentPlan(this.currentProject, this.calculations);
      }

      this.updateTopBarBadge();
    } catch (err) {
      console.error("Error in environmental assessment pipeline:", err);
    } finally {
      this.showGlobalLoader(false);
    }
  },

  recalculateProject() {
    this.calculations = window.EnvironmentalCalculator.calculateOverallEnvironmentalIndicators(this.currentProject, this.environmentalData);
    this.recommendations = window.RecommendationEngine.generateRecoveryPlan(this.currentProject, this.calculations, this.environmentalData);
    localStorage.setItem("ecobuild_current_project", JSON.stringify(this.currentProject));

    if (window.HistoryManager) {
      window.HistoryManager.saveCurrentPlan(this.currentProject, this.calculations);
    }

    this.updateTopBarBadge();
    this.renderCurrentView();
  },

  async switchProject(key) {
    this.toggleProjectSwitcher(false);
    if (window.ECO_SAMPLE_PROJECTS && window.ECO_SAMPLE_PROJECTS[key]) {
      const proj = JSON.parse(JSON.stringify(window.ECO_SAMPLE_PROJECTS[key]));
      await this.loadProjectAndCalculate(proj);
      this.renderCurrentView();
    }
  },

  toggleProjectSwitcher(force) {
    const el = document.getElementById("project-switcher-modal");
    if (!el) return;
    if (force !== undefined) {
      if (force) el.classList.remove("hidden");
      else el.classList.add("hidden");
    } else {
      el.classList.toggle("hidden");
    }
  },

  toggleNotificationsModal(force) {
    const el = document.getElementById("notifications-modal");
    if (!el) return;
    if (force !== undefined) {
      if (force) el.classList.remove("hidden");
      else el.classList.add("hidden");
    } else {
      el.classList.toggle("hidden");
    }
  },

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem("ecobuild_sidebar_collapsed", this.sidebarCollapsed ? "true" : "false");
    this.applySidebarState();
  },

  applySidebarState() {
    const sidebar = document.getElementById("app-sidebar");
    const summary = document.getElementById("sidebar-site-summary");
    const toggleIcon = document.getElementById("sidebar-toggle-icon");
    const toggleText = document.getElementById("sidebar-toggle-text");
    const labels = document.querySelectorAll(".sidebar-label");
    const headings = document.querySelectorAll(".sidebar-section-heading");

    if (!sidebar) return;

    if (this.sidebarCollapsed) {
      sidebar.classList.remove("w-64");
      sidebar.classList.add("w-16");
      if (summary) summary.classList.add("hidden");
      if (toggleText) toggleText.classList.add("hidden");
      if (toggleIcon) toggleIcon.innerText = "▶";
      labels.forEach(l => l.classList.add("hidden"));
      headings.forEach(h => h.classList.add("hidden"));
    } else {
      sidebar.classList.remove("w-16");
      sidebar.classList.add("w-64");
      if (summary) summary.classList.remove("hidden");
      if (toggleText) toggleText.classList.remove("hidden");
      if (toggleIcon) toggleIcon.innerText = "◀";
      labels.forEach(l => l.classList.remove("hidden"));
      headings.forEach(h => h.classList.remove("hidden"));
    }
  },

  toggleMobileSidebar() {
    const sidebar = document.getElementById("app-sidebar");
    if (!sidebar) return;
    sidebar.classList.toggle("hidden");
  },

  updateTopBarBadge() {
    if (!this.currentProject) return;

    // Top Project Name
    const nameEl = document.getElementById("top-project-name");
    if (nameEl) {
      nameEl.innerText = this.currentProject.name || "Active Project";
    }

    // Top Recovery Score
    const scoreVal = this.calculations?.score?.composite_score || 86;
    const scoreEl = document.getElementById("top-score-value");
    if (scoreEl) {
      scoreEl.innerText = scoreVal;
    }

    // Sidebar Site Summary
    const statArea = document.getElementById("sidebar-stat-area");
    if (statArea && this.currentProject.site) {
      statArea.innerText = `${(this.currentProject.site.plot_area || 5000).toLocaleString()} m²`;
    }
    const statScore = document.getElementById("sidebar-stat-score");
    if (statScore) {
      statScore.innerText = `${scoreVal} / 100`;
    }
  },

  updateBreadcrumbs(viewName) {
    const breadcrumbs = document.getElementById("app-breadcrumbs");
    if (!breadcrumbs) return;

    const projName = this.currentProject ? this.currentProject.name : "Active Project";
    
    const titles = {
      dashboard: "Project Overview",
      wizard: "Site Assessment & Cadastre",
      technical: "Environmental Baseline",
      recovery: "Nature Recovery Plan",
      stormwater: "Water & Stormwater Management",
      energy: "Energy & Solar PV Feasibility",
      materials: "Carbon Accounting & Materials",
      biodiversity: "Urban Biodiversity Matrix",
      waste: "Waste & Material Circularity",
      scenariostudio: "What-If Sensitivity Studio",
      optimization: "Multi-Objective Optimizer",
      cost: "Lifecycle Cost & Abatement",
      monitoring: "Post-Occupancy Monitoring Hub",
      report: "Statutory Environmental Audit",
      datasources: "Data Sources & Audit Trail",
      history: "Project Archive & Settings"
    };

    const currentTitle = titles[viewName] || viewName.toUpperCase();

    breadcrumbs.innerHTML = `
      <span class="cursor-pointer hover:text-emerald-700 transition" onclick="window.App.switchView('home')">EcoBuild</span>
      <span class="text-slate-300">/</span>
      <span class="cursor-pointer hover:text-emerald-700 transition" onclick="window.App.toggleProjectSwitcher(true)">Projects</span>
      <span class="text-slate-300">/</span>
      <span class="cursor-pointer hover:text-emerald-700 transition font-semibold text-slate-700" onclick="window.App.switchView('dashboard')">${projName}</span>
      <span class="text-slate-300">/</span>
      <span class="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">${currentTitle}</span>
    `;
  },

  switchView(viewName) {
    let normalized = (viewName || "home").toLowerCase().replace(/[-_]/g, "");
    let targetView = viewName;

    // Route alias normalization to prevent blank containers
    if (["plan", "recovery", "recoveryplan", "naturerecovery", "optimization"].includes(normalized)) {
      targetView = "recovery";
    } else if (["siteplanner3d", "3dview", "3d", "architectural3d", "siteplanner", "siteplanner2d", "planner", "2dview"].includes(normalized)) {
      targetView = "scenariostudio";
    } else if (["cost", "materials", "carbon"].includes(normalized)) {
      targetView = "materials";
    } else if (["technical", "baseline"].includes(normalized)) {
      targetView = "dashboard";
    } else if (["datasources", "data", "sources"].includes(normalized)) {
      targetView = "report";
    } else if (["history"].includes(normalized)) {
      targetView = "monitoring";
    } else if (["water", "stormwater"].includes(normalized)) {
      targetView = "stormwater";
    }

    this.activeView = targetView;

    const appHeader = document.getElementById("app-header");
    const appFooter = document.getElementById("app-footer");
    const mobileBottomBar = document.getElementById("mobile-bottom-bar");
    const homeView = document.getElementById("home-view");
    const workspaceContainer = document.getElementById("workspace-container");

    if (targetView === "home") {
      if (appHeader) appHeader.classList.add("hidden");
      if (appFooter) appFooter.classList.add("hidden");
      if (mobileBottomBar) mobileBottomBar.classList.add("hidden");
      if (homeView) homeView.classList.remove("hidden");
      if (workspaceContainer) workspaceContainer.classList.add("hidden");

      if (window.HomeView) {
        window.HomeView.render();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Entering internal workspace views
    if (appHeader) appHeader.classList.remove("hidden");
    if (appFooter) appFooter.classList.remove("hidden");
    if (mobileBottomBar) mobileBottomBar.classList.remove("hidden");
    if (homeView) homeView.classList.add("hidden");
    if (workspaceContainer) workspaceContainer.classList.remove("hidden");

    // Close mobile sidebar drawer if on mobile
    if (window.innerWidth < 768) {
      const sidebar = document.getElementById("app-sidebar");
      if (sidebar && !sidebar.classList.contains("hidden")) {
        sidebar.classList.add("hidden");
      }
    }

    // Map special shortcut routes to physical containers
    let targetViewContainer = targetView;
    if (targetView === "optimization") targetViewContainer = "recovery";
    if (targetView === "cost") targetViewContainer = "materials";
    if (targetView === "technical") targetViewContainer = "dashboard";
    if (targetView === "datasources") targetViewContainer = "report";
    if (targetView === "history") targetViewContainer = "monitoring";

    // Update active nav item styling in sidebar
    document.querySelectorAll(".sidebar-nav-item").forEach(btn => {
      const navKey = btn.getAttribute("data-nav");
      if (navKey === targetView || (targetView === "recovery" && navKey === "recovery")) {
        btn.classList.add("bg-emerald-700", "text-white", "font-bold", "shadow-sm");
        btn.classList.remove("text-stone-300", "hover:text-white", "hover:bg-stone-800/60");
      } else {
        btn.classList.remove("bg-emerald-700", "text-white", "font-bold", "shadow-sm");
        btn.classList.add("text-stone-300", "hover:text-white", "hover:bg-stone-800/60");
      }
    });

    // Hide all workspace view containers
    const allViews = [
      "dashboard", "wizard", "scenariostudio", "technical", "recovery",
      "materials", "monitoring", "stormwater", "energy",
      "biodiversity", "datasources", "waste", "history", "methodology", "report", "plan"
    ];
    allViews.forEach(v => {
      const el = document.getElementById(`${v}-view`);
      if (el) el.classList.add("hidden");
    });

    // Show active container (with recovery fallback if ever needed)
    const activeEl = document.getElementById(`${targetViewContainer}-view`) || document.getElementById("recovery-view");
    if (activeEl) activeEl.classList.remove("hidden");

    // Update Breadcrumbs
    this.updateBreadcrumbs(targetView);

    // Render component
    this.renderCurrentView();

    // Scroll workspace content to top
    const workspaceContent = document.getElementById("app-workspace-content");
    if (workspaceContent) {
      workspaceContent.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  renderCurrentView() {
    if (this.activeView === "home") {
      if (window.HomeView) window.HomeView.render();
      return;
    }

    // Safety fallback: ensure project and calculations exist
    if (!this.currentProject) {
      this.currentProject = JSON.parse(JSON.stringify(window.ECO_SAMPLE_PROJECTS?.kolhapur_academic || {}));
    }
    if (!this.calculations) {
      if (window.EnvironmentalCalculator) {
        this.calculations = window.EnvironmentalCalculator.calculateOverallEnvironmentalIndicators(
          this.currentProject,
          this.environmentalData || window.ECO_FALLBACK_DATA
        );
      }
    }

    const proj = this.currentProject;
    const calc = this.calculations;
    const env = this.environmentalData || window.ECO_FALLBACK_DATA;

    switch (this.activeView) {
      case "dashboard":
      case "technical":
        window.DashboardView && window.DashboardView.render(proj, calc, env);
        break;
      case "wizard":
        window.ProjectWizard && window.ProjectWizard.init(proj);
        break;
      case "scenariostudio":
        window.ScenarioStudioView && window.ScenarioStudioView.render(proj, calc, env);
        break;
      case "recovery":
      case "plan":
      case "recoveryplan":
      case "optimization":
        window.NatureRecoveryView && window.NatureRecoveryView.render(proj, calc, env);
        break;
      case "materials":
      case "cost":
        window.MaterialsView && window.MaterialsView.render(proj, calc, env);
        break;
      case "stormwater":
        window.StormwaterView && window.StormwaterView.render(proj, calc, env);
        break;
      case "energy":
        window.EnergyView && window.EnergyView.render(proj, calc, env);
        break;
      case "biodiversity":
        window.BiodiversityView && window.BiodiversityView.render(proj, calc, env);
        break;
      case "waste":
        window.WasteView && window.WasteView.render(proj, calc, env);
        break;
      case "monitoring":
        window.MonitoringView && window.MonitoringView.render(proj, calc, env);
        break;
      case "history":
        window.HistoryManager && window.HistoryManager.render();
        break;
      case "methodology":
        window.MethodologyView && window.MethodologyView.render();
        break;
      case "datasources":
        window.DataSourcesView && window.DataSourcesView.render(env);
        break;
      case "report":
        window.ReportView && window.ReportView.render(proj, calc, env);
        break;
      default:
        window.DashboardView && window.DashboardView.render(proj, calc, env);
        break;
    }
  },

  async onProjectSubmitted(formData) {
    await this.loadProjectAndCalculate(formData);
    this.switchView("dashboard");
  },

  async onMapLocationSelected(lat, lon) {
    if (this.currentProject) {
      this.currentProject.location.latitude = lat;
      this.currentProject.location.longitude = lon;
      const rev = await window.EnvironmentalDataService.reverseGeocode(lat, lon);
      this.currentProject.location.city = rev.city;
      this.currentProject.location.address = rev.display_name;

      await this.loadProjectAndCalculate(this.currentProject);
      this.renderCurrentView();
    }
  },

  showGlobalLoader(show, text = "Computing dynamic environmental indicators...") {
    const el = document.getElementById("global-loader");
    const txtEl = document.getElementById("global-loader-text");
    if (!el) return;
    if (txtEl) txtEl.innerText = text;
    if (show) el.classList.remove("hidden");
    else el.classList.add("hidden");
  },

  showNotification(title, message, type = "success") {
    const container = document.getElementById('app-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const borderBg = type === 'success' ? 'bg-[#0D1912] text-white border-emerald-600/80 shadow-emerald-950/40' :
      type === 'warning' ? 'bg-amber-950 text-amber-100 border-amber-600/80 shadow-amber-950/40' :
      type === 'error' ? 'bg-rose-950 text-rose-100 border-rose-600/80 shadow-rose-950/40' :
      'bg-slate-900 text-slate-100 border-slate-700 shadow-slate-950/40';

    toast.className = `pointer-events-auto p-4 rounded-2xl shadow-2xl border transition-all duration-300 transform translate-y-2 opacity-0 flex items-start gap-3 text-xs ${borderBg}`;

    const icon = type === 'success' ? '✓' : type === 'warning' ? '⚠️' : type === 'error' ? '✕' : 'ℹ️';

    toast.innerHTML = `
      <div class="w-6 h-6 rounded-lg ${type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10'} flex items-center justify-center font-bold text-xs shrink-0">
        ${icon}
      </div>
      <div class="flex-1">
        <div class="font-bold font-serif text-[13px] text-white">${title}</div>
        <div class="text-[11px] text-stone-300 mt-0.5 leading-snug">${message}</div>
      </div>
      <button onclick="this.parentElement.remove()" class="text-stone-400 hover:text-white font-bold text-sm leading-none ml-2">&times;</button>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  window.App.init();
});
