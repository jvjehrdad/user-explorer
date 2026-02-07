import { memo } from "react";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  isFiltering: boolean;
}

/**
 * Controlled search input that reports raw keystrokes to the parent.
 * Debouncing is handled upstream (in UserExplorer via useDebounce),
 * keeping this component purely presentational.
 *
 * Wrapped with React.memo — only re-renders when its props change.
 */
export const SearchInput = memo(function SearchInput({
  value,
  onChange,
  resultCount,
  isFiltering,
}: SearchInputProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inputContainer}>
        <svg
          className={styles.searchIcon}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className={styles.input}
          placeholder="Search by name or email..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search users by name or email"
        />
        {value && (
          <button
            className={styles.clearButton}
            onClick={() => onChange("")}
            aria-label="Clear search"
            type="button"
          >
            &times;
          </button>
        )}
      </div>
      {isFiltering && (
        <p className={styles.resultCount}>
          {resultCount} {resultCount === 1 ? "user" : "users"} found
        </p>
      )}
    </div>
  );
});
