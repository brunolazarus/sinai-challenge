// EPA: one tree absorbs ~21.77 kg CO2/year; gasoline car emits ~0.404 kg CO2e/mile
export const KG_PER_TREE_YEAR = 21.77;
export const KG_PER_GASOLINE_MILE = 0.404;

export function toTrees(kgCO2e: number): number {
  return kgCO2e / KG_PER_TREE_YEAR;
}

export function toGasolineMiles(kgCO2e: number): number {
  return kgCO2e / KG_PER_GASOLINE_MILE;
}

export function formatAnalogy(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  if (value >= 100) return value.toFixed(0);
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
}
