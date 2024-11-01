// components/lobby/screens/ConfigScreen.jsx
import React from 'react';
import { Settings, Terminal, Users, Mic, Globe2 } from 'lucide-react';
import { useLobby } from '../context';
import { Screen, MIN_PLAYERS_LIMIT, MAX_PLAYERS_LIMIT } from '../utils/constants';
import { InputField, Select, Button } from '../components';
import { useLobbyActions } from '../hooks/useLobbyActions';

export function ConfigScreen() {
  const { 
    lobbyConfig, 
    setLobbyConfig,
    setScreen,
    loading 
  } = useLobby();

  const { handleCreateLobby } = useLobbyActions();

  const handleConfigChange = (field, value) => {
    setLobbyConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMaxPlayersChange = (e) => {
    const value = e.target.value;
    const numValue = parseInt(value) || MIN_PLAYERS_LIMIT;
    const clampedValue = Math.min(MAX_PLAYERS_LIMIT, Math.max(MIN_PLAYERS_LIMIT, numValue));
    handleConfigChange('maxPlayers', clampedValue);
  };

  const voiceOptions = [
    { value: 'optional', label: 'Voice Chat Optional' },
    { value: 'required', label: 'Voice Chat Required' },
    { value: 'no-mic', label: 'No Microphone' }
  ];

  return (
    <div className="border border-green-500 p-4">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Configure Lobby
        </h2>
      </div>

      <div className="space-y-4">
        <InputField
          label={
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Game Lobby Code:
            </div>
          }
          value={lobbyConfig.gameCode}
          onChange={(e) => handleConfigChange('gameCode', e.target.value.toUpperCase())}
          placeholder="Enter game lobby code"
          maxLength={50}
        />

        <div className={`${InputField({}).props.className}`}>
          <label className="block mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Maximum Players:
          </label>
          <input
            type="number"
            className="w-full bg-black border border-green-500 p-2 
                     focus:outline-none focus:border-green-400
                     [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={lobbyConfig.maxPlayers}
            onChange={handleMaxPlayersChange}
            min={MIN_PLAYERS_LIMIT}
            max={MAX_PLAYERS_LIMIT}
          />
        </div>

        <Select
          label={
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Voice Requirement:
            </div>
          }
          value={lobbyConfig.voiceRequirement}
          onChange={(e) => handleConfigChange('voiceRequirement', e.target.value)}
          options={voiceOptions}
        />

        <InputField
          label={
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4" />
              Discord Link (Optional):
            </div>
          }
          value={lobbyConfig.discordLink}
          onChange={(e) => handleConfigChange('discordLink', e.target.value)}
          placeholder="https://discord.gg/..."
        />

        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button
            onClick={() => setScreen(Screen.MAIN)}
            variant="secondary"
          >
            Back [ESC]
          </Button>
          
          <Button
            onClick={handleCreateLobby}
            disabled={!lobbyConfig.gameCode.trim() || loading}
          >
            Create Lobby [ENTER]
          </Button>
        </div>
      </div>

      <div className="mt-4 text-sm text-green-700 text-center">
        Press ESC to go back, ENTER to create lobby
      </div>
    </div>
  );
}