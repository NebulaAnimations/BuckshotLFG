// components/lobby/screens/MainScreen.jsx
import React, { useState, useEffect } from 'react';
import { Terminal, Users, Mic, Globe2, Plus, Gamepad, RefreshCw } from 'lucide-react';
import { useLobby } from '../context';
import { Screen, Regions, REFRESH_INTERVAL } from '../utils/constants';
import { Button } from '../components';
import { useLobbyActions } from '../hooks';
import { useApi } from '../hooks/useApi';

const secondsToDisplay = (ms) => Math.ceil(ms / 1000);

export function MainScreen() {
  const { 
    setScreen,
    playerName = 'Player',
    region = 'NA',
    setError
  } = useLobby();

  const [lobbyList, setLobbyList] = useState([]);
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(secondsToDisplay(REFRESH_INTERVAL));
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { handleJoinLobby, handleQuickMatch } = useLobbyActions();
  const { callApi } = useApi();

  const fetchLobbies = async () => {
    setIsRefreshing(true);
    try {
      const response = await callApi('getLobbies', {}, { silent: true });
      console.log('Raw API response:', response);
      
      if (Array.isArray(response)) {
        const processedLobbies = response
          .filter(lobby => lobby && lobby.id)
          .map(lobby => ({
            id: lobby.id,
            host: lobby.host || 'Unknown',
            region: lobby.region || 'NA',
            voice_requirement: lobby.voice_requirement || 'optional',
            created_at: Number(lobby.created_at) || Date.now(),
            game_code: lobby.game_code || 'Unknown',
            max_players: Number(lobby.max_players) || 4,
            players: Array.isArray(lobby.players) ? lobby.players : []
          }))
          .sort((a, b) => b.created_at - a.created_at);
        
        console.log('Processed lobbies:', processedLobbies);
        setLobbyList(processedLobbies);
      } else {
        console.error('Invalid response format:', response);
        setLobbyList([]);
      }
    } catch (err) {
      console.error('Failed to fetch lobbies:', err);
      setError('Failed to fetch lobbies. Please try again.');
      setLobbyList([]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLobbies();
  }, []);

  // Refresh timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilRefresh(prev => {
        if (prev <= 1) {
          fetchLobbies();
          return secondsToDisplay(REFRESH_INTERVAL);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Manual refresh handler
  const handleManualRefresh = async () => {
    if (!isRefreshing) {
      await fetchLobbies();
      setTimeUntilRefresh(secondsToDisplay(REFRESH_INTERVAL));
    }
  };

  // Format time display
  const formatTimeDisplay = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // Get available lobbies that aren't full
  const availableLobbies = lobbyList.filter(lobby => 
    lobby.players.length < lobby.max_players
  );

  const renderLobby = (lobby) => (
    <div key={lobby.id} className="border border-green-500 p-2">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-bold">{lobby.game_code}</div>
          <div className="text-sm text-green-700">Host: {lobby.host}</div>
        </div>
        <Button
          onClick={() => handleJoinLobby(lobby.id)}
          disabled={lobby.players.length >= lobby.max_players}
          className="ml-4"
        >
          Join
        </Button>
      </div>
      
      <div className="flex gap-4 text-sm text-green-700">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {lobby.players.length}/{lobby.max_players}
        </div>
        <div className="flex items-center gap-1">
          <Globe2 className="w-4 h-4" />
          {Regions[lobby.region] || 'Unknown'}
        </div>
        <div className="flex items-center gap-1">
          <Mic className="w-4 h-4" />
          {lobby.voice_requirement}
        </div>
      </div>
    </div>
  );

  return (
    <div className="border border-green-500 p-4">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl flex items-center gap-2">
          <Terminal className="w-6 h-6" />
          Available Lobbies
        </h2>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-2 py-1"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {formatTimeDisplay(timeUntilRefresh)}
          </Button>
          <div className="text-sm">
            Playing as: {playerName}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => setScreen?.(Screen.CONFIG)}
            className="flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Host Lobby [H]
          </Button>
          
          <Button
            onClick={handleQuickMatch}
            disabled={availableLobbies.length === 0}
            className="flex items-center justify-center gap-2"
          >
            <Gamepad className="w-4 h-4" />
            Quick Match {availableLobbies.length === 0 ? '(No Lobbies)' : '[Q]'}
          </Button>
        </div>

        {/* Lobbies List */}
        <div className="space-y-2">
          {lobbyList.length === 0 ? (
            <div className="text-center py-4 text-green-700 border border-green-500 p-2">
              No lobbies available in {Regions[region]}
            </div>
          ) : (
            lobbyList.map(renderLobby)
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-green-700 text-center">
        Press H to host, Q for quick match
      </div>
    </div>
  );
}