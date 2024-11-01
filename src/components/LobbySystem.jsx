// components/LobbySystem.jsx
import React from 'react';
import { LobbyProvider } from './lobby/context';
import { Screen, Regions } from './lobby/utils/constants';
import { WelcomeScreen } from './lobby/screens/WelcomeScreen';
import { MainScreen } from './lobby/screens/MainScreen';
import { ConfigScreen } from './lobby/screens/ConfigScreen';
import { LobbyScreen } from './lobby/screens/LobbyScreen';
import { ErrorToast, LoadingOverlay } from './lobby/components';
import { useKeyboardShortcuts, useLobbyRefresh } from './lobby/hooks';
import { useLobby } from './lobby/context';

function LobbySystemContent() {
  const { 
    screen, 
    error, 
    loading, 
    region 
  } = useLobby();

  // Initialize keyboard shortcuts and lobby refresh
  useKeyboardShortcuts();
  useLobbyRefresh();

  return (
    <div className="min-h-screen bg-black text-green-500 p-4 font-mono">
      <div className="max-w-2xl mx-auto">
        <ErrorToast error={error} />
        <LoadingOverlay loading={loading} />

        {/* Screen Routing */}
        {screen === Screen.WELCOME && <WelcomeScreen />}
        {screen === Screen.MAIN && <MainScreen />}
        {screen === Screen.CONFIG && <ConfigScreen />}
        {screen === Screen.LOBBY && <LobbyScreen />}

        {/* Footer */}
        <div className="mt-4 text-center text-green-700 text-sm">
          DOS Lobby System v1.0 | Region: {Regions[region]}
        </div>
      </div>
    </div>
  );
}

export default function LobbySystem() {
  return (
    <LobbyProvider>
      <LobbySystemContent />
    </LobbyProvider>
  );
}
