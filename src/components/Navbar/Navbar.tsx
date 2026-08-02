import { NavLink } from "react-router-dom";
import { WiDaySunny } from "react-icons/wi";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./Navbar.module.css";
import type { SearchResult } from "../../types/location";

interface NavbarProps {
  /** Forwarded to the search bar; handled by App so a selection works the same from every page. */
  onSelectLocation: (result: SearchResult) => void;
}

/** App-wide header: brand, the location search bar (centered between brand and nav links), and page navigation. */
function Navbar({ onSelectLocation }: NavbarProps) {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand} end>
          <WiDaySunny className={styles.brandIcon} aria-hidden="true" />
          <span>Weather</span>
        </NavLink>
        <div className={styles.searchSlot}>
          <SearchBar onSelectLocation={onSelectLocation} />
        </div>
        <nav className={styles.links} aria-label="Primary">
          <NavLink
            to="/"
            end
            aria-label="Home"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ""}`}
          >
            <IoHomeOutline className={styles.linkIcon} aria-hidden="true" />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/settings"
            aria-label="Settings"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ""}`}
          >
            <IoSettingsOutline className={styles.linkIcon} aria-hidden="true" />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
