import type { Activity } from "@sinai/shared";

export const ACTIVITIES: Activity[] = [
  // ── Transportation ────────────────────────────────────────────────────────
  { id: "gasoline_car",      category: "transportation", label: "Gasoline Car",                   inputUnit: "mile",           transformation: "simple_multiply" },
  { id: "electric_car",      category: "transportation", label: "Electric Car",                   inputUnit: "mile",           transformation: "simple_multiply" },
  { id: "short_haul_flight", category: "transportation", label: "Short-Haul Flight (< 500 mi)",   inputUnit: "passenger-mile", transformation: "simple_multiply" },
  { id: "long_haul_flight",  category: "transportation", label: "Long-Haul Flight (> 500 mi)",    inputUnit: "passenger-mile", transformation: "simple_multiply" },
  { id: "bus",               category: "transportation", label: "Bus",                            inputUnit: "passenger-mile", transformation: "simple_multiply" },
  { id: "train",             category: "transportation", label: "Train",                          inputUnit: "passenger-mile", transformation: "simple_multiply" },

  // ── Energy ────────────────────────────────────────────────────────────────
  { id: "electricity",       category: "energy",         label: "Electricity",                    inputUnit: "kWh",            transformation: "simple_multiply" },
  { id: "natural_gas",       category: "energy",         label: "Natural Gas",                    inputUnit: "therm",          transformation: "simple_multiply" },
  { id: "propane",           category: "energy",         label: "Propane",                        inputUnit: "gallon",         transformation: "simple_multiply" },
  { id: "fuel_oil",          category: "energy",         label: "Fuel Oil No. 2",                 inputUnit: "gallon",         transformation: "simple_multiply" },

  // ── Diet ──────────────────────────────────────────────────────────────────
  { id: "beef",              category: "diet",           label: "Beef",                           inputUnit: "kg",             transformation: "simple_multiply" },
  { id: "pork",              category: "diet",           label: "Pork",                           inputUnit: "kg",             transformation: "simple_multiply" },
  { id: "chicken",           category: "diet",           label: "Chicken",                        inputUnit: "kg",             transformation: "simple_multiply" },
  { id: "fish",              category: "diet",           label: "Fish (wild-caught)",              inputUnit: "kg",             transformation: "simple_multiply" },
  { id: "dairy",             category: "diet",           label: "Dairy",                          inputUnit: "kg",             transformation: "simple_multiply" },
  { id: "vegetables",        category: "diet",           label: "Vegetables",                     inputUnit: "kg",             transformation: "simple_multiply" },

  // ── Waste ─────────────────────────────────────────────────────────────────
  { id: "landfill",          category: "waste",          label: "Landfill (mixed solid waste)",   inputUnit: "kg",             transformation: "simple_multiply" },
  { id: "recycled",          category: "waste",          label: "Mixed Recyclables",              inputUnit: "kg",             transformation: "simple_multiply" },
  { id: "composted",         category: "waste",          label: "Composted (food & yard waste)",  inputUnit: "kg",             transformation: "simple_multiply" },
];
