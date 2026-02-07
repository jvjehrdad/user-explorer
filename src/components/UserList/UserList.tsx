import type { User } from "@/types/user";
import { UserCard } from "@/components/UserCard/UserCard";
import styles from "./UserList.module.css";

interface UserListProps {
  users: User[];
}

/**
 * Renders a responsive grid of UserCards.
 *
 * This component is intentionally not wrapped with React.memo because
 * it receives a new `users` array reference every time the filtered
 * results change — memo would be ineffective here. The individual
 * UserCard children are memo'd instead, which is more targeted.
 */
export function UserList({ users }: UserListProps) {
  return (
    <ul className={styles.grid} role="list">
      {users.map((user) => (
        <li key={user.id} className={styles.item}>
          <UserCard user={user} />
        </li>
      ))}
    </ul>
  );
}
