import { useState } from "react";
import ForecastToggle from "./ForecastToggle";
import ForecastCard, { type ForecastCardData } from "./ForecastCard";
import { formatDayLabel, formatHourLabel, formatTemperature } from "../../utils/formatWeather";
import { getUpcomingHours } from "../../utils/groupForecast";
import styles from "./ForecastView.module.css";
import type { ForecastDay } from "../../types/weather";
import type { UnitSystem } from "../../types/settings";

interface ForecastViewProps {
  days: ForecastDay[];
  units: UnitSystem;
}

/** Forecast section: owns the hourly/daily toggle state and formats the raw forecast data into cards for each mode. */
function ForecastView({ days, units }: ForecastViewProps) {
  const [mode, setMode] = useState<"daily" | "hourly">("daily");

  // Each ForecastDay already carries its own hours, so daily and hourly
  // cards are just two different projections of the same `days` data.
  const dailyCards: ForecastCardData[] = days.map((day) => ({
    id: day.id,
    label: formatDayLabel(day.date),
    iconUrl: `https:${day.condition.icon}`,
    conditionText: day.condition.text,
    primaryTemp: formatTemperature(day.maxTempC, day.maxTempF, units),
    secondaryTemp: formatTemperature(day.minTempC, day.minTempF, units),
  }));

  const hourlyCards: ForecastCardData[] = getUpcomingHours(days).map((hour) => ({
    id: hour.id,
    label: formatHourLabel(hour.time),
    iconUrl: `https:${hour.condition.icon}`,
    conditionText: hour.condition.text,
    primaryTemp: formatTemperature(hour.tempC, hour.tempF, units),
  }));

  const cards = mode === "daily" ? dailyCards : hourlyCards;

  return (
    <section className={styles.forecast} aria-label="Forecast">
      <div className={styles.forecastHeader}>
        <h2 className={styles.forecastTitle}>Forecast</h2>
        <ForecastToggle mode={mode} onChange={setMode} />
      </div>
      <div className={styles.cardRow}>
        {cards.map((entry) => (
          <ForecastCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}

export default ForecastView;
