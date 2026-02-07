import { useState, useEffect } from "react";
import type { User } from "@/types/user";

const API_URL = "https://jsonplaceholder.typicode.com/users";

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch users from the JSONPlaceholder API.
 *
 * Manages three states:
 * - loading: while the fetch is in progress
 * - error: if the fetch fails (network error, non-OK status, etc.)
 * - data: the successfully fetched users
 *
 * Uses AbortController to cancel in-flight requests on unmount,
 * preventing state updates on unmounted components.
 */
export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchUsers() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(API_URL, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data: User[] = await response.json();
        setUsers(data);
      } catch (err) {
        // Don't update state if the request was aborted (component unmounted)
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      abortController.abort();
    };
  }, []);

  return { users, isLoading, error };
}
