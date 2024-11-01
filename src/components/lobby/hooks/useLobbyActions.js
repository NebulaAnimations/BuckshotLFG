// components/lobby/hooks/useLobbyActions.js
import { useApi } from './useApi';
import { useLobby } from '../context';
import { Screen } from '../utils/constants';

export function useLobbyActions() {
  const { 
    playerName, 
    region,
    lobbyConfig,
    setCurrentLobby,
    setScreen,
    setError
  } = useLobby();
  
  const { callApi } = useApi();

  const handleCreateLobby = async () => {
    if (!lobbyConfig.gameCode.trim()) {
      setError('Game code is required');
      return;
    }
    
    try {
      const data = await callApi('createLobby', {
        player_name: playerName,
        region,
        voice_requirement: lobbyConfig.voiceRequirement,
        game_code: lobbyConfig.gameCode,
        max_players: lobbyConfig.maxPlayers,
        discord_link: lobbyConfig.discordLink
      });
      setCurrentLobby(data);
      setScreen(Screen.LOBBY);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleJoinLobby = async (lobbyId) => {
    try {
      const data = await callApi('joinLobby', {
        lobby_id: lobbyId,
        player_name: playerName
      });
      setCurrentLobby(data);
      setScreen(Screen.LOBBY);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLeaveLobby = async (lobbyId) => {
    try {
      await callApi('leaveLobby', {
        lobby_id: lobbyId,
        player_name: playerName
      });
      setCurrentLobby(null);
      setScreen(Screen.MAIN);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleKickPlayer = async (lobbyId, playerToKick) => {
    try {
      const data = await callApi('kickPlayer', {
        lobby_id: lobbyId,
        player_name: playerToKick,
        host_name: playerName
      });
      setCurrentLobby(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleQuickMatch = async () => {
    try {
      const data = await callApi('quickMatch', {
        player_name: playerName,
        region,
        voice_requirement: lobbyConfig.voiceRequirement
      });
      setCurrentLobby(data);
      setScreen(Screen.LOBBY);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    handleCreateLobby,
    handleJoinLobby,
    handleLeaveLobby,
    handleKickPlayer,
    handleQuickMatch
  };
}