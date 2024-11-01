import React, { useState, useEffect } from 'react';
import { LobbyProvider } from './lobby/context';
import { Screen, Regions } from './lobby/utils/constants';
import { WelcomeScreen } from './lobby/screens/WelcomeScreen';
import { MainScreen } from './lobby/screens/MainScreen';
import { ConfigScreen } from './lobby/screens/ConfigScreen';
import { LobbyScreen } from './lobby/screens/LobbyScreen';
import { ErrorToast, LoadingOverlay } from './lobby/components';
import { useKeyboardShortcuts } from './lobby/hooks';
import { useLobby } from './lobby/context';
import DOSEffects from './lobby/components/DOSEffects';

const bootMessages = [
  {
    text: "Starting MS-DOS Lobby System...",
    minSpeed: 30,
    maxSpeed: 50
  },
  {
    text: "HIMEM is testing extended memory... ",
    minSpeed: 30,
    maxSpeed: 40,
    append: "OK"
  },
  {
    text: "Loading SYSTEM.DAT... ",
    minSpeed: 25,
    maxSpeed: 30,
    append: "OK"
  },
  {
    text: "Loading network drivers..."
  },
  {
    text: "NETWORK.SYS loaded... ",
    minSpeed: 30,
    maxSpeed: 45,
    append: "OK"
  },
  {
    text: "TCPIP.SYS loaded... ",
    minSpeed: 25,
    maxSpeed: 60,
    append: "OK"
  },
  {
    text: "Initializing lobby system..."
  },
  {
    text: "Checking for active servers... ",
    minSpeed: 25,
    maxSpeed: 40,
    append: "FOUND"
  },
  {
    text: "Establishing connection... ",
    minSpeed: 30,
    maxSpeed: 50,
    append: "OK"
  },
  {
    text: "Loading COMMAND.COM... ",
    minSpeed: 15,
    maxSpeed: 30,
    append: "OK"
  },
  {
    text: "DOS Lobby System Ready.",
    minSpeed: 40,
    maxSpeed: 60
  }
];

const useCommandHistory = () => {
  const [history, setHistory] = useState([]);
  const [index, setIndex] = useState(-1);

  const addCommand = (command) => {
    if (command.trim()) {
      setHistory(prev => [...prev, command]);
      setIndex(-1);
    }
  };

  const navigateHistory = (direction) => {
    if (direction === 'up' && index < history.length - 1) {
      setIndex(prev => prev + 1);
      return history[history.length - 1 - index - 1];
    }
    if (direction === 'down' && index >= 0) {
      setIndex(prev => prev - 1);
      return index === 0 ? '' : history[history.length - 1 - index + 1];
    }
    return null;
  };

  return { addCommand, navigateHistory };
};

function CommandPrompt({ currentScreen, onCommand, className }) {
  const [command, setCommand] = useState('');
  const { navigateHistory, addCommand } = useCommandHistory();

  const handleSubmit = (value) => {
    addCommand(value);
    onCommand(value);
    setCommand('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const historicalCommand = navigateHistory(e.key === 'ArrowUp' ? 'up' : 'down');
      if (historicalCommand !== null) {
        setCommand(historicalCommand);
      }
      e.preventDefault();
    }
  };

  return (
    <div className={className}>
      <DOSEffects.CommandInput
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        prompt={`C:\\LOBBY\\${currentScreen.toUpperCase()}>`}
      />
    </div>
  );
}

function BootScreen({ onComplete }) {
  return (
    <div className="min-h-screen bg-black text-green-500 p-8 font-mono">
      <DOSEffects.Scanlines intensity="medium" />
      <DOSEffects.PhosphorGlow />
      <div className="max-w-2xl mx-auto mt-20">
        <DOSEffects.BootSequence
          messages={bootMessages}
          onComplete={onComplete}
          minDisplayTime={1000}
        />
      </div>
    </div>
  );
}

function LobbySystemContent() {
  const {
    screen,
    error,
    loading,
    region,
    setScreen,
    playerName
  } = useLobby();

  const [isBooting, setIsBooting] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [showCommandLine, setShowCommandLine] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isBooting) {
      const bootSound = new Audio('/api/placeholder/audio');
      bootSound.volume = 0.3;
      bootSound.play().catch(() => {});
    }
  }, [isBooting]);

  useEffect(() => {
    setShowCommandLine(screen !== Screen.WELCOME);
  }, [screen]);

  const handleCommand = (command) => {
    const cmd = command.toLowerCase().trim();
    switch (cmd) {
      case 'clear':
      case 'exit':
        setScreen(Screen.WELCOME);
        break;
      case 'host':
        setScreen(Screen.CONFIG);
        break;
      case 'main':
        setScreen(Screen.MAIN);
        break;
    }
  };

  if (isBooting) {
    return <BootScreen onComplete={() => setIsBooting(false)} />;
  }

  const renderCurrentScreen = () => {
    switch (screen) {
      case Screen.WELCOME:
        return <WelcomeScreen />;
      case Screen.MAIN:
        return <MainScreen />;
      case Screen.CONFIG:
        return <ConfigScreen />;
      case Screen.LOBBY:
        return <LobbyScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 p-4 font-mono">
      <DOSEffects.Scanlines intensity="medium" />
      <DOSEffects.PhosphorGlow />

      <div className="max-w-2xl mx-auto pb-16">
        <ErrorToast error={error} />
        <LoadingOverlay loading={loading} />

        {/* Main Content Area */}
        <div className="min-h-[400px] transition-opacity duration-300">
          {renderCurrentScreen()}
        </div>

        {/* Command Line Interface */}
        {showCommandLine && (
          <CommandPrompt
            currentScreen={screen}
            onCommand={handleCommand}
            className="mt-4 border-t border-green-500 pt-2"
          />
        )}
      </div>

      {/* Status Bar */}
      <DOSEffects.StatusBar
        className="fixed bottom-0 left-0 right-0"
        left="DOS Networker v1.0"
        center={playerName ? `User: ${playerName}` : 'Not logged in'}
        right={`${Regions[region]} | ${currentTime}`}
      />
    </div>
  );
}

function LobbySystem() {
  return (
    <LobbyProvider>
      <LobbySystemContent />
    </LobbyProvider>
  );
}

export default LobbySystem;