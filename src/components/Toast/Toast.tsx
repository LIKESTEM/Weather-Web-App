import { useEffect } from "react";
import styles from "./Toast.module.css";

interface ToastProps {
  message: string;
  /** Visual style; "error" is used for failed requests, "info" for confirmations like "Added X to your locations." */
  variant?: "info" | "error";
  /** Called both when the dismiss button is clicked and automatically after `durationMs`. */
  onDismiss: () => void;
  durationMs?: number;
}

/** Auto-dismissing status/confirmation notification, stacked in a fixed corner host by the page that renders it. */
function Toast({ message, variant = "info", onDismiss, durationMs = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [onDismiss, durationMs]);

  return (
    <div className={`${styles.toast} ${variant === "error" ? styles.toastError : ""}`} role="status">
      <span>{message}</span>
      <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}

export default Toast;
