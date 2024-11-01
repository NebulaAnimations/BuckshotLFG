import React, { useState } from 'react';
import { Terminal, Users, Mic, Globe2, Plus, Gamepad } from 'lucide-react';
import { useLobby } from '../context';
import { Screen, Regions, VoiceSettings } from '../utils/constants';
import { Button } from '../components';
import { useLobbyActions } from '../hooks';

export function MainScreen() {
  const { 
    lobbies,
    setScreen,
    playerName,
    region 
  } = useLobby();

  const { handleJoinLobby, handleQuickMatch } = useLobbyActions();
  const [filter, setFilter] = useState('');

  const filteredLobbies = lobbies.filter(lobby => 
    lobby.game_code.toLowerCase().includes(filter.toLowerCase()) ||
    lobby.host.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="border border-green-500 p-4">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl flex items-center gap-2">
          <Terminal className="w-6 h-6" />
          Available Lobbies
        </h2>
        <div className="text-sm">
          Playing as: {playerName}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => setScreen(Screen.CONFIG)}
            className="flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Host Lobby [H]
          </Button>
          
          <Button
            onClick={handleQuickMatch}
            className="flex items-center justify-center gap-2"
          >
            <Gamepad className="w-4 h-4" />
            Quick Match [Q]
          </Button>
        </div>

        <input
          type="text"
          className="w-full bg-black border border-green-500 p-2 
                     focus:outline-none focus:border-green-400"
          placeholder="Filter lobbies by game code or host..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <div className="space-y-2">
          {filteredLobbies.length === 0 ? (
            <div className="text-center py-4 text-green-700">
              No lobbies available in {Regions[region]}
            </div>
          ) : (
            filteredLobbies.map(lobby => (
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
                    {lobby.players.length}/{lobby.max_players || 4}
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe2 className="w-4 h-4" />
                    {Regions[lobby.region]}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mic className="w-4 h-4" />
                    {lobby.voice_requirement}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-green-700 text-center">
        Press H to host, Q for quick match
      </div>
    </div>
  );
}

export default MainScreen;