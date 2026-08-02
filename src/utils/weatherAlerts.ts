// Severity classification and ordering for severe weather alerts.

import type { AlertSeverity, WeatherAlert } from "../types/weather";

const SEVERITY_RANK: Record<AlertSeverity, number> = {
  minor: 0,
  moderate: 1,
  severe: 2,
  extreme: 3,
};

export function sortAlertsBySeverity(alerts: WeatherAlert[]): WeatherAlert[] {
  return [...alerts].sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]);
}

export function isHighSeverity(severity: AlertSeverity): boolean {
  return severity === "severe" || severity === "extreme";
}

export function getMostSevereAlert(alerts: WeatherAlert[]): WeatherAlert | null {
  if (alerts.length === 0) return null;
  return sortAlertsBySeverity(alerts)[0];
}
