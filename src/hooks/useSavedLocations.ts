// Persists the list of saved locations and which one is currently active.

import { useLocalStorage } from "./useLocalStorage";
import type { SavedLocation } from "../types/location";

export function useSavedLocations() {
  const [locations, setLocations] = useLocalStorage<SavedLocation[]>("saved-locations", []);
  const [activeLocationId, setActiveLocationId] = useLocalStorage<string | null>(
    "active-location-id",
    null
  );

  function addLocation(location: SavedLocation) {
    setLocations((current) => {
      // Same place already saved (e.g. re-selecting it from search) —
      // just switch to it below instead of adding a duplicate entry.
      if (current.some((entry) => entry.queryValue === location.queryValue)) {
        return current;
      }
      return [...current, location];
    });
    setActiveLocationId(location.id);
  }

  function removeLocation(id: string) {
    setLocations((current) => current.filter((entry) => entry.id !== id));
    setActiveLocationId((current) => (current === id ? null : current));
  }

  function switchToLocation(id: string) {
    setActiveLocationId(id);
  }

  // Falls back to the first saved location if the active id is stale (e.g.
  // it was just removed) or hasn't been set yet.
  const activeLocation =
    locations.find((entry) => entry.id === activeLocationId) ?? locations[0] ?? null;

  return {
    locations,
    activeLocation,
    activeLocationId,
    addLocation,
    removeLocation,
    switchToLocation,
  };
}
