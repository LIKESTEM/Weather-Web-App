import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Text.module.css";

interface TextProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

// Typography primitives shared across pages, so heading/body styles stay
// consistent without every page redefining its own font size/weight rules.

/** Top-level page heading (renders an `<h1>`). */
export function PageTitle({ children, className, ...rest }: TextProps) {
  return (
    <h1 className={`${styles.pageTitle} ${className ?? ""}`} {...rest}>
      {children}
    </h1>
  );
}

/** Heading for a card/section within a page (renders an `<h2>`). */
export function SectionHeading({ children, className, ...rest }: TextProps) {
  return (
    <h2 className={`${styles.sectionHeading} ${className ?? ""}`} {...rest}>
      {children}
    </h2>
  );
}

/** Standard body paragraph text. */
export function BodyText({ children, className, ...rest }: TextProps) {
  return (
    <p className={`${styles.bodyText} ${className ?? ""}`} {...rest}>
      {children}
    </p>
  );
}

/** Lower-emphasis paragraph text, used for hints/status messages. */
export function MutedText({ children, className, ...rest }: TextProps) {
  return (
    <p className={`${styles.mutedText} ${className ?? ""}`} {...rest}>
      {children}
    </p>
  );
}
