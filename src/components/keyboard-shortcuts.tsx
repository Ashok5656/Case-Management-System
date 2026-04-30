import { useEffect, useState } from "react";
import { Keyboard, Search, Plus, Home, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";

interface Shortcut {
  key: string;
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { key: "Ctrl+K", description: "Open Global Search", category: "Navigation" },
  { key: "Ctrl+/", description: "Show Keyboard Shortcuts", category: "Navigation" },
  { key: "Ctrl+H", description: "Go to Dashboard", category: "Navigation" },
  { key: "Ctrl+N", description: "Create New Alert", category: "Actions" },
  { key: "Ctrl+I", description: "Start Investigation", category: "Actions" },
  { key: "Ctrl+R", description: "Generate Report", category: "Actions" },
  { key: "Ctrl+S", description: "Save Current View", category: "Actions" },
  { key: "Ctrl+E", description: "Export Data", category: "Actions" },
  { key: "Ctrl+,", description: "Open Settings", category: "Settings" },
  { key: "Esc", description: "Close Dialog/Modal", category: "Navigation" },
  { key: "?", description: "Toggle Help", category: "Navigation" },
];

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Navigation":
        return Home;
      case "Actions":
        return Plus;
      case "Settings":
        return Settings;
      default:
        return Keyboard;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" aria-describedby="keyboard-shortcuts-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="size-5 text-[#2A53A0]" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription id="keyboard-shortcuts-description">
            Learn keyboard shortcuts to navigate and use the compliance dashboard more efficiently
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => {
            const Icon = getCategoryIcon(category);
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="size-4 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {category}
                  </h3>
                </div>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {shortcut.description}
                      </span>
                      <kbd className="px-3 py-1.5 rounded-[8px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-sm font-mono text-gray-900 dark:text-white shadow-sm">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Badge variant="outline" className="text-xs">Tip</Badge>
              <span>Press <kbd className="px-1.5 py-0.5 rounded-[8px] bg-gray-100 dark:bg-gray-800 border text-xs">?</kbd> anytime to open this dialog</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to listen for keyboard shortcuts
export function useKeyboardShortcuts(onOpenSearch: () => void, onOpenShortcuts: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K for search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onOpenSearch();
      }

      // Ctrl+/ or ? for shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        onOpenShortcuts();
      }

      if (e.key === "?") {
        e.preventDefault();
        onOpenShortcuts();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenSearch, onOpenShortcuts]);
}