import styles from "./SearchInputSkeleton.module.css";

/**
 * Skeleton for the search input during loading.
 */
export function SearchInputSkeleton() {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.input} />
    </div>
  );
}
