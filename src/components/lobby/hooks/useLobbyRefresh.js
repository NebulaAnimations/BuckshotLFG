// components/lobby/hooks/useLobbyRefresh.js
import { useEffect } from 'react';
import { useInterval } from 'react-use';
import { useLobby } from '../context';
import { Screen, REFRESH_INTERVAL, LOBBY_REFRESH_INTERVAL } from '../utils/constants';
import { useApi } from './useApi';

export function useLobbyRefresh() {
  const { 
    screen, 
    setLobbies, 
    currentLobby,
    setCurrentLobby,
    setScreen,
    setError
  } = useLobby();
  
  const { callApi } = useApi();

  const fetchLobbies = async () => {
    try {
      // Use silent loading for background refreshes
      const data = await callApi('getLobbies', {}, { silent: true });
      setLobbies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch lobbies:', err);
      setError('Failed to fetch lobbies. Please try again.');
    }
  };

  const fetchLobbyDetails = async () => {
    try {
      if (!currentLobby?.id) return;
      
      // Use silent loading for background refreshes
      const data = await callApi('getLobby', { id: currentLobby.id }, { silent: true });
      if (!data.id) {
        setScreen(Screen.MAIN);
        setCurrentLobby(null);
        setError('Lobby no longer exists');
      } else {
        setCurrentLobby(data);
      }
    } catch (err) {
      console.error('Failed to fetch lobby details:', err);
      setScreen(Screen.MAIN);
      setCurrentLobby(null);
      setError('Failed to fetch lobby details. Returning to main menu.');
    }
  };

  // Periodic refreshes
  useInterval(() => {
    if (screen === Screen.MAIN) {
      fetchLobbies();
    }
  }, REFRESH_INTERVAL);

  useInterval(() => {
    if (screen === Screen.LOBBY && currentLobby) {
      fetchLobbyDetails();
    }
  }, LOBBY_REFRESH_INTERVAL);

  // Initial lobbies fetch
  useEffect(() => {
    if (screen === Screen.MAIN) {
      fetchLobbies();
    }
  }, [screen]);

  return {
    fetchLobbies,
    fetchLobbyDetails
  };
}