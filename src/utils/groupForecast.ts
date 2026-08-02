// Groups hourly forecast data into daily buckets and trims it down to the
// subset of hours worth showing in a compact hourly strip.

import type { ForecastDay, HourlyForecast } from "../types/weather";

export function getUpcomingHours(days: ForecastDay[], count = 8): HourlyForecast[] {
  const nowEpoch = Math.floor(Date.now() / 1000);
  const allHours = days.flatMap((day) => day.hours);
  const upcoming = allHours.filter((hour) => hour.timeEpoch >= nowEpoch);
  return (upcoming.length > 0 ? upcoming : allHours).slice(0, count);
}

export function groupHoursByDate(hours: HourlyForecast[]): Record<string, HourlyForecast[]> {
  return hours.reduce<Record<string, HourlyForecast[]>>((groups, hour) => {
    const date = hour.time.split(" ")[0];
    (groups[date] ??= []).push(hour);
    return groups;
  }, {});
}
