// React
import { useEffect } from "react";

export const useTrapModalFocus = (container, listOfTabbableElements) => {
  useEffect(() => {
    const trapModalFocus = (e) => {
      // Store elements that have a tab index inside modal
      const focusableElements = container?.current.querySelectorAll(
        listOfTabbableElements.join(", ")
      );
      const firstElementInPopover = focusableElements[0];
      const lastElementInPopover =
        focusableElements[focusableElements.length - 1];
      // Check for forward tabbing
      if (
        document.activeElement === lastElementInPopover &&
        e.key === "Tab" &&
        !e.shiftKey
      ) {
        e.preventDefault(); // ! Prevent the default tab behavior
        firstElementInPopover.focus();
      }
      // Check for reverse tabbing (shift + tab)
      if (
        document.activeElement === firstElementInPopover &&
        e.key === "Tab" &&
        e.shiftKey
      ) {
        e.preventDefault();
        lastElementInPopover.focus();
      }
    };
    document.addEventListener("keydown", trapModalFocus);
    return () => document.removeEventListener("keydown", trapModalFocus);
  });
};