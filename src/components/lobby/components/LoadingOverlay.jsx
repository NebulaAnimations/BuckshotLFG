// components/lobby/components/LoadingOverlay.jsx
import React from 'react';

export function LoadingOverlay({ loading }) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-black border border-green-500 p-4">
        <div className="animate-pulse">Processing command...</div>
      </div>
    </div>
  );
}