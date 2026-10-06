/**
 * EcoBuild Smart - Interactive Leaflet Map Module
 * Displays project location, site footprint boundary buffer,
 * satellite/street basemap toggle, and geolocation picker.
 */

window.MapModule = {
  map: null,
  marker: null,
  boundaryCircle: null,
  currentTileLayer: null,
  currentLayerType: "streets", // "streets" or "satellite"

  TILE_LAYERS: {
    streets: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }
  },

  init(containerId = "site-map", initialLat = 16.7050, initialLon = 74.2433, plotAreaM2 = 5000) {
    if (!window.L) {
      console.warn("Leaflet library not loaded yet.");
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.map = window.L.map(containerId).setView([initialLat, initialLon], 15);

    // Initial base layer (Streets)
    this.currentTileLayer = window.L.tileLayer(this.TILE_LAYERS.streets.url, {
      attribution: this.TILE_LAYERS.streets.attribution,
      maxZoom: 19
    }).addTo(this.map);

    // Draggable project marker
    this.marker = window.L.marker([initialLat, initialLon], {
      draggable: true
    }).addTo(this.map);

    this.marker.bindPopup(`<b>Project Location</b><br>Lat: ${initialLat.toFixed(4)}, Lon: ${initialLon.toFixed(4)}`).openPopup();

    // Site boundary circle (radius in meters equivalent to plot area)
    const radiusMeters = Math.max(15, Math.round(Math.sqrt(plotAreaM2 / Math.PI)));
    this.boundaryCircle = window.L.circle([initialLat, initialLon], {
      radius: radiusMeters,
      color: "#059669",
      fillColor: "#10b981",
      fillOpacity: 0.25,
      weight: 2
    }).addTo(this.map);

    // Event listeners
    this.marker.on("dragend", async (e) => {
      const pos = e.target.getLatLng();
      await this.handleCoordinateChange(pos.lat, pos.lng);
    });

    this.map.on("click", async (e) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;
      this.marker.setLatLng([lat, lon]);
      await this.handleCoordinateChange(lat, lon);
    });

    // Invalidate size after modal/tab render
    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 200);
  },

  toggleBasemap(type) {
    if (!this.map || !this.TILE_LAYERS[type]) return;
    this.currentLayerType = type;
    if (this.currentTileLayer) this.map.removeLayer(this.currentTileLayer);

    this.currentTileLayer = window.L.tileLayer(this.TILE_LAYERS[type].url, {
      attribution: this.TILE_LAYERS[type].attribution,
      maxZoom: 19
    }).addTo(this.map);
  },

  updateLocation(lat, lon, plotAreaM2 = 5000, zoom = 15) {
    if (!this.map) return;
    this.map.setView([lat, lon], zoom);
    if (this.marker) {
      this.marker.setLatLng([lat, lon]);
      this.marker.getPopup().setContent(`<b>Project Location</b><br>Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);
    }

    if (this.boundaryCircle) {
      const radiusMeters = Math.max(15, Math.round(Math.sqrt(plotAreaM2 / Math.PI)));
      this.boundaryCircle.setLatLng([lat, lon]);
      this.boundaryCircle.setRadius(radiusMeters);
    }
  },

  async handleCoordinateChange(lat, lon) {
    if (this.boundaryCircle) this.boundaryCircle.setLatLng([lat, lon]);
    if (window.App && window.App.onMapLocationSelected) {
      await window.App.onMapLocationSelected(lat, lon);
    }
  },

  requestUserGeolocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your current browser.");
      return;
    }

    const confirmGeo = confirm("EcoBuild Smart would like to use your current location to retrieve localized rainfall and environmental data. Do you wish to allow?");
    if (!confirmGeo) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        this.updateLocation(lat, lon);
        await this.handleCoordinateChange(lat, lon);
      },
      (err) => {
        alert(`Geolocation access was denied or timed out: ${err.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }
};
