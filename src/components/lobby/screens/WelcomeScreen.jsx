// components/lobby/screens/WelcomeScreen.jsx
import React from 'react';
import { Terminal } from 'lucide-react';
import { useLobby } from '../context';
import { Screen, Regions } from '../utils/constants';
import { InputField, Select, Button } from '../components';

export function WelcomeScreen() {
  const { 
    playerName, 
    setPlayerName,
    region,
    setRegion,
    setScreen 
  } = useLobby();

  const handleContinue = () => {
    if (playerName.trim()) {
      setScreen(Screen.MAIN);
    }
  };

  const regionOptions = Object.entries(Regions).map(([value, label]) => ({
    value,
    label
  }));

  return (
    <div className="border border-green-500 p-4">
      <h2 className="text-xl mb-6 flex items-center gap-2">
        <Terminal className="w-6 h-6" />
        DOS Lobby System v1.0
      </h2>
      
      <div className="space-y-4">
        <InputField
          label="Enter your name:"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          maxLength={20}
          autoFocus
          placeholder="Your name..."
        />

        <Select
          label="Select region:"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          options={regionOptions}
        />

        <Button
          onClick={handleContinue}
          disabled={!playerName.trim()}
          className="w-full"
        >
          Enter System [PRESS ENTER]
        </Button>
      </div>

      <div className="mt-4 text-sm text-green-700 text-center">
        Press ENTER to continue
      </div>
    </div>
  );
}