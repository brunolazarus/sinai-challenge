import type { EmissionFactor } from "@sinai/shared";

// Factor ID convention: {activity}_{source}_{year}_{region}

export const FACTORS: EmissionFactor[] = [
  // ── Transportation ────────────────────────────────────────────────────────
  {
    id: "gasoline_car_epa2023_us",
    activity: "gasoline_car",
    value: 0.404,
    unit: "kgCO2e_per_mile",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023",
    methodology:
      "Based on average US fleet fuel economy of 22 MPG and 8.887 kg CO2e per gallon of gasoline. " +
      "Includes tailpipe CO2, CH4 (GWP100=28), and N2O (GWP100=265) from combustion.",
  },
  {
    id: "electric_car_epa2023_us",
    activity: "electric_car",
    value: 0.115,
    unit: "kgCO2e_per_mile",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023 + EPA eGRID2023",
    methodology:
      "Average EV efficiency of 3.5 miles/kWh combined with US national grid average of 0.386 kg CO2e/kWh " +
      "(eGRID2023). Upstream electricity generation emissions included; tailpipe is zero.",
  },
  {
    id: "short_haul_flight_epa2023_us",
    activity: "short_haul_flight",
    value: 0.255,
    unit: "kgCO2e_per_passenger_mile",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023",
    methodology:
      "Jet fuel combustion CO2 plus Radiative Forcing Index (RFI=1.9×) for high-altitude contrails and NOx effects. " +
      "Assumes 85% load factor. Short-haul burns more fuel per mile due to takeoff/landing phases.",
  },
  {
    id: "long_haul_flight_epa2023_us",
    activity: "long_haul_flight",
    value: 0.195,
    unit: "kgCO2e_per_passenger_mile",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023",
    methodology:
      "Same RFI=1.9× multiplier as short-haul. Long-haul cruise phase is more fuel-efficient per mile; " +
      "lower factor reflects better cruise efficiency and amortised climb cost over greater distance.",
  },
  {
    id: "bus_epa2023_us",
    activity: "bus",
    value: 0.089,
    unit: "kgCO2e_per_passenger_mile",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023",
    methodology:
      "Diesel bus at average US fuel economy (~6 MPG) with average occupancy of ~30 passengers. " +
      "Tailpipe CO2, CH4, N2O included.",
  },
  {
    id: "train_epa2023_us",
    activity: "train",
    value: 0.041,
    unit: "kgCO2e_per_passenger_mile",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023",
    methodology:
      "Weighted average of electric (national grid 0.386 kg CO2e/kWh) and diesel rail. " +
      "Electric segments use grid factors; diesel segments use direct combustion factors.",
  },

  {
    id: "gasoline_car_daily_epa2023_us",
    activity: "gasoline_car_daily",
    value: 0.404,
    unit: "kgCO2e_per_mile",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023",
    methodology:
      "Same per-mile factor as gasoline_car (0.404 kg CO2e/mile). " +
      "The annualized transformation multiplies daily miles × 365 before applying the factor.",
  },
  {
    id: "gasoline_car_km_epa2023_us",
    activity: "gasoline_car_km",
    value: 0.404,
    unit: "kgCO2e_per_mile",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023",
    methodology:
      "Same per-mile factor as gasoline_car (0.404 kg CO2e/mile). " +
      "The input_km transformation converts km ÷ 1.60934 to miles before applying the factor.",
  },

  // ── Energy ────────────────────────────────────────────────────────────────
  {
    id: "electricity_egrid2023_us",
    activity: "electricity",
    value: 0.386,
    unit: "kgCO2e_per_kWh",
    region: "US",
    year: 2023,
    source: "EPA eGRID2023 national average",
    methodology:
      "National average covers full US generation mix (coal, gas, nuclear, hydro, wind, solar). " +
      "Includes CO2, CH4, N2O from combustion. Regional grids vary widely; use eGRID subregion factors for location-specific estimates.",
  },
  {
    id: "electricity_egrid2023_northeast",
    activity: "electricity",
    value: 0.21,
    unit: "kgCO2e_per_kWh",
    region: "US-Northeast",
    year: 2023,
    source: "EPA eGRID2023 NPCC subregion",
    methodology:
      "NPCC (Northeast Power Coordinating Council) subregion average. Higher share of nuclear and hydro " +
      "versus the national mix drives the lower intensity (0.21 vs 0.386 kg CO2e/kWh). " +
      "Covers New England and New York. Use this factor for households in CT, MA, ME, NH, NY, RI, VT.",
  },
  {
    id: "natural_gas_epa2023_us",
    activity: "natural_gas",
    value: 5.306,
    unit: "kgCO2e_per_therm",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023, Table 1",
    methodology:
      "1 therm = 0.1 MMBtu HHV. Combustion: 53.06 kg CO2/MMBtu × 0.1 MMBtu/therm = 5.306 kg CO2e/therm. " +
      "CO2 dominant (~99%); trace CH4 and N2O included.",
  },
  {
    id: "propane_epa2023_us",
    activity: "propane",
    value: 5.723,
    unit: "kgCO2e_per_gallon",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023, Table 1",
    methodology:
      "1 gallon propane = 0.0911 MMBtu HHV. Combustion: 62.87 kg CO2/MMBtu × 0.0911 = 5.723 kg CO2e/gallon. " +
      "Slightly higher carbon intensity than natural gas due to longer carbon chain.",
  },
  {
    id: "fuel_oil_epa2023_us",
    activity: "fuel_oil",
    value: 10.16,
    unit: "kgCO2e_per_gallon",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023, Table 1",
    methodology:
      "1 gallon No. 2 fuel oil = 0.1373 MMBtu HHV. Combustion: 73.96 kg CO2/MMBtu × 0.1373 = 10.16 kg CO2e/gallon. " +
      "Higher carbon intensity than gas fuels due to longer-chain hydrocarbons.",
  },

  // ── Diet ──────────────────────────────────────────────────────────────────
  {
    id: "beef_epa2023_us",
    activity: "beef",
    value: 27.0,
    unit: "kgCO2e_per_kg",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023 + USDA Agricultural LCA",
    methodology:
      "Full LCA farm to retail. Enteric fermentation (~60%), manure management (~15%), feed-crop production (~15%). " +
      "Includes US-average land-use change. GWP100: CH4=28, N2O=265 (IPCC AR5).",
  },
  {
    id: "pork_epa2023_us",
    activity: "pork",
    value: 12.1,
    unit: "kgCO2e_per_kg",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023 + USDA Agricultural LCA",
    methodology:
      "Manure lagoon management (CH4, N2O) and feed-crop production dominate. " +
      "Monogastric — enteric fermentation is minor compared to ruminants.",
  },
  {
    id: "chicken_epa2023_us",
    activity: "chicken",
    value: 6.9,
    unit: "kgCO2e_per_kg",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023 + USDA Agricultural LCA",
    methodology:
      "Feed production (corn, soy) ~70% of emissions. Processing energy and manure N2O are remainder. " +
      "No enteric methane for poultry.",
  },
  {
    id: "fish_epa2023_us",
    activity: "fish",
    value: 6.1,
    unit: "kgCO2e_per_kg",
    region: "US",
    year: 2023,
    source: "EPA + peer-reviewed fisheries LCA studies",
    methodology:
      "Vessel fuel combustion dominates (~80%) for wild-catch. " +
      "Includes refrigerated cold-chain logistics port to retail.",
  },
  {
    id: "dairy_epa2023_us",
    activity: "dairy",
    value: 3.2,
    unit: "kgCO2e_per_kg",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023 + USDA Agricultural LCA",
    methodology:
      "Enteric fermentation and manure from dairy cows are primary sources. " +
      "Feed production and processing included. Expressed per kg fluid milk equivalent.",
  },
  {
    id: "vegetables_usda2023_us",
    activity: "vegetables",
    value: 2.0,
    unit: "kgCO2e_per_kg",
    region: "US",
    year: 2023,
    source: "USDA LCA studies",
    methodology:
      "Fertilizer N2O from soil application dominates. On-farm machinery, irrigation, and transport included. " +
      "Conservative upper estimate for a mixed-vegetable basket.",
  },

  {
    id: "beef_weekly_epa2023_us",
    activity: "beef_weekly",
    value: 27.0,
    unit: "kgCO2e_per_kg",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023 + USDA Agricultural LCA",
    methodology:
      "Same per-kg factor as beef (27.0 kg CO2e/kg). " +
      "The weekly_to_yearly transformation multiplies weekly kg × 52 before applying the factor.",
  },
  {
    id: "beef_lbs_epa2023_us",
    activity: "beef_lbs",
    value: 27.0,
    unit: "kgCO2e_per_kg",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023 + USDA Agricultural LCA",
    methodology:
      "Same per-kg factor as beef (27.0 kg CO2e/kg). " +
      "The input_lbs transformation converts pounds ÷ 2.20462 to kg before applying the factor.",
  },

  // ── Waste ─────────────────────────────────────────────────────────────────
  {
    id: "landfill_epa2023_us",
    activity: "landfill",
    value: 0.52,
    unit: "kgCO2e_per_kg",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023, Table 9",
    methodology:
      "Landfill gas (~50% CH4) from anaerobic decomposition of organic waste. " +
      "Assumes 75% gas capture efficiency at modern US MSW facilities. Net CH4 converted to CO2e at GWP100=28 (IPCC AR5).",
  },
  {
    id: "recycled_epawarm2023_us",
    activity: "recycled",
    value: 0.02,
    unit: "kgCO2e_per_kg",
    region: "US",
    year: 2023,
    source: "EPA WARM model v16 (2023)",
    methodology:
      "Net emissions after crediting avoided virgin material production. " +
      "0.02 kg/kg represents residual collection/processing energy; aluminum recycling strongly offsets other materials in the mix.",
  },
  {
    id: "composted_epawarm2023_us",
    activity: "composted",
    value: 0.03,
    unit: "kgCO2e_per_kg",
    region: "US",
    year: 2023,
    source: "EPA WARM model v16 (2023)",
    methodology:
      "Aerobic composting produces minimal CH4. Small N2O from nitrogen mineralisation and machinery CO2 from turning windrows. " +
      "Significantly better than landfill: 0.03 vs 0.52 kg CO2e/kg.",
  },
];
