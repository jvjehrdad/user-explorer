"use client";

import { useState, useMemo, useCallback } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchInput } from "@/components/SearchInput/SearchInput";
import { UserList } from "@/components/UserList/UserList";
import { StatusMessage } from "@/components/StatusMessage/StatusMessage";
import { SearchInputSkeleton } from "@/components/SearchInputSkeleton/SearchInputSkeleton";
import { UserCardSkeleton } from "@/components/UserCardSkeleton/UserCardSkeleton";
import styles from "./UserExplorer.module.css";

const SKELETON_CARD_COUNT = 9;

/**
 * Main orchestrator component — the only "use client" boundary in the app.
 *
 * Performance decisions documented here:
 *
 * 1. useDebounce(query, 300): prevents filtering & re-rendering the list
 *    on every keystroke. The raw query updates the input immediately (no lag),
 *    but the expensive filter only runs after the user stops typing for 300ms.
 *
 * 2. useMemo(filteredUsers): the Array.filter + toLowerCase operation is only
 *    recalculated when `users` or `debouncedQuery` actually change, not on
 *    every render caused by unrelated state updates.
 *
 * 3. useCallback(handleSearchChange): stabilizes the function reference passed
 *    to SearchInput, so React.memo on SearchInput can effectively skip renders
 *    when only the filtered list changes (not the search handler).
 *
 * 4. React.memo on UserCard (in UserCard.tsx): individual cards skip re-renders
 *    when their specific user prop hasn't changed, even though the parent list
 *    re-renders with new filtered results.
 */
export function UserExplorer() {
  const { users, isLoading, error } = useUsers();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const filteredUsers = useMemo(() => {
    if (!debouncedQuery) return users;

    const lowerQuery = debouncedQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
    );
  }, [users, debouncedQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>User Explorer</h1>
          <p className={styles.subtitle}>
            Browse and search through the user directory
          </p>
        </header>
        <SearchInputSkeleton />
        <div className={styles.skeletonGrid} role="status" aria-label="Loading users">
          {Array.from({ length: SKELETON_CARD_COUNT }, (_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <StatusMessage type="error" message={error} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>User Explorer</h1>
        <p className={styles.subtitle}>
          Browse and search through the user directory
        </p>
      </header>

      <SearchInput
        value={query}
        onChange={handleSearchChange}
        resultCount={filteredUsers.length}
        isFiltering={debouncedQuery.length > 0}
      />

      {filteredUsers.length === 0 ? (
        <StatusMessage type="empty" />
      ) : (
        <UserList users={filteredUsers} />
      )}
    </div>
  );
}
