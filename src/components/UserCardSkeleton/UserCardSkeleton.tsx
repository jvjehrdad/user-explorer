import styles from "./UserCardSkeleton.module.css";

/**
 * Skeleton placeholder matching UserCard layout for loading state.
 */
export function UserCardSkeleton() {
  return (
    <article className={styles.card} aria-hidden="true">
      <div className={styles.avatar} />
      <div className={styles.info}>
        <div className={styles.line} style={{ width: "70%" }} />
        <div className={styles.line} style={{ width: "85%" }} />
        <div className={styles.pill} />
      </div>
    </article>
  );
}
