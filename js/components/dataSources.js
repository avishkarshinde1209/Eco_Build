/**
 * EcoBuild Smart - Data Sources Registry & Confidence Metadata Module
 * Full audit trail and catalog of external APIs, datasets, licenses, and quality ratings.
 */

window.DataSourcesView = {
  render(environmentalData) {
    const container = document.getElementById("datasources-view");
    if (!container) return;

    const datasets = [
      {
        name: "High-Resolution Global Meteorological Forecast",
        provider: "Open-Meteo & European Centre for Medium-Range Weather Forecasts (ECMWF)",
        variable: "Temperature (2m), Humidity, Wind speed, Precipitation",
        unit: "°C, %, km/h, mm",
        geographic: "Global (~1 km to 9 km grid resolution)",
        temporal: "Hourly updates & 7-day numerical weather prediction",
        license: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
        api_url: "https://open-meteo.com/en/docs",
        confidence: "HIGH",
        status: "Live Active Query"
      },
      {
        name: "Copernicus Atmosphere Monitoring Service (CAMS)",
        provider: "European Union Copernicus Earth Observation Programme",
        variable: "AQI, PM2.5, PM10, NO₂, SO₂, CO, Ozone (O₃)",
        unit: "µg/m³ & US AQI scale",
        geographic: "Global atmospheric chemistry model (10 km grid)",
        temporal: "Hourly reanalysis and satellite assimilation",
        license: "Open Copernicus Data License",
        api_url: "https://atmosphere.copernicus.eu",
        confidence: "HIGH",
        status: "Live Active Query"
      },
      {
        name: "ERA5-Land Precipitation Climatology",
        provider: "ECMWF / Open-Meteo Climate Archive",
        variable: "Annual precipitation sum & monthly distribution curves",
        unit: "mm/year, mm/month",
        geographic: "Global land-surface reanalysis (9 km grid)",
        temporal: "1940 to present (Historical 30-year normal)",
        license: "Open Database License (ODbL)",
        api_url: "https://open-meteo.com/en/docs/historical-weather-api",
        confidence: "HIGH",
        status: "Live Active Query"
      },
      {
        name: "NASA Prediction of Worldwide Energy Resources (POWER)",
        provider: "NASA Langley Research Center",
        variable: "Global Horizontal Irradiance (GHI) & Daily Peak Sun Hours",
        unit: "kWh/m²/day, kWh/m²/year",
        geographic: "Global satellite observation grid (0.5° × 0.5°)",
        temporal: "Multi-year climatological solar irradiance",
        license: "NASA Open Data Policy (Public Domain)",
        api_url: "https://power.larc.nasa.gov",
        confidence: "HIGH",
        status: "Calibrated Satellite Model"
      },
      {
        name: "OpenStreetMap Nominatim Geocoding",
        provider: "OpenStreetMap Foundation",
        variable: "Place name, Administrative state, Coordinates, Elevation",
        unit: "Degrees Latitude/Longitude, Meters above sea level",
        geographic: "Global planetary gazetteer",
        temporal: "Real-time crowdsourced geospatial database",
        license: "Open Database License (ODbL)",
        api_url: "https://nominatim.openstreetmap.org",
        confidence: "HIGH",
        status: "Live Active Query"
      },
      {
        name: "India Meteorological Department (IMD) 30-Year Normals",
        provider: "Ministry of Earth Sciences, Govt. of India",
        variable: "Station rain gauges, Monsoon onset curves (Kolhapur/Pune)",
        unit: "mm, °C, days",
        geographic: "Maharashtra & Western Ghats meteorological stations",
        temporal: "1991 - 2020 Climatological Tables",
        license: "Official Government of India Open Data",
        api_url: "https://mausam.imd.gov.in",
        confidence: "MODERATE",
        status: "Pre-loaded Regional Fallback"
      }
    ];

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Banner -->
        <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              📊 Data Provenance & Open Science
            </span>
            <h1 class="text-2xl font-bold text-slate-800 tracking-tight mt-1">Data Sources & Confidence Matrix</h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Comprehensive inventory of external APIs, satellite feeds, scientific databases, and quality confidence tiers.
            </p>
          </div>
          <div class="text-xs text-slate-400">
            Strict Scientific Integrity: Zero fabricated data.
          </div>
        </div>

        <!-- Confidence Tiers Legend -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          ${Object.values(window.ECO_CONFIG.CONFIDENCE_LEVELS).map(conf => `
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
              <div class="flex items-center gap-2">
                <span class="text-lg">${conf.icon}</span>
                <span class="text-xs font-bold text-slate-800">${conf.label}</span>
              </div>
              <p class="text-[11px] text-slate-500 leading-snug">${conf.desc}</p>
            </div>
          `).join("")}
        </div>

        <!-- Registry Cards -->
        <div class="space-y-4">
          <h3 class="text-sm font-bold text-slate-800">Integrated Environmental API Datasets</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${datasets.map(ds => {
              const confObj = window.ECO_CONFIG.CONFIDENCE_LEVELS[ds.confidence] || window.ECO_CONFIG.CONFIDENCE_LEVELS.HIGH;
              return `
                <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
                  <div>
                    <div class="flex items-start justify-between gap-2">
                      <h4 class="font-bold text-sm text-slate-800">${ds.name}</h4>
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${confObj.color}">
                        ${confObj.icon} ${confObj.label}
                      </span>
                    </div>
                    <div class="text-xs font-medium text-emerald-700 mt-0.5">${ds.provider}</div>

                    <div class="mt-3 text-xs space-y-1.5 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div><strong class="text-slate-700">Variables:</strong> ${ds.variable} (${ds.unit})</div>
                      <div><strong class="text-slate-700">Resolution:</strong> ${ds.geographic} • ${ds.temporal}</div>
                      <div><strong class="text-slate-700">License:</strong> ${ds.license}</div>
                    </div>
                  </div>

                  <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span class="text-emerald-700 font-semibold">● ${ds.status}</span>
                    <a href="${ds.api_url}" target="_blank" class="text-blue-600 hover:underline">API Docs &rarr;</a>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;
  }
};
