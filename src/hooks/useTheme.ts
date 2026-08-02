// Persists the light/dark theme preference and reflects it onto
// document.documentElement via a data-theme attribute so index.css tokens
// swap automatically.

import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { ThemeMode } from "../types/settings";

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<ThemeMode>("theme-mode", "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  return { theme, setTheme, toggleTheme };
}
