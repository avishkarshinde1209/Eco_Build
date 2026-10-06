# EcoBuild Smart – Dynamic Environmental Impact Assessment & Green Infrastructure Planner

> **Academic Project Edition** — Computer Engineering & Environmental Science Interdisciplinary Decision Support System.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-eco--build--avishkar1209--blush--sigma.vercel.app-059669?style=for-the-badge&logo=vercel)](https://eco-build-avishkar1209-blush-sigma.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Eco__Build-1e293b?style=for-the-badge&logo=github)](https://github.com/avishkarshinde1209/Eco_Build)
[![Status](https://img.shields.io/badge/Status-Online%20%26%20Active-10b981?style=for-the-badge)](https://eco-build-avishkar1209-blush-sigma.vercel.app/)

🌐 **Live Web Application (Vercel):** [https://eco-build-avishkar1209-blush-sigma.vercel.app/](https://eco-build-avishkar1209-blush-sigma.vercel.app/)  
📁 **Official GitHub Repository:** [https://github.com/avishkarshinde1209/Eco_Build](https://github.com/avishkarshinde1209/Eco_Build)

---

## 🌿 Overview

**EcoBuild Smart** is a modern, responsive, data-driven web and desktop application designed for dynamic Environmental Impact Assessment (EIA) and urban Green Infrastructure (GI) planning. 

Unlike traditional static tools where predefined inputs produce static outputs, **EcoBuild Smart dynamically computes environmental deficits and mitigation requirements** based on real-time meteorological feeds, geospatial coordinates, site layout parameters, building characteristics, and official environmental empirical datasets.

The application operates as an offline-first **Progressive Web App (PWA)** and **Standalone Native Windows Desktop Application**, backed by an automated Python/SQLite REST server with zero third-party pip dependencies.

---

## 🚀 Key Features

### 1. Dynamic Environmental Impact Assessment
- **Real-Time Data Feeds**: Fetches live precipitation, temperature, solar irradiance, and air quality (PM2.5, PM10, AQI) via Open-Meteo APIs using site GPS coordinates.
- **Hydrological Modelling**: Rational Method ($Q = CIA$) calculates peak runoff before and after development, sizing bioretention swales and permeable pavements.
- **Rainwater Harvesting (RWH)**: Calculates potential monsoon harvest, storage tank sizing, and water balance offset under CPHEEO / NBC 2016 standards.
- **Carbon Footprint & Embodied Carbon**: Evaluates upfront construction embodied emissions vs. annual operational and solar offset horizons.
- **Urban Heat Island (UHI)**: Models site albedo and thermal surface microclimate modification.

### 2. Auto-Fill Construction Waste via Empirical Datasets
- **TIFAC & CPCB (2016) C&D Waste Norms**: Automatically calculates construction waste generation (tonnes) based on Gross Floor Area (GFA) and building typology (e.g., $60\text{ kg/m}^2$ for Institutional, $50\text{ kg/m}^2$ for Residential).
- **CPCB 7-Stream Material Breakdown**:
  - Soil, Sand & Gravel: $36\%$ (Site filling & sub-base)
  - Concrete Rubble: $31\%$ (Recycled concrete aggregate RCA)
  - Bricks & Masonry: $10\%$
  - Metals & Rebar: $5\%$ ($100\%$ circular scrap recycling)
  - Timber & Wood: $5\%$
  - Bitumen & Asphalt: $2\%$
  - Others & Packaging: $11\%$
- **CPHEEO Municipal Solid Waste Norms**: Computes daily per capita domestic waste and annual on-site organic compost yield ($25\%$ closed-loop conversion).

### 3. Comprehensive Two-Phase Nature Recovery Engine
- **Phase 1: Construction-Phase Mitigation (While Creating)**:
  - **Topsoil Preservation (NBC 2016 Part 11)**: Sizing topsoil excavation volume ($0.20\text{ m}$ humus layer) and stockpiling ($\le 2\text{ m}$ height) with leguminous cover crop.
  - **CPCB Airborne Dust Suppression**: Continuous $6\text{ m}$ perimeter GI sheet barrier + mist cannons ($\sim 72\%$ PM10 containment).
  - **Low-Carbon Green Concrete**: $35\%$ GGBS / Fly Ash substitution to avoid cement clinker emissions.
  - **Rubble Circularity**: Mobile crushing of debris into road and parking sub-base.
- **Phase 2: Post-Construction Operational Nature Recovery (After Construction)**:
  - **Akira Miyawaki Ultra-Dense Afforestation**: $3.5\text{ saplings/m}^2$ with $10\times$ faster growth across a 4-tier native canopy (Canopy, Sub-canopy, Tree, Shrub).
  - **Sponge City Bioretention Bioswales**: Filters $85\%$ of stormwater runoff pollutants and recharges shallow aquifers.
  - **Bio-Solar Roof Synergy**: Green roof evapotranspirative cooling lowers solar PV temperature by $\sim 2.8^\circ\text{C}$, yielding $+4.5\%$ annual clean electricity boost.
  - **Biodiversity Net Gain (BNG)**: Quantified ecological metric ensuring $>+10\%$ net gain above pre-development baseline.

### 4. Plan History, Results Studio & Scenario Comparison
- **Save Named Snapshots**: Snapshot active runs with custom tags directly from the Dashboard or History View.
- **View Full Results Modal**: Click *"👁️ View Results"* to inspect comprehensive calculation results of any past plan without overwriting active work.
- **Side-by-Side Plan Comparison**: Compare any two plans with differential $\Delta$ metrics and automated winner indicators.
- **SQLite Database Persistence**: Stores projects locally in `ecobuild.db` with offline fallback.

### 5. Publication-Ready Official EIA Report
- Generates a formal, printable, academic-grade EIA report complete with mathematical formulas, before/after scenario comparisons, mitigation action tables, and verification sign-off blocks.

---

## 📂 Project Architecture & Directory Structure

```text
Eco_Build/
├── index.html                    # Single-Page App shell with 8 views & navigation
├── server.py                     # Python HTTP REST API server with SQLite persistence
├── sw.js                         # Service Worker for offline PWA caching
├── manifest.webmanifest          # PWA installation manifest
├── EcoBuildSmart.bat             # One-click Windows launcher
├── LaunchApp.bat                 # Direct batch launcher with auto-browser startup
├── launch_app.py                 # Standalone frameless desktop app window launcher
├── launch_app.vbs                # Silent background VBScript launcher
├── install_app.py                # Desktop & Start Menu shortcut installer
├── Install_EcoBuild_Smart.bat    # Windows shortcut installer script
├── uninstall_app.py              # Clean uninstaller script
├── create_icon.py                # Custom icon generator
├── ecobuild.db                   # SQLite database (projects & cache)
├── icons/                        # Application icons (SVG, ICO, PNG)
│   ├── ecobuild.ico
│   ├── icon.svg
│   └── icon-192.svg
├── js/
│   ├── app.js                    # Main application controller & router
│   ├── config.js                 # Environmental constants (NBC, TIFAC, CPCB, CPHEEO)
│   ├── correlationEngine.js      # Inter-parameter auto-calculation engine
│   ├── api.js                    # Open-Meteo & Nominatim API service
│   ├── fallbackData.js           # Verified regional climate normals for offline mode
│   ├── plantDatabase.js          # Native agro-climatic plant species database
│   ├── recommendations.js        # Rule-based ecological mitigation engine
│   ├── validation.js             # Geometric & input boundary validation
│   ├── models/
│   │   └── sampleProjects.js     # Preloaded Kolhapur academic benchmark project
│   ├── calculations/             # Pure mathematical & scientific engines
│   │   ├── runoffCalculator.js        # Rational Method Q = CIA
│   │   ├── waterCalculator.js         # LPCD demand & RWH potential
│   │   ├── vegetationCalculator.js    # Tree canopy & green cover balance
│   │   ├── carbonCalculator.js        # Embodied vs operational carbon
│   │   ├── energyCalculator.js        # Solar PV capacity & CEA offset
│   │   ├── heatIslandCalculator.js    # Surface albedo & microclimate UHI
│   │   ├── scoreCalculator.js         # Multi-criteria weighted sustainability index
│   │   ├── recoveryCalculator.js      # Two-phase nature recovery & Miyawaki models
│   │   └── environmentalCalculator.js # Pipeline orchestrator
│   └── components/               # Dynamic UI Views & Modals
│       ├── dashboard.js               # Main overview with live gauges & charts
│       ├── wizard.js                  # 8-step project wizard with auto-fill
│       ├── natureRecovery.js          # Nature recovery & mitigation portfolio
│       ├── history.js                 # Plan archive, results modal & comparison
│       ├── scenarioStudio.js          # Interactive what-if intervention sliders
│       ├── technicalAnalysis.js       # Technical engineering drilldowns
│       ├── methodology.js             # Scientific equations & academic citations
│       ├── report.js                  # Printable EIA documentation report
│       ├── explainModal.js            # Formula inspector & confidence drawer
│       ├── mapModule.js               # Interactive Leaflet site boundary map
│       ├── stormwater.js              # Hydrology analysis sub-module
│       ├── greenInfra.js              # Green infrastructure sizing sub-module
│       ├── energy.js                  # Solar energy analysis sub-module
│       ├── biodiversity.js            # Ecology & tree impact sub-module
│       ├── comparison.js              # Comparative analysis sub-module
│       ├── simulator.js               # Real-time simulation controls
│       └── dataSources.js             # Live API monitor & confidence levels
└── tests/
    └── test_suite.py             # 32 automated verification unit tests (100% pass)
```

---

## 🛠️ How to Run the Application

### Option A: From Desktop Shortcut
Double-click the **"EcoBuild Smart"** icon on your Windows Desktop. It automatically starts the backend server in the background and launches a standalone window without browser chrome.

### Option B: From Batch Launcher
Double-click **`LaunchApp.bat`** or **`EcoBuildSmart.bat`** in the project directory.

### Option C: Manual Command Line
```bash
# 1. Start Python API Server
python server.py

# 2. Open in your browser
http://localhost:8000
```

---

## 🧪 Running Automated Unit Tests
To verify all mathematical calculations, standards, and persistence:
```bash
python tests/test_suite.py
```
*Current test suite status: 32 PASSED, 0 FAILED (100% pass rate).*

---

## ☁️ Cloud Deployment (Vercel)
The production application is continuously deployed to Vercel:
- **Live Production URL:** [https://eco-build-avishkar1209-blush-sigma.vercel.app/](https://eco-build-avishkar1209-blush-sigma.vercel.app/)
- **Deployment Platform:** Vercel Serverless & Static CDN
- **Serverless API Routes:** /api/health.js, /api/network-info.js
