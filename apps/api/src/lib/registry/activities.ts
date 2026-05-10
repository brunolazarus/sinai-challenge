import type { Activity } from "@sinai/shared";
import { INPUT_UNITS, TRANSFORMATION_IDS } from "@sinai/shared";

export const ACTIVITIES: Activity[] = [
  // ── Transportation ────────────────────────────────────────────────────────
  {
    id: "gasoline_car",
    category: "transportation",
    label: "Gasoline Car",
    inputUnit: INPUT_UNITS.MILE,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "electric_car",
    category: "transportation",
    label: "Electric Car",
    inputUnit: INPUT_UNITS.MILE,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "short_haul_flight",
    category: "transportation",
    label: "Short-Haul Flight (< 500 mi)",
    inputUnit: INPUT_UNITS.PASSENGER_MILE,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "long_haul_flight",
    category: "transportation",
    label: "Long-Haul Flight (> 500 mi)",
    inputUnit: INPUT_UNITS.PASSENGER_MILE,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "bus",
    category: "transportation",
    label: "Bus",
    inputUnit: INPUT_UNITS.PASSENGER_MILE,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "train",
    category: "transportation",
    label: "Train",
    inputUnit: INPUT_UNITS.PASSENGER_MILE,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "gasoline_car_daily",
    category: "transportation",
    label: "Gasoline Car (daily miles → annual)",
    inputUnit: INPUT_UNITS.MILE_PER_DAY,
    transformation: TRANSFORMATION_IDS.ANNUALIZED,
  },
  {
    id: "gasoline_car_km",
    category: "transportation",
    label: "Gasoline Car (km)",
    inputUnit: INPUT_UNITS.KM,
    transformation: TRANSFORMATION_IDS.INPUT_KM,
  },

  // ── Energy ────────────────────────────────────────────────────────────────
  {
    id: "electricity",
    category: "energy",
    label: "Electricity",
    inputUnit: INPUT_UNITS.KWH,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "natural_gas",
    category: "energy",
    label: "Natural Gas",
    inputUnit: INPUT_UNITS.THERM,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "propane",
    category: "energy",
    label: "Propane",
    inputUnit: INPUT_UNITS.GALLON,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "fuel_oil",
    category: "energy",
    label: "Fuel Oil No. 2",
    inputUnit: INPUT_UNITS.GALLON,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },

  // ── Diet ──────────────────────────────────────────────────────────────────
  {
    id: "beef",
    category: "diet",
    label: "Beef",
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "pork",
    category: "diet",
    label: "Pork",
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "chicken",
    category: "diet",
    label: "Chicken",
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "fish",
    category: "diet",
    label: "Fish (wild-caught)",
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "dairy",
    category: "diet",
    label: "Dairy",
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "vegetables",
    category: "diet",
    label: "Vegetables",
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "beef_weekly",
    category: "diet",
    label: "Beef (weekly consumption → annual)",
    inputUnit: INPUT_UNITS.KG_PER_WEEK,
    transformation: TRANSFORMATION_IDS.WEEKLY_TO_YEARLY,
  },
  {
    id: "beef_lbs",
    category: "diet",
    label: "Beef (pounds)",
    inputUnit: INPUT_UNITS.LB,
    transformation: TRANSFORMATION_IDS.INPUT_LBS,
  },

  // ── Waste ─────────────────────────────────────────────────────────────────
  {
    id: "landfill",
    category: "waste",
    label: "Landfill (mixed solid waste)",
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "recycled",
    category: "waste",
    label: "Mixed Recyclables",
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "composted",
    category: "waste",
    label: "Composted (food & yard waste)",
    inputUnit: INPUT_UNITS.KG,
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
];
