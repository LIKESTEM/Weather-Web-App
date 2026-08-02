import { IoWarningOutline } from "react-icons/io5";
import styles from "./AlertBanner.module.css";
import { getMostSevereAlert, isHighSeverity } from "../../utils/weatherAlerts";
import type { WeatherAlert } from "../../types/weather";

interface AlertBannerProps {
  /** All active alerts for the current location; only the most severe one is displayed. */
  alerts: WeatherAlert[];
}

/** Severe weather banner shown above the current conditions card. Renders nothing if there are no alerts. */
function AlertBanner({ alerts }: AlertBannerProps) {
  const topAlert = getMostSevereAlert(alerts);
  if (!topAlert) return null;

  return (
    <div
      className={`${styles.banner} ${isHighSeverity(topAlert.severity) ? styles.bannerHigh : ""}`}
      role="alert"
    >
      <IoWarningOutline className={styles.icon} aria-hidden="true" />
      <div>
        <p className={styles.headline}>{topAlert.headline || topAlert.event}</p>
        <p className={styles.meta}>
          {topAlert.event} · {topAlert.severity} severity
        </p>
      </div>
    </div>
  );
}

export default AlertBanner;
