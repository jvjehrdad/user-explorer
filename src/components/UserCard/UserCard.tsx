import { memo } from "react";
import type { User } from "@/types/user";
import styles from "./UserCard.module.css";

interface UserCardProps {
  user: User;
}

/**
 * Displays a single user's information in a card layout.
 *
 * Wrapped with React.memo to prevent re-renders when the parent
 * list re-renders due to search filtering — if this card's `user`
 * prop hasn't changed, there's no reason to re-render it.
 * This matters when the user list is large.
 */
export const UserCard = memo(function UserCard({ user }: UserCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.avatar}>
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{user.name}</h3>
        <p className={styles.email}>{user.email.toLowerCase()}</p>
        <span className={styles.company}>{user.company.name}</span>
      </div>
    </article>
  );
});
