// React
import { useEffect } from "react";

export const useTrapModalFocus = popover => {
  useEffect(() => {
    const trapModalFocus = e => {
      // Only run function if popover is open
      if (popover.current.getAttribute("open") === null) {
        return;
      }
      // Store elements that can receive focus inside modal
      const focusableElements = Array.from(
        popover.current.querySelectorAll("*")
      ).filter(element => element.tabIndex >= 0);

      const firstFocusableElementInPopover = focusableElements[0];
      const lastFocusableElementInPopover =
        focusableElements[focusableElements.length - 1];

      // Check for forward tabbing
      if (
        document.activeElement === lastFocusableElementInPopover &&
        e.key === "Tab" &&
        !e.shiftKey
      ) {
        e.preventDefault(); // ! Prevent the default tab behavior
        firstFocusableElementInPopover.focus();
      }
      // Check for reverse tabbing (shift + tab)
      if (
        document.activeElement === firstFocusableElementInPopover &&
        e.key === "Tab" &&
        e.shiftKey
      ) {
        e.preventDefault();
        lastFocusableElementInPopover.focus();
      }
    };
    document.addEventListener("keydown", trapModalFocus);
    return () => document.removeEventListener("keydown", trapModalFocus);
  });
};
