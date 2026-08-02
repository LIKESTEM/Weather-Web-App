// Top-level layout plus router outlet.

import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Settings from "./pages/Settings/Settings";
import { useTheme } from "./hooks/useTheme";
import { useSavedLocations } from "./hooks/useSavedLocations";
import "./App.css";
import type { SearchResult } from "./types/location";

function App() {
  // Applied here, not in Settings, so the data-theme attribute (and the
  // saved preference it reflects) is set on every route, not just while
  // the Settings page happens to be mounted.
  const { theme, toggleTheme } = useTheme();

  // Owned here (not in Home) so the Navbar's search bar — which sits above
  // the routed pages — can add/switch locations from any page.
  const { locations, activeLocation, activeLocationId, addLocation, removeLocation, switchToLocation } =
    useSavedLocations();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Saves (or switches to, if already saved) the picked search result, shows
  // a confirmation toast, and jumps to Home so the result is visible even if
  // the search happened from the Settings page.
  function handleSelectLocation(result: SearchResult) {
    const alreadySaved = locations.some((location) => location.queryValue === result.queryValue);
    addLocation({
      id: `search-${result.id}`,
      label: result.name,
      queryValue: result.queryValue,
      isCurrentLocation: false,
    });
    setStatusMessage(
      alreadySaved ? `Switched to ${result.name}.` : `Added ${result.name} to your locations.`
    );
    navigate("/");
  }

  // Looks the location up before removing it so the confirmation toast can
  // reference its label (removeLocation only needs the id).
  function handleRemoveLocation(id: string) {
    const removed = locations.find((location) => location.id === id);
    removeLocation(id);
    if (removed) setStatusMessage(`Removed ${removed.label}.`);
  }

  return (
    <div className="app-shell">
      <Navbar onSelectLocation={handleSelectLocation} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                locations={locations}
                activeLocation={activeLocation}
                activeLocationId={activeLocationId}
                addLocation={addLocation}
                switchToLocation={switchToLocation}
                onRemoveLocation={handleRemoveLocation}
                statusMessage={statusMessage}
                onDismissStatusMessage={() => setStatusMessage(null)}
              />
            }
          />
          <Route path="/settings" element={<Settings theme={theme} toggleTheme={toggleTheme} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
