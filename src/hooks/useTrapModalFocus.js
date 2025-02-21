// React
import { useEffect } from "react";

export const useTrapModalFocus = (popover, listOfTabbableElements) => {
  useEffect(() => {
    const trapModalFocus = e => {
      // Only run function if popover is open
      if (!popover.current || popover.current.getAttribute("open") === null) {
        return;
      }
      const focusableElements = Array.from(
        popover.current.querySelectorAll(listOfTabbableElements.join(", "))
      );

      if (!focusableElements.length) return;

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
  }, [popover, listOfTabbableElements]);
};
