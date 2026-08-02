import styles from "./ForecastView.module.css";

/** Pre-formatted display data for one forecast slot (a day or an hour) — ForecastView maps the raw API types into this shape before rendering. */
export interface ForecastCardData {
  id: string;
  /** Day-of-week ("Mon") or hour ("3 PM") label, already formatted for display. */
  label: string;
  iconUrl: string;
  conditionText: string;
  /** Main temperature shown (today's high, or the hour's temperature). */
  primaryTemp: string;
  /** Secondary temperature (today's low); omitted for hourly cards. */
  secondaryTemp?: string;
}

interface ForecastCardProps {
  entry: ForecastCardData;
}

/** One tile in the forecast strip: label, condition icon, and temperature(s). */
function ForecastCard({ entry }: ForecastCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.cardLabel}>{entry.label}</span>
      <img src={entry.iconUrl} alt={entry.conditionText} className={styles.cardIcon} />
      <span className={styles.cardTemp}>{entry.primaryTemp}</span>
      {entry.secondaryTemp && <span className={styles.cardTempSecondary}>{entry.secondaryTemp}</span>}
    </div>
  );
}

export default ForecastCard;
