import { useMemo } from "react";
import { useActivities } from "../../hooks/useActivities";
import { useFactors } from "../../hooks/useFactors";
import { CATEGORY_META } from "../../lib/iconMaps";
import { EMISSION_CATEGORIES, type FootprintSummary } from "@sinai/shared";

const REFERENCES = [
  {
    label: "EPA GHG Emission Factors Hub 2023",
    url: "https://www.epa.gov/system/files/documents/2023-03/ghg_emission_factors_hub.pdf",
  },
  { label: "EPA eGRID2023", url: "https://www.epa.gov/egrid" },
  { label: "EPA WARM model v16 (2023)", url: "https://www.epa.gov/warm" },
];

const ORDERED_CATEGORIES = Object.values(EMISSION_CATEGORIES);

export const useResultPanelPresenter = (summary: FootprintSummary) => {
  const factorsByActivity = useFactors();
  const { data: activitiesData } = useActivities();

  const activityToCategory = useMemo(() => {
    const map: Record<string, string> = {};
    for (const a of activitiesData?.activities ?? []) {
      map[a.id] = a.category;
    }
    return map;
  }, [activitiesData]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const result of summary.results) {
      const cat = activityToCategory[result.activity] ?? "other";
      totals[cat] = (totals[cat] ?? 0) + result.result.kgCO2e;
    }
    return totals;
  }, [summary.results, activityToCategory]);

  const pieData = ORDERED_CATEGORIES.map((cat) => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: categoryTotals[cat] ?? 0,
    color: CATEGORY_META[cat].color,
  })).filter((d) => d.value > 0);

  const total = summary.totalKgCO2e;
  return {
    REFERENCES,
    ORDERED_CATEGORIES,
    total,
    pieData,
    factorsByActivity,
    categoryTotals,
  };
};
