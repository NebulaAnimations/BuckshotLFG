// components/lobby/components/Select.jsx
import React from 'react';

export function Select({ 
  label, 
  value, 
  onChange, 
  options,
  error,
  className = '',
  ...props 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-black border border-green-500 p-2 
                   focus:outline-none focus:border-green-400
                   ${error ? 'border-red-500' : ''}`}
        value={value}
        onChange={onChange}
        {...props}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error && (
        <div className="mt-1 text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}