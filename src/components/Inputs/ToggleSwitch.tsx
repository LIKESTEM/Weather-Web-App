import styles from "./Input.module.css";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Label shown to the right of the track (e.g. "Dark"). */
  onLabel?: string;
  /** Label shown to the left of the track (e.g. "Light"). */
  offLabel?: string;
  // Required, not optional, since the track itself has no visible text —
  // screen reader users need this to know what the switch controls.
  "aria-label": string;
}

/** Generic on/off switch primitive reused for both the theme and units toggles in Settings. */
function ToggleSwitch({ checked, onChange, onLabel, offLabel, ...rest }: ToggleSwitchProps) {
  return (
    <label className={styles.toggleWrap}>
      {offLabel && <span className={styles.toggleLabel}>{offLabel}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`${styles.toggleTrack} ${checked ? styles.toggleTrackOn : ""}`}
        onClick={() => onChange(!checked)}
        {...rest}
      >
        <span className={styles.toggleThumb} />
      </button>
      {onLabel && <span className={styles.toggleLabel}>{onLabel}</span>}
    </label>
  );
}

export default ToggleSwitch;
