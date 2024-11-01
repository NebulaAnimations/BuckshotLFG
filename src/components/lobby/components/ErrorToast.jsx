// components/lobby/components/ErrorToast.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

export function ErrorToast({ error }) {
  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 max-w-md bg-red-900 border border-red-500 p-4 rounded shadow-lg">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <span className="text-red-200">{error}</span>
      </div>
    </div>
  );
}
