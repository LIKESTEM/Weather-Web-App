import styles from "./ForecastView.module.css";

type ForecastMode = "daily" | "hourly";

interface ForecastToggleProps {
  mode: ForecastMode;
  /** Called with the newly selected mode when the user clicks a tab. */
  onChange: (mode: ForecastMode) => void;
}

/** Two-tab switch for choosing between hourly and daily forecast views. */
function ForecastToggle({ mode, onChange }: ForecastToggleProps) {
  return (
    <div className={styles.toggle} role="tablist" aria-label="Forecast range">
      <button
        type="button"
        role="tab"
        aria-selected={mode === "hourly"}
        className={`${styles.toggleButton} ${mode === "hourly" ? styles.toggleButtonActive : ""}`}
        onClick={() => onChange("hourly")}
      >
        Hourly
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "daily"}
        className={`${styles.toggleButton} ${mode === "daily" ? styles.toggleButtonActive : ""}`}
        onClick={() => onChange("daily")}
      >
        Daily
      </button>
    </div>
  );
}

export default ForecastToggle;
