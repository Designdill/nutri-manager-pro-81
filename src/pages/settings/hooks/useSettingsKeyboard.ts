import { useEffect } from "react";

interface UseSettingsKeyboardProps {
  onNavigateTab: (direction: "next" | "prev") => void;
  onToggleSearch: () => void;
  onSave: () => void;
  onReset: () => void;
}

export function useSettingsKeyboard({
  onNavigateTab,
  onToggleSearch,
  onSave,
  onReset,
}: UseSettingsKeyboardProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input field
      const activeElement = document.activeElement as HTMLElement;
      const isInputActive = 
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.contentEditable === "true";

      if (isInputActive) return;

      const { key, ctrlKey, metaKey, altKey } = event;
      const cmdKey = ctrlKey || metaKey;

      switch (true) {
        // Ctrl/Cmd + S: Save settings
        case cmdKey && key === "s":
          event.preventDefault();
          onSave();
          break;

        // Ctrl/Cmd + R: Reset settings
        case cmdKey && key === "r":
          event.preventDefault();
          onReset();
          break;

        // Ctrl/Cmd + K: Toggle search
        case cmdKey && key === "k":
          event.preventDefault();
          onToggleSearch();
          break;

        // Alt + Right Arrow: Next tab
        case altKey && key === "ArrowRight":
          event.preventDefault();
          onNavigateTab("next");
          break;

        // Alt + Left Arrow: Previous tab
        case altKey && key === "ArrowLeft":
          event.preventDefault();
          onNavigateTab("prev");
          break;

        // Tab navigation with numbers (Alt + 1-7)
        case altKey && ["1", "2", "3", "4", "5", "6", "7"].includes(key):
          event.preventDefault();
          const tabIndex = parseInt(key) - 1;
          const tabs = ["profile", "appearance", "notifications", "email", "integrations", "account", "backup"];
          if (tabs[tabIndex]) {
            const tabElement = document.querySelector(`[value="${tabs[tabIndex]}"]`) as HTMLElement;
            tabElement?.click();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onNavigateTab, onToggleSearch, onSave, onReset]);
}