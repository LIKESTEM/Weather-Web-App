import { WiHumidity, WiStrongWind } from "react-icons/wi";
import styles from "./CurrentConditions.module.css";
import { formatTemperature, formatWindSpeed, formatPercent, formatUpdatedAt } from "../../utils/formatWeather";
import type { CurrentWeather, WeatherLocationInfo } from "../../types/weather";
import type { UnitSystem } from "../../types/settings";

interface CurrentConditionsProps {
  location: WeatherLocationInfo;
  current: CurrentWeather;
  /** Controls whether temperature/wind values render in metric or imperial. */
  units: UnitSystem;
}

/** Card showing temperature, condition, and key stats (humidity, wind, feels-like, UV) for the active location. */
function CurrentConditions({ location, current, units }: CurrentConditionsProps) {
  return (
    <section className={styles.conditions} aria-label="Current conditions">
      <div className={styles.header}>
        <div>
          <p className={styles.locationName}>
            {location.name}
            {location.region ? `, ${location.region}` : ""}
          </p>
          <p className={styles.updatedAt}>Updated {formatUpdatedAt(current.lastUpdatedEpoch)}</p>
        </div>
        <img
          src={`https:${current.condition.icon}`}
          alt={current.condition.text}
          className={styles.conditionIcon}
        />
      </div>

      <div className={styles.tempRow}>
        <span className={styles.temperature}>
          {formatTemperature(current.tempC, current.tempF, units)}
        </span>
        <span className={styles.conditionText}>{current.condition.text}</span>
      </div>

      <dl className={styles.statsGrid}>
        <div className={styles.stat}>
          <dt>
            <WiHumidity className={styles.statIcon} aria-hidden="true" />
            Humidity
          </dt>
          <dd>{formatPercent(current.humidity)}</dd>
        </div>
        <div className={styles.stat}>
          <dt>
            <WiStrongWind className={styles.statIcon} aria-hidden="true" />
            Wind
          </dt>
          <dd>{formatWindSpeed(current.windKph, current.windMph, units)}</dd>
        </div>
        <div className={styles.stat}>
          <dt>Feels like</dt>
          <dd>{formatTemperature(current.feelsLikeC, current.feelsLikeF, units)}</dd>
        </div>
        <div className={styles.stat}>
          <dt>UV Index</dt>
          <dd>{current.uv}</dd>
        </div>
      </dl>
    </section>
  );
}

export default CurrentConditions;
