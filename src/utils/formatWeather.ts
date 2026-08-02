// Unit conversion, rounding, and date/time formatting for weather data.

import type { UnitSystem } from "../types/settings";

export function formatTemperature(tempC: number, tempF: number, units: UnitSystem): string {
  const value = units === "metric" ? tempC : tempF;
  return `${Math.round(value)}°${units === "metric" ? "C" : "F"}`;
}

export function formatWindSpeed(windKph: number, windMph: number, units: UnitSystem): string {
  const value = units === "metric" ? windKph : windMph;
  return `${Math.round(value)} ${units === "metric" ? "km/h" : "mph"}`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatHourLabel(isoTime: string): string {
  const date = new Date(isoTime.replace(" ", "T"));
  return date.toLocaleTimeString(undefined, { hour: "numeric" });
}

export function formatDayLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString(undefined, { weekday: "short" });
}

export function formatFullDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatUpdatedAt(epochSeconds: number): string {
  const date = new Date(epochSeconds * 1000);
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
