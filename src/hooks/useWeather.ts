// Fetches current conditions + forecast + alerts for a location, and falls
// back to the localStorage cache when the network request fails so the app
// still has something to show offline.

import { useEffect, useState } from "react";
import { fetchCurrentAndForecast } from "../services/weatherApi";
import { useLocalStorage } from "./useLocalStorage";
import type { WeatherSnapshot } from "../types/weather";

export function useWeather(locationQuery: string | null) {
  const [data, setData] = useState<WeatherSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useLocalStorage<Record<string, WeatherSnapshot>>(
    "weather-cache",
    {}
  );

  useEffect(() => {
    // Guards against a slower, stale request resolving after a newer one
    // (e.g. the user switches location again before the first fetch finishes).
    let isActive = true;

    async function load() {
      // The null-query guard lives inside load() (not the effect body)
      // so this is the only synchronous setState call in the effect —
      // an effect calling setState directly triggers a cascading re-render.
      if (!locationQuery) {
        setData(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const snapshot = await fetchCurrentAndForecast(locationQuery);
        if (!isActive) return;
        setData(snapshot);
        setCache((current) => ({ ...current, [locationQuery]: snapshot }));
      } catch {
        if (!isActive) return;
        setError("Could not fetch live weather — showing cached data if available.");
        setData(cache[locationQuery] ?? null);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    load();
    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationQuery]);

  return { data, isLoading, error };
}
