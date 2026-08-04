import { useEffect, useRef, useState } from "react";
import LocationTabs from "../../components/LocationTabs/LocationTabs";
import AlertBanner from "../../components/AlertBanner/AlertBanner";
import CurrentConditions from "../../components/CurrentConditions/CurrentConditions";
import ForecastView from "../../components/ForecastView/ForecastView";
import Toast from "../../components/Toast/Toast";
import { MutedText } from "../../components/Text/Text";
//  PageTitle,
import { useGeolocation } from "../../hooks/useGeolocation";
import { useWeather } from "../../hooks/useWeather";
import { useUnits } from "../../hooks/useUnits";
import { coordsToQueryValue } from "../../services/weatherApi";
import { isHighSeverity } from "../../utils/weatherAlerts";
import styles from "./Home.module.css";
import type { SavedLocation } from "../../types/location";
import emptyStateImage from "../../assets/images/Weather-empty-state-image.jpg";

// Location state (locations/addLocation/etc.) and the status-message toast
// are owned by App, not Home, so the Navbar's search bar can also add/switch
// locations while any page is mounted. Home just consumes them as props.
interface HomeProps {
  locations: SavedLocation[];
  activeLocation: SavedLocation | null;
  activeLocationId: string | null;
  addLocation: (location: SavedLocation) => void;
  switchToLocation: (id: string) => void;
  onRemoveLocation: (id: string) => void;
  /** Confirmation toast text (e.g. "Added X to your locations."), or null when there's nothing to show. */
  statusMessage: string | null;
  onDismissStatusMessage: () => void;
}

/** Weather dashboard: current location detection, saved-location tabs, current conditions, and the forecast. */
function Home({
  locations,
  activeLocation,
  activeLocationId,
  addLocation,
  switchToLocation,
  onRemoveLocation,
  statusMessage,
  onDismissStatusMessage,
}: HomeProps) {
  const { units } = useUnits();
  const { coords, error: geoError, requestLocation } = useGeolocation();
  const { data, isLoading, error } = useWeather(activeLocation?.queryValue ?? null);

  // Tracks which alert ids have already triggered a browser notification, so
  // the same alert doesn't re-notify every time `data` refreshes.
  const notifiedAlertIds = useRef(new Set<string>());
  // Guards the auto-detect effect below so it only ever fires once per
  // mount, even though `locations.length` can legitimately stay 0 for a
  // moment while geolocation is still resolving.
  const hasRequestedGeolocation = useRef(false);

  // Auto-detect the user's location on first load, but only if they have no
  // saved locations yet (returning users shouldn't be re-prompted).
  useEffect(() => {
    if (locations.length === 0 && !hasRequestedGeolocation.current) {
      hasRequestedGeolocation.current = true;
      requestLocation();
    }
  }, [locations.length, requestLocation]);

  // Once geolocation resolves, save it as the "current location" tab (once).
  useEffect(() => {
    if (!coords) return;
    const alreadySaved = locations.some((location) => location.isCurrentLocation);
    if (alreadySaved) return;

    addLocation({
      id: "current-location",
      label: "Current Location",
      queryValue: coordsToQueryValue(coords.latitude, coords.longitude),
      isCurrentLocation: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  // Ask for permission to show severe-weather desktop notifications up
  // front, rather than waiting until an alert actually needs to fire.
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Fire a desktop notification for any new severe/extreme alert on the
  // active location's data.
  useEffect(() => {
    if (!data) return;
    for (const alert of data.alerts) {
      if (!isHighSeverity(alert.severity) || notifiedAlertIds.current.has(alert.id)) continue;
      notifiedAlertIds.current.add(alert.id);
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(alert.headline || alert.event, { body: alert.description });
      }
    }
  }, [data]);

  // Stores the *text* of the last-dismissed error (not just a boolean) so
  // dismissing one error doesn't permanently hide a different, later error.
  const [dismissedError, setDismissedError] = useState<string | null>(null);

  return (
    <div className={styles.home}>
      {/* <PageTitle>Weather</PageTitle> */}

      <LocationTabs
        locations={locations}
        activeLocationId={activeLocationId}
        onSwitch={switchToLocation}
        onRemove={onRemoveLocation}
      />

      {geoError && locations.length === 0 && (
        <div className={styles.emptyState}>
          <img
            src={emptyStateImage}
            alt="Location permission was denied. Try searching for a city instead."
            className={styles.emptyStateImage}
          />
          <MutedText className={styles.mutedTextFromSearch}>
            {geoError} Try searching for a city instead.
          </MutedText>
        </div>
      )}

      {!activeLocation && !isLoading && locations.length === 0 && !geoError && (
        <MutedText>Detecting your location…</MutedText>
      )}

      {isLoading && <MutedText>Loading weather…</MutedText>}

      {data && (
        <div className={styles.content}>
          {data.alerts.length > 0 && <AlertBanner alerts={data.alerts} />}
          <CurrentConditions location={data.location} current={data.current} units={units} />
          <ForecastView days={data.forecastDays} units={units} />
        </div>
      )}

      <div className={styles.toastHost}>
        {statusMessage && (
          <Toast message={statusMessage} variant="info" onDismiss={onDismissStatusMessage} />
        )}
        {error && error !== dismissedError && (
          <Toast message={error} variant="error" onDismiss={() => setDismissedError(error)} />
        )}
      </div>
    </div>
  );
}

export default Home;
