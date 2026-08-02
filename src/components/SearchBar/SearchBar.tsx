import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { searchLocations } from "../../services/weatherApi";
import SearchResultsList from "./SearchResultsList";
import styles from "./SearchBar.module.css";
import type { SearchResult } from "../../types/location";

interface SearchBarProps {
  /** Called with the chosen result when the user picks an item from the results dropdown. */
  onSelectLocation: (result: SearchResult) => void;
}

/** City search input with a debounced autocomplete dropdown, backed by the WeatherAPI search endpoint. */
function SearchBar({ onSelectLocation }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Debounce: wait 300ms after the user stops typing before hitting the API,
  // so every keystroke doesn't fire its own request.
  useEffect(() => {
    if (!query.trim()) return;

    const timeoutId = setTimeout(async () => {
      try {
        const matches = await searchLocations(query);
        setResults(matches);
        setIsOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  function handleQueryChange(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
    }
  }

  function handleSelect(result: SearchResult) {
    onSelectLocation(result);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  }

  return (
    <div className={styles.searchBar}>
      <div className={styles.inputWrap}>
        <IoSearchOutline className={styles.searchIcon} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          // Delayed so a click on a result (which blurs the input first) still
          // registers before the dropdown closes.
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder="Search for a city..."
          className={styles.input}
          aria-label="Search for a location"
        />
      </div>
      {isOpen && <SearchResultsList results={results} onSelect={handleSelect} />}
    </div>
  );
}

export default SearchBar;
