import { useCallback, useRef } from 'react';

/**
 * Custom hook that returns a debounced version of the provided callback function.
 *
 * @param {Function} callback - The callback function to be debounced.
 * @param {number} delay - The delay in milliseconds before invoking the callback.
 * @returns {Function} - The debounced callback function.
 */
export default function useDebouncedCallback(callback, delay) {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}
