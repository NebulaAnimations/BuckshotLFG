// components/lobby/screens/LobbyScreen.jsx
import React, { useEffect } from 'react';
import { Copy, UserMinus, Terminal, Users, Mic, Globe2 } from 'lucide-react';
import { useLobby } from '../context';
import { Screen, Regions, LOBBY_REFRESH_INTERVAL } from '../utils/constants';
import { Button, CountdownTimer } from '../components';
import { useLobbyActions, useLobbyRefresh } from '../hooks';

export function LobbyScreen() {
  const { 
    currentLobby,
    playerName,
    codeCopied,
    setCodeCopied,
    setScreen,
    setError
  } = useLobby();

  const { handleLeaveLobby, handleKickPlayer } = useLobbyActions();
  const { fetchLobbyDetails } = useLobbyRefresh();

  // Add immediate refresh after kick
  const handleKick = async (lobbyId, playerToKick) => {
    try {
      await handleKickPlayer(lobbyId, playerToKick);
      
      // Show temporary kick confirmation message
      setError(`${playerToKick} has been kicked from the lobby`);
      setTimeout(() => setError(''), 3000);
      
      // Immediately fetch updated lobby details
      await fetchLobbyDetails();
    } catch (err) {
      console.error('Error kicking player:', err);
      setError(err.message);
    }
  };

  const copyGameCode = () => {
    if (currentLobby?.game_code) {
      navigator.clipboard.writeText(currentLobby.game_code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  // Add effect to handle lobby updates
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (currentLobby?.id) {
        fetchLobbyDetails();
      }
    }, LOBBY_REFRESH_INTERVAL);

    return () => clearInterval(refreshInterval);
  }, [currentLobby?.id]);

  // Redirect if no lobby data
  useEffect(() => {
    if (!currentLobby && setScreen) {
      setScreen(Screen.MAIN);
    }
  }, [currentLobby, setScreen]);

  // Early return with loading state if no lobby data
  if (!currentLobby) {
    return (
      <div className="border border-green-500 p-4 text-center">
        <div className="animate-pulse">Loading lobby data...</div>
      </div>
    );
  }

  return (
    <div className="border border-green-500 p-4">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl flex items-center gap-2">
          <Terminal className="w-6 h-6" />
          Lobby #{currentLobby.id}
        </h2>
        <div className="flex flex-col items-end gap-1">
          <div className="text-sm">Host: {currentLobby.host}</div>
          <CountdownTimer 
            interval={LOBBY_REFRESH_INTERVAL} 
            onTick={fetchLobbyDetails}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="border border-green-500 p-2">
          <div className="mb-2 flex items-center justify-between">
            <span>Game Lobby Code:</span>
            <button
              onClick={copyGameCode}
              className="flex items-center gap-2 hover:text-green-300"
            >
              <span>{currentLobby.game_code}</span>
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {codeCopied && (
            <div className="text-sm text-green-300">Code copied!</div>
          )}
        </div>

        <div className="border border-green-500 p-2">
          <div className="mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Players ({currentLobby.players.length}/{currentLobby.max_players || 4}):
          </div>
          {currentLobby.players.map((player, index) => (
            <div key={`${player}-${index}`} className="flex items-center justify-between py-1">
              <div className="flex items-center">
                <span className="w-8">{index + 1}.</span>
                <span>{player}</span>
                {player === currentLobby.host && (
                  <span className="ml-2 text-yellow-500">(Host)</span>
                )}
              </div>
              {currentLobby.host === playerName && player !== playerName && (
                <button
                  onClick={() => handleKick(currentLobby.id, player)}
                  className="text-red-500 hover:text-red-300"
                  title="Kick player"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="border border-green-500 p-2">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4" />
            Region: {Regions[currentLobby.region]}
          </div>
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Voice: {currentLobby.voice_requirement}
          </div>
          {currentLobby.discord_link && (
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4" />
              Discord: {currentLobby.discord_link}
            </div>
          )}
        </div>

        <Button
          onClick={() => handleLeaveLobby(currentLobby.id)}
          className="w-full"
          variant="danger"
        >
          Leave Lobby [ESC]
        </Button>
      </div>

      <div className="mt-4 text-sm text-green-700 text-center">
        Press ESC to leave lobby
      </div>
    </div>
  );
}