// components/lobby/context/LobbyContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { Screen } from '../utils/constants';

const LobbyContext = createContext(null);

export function LobbyProvider({ children }) {
  const [screen, setScreen] = useState(Screen.WELCOME);
  const [playerName, setPlayerName] = useState('');
  const [region, setRegion] = useState('NA');
  const [currentLobby, setCurrentLobby] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lobbies, setLobbies] = useState([]);
  const [codeCopied, setCodeCopied] = useState(false);

  const [lobbyConfig, setLobbyConfig] = useState({
    gameCode: '',
    maxPlayers: 4,
    voiceRequirement: 'optional',
    discordLink: ''
  });

  const value = {
    screen, setScreen,
    playerName, setPlayerName,
    region, setRegion,
    currentLobby, setCurrentLobby,
    error, setError,
    loading, setLoading,
    lobbies, setLobbies,
    codeCopied, setCodeCopied,
    lobbyConfig, setLobbyConfig
  };

  return (
    <LobbyContext.Provider value={value}>
      {children}
    </LobbyContext.Provider>
  );
}

export const useLobby = () => {
  const context = useContext(LobbyContext);
  if (!context) {
    throw new Error('useLobby must be used within a LobbyProvider');
  }
  return context;
};