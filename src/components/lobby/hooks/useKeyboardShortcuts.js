// components/lobby/hooks/useKeyboardShortcuts.js
import { useEffect } from 'react';
import { useLobby } from '../context';
import { Screen } from '../utils/constants';
import { useLobbyActions } from './useLobbyActions';

export function useKeyboardShortcuts() {
  const { 
    screen, 
    setScreen, 
    playerName, 
    loading,
    lobbyConfig,
    currentLobby 
  } = useLobby();

  const { 
    handleCreateLobby, 
    handleLeaveLobby,
    handleQuickMatch 
  } = useLobbyActions();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (loading) return;

      switch (screen) {
        case Screen.WELCOME:
          if (e.key === 'Enter' && playerName.trim()) {
            setScreen(Screen.MAIN);
            e.preventDefault();
          }
          break;

        case Screen.MAIN:
          if (e.key.toLowerCase() === 'h') {
            setScreen(Screen.CONFIG);
            e.preventDefault();
          } else if (e.key.toLowerCase() === 'q') {
            handleQuickMatch();
            e.preventDefault();
          }
          break;

        case Screen.CONFIG:
          if (e.key === 'Escape') {
            setScreen(Screen.MAIN);
            e.preventDefault();
          } else if (e.key === 'Enter' && lobbyConfig.gameCode.trim()) {
            handleCreateLobby();
            e.preventDefault();
          }
          break;

        case Screen.LOBBY:
          if (e.key === 'Escape' && currentLobby) {
            handleLeaveLobby(currentLobby.id);
            e.preventDefault();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [screen, playerName, lobbyConfig, loading, currentLobby]);
}