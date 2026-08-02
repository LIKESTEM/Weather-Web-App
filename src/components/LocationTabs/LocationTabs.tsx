import { IoClose } from "react-icons/io5";
import styles from "./LocationTabs.module.css";
import type { SavedLocation } from "../../types/location";

interface LocationTabsProps {
  locations: SavedLocation[];
  activeLocationId: string | null;
  /** Called with a location's id when its tab is clicked. */
  onSwitch: (id: string) => void;
  /** Called with a location's id when its remove (×) button is clicked. */
  onRemove: (id: string) => void;
}

/** Row of saved-location tabs for switching between them; renders nothing until at least one location is saved. */
function LocationTabs({ locations, activeLocationId, onSwitch, onRemove }: LocationTabsProps) {
  if (locations.length === 0) return null;

  return (
    <div className={styles.tabs} role="tablist" aria-label="Saved locations">
      {locations.map((location) => {
        const isActive = location.id === activeLocationId;
        return (
          <div key={location.id} className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}>
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              className={styles.tabButton}
              onClick={() => onSwitch(location.id)}
            >
              {location.label}
            </button>
            {/* The auto-detected current-location tab can't be removed, only searched-for ones can. */}
            {!location.isCurrentLocation && (
              <button
                type="button"
                className={styles.removeButton}
                aria-label={`Remove ${location.label}`}
                onClick={() => onRemove(location.id)}
              >
                <IoClose />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default LocationTabs;
