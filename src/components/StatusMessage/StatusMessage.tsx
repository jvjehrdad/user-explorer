import styles from "./StatusMessage.module.css";

interface StatusMessageProps {
  type: "loading" | "error" | "empty";
  message?: string;
}

/**
 * Reusable component for displaying loading, error, and empty states.
 * Keeps UI feedback consistent across the application.
 */
export function StatusMessage({ type, message }: StatusMessageProps) {
  return (
    <div className={`${styles.container} ${styles[type]}`} role="status">
      <span className={styles.icon}>{getIcon(type)}</span>
      <p className={styles.message}>{message ?? getDefaultMessage(type)}</p>
    </div>
  );
}

function getIcon(type: StatusMessageProps["type"]): string {
  switch (type) {
    case "loading":
      return "\u23F3";
    case "error":
      return "\u26A0\uFE0F";
    case "empty":
      return "\uD83D\uDD0D";
  }
}

function getDefaultMessage(type: StatusMessageProps["type"]): string {
  switch (type) {
    case "loading":
      return "Loading users...";
    case "error":
      return "Something went wrong. Please try again later.";
    case "empty":
      return "No users found matching your search.";
  }
}
