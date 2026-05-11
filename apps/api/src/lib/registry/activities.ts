import type { Activity } from "@sinai/shared";
import {
  EMISSION_CATEGORIES,
  INPUT_UNITS,
  TRANSFORMATION_IDS,
} from "@sinai/shared";

export const ACTIVITIES: Activity[] = [
  // ── Transportation ────────────────────────────────────────────────────────
  {
    id: "gasoline_car",
    label: "Gasoline Car",
    category: EMISSION_CATEGORIES.TRANSPORTATION,
    inputUnit: INPUT_UNITS.MILE,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "electric_car",
    label: "Electric Car",
    category: EMISSION_CATEGORIES.TRANSPORTATION,
    inputUnit: INPUT_UNITS.MILE,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "motorcycle",
    label: "Motorcycle",
    category: EMISSION_CATEGORIES.TRANSPORTATION,
    inputUnit: INPUT_UNITS.MILE,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "short_haul_flight",
    label: "Short-Haul Flight (< 500 mi)",
    category: EMISSION_CATEGORIES.TRANSPORTATION,
    inputUnit: INPUT_UNITS.PASSENGER_MILE,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "long_haul_flight",
    label: "Long-Haul Flight (> 500 mi)",
    category: EMISSION_CATEGORIES.TRANSPORTATION,
    inputUnit: INPUT_UNITS.PASSENGER_MILE,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "bus",
    label: "Bus",
    category: EMISSION_CATEGORIES.TRANSPORTATION,
    inputUnit: INPUT_UNITS.PASSENGER_MILE,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "train",
    label: "Train",
    category: EMISSION_CATEGORIES.TRANSPORTATION,
    inputUnit: INPUT_UNITS.PASSENGER_MILE,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "gasoline_car_daily",
    label: "Gasoline Car (daily miles)",
    category: EMISSION_CATEGORIES.TRANSPORTATION,
    inputUnit: INPUT_UNITS.MILE_PER_DAY,
    transformation: TRANSFORMATION_IDS.ANNUALIZED,
  },
  {
    id: "gasoline_car_km",
    label: "Gasoline Car (km)",
    category: EMISSION_CATEGORIES.TRANSPORTATION,
    inputUnit: INPUT_UNITS.KM,
    transformation: TRANSFORMATION_IDS.INPUT_KM,
  },

  // ── Energy ────────────────────────────────────────────────────────────────
  {
    id: "electricity",
    label: "Electricity",
    category: EMISSION_CATEGORIES.ENERGY,
    inputUnit: INPUT_UNITS.KWH,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "natural_gas",
    label: "Natural Gas",
    category: EMISSION_CATEGORIES.ENERGY,
    inputUnit: INPUT_UNITS.THERM,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "propane",
    label: "Propane",
    category: EMISSION_CATEGORIES.ENERGY,
    inputUnit: INPUT_UNITS.GALLON,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "fuel_oil",
    label: "Fuel Oil No. 2",
    category: EMISSION_CATEGORIES.ENERGY,
    inputUnit: INPUT_UNITS.GALLON,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },

  // ── Diet ──────────────────────────────────────────────────────────────────
  {
    id: "beef",
    label: "Beef",
    category: EMISSION_CATEGORIES.DIET,
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "pork",
    label: "Pork",
    category: EMISSION_CATEGORIES.DIET,
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "chicken",
    label: "Chicken",
    category: EMISSION_CATEGORIES.DIET,
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "fish",
    label: "Fish (wild-caught)",
    category: EMISSION_CATEGORIES.DIET,
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "dairy",
    label: "Dairy",
    category: EMISSION_CATEGORIES.DIET,
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "vegetables",
    label: "Vegetables",
    category: EMISSION_CATEGORIES.DIET,
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "beef_weekly",
    label: "Beef (weekly consumption)",
    category: EMISSION_CATEGORIES.DIET,
    inputUnit: INPUT_UNITS.KG_PER_WEEK,
    transformation: TRANSFORMATION_IDS.WEEKLY_TO_YEARLY,
  },
  {
    id: "beef_lbs",
    label: "Beef (pounds)",
    category: EMISSION_CATEGORIES.DIET,
    inputUnit: INPUT_UNITS.LB,
    transformation: TRANSFORMATION_IDS.INPUT_LBS,
  },

  // ── Waste ─────────────────────────────────────────────────────────────────
  {
    id: "landfill",
    label: "Landfill (mixed solid waste)",
    category: EMISSION_CATEGORIES.WASTE,
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "recycled",
    label: "Mixed Recyclables",
    category: EMISSION_CATEGORIES.WASTE,
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "composted",
    label: "Composted (food & yard waste)",
    category: EMISSION_CATEGORIES.WASTE,
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
];
