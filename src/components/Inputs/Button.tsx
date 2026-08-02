import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Input.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style; defaults to "primary". Lets callers reuse this one component instead of styling one-off buttons. */
  variant?: "primary" | "outline" | "ghost";
  children: ReactNode;
}

/** Generic button primitive shared across the app; standard `<button>` props (onClick, disabled, type, ...) pass through via `...rest`. */
function Button({ variant = "primary", children, className, ...rest }: ButtonProps) {
  const variantClass =
    variant === "primary" ? styles.primary : variant === "outline" ? styles.outline : styles.ghost;

  return (
    <button className={`${styles.button} ${variantClass} ${className ?? ""}`} {...rest}>
      {children}
    </button>
  );
}

export default Button;
