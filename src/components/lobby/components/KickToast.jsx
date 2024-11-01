// components/lobby/components/KickToast.jsx
import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useLobby } from '../context';

export function KickToast() {
  const { kickMessage, setKickMessage } = useLobby();

  useEffect(() => {
    if (kickMessage) {
      // Clear kick message after 3 seconds
      const timer = setTimeout(() => {
        setKickMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [kickMessage]);

  if (!kickMessage) return null;

  return (
    <div className="fixed top-4 right-4 max-w-md bg-red-900 border border-red-500 p-4 rounded shadow-lg animate-slideIn">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <span className="text-red-200">{kickMessage}</span>
      </div>
    </div>
  );
}