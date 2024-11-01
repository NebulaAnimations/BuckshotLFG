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
    setError,
    playerName,
    setKickMessage
  } = useLobby();
  
  const { callApi } = useApi();

  const fetchLobbies = async () => {
    try {
      const data = await callApi('getLobbies', {}, { silent: true });
      console.log('Raw lobbies data:', data);
      
      if (!Array.isArray(data)) {
        console.error('Invalid lobbies data format:', data);
        setLobbies([]);
        return;
      }

      // Process each lobby
      const processedLobbies = data.map(lobby => ({
        id: lobby.id,
        host: lobby.host,
        region: lobby.region,
        voice_requirement: lobby.voice_requirement || 'optional',
        discord_link: lobby.discord_link || '',
        created_at: Number(lobby.created_at) || Date.now(),
        last_active: Number(lobby.last_active) || Date.now(),
        game_code: lobby.game_code,
        max_players: Number(lobby.max_players) || 4,
        players: Array.isArray(lobby.players) ? lobby.players : []
      }));

      console.log('Processed lobbies:', processedLobbies);
      setLobbies(processedLobbies);
    } catch (err) {
      console.error('Failed to fetch lobbies:', err);
      if (!err.message?.includes('API URL')) {
        setError('Failed to fetch lobbies. Please try again.');
      }
    }
  };

  const fetchLobbyDetails = async () => {
    if (!currentLobby?.id) return;
    
    try {
      const data = await callApi('getLobby', { id: currentLobby.id }, { silent: true });
      
      // Check if lobby exists
      if (!data?.id) {
        setScreen(Screen.MAIN);
        setCurrentLobby(null);
        setError('Lobby no longer exists');
        return;
      }

      // Check if player has been kicked
      if (!data.players.includes(playerName)) {
        setScreen(Screen.MAIN);
        setCurrentLobby(null);
        setKickMessage('You have been kicked from the lobby');
        return;
      }

      const processedLobby = {
        id: data.id,
        host: data.host,
        region: data.region,
        voice_requirement: data.voice_requirement || 'optional',
        discord_link: data.discord_link || '',
        created_at: Number(data.created_at) || Date.now(),
        last_active: Number(data.last_active) || Date.now(),
        game_code: data.game_code,
        max_players: Number(data.max_players) || 4,
        players: Array.isArray(data.players) ? data.players : []
      };

      setCurrentLobby(processedLobby);
    } catch (err) {
      console.error('Failed to fetch lobby details:', err);
      if (!err.message?.includes('API URL')) {
        setError('Failed to fetch lobby details. Returning to main menu.');
        setScreen(Screen.MAIN);
        setCurrentLobby(null);
      }
    }
  };

  // Initial load
  useEffect(() => {
    if (screen === Screen.MAIN) {
      console.log('Initial lobbies fetch');
      fetchLobbies();
    }
  }, [screen]);

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

  return { fetchLobbies, fetchLobbyDetails };
}