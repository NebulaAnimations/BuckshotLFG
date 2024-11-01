import { useEffect } from 'react';
import { Screen } from '../utils/constants';

export const useKeyboardShortcuts = (
  screen,
  handlers = {},
  options = { disabled: false }
) => {
  useEffect(() => {
    if (options.disabled) return;

    const handleKeyPress = (e) => {
      // Don't handle shortcuts if we're in an input
      if (e.target.tagName === 'INPUT') return;

      // Global shortcuts that work on any screen
      switch (e.key.toLowerCase()) {
        case 'escape':
          handlers.onEscape?.(e);
          e.preventDefault();
          break;
        case 'f1':
          handlers.onHelp?.(e);
          e.preventDefault();
          break;
        case 'f5':
          handlers.onRefresh?.(e);
          e.preventDefault();
          break;
      }

      // Screen-specific shortcuts
      switch (screen) {
        case Screen.WELCOME:
          if (e.key === 'Enter') {
            handlers.onEnterWelcome?.(e);
            e.preventDefault();
          }
          break;

        case Screen.MAIN:
          switch (e.key.toLowerCase()) {
            case 'h':
              handlers.onHost?.(e);
              e.preventDefault();
              break;
            case 'q':
              handlers.onQuickMatch?.(e);
              e.preventDefault();
              break;
            case 'r':
              handlers.onRefresh?.(e);
              e.preventDefault();
              break;
          }
          break;

        case Screen.CONFIG:
          if (e.key === 'Enter') {
            handlers.onCreateLobby?.(e);
            e.preventDefault();
          }
          break;

        case Screen.LOBBY:
          switch (e.key.toLowerCase()) {
            case 'c':
              handlers.onCopyCode?.(e);
              e.preventDefault();
              break;
            case 'l':
              handlers.onLeaveLobby?.(e);
              e.preventDefault();
              break;
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [screen, handlers, options.disabled]);
};