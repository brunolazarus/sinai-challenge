export const EMISSION_CATEGORIES = {
  TRANSPORTATION: "transportation",
  ENERGY: "energy",
  DIET: "diet",
  WASTE: "waste",
} as const;

export const TRANSFORMATION_IDS = {
  SIMPLE_MULTIPLY: "simple_multiply",
  ANNUALIZED: "annualized",
  WEEKLY_TO_YEARLY: "weekly_to_yearly",
  INPUT_KM: "input_km",
  INPUT_LBS: "input_lbs",
} as const;

export const CO2E_UNITS = {
  KG: "kg",
  TONNES: "tonnes",
} as const;

export const INPUT_UNITS = {
  // distance
  MILE: "mile",
  KM: "km",
  PASSENGER_MILE: "passenger-mile",
  MILE_PER_DAY: "mile/day",
  // energy
  KWH: "kWh",
  THERM: "therm",
  GALLON: "gallon",
  // mass
  KG: "kg",
  LB: "lb",
  KG_PER_WEEK: "kg/week",
} as const;
