import styles from "./SearchBar.module.css";
import type { SearchResult } from "../../types/location";

interface SearchResultsListProps {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
}

/** Dropdown list of search matches, owned by SearchBar; renders nothing when there are no results. */
function SearchResultsList({ results, onSelect }: SearchResultsListProps) {
  if (results.length === 0) return null;

  return (
    <ul className={styles.resultsList} role="listbox">
      {results.map((result) => (
        <li key={result.id}>
          <button
            type="button"
            className={styles.resultItem}
            role="option"
            aria-selected={false}
            onClick={() => onSelect(result)}
          >
            <span className={styles.resultName}>{result.name}</span>
            <span className={styles.resultRegion}>
              {[result.region, result.country].filter(Boolean).join(", ")}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default SearchResultsList;
