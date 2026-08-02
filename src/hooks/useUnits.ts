// Persists the Celsius/Fahrenheit (metric/imperial) unit preference.

import { useLocalStorage } from "./useLocalStorage";
import type { UnitSystem } from "../types/settings";

export function useUnits() {
  const [units, setUnits] = useLocalStorage<UnitSystem>("unit-system", "metric");

  function toggleUnits() {
    setUnits((current) => (current === "metric" ? "imperial" : "metric"));
  }

  return { units, setUnits, toggleUnits };
}
