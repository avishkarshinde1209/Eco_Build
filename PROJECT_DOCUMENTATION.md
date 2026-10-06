# EcoBuild Smart — Academic & Scientific Project Documentation

## 1. Executive Scientific Framework

**EcoBuild Smart** integrates computational engineering and environmental science to evaluate site-specific ecological alterations caused by civil construction and formulate quantified mitigation portfolios.

The core computational framework relies on published standards from:
- **Rational Method for Hydrological Runoff (US EPA / IRC:SP:13)**
- **CPHEEO Manual on Water Supply and Treatment (Ministry of Housing and Urban Affairs, India)**
- **National Building Code of India (NBC 2016) Part 4 & Part 11: Approach to Sustainability**
- **TIFAC (Technology Information, Forecasting and Assessment Council, DST, India)**
- **CPCB Guidelines on Environmental Management of Construction & Demolition (C&D) Wastes (2016)**
- **Akira Miyawaki Ultra-Dense Native Afforestation Methodology**
- **Central Electricity Authority (CEA) India Baseline Carbon Emission Database (v19)**

### Official Online Access:
- **Production Web Deployment (Vercel):** [https://eco-build-avishkar6.vercel.app](https://eco-build-avishkar6.vercel.app)
- **Source Code Repository:** [https://github.com/avishkarshinde1209/Eco_Build](https://github.com/avishkarshinde1209/Eco_Build)

---

## 2. Mathematical Models & Equations

### 2.1 Hydrology & Stormwater Runoff (Rational Method)
The peak stormwater discharge rate is calculated using the Rational Method:

$$Q = \frac{C \cdot I \cdot A}{1000}$$

Where:
- $Q$ = Peak stormwater runoff discharge rate ($m^3/\text{hr}$)
- $C$ = Weighted dimensionless composite runoff coefficient
- $I$ = Rainfall intensity for the critical storm duration ($mm/\text{hr}$)
- $A$ = Total contributing surface catchment area ($m^2$)

#### Composite Runoff Coefficient ($C$):
$$C = \frac{\sum (C_i \cdot A_i)}{\sum A_i}$$

| Surface Type | Runoff Coefficient ($C$) | Standard Reference |
|---|---|---|
| Concrete Pavement / Slab | $0.90$ | Rational Method / US EPA |
| Standard RCC Flat Roof | $0.85$ | CPHEEO Manual |
| Asphalt Roadway | $0.85$ | US EPA |
| Interlocking Paver Tiles | $0.70$ | IRC:SP:63 |
| Bare Soil / Compacted Earth | $0.45$ | USDA SCS TR-55 |
| Extensive Green Roof ($100-150\text{ mm}$) | $0.35$ | FLL Guidelines |
| Permeable Porous Concrete Pavement | $0.25$ | CIRIA C753 |
| Natural Lawn / Forest Cover | $0.20$ | USDA SCS TR-55 |

---

### 2.2 Rainwater Harvesting (RWH) Potential
Annual harvestable rainwater volume is modeled as:

$$V_{\text{harvest}} = P \cdot A_{\text{roof}} \cdot C_{\text{roof}} \cdot \eta_{\text{filter}}$$

Where:
- $V_{\text{harvest}}$ = Harvested volume (Litres/year)
- $P$ = Annual cumulative precipitation ($mm$) from live Open-Meteo feeds
- $A_{\text{roof}}$ = Effective rooftop catchment area ($m^2$)
- $C_{\text{roof}}$ = Roof runoff coefficient ($0.85$)
- $\eta_{\text{filter}}$ = First-flush bypass and mechanical filter efficiency ($0.85$)

#### Optimum Storage Capacity:
$$V_{\text{tank}} = D_{\text{daily}} \cdot N_{\text{dry\_spell}} \cdot f_{\text{non\_potable}}$$
Where $N_{\text{dry\_spell}} = 45\text{ days}$ and non-potable ratio $f = 0.40$ (toilet flushing and landscape irrigation).

---

### 2.3 C&D Construction Waste & Material Breakdown (TIFAC / CPCB 2016)

#### Total Construction Waste:
$$W_{\text{C\&D}} = \frac{\text{Gross Floor Area (GFA)} \cdot R_{\text{type}}}{1000} \quad (\text{Tonnes})$$

Where $R_{\text{type}}$ is the empirical generation rate from **TIFAC / CPCB Guidelines 2016**:
- **Residential**: $50\text{ kg/m}^2$ GFA
- **Educational**: $55\text{ kg/m}^2$ GFA
- **Institutional / Campus**: $60\text{ kg/m}^2$ GFA
- **Commercial Office**: $65\text{ kg/m}^2$ GFA
- **Light Industrial**: $45\text{ kg/m}^2$ GFA

#### CPCB Empirical Material Composition Breakdown:
1. **Soil, Sand & Gravel** ($36\%$): Reusable for on-site leveling and road embankment.
2. **Concrete Rubble** ($31\%$): Mobile crushing into Recycled Concrete Aggregate (RCA) for sub-base.
3. **Bricks & Masonry** ($10\%$): Pervious walkway sub-grade and lean mortar.
4. **Metals & Rebar** ($5\%$): $100\%$ circular recycling via authorized scrap re-rolling mills.
5. **Timber & Shuttering** ($5\%$): Reuse as formwork or biomass chipboard.
6. **Bitumen / Asphalt** ($2\%$): Reclaimed Asphalt Pavement (RAP).
7. **Packaging & Plastics** ($11\%$): Authorized co-processing / Refuse-Derived Fuel (RDF).

---

### 2.4 Municipal Solid Waste (MSW) & Closed-Loop Bio-Compost (CPHEEO)

$$\text{Daily MSW (kg/day)} = N_{\text{occupants}} \cdot W_{\text{capita}}$$
- Institutional: $0.25\text{ kg/person/day}$ ($45\%$ organic fraction)
- Residential: $0.45\text{ kg/person/day}$ ($55\%$ organic fraction)

$$\text{Annual Bio-Compost (Tonnes/yr)} = \frac{\text{Daily Organic} \cdot 365 \cdot 0.25}{1000}$$
Where $0.25$ represents the aerobic decomposition compost conversion efficiency.

---

### 2.5 Phase 1: Construction-Phase Nature Mitigation (While Creating)

#### 1. Topsoil Salvage Volume (NBC 2016 Part 11):
$$V_{\text{topsoil}} = A_{\text{built}} \cdot d_{\text{topsoil}} \quad (m^3)$$
Where $d_{\text{topsoil}} = 0.20\text{ m}$ ($20\text{ cm}$ humus layer).
Stockpiled at maximum height $h_{\text{max}} = 2.0\text{ m}$ to prevent anaerobic mortality of soil microbes.
Covered with nitrogen-fixing cover grass (*Crotalaria juncea* / *Stylosanthes hamata*).

#### 2. CPCB Airborne Dust Containment:
- Boundary sheet barrier length $L = 4 \cdot \sqrt{A_{\text{plot}}}$, height $H = 6\text{ m}$.
- High-pressure mist cannon atomization achieves $\sim 72\%$ PM10 suppression.

#### 3. Low-Carbon Green Concrete:
- Concrete volume $V_{\text{concrete}} \approx \text{GFA} \cdot 0.40\text{ m}^3/\text{m}^2$.
- $35\%$ GGBS / Fly Ash substitution avoids $130\text{ kg CO}_2/\text{m}^3$ of cement clinker emissions.

---

### 2.6 Phase 2: Post-Construction Operational Nature Recovery (After Construction)

#### 1. Akira Miyawaki Dense Urban Forest:
- Designated plot: $25\%$ of available open site area.
- Density: $3.5\text{ native saplings/m}^2$.
- Multi-tier canopy arrangement:
  - **Canopy Layer** ($20\%$): *Ficus benghalensis*, *Ficus religiosa*, *Terminalia arjuna*
  - **Sub-Canopy Layer** ($40\%$): *Azadirachta indica*, *Pongamia pinnata*, *Syzygium cumini*
  - **Sub-Tree Layer** ($25\%$): *Cassia fistula*, *Butea monosperma*, *Phyllanthus emblica*
  - **Shrub Layer** ($15\%$): *Vitex negundo*, *Justicia adhatoda*, *Lawsonia inermis*
- Sequestration rate: $4.5\text{ kg CO}_2/\text{m}^2/\text{yr}$ ($10\times$ faster growth than monoculture lawns).

#### 2. Sponge City Bioretention Bioswales:
- Sized for $8-10\%$ of impervious pavement catchment.
- Filter depth $0.45\text{ m}$ engineered soil + $0.30\text{ m}$ aggregate storage sump.
- Removes $>85\%$ Total Suspended Solids (TSS) and recharges shallow aquifers.

#### 3. Bio-Solar Synergy:
- Green roof evapotranspiration cools solar PV modules by $\Delta T \approx 2.8^\circ\text{C}$.
- Improves PV efficiency by $+0.4\%$ per $^\circ\text{C}$ cooling, adding $+4.5\%$ annual clean electricity.

---

## 3. Online Environmental APIs

| API Provider | Endpoint | Parameters Fetched | Confidence Level |
|---|---|---|---|
| **Open-Meteo Weather API** | `api.open-meteo.com/v1/forecast` | Daily precipitation, Temperature, Solar Radiation, Wind | 🟢 High Confidence |
| **Open-Meteo Air Quality API** | `air-quality-api.open-meteo.com/v1/air-quality` | PM2.5, PM10, Nitrogen Dioxide, European AQI | 🟢 High Confidence |
| **Nominatim OpenStreetMap** | `nominatim.openstreetmap.org` | Forward and Reverse Geocoding via Lat/Lon | 🟢 High Confidence |
| **Local Regional Normals** | `js/fallbackData.js` | 10 verified Indian metro stations for 100% offline mode | 🟡 Calibrated Normal |
