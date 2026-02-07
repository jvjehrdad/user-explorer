import { useState, useEffect } from "react";

/**
 * Delays updating a value until after `delay` ms have passed
 * since the last change. Useful for search inputs where we want
 * to avoid filtering on every keystroke.
 *
 * @param value - The raw value to debounce
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
