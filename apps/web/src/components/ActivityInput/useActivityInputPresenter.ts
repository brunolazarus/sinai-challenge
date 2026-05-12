import { useState } from "react";
import type { Activity, InputUnit } from "@sinai/shared";
import { useFactors } from "../../hooks/useFactors";

type UnitOption = {
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
};

const UNIT_ALTERNATIVES: Partial<Record<InputUnit, UnitOption[]>> = {
  mile: [
    { label: "miles", toBase: (v) => v, fromBase: (v) => v },
    { label: "km", toBase: (v) => v / 1.60934, fromBase: (v) => v * 1.60934 },
  ],
  "passenger-mile": [
    { label: "miles", toBase: (v) => v, fromBase: (v) => v },
    { label: "km", toBase: (v) => v / 1.60934, fromBase: (v) => v * 1.60934 },
  ],
  kg: [
    { label: "kg", toBase: (v) => v, fromBase: (v) => v },
    { label: "lbs", toBase: (v) => v / 2.20462, fromBase: (v) => v * 2.20462 },
  ],
};

export const useActivityInputPresenter = (
  activity: Activity,
  quantity: string,
  onChange: (value: string) => void,
) => {
  const factorsByActivity = useFactors();
  const factors = factorsByActivity[activity.id] ?? [];

  const unitOptions = UNIT_ALTERNATIVES[activity.inputUnit] ?? null;
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(0);
  const [displayValue, setDisplayValue] = useState(quantity);

  const toBase = (raw: string, unitIdx = selectedUnitIdx): string => {
    const num = parseFloat(raw);
    if (!unitOptions || raw === "" || isNaN(num)) return raw;
    return String(unitOptions[unitIdx]!.toBase(num));
  };

  const switchUnit = (idx: number) => {
    setSelectedUnitIdx(idx);
    onChange(toBase(displayValue, idx));
  };

  return {
    methodology: factors[0]?.methodology,
    unitOptions,
    selectedUnitIdx,
    displayValue,
    setDisplayValue,
    toBase,
    switchUnit,
  };
};
