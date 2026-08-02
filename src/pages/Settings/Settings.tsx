import { PageTitle, SectionHeading, MutedText } from "../../components/Text/Text";
import ToggleSwitch from "../../components/Inputs/ToggleSwitch";
import { useUnits } from "../../hooks/useUnits";
import styles from "./Settings.module.css";
import type { ThemeMode } from "../../types/settings";

interface SettingsProps {
  // Received from App (not read via useTheme() here) so the data-theme
  // attribute stays in sync no matter which route is mounted — see App.tsx.
  theme: ThemeMode;
  toggleTheme: () => void;
}

/** Theme and unit preference screen; units are read locally since they don't need to be shared with the Navbar. */
function Settings({ theme, toggleTheme }: SettingsProps) {
  const { units, toggleUnits } = useUnits();

  return (
    <div className={styles.settings}>
      <PageTitle>Settings</PageTitle>

      <section className={styles.row}>
        <div>
          <SectionHeading>Theme</SectionHeading>
          <MutedText>Switch between light and dark mode.</MutedText>
        </div>
        <ToggleSwitch
          checked={theme === "dark"}
          onChange={toggleTheme}
          offLabel="Light"
          onLabel="Dark"
          aria-label="Toggle dark theme"
        />
      </section>

      <section className={styles.row}>
        <div>
          <SectionHeading>Units</SectionHeading>
          <MutedText>Choose between Celsius and Fahrenheit.</MutedText>
        </div>
        <ToggleSwitch
          checked={units === "imperial"}
          onChange={toggleUnits}
          offLabel="°C"
          onLabel="°F"
          aria-label="Toggle temperature units"
        />
      </section>
    </div>
  );
}

export default Settings;
